// controllers/tvShowController.ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../core/utilities/database';
import { paginateMeta } from '../core/utilities/responseUtils';
import { getRandomShows } from '../db/queries.js'; // ✅ import from your queries file
const TABLE = 'tv_shows';

// GET /tvshows
export async function list(req: Request, res: Response, next: NextFunction) {
    try {
        const page  = Number(req.query.page)  || 1;
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const offset = (page - 1) * limit;

        const listQ = `
      SELECT id, name, original_name, first_air_date, last_air_date,
             seasons, episodes, status, genres, overview,
             popularity, tmdb_rating, vote_count
      FROM ${TABLE}
      ORDER BY id ASC
      LIMIT $1 OFFSET $2`;
        const countQ = `SELECT COUNT(*)::int AS count FROM ${TABLE}`;

        const [listR, countR] = await Promise.all([
            db.query(listQ, [limit, offset]),
            db.query(countQ)
        ]);

        const total = countR.rows[0]?.count ?? 0;
        return res.json({ success: true, data: listR.rows, pagination: paginateMeta(page, limit, total) });
    } catch (e) { next(e); }
}

// GET /tvshows/filter/year
export async function filterByYearRange(req: Request, res: Response, next: NextFunction) {
    try {
        const start = Number(req.query.start_year);
        const end   = Number(req.query.end_year);
        const page  = Number(req.query.page)  || 1;
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const offset = (page - 1) * limit;

        const where = `WHERE EXTRACT(YEAR FROM first_air_date) BETWEEN $1 AND $2`;
        const params = [start, end];

        const listQ = `
      SELECT id, name, original_name, first_air_date, last_air_date,
             seasons, episodes, status, genres, overview,
             popularity, tmdb_rating, vote_count
      FROM ${TABLE}
      ${where}
      ORDER BY first_air_date ASC
      LIMIT $3 OFFSET $4`;
        const countQ = `SELECT COUNT(*)::int AS count FROM ${TABLE} ${where}`;

        const [listR, countR] = await Promise.all([
            db.query(listQ, [...params, limit, offset]),
            db.query(countQ, params)
        ]);

        const total = countR.rows[0]?.count ?? 0;
        return res.json({ success: true, data: listR.rows, pagination: paginateMeta(page, limit, total) });
    } catch (e) { next(e); }
}
export async function randomTen(_req: Request, res: Response, next: NextFunction) {
    try {
        // ✅ call the shared query function instead of writing SQL here
        const data = await getRandomShows(10);

        // ✅ return structured JSON, same as other routes
        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (e) {
        next(e); // handles errors with your global error middleware
    }
}
