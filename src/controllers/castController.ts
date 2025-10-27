// src/controllers/castController.ts
import { Request, Response, NextFunction } from 'express';
import * as db from '../db/queries.js';


/**
 * POST /api/shows/:id/cast
 * Add a cast member to a TV show
 */
export async function addCastMember(req: Request, res: Response, next: NextFunction) {
    try {
        const tvShowId = parseInt(req.params.id);

        // Validate show ID
        if (isNaN(tvShowId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid show ID'
            });
            return;
        }

        const castData = {
            actor_id: req.body.actor_id,
            character_name: req.body.character_name
        };

        const newCastMember = await db.addCastMember(tvShowId, castData);

        res.status(201)
            .location(`/api/shows/${tvShowId}/cast/${newCastMember.actor_id}`)
            .json({
                success: true,
                data: newCastMember,
                message: 'Cast member added successfully'
            });
    } catch (err: any) {
        if (err.message === 'SHOW_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'TV show not found'
            });
            return;
        }
        if (err.message === 'ACTOR_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'Actor not found'
            });
            return;
        }
        if (err.message === 'CAST_MEMBER_EXISTS') {
            res.status(409).json({
                success: false,
                message: 'This actor is already in the cast for this show'
            });
            return;
        }
        next(err);
    }
}

/**
 * PATCH /api/shows/:id/cast/:actorId
 * Update a cast member's character name
 */
export async function updateCastMember(req: Request, res: Response, next: NextFunction) {
    try {
        const tvShowId = parseInt(req.params.id);
        const actorId = parseInt(req.params.actorId);

        // Validate IDs
        if (isNaN(tvShowId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid show ID'
            });
            return;
        }

        if (isNaN(actorId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid actor ID'
            });
            return;
        }

        const characterName = req.body.character_name;

        const updatedCastMember = await db.updateCastMember(tvShowId, actorId, characterName);

        res.status(200).json({
            success: true,
            data: updatedCastMember,
            message: 'Cast member updated successfully'
        });
    } catch (err: any) {
        if (err.message === 'SHOW_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'TV show not found'
            });
            return;
        }
        if (err.message === 'CAST_MEMBER_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'Cast member not found for this show'
            });
            return;
        }
        next(err);
    }
}

/**
 * DELETE /api/shows/:id/cast/:actorId
 * Remove a cast member from a TV show
 */
export async function deleteCastMember(req: Request, res: Response, next: NextFunction) {
    try {
        const tvShowId = parseInt(req.params.id);
        const actorId = parseInt(req.params.actorId);

        // Validate IDs
        if (isNaN(tvShowId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid show ID'
            });
            return;
        }

        if (isNaN(actorId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid actor ID'
            });
            return;
        }

        const deletedCastMember = await db.deleteCastMember(tvShowId, actorId);

        res.status(200).json({
            success: true,
            data: { actor_id: deletedCastMember.actor_id },
            message: 'Cast member removed successfully'
        });
    } catch (err: any) {
        if (err.message === 'SHOW_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'TV show not found'
            });
            return;
        }
        if (err.message === 'CAST_MEMBER_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'Cast member not found for this show'
            });
            return;
        }
        next(err);
    }
}