// src/controllers/tvShowController.ts
import { Request, Response, NextFunction } from 'express';
import * as db from '../db/queries.js'; // <-- .js required

export async function list(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await db.getAllShows();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function getByGenre(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await db.getShowsByGenre(req.params.genre);
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

// Linda's controller function for GET /api/studios
export async function getStudios(req: Request, res: Response, next: NextFunction) {
    try {
        const q = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        
        const data = await db.getStudios(q, page, limit);
        res.json({ success: true, data, page, limit, total: data.length });
    } catch (err) { next(err); }
}

