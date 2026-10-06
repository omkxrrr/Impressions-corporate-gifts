import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Assuming default local postgres connection if env variables are missing
const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/impressions';

export const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});
