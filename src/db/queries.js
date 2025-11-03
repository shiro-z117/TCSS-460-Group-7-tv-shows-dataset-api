// src/db/queries.js
// ===================================================
// DATABASE QUERY FUNCTIONS
// ===================================================

const pool = require("./connection");


// ===================================================
// GET SERVICE HEALTH STATUS
// ===================================================
export const getHealth = async () => {
  try {
    // test db connection
    const result = await pool.query("SELECT NOW()");

    // Get server uptime (in seconds)
    const uptime = process.uptime();

    // if query succeeds, DB is oke
    return {
      status: "ok",
      db: "ok",
      uptime: Math.round(uptime * 100) / 100, // Round to 2 decimals
    };
  } catch (error) {
    // If query fails, DB is down
    console.error("Database error in getHealth:", error);
    return {
      status: "error",
      db: "down",
      uptime: Math.round(process.uptime() * 100) / 100,
    };
  }
};


// ===================================================
// ADVANCED SHOW BROWSE/SEARCH WITH FILTERS, PAGINATION, AND SORTING
// ===================================================
export const getShows = async (filters = {}) => {
  try {
    const {
      q = "",
      genre = "",
      network = "",
      status = "",
      studio = "",
      actor = "",
      genre_id = "",
      network_id = "",
      studio_id = "",
      actor_id = "",
      match = "all", // 'all' or 'any'
      page = 1,
      limit = 20,
      sort = "id",
      order = "asc",
    } = filters;

    const offset = (page - 1) * limit;
    const params = [];
    let paramIndex = 1;

    // Build WHERE conditions
    const conditions = [];

    // Search query (matches name or original_name)
    if (q) {
      params.push(`%${q}%`);
      conditions.push(
        `(tv.name ILIKE $${paramIndex} OR tv.original_name ILIKE $${paramIndex})`
      );
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
      const genreValues = genre_id
        ? genre_id.split(",").map((g) => g.trim())
        : genre.split(",").map((g) => g.trim());
      const isIdBased = !!genre_id;

      if (isIdBased) {
        const genrePlaceholders = genreValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
        conditions.push(`tv.id IN (
                    SELECT sg.tv_show_id FROM show_genres sg
                    WHERE sg.genre_id IN (${genrePlaceholders})
                )`);
        params.push(...genreValues);
        paramIndex += genreValues.length;
      } else {
        const genrePlaceholders = genreValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
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
      const networkValues = network_id
        ? network_id.split(",").map((n) => n.trim())
        : network.split(",").map((n) => n.trim());
      const isIdBased = !!network_id;

      if (isIdBased) {
        const networkPlaceholders = networkValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
        conditions.push(`tv.id IN (
                    SELECT sn.tv_show_id FROM show_networks sn
                    WHERE sn.network_id IN (${networkPlaceholders})
                )`);
        params.push(...networkValues);
        paramIndex += networkValues.length;
      } else {
        const networkPlaceholders = networkValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
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
      const studioValues = studio_id
        ? studio_id.split(",").map((s) => s.trim())
        : studio.split(",").map((s) => s.trim());
      const isIdBased = !!studio_id;

      if (isIdBased) {
        const studioPlaceholders = studioValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
        conditions.push(`tv.id IN (
                    SELECT ss.tv_show_id FROM show_studios ss
                    WHERE ss.studio_id IN (${studioPlaceholders})
                )`);
        params.push(...studioValues);
        paramIndex += studioValues.length;
      } else {
        const studioPlaceholders = studioValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
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
      const actorValues = actor_id
        ? actor_id.split(",").map((a) => a.trim())
        : actor.split(",").map((a) => a.trim());
      const isIdBased = !!actor_id;

      if (isIdBased) {
        const actorPlaceholders = actorValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
        conditions.push(`tv.id IN (
                    SELECT sa.tv_show_id FROM show_actors sa
                    WHERE sa.actor_id IN (${actorPlaceholders})
                )`);
        params.push(...actorValues);
        paramIndex += actorValues.length;
      } else {
        const actorPlaceholders = actorValues
          .map((_, i) => `$${paramIndex + i}`)
          .join(",");
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
    let whereClause = "";
    if (conditions.length > 0) {
      const connector = match === "any" ? " OR " : " AND ";
      whereClause = `WHERE ${conditions.join(connector)}`;
    }

    // Validate and build ORDER BY clause
    const validSortFields = {
      id: "tv.id",
      title: "tv.name",
      popularity: "tv.popularity",
      rating: "tv.tmdb_rating",
      first_air_date: "tv.first_air_date",
      last_air_date: "tv.last_air_date",
      episodes: "tv.episodes",
    };
    const sortField = validSortFields[sort] || "tv.id";
    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";
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
      SELECT DISTINCT 
        tv.*,
        (SELECT ARRAY_AGG(g.genre_name)
         FROM show_genres sg
         JOIN genres g ON sg.genre_id = g.id
         WHERE sg.tv_show_id = tv.id) as genres
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
      limit: parseInt(limit),
    };
  } catch (error) {
    console.error("Database error in getShows:", error);
    throw error;
  }
};


// ===================================================
// GET SHOW BY ID (RETURNS FULL DETAILS)
// ===================================================
export const getShowById = async (showId) => {
  try {
    const query = `
      SELECT 
        ts.id,
        ts.name,
        ts.original_name,
        ts.first_air_date,
        ts.last_air_date,
        ts.seasons,
        ts.episodes,
        ts.status,
        ts.overview,
        ts.popularity,
        ts.tmdb_rating,
        ts.vote_count,
        ts.poster_url,
        ts.backdrop_url,
        -- Genres
        (SELECT ARRAY_AGG(DISTINCT g.genre_name)
         FROM show_genres sg
         JOIN genres g ON sg.genre_id = g.id
         WHERE sg.tv_show_id = ts.id) as genres,
        -- Actors with character names
        (SELECT JSON_AGG(jsonb_build_object(
           'actor_name', a.actor_name,
           'character_name', sa.character_name,
           'profile_url', a.profile_url
         ))
         FROM show_actors sa
         JOIN actors a ON sa.actor_id = a.id
         WHERE sa.tv_show_id = ts.id) as actors,
        -- Creators
        (SELECT ARRAY_AGG(DISTINCT c.creator_name)
         FROM show_creators sc
         JOIN creators c ON sc.creator_id = c.id
         WHERE sc.tv_show_id = ts.id) as creators,
        -- Networks
        (SELECT JSON_AGG(DISTINCT jsonb_build_object(
           'network_name', n.network_name,
           'logo_url', n.logo_url,
           'country', n.country
         ))
         FROM show_networks sn
         JOIN networks n ON sn.network_id = n.id
         WHERE sn.tv_show_id = ts.id) as networks,
        -- Studios
        (SELECT JSON_AGG(DISTINCT jsonb_build_object(
           'studio_name', st.studio_name,
           'logo_url', st.logo_url,
           'country', st.country
         ))
         FROM show_studios ss
         JOIN studios st ON ss.studio_id = st.id
         WHERE ss.tv_show_id = ts.id) as studios
      FROM tv_shows ts
      WHERE ts.id = $1
    `;

    const result = await pool.query(query, [showId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Database error in getShowById:", error);
    throw error;
  }
};


// ===================================================
// GET LIST OF STATUS TYPES
// ===================================================
export const getStatuses = async (searchQuery = "", page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    // Optional WHERE clause if a search term is provided
    const whereClause = searchQuery ? "WHERE name ILIKE $1" : "";
    const searchParam = searchQuery ? `%${searchQuery}%` : null;

    // Get total count
    const countQuery = `SELECT COUNT(*) AS total FROM statuses ${whereClause}`;
    const countParams = searchQuery ? [searchParam] : [];
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated statuses
    const dataQuery = `
      SELECT name
      FROM statuses
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${searchQuery ? 2 : 1} OFFSET $${searchQuery ? 3 : 2}
    `;
    const dataParams = searchQuery
      ? [searchParam, limit, offset]
      : [limit, offset];
    const dataResult = await pool.query(dataQuery, dataParams);

    // Extract names into an array
    const statuses = dataResult.rows.map((row) => row.name);

    // Return formatted response
    return {
      statuses,
      page,
      limit,
      total,
    };
  } catch (error) {
    console.error("Database error in getStatuses:", error);
    throw error;
  }
};


// ===================================================
// GET LIST OF GENRES
// ===================================================
export const getGenres = async (searchQuery = "", page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    // Build the WHERE clause for optional search
    const whereClause = searchQuery ? "WHERE genre_name ILIKE $1" : "";
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
    const genres = dataResult.rows.map((row) => row.genre_name);

    return { genres, total };
  } catch (error) {
    console.error("Database error in getGenres:", error);
    throw error;
  }
};


// ===================================================
// GET LIST OF NETWORKS
// ===================================================
export const getNetworks = async (searchQuery = "", page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    // Build the WHERE clause for optional search
    const whereClause = searchQuery ? "WHERE network_name ILIKE $1" : "";
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
    const networks = dataResult.rows.map((row) => row.network_name);

    return { networks, total };
  } catch (error) {
    console.error("Database error in getNetworks:", error);
    throw error;
  }
};


// ===================================================
// GET LIST OF STUDIOS
// ===================================================
export const getStudios = async (q = "", page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    // Build WHERE clause
    const whereClause = q ? "WHERE studio_name ILIKE $1" : "";
    const searchParam = q ? `%${q}%` : null;

    // Count total results
    const countQuery = `SELECT COUNT(DISTINCT studio_name) AS total FROM public.studios ${whereClause}`;
    const countParams = q ? [searchParam] : [];
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // Fetch paginated studio names
    const dataQuery = `
      SELECT DISTINCT studio_name
      FROM public.studios
      ${whereClause}
      ORDER BY studio_name ASC
      LIMIT $${q ? 2 : 1} OFFSET $${q ? 3 : 2}
    `;
    const dataParams = q ? [searchParam, limit, offset] : [limit, offset];
    const dataResult = await pool.query(dataQuery, dataParams);

    // Map to array of names
    const studios = dataResult.rows.map((row) => row.studio_name);

    // Return consistent structure
    return {
      studios,
      page,
      limit,
      total,
    };
  } catch (error) {
    console.error("Database error in getStudios:", error);
    throw error;
  }
};


// ===================================================
// GET LIST OF FIRST AIR YEARS WITH OPTIONAL MIN/MAX FILTERS
// ===================================================
export const getYearsFirst = async (min, max, page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    // Get the min and max years in the table
    const rangeQuery = `
      SELECT 
        MIN(EXTRACT(YEAR FROM first_air_date)) AS min_year,
        MAX(EXTRACT(YEAR FROM first_air_date)) AS max_year
      FROM public.tv_shows
      WHERE first_air_date IS NOT NULL
    `;
    const rangeResult = await pool.query(rangeQuery);
    const tableMin = parseInt(rangeResult.rows[0].min_year);
    const tableMax = parseInt(rangeResult.rows[0].max_year);

    // Apply optional min/max filters
    const finalMin = min ? Math.max(min, tableMin) : tableMin;
    const finalMax = max ? Math.min(max, tableMax) : tableMax;

    // Build full array of years
    const allYears = [];
    for (let y = finalMax; y >= finalMin; y--) {
      allYears.push(y);
    }

    // Paginate
    const paginatedYears = allYears.slice(offset, offset + limit);
    const total = allYears.length;

    return {
      data: paginatedYears,
      page,
      limit,
      total,
    };
  } catch (error) {
    console.error("Database error in getYearsFirst:", error);
    throw error;
  }
};


// ===================================================
// GET LIST OF LAST AIR YEARS WITH OPTIONAL MIN/MAX FILTERS
// ===================================================
export const getYearsLast = async (min, max, page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    // Get the min and max years in the table
    const rangeQuery = `
      SELECT 
        MIN(EXTRACT(YEAR FROM last_air_date)) AS min_year,
        MAX(EXTRACT(YEAR FROM last_air_date)) AS max_year
      FROM public.tv_shows
      WHERE last_air_date IS NOT NULL
    `;
    const rangeResult = await pool.query(rangeQuery);
    const tableMin = parseInt(rangeResult.rows[0].min_year);
    const tableMax = parseInt(rangeResult.rows[0].max_year);

    // Apply optional min/max filters
    const finalMin = min ? Math.max(min, tableMin) : tableMin;
    const finalMax = max ? Math.min(max, tableMax) : tableMax;

    // Build full array of years
    const allYears = [];
    for (let y = finalMax; y >= finalMin; y--) {
      allYears.push(y);
    }

    // Paginate
    const paginatedYears = allYears.slice(offset, offset + limit);
    const total = allYears.length;

    return {
      data: paginatedYears,
      page,
      limit,
      total,
    };
  } catch (error) {
    console.error("Database error in getYearsLast:", error);
    throw error;
  }
};


