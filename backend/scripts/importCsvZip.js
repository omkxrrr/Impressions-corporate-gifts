import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { sequelize } from '../config/db.js';
import { Product, Category } from '../models/index.js';

dotenv.config();

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

const ROOT_DIR = process.cwd();
const TMP_DIR = path.join(ROOT_DIR, 'tmp', 'zip-import');
const EXCEL_PATH = path.join(ROOT_DIR, 'data.xlsx');
const ZIP_PATH = path.join(ROOT_DIR, 'images.zip');

if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

async function uploadImageToSupabase(sku, fileName, fileBuffer) {
  const remotePath = `catalogue/${sku}/${fileName}`;
  const { error } = await supabase.storage.from('products').upload(remotePath, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: true
  });
  
  if (error) throw error;
  const { data } = supabase.storage.from('products').getPublicUrl(remotePath);
  return data.publicUrl;
}

async function run() {
  console.log("Checking for data.xlsx and images.zip...");
  if (!fs.existsSync(EXCEL_PATH) || !fs.existsSync(ZIP_PATH)) {
    console.error("Error: Please make sure 'data.xlsx' and 'images.zip' are placed inside the 'backend' folder.");
    process.exit(1);
  }

  console.log("Syncing Database...");
  await sequelize.sync({ alter: true });

  console.log("Extracting ZIP file...");
  const zip = new AdmZip(ZIP_PATH);
  zip.extractAllTo(TMP_DIR, true);
  console.log("Extraction complete.");

  console.log("Parsing Excel file...");
  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const products = xlsx.utils.sheet_to_json(worksheet);

  console.log(`Found ${products.length} products in Excel. Starting import...`);
  
  let success = 0;
  let errors = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`Processing ${p.SKU} - ${p.Name}...`);
    try {
      // 1. Upload Images
      let publicUrls = [];
      if (p.Images) {
        const imageNames = String(p.Images).split(',').map(img => img.trim());
        for (const imgName of imageNames) {
          // Find file recursively in TMP_DIR
          function findFile(dir, targetName) {
            let result = null;
            const files = fs.readdirSync(dir);
            for (let f of files) {
              const fullPath = path.join(dir, f);
              if (fs.statSync(fullPath).isDirectory()) {
                result = findFile(fullPath, targetName);
                if (result) break;
              } else if (f.toLowerCase() === targetName.toLowerCase()) {
                result = fullPath;
                break;
              }
            }
            return result;
          }

          const localImagePath = findFile(TMP_DIR, imgName);
          
          if (localImagePath && fs.existsSync(localImagePath)) {
            const buffer = fs.readFileSync(localImagePath);
            const url = await uploadImageToSupabase(p.SKU, imgName, buffer);
            publicUrls.push(url);
          } else {
            console.warn(`Warning: Image ${imgName} not found in zip for SKU ${p.SKU}`);
          }
        }
      }

      // 2. Find or Create Category
      const categoryName = p.Category || 'Uncategorized';
      let cat = await Category.findOne({ where: { name: categoryName } });
      if (!cat) {
        cat = await Category.create({ 
            name: categoryName, 
            slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
        });
      }

      // 3. Prepare Features
      let features = p.Features ? String(p.Features).split('|').map(f => f.trim()) : [];
      
      // 4. Try parsing MRP from features string if available
      let price = null;
      const mrpMatch = p.Features ? String(p.Features).match(/MRP\s*:\s*Rs\.?\s*([\d.]+)/i) : null;
      if (mrpMatch) {
        price = parseFloat(mrpMatch[1]);
      }

      // 5. DB Upsert
      let existing = null;
      let skuToUse = p.SKU ? String(p.SKU).trim() : null;
      
      if (skuToUse) {
        existing = await Product.findOne({ where: { sku: skuToUse } });
      } else {
        // Generate a random SKU if none provided so they don't overwrite each other
        skuToUse = `PROD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      }

      const productData = {
        sku: skuToUse,
        name: p.Name || 'Unknown Product',
        slug: (p.Name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + skuToUse.toLowerCase(),
        categoryId: cat.id,
        description: p.Description || '',
        shortDescription: (p.Description || '').substring(0, 100),
        features: features,
        price: price,
        images: publicUrls.length > 0 ? publicUrls : (existing ? existing.images : []),
      };

      if (existing) {
          await existing.update(productData);
      } else {
          await Product.create(productData);
      }
      success++;
    } catch (err) {
      console.error(`Failed to process ${p.SKU}: ${err.message}`);
      errors.push({ sku: p.SKU, error: err.message });
    }
  }

  console.log(`\nImport Complete! Successfully imported: ${success}/${products.length}`);
  if (errors.length > 0) {
    console.log("Errors:");
    console.log(errors);
  }
  process.exit(0);
}

run().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
