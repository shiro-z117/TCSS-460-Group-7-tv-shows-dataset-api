"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomTenValidator = exports.validate = exports.filterByYearRangeValidator = exports.listValidator = void 0;
// core/middleware/tvShowValidation.ts
const express_validator_1 = require("express-validator");
const responseUtils_1 = require("../utilities/responseUtils");
exports.listValidator = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).toInt(),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];
exports.filterByYearRangeValidator = [
    (0, express_validator_1.query)('start_year').exists().withMessage('start_year required').isInt().toInt(),
    (0, express_validator_1.query)('end_year').exists().withMessage('end_year required').isInt().toInt(),
    (req, res, next) => {
        const s = Number(req.query.start_year);
        const e = Number(req.query.end_year);
        if (Number.isInteger(s) && Number.isInteger(e) && s <= e)
            return next();
        return res.status(400).json({ success: false, error: 'start_year and end_year must be integers and start_year <= end_year' });
    },
    ...exports.listValidator,
];
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty())
        return next();
    // Don’t inspect; just forward
    return (0, responseUtils_1.sendValidationError)(res, 'Invalid request parameters', errors.array());
};
exports.validate = validate;
exports.randomTenValidator = [
    // optional: allow user to pass ?limit=N if you like
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
];
