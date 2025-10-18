// routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';
import {
    // pagination & common
    listValidator,
    validate,

    // search / filters / id
    filterByYearRangeValidator,

    // random
    randomTenValidator,
} from '../../core/middleware/tvShowValidation';

export const tvShowRoutes = Router();

/**
 * ORDER MATTERS:
 * - Put specific paths first (/search, /filter/*) and param routes (:id) after them.
 */

// GET /api/tvshows  (paginated list)
tvShowRoutes.get('/tvshows', listValidator, validate, TV.list);

// GET /api/tvshows/filter/year?start_year=YYYY&end_year=YYYY  (filter by year range)
tvShowRoutes.get('/tvshows/filter/year', filterByYearRangeValidator, validate, TV.filterByYearRange);

// GET /api/tvshows/random[?limit=N]  (10 random by default; optional limit)
tvShowRoutes.get('/tvshows/random', randomTenValidator, validate, TV.randomTen);


