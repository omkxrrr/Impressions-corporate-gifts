import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import './models/index.js';
import productRoutes from './routes/products.js';
import { seedProducts } from './controllers/productController.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

import categoryRoutes from './routes/categories.js';
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('Impressions API is running...');
});

app.get('/seed', seedProducts);

const PORT = process.env.PORT || 5000;

// Start Server first so it doesn't crash on DB failure
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  
  // Try connecting to DB
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database connected and synced successfully! ✅');
  }).catch((err) => {
    console.error('Database connection failed ❌:', err.message);
  });
});
