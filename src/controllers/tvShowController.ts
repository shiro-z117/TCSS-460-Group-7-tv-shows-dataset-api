// src/controllers/tvShowController.ts
import { Request, Response, NextFunction } from 'express';
import * as db from '../db/queries.js'; // <-- .js required


export async function getHealth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Call database function
    const health = await db.getHealth();

    // Return health status
    res.json(health);
  } catch (err) {
    next(err);
  }
}


export async function getShows(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = {
            q: req.query.q as string,
            genre: req.query.genre as string,
            network: req.query.network as string,
            status: req.query.status as string,
            studio: req.query.studio as string,
            actor: req.query.actor as string,
            genre_id: req.query.genre_id as string,
            network_id: req.query.network_id as string,
            studio_id: req.query.studio_id as string,
            actor_id: req.query.actor_id as string,
            match: req.query.match as string || 'all',
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 20,
            sort: req.query.sort as string || 'id',
            order: req.query.order as string || 'asc'
        };

        const { shows, total, page, limit } = await db.getShows(filters);

        res.json({
            success: true,
            data: shows,
            page,
            limit,
            total
        });
    } catch (err) { next(err); }
}


export async function getShowById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid show ID",
      });
    }

    const show = await db.getShowById(id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.json({ success: true, data: show });
  } catch (err) {
    next(err);
  }
}


export async function getStatuses(req: Request, res: Response, next: NextFunction) {
    try {
        const searchQuery = (req.query.q as string) || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const { statuses, total } = await db.getStatuses(searchQuery, page, limit);

        res.json({
            success: true,
            data: statuses,
            page,
            limit,
            total
        });
    } catch (err) {
        next(err);
    }
}


export async function getGenres(req: Request, res: Response, next: NextFunction) {
    try {
        const searchQuery = req.query.q as string || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const { genres, total } = await db.getGenres(searchQuery, page, limit);

        res.json({
            success: true,
            data: genres,
            page,
            limit,
            total
        });
    } catch (err) { next(err); }
}


export async function getNetworks(req: Request, res: Response, next: NextFunction) {
    try {
        const searchQuery = req.query.q as string || '';
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const { networks, total } = await db.getNetworks(searchQuery, page, limit);

        res.json({
            success: true,
            data: networks,
            page,
            limit,
            total
        });
    } catch (err) { next(err); }
}


export async function getStudios(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    // Destructure returned values
    const { studios, total } = await db.getStudios(q, page, limit);

    // Match the output style of other endpoints
    res.json({
      success: true,
      data: studios,
      page,
      limit,
      total,
    });
  } catch (err) {
    next(err);
  }
}


export async function getYearsFirst(req: Request, res: Response, next: NextFunction) {
  try {
    const min = req.query.min ? parseInt(req.query.min as string) : undefined;
    const max = req.query.max ? parseInt(req.query.max as string) : undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { data, total } = await db.getYearsFirst(min, max, page, limit);

    res.json({
      success: true,
      data, // already an array of numbers
      page,
      limit,
      total,
    });
  } catch (err) {
    next(err);
  }
}


export async function getYearsLast(req: Request, res: Response, next: NextFunction) {
  try {
    const min = req.query.min ? parseInt(req.query.min as string) : undefined;
    const max = req.query.max ? parseInt(req.query.max as string) : undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { data, total } = await db.getYearsLast(min, max, page, limit);

    res.json({
      success: true,
      data, // already an array of numbers
      page,
      limit,
      total,
    });
  } catch (err) {
    next(err);
  }
}


export async function getEpisodes(req: Request, res: Response, next: NextFunction) {
  try {
    const min = req.query.min ? parseInt(req.query.min as string) : undefined;
    const max = req.query.max ? parseInt(req.query.max as string) : undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { data, total } = await db.getEpisodes(min, max, page, limit);

    res.json({
      success: true,
      data, // already an array of numbers
      page,
      limit,
      total,
    });
  } catch (err) {
    next(err);
  }
}


export async function getShowImages(req: Request, res: Response, next: NextFunction) {
    try {
        // gets show ID from URL path
        const showId = parseInt(req.params.id as string);
        
        // gets optional type filter from query params
        const type = req.query.type as string;
        
        // gets pagination params (default: page 1, limit 20)
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        
        // validate show ID
        if (!showId || showId <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid show ID'
            });
        }
        
        // validate type if provided
        if (type && !['poster', 'backdrop'].includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid type. Use: poster or backdrop'
            });
        }
        
        // validate pagination params
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100'
            });
        }
        
        // calls db func
        const data = await db.getShowImages(showId, type, page, limit);
        
        // rturn response
        res.json({
            success: true,
            data,
            page,
            limit,
            total: data.length
        });
        
        } catch (err) { next(err); }
}


export async function getShowCast(req: Request, res: Response, next: NextFunction) {
    try {
        // gets show ID from URL path
        const showId = parseInt(req.params.id as string);
        
        // gets pagination params (default: page 1, limit 10, max 50)
        const page = parseInt(req.query.page as string) || 1;
        const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
        
        // validate show ID
        if (!showId || showId <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid show ID'
            });
        }
        
        // validate pagination params
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                error: 'Invalid pagination parameters. Page and limit must be >= 1'
            });
        }
        
        // calls db function
        const data = await db.getShowCast(showId, page, limit);
        
        // return response
        res.json({
            success: true,
            data,
            page,
            limit,
            total: data.length
        });
        
    } catch (err) { next(err); }

}


export async function deleteShow(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);

        // ID validation and existence check already done by middleware
        const deletedShow = await db.deleteShow(showId);

        res.status(200).json({
            success: true,
            data: deletedShow,
            message: 'Show deleted successfully'
        });
    } catch (err: any) {
        next(err);
    }
}


export async function deleteActor(req: Request, res: Response, next: NextFunction) {
    try {
        const actorId = parseInt(req.params.id);
        const deletedActor = await db.deleteActor(actorId);

        res.status(200).json({
          success: true,
          data: deletedActor,
          message: "Actor deleted successfully",
        });
    } catch (err: any) {
        next(err);
    }
}


export async function deleteNetwork(req: Request, res: Response, next: NextFunction) {
    try {
        const networkId = parseInt(req.params.id);
        const deletedNetwork = await db.deleteNetwork(networkId);

        res.status(200).json({
          success: true,
          data: deletedNetwork,
          message: "Network deleted successfully",
        });
    } catch (err: any) {
        next(err);
    }
}


export async function deleteStudio(req: Request, res: Response, next: NextFunction) {
    try {
        const studioId = parseInt(req.params.id);
        const deletedStudio = await db.deleteStudio(studioId);

        res.status(200).json({
          success: true,
          data: deletedStudio,
          message: "Studio deleted successfully",
        });
    } catch (err: any) {
        next(err);
    }
}


export async function deleteCreator(req: Request, res: Response, next: NextFunction) {
    try {
        const creatorId = parseInt(req.params.id);
        const deletedCreator = await db.deleteCreator(creatorId);

        res.status(200).json({
          success: true,
          data: deletedCreator,
          message: "Creator deleted successfully",
        });
    } catch (err: any) {
        next(err);
    }
}


export async function createShow(req: Request, res: Response, next: NextFunction) {
  try {
    const newShow = await db.createShow(req.body);

    res.status(201)
      .location(`/api/shows/${newShow.id}`)
      .json({
        success: true,
        message: 'Show created successfully',
        data: newShow
      });
  } catch (err: any) {
    next(err);
  }
}



export async function createActor(req: Request, res: Response, next: NextFunction) {
    try {
        const { actor_name, profile_url } = req.body;

        const newActor = await db.createActor(actor_name, profile_url);

        res.status(201).json({
            success: true,
            message: 'Actor created successfully',
            data: newActor,
        });
    } catch (err) {
        next(err);
    }
}


export async function createNetwork(req: Request, res: Response, next: NextFunction) {
    try {
        const { network_name, logo_url, country } = req.body;

        const newNetwork = await db.createNetwork(network_name, logo_url, country);

        res.status(201).json({
            success: true,
            message: 'Network created successfully',
            data: newNetwork,
        });
    } catch (err) {
        next(err);
    }
}


export async function createStudio(req: Request, res: Response, next: NextFunction) {
    try {
        const { studio_name, logo_url, country } = req.body;

        const newStudio = await db.createStudio(studio_name, logo_url, country);

        res.status(201).json({
            success: true,
            message: 'Studio created successfully',
            data: newStudio,
        });
    } catch (err) {
        next(err);
    }
}


