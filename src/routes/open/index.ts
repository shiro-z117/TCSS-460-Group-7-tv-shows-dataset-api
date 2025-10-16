// routes/open/index.ts
import { Router } from 'express';
import { apiKeyAuth } from '../../core/middleware/apiKeyAuth';
import { tvShowRoutes } from './tvShowRoutes';

export const openRouter = Router();
openRouter.use(apiKeyAuth);
openRouter.use(tvShowRoutes);