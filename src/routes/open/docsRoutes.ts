// src/routes/open/docsRoutes.ts
import { Router } from 'express';
import path from 'path';
import fs from 'fs';

export const docsRoutes = Router();

// Absolute paths to the docs folder & files (works from dist too)
const DOCS_DIR = path.join(process.cwd(), 'docs');
const INDEX_HTML = path.join(DOCS_DIR, 'index.html');
const SWAGGER_YAML = path.join(DOCS_DIR, 'swagger.yaml');

// GET /api-docs  -> serve docs/index.html
docsRoutes.get('/api-docs', (_req, res, next) => {
    fs.access(INDEX_HTML, fs.constants.R_OK, (err) => {
        if (err) return next(new Error('docs/index.html not found'));
        res.sendFile(INDEX_HTML);
    });
});

// (optional) GET /api-docs/swagger.yaml -> serve raw YAML
docsRoutes.get('/api-docs/swagger.yaml', (_req, res, next) => {
    fs.access(SWAGGER_YAML, fs.constants.R_OK, (err) => {
        if (err) return next(new Error('docs/swagger.yaml not found'));
        res.type('text/yaml').sendFile(SWAGGER_YAML);
    });
});

// (optional) serve any static assets in /docs under /api-docs/assets/*
docsRoutes.use('/api-docs/assets', (_req, res, next) => {
    next();
});
