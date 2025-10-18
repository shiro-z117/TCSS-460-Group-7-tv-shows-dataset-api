// core/utilities/responseUtils.ts
import {Response} from "express";

export function paginateMeta(page: number, limit: number, total: number) {
    return {
        current_page: page,
        items_per_page: limit,
        total_items: total,
        total_pages: Math.ceil(total / limit),
    };
}

export function sendValidationError(
    res: Response,
    message: string,
    details: unknown[]   // <-- loose on purpose
) {
    return res.status(400).json({ success: false, error: message, details });
}