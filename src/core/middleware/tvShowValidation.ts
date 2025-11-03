// core/middleware/tvShowValidation.ts
import { param, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from "../utilities/responseUtils";
import pool from '../../db/connection.js';


export const validateDeleteShow = [
    param("id")
        .notEmpty()
        .withMessage("Show ID is required")
        .isInt({ min: 1 })
        .withMessage("Show ID must be a positive integer")
        .toInt()
        .custom(async (id) => {
            const { rows } = await pool.query("SELECT id FROM tv_shows WHERE id = $1", [id]);
            if (rows.length === 0) {
                throw new Error("Show not found");
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const notFound = errors.array().some(err => err.msg === "Show not found");
            const status = notFound ? 404 : 400;
            return res.status(status).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateDeleteActor = [
    param("id")
        .notEmpty()
        .withMessage("Actor ID is required")
        .isInt({ min: 1 })
        .withMessage("Actor ID must be a positive integer")
        .toInt()
        .custom(async (id) => {
            const { rows } = await pool.query("SELECT id FROM actors WHERE id = $1", [id]);
            if (rows.length === 0) {
                throw new Error("Actor not found");
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const notFound = errors.array().some(err => err.msg === "Actor not found");
            const status = notFound ? 404 : 400;
            return res.status(status).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateDeleteNetwork = [
    param("id")
        .notEmpty()
        .withMessage("Network ID is required")
        .isInt({ min: 1 })
        .withMessage("Network ID must be a positive integer")
        .toInt()
        .custom(async (id) => {
            const { rows } = await pool.query("SELECT id FROM networks WHERE id = $1", [id]);
            if (rows.length === 0) {
                throw new Error("Network not found");
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const notFound = errors.array().some(err => err.msg === "Network not found");
            const status = notFound ? 404 : 400;
            return res.status(status).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateDeleteStudio = [
    param("id")
        .notEmpty()
        .withMessage("Studio ID is required")
        .isInt({ min: 1 })
        .withMessage("Studio ID must be a positive integer")
        .toInt()
        .custom(async (id) => {
            const { rows } = await pool.query("SELECT id FROM studios WHERE id = $1", [id]);
            if (rows.length === 0) {
                throw new Error("Studio not found");
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const notFound = errors.array().some(err => err.msg === "Studio not found");
            const status = notFound ? 404 : 400;
            return res.status(status).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

export const validateDeleteCreator = [
    param("id")
        .notEmpty()
        .withMessage("Creator ID is required")
        .isInt({ min: 1 })
        .withMessage("Creator ID must be a positive integer")
        .toInt()
        .custom(async (id) => {
            const { rows } = await pool.query("SELECT id FROM creators WHERE id = $1", [id]);
            if (rows.length === 0) {
                throw new Error("Creator not found");
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const notFound = errors.array().some(err => err.msg === "Creator not found");
            const status = notFound ? 404 : 400;
            return res.status(status).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateCreateShow = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string")
        .trim(),

    body("original_name")
        .notEmpty()
        .withMessage("Original name is required")
        .isString()
        .withMessage("Original name must be a string")
        .trim(),

    body("first_air_date")
        .notEmpty()
        .withMessage("First air date is required")
        .isISO8601()
        .withMessage("First air date must be a valid date (ISO 8601)"),

    body("last_air_date")
        .notEmpty()
        .withMessage("Last air date is required")
        .isISO8601()
        .withMessage("Last air date must be a valid date (ISO 8601)"),

    body("seasons")
        .notEmpty()
        .withMessage("Seasons is required")
        .isInt({ min: 1 })
        .withMessage("Seasons must be an integer >= 1"),

    body("episodes")
        .notEmpty()
        .withMessage("Episodes is required")
        .isInt({ min: 1 })
        .withMessage("Episodes must be an integer >= 1"),

    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .custom(async (statusValue) => {
            const { rows } = await pool.query("SELECT name FROM statuses");
            const validStatuses = rows.map((r) => r.name);
            if (!validStatuses.includes(statusValue)) {
                throw new Error(
                    `Invalid status. Valid values: ${validStatuses.join(", ")}`
                );
            }
            return true;
        }),

    body("overview")
        .optional({ nullable: true })
        .isString()
        .withMessage("Overview must be a string")
        .trim(),

    body("popularity")
        .optional({ nullable: true })
        .isFloat({ min: 0 })
        .withMessage("Popularity must be a non-negative number"),

    body("tmdb_rating")
        .optional({ nullable: true })
        .isFloat({ min: 0, max: 10 })
        .withMessage("TMDB rating must be between 0 and 10"),

    body("vote_count")
        .optional({ nullable: true })
        .isInt({ min: 0 })
        .withMessage("Vote count must be a non-negative integer"),

    body("poster_url")
        .optional({ nullable: true })
        .isString()
        .withMessage("Poster URL must be a string")
        .trim(),

    body("backdrop_url")
        .optional({ nullable: true })
        .isString()
        .withMessage("Backdrop URL must be a string")
        .trim(),

    body("genres")
        .isArray({ min: 1 })
        .withMessage("Genres must be an array with at least one value")
        .customSanitizer((genresArray: string[]) => genresArray.map(genre => genre.trim()))
        .custom(async (genresArray) => {
            const { rows } = await pool.query("SELECT genre_name FROM genres");
            const validGenres = rows.map((r) => r.genre_name);

            const seenGenres = new Set<string>();
            for (const genre of genresArray) {
                if (!validGenres.includes(genre)) {
                    throw new Error(`Invalid genre: ${genre}. Valid values: ${validGenres.join(", ")}`);
                }
                if (seenGenres.has(genre)) {
                    throw new Error(`Duplicate genre detected: ${genre}`);
                }
                seenGenres.add(genre);
            }
            return true;
        }),

    body("actors")
        .optional({ nullable: true })
        .isArray({ max: 10 })
        .withMessage("Actors must be an array with maximum 10 items")
        .customSanitizer((actorsArray: Array<{
            id?: number;
            actor_name?: string;
            character_name?: string;
        }>) => {
            return actorsArray.map(actor => ({
                ...actor,
                actor_name: actor.actor_name?.trim(),
                character_name: actor.character_name?.trim(),
            }));
        })
        .custom(async (actorsArray) => {
            for (const actor of actorsArray) {
                if (!actor.id && !actor.actor_name) {
                    throw new Error("Each actor must have either id or actor_name");
                }
                if (actor.id && typeof actor.id !== "number") {
                    throw new Error("Actor id must be an integer");
                }
                if (actor.actor_name && typeof actor.actor_name !== "string") {
                    throw new Error("Actor name must be a string");
                }
                if (actor.profile_url && typeof actor.profile_url !== "string") {
                    throw new Error("Actor profile_url must be a string");
                }
                if (!actor.character_name || typeof actor.character_name !== "string" || !actor.character_name.trim()) {
                    throw new Error("Each actor must include a valid 'character_name' (non-empty string)");
                }
            }
            return true;
        }),

    body("creators")
        .optional({ nullable: true })
        .isArray()
        .withMessage("Creators must be an array")
        .customSanitizer((creatorsArray: Array<{
            id?: number;
            creator_name?: string;
        }>) => {
            return creatorsArray.map(creator => ({
                ...creator,
                creator_name: creator.creator_name?.trim(),
            }));
        })
        .custom((creatorsArray) => {
            for (const creator of creatorsArray) {
                if (!creator.id && !creator.creator_name) {
                    throw new Error("Each creator must have either id or creator_name");
                }
                if (creator.id && typeof creator.id !== "number") {
                    throw new Error("Creator id must be an integer");
                }
                if (creator.creator_name && typeof creator.creator_name !== "string") {
                    throw new Error("Creator name must be a string");
                }
            }
            return true;
        }),

    body("networks")
        .optional({ nullable: true })
        .isArray()
        .withMessage("Networks must be an array")
        .customSanitizer((networksArray: Array<{
            id?: number;
            network_name?: string;
            logo_url?: string;
            country?: string;
        }>) => {
            return networksArray.map(network => ({
                ...network,
                network_name: network.network_name?.trim(),
                logo_url: network.logo_url?.trim(),
                country: network.country?.trim(),
            }));
        })
        .custom(async (networksArray) => {
            const { rows: countryRows } = await pool.query("SELECT country_code FROM countries");
            const validCountries = countryRows.map(r => r.country_code);

            for (const network of networksArray) {
                if (!network.id && !network.network_name) {
                    throw new Error("Each network must have either id or network_name");
                }
                if (network.id && typeof network.id !== "number") {
                    throw new Error("Network id must be an integer");
                }
                if (network.network_name && typeof network.network_name !== "string") {
                    throw new Error("Network name must be a string");
                }
                if (network.logo_url && typeof network.logo_url !== "string") {
                    throw new Error("Network logo_url must be a string");
                }
                if (network.country) {
                    if (typeof network.country !== "string") {
                        throw new Error("Network country must be a string");
                    }
                    if (!validCountries.includes(network.country)) {
                        throw new Error(`Invalid network country: "${network.country}". Valid values: ${validCountries.join(", ")}`);
                    }
                }
            }
            return true;
        }),

    body("studios")
        .optional({ nullable: true })
        .isArray()
        .withMessage("Studios must be an array")
        .customSanitizer((studiosArray: Array<{
            id?: number;
            studio_name?: string;
            logo_url?: string;
            country?: string;
        }>) => {
            return studiosArray.map(studio => ({
                ...studio,
                studio_name: studio.studio_name?.trim(),
                logo_url: studio.logo_url?.trim(),
                country: studio.country?.trim(),
            }));
        })
        .custom(async (studiosArray) => {
            const { rows: countryRows } = await pool.query("SELECT country_code FROM countries");
            const validCountries = countryRows.map(r => r.country_code);

            for (const studio of studiosArray) {
                if (!studio.id && !studio.studio_name) {
                    throw new Error("Each studio must have either id or studio_name");
                }
                if (studio.id && typeof studio.id !== "number") {
                    throw new Error("Studio id must be an integer");
                }
                if (studio.studio_name && typeof studio.studio_name !== "string") {
                    throw new Error("Studio name must be a string");
                }
                if (studio.logo_url && typeof studio.logo_url !== "string") {
                    throw new Error("Studio logo_url must be a string");
                }
                if (studio.country && !validCountries.includes(studio.country)) {
                    throw new Error(`Invalid studio country: ${studio.country}. Valid values: ${validCountries.join(", ")}`);
                }
            }
            return true;
        }),

    // Duplicate show check: name + original_name + status + first_air_date
    body().custom(async (value, { req }) => {
        const { name, original_name, status, first_air_date } = req.body;

        const { rows } = await pool.query(
            `SELECT 1
       FROM tv_shows
       WHERE name = $1
         AND original_name = $2
         AND status = $3
         AND first_air_date = $4`,
            [name, original_name, status, first_air_date]
        );

        if (rows.length > 0) {
            throw new Error(
                "Duplicate show: a show with the same name, original name, status, and first air date already exists"
            );
        }

        return true;
    }),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateCreateActor = [
    body("actor_name")
        .notEmpty()
        .withMessage("actor_name is required")
        .isString()
        .withMessage("actor_name must be a string")
        .trim()
        .custom(async (actor_name) => {
            const { rows } = await pool.query(
                "SELECT id FROM actors WHERE actor_name = $1",
                [actor_name]
            );
            if (rows.length > 0) {
                throw new Error(`Actor with name "${actor_name}" already exists (id: ${rows[0].id})`);
            }
            return true;
        }),

    body("profile_url")
        .optional({ nullable: true })
        .isString()
        .withMessage("profile_url must be a string")
        .trim(),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateCreateNetwork = [
    body("network_name")
        .notEmpty()
        .withMessage("network_name is required")
        .isString()
        .withMessage("network_name must be a string")
        .trim()
        .custom(async (network_name) => {
            const { rows } = await pool.query(
                "SELECT id FROM networks WHERE network_name = $1",
                [network_name]
            );
            if (rows.length > 0) {
                throw new Error(`Network with name "${network_name}" already exists (id: ${rows[0].id})`);
            }
            return true;
        }),
    body("logo_url")
        .optional({ nullable: true })
        .isString()
        .withMessage("logo_url must be a string")
        .trim(),
    body("country")
        .optional({ nullable: true })
        .isString()
        .withMessage("country must be a string")
        .trim()
        .custom(async (country) => {
            if (country) {
                const { rows } = await pool.query("SELECT country_code FROM countries");
                const validCountries = rows.map(r => r.country_code);
                if (!validCountries.includes(country)) {
                    throw new Error(`Invalid country: "${country}". Valid values: ${validCountries.join(", ")}`);
                }
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateCreateStudio = [
    body("studio_name")
        .notEmpty()
        .withMessage("studio_name is required")
        .isString()
        .withMessage("studio_name must be a string")
        .trim()
        .custom(async (studio_name) => {
            const { rows } = await pool.query(
                "SELECT id FROM studios WHERE studio_name = $1",
                [studio_name]
            );
            if (rows.length > 0) {
                throw new Error(`Studio with name "${studio_name}" already exists (id: ${rows[0].id})`);
            }
            return true;
        }),
    body("logo_url")
        .optional({ nullable: true })
        .isString()
        .withMessage("logo_url must be a string")
        .trim(),
    body("country")
        .optional({ nullable: true })
        .isString()
        .withMessage("country must be a string")
        .trim()
        .custom(async (country) => {
            if (country) {
                const { rows } = await pool.query("SELECT country_code FROM countries");
                const validCountries = rows.map(r => r.country_code);
                if (!validCountries.includes(country)) {
                    throw new Error(`Invalid country: "${country}". Valid values: ${validCountries.join(", ")}`);
                }
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


export const validateCreateCreator = [
    body("creator_name")
        .notEmpty()
        .withMessage("creator_name is required")
        .isString()
        .withMessage("creator_name must be a string")
        .trim()
        .custom(async (creator_name) => {
            const { rows } = await pool.query(
                "SELECT id FROM creators WHERE creator_name = $1",
                [creator_name]
            );
            if (rows.length > 0) {
                throw new Error(`Creator with name "${creator_name}" already exists (id: ${rows[0].id})`);
            }
            return true;
        }),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


// helper function to send error messages
export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    // Don’t inspect; just forward
    return sendValidationError(res, "An error has occurred (see details below) ", errors.array());
};


// Validation for updating a show (PATCH - all fields optional)
export const validateUpdateShow = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .trim(),

    body('original_name')
        .optional()
        .isString()
        .withMessage('Original name must be a string')
        .trim(),

    body('first_air_date')
        .optional()
        .isISO8601()
        .withMessage('First air date must be a valid date (ISO 8601)'),

    body('last_air_date')
        .optional()
        .isISO8601()
        .withMessage('Last air date must be a valid date (ISO 8601)'),

    body('seasons')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Seasons must be a non-negative integer'),

    body('episodes')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Episodes must be a non-negative integer'),

    body('status')
        .optional()
        .isString()
        .withMessage('Status must be a string')
        .trim(),

    body('overview')
        .optional()
        .isString()
        .withMessage('Overview must be a string')
        .trim(),

    body('popularity')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Popularity must be a non-negative number'),

    body('tmdb_rating')
        .optional()
        .isFloat({ min: 0, max: 10 })
        .withMessage('TMDB rating must be between 0 and 10'),

    body('vote_count')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Vote count must be a non-negative integer'),

    body('poster_url')
        .optional()
        .isString()
        .withMessage('Poster URL must be a string')
        .trim(),

    body('backdrop_url')
        .optional()
        .isString()
        .withMessage('Backdrop URL must be a string')
        .trim(),

    validate
];


// Validation for updating a cast member
export const validateUpdateCastMember = [
    body('character_name')
        .notEmpty()
        .withMessage('Character name is required')
        .isString()
        .withMessage('Character name must be a string')
        .trim(),

    validate
];
