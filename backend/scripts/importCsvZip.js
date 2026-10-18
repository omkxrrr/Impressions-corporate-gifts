import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
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

      // 3. Prepare Features & Auto-detect Brand
      let features = p.Features ? String(p.Features).split('|').map(f => f.trim()) : [];
      
      // Helper to detect brand automatically
      function detectBrand(item) {
        if (item.Brand && String(item.Brand).trim()) {
          return String(item.Brand).trim();
        }
        if (features && Array.isArray(features)) {
          for (const f of features) {
            const m = String(f).match(/^(?:Brand|Manufacturer)\s*[:=-]\s*(.+)$/i);
            if (m && m[1].trim()) return m[1].trim();
          }
        }
        const combined = `${item.Name || ''} ${item.SKU || ''} ${(features || []).join(' ')}`.toLowerCase();
        if (combined.includes('reebok') || /^in(cn|ps|tt)/i.test(item.SKU || '')) return 'Reebok';
        if (combined.includes('scott') || /^sp-\d+/i.test(item.SKU || '')) return 'Scott International';
        if (combined.includes('rare rabbit') || combined.includes('rarerabbit') || /^rr-/i.test(item.SKU || '')) return 'Rare Rabbit';
        if (combined.includes('jack & jones') || combined.includes('jack and jones') || combined.includes('jack jones') || /^jj-/i.test(item.SKU || '')) return 'Jack & Jones';
        if (combined.includes('monte carlo') || /^mc-/i.test(item.SKU || '')) return 'Monte Carlo';
        if (combined.includes('benetton') || combined.includes('ucb')) return 'UCB (Benetton)';
        if (combined.includes('french connection') || combined.includes('fcuk') || /^fc-/i.test(item.SKU || '')) return 'French Connection';
        if (combined.includes('arrow') || /^arik|^asit/i.test(item.SKU || '')) return 'Arrow';
        if (combined.includes('adidas')) return 'Adidas';
        if (combined.includes('puma')) return 'Puma';
        if (combined.includes('nike')) return 'Nike';
        if (combined.includes('wildcraft')) return 'Wildcraft';
        if (combined.includes('levis') || combined.includes("levi's")) return "Levi's";
        if (combined.includes('tommy hilfiger')) return 'Tommy Hilfiger';

        // Check if name starts with a brand prefix before '-' or ':'
        const prefixMatch = String(item.Name || '').match(/^([A-Za-z0-9&'.\s]{2,25})\s*[-–:]\s*/);
        if (prefixMatch) {
          const cand = prefixMatch[1].trim();
          if (cand.length > 2 && !cand.match(/^(men|women|unisex|pure|classic|premium|cotton|poly)$/i)) {
            return cand;
          }
        }
        return 'Corporate Collection';
      }

      const detectedBrand = detectBrand(p);
      const hasBrandFeature = features.some(f => /^Brand\s*:/i.test(f));
      if (!hasBrandFeature && detectedBrand && detectedBrand !== 'Corporate Collection') {
        features.unshift(`Brand: ${detectedBrand}`);
      }
      
      // 4. Try parsing MRP from features string if available, or direct price column
      let price = null;
      if (p.Price && !isNaN(parseFloat(p.Price))) {
        price = parseFloat(p.Price);
      } else if (p.MRP && !isNaN(parseFloat(p.MRP))) {
        price = parseFloat(p.MRP);
      } else if (p.Features) {
        // Match: "MRP: 1699/-", "MRP: Rs. 1699", "MRP : Rs 1,699.00", "MRP - 2199", "MRP 1699"
        const mrpMatch = String(p.Features).match(/MRP\s*[:=-]?\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d+)?)/i);
        if (mrpMatch) {
          price = parseFloat(mrpMatch[1].replace(/,/g, ''));
        }
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
        brand: detectedBrand,
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

  // 6. Automatically sync complete product catalog to public/brands_products.json
  try {
    console.log("\nExporting updated catalogue to frontend public/brands_products.json...");
    const allProducts = await Product.findAll({ order: [['id', 'ASC']] });
    const publicJsonPath = path.resolve(ROOT_DIR, '..', 'public', 'brands_products.json');
    fs.writeFileSync(publicJsonPath, JSON.stringify(allProducts, null, 2), 'utf-8');
    console.log(`Successfully synced ${allProducts.length} products to public/brands_products.json for Vercel/production!`);
    
    // 7. Auto-commit and push to Git so Vercel builds immediately
    try {
      console.log("\n==================================================");
      console.log("Auto-syncing to GitHub / Vercel...");
      const gitRoot = path.resolve(ROOT_DIR, '..');
      
      execSync('git add public/brands_products.json', { cwd: gitRoot, stdio: 'inherit' });
      const diffOutput = execSync('git diff --cached --name-only', { cwd: gitRoot }).toString().trim();
      
      if (diffOutput) {
        console.log("Committing changes...");
        execSync(`git commit -m "Auto-import brand catalog update (${allProducts.length} products)"`, { cwd: gitRoot, stdio: 'inherit' });
        console.log("Pushing to remote origin main...");
        execSync('git push origin main', { cwd: gitRoot, stdio: 'inherit' });
        console.log("SUCCESS: Catalog pushed to GitHub! Vercel is now deploying your new brand products live.");
      } else {
        console.log("Catalog was already up-to-date in Git. No push needed.");
      }
      console.log("==================================================\n");
    } catch (gitErr) {
      console.warn("Notice: Git auto-push skipped or encountered an issue:", gitErr.message);
      console.log("You can manually run: git add . && git commit -m 'update catalog' && git push");
    }
  } catch (exportErr) {
    console.warn("Warning: Could not auto-sync public/brands_products.json:", exportErr.message);
  }

  process.exit(0);
}

run().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
