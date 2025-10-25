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
// GET /api/shows
exports.tvShowRoutes.get('/shows', TV.list);
// GET /api/shows/by-genre/:genre
exports.tvShowRoutes.get('/shows/by-genre/:genre', TV.getByGenre);
//Linda: GET /api/studios 
exports.tvShowRoutes.get('/studios', TV.getStudios);
// Linda: GET /api/years/first
exports.tvShowRoutes.get('/years/first', TV.getYearsFirst);
// Linda: GET /api/years/last
exports.tvShowRoutes.get('/years/last', TV.getYearsLast);
