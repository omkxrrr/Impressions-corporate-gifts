import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Sequelize, DataTypes } from 'sequelize';

// Setup directories
const ROOT_DIR = process.cwd();
const TMP_DIR = path.join(ROOT_DIR, 'tmp', 'catalogue-import');
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Load env
dotenv.config();

import { sequelize } from '../config/db.js';
import { Product, Category } from '../models/index.js';

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

// Parse args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isCommit = args.includes('--commit');
const pagesArgIndex = args.indexOf('--pages');
let pagesToProcess = null;

if (pagesArgIndex !== -1 && args[pagesArgIndex + 1]) {
  pagesToProcess = args[pagesArgIndex + 1].split(',').map(Number);
}

let PDF_PATH = path.join(ROOT_DIR, '..', 'Adidas Catlogue 21.7_compressed.pdf');

async function extractTextFromPage(page) {
  const textContent = await page.getTextContent();
  return textContent.items.map(item => item.str).join('\n');
}

async function extractImagesFromPage(page, pdfLibInstance, sku) {
  const operatorList = await page.getOperatorList();
  const OPS = pdfLibInstance.OPS;
  if (!OPS) return [];
  
  const validImageTypes = [OPS.paintImageXObject, OPS.paintInlineImageXObject];
  let imagePaths = [];
  let imgIndex = 1;

  for (let i = 0; i < operatorList.fnArray.length; i++) {
    if (validImageTypes.includes(operatorList.fnArray[i])) {
      try {
        const imgName = operatorList.argsArray[i][0];
        const img = await page.objs.get(imgName);
        
        // Filter out small logos/icons
        if (img && img.width > 300 && img.height > 300) {
            const channels = img.data.length / (img.width * img.height);
            if (channels === 3 || channels === 4) {
                const skuDir = path.join(TMP_DIR, sku);
                if (!fs.existsSync(skuDir)) fs.mkdirSync(skuDir, { recursive: true });
                
                const outPath = path.join(skuDir, `${imgIndex}.webp`);
                await sharp(Buffer.from(img.data), {
                  raw: { width: img.width, height: img.height, channels: channels }
                }).webp({ quality: 80 }).toFile(outPath);
                
                imagePaths.push(outPath);
                imgIndex++;
            }
        }
      } catch(e) {}
    }
  }
  return imagePaths;
}

