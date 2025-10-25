"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// core/utilities/database.ts
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: (process.env.PGSSLMODE || 'require') === 'require' ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
});
exports.db = {
    query: (text, params) => pool.query(text, params),
    pool,
};
