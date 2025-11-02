// src/app.ts
import path from 'path'
import express from 'express';
import { tvShowRoutes } from './routes/open/tvShowRoutes';
import { docsRoutes } from './routes/open/docsRoutes';
import { handleMalformedJson } from "./core/middleware/handleMalformedJson";

const app = express();
app.use(express.json());
app.use(handleMalformedJson);

// Health (GET /health)
app.get('/health', (_req, res) => res.json({ status: 'API is running' }));

// Documentation
app.use(docsRoutes, express.static(path.join(__dirname, './docs')));

// Mount open routes
app.use('/api', tvShowRoutes);


export default app;
