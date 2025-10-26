// src/db/queries.js
// ===================================================
// DATABASE QUERY FUNCTIONS
// ===================================================

const pool = require('./connection');

// ===================================================
// QUERY 1: GET ALL TV SHOWS
// ===================================================
const getAllShows = async () => {
    try {
        const result = await pool.query('SELECT * FROM tv_shows ORDER BY id');
        return result.rows;
    } catch (error) {
        console.error('Database error in getAllShows:', error);
        throw error;
    }
};

// ===================================================
// QUERY 2: GET SHOWS BY NAME (SEARCH)
// ===================================================
const getShowsByName = async (showName) => {
    try {
        const result = await pool.query(
            `SELECT id, name, original_name, first_air_date, seasons, episodes, status, tmdb_rating
       FROM tv_shows
       WHERE name ILIKE $1 OR original_name ILIKE $1`,
            [`%${showName}%`]
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in getShowsByName:', error);
        throw error;
    }
};

// ===================================================
// QUERY 3: GET SHOWS BY GENRE
// ===================================================
// For exact match: pass [genreName] and use "g.genre_name ILIKE $1"
// For partial match: pass [`%${genreName}%`] and keep the wildcards
const getShowsByGenre = async (genreName) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT tv.id, tv.name, tv.original_name, tv.first_air_date,
              tv.seasons, tv.episodes, tv.status, tv.tmdb_rating
       FROM tv_shows tv
       JOIN show_genres sg ON tv.id = sg.tv_show_id
       JOIN genres g ON sg.genre_id = g.id
       WHERE g.genre_name ILIKE $1
       ORDER BY tv.id`,
            [genreName] // use [`%${genreName}%`] if you want partials
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in getShowsByGenre:', error);
        throw error;
    }
};

// ===================================================
// QUERY 4: GET SHOWS BY STATUS (Ongoing/Ended/etc.)
// ===================================================
const getShowsByStatus = async (status) => {
    try {
        const result = await pool.query(
            `SELECT id, name, original_name, first_air_date, seasons, episodes, status, tmdb_rating
       FROM tv_shows
       WHERE status = $1
       ORDER BY id`,
            [status]
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in getShowsByStatus:', error);
        throw error;
    }
};

// ===================================================
// QUERY 5: GET SHOW BY ID
// ===================================================
const getShowById = async (showId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tv_shows WHERE id = $1',
            [showId]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error('Database error in getShowById:', error);
        throw error;
    }
};


// ===================================================
// QUERY 6: GET N RANDOM SHOWS (default 10)
// ===================================================
const getRandomShows = async (limit = 10) => {
    try {
        const result = await pool.query(
            `SELECT id, name, original_name, first_air_date, last_air_date,
              seasons, episodes, status, overview, popularity,
              tmdb_rating, vote_count, poster_url, backdrop_url
       FROM tv_shows
       ORDER BY RANDOM()
       LIMIT $1`,
            [limit]
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in getRandomShows:', error);
        throw error;
    }
};

// ===================================================
// QUERY 7: GET GENRES WITH OPTIONAL SEARCH AND PAGINATION
// ===================================================
const getGenres = async (searchQuery = '', page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;

        // Build the WHERE clause for optional search
        const whereClause = searchQuery
            ? 'WHERE genre_name ILIKE $1'
            : '';
        const searchParam = searchQuery ? `%${searchQuery}%` : null;

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM genres ${whereClause}`;
        const countParams = searchQuery ? [searchParam] : [];
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        // Get paginated genres
        const dataQuery = `
            SELECT genre_name
            FROM genres
            ${whereClause}
            ORDER BY genre_name ASC
            LIMIT $${searchQuery ? 2 : 1} OFFSET $${searchQuery ? 3 : 2}
        `;
        const dataParams = searchQuery
            ? [searchParam, limit, offset]
            : [limit, offset];
        const dataResult = await pool.query(dataQuery, dataParams);

        // Extract just the genre names into an array
        const genres = dataResult.rows.map(row => row.genre_name);

        return { genres, total };
    } catch (error) {
        console.error('Database error in getGenres:', error);
        throw error;
    }
};

