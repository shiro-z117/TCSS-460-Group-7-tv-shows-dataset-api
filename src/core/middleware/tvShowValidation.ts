// core/middleware/tvShowValidation.ts
import { query, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from "../utilities/responseUtils";
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
                data: rows[0]
            });
        }

        next();
    } catch (err) {
        console.error('Error in checkActorDuplicate:', err);
        next(err);
    }
}


export async function checkNetworkDuplicate(req: Request, res: Response, next: NextFunction) {
    try {
        const { network_name } = req.body;

        if (!network_name || typeof network_name !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'network_name is required and must be a string',
            });
        }

        const { rows } = await pool.query(
            'SELECT id FROM networks WHERE network_name = $1',
            [network_name.trim()]
        );

        if (rows.length > 0) {
            return res.status(409).json({
              success: false,
              message: `Network with name "${network_name}" already exists`,
              data: rows[0],
            });
        }

        next();
    } catch (err) {
        console.error('Error in checkNetworkDuplicate:', err);
        next(err);
    }
}


export async function checkStudioDuplicate(req: Request, res: Response, next: NextFunction) {
    try {
        const { studio_name } = req.body;

        if (!studio_name || typeof studio_name !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'studio_name is required and must be a string',
            });
        }

        const { rows } = await pool.query(
            'SELECT id FROM studios WHERE studio_name = $1',
            [studio_name.trim()]
        );

        if (rows.length > 0) {
            return res.status(409).json({
              success: false,
              message: `Studio with name "${studio_name}" already exists`,
              data: rows[0],
            });
        }

        next();
    } catch (err) {
        console.error('Error in checkStudioDuplicate:', err);
        next(err);
    }
}


export async function checkCreatorDuplicate(req: Request, res: Response, next: NextFunction) {
    try {
        const { creator_name } = req.body;

        if (!creator_name || typeof creator_name !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'creator_name is required and must be a string',
            });
        }

        const { rows } = await pool.query(
            'SELECT id FROM creators WHERE creator_name = $1',
            [creator_name.trim()]
        );

        if (rows.length > 0) {
            return res.status(409).json({
              success: false,
              message: `Creator with name "${creator_name}" already exists`,
              data: rows[0],
            });
        }

        next();
    } catch (err) {
        console.error('Error in checkCreatorDuplicate:', err);
        next(err);
    }
}


export async function validateCountry(req: Request, res: Response, next: NextFunction) {
  try {
    const { country } = req.body;
    if (!country) {
      return next();
    }
    const { rows } = await pool.query('SELECT country_code FROM countries');
    const validCountries = rows.map(r => r.country_code);

    if (!validCountries.includes(country)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid country',
        validValues: validCountries
      });
    }

    next();
  } catch (err) {
    next(err);
  }
}


// helper function to send error messages
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  // Don’t inspect; just forward
  return sendValidationError(res, "An error has occurred (see details below) ", errors.array());
};


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

  body("genres")
    .isArray({ min: 1 })
    .withMessage("Genres must be an array with at least one value")
    .custom(async (genresArray) => {
      const { rows } = await pool.query("SELECT genre_name FROM genres");
      const validGenres = rows.map((r) => r.genre_name);
      for (const genre of genresArray) {
        if (!validGenres.includes(genre)) {
          throw new Error(
            `Invalid genre: ${genre}. Valid values: ${validGenres.join(", ")}`
          );
        }
      }
      return true;
    }),

  // Duplicate check: name + original_name + status + first_air_date
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

  // helper to format validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return sendValidationError(
      res,
      "Invalid request parameters",
      errors.array()
    );
  },
];


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

