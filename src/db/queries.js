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
// For exact match: pass [genreName] and use "g.name ILIKE $1"
// For partial match: pass [`%${genreName}%`] and keep the wildcards
const getShowsByGenre = async (genreName) => {
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
// EXPORTS
// ===================================================
module.exports = {
    getAllShows,
    getShowsByName,
    getShowsByGenre,
    getShowsByStatus,
    getShowById,
    getRandomShows,
};