// ===================================================
// QUERY 8: GET NETWORKS WITH OPTIONAL SEARCH AND PAGINATION
// ===================================================
const getNetworks = async (searchQuery = '', page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;

        // Build the WHERE clause for optional search
        const whereClause = searchQuery
            ? 'WHERE network_name ILIKE $1'
            : '';
        const searchParam = searchQuery ? `%${searchQuery}%` : null;

        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM networks ${whereClause}`;
        const countParams = searchQuery ? [searchParam] : [];
        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].total);

        // Get paginated networks
        const dataQuery = `
            SELECT network_name
            FROM networks
            ${whereClause}
            ORDER BY network_name ASC
            LIMIT $${searchQuery ? 2 : 1} OFFSET $${searchQuery ? 3 : 2}
        `;
        const dataParams = searchQuery
            ? [searchParam, limit, offset]
            : [limit, offset];
        const dataResult = await pool.query(dataQuery, dataParams);

        // Extract just the network names into an array
        const networks = dataResult.rows.map(row => row.network_name);

        return { networks, total };
    } catch (error) {
        console.error('Database error in getNetworks:', error);
        throw error;
    }
};

// ===================================================
// QUERY 9: GET DISTINCT STATUSES
// ===================================================
const getStatuses = async () => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT status
             FROM tv_shows
             WHERE status IS NOT NULL
             ORDER BY status ASC`
        );

        // Extract just the status values into an array
        const statuses = result.rows.map(row => row.status);

        return statuses;
    } catch (error) {
        console.error('Database error in getStatuses:', error);
        throw error;
    }
};

