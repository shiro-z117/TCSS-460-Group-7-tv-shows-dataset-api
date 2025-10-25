"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsRoutes = void 0;
// src/routes/open/docsRoutes.ts
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.docsRoutes = (0, express_1.Router)();
// Absolute paths to the docs folder & files (works from dist too)
const DOCS_DIR = path_1.default.join(process.cwd(), 'docs');
const INDEX_HTML = path_1.default.join(DOCS_DIR, 'index.html');
const SWAGGER_YAML = path_1.default.join(DOCS_DIR, 'swagger.yaml');
// GET /api-docs  -> serve docs/index.html
exports.docsRoutes.get('/api-docs', (_req, res, next) => {
    fs_1.default.access(INDEX_HTML, fs_1.default.constants.R_OK, (err) => {
        if (err)
            return next(new Error('docs/index.html not found'));
        res.sendFile(INDEX_HTML);
    });
});
// (optional) GET /api-docs/swagger.yaml -> serve raw YAML
exports.docsRoutes.get('/api-docs/swagger.yaml', (_req, res, next) => {
    fs_1.default.access(SWAGGER_YAML, fs_1.default.constants.R_OK, (err) => {
        if (err)
            return next(new Error('docs/swagger.yaml not found'));
        res.type('text/yaml').sendFile(SWAGGER_YAML);
    });
});
// (optional) serve any static assets in /docs under /api-docs/assets/*
exports.docsRoutes.use('/api-docs/assets', (_req, res, next) => {
    next();
});
