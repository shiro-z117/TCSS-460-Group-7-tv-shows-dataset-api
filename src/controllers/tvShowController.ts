// src/controllers/tvShowController.ts
import { Request, Response, NextFunction } from 'express';
import * as db from '../db/queries.js'; // <-- .js required

export async function list(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await db.getAllShows();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function getShows(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = {
            q: req.query.q as string,
            genre: req.query.genre as string,
            network: req.query.network as string,
            status: req.query.status as string,
            studio: req.query.studio as string,
            actor: req.query.actor as string,
            genre_id: req.query.genre_id as string,
            network_id: req.query.network_id as string,
            studio_id: req.query.studio_id as string,
            actor_id: req.query.actor_id as string,
            match: req.query.match as string || 'all',
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 20,
            sort: req.query.sort as string || 'id',
            order: req.query.order as string || 'asc'
        };

        const { shows, total, page, limit } = await db.getShows(filters);

        res.json({
            success: true,
            data: shows,
            page,
            limit,
            total
        });
    } catch (err) { next(err); }
}

export async function getByGenre(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await db.getShowsByGenre(req.params.genre);
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function getGenres(req: Request, res: Response, next: NextFunction) {
    try {
        const searchQuery = req.query.q as string || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const { genres, total } = await db.getGenres(searchQuery, page, limit);

        res.json({
            success: true,
            data: genres,
            page,
            limit,
            total
        });
    } catch (err) { next(err); }
}

export async function getNetworks(req: Request, res: Response, next: NextFunction) {
    try {
        const searchQuery = req.query.q as string || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const { networks, total } = await db.getNetworks(searchQuery, page, limit);

        res.json({
            success: true,
            data: networks,
            page,
            limit,
            total
        });
    } catch (err) { next(err); }
}

export async function getStatuses(_req: Request, res: Response, next: NextFunction) {
    try {
        const data = await db.getStatuses();
        res.json({ success: true, data });
    } catch (err) { next(err); }
}

export async function getRandomShow(_req: Request, res: Response, next: NextFunction) {
    try {
        const show = await db.getRandomShow();

        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'No shows found'
            });
        }

        res.json({ success: true, data: show });
    } catch (err) { next(err); }
}

export async function getShowById(req: Request, res: Response, next: NextFunction) {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid show ID'
            });
        }

        const show = await db.getShowById(id);

        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }

        res.json({ success: true, data: show });
    } catch (err) { next(err); }
}

// GET /api/health
// returns service and database health status
export async function getHealth(req: Request, res: Response, next: NextFunction) {
    try {
        // Call database function
        const health = await db.getHealth();

        // Return health status
        res.json(health);

    } catch (err) { next(err); }
}

// GET /api/shows/:id/images
// returns images for a specific show w optional type filter & pagination
export async function getShowImages(req: Request, res: Response, next: NextFunction) {
    try {
        // gets show ID from URL path
        const showId = parseInt(req.params.id as string);
        
        // gets optional type filter from query params
        const type = req.query.type as string;
        
        // gets pagination params (default: page 1, limit 20)
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        
        // validate show ID
        if (!showId || showId <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid show ID'
            });
        }
        
        // validate type if provided
        if (type && !['poster', 'backdrop'].includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid type. Use: poster or backdrop'
            });
        }
        
        // validate pagination params
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
            });
        }
        
        // calls db func
        const data = await db.getShowImages(showId, type, page, limit);
        
        // rturn response
        res.json({
            success: true,
            data,
            page,
            limit,
            total: data.length
        });
        
        } catch (err) { next(err); }
    }
    
// GET /api/shows/:id/cast
// returns cast members for a specific show with pagination
export async function getShowCast(req: Request, res: Response, next: NextFunction) {
    try {
        // gets show ID from URL path
        const showId = parseInt(req.params.id as string);
        
        // gets pagination params (default: page 1, limit 10, max 50)
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
        
        // validate show ID
        if (!showId || showId <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid show ID'
            });
        }
        
        // validate pagination params
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                error: 'Invalid pagination parameters. Page and limit must be >= 1'
            });
        }
        
        // calls db function
        const data = await db.getShowCast(showId, page, limit);
        
        // return response
        res.json({
            success: true,
            data,
            page,
            limit,
            total: data.length
        });
        
    } catch (err) { next(err); }

}
