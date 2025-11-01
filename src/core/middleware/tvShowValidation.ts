// core/middleware/tvShowValidation.ts
import { query, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {sendValidationError} from "../utilities/responseUtils";
import pool from '../../db/connection.js';

// Middleware to check if a show exists by ID (for DELETE operations)
export async function checkShowIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);

        // Validate ID is a valid number
        if (isNaN(showId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid show ID'
            });
            return;
        }

        // Check if show exists
        const { rows } = await pool.query('SELECT id FROM tv_shows WHERE id = $1', [showId]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Show not found'
            });
            return;
        }

        // Show exists, continue to next middleware (auth)
        next();
    } catch (err) {
        next(err);
    }
}


export async function checkActorIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const actorId = parseInt(req.params.id);

        if (isNaN(actorId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid actor ID'
            });
            return;
        }

        const { rows } = await pool.query('SELECT id FROM actors WHERE id = $1', [actorId]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Actor not found'
            });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}


export async function checkNetworkIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const networkId = parseInt(req.params.id);

        if (isNaN(networkId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid network ID'
            });
            return;
        }

        const { rows } = await pool.query('SELECT id FROM networks WHERE id = $1', [networkId]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Network not found'
            });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}


export async function checkStudioIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const studioId = parseInt(req.params.id);

        if (isNaN(studioId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid studio ID'
            });
            return;
        }

        const { rows } = await pool.query('SELECT id FROM studios WHERE id = $1', [studioId]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Studio not found'
            });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}


export async function checkCreatorIdExists(req: Request, res: Response, next: NextFunction) {
    try {
        const creatorId = parseInt(req.params.id);

        if (isNaN(creatorId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid creator ID'
            });
            return;
        }

        const { rows } = await pool.query('SELECT id FROM creators WHERE id = $1', [creatorId]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Creator not found'
            });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}


export async function checkActorDuplicate(req: Request, res: Response, next: NextFunction) {
    try {
        const { actor_name } = req.body;

        if (!actor_name || typeof actor_name !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'actor_name is required and must be a string',
            });
        }

        const { rows } = await pool.query(
            'SELECT id FROM actors WHERE actor_name = $1',
            [actor_name.trim()]
        );

        if (rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: `Actor with name "${actor_name}" already exists`,
            });
        }

        next();
    } catch (err) {
        console.error('Error in checkActorDuplicate:', err);
        next(err);
    }
}


// Validate that the "country" field exists in countries.country_code
export async function validateCountry(req: Request, res: Response, next: NextFunction) {
    try {
        const { country } = req.body;

        if (!country) {
            res.status(400).json({ success: false, message: 'Missing country field' });
            return;
        }

        const { rows } = await pool.query(
            'SELECT 1 FROM countries WHERE country_code = $1',
            [country]
        );

        if (rows.length === 0) {
            res.status(400).json({ success: false, message: `Invalid country: ${country}` });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}

// Validate that the "status" field exists in statuses.name
export async function validateStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { status } = req.body;

        if (!status) {
            res.status(400).json({ success: false, message: 'Missing status field' });
            return;
        }

        const { rows } = await pool.query(
            'SELECT 1 FROM statuses WHERE name = $1',
            [status]
        );

        if (rows.length === 0) {
            res.status(400).json({ success: false, message: `Invalid status: ${status}` });
            return;
        }

        next();
    } catch (err) {
        next(err);
    }
}



export const listValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const filterByYearRangeValidator = [
  query("start_year")
    .exists()
    .withMessage("start_year required")
    .isInt()
    .toInt(),
  query("end_year").exists().withMessage("end_year required").isInt().toInt(),
  (req: Request, res: Response, next: NextFunction) => {
    const s = Number(req.query.start_year);
    const e = Number(req.query.end_year);
    if (Number.isInteger(s) && Number.isInteger(e) && s <= e) return next();
    return res.status(400).json({
      success: false,
      error:
        "start_year and end_year must be integers and start_year <= end_year",
    });
  },
  ...listValidator,
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  // Don’t inspect; just forward
  return sendValidationError(res, "Invalid request parameters", errors.array());
};

export const randomTenValidator = [
  // optional: allow user to pass ?limit=N if you like
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
];

export const validateCreateShow = [
  body("id")
    .notEmpty()
    .withMessage("ID is required")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer"),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("original_name")
    .optional()
    .isString()
    .withMessage("Original name must be a string")
    .trim(),

  body("first_air_date")
    .optional()
    .isISO8601()
    .withMessage("First air date must be a valid date (ISO 8601)"),

  body("last_air_date")
    .optional()
    .isISO8601()
    .withMessage("Last air date must be a valid date (ISO 8601)"),

  body("seasons")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Seasons must be a non-negative integer"),

  body("episodes")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Episodes must be a non-negative integer"),

  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string")
    .trim(),

  body("overview")
    .optional()
    .isString()
    .withMessage("Overview must be a string")
    .trim(),

  body("popularity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Popularity must be a non-negative number"),

  body("tmdb_rating")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("TMDB rating must be between 0 and 10"),

  body("vote_count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Vote count must be a non-negative integer"),

  body("poster_url")
    .optional()
    .isString()
    .withMessage("Poster URL must be a string")
    .trim(),

  body("backdrop_url")
    .optional()
    .isString()
    .withMessage("Backdrop URL must be a string")
    .trim(),

  validate,
];

// ===================================================
// VALIDATE UPDATE STATUS
// ===================================================
const validStatuses = ["Canceled", "Ended", "Pilot", "Returning Series"];

export const validateUpdateStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isString()
    .withMessage("Status must be a string")
    .trim()
    .isIn(validStatuses)
    .withMessage(`Status must be one of: ${validStatuses.join(", ")}`),
  validate,
];

// ===================================================
// VALIDATE UPDATE DATES
// ===================================================
export const validateUpdateDates = [
  body("first_air_date")
    .optional()
    .isISO8601()
    .withMessage("First air date must be a valid date (ISO 8601)"),
  body("last_air_date")
    .optional()
    .isISO8601()
    .withMessage("Last air date must be a valid date (ISO 8601)"),
  // At least one date must be provided
  body().custom((value, { req }) => {
    if (!req.body.first_air_date && !req.body.last_air_date) {
      throw new Error(
        "At least one date field (first_air_date or last_air_date) must be provided"
      );
    }
    return true;
  }),
  validate,
];

// ===================================================
// VALIDATE UPDATE METRICS
// ===================================================
export const validateUpdateMetrics = [
  body("tmdb_rating")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("TMDB rating must be between 0 and 10"),
  body("popularity")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Popularity must be a non-negative number"),
  body("vote_count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Vote count must be a non-negative integer"),
  // At least one metric must be provided
  body().custom((value, { req }) => {
    if (
      req.body.tmdb_rating === undefined &&
      req.body.popularity === undefined &&
      req.body.vote_count === undefined
    ) {
      throw new Error(
        "At least one metric field (tmdb_rating, popularity, or vote_count) must be provided"
      );
    }
    return true;
  }),
  validate,
];

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

// Validation for adding a cast member
export const validateAddCastMember = [
    body('actor_id')
        .notEmpty()
        .withMessage('Actor ID is required')
        .isInt({ min: 1 })
        .withMessage('Actor ID must be a positive integer'),

    body('character_name')
        .notEmpty()
        .withMessage('Character name is required')
        .isString()
        .withMessage('Character name must be a string')
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

