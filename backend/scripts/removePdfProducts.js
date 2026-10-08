import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { sequelize } from '../config/db.js';
import { Product } from '../models/index.js';

dotenv.config();

const skusToRemove = ['FJ9218', 'IL4962', 'IX3306', 'AZ7689', 'IP1630'];

async function cleanup() {
  console.log('Connecting to database to remove PDF products...');
  
  try {
    for (const sku of skusToRemove) {
      const product = await Product.findOne({ where: { sku } });
      if (product) {
        await product.destroy();
        console.log(`Removed product with SKU: ${sku}`);
      } else {
        console.log(`Product with SKU ${sku} not found (already removed).`);
      }
    }
    console.log('✅ All PDF products removed successfully!');
  } catch (error) {
    console.error('Error removing products:', error.message);
  }
}

cleanup().then(() => process.exit(0));
