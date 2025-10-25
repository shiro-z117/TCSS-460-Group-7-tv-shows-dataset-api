"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateMeta = paginateMeta;
exports.sendValidationError = sendValidationError;
function paginateMeta(page, limit, total) {
    return {
        current_page: page,
        items_per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
    };
}
function sendValidationError(res, message, details // <-- loose on purpose
) {
    return res.status(400).json({ success: false, error: message, details });
}
