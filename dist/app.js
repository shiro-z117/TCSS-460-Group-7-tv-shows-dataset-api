"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const tvShowRoutes_1 = require("./routes/open/tvShowRoutes");
const docsRoutes_1 = require("./routes/open/docsRoutes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Health (GET /health)
app.get('/health', (_req, res) => res.json({ status: 'API is running' }));
app.use(docsRoutes_1.docsRoutes, express_1.default.static(path_1.default.join(__dirname, './docs')));
// Mount open routes
app.use('/api', tvShowRoutes_1.tvShowRoutes);
exports.default = app;
