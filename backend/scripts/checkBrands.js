import dotenv from 'dotenv';
import { sequelize } from '../config/db.js';
import { Product } from '../models/index.js';

dotenv.config();

async function check() {
  const products = await Product.findAll({ order: [['createdAt', 'DESC']], limit: 15 });
  console.log(products.map(p => ({
    name: p.name,
    features: p.features
  })));
  process.exit(0);
}
check();
