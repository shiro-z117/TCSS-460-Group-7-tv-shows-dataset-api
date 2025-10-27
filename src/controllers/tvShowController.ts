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

export async function createShow(req: Request, res: Response, next: NextFunction) {
    try {
        const showData = {
            id: req.body.id,
            name: req.body.name,
            original_name: req.body.original_name || null,
            first_air_date: req.body.first_air_date || null,
            last_air_date: req.body.last_air_date || null,
            seasons: req.body.seasons || null,
            episodes: req.body.episodes || null,
            status: req.body.status || null,
            overview: req.body.overview || null,
            popularity: req.body.popularity || null,
            tmdb_rating: req.body.tmdb_rating || null,
            vote_count: req.body.vote_count || null,
            poster_url: req.body.poster_url || null,
            backdrop_url: req.body.backdrop_url || null
        };

        const newShow = await db.createShow(showData);

        res.status(201)
            .location(`/api/shows/${newShow.id}`)
            .json({
                success: true,
                data: newShow,
                message: 'Show created successfully'
            });
    } catch (err: any) {
        if (err.message === 'SHOW_EXISTS') {
            res.status(409).json({
                success: false,
                message: 'A show with this ID already exists'
            });
            return;
        }
        next(err);
    }
}

export async function deleteShow(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);

        // ID validation and existence check already done by middleware
        const deletedShow = await db.deleteShow(showId);

        res.status(200).json({
            success: true,
            data: { id: deletedShow.id },
            message: 'Show deleted successfully'
        });
    } catch (err: any) {
        next(err);
    }
}

export async function getShow(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);

        // Validate ID
        if (isNaN(showId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid show ID'
            });
            return;
        }

        // Get show
        const show = await db.getShowById(showId);

        if (!show) {
            res.status(404).json({
                success: false,
                message: 'Show not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: show
        });
    } catch (err) {
        next(err);
    }
}

export async function updateShow(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);

        // ID validation and existence check already done by middleware
        const updateData: any = {};

        // Build update object from request body
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.original_name !== undefined) updateData.original_name = req.body.original_name;
        if (req.body.first_air_date !== undefined) updateData.first_air_date = req.body.first_air_date;
        if (req.body.last_air_date !== undefined) updateData.last_air_date = req.body.last_air_date;
        if (req.body.seasons !== undefined) updateData.seasons = req.body.seasons;
        if (req.body.episodes !== undefined) updateData.episodes = req.body.episodes;
        if (req.body.status !== undefined) updateData.status = req.body.status;
        if (req.body.overview !== undefined) updateData.overview = req.body.overview;
        if (req.body.popularity !== undefined) updateData.popularity = req.body.popularity;
        if (req.body.tmdb_rating !== undefined) updateData.tmdb_rating = req.body.tmdb_rating;
        if (req.body.vote_count !== undefined) updateData.vote_count = req.body.vote_count;
        if (req.body.poster_url !== undefined) updateData.poster_url = req.body.poster_url;
        if (req.body.backdrop_url !== undefined) updateData.backdrop_url = req.body.backdrop_url;

        const updatedShow = await db.updateShow(showId, updateData);

        res.status(200).json({
            success: true,
            data: updatedShow,
            message: 'Show updated successfully'
        });
    } catch (err: any) {
        if (err.message === 'NO_FIELDS_TO_UPDATE') {
            res.status(400).json({
                success: false,
                message: 'At least one field must be provided to update'
            });
            return;
        }
        next(err);
    }
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

// Linda's endpoint: GET /api/years/first
export async function getYearsFirst(req: Request, res: Response, next: NextFunction) {
    try {
        // Extract query parameters from URL
        // Example: /api/years/first?min=2000&max=2020&page=1&limit=50
        const min = req.query.min ? parseInt(req.query.min as string) : undefined;
        // If min provided, convert string to number, else undefined
        
        const max = req.query.max ? parseInt(req.query.max as string) : undefined;
        // If max provided, convert string to number, else undefined
        
        const page = parseInt(req.query.page as string) || 1;
        // Convert page to number, default to 1 if not provided
        
        const limit = parseInt(req.query.limit as string) || 50;
        // Convert limit to number, default to 50 if not provided
        
        // Call database function with parameters
        const data = await db.getYearsFirst(min, max, page, limit);

          // Convert year strings to numbers
          const years = data.map((row: any) => parseInt(row.year));
        
        // Send response back to client;  Return converted years array as data
        res.json({ success: true, data: years, page, limit, total: years.length });
        // Returns: { success: true, data: [2025, 2024, ...], page: 1, limit: 50, total: 50 }
        
    } catch (err) { next(err); }
    // If anything fails, pass error to next middleware
}

// Linda's endpoint: GET /api/years/last
// Returns distinct last air years with min/max filter
export async function getYearsLast(req: Request, res: Response, next: NextFunction) {
    // req = incoming request, res = response to send, next = error handler
    
    try {
        // TRY BLOCK = if something fails, catch it below
        
        const min = req.query.min ? parseInt(req.query.min as string) : undefined;
        // Get min parameter from URL, convert to number, or undefined if not provided
        
        const max = req.query.max ? parseInt(req.query.max as string) : undefined;
        // Get max parameter from URL, convert to number, or undefined if not provided
        
        const page = parseInt(req.query.page as string) || 1;
        // Get page parameter, convert to number, default 1
        
        const limit = parseInt(req.query.limit as string) || 50;
        // Get limit parameter, convert to number, default 50
        
        const data = await db.getYearsLast(min, max, page, limit);
        // Call database function, wait for results
        
        // Convert year strings to numbers
        const years = data.map((row: any) => parseInt(row.year));
        // Loop through each row, convert year string to number
        
        res.json({ success: true, data: years, page, limit, total: years.length });
        // Send response: success flag, converted years array, pagination info, total count
        
    } catch (err) { next(err); }
    // CATCH BLOCK = if any error above, pass to error handler
}

// Linda's endpoint: GET /api/seasons
// Returns distinct season counts with optional bucketing
export async function getSeasons(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        // Get page parameter, default 1
        
        const limit = parseInt(req.query.limit as string) || 50;
        // Get limit parameter, default 50
        
        const buckets = req.query.buckets === 'true';
        // Check if user wants bucketed format (true/false)
        
        const data = await db.getSeasons(page, limit);
        // Call database to get season counts
        
        // Convert season objects to numbers
        let seasons = data.map((row: any) => parseInt(row.seasons));
        // seasons = [1, 2, 3, 4, ..., 69]
        
        // If buckets=true, group seasons into ranges
        if (buckets) {
            seasons = [
                // Group logic: 1 stays 1, 2-3 grouped, 4-6 grouped, 7+ all rest
                "1",
                "2–3",
                "4–6",
                "7+"
            ];
        }
        
        res.json({ success: true, data: seasons, page, limit, total: seasons.length });
        // Send response with seasons (bucketed or not)
        
    } catch (err) { next(err); }
    // If error, pass to error handler
}

