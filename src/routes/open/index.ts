// routes/open/index.ts
import { Router } from 'express';
import { apiKeyAuth } from '../../core/middleware/apiKeyAuth';
import { tvShowRoutes } from './tvShowRoutes';
import { docsRoutes } from './docsRoutes';


export const openRouter = Router();
openRouter.use(tvShowRoutes);

openRouter.use(docsRoutes);

openRouter.use('/api', tvShowRoutes);