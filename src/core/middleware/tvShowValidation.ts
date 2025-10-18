// core/middleware/tvShowValidation.ts
import { query, validationResult } from 'express-validator';
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

