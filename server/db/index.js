import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DATABASE_URL in environment variables.');
}

const isLocal =
  connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const useSsl = process.env.DB_SSL === 'true' || (!isLocal && process.env.DB_SSL !== 'false');

export const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000
});

export const query = (text, params) => pool.query(text, params);
