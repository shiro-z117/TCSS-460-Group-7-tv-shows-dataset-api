// src/routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';

export const tvShowRoutes = Router();


// GET /api/shows
tvShowRoutes.get('/shows', TV.list);

// GET /api/shows/by-genre/:genre
tvShowRoutes.get('/shows/by-genre/:genre', TV.getByGenre);

//Linda: GET /api/studios 
tvShowRoutes.get('/studios', TV.getStudios);

// Linda: GET /api/years/first
tvShowRoutes.get('/years/first', TV.getYearsFirst);

// Linda: GET /api/years/last
tvShowRoutes.get('/years/last', TV.getYearsLast);

// Linda: GET /api/seasons
tvShowRoutes.get('/seasons', TV.getSeasons);