// ===================================================
// GET LIST OF EPISODE COUNTS WITH OPTIONAL MIN/MAX FILTERS
// ===================================================
export const getEpisodes = async (min, max, page = 1, limit = 50) => {
  try {
    const offset = (page - 1) * limit;

    // Get the min and max episodes in the table
    const rangeQuery = `
      SELECT 
        MIN(episodes) AS min_episodes,
        MAX(episodes) AS max_episodes
      FROM public.tv_shows
      WHERE episodes IS NOT NULL
    `;
    const rangeResult = await pool.query(rangeQuery);
    const tableMin = parseInt(rangeResult.rows[0].min_episodes);
    const tableMax = parseInt(rangeResult.rows[0].max_episodes);

    // Apply optional min/max filters
    const finalMin = min ? Math.max(min, tableMin) : tableMin;
    const finalMax = max ? Math.min(max, tableMax) : tableMax;

    // Build full array of episodes
    const allCounts = [];
    for (let y = finalMax; y >= finalMin; y--) {
      allCounts.push(y);
    }

    // Paginate
    const paginatedEpisodes = allCounts.slice(offset, offset + limit);
    const total = allCounts.length;

    return {
      data: paginatedEpisodes,
      page,
      limit,
      total,
    };
  } catch (error) {
    console.error("Database error in getEpisodes:", error);
    throw error;
  }
};


// ===================================================
// GET SHOW IMAGES
// ===================================================
export const getShowImages = async (showId, type, page = 1, limit = 20) => {
  try {
    console.log(
      "getShowImages called with showId:",
      showId,
      "type:",
      type,
      "page:",
      page,
      "limit:",
      limit
    );

    // query tv_shows table for poster_url & backdrop_url
    const query =
      "SELECT id, poster_url, backdrop_url FROM public.tv_shows WHERE id = $1";
    const result = await pool.query(query, [showId]);

    console.log("Query result rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("No show found with id:", showId);
      return [];
    }

    const show = result.rows[0];
    console.log("Show data:", show);

    const images = [];

    // adds poster if exists
    if (show.poster_url && show.poster_url.trim() !== "") {
      images.push({
        id: show.id + "_poster",
        type: "poster",
        url: show.poster_url,
        width: 1000,
        height: 1500,
      });
    }

    // adds backdrop if exists
    if (show.backdrop_url && show.backdrop_url.trim() !== "") {
      images.push({
        id: show.id + "_backdrop",
        type: "backdrop",
        url: show.backdrop_url,
        width: 1920,
        height: 1080,
      });
    }

    console.log("Images found before filter:", images.length);

    // filter by type if specified
    let filteredImages = images;
    if (type) {
      filteredImages = images.filter((img) => img.type === type);
    }

    // add in pagination
    const offset = (page - 1) * limit;
    const paginatedImages = filteredImages.slice(offset, offset + limit);

    console.log("Images after pagination:", paginatedImages.length);

    return paginatedImages;
  } catch (error) {
    console.error("Database error in getShowImages:", error);
    throw error;
  }
};