// ===================================================
// QUERY 10: ADVANCED SHOW SEARCH WITH FILTERS, PAGINATION, AND SORTING
// ===================================================
const getShows = async (filters = {}) => {
    try {
        const {
            q = '',
            genre = '',
            network = '',
            status = '',
            studio = '',
            actor = '',
            genre_id = '',
            network_id = '',
            studio_id = '',
            actor_id = '',
            match = 'all', // 'all' or 'any'
            page = 1,
            limit = 20,
            sort = 'id',
            order = 'asc'
        } = filters;

        const offset = (page - 1) * limit;
        const params = [];
        let paramIndex = 1;

        // Build WHERE conditions
        const conditions = [];

        // Search query (matches name or original_name)
        if (q) {
            params.push(`%${q}%`);
            conditions.push(`(tv.name ILIKE $${paramIndex} OR tv.original_name ILIKE $${paramIndex})`);
            paramIndex++;
        }

        // Status filter (exact match)
        if (status) {
            params.push(status);
            conditions.push(`tv.status = $${paramIndex}`);
            paramIndex++;
        }

        // Genre filter (name-based or ID-based)
        if (genre || genre_id) {
            const genreValues = genre_id ? genre_id.split(',').map(g => g.trim()) : genre.split(',').map(g => g.trim());
            const isIdBased = !!genre_id;

            if (isIdBased) {
                const genrePlaceholders = genreValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT sg.tv_show_id FROM show_genres sg
                    WHERE sg.genre_id IN (${genrePlaceholders})
                )`);
                params.push(...genreValues);
                paramIndex += genreValues.length;
            } else {
                const genrePlaceholders = genreValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT sg.tv_show_id FROM show_genres sg
                    JOIN genres g ON sg.genre_id = g.id
                    WHERE g.genre_name IN (${genrePlaceholders})
                )`);
                params.push(...genreValues);
                paramIndex += genreValues.length;
            }
        }

        // Network filter (name-based or ID-based)
        if (network || network_id) {
            const networkValues = network_id ? network_id.split(',').map(n => n.trim()) : network.split(',').map(n => n.trim());
            const isIdBased = !!network_id;

            if (isIdBased) {
                const networkPlaceholders = networkValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT sn.tv_show_id FROM show_networks sn
                    WHERE sn.network_id IN (${networkPlaceholders})
                )`);
                params.push(...networkValues);
                paramIndex += networkValues.length;
            } else {
                const networkPlaceholders = networkValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT sn.tv_show_id FROM show_networks sn
                    JOIN networks n ON sn.network_id = n.id
                    WHERE n.network_name IN (${networkPlaceholders})
                )`);
                params.push(...networkValues);
                paramIndex += networkValues.length;
            }
        }

        // Studio filter (name-based or ID-based)
        if (studio || studio_id) {
            const studioValues = studio_id ? studio_id.split(',').map(s => s.trim()) : studio.split(',').map(s => s.trim());
            const isIdBased = !!studio_id;

            if (isIdBased) {
                const studioPlaceholders = studioValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT ss.tv_show_id FROM show_studios ss
                    WHERE ss.studio_id IN (${studioPlaceholders})
                )`);
                params.push(...studioValues);
                paramIndex += studioValues.length;
            } else {
                const studioPlaceholders = studioValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT ss.tv_show_id FROM show_studios ss
                    JOIN studios s ON ss.studio_id = s.id
                    WHERE s.studio_name IN (${studioPlaceholders})
                )`);
                params.push(...studioValues);
                paramIndex += studioValues.length;
            }
        }

        // Actor filter (name-based or ID-based)
        if (actor || actor_id) {
            const actorValues = actor_id ? actor_id.split(',').map(a => a.trim()) : actor.split(',').map(a => a.trim());
            const isIdBased = !!actor_id;

            if (isIdBased) {
                const actorPlaceholders = actorValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT sa.tv_show_id FROM show_actors sa
                    WHERE sa.actor_id IN (${actorPlaceholders})
                )`);
                params.push(...actorValues);
                paramIndex += actorValues.length;
            } else {
                const actorPlaceholders = actorValues.map((_, i) => `$${paramIndex + i}`).join(',');
                conditions.push(`tv.id IN (
                    SELECT sa.tv_show_id FROM show_actors sa
                    JOIN actors a ON sa.actor_id = a.id
                    WHERE a.actor_name IN (${actorPlaceholders})
                )`);
                params.push(...actorValues);
                paramIndex += actorValues.length;
            }
        }

        // Build WHERE clause based on match logic
        let whereClause = '';
        if (conditions.length > 0) {
            const connector = match === 'any' ? ' OR ' : ' AND ';
            whereClause = `WHERE ${conditions.join(connector)}`;
        }

        // Validate and build ORDER BY clause
        const validSortFields = {
            'id': 'tv.id',
            'title': 'tv.name',
            'popularity': 'tv.popularity',
            'rating': 'tv.tmdb_rating',
            'first_air_date': 'tv.first_air_date',
            'last_air_date': 'tv.last_air_date',
            'episodes': 'tv.episodes'
        };
        const sortField = validSortFields[sort] || 'tv.id';
        const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
        const orderByClause = `ORDER BY ${sortField} ${sortOrder}`;

        // Get total count
        const countQuery = `
            SELECT COUNT(DISTINCT tv.id) as total
            FROM tv_shows tv
            ${whereClause}
        `;
        const countResult = await pool.query(countQuery, params);
        const total = parseInt(countResult.rows[0].total);

        // Get paginated data
        params.push(limit, offset);
        const dataQuery = `
            SELECT DISTINCT tv.*
            FROM tv_shows tv
            ${whereClause}
            ${orderByClause}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        const dataResult = await pool.query(dataQuery, params);

        return {
            shows: dataResult.rows,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    } catch (error) {
        console.error('Database error in getShows:', error);
        throw error;
    }
};

