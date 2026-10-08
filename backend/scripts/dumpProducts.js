import dotenv from 'dotenv';
import { sequelize } from '../config/db.js';
import { Product } from '../models/index.js';

dotenv.config();

async function dump() {
  const products = await Product.findAll({ order: [['updatedAt', 'DESC']], limit: 10 });
  console.log(`------------ LATEST 10 PRODUCTS ------------`);
  products.forEach(p => {
    console.log(`SKU: ${p.sku} | Name: ${p.name}`);
  });
  console.log("----------------------------------------");
  process.exit(0);
}
dump();
