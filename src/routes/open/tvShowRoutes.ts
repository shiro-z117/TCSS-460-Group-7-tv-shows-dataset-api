// routes/open/tvShowRoutes.ts
import { Router } from 'express';
import * as TV from '../../controllers/tvShowController';
import {
  listValidator,
  filterByYearRangeValidator,
  validate
} from '../../core/middleware/tvShowValidation';

export const tvShowRoutes = Router();

// GET /api/tvshows
tvShowRoutes.get('/tvshows', listValidator, validate, TV.list);

// GET /api/tvshows/filter/year?start_year=YYYY&end_year=YYYY
tvShowRoutes.get('/tvshows/filter/year', filterByYearRangeValidator, validate, TV.filterByYearRange);

tvShowRoutes.get('/tvshows/random', randomTenValidator, validate, TV.randomTen);