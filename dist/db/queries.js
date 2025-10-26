"use strict";
// src/db/queries.js
// ===================================================
// DATABASE QUERY FUNCTIONS
// ===================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShowCast = exports.getShowImages = exports.getHealth = exports.getRandomShow = exports.getShows = exports.getStatuses = exports.getNetworks = exports.getGenres = exports.getRandomShows = exports.getShowById = exports.getShowsByStatus = exports.getShowsByGenre = exports.getShowsByName = exports.getAllShows = void 0;
const pool = require('./connection');
// ===================================================
// QUERY 1: GET ALL TV SHOWS
// ===================================================
const getAllShows = async () => {
    try {
        const result = await pool.query('SELECT * FROM tv_shows ORDER BY id');
        return result.rows;
    }
    catch (error) {
        console.error('Database error in getAllShows:', error);
        throw error;
    }
};
exports.getAllShows = getAllShows;
// ===================================================
// QUERY 2: GET SHOWS BY NAME (SEARCH)
// ===================================================
const getShowsByName = async (showName) => {
    try {
        const result = await pool.query(`SELECT id, name, original_name, first_air_date, seasons, episodes, status, tmdb_rating
       FROM tv_shows
       WHERE name ILIKE $1 OR original_name ILIKE $1`, [`%${showName}%`]);
        return result.rows;
    }
    catch (error) {
        console.error('Database error in getShowsByName:', error);
        throw error;
    }
};
exports.getShowsByName = getShowsByName;
// ===================================================
// QUERY 3: GET SHOWS BY GENRE
// ===================================================
// For exact match: pass [genreName] and use "g.genre_name ILIKE $1"
// For partial match: pass [`%${genreName}%`] and keep the wildcards
const getShowsByGenre = async (genreName) => {
    try {
        const result = await pool.query(`SELECT DISTINCT tv.id, tv.name, tv.original_name, tv.first_air_date,
              tv.seasons, tv.episodes, tv.status, tv.tmdb_rating
       FROM tv_shows tv
       JOIN show_genres sg ON tv.id = sg.tv_show_id
       JOIN genres g ON sg.genre_id = g.id
       WHERE g.genre_name ILIKE $1
       ORDER BY tv.id`, [genreName] // use [`%${genreName}%`] if you want partials
        );
        return result.rows;
    }
    catch (error) {
        console.error('Database error in getShowsByGenre:', error);
        throw error;
    }
};
exports.getShowsByGenre = getShowsByGenre;
// ===================================================
// QUERY 4: GET SHOWS BY STATUS (Ongoing/Ended/etc.)
// ===================================================
const getShowsByStatus = async (status) => {
    try {
        const result = await pool.query(`SELECT id, name, original_name, first_air_date, seasons, episodes, status, tmdb_rating
       FROM tv_shows
       WHERE status = $1
       ORDER BY id`, [status]);
        return result.rows;
    }
    catch (error) {
        console.error('Database error in getShowsByStatus:', error);
        throw error;
    }
};
exports.getShowsByStatus = getShowsByStatus;
// ===================================================
// QUERY 5: GET SHOW BY ID
// ===================================================
const getShowById = async (showId) => {
    try {
        const result = await pool.query('SELECT * FROM tv_shows WHERE id = $1', [showId]);
        return result.rows[0] || null;
    }
    catch (error) {
        console.error('Database error in getShowById:', error);
        throw error;
    }
};
exports.getShowById = getShowById;
// ===================================================
// QUERY 6: GET N RANDOM SHOWS (default 10)
// ===================================================
const getRandomShows = async (limit = 10) => {
    try {
        const result = await pool.query(`SELECT id, name, original_name, first_air_date, last_air_date,
              seasons, episodes, status, overview, popularity,
              tmdb_rating, vote_count, poster_url, backdrop_url
       FROM tv_shows
       ORDER BY RANDOM()
       LIMIT $1`, [limit]);
        return result.rows;
    }
    catch (error) {
        console.error('Database error in getRandomShows:', error);
        throw error;
    }
};
exports.getRandomShows = getRandomShows;
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
    }
    catch (error) {
        console.error('Database error in getGenres:', error);
        throw error;
    }
};
exports.getGenres = getGenres;
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
    }
    catch (error) {
        console.error('Database error in getNetworks:', error);
        throw error;
    }
};
exports.getNetworks = getNetworks;
// ===================================================
// QUERY 9: GET DISTINCT STATUSES
// ===================================================
const getStatuses = async () => {
    try {
        const result = await pool.query(`SELECT DISTINCT status
             FROM tv_shows
             WHERE status IS NOT NULL
             ORDER BY status ASC`);
        // Extract just the status values into an array
        const statuses = result.rows.map(row => row.status);
        return statuses;
    }
    catch (error) {
        console.error('Database error in getStatuses:', error);
        throw error;
    }
};
exports.getStatuses = getStatuses;
// ===================================================
// QUERY 10: ADVANCED SHOW SEARCH WITH FILTERS, PAGINATION, AND SORTING
// ===================================================
const getShows = async (filters = {}) => {
    try {
        const { q = '', genre = '', network = '', status = '', studio = '', actor = '', genre_id = '', network_id = '', studio_id = '', actor_id = '', match = 'all', // 'all' or 'any'
        page = 1, limit = 20, sort = 'id', order = 'asc' } = filters;
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
            }
            else {
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
            }
            else {
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
            }
            else {
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
            }
            else {
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
    }
    catch (error) {
        console.error('Database error in getShows:', error);
        throw error;
    }
};
exports.getShows = getShows;
// ===================================================
// QUERY 11: GET ONE RANDOM SHOW
// ===================================================
const getRandomShow = async () => {
    try {
        const result = await pool.query('SELECT * FROM tv_shows ORDER BY RANDOM() LIMIT 1');
        return result.rows[0] || null;
    }
    catch (error) {
        console.error('Database error in getRandomShow:', error);
        throw error;
    }
};
exports.getRandomShow = getRandomShow;
// ===================================================
// QUERY 12: GET SERVICE HEALTH STATUS
// ===================================================
// GET /api/health
const getHealth = async () => {
    try {
        // test db connection
        const result = await pool.query('SELECT NOW()');
        // Get server uptime (in seconds)
        const uptime = process.uptime();
        // if query succeeds, DB is oke
        return {
            status: 'ok',
            db: 'ok',
            uptime: Math.round(uptime * 100) / 100 // Round to 2 decimals
        };
    }
    catch (error) {
        // If query fails, DB is down
        console.error('Database error in getHealth:', error);
        return {
            status: 'error',
            db: 'down',
            uptime: Math.round(process.uptime() * 100) / 100
        };
    }
};
exports.getHealth = getHealth;
// ===================================================
// QUERY 13: GET SHOW IMAGES
// ===================================================
// GET /api/shows/:id/images
// returns images/poster of shows from tv_shows table w pagination
const getShowImages = async (showId, type, page = 1, limit = 20) => {
    try {
        console.log('getShowImages called with showId:', showId, 'type:', type, 'page:', page, 'limit:', limit);
        // query tv_shows table for poster_url & backdrop_url
        const query = 'SELECT id, poster_url, backdrop_url FROM public.tv_shows WHERE id = $1';
        const result = await pool.query(query, [showId]);
        console.log('Query result rows:', result.rows.length);
        if (result.rows.length === 0) {
            console.log('No show found with id:', showId);
            return [];
        }
        const show = result.rows[0];
        console.log('Show data:', show);
        const images = [];
        // adds poster if exists
        if (show.poster_url && show.poster_url.trim() !== '') {
            images.push({
                id: show.id + '_poster',
                type: 'poster',
                url: show.poster_url,
                width: 1000,
                height: 1500
            });
        }
        // adds backdrop if exists
        if (show.backdrop_url && show.backdrop_url.trim() !== '') {
            images.push({
                id: show.id + '_backdrop',
                type: 'backdrop',
                url: show.backdrop_url,
                width: 1920,
                height: 1080
            });
        }
        console.log('Images found before filter:', images.length);
        // filter by type if specified
        let filteredImages = images;
        if (type) {
            filteredImages = images.filter(img => img.type === type);
        }
        // add in pagination
        const offset = (page - 1) * limit;
        const paginatedImages = filteredImages.slice(offset, offset + limit);
        console.log('Images after pagination:', paginatedImages.length);
        return paginatedImages;
    }
    catch (error) {
        console.error('Database error in getShowImages:', error);
        throw error;
    }
};
exports.getShowImages = getShowImages;
// ===================================================
// QUERY 14: GET SHOW CAST MEMBERS
// ===================================================
// GET /api/shows/:id/cast
// Returns cast members for a show with pagination
const getShowCast = async (showId, page = 1, limit = 10) => {
    try {
        console.log('getShowCast called with showId:', showId, 'page:', page, 'limit:', limit);
        // calc tge pagination offset
        const offset = (page - 1) * limit;
        // join show_actors w actors table to get full info
        const query = `
            SELECT 
                sa.id,
                sa.character_name AS character,
                sa.actor_order AS "order",
                a.actor_name AS person_name,
                a.profile_url
            FROM public.show_actors sa
            JOIN public.actors a ON sa.actor_id = a.id
            WHERE sa.tv_show_id = $1
            ORDER BY sa.actor_order
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [showId, limit, offset]);
        console.log('Cast members found:', result.rows.length);
        return result.rows;
    }
    catch (error) {
        console.error('Database error in getShowCast:', error);
        throw error;
    }
};
exports.getShowCast = getShowCast;
