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
exports.getShows = getShows;
exports.getByGenre = getByGenre;
exports.getGenres = getGenres;
exports.getNetworks = getNetworks;
exports.getStatuses = getStatuses;
exports.getRandomShow = getRandomShow;
exports.getShowById = getShowById;
exports.getHealth = getHealth;
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
async function getShows(req, res, next) {
    try {
        const filters = {
            q: req.query.q,
            genre: req.query.genre,
            network: req.query.network,
            status: req.query.status,
            studio: req.query.studio,
            actor: req.query.actor,
            genre_id: req.query.genre_id,
            network_id: req.query.network_id,
            studio_id: req.query.studio_id,
            actor_id: req.query.actor_id,
            match: req.query.match || 'all',
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            sort: req.query.sort || 'id',
            order: req.query.order || 'asc'
        };
        const { shows, total, page, limit } = await db.getShows(filters);
        res.json({
            success: true,
            data: shows,
            page,
            limit,
            total
        });
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
async function getGenres(req, res, next) {
    try {
        const searchQuery = req.query.q || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const { genres, total } = await db.getGenres(searchQuery, page, limit);
        res.json({
            success: true,
            data: genres,
            page,
            limit,
            total
        });
    }
    catch (err) {
        next(err);
    }
}
async function getNetworks(req, res, next) {
    try {
        const searchQuery = req.query.q || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const { networks, total } = await db.getNetworks(searchQuery, page, limit);
        res.json({
            success: true,
            data: networks,
            page,
            limit,
            total
        });
    }
    catch (err) {
        next(err);
    }
}
async function getStatuses(_req, res, next) {
    try {
        const data = await db.getStatuses();
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
async function getRandomShow(_req, res, next) {
    try {
        const show = await db.getRandomShow();
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'No shows found'
            });
        }
        res.json({ success: true, data: show });
    }
    catch (err) {
        next(err);
    }
}
async function getShowById(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid show ID'
            });
        }
        const show = await db.getShowById(id);
        if (!show) {
            return res.status(404).json({
                success: false,
                message: 'Show not found'
            });
        }
        res.json({ success: true, data: show });
    }
    catch (err) {
        next(err);
    }
}
// Coco's endpoint: GET /api/health
// Returns service and database health status
async function getHealth(req, res, next) {
    try {
        // Call database function
        const health = await db.getHealth();
        // Return health status
        res.json(health);
    }
    catch (err) {
        next(err);
    }
}
