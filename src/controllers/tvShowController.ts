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