export async function createCreator(req: Request, res: Response, next: NextFunction) {
    try {
        const { creator_name } = req.body;

        const newCreator = await db.createCreator(creator_name);

        res.status(201).json({
            success: true,
            message: 'Creator created successfully',
            data: newCreator,
        });
    } catch (err) {
        next(err);
    }
}


export async function updateShow(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);

        // ID validation and existence check already done by middleware
        const updateData: any = {};

        // Build update object from request body
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.original_name !== undefined) updateData.original_name = req.body.original_name;
        if (req.body.first_air_date !== undefined) updateData.first_air_date = req.body.first_air_date;
        if (req.body.last_air_date !== undefined) updateData.last_air_date = req.body.last_air_date;
        if (req.body.seasons !== undefined) updateData.seasons = req.body.seasons;
        if (req.body.episodes !== undefined) updateData.episodes = req.body.episodes;
        if (req.body.status !== undefined) updateData.status = req.body.status;
        if (req.body.overview !== undefined) updateData.overview = req.body.overview;
        if (req.body.popularity !== undefined) updateData.popularity = req.body.popularity;
        if (req.body.tmdb_rating !== undefined) updateData.tmdb_rating = req.body.tmdb_rating;
        if (req.body.vote_count !== undefined) updateData.vote_count = req.body.vote_count;
        if (req.body.poster_url !== undefined) updateData.poster_url = req.body.poster_url;
        if (req.body.backdrop_url !== undefined) updateData.backdrop_url = req.body.backdrop_url;

        const updatedShow = await db.updateShow(showId, updateData);

        res.status(200).json({
            success: true,
            data: updatedShow,
            message: 'Show updated successfully'
        });
    } catch (err: any) {
        if (err.message === 'NO_FIELDS_TO_UPDATE') {
            res.status(400).json({
                success: false,
                message: 'At least one field must be provided to update'
            });
            return;
        }
        next(err);
    }
}

// ===================================================
// UPDATE SHOW STATUS
// ===================================================
export async function updateShowStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);
        const { status } = req.body;

        const updatedShow = await db.updateShowStatus(showId, status);

        res.status(200).json({
            success: true,
            message: '1 field(s) updated',
            data: updatedShow
        });
    } catch (err: any) {
        if (err.message === 'SHOW_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'Show not found'
            });
            return;
        }
        next(err);
    }
}

// ===================================================
// UPDATE SHOW DATES
// ===================================================
export async function updateShowDates(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);
        const { first_air_date, last_air_date } = req.body;

        const dates: any = {};
        if (first_air_date !== undefined) dates.first_air_date = first_air_date;
        if (last_air_date !== undefined) dates.last_air_date = last_air_date;

        const fieldsUpdated = Object.keys(dates).length;
        const updatedShow = await db.updateShowDates(showId, dates);

        res.status(200).json({
            success: true,
            message: `${fieldsUpdated} field(s) updated`,
            data: updatedShow
        });
    } catch (err: any) {
        if (err.message === 'SHOW_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'Show not found'
            });
            return;
        }
        if (err.message === 'NO_UPDATES_PROVIDED') {
            res.status(400).json({
                success: false,
                message: 'At least one date field must be provided'
            });
            return;
        }
        next(err);
    }
}

// ===================================================
// UPDATE SHOW METRICS
// ===================================================
export async function updateShowMetrics(req: Request, res: Response, next: NextFunction) {
    try {
        const showId = parseInt(req.params.id);
        const { tmdb_rating, popularity, vote_count } = req.body;

        const metrics: any = {};
        if (tmdb_rating !== undefined) metrics.tmdb_rating = tmdb_rating;
        if (popularity !== undefined) metrics.popularity = popularity;
        if (vote_count !== undefined) metrics.vote_count = vote_count;

        const fieldsUpdated = Object.keys(metrics).length;
        const updatedShow = await db.updateShowMetrics(showId, metrics);

        res.status(200).json({
            success: true,
            message: `${fieldsUpdated} field(s) updated`,
            data: updatedShow
        });
    } catch (err: any) {
        if (err.message === 'SHOW_NOT_FOUND') {
            res.status(404).json({
                success: false,
                message: 'Show not found'
            });
            return;
        }
        if (err.message === 'NO_UPDATES_PROVIDED') {
            res.status(400).json({
                success: false,
                message: 'At least one metric field must be provided'
            });
            return;
        }
        next(err);
    }
}

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