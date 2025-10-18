// core/utilities/database.ts
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.PGSSLMODE || 'require') === 'require' ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30_000,
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
    pool,
};
