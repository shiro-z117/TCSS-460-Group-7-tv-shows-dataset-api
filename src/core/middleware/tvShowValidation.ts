// core/middleware/tvShowValidation.ts
import { query, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import {sendValidationError} from "../utilities/responseUtils";

export const listValidator = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const filterByYearRangeValidator = [
    query('start_year').exists().withMessage('start_year required').isInt().toInt(),
    query('end_year').exists().withMessage('end_year required').isInt().toInt(),
    (req: Request, res: Response, next: NextFunction) => {
        const s = Number(req.query.start_year);
        const e = Number(req.query.end_year);
        if (Number.isInteger(s) && Number.isInteger(e) && s <= e) return next();
        return res.status(400).json({ success: false, error: 'start_year and end_year must be integers and start_year <= end_year' });
    },
    ...listValidator,
];


export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    // Don’t inspect; just forward
    return sendValidationError(res, 'Invalid request parameters', errors.array());
};

export const randomTenValidator = [
    // optional: allow user to pass ?limit=N if you like
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
];

export const validateCreateShow = [
    body('id')
        .notEmpty()
        .withMessage('ID is required')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),

    body('name')
        .notEmpty()
        .withMessage('Name is required')
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