// ===================================================
// CREATE NEW TV SHOW
// ===================================================
const createShow = async (showData) => {
    try {
        const {
            id,
            name,
            original_name,
            first_air_date,
            last_air_date,
            seasons,
            episodes,
            status,
            overview,
            popularity,
            tmdb_rating,
            vote_count,
            poster_url,
            backdrop_url
        } = showData;

        // Check if show with this ID already exists
        const existingShow = await pool.query('SELECT id FROM tv_shows WHERE id = $1', [id]);
        if (existingShow.rows.length > 0) {
            throw new Error('SHOW_EXISTS');
        }

        // Insert new show
        const result = await pool.query(
            `INSERT INTO tv_shows (
                id, name, original_name, first_air_date, last_air_date,
                seasons, episodes, status, overview, popularity,
                tmdb_rating, vote_count, poster_url, backdrop_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *`,
            [
                id, name, original_name, first_air_date, last_air_date,
                seasons, episodes, status, overview, popularity,
                tmdb_rating, vote_count, poster_url, backdrop_url
            ]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Database error in createShow:', error);
        throw error;
    }
};

// ===================================================
// DELETE TV SHOW BY ID
// ===================================================
const deleteShow = async (showId) => {
    try {
        // First, check if the show exists
        const existingShow = await pool.query('SELECT id FROM tv_shows WHERE id = $1', [showId]);

        if (existingShow.rows.length === 0) {
            throw new Error('SHOW_NOT_FOUND');
        }

        // Delete the show (CASCADE should handle related records)
        const result = await pool.query(
            'DELETE FROM tv_shows WHERE id = $1 RETURNING id',
            [showId]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Database error in deleteShow:', error);
        throw error;
    }
};

// ===================================================
// UPDATE TV SHOW
// ===================================================
const updateShow = async (showId, updateData) => {
    try {
        // Check if show exists
        const existingShow = await pool.query('SELECT id FROM tv_shows WHERE id = $1', [showId]);
        if (existingShow.rows.length === 0) {
            throw new Error('SHOW_NOT_FOUND');
        }

        // Build dynamic UPDATE query
        const updates = [];
        const values = [];
        let paramIndex = 1;

        // Only update fields that are provided
        if (updateData.name !== undefined) {
            updates.push(`name = $${paramIndex}`);
            values.push(updateData.name);
            paramIndex++;
        }
        if (updateData.original_name !== undefined) {
            updates.push(`original_name = $${paramIndex}`);
            values.push(updateData.original_name);
            paramIndex++;
        }
        if (updateData.first_air_date !== undefined) {
            updates.push(`first_air_date = $${paramIndex}`);
            values.push(updateData.first_air_date);
            paramIndex++;
        }
        if (updateData.last_air_date !== undefined) {
            updates.push(`last_air_date = $${paramIndex}`);
            values.push(updateData.last_air_date);
            paramIndex++;
        }
        if (updateData.seasons !== undefined) {
            updates.push(`seasons = $${paramIndex}`);
            values.push(updateData.seasons);
            paramIndex++;
        }
        if (updateData.episodes !== undefined) {
            updates.push(`episodes = $${paramIndex}`);
            values.push(updateData.episodes);
            paramIndex++;
        }
        if (updateData.status !== undefined) {
            updates.push(`status = $${paramIndex}`);
            values.push(updateData.status);
            paramIndex++;
        }
        if (updateData.overview !== undefined) {
            updates.push(`overview = $${paramIndex}`);
            values.push(updateData.overview);
            paramIndex++;
        }
        if (updateData.popularity !== undefined) {
            updates.push(`popularity = $${paramIndex}`);
            values.push(updateData.popularity);
            paramIndex++;
        }
        if (updateData.tmdb_rating !== undefined) {
            updates.push(`tmdb_rating = $${paramIndex}`);
            values.push(updateData.tmdb_rating);
            paramIndex++;
        }
        if (updateData.vote_count !== undefined) {
            updates.push(`vote_count = $${paramIndex}`);
            values.push(updateData.vote_count);
            paramIndex++;
        }
        if (updateData.poster_url !== undefined) {
            updates.push(`poster_url = $${paramIndex}`);
            values.push(updateData.poster_url);
            paramIndex++;
        }
        if (updateData.backdrop_url !== undefined) {
            updates.push(`backdrop_url = $${paramIndex}`);
            values.push(updateData.backdrop_url);
            paramIndex++;
        }

        if (updates.length === 0) {
            throw new Error('NO_FIELDS_TO_UPDATE');
        }

        // Add WHERE clause parameter
        values.push(showId);

        const query = `
            UPDATE tv_shows
            SET ${updates.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Database error in updateShow:', error);
        throw error;
    }
};

// ===================================================
// CAST MANAGEMENT
// ===================================================

// ADD CAST MEMBER to a TV show
const addCastMember = async (showId, castData) => {
    try {
        const { actor_id, character_name } = castData;

        // Check if show exists
        const showExists = await pool.query('SELECT id FROM tv_shows WHERE id = $1', [showId]);
        if (showExists.rows.length === 0) {
            throw new Error('SHOW_NOT_FOUND');
        }

        // Check if actor exists
        const actorExists = await pool.query('SELECT id FROM actors WHERE id = $1', [actor_id]);
        if (actorExists.rows.length === 0) {
            throw new Error('ACTOR_NOT_FOUND');
        }

        // Check if cast member already exists for this show
        const existingCast = await pool.query(
            'SELECT * FROM show_actors WHERE tv_show_id = $1 AND actor_id = $2',
            [showId, actor_id]
        );
        if (existingCast.rows.length > 0) {
            throw new Error('CAST_MEMBER_EXISTS');
        }

        // Insert new cast member
        const result = await pool.query(
            'INSERT INTO show_actors (tv_show_id, actor_id, character_name) VALUES ($1, $2, $3) RETURNING *',
            [showId, actor_id, character_name]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Database error in addCastMember:', error);
        throw error;
    }
};

// UPDATE CAST MEMBER character name
const updateCastMember = async (showId, actorId, characterName) => {
    try {
        // Check if show exists
        const showExists = await pool.query('SELECT id FROM tv_shows WHERE id = $1', [showId]);
        if (showExists.rows.length === 0) {
            throw new Error('SHOW_NOT_FOUND');
        }

        // Check if cast member exists
        const existingCast = await pool.query(
            'SELECT * FROM show_actors WHERE tv_show_id = $1 AND actor_id = $2',
            [showId, actorId]
        );
        if (existingCast.rows.length === 0) {
            throw new Error('CAST_MEMBER_NOT_FOUND');
        }

        // Update character name
        const result = await pool.query(
            'UPDATE show_actors SET character_name = $1 WHERE tv_show_id = $2 AND actor_id = $3 RETURNING *',
            [characterName, showId, actorId]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Database error in updateCastMember:', error);
        throw error;
    }
};

// GET CAST for a TV show
const getCastByShowId = async (showId) => {
    try {
        const result = await pool.query(
            `SELECT sa.tv_show_id, sa.actor_id, sa.character_name, a.name as actor_name, a.profile_url
             FROM show_actors sa
             JOIN actors a ON sa.actor_id = a.id
             WHERE sa.tv_show_id = $1
             ORDER BY sa.actor_id`,
            [showId]
        );
        return result.rows;
    } catch (error) {
        console.error('Database error in getCastByShowId:', error);
        throw error;
    }
};

// DELETE CAST MEMBER from a TV show
const deleteCastMember = async (showId, actorId) => {
    try {
        // Check if show exists
        const showExists = await pool.query('SELECT id FROM tv_shows WHERE id = $1', [showId]);
        if (showExists.rows.length === 0) {
            throw new Error('SHOW_NOT_FOUND');
        }

        // Check if cast member exists
        const existingCast = await pool.query(
            'SELECT * FROM show_actors WHERE tv_show_id = $1 AND actor_id = $2',
            [showId, actorId]
        );
        if (existingCast.rows.length === 0) {
            throw new Error('CAST_MEMBER_NOT_FOUND');
        }

        // Delete cast member
        const result = await pool.query(
            'DELETE FROM show_actors WHERE tv_show_id = $1 AND actor_id = $2 RETURNING *',
            [showId, actorId]
        );

        return result.rows[0];
    } catch (error) {
        console.error('Database error in deleteCastMember:', error);
        throw error;
    }
};

// ===================================================
// EXPORTS
// ===================================================
module.exports = {
    getAllShows,
    getShowsByName,
    getShowsByGenre,
    getShowsByStatus,
    getShowById,
    getRandomShows,
    getGenres,
    getNetworks,
    getStatuses,
    getShows,
    createShow,
    updateShow,
    deleteShow,
    addCastMember,
    updateCastMember,
    getCastByShowId,
    deleteCastMember,
};
