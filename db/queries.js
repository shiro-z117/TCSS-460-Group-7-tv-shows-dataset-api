// ===================================================
// DATABASE QUERY FUNCTIONS
// ===================================================
// Purpose: Reusable functions to query TV shows from Supabase
// Author: Linda Miao (Group Member 2)
// Date: Oct 17, 2025
// Note: Patrick will import these functions in his API routes

// Import the database connection pool from connection.js
const pool = require('./connection');

// ===================================================
// QUERY 1: GET ALL TV SHOWS
// ===================================================
// Purpose: Retrieve all TV shows from the database
// Returns: Array of all shows

const getAllShows = async () => {
  try {
    // Query: SELECT all columns FROM tv_shows table
    const result = await pool.query('SELECT * FROM tv_shows');
    
    // result.rows contains the data returned from database
    return result.rows;
  } catch (error) {
    // If query fails, log the error
    console.error('Database error in getAllShows:', error);
    throw error;
  }
};

// ===================================================
// QUERY 2: GET SHOWS BY NAME (SEARCH)
// ===================================================
// Purpose: Search for TV shows by name
// Parameter: showName (string) - the show name to search for
// Returns: Array of shows matching the search

const getShowsByName = async (showName) => {
  try {
    // ILIKE = case-insensitive search (ignores uppercase/lowercase)
    // %showName% = search for name anywhere in the title
    // $1 = placeholder for the parameter (prevents SQL injection)
    const result = await pool.query(
      'SELECT id, name, original_name, first_air_date, seasons, episodes, status, tmdb_rating FROM tv_shows WHERE name ILIKE $1 OR original_name ILIKE $1',
      [`%${showName}%`]  // Pass the search term as a parameter
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
// Purpose: Get TV shows by their genre
// Parameter: genreName (string) - the genre to filter by
// Returns: Array of shows in that genre

const getShowsByGenre = async (genreName) => {
  try {
    // JOIN: Connect tv_shows table with show_genres table
    // JOIN show_genres: Links shows to their genres
    // JOIN genres: Gets the genre name
    // DISTINCT: Only return each show once (no duplicates)
    const result = await pool.query(
      `SELECT DISTINCT tv.id, tv.name, tv.original_name, tv.first_air_date, 
              tv.seasons, tv.episodes, tv.status, tv.tmdb_rating
       FROM tv_shows tv
       JOIN show_genres sg ON tv.id = sg.show_id
       JOIN genres g ON sg.genre_id = g.id
       WHERE g.name ILIKE $1`,
      [`%${genreName}%`]  // Search for genre name
    );
    
    return result.rows;
  } catch (error) {
    console.error('Database error in getShowsByGenre:', error);
    throw error;
  }
};

// ===================================================
// QUERY 4: GET SHOWS BY STATUS (Ongoing/Ended)
// ===================================================
// Purpose: Filter shows by their status (e.g., "Returning Series", "Ended")
// Parameter: status (string) - the status to filter by
// Returns: Array of shows with that status

const getShowsByStatus = async (status) => {
  try {
    // Simple WHERE clause to filter by status column
    const result = await pool.query(
      'SELECT id, name, original_name, first_air_date, seasons, episodes, status, tmdb_rating FROM tv_shows WHERE status = $1',
      [status]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Database error in getShowsByStatus:', error);
    throw error;
  }
};

// ===================================================
// QUERY 5: GET SHOW BY ID (Get one specific show)
// ===================================================
// Purpose: Get detailed info about one specific show
// Parameter: showId (number) - the show ID
// Returns: Single show object with details

const getShowById = async (showId) => {
  try {
    // WHERE id = $1 finds the specific show by ID
    const result = await pool.query(
      'SELECT * FROM tv_shows WHERE id = $1',
      [showId]
    );
    
    // result.rows[0] gets the first (and only) result
    return result.rows[0];
  } catch (error) {
    console.error('Database error in getShowById:', error);
    throw error;
  }
};
// ===================================================
// QUERY 6: GET 10 RANDOM SHOWS
// ===================================================
// Purpose: Retrieve 10 random TV shows from the database
// Returns: Array of 10 randomly selected shows

const getRandomShows = async (limit = 10) => {
    try {
        // RANDOM(): randomly orders rows in PostgreSQL
        // LIMIT $1: only return 'limit' number of rows (default 10)
        const result = await pool.query(
            `SELECT id, name, original_name, first_air_date, last_air_date,
              seasons, episodes, status, overview, popularity,
              tmdb_rating, vote_count, poster_url, backdrop_url
       FROM tv_shows
       ORDER BY RANDOM()
       LIMIT $1;`,
            [limit] // use parameter to make it flexible (prevents SQL injection)
        );

        return result.rows;
    } catch (error) {
        console.error('Database error in getRandomShows:', error);
        throw error;
    }
};
// ===================================================
// EXPORT ALL QUERY FUNCTIONS
// ===================================================
// Patrick will import these like:
// const { getAllShows, getShowsByGenre } = require('./db/queries');

module.exports = {
    getAllShows,
    getShowsByName,
    getShowsByGenre,
    getShowsByStatus,
    getShowById,
    getRandomShows // ✅ add this
};
