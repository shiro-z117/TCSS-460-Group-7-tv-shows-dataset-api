// src/app.ts
import express from 'express';
import { tvShowRoutes } from './routes/open/tvShowRoutes';

const app = express();
app.use(express.json());

// Health (GET /health)
app.get('/health', (_req, res) => res.json({ status: 'API is running' }));

// Mount open routes
app.use('/api', tvShowRoutes);

export default app;
