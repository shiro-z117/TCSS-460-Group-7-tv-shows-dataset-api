// src/db/queries.ts
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

// Linda's endpoint: GET /api/studios
// Returns distinct studio names with pagination and search
const getStudios = async (q?: string, page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;
        let query = 'SELECT DISTINCT studio_name FROM public.studios ORDER BY studio_name';
        const params = [];
        
        if (q) {
            // Filter by search term (case-insensitive)
            query += ' WHERE studio_name ILIKE $1';
            params.push(`%${q}%`);
            query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);
        } else {
            // No filter, just pagination
            query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);
        }
        
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Database error in getStudios:', error);
        throw error;
    }
};

// export { getStudios }; // linda block for test

// ===================================================
// QUERY 2: GET SHOWS BY NAME (SEARCH)
// ===================================================
const getShowsByName = async (showName: string) => {
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
// For exact match: pass [genreName] and use "g.name ILIKE $1"
// For partial match: pass [`%${genreName}%`] and keep the wildcards
const getShowsByGenre = async (genreName: string) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT tv.id, tv.name, tv.original_name, tv.first_air_date,
              tv.seasons, tv.episodes, tv.status, tv.tmdb_rating
       FROM tv_shows tv
       JOIN show_genres sg ON tv.id = sg.show_id
       JOIN genres g ON sg.genre_id = g.id
       WHERE g.name ILIKE $1
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
const getShowsByStatus = async (status: string) => {
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
const getShowById = async (showId: string) => {
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
// QUERY 7: GET /api/years/first (Linda)
// ===================================================
// Returns distinct first air years with min/max filter
const getYearsFirst = async (min?: number, max?: number, page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;
        let query = 'SELECT DISTINCT EXTRACT(YEAR FROM first_air_date) as year FROM public.tv_shows WHERE first_air_date IS NOT NULL';
        const params = [];
        
        if (min) {
            query += ` AND EXTRACT(YEAR FROM first_air_date) >= $${params.length + 1}`;
            params.push(min);
        }
        
        if (max) {
            query += ` AND EXTRACT(YEAR FROM first_air_date) <= $${params.length + 1}`;
            params.push(max);
        }
        
        query += ` ORDER BY year DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
        
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Database error in getYearsFirst:', error);
        throw error;
    }
};

// ===================================================
// QUERY 8: GET /api/years/last (Linda)
// ===================================================
// Returns distinct last air years with min/max filter
const getYearsLast = async (min?: number, max?: number, page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;
        let query = 'SELECT DISTINCT EXTRACT(YEAR FROM last_air_date) as year FROM public.tv_shows WHERE last_air_date IS NOT NULL';
        const params = [];
        
        if (min) {
            query += ` AND EXTRACT(YEAR FROM last_air_date) >= $${params.length + 1}`;
            params.push(min);
        }
        
        if (max) {
            query += ` AND EXTRACT(YEAR FROM last_air_date) <= $${params.length + 1}`;
            params.push(max);
        }
        
        query += ` ORDER BY year DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
        
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Database error in getYearsLast:', error);
        throw error;
    }
};

// ===================================================
// QUERY 9: GET /api/seasons (Linda)
// ===================================================
// Returns distinct season counts
const getSeasons = async (page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;
        // Calculate pagination offset
        
        const query = 'SELECT DISTINCT seasons FROM public.tv_shows WHERE seasons IS NOT NULL ORDER BY seasons ASC LIMIT $1 OFFSET $2';
        // Get all distinct season counts, sorted ascending
        
        const result = await pool.query(query, [limit, offset]);
        // Execute query with pagination
        
        return result.rows;
        // Return: [{ seasons: 1 }, { seasons: 2 }, ...]
        
    } catch (error) {
        console.error('Database error in getSeasons:', error);
        throw error;
    }
};


// ===================================================
// EXPORTS
// ===================================================
// module.exports = { 
export {
    getAllShows,
    getShowsByName,
    getShowsByGenre,
    getShowsByStatus,
    getShowById,
    getRandomShows,
    getStudios,
    getYearsFirst,
    getYearsLast,
    getSeasons,
};
