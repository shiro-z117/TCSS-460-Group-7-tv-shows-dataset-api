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
exports.list = list;
exports.getByGenre = getByGenre;
exports.getStudios = getStudios;
exports.getYearsFirst = getYearsFirst;
exports.getYearsLast = getYearsLast;
const db = __importStar(require("../db/queries.js")); // <-- .js required
async function list(_req, res, next) {
    try {
        const data = await db.getAllShows();
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
async function getByGenre(req, res, next) {
    try {
        const data = await db.getShowsByGenre(req.params.genre);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
// Linda's controller function for GET /api/studios
async function getStudios(req, res, next) {
    try {
        const q = req.query.q;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const data = await db.getStudios(q, page, limit);
        res.json({ success: true, data, page, limit, total: data.length });
    }
    catch (err) {
        next(err);
    }
}
// Linda's endpoint: GET /api/years/first
async function getYearsFirst(req, res, next) {
    try {
        // Extract query parameters from URL
        // Example: /api/years/first?min=2000&max=2020&page=1&limit=50
        const min = req.query.min ? parseInt(req.query.min) : undefined;
        // If min provided, convert string to number, else undefined
        const max = req.query.max ? parseInt(req.query.max) : undefined;
        // If max provided, convert string to number, else undefined
        const page = parseInt(req.query.page) || 1;
        // Convert page to number, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 50;
        // Convert limit to number, default to 50 if not provided
        // Call database function with parameters
        const data = await db.getYearsFirst(min, max, page, limit);
        // Convert year strings to numbers
        const years = data.map((row) => parseInt(row.year));
        // Send response back to client;  Return converted years array as data
        res.json({ success: true, data: years, page, limit, total: years.length });
        // Returns: { success: true, data: [2025, 2024, ...], page: 1, limit: 50, total: 50 }
    }
    catch (err) {
        next(err);
    }
    // If anything fails, pass error to next middleware
}
// Linda's endpoint: GET /api/years/last
// Returns distinct last air years with min/max filter
async function getYearsLast(req, res, next) {
    // req = incoming request, res = response to send, next = error handler
    try {
        // TRY BLOCK = if something fails, catch it below
        const min = req.query.min ? parseInt(req.query.min) : undefined;
        // Get min parameter from URL, convert to number, or undefined if not provided
        const max = req.query.max ? parseInt(req.query.max) : undefined;
        // Get max parameter from URL, convert to number, or undefined if not provided
        const page = parseInt(req.query.page) || 1;
        // Get page parameter, convert to number, default 1
        const limit = parseInt(req.query.limit) || 50;
        // Get limit parameter, convert to number, default 50
        const data = await db.getYearsLast(min, max, page, limit);
        // Call database function, wait for results
        // Convert year strings to numbers
        const years = data.map((row) => parseInt(row.year));
        // Loop through each row, convert year string to number
        res.json({ success: true, data: years, page, limit, total: years.length });
        // Send response: success flag, converted years array, pagination info, total count
    }
    catch (err) {
        next(err);
    }
    // CATCH BLOCK = if any error above, pass to error handler
}
