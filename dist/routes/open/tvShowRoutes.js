"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tvShowRoutes = void 0;
// src/routes/open/tvShowRoutes.ts
const express_1 = require("express");
const TV = __importStar(require("../../controllers/tvShowController"));
exports.tvShowRoutes = (0, express_1.Router)();
// GET /api/shows - Advanced search with filters, pagination, and sorting
exports.tvShowRoutes.get('/shows', TV.getShows);
// GET /api/shows/random - Get one random show
exports.tvShowRoutes.get('/shows/random', TV.getRandomShow);
// GET /api/shows/:id - Get show by ID
exports.tvShowRoutes.get('/shows/:id', TV.getShowById);
// GET /api/shows/by-genre/:genre
exports.tvShowRoutes.get('/shows/by-genre/:genre', TV.getByGenre);
// GET /api/genres
exports.tvShowRoutes.get('/genres', TV.getGenres);
// GET /api/networks
exports.tvShowRoutes.get('/networks', TV.getNetworks);
// GET /api/statuses
exports.tvShowRoutes.get('/statuses', TV.getStatuses);
// Shiannel: GET /api/health
exports.tvShowRoutes.get('/health', TV.getHealth);