// ===================================================
// GET SHOW CAST MEMBERS
// ===================================================
export const getShowCast = async (showId, page = 1, limit = 10) => {
  try {
    console.log(
      "getShowCast called with showId:",
      showId,
      "page:",
      page,
      "limit:",
      limit
    );

    // calc tge pagination offset
    const offset = (page - 1) * limit;

    // join show_actors w actors table to get full info
    const query = `
            SELECT 
                sa.id AS uuid,
                sa.character_name AS character,
                a.id AS actor_id,
                a.actor_name AS person_name,
                a.profile_url
            FROM public.show_actors sa
            JOIN public.actors a ON sa.actor_id = a.id
            WHERE sa.tv_show_id = $1
            LIMIT $2 OFFSET $3
        `;

    const result = await pool.query(query, [showId, limit, offset]);

    console.log("Cast members found:", result.rows.length);

    return result.rows;
  } catch (error) {
    console.error("Database error in getShowCast:", error);
    throw error;
  }
};


// ===================================================
// DELETE TV SHOW BY ID
// ===================================================
export const deleteShow = async (showId) => {
  try {
    // First, check if the show exists
    const existingShow = await pool.query(
      "SELECT id FROM tv_shows WHERE id = $1",
      [showId]
    );

    if (existingShow.rows.length === 0) {
      throw new Error("SHOW_NOT_FOUND");
    }

    // Delete the show (CASCADE should handle related records)
    const result = await pool.query(
      "DELETE FROM tv_shows WHERE id = $1 RETURNING *",
      [showId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in deleteShow:", error);
    throw error;
  }
};


// ===================================================
// DELETE ACTOR BY ID
// ===================================================
export const deleteActor = async (actorId) => {
  try {
    const existingActor = await pool.query(
      "SELECT id FROM actors WHERE id = $1",
      [actorId]
    );

    if (existingActor.rows.length === 0) {
      throw new Error("ACTOR_NOT_FOUND");
    }

    const result = await pool.query(
      "DELETE FROM actors WHERE id = $1 RETURNING *",
      [actorId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in deleteActor:", error);
    throw error;
  }
};


// ===================================================
// DELETE NETWORK BY ID
// ===================================================
export const deleteNetwork = async (networkId) => {
  try {
    const existingNetwork = await pool.query(
      "SELECT id FROM networks WHERE id = $1",
      [networkId]
    );

    if (existingNetwork.rows.length === 0) {
      throw new Error("NETWORK_NOT_FOUND");
    }

    const result = await pool.query(
      "DELETE FROM networks WHERE id = $1 RETURNING *",
      [networkId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in deleteNetwork:", error);
    throw error;
  }
};


// ===================================================
// DELETE STUDIO BY ID
// ===================================================
export const deleteStudio = async (studioId) => {
  try {
    const existingStudio = await pool.query(
      "SELECT id FROM studios WHERE id = $1",
      [studioId]
    );

    if (existingStudio.rows.length === 0) {
      throw new Error("STUDIO_NOT_FOUND");
    }

    const result = await pool.query(
      "DELETE FROM studios WHERE id = $1 RETURNING *",
      [studioId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in deleteStudio:", error);
    throw error;
  }
};


// ===================================================
// DELETE CREATOR BY ID
// ===================================================
export const deleteCreator = async (creatorId) => {
  try {
    const existingCreator = await pool.query(
      "SELECT id FROM creators WHERE id = $1",
      [creatorId]
    );

    if (existingCreator.rows.length === 0) {
      throw new Error("CREATOR_NOT_FOUND");
    }

    const result = await pool.query(
      "DELETE FROM creators WHERE id = $1 RETURNING *",
      [creatorId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in deleteCreator:", error);
    throw error;
  }
};


// ===================================================
// CREATE NEW TV SHOW
// ===================================================
export const createShow = async (showData) => {
  const {
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
    backdrop_url,
    genres = [],
    actors = [],
    creators = [],
    networks = [],
    studios = [],
  } = showData;

  try {
    // Generate unique ID for new show
    const { rows: idRows } = await pool.query('SELECT MAX(id) AS max_id FROM tv_shows');
    const id = (idRows[0].max_id || 0) + 1;

    // Insert into tv_shows
    const result = await pool.query(
      `INSERT INTO tv_shows (
        id, name, original_name, first_air_date, last_air_date,
        seasons, episodes, status, overview, popularity,
        tmdb_rating, vote_count, poster_url, backdrop_url
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        id, name, original_name, first_air_date, last_air_date,
        seasons, episodes, status, overview, popularity,
        tmdb_rating, vote_count, poster_url, backdrop_url
      ]
    );

    const newShow = result.rows[0];

    // Handle genres
    const uniqueGenres = [...new Set(genres)];
    for (const genreName of uniqueGenres) {
      const { rows: genreRows } = await pool.query(
        'SELECT id FROM genres WHERE genre_name = $1',
        [genreName]
      );
      if (genreRows.length > 0) {
        await pool.query(
          'INSERT INTO show_genres (id, tv_show_id, genre_id) VALUES (gen_random_uuid(), $1, $2)',
          [newShow.id, genreRows[0].id]
        );
      }
    }

    // Helper nested function for each type
    const handleAssociations = async (items, type) => {
      const tableMap = {
        actor: { table: 'actors', junction: 'show_actors', idField: 'actor_id', nameField: 'actor_name', extraFields: ['profile_url'] },
        creator: { table: 'creators', junction: 'show_creators', idField: 'creator_id', nameField: 'creator_name', extraFields: [] },
        network: { table: 'networks', junction: 'show_networks', idField: 'network_id', nameField: 'network_name', extraFields: ['logo_url', 'country'] },
        studio: { table: 'studios', junction: 'show_studios', idField: 'studio_id', nameField: 'studio_name', extraFields: ['logo_url', 'country'] },
      };
      const { table, junction, idField, nameField, extraFields } = tableMap[type];

      // IDs-only mode
      const invalidIds = [];
      const idsOnly = items.every(i => 'id' in i && Object.keys(i).length === 1);

      if (idsOnly) {
        for (const item of items) {
          const { rows } = await pool.query(`SELECT id FROM ${table} WHERE id = $1`, [item.id]);
          if (rows.length === 0) invalidIds.push(item.id);
          else {
            await pool.query(
              `INSERT INTO ${junction} (id, tv_show_id, ${idField}) VALUES (gen_random_uuid(), $1, $2)`,
              [newShow.id, item.id]
            );
          }
        }
        if (invalidIds.length) throw new Error(`Invalid IDs for ${type}: ${invalidIds.join(', ')}`);
        return;
      }

      // Full object mode
      for (const item of items) {
        const trimmedName = item[nameField]?.trim();
        if (!trimmedName) continue; // skip invalid
        // Check if exists
        const { rows: existingRows } = await pool.query(`SELECT * FROM ${table} WHERE ${nameField} = $1`, [trimmedName]);
        let rowId;
        if (existingRows.length > 0) {
          rowId = existingRows[0].id;
        } else {
          // Validate country for networks/studios
          if ((type === 'network' || type === 'studio') && item.country) {
            const { rows: countryRows } = await pool.query('SELECT country_code FROM countries');
            const validCountries = countryRows.map(r => r.country_code);
            if (!validCountries.includes(item.country)) {
              throw new Error(`Invalid country for ${type}: ${item.country}. Valid values: ${validCountries.join(', ')}`);
            }
          }
          // Create new row
          const fieldList = [nameField, ...extraFields];
          const valueList = [trimmedName, ...extraFields.map(f => item[f] || null)];
          const placeholders = fieldList.map((_, idx) => `$${idx + 1}`).join(',');
          const insertQuery = `INSERT INTO ${table} (${fieldList.join(',')}) VALUES (${placeholders}) RETURNING id`;
          const { rows: insertedRows } = await pool.query(insertQuery, valueList);
          rowId = insertedRows[0].id;
        }
        // Insert into junction
        await pool.query(
          `INSERT INTO ${junction} (id, tv_show_id, ${idField}) VALUES (gen_random_uuid(), $1, $2)`,
          [newShow.id, rowId]
        );
      }
    };
    
    // Process optional arrays
    if (actors.length > 10) throw new Error("Maximum of 10 actors allowed");
    await handleAssociations(actors, 'actor');
    await handleAssociations(creators, 'creator');
    await handleAssociations(networks, 'network');
    await handleAssociations(studios, 'studio');

    return newShow;

  } catch (error) {
    console.error("Database error in createShow:", error);
    throw error;
  }
};


// ===================================================
// CREATE ACTOR
// ===================================================
export const createActor = async (actor_name, profile_url = null) => {
  try {
    if (!actor_name) {
      throw new Error("MISSING_ACTOR_NAME");
    }

    const result = await pool.query(
      `INSERT INTO actors (actor_name, profile_url)
       VALUES ($1, $2)
       RETURNING *`,
      [actor_name, profile_url || null]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in createActor:", error);
    throw error;
  }
};


// ===================================================
// CREATE NETWORK
// ===================================================
export const createNetwork = async (network_name, logo_url = null, country = null) => {
  try {
    if (!network_name) {
      throw new Error("MISSING_NETWORK_NAME");
    }

    const result = await pool.query(
      `INSERT INTO networks (network_name, logo_url, country)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [network_name, logo_url || null, country || null]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in createNetwork:", error);
    throw error;
  }
};


// ===================================================
// CREATE STUDIO
// ===================================================
export const createStudio = async (studio_name, logo_url = null, country = null) => {
  try {
    if (!studio_name) {
      throw new Error("MISSING_STUDIO_NAME");
    }

    const result = await pool.query(
      `INSERT INTO studios (studio_name, logo_url, country)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [studio_name, logo_url || null, country || null]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in createStudio:", error);
    throw error;
  }
};


// ===================================================
// CREATE CREATOR
// ===================================================
export const createCreator = async (creator_name) => {
  try {
    if (!creator_name) {
      throw new Error("MISSING_CREATOR_NAME");
    }

    const result = await pool.query(
      `INSERT INTO creators (creator_name)
       VALUES ($1)
       RETURNING *`,
      [creator_name]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in createCreator:", error);
    throw error;
  }
};


// ===================================================
// UPDATE SHOW STATUS
// ===================================================
export const updateShowStatus = async (showId, status) => {
  try {
    const result = await pool.query(
      `UPDATE tv_shows 
             SET status = $1 
             WHERE id = $2 
             RETURNING *`,
      [status, showId]
    );

    if (result.rows.length === 0) {
      throw new Error("SHOW_NOT_FOUND");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Database error in updateShowStatus:", error);
    throw error;
  }
};

// ===================================================
// UPDATE SHOW DATES
// ===================================================
export const updateShowDates = async (showId, dates) => {
  try {
    const { first_air_date, last_air_date } = dates;

    // Build dynamic update query based on which dates are provided
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (first_air_date !== undefined) {
      updates.push(`first_air_date = $${paramIndex}`);
      params.push(first_air_date);
      paramIndex++;
    }

    if (last_air_date !== undefined) {
      updates.push(`last_air_date = $${paramIndex}`);
      params.push(last_air_date);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new Error("NO_UPDATES_PROVIDED");
    }

    params.push(showId);
    const result = await pool.query(
      `UPDATE tv_shows
             SET ${updates.join(", ")}
             WHERE id = $${paramIndex}
             RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new Error("SHOW_NOT_FOUND");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Database error in updateShowDates:", error);
    throw error;
  }
};

// ===================================================
// UPDATE SHOW METRICS
// ===================================================
export const updateShowMetrics = async (showId, metrics) => {
  try {
    const { tmdb_rating, popularity, vote_count } = metrics;

    // Build dynamic update query based on which metrics are provided
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (tmdb_rating !== undefined) {
      updates.push(`tmdb_rating = $${paramIndex}`);
      params.push(tmdb_rating);
      paramIndex++;
    }

    if (popularity !== undefined) {
      updates.push(`popularity = $${paramIndex}`);
      params.push(popularity);
      paramIndex++;
    }

    if (vote_count !== undefined) {
      updates.push(`vote_count = $${paramIndex}`);
      params.push(vote_count);
      paramIndex++;
    }

    if (updates.length === 0) {
      throw new Error("NO_UPDATES_PROVIDED");
    }

    params.push(showId);
    const result = await pool.query(
      `UPDATE tv_shows 
             SET ${updates.join(", ")} 
             WHERE id = $${paramIndex} 
             RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      throw new Error("SHOW_NOT_FOUND");
    }

    return result.rows[0];
  } catch (error) {
    console.error("Database error in updateShowMetrics:", error);
    throw error;
  }
};

// ===================================================
// UPDATE TV SHOW
// ===================================================
export const updateShow = async (showId, updateData) => {
  try {
    // Check if show exists
    const existingShow = await pool.query(
      "SELECT id FROM tv_shows WHERE id = $1",
      [showId]
    );
    if (existingShow.rows.length === 0) {
      throw new Error("SHOW_NOT_FOUND");
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
      throw new Error("NO_FIELDS_TO_UPDATE");
    }

    // Add WHERE clause parameter
    values.push(showId);

    const query = `
            UPDATE tv_shows
            SET ${updates.join(", ")}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Database error in updateShow:", error);
    throw error;
  }
};


// UPDATE CAST MEMBER character name
export const updateCastMember = async (showId, actorId, characterName) => {
  try {
    // Check if show exists
    const showExists = await pool.query(
      "SELECT id FROM tv_shows WHERE id = $1",
      [showId]
    );
    if (showExists.rows.length === 0) {
      throw new Error("SHOW_NOT_FOUND");
    }

    // Check if cast member exists
    const existingCast = await pool.query(
      "SELECT * FROM show_actors WHERE tv_show_id = $1 AND actor_id = $2",
      [showId, actorId]
    );
    if (existingCast.rows.length === 0) {
      throw new Error("CAST_MEMBER_NOT_FOUND");
    }

    // Update character name
    const result = await pool.query(
      "UPDATE show_actors SET character_name = $1 WHERE tv_show_id = $2 AND actor_id = $3 RETURNING *",
      [characterName, showId, actorId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Database error in updateCastMember:", error);
    throw error;
  }
};
