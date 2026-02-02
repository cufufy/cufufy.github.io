import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import * as dotenv from 'dotenv';

// Ensure .env is loaded if running in a context where Astro doesn't load it automatically (e.g. scripts)
dotenv.config();

// Database connection configuration
// These should be set in your Hostinger VPS environment variables or .env file
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'link_bio',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema, mode: 'default' });