function parseProductInfo(text, pageNum) {
    let normalizedText = text.replace(/Ar[\x00-\x20]?cle/gi, 'Article').replace(/Co[\x00-\x20]?on/gi, 'Cotton');
    
    let sku = null;
    let name = "Adidas Product";
    let mrp = null, color = null, sizes = [], hsn = null, gst = null, material = null, category = "Uncategorized";
    
    const skuMatch = normalizedText.match(/Article No\.?\s*:?\s*([A-Z0-9]+)/i);
    if (skuMatch) sku = skuMatch[1].trim();
    
    const nameParts = normalizedText.split(/Article No/i);
    if (nameParts.length > 1 && nameParts[0].trim()) {
        name = nameParts[0].replace(/\n/g, ' ').trim();
    }
    
    const mrpMatch = normalizedText.match(/MRP\s*:?\s*[\u20B9Rs\. ]*([\d,]+)/i);
    if (mrpMatch) mrp = parseInt(mrpMatch[1].replace(/,/g, ''), 10);
    
    const colorMatch = normalizedText.match(/Color\s*:?\s*(.+)/i);
    if (colorMatch) color = colorMatch[1].trim();
    
    const hsnMatch = normalizedText.match(/HSN\s*Code\s*:?\s*(\d+)/i);
    if (hsnMatch) hsn = hsnMatch[1];
    
    const gstMatch = normalizedText.match(/GST\s*:?\s*(\d+)/i);
    if (gstMatch) gst = parseInt(gstMatch[1], 10);
    
    const sizeMatch = normalizedText.match(/Sizes.*?[:]\s*([A-Za-z0-9 ,&]+)/i);
    if (sizeMatch) {
        sizes = sizeMatch[1].split(/[,\s&]+/).filter(s => ['S','M','L','XL','XXL','XXXL'].includes(s.toUpperCase()));
    }
    
    const cottonMatch = normalizedText.match(/(\d+\s*%\s*Cotton[^\n]*)/i);
    if (cottonMatch) material = cottonMatch[1].replace(/\n/g, '').trim();
    
    const nameLower = name.toLowerCase();
    if (nameLower.includes('tshirt') || nameLower.includes('t-shirt')) category = nameLower.includes('polo') ? 'Polo T-Shirts' : 'T-Shirts';
    else if (nameLower.includes('cap')) category = 'Caps';
    else if (nameLower.includes('shorts')) category = 'Shorts';
    else if (nameLower.includes('track pant')) category = 'Track Pants';
    else if (nameLower.includes('socks')) category = 'Socks';
    
    const descLines = [
        name,
        material ? `Material: ${material}` : null,
        color ? `Color: ${color}` : null,
        sizes.length ? `Available sizes: ${sizes.join(', ')}` : null
    ].filter(Boolean);

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${sku ? sku.toLowerCase() : 'unknown'}`;

    return { sku, name, mrp, color, sizes, hsn, gst, material, description: descLines.join('\n'), shortDescription: name, slug, category, sourcePage: pageNum };
}

async function uploadImagesToSupabase(sku, imagePaths) {
  let uploadedUrls = [];
  for (let i = 0; i < imagePaths.length; i++) {
    const fileBuffer = fs.readFileSync(imagePaths[i]);
    const fileName = `catalogue/${sku}/${i + 1}.webp`;
    
    const { data, error } = await supabase.storage.from('products').upload(fileName, fileBuffer, {
      contentType: 'image/webp',
      upsert: true
    });
    
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName);
    uploadedUrls.push(publicUrlData.publicUrl);
  }
  return uploadedUrls;
}

async function run() {
  console.log(`Starting Import. Dry Run: ${isDryRun}, Commit: ${isCommit}`);
  
  if (isCommit) {
    console.log('Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
  }

  if (!fs.existsSync(PDF_PATH)) {
      const localPath = path.join(ROOT_DIR, 'Adidas Catlogue 21.7_compressed.pdf');
      if (fs.existsSync(localPath)) PDF_PATH = localPath;
      else { console.error("PDF not found!"); process.exit(1); }
  }

  if (!Promise.try) Promise.try = function (fn, ...args) { return new Promise((resolve) => resolve(fn(...args))); };

  const pdfData = new Uint8Array(fs.readFileSync(PDF_PATH));
  const pdfLibInstance = pdfjsLib.getDocument ? pdfjsLib : pdfjsLib.default;
  const doc = await pdfLibInstance.getDocument({ data: pdfData, standardFontDataUrl: 'pdfjs-dist/standard_fonts/' }).promise;
  const numPages = doc.numPages;
  console.log(`Total Pages: ${numPages}`);

  const pagesToRun = pagesToProcess || Array.from({length: numPages}, (_, i) => i + 1);
  let products = [], errors = [];

  for (const pageNum of pagesToRun) {
    if (pageNum > numPages) continue;
    console.log(`Processing page ${pageNum}...`);
    try {
        const page = await doc.getPage(pageNum);
        const text = await extractTextFromPage(page);
        const productInfo = parseProductInfo(text, pageNum);
        
        if (!productInfo.sku) {
            errors.push({ page: pageNum, status: 'failed', error: 'Missing SKU' });
            continue;
        }

        const imagePaths = await extractImagesFromPage(page, pdfLibInstance, productInfo.sku);
        productInfo.imageCount = imagePaths.length;
        productInfo.databaseStatus = "skipped";
        productInfo.imageUploadStatus = "skipped";
        productInfo.warnings = [];

        if (imagePaths.length === 0) productInfo.warnings.push("No valid images extracted");

        if (isCommit) {
            try {
                // Upload images
                console.log(`Uploading ${imagePaths.length} images for ${productInfo.sku}...`);
                const publicUrls = await uploadImagesToSupabase(productInfo.sku, imagePaths);
                productInfo.imageUploadStatus = "success";

                // Find or create Category
                let cat = await Category.findOne({ where: { name: productInfo.category } });
                if (!cat) {
                    cat = await Category.create({ 
                        name: productInfo.category, 
                        slug: productInfo.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
                    });
                }

                // DB Upsert
                const existing = await Product.findOne({ where: { sku: productInfo.sku } });
                const productData = {
                  ...productInfo,
                  categoryId: cat.id,
                  price: productInfo.mrp, // Also set price to mrp for frontend compatibility
                  images: publicUrls.length > 0 ? publicUrls : (existing ? existing.images : []),
                  features: productInfo.material ? [productInfo.material] : []
                };

                if (existing) {
                    await existing.update(productData);
                    productInfo.databaseStatus = "updated";
                } else {
                    await Product.create(productData);
                    productInfo.databaseStatus = "created";
                }
            } catch (dbErr) {
                console.error(`DB/Upload Error on page ${pageNum}:`, dbErr.message);
                productInfo.databaseStatus = "error";
                productInfo.warnings.push(dbErr.message);
            }
        }
        products.push(productInfo);
    } catch (err) {
        console.error(`Error on page ${pageNum}:`, err.message);
        errors.push({ page: pageNum, status: 'failed', error: err.message });
    }
  }
  
  const report = { summary: { pagesProcessed: pagesToRun.length, productsDetected: products.length, errors: errors.length }, products, errors };
  fs.writeFileSync(path.join(TMP_DIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log('Saved report to tmp/catalogue-import/report.json');
}

run().catch(err => console.error("Fatal error:", err));
