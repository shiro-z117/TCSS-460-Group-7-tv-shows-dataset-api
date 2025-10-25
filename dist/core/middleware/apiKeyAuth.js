"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyAuth = apiKeyAuth;
/**
 * Simple API key guard for all /api routes.
 * - Looks for `X-API-Key` header
 * - Compares to process.env.API_KEY
 * - Optionally supports a comma-separated list of keys in API_KEYS
 *
 * Usage: app.use('/api', apiKeyAuth, openRouter)
 */
function apiKeyAuth(req, res, next) {
    const provided = req.header('X-API-Key');
    // Primary: single key
    const singleKey = (process.env.API_KEY || '').trim();
    // Optional: multiple keys (comma-separated)
    const multiKeys = (process.env.API_KEYS || '')
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
    // If neither configured, block with clear message
    if (!singleKey && multiKeys.length === 0) {
        return res
            .status(401)
            .json({ success: false, error: 'Server missing API key configuration' });
    }
    // Validate provided key
    const valid = (singleKey && provided === singleKey) ||
        (multiKeys.length > 0 && multiKeys.includes(provided || ''));
    if (!valid) {
        return res
            .status(401)
            .json({ success: false, error: 'Invalid or missing API key' });
    }
    return next();
}
