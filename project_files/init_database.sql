-- ============================================
-- TV SHOWS DATABASE SCHEMA
-- ============================================
-- Database: PostgreSQL 14+
-- Purpose: Store TV show information with normalized relationships
-- Author: Database Designer (Group Member 2)
-- Date: 2025
-- 
-- INSTRUCTIONS:
-- 1. Open Supabase SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run" to execute
-- 4. Verify all tables are created successfully
-- ============================================

-- ============================================
-- STEP 1: DROP EXISTING TABLES (if any)
-- ============================================
-- Drop junction tables first (they depend on other tables)
DROP TABLE IF EXISTS show_creators CASCADE;
DROP TABLE IF EXISTS show_studios CASCADE;
DROP TABLE IF EXISTS show_networks CASCADE;
DROP TABLE IF EXISTS show_cast CASCADE;
DROP TABLE IF EXISTS show_genres CASCADE;

-- Drop lookup tables
DROP TABLE IF EXISTS creators CASCADE;
DROP TABLE IF EXISTS studios CASCADE;
DROP TABLE IF EXISTS networks CASCADE;
DROP TABLE IF EXISTS actors CASCADE;
DROP TABLE IF EXISTS genres CASCADE;

-- Drop main table
DROP TABLE IF EXISTS tv_shows CASCADE;

-- ============================================
-- STEP 2: CREATE MAIN TABLE
-- ============================================

-- TV_SHOWS: Main entity storing TV show information
CREATE TABLE tv_shows (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    first_air_date DATE,
    last_air_date DATE,
    seasons INTEGER,
    episodes INTEGER,
    status VARCHAR(50),
    overview TEXT,
    popularity DECIMAL(10, 4),
    tmdb_rating DECIMAL(3, 1),
    vote_count INTEGER,
    poster_url TEXT,
    backdrop_url TEXT
);

-- ============================================
-- STEP 3: CREATE LOOKUP TABLES
-- ============================================

-- GENRES: Stores unique genre types
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ACTORS: Stores actor information
CREATE TABLE actors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    profile_url TEXT
);

-- NETWORKS: Stores broadcasting network information
CREATE TABLE networks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    country VARCHAR(100)
);

-- STUDIOS: Stores production studio information
CREATE TABLE studios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    country VARCHAR(100)
);

-- CREATORS: Stores show creator information
CREATE TABLE creators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- ============================================
-- STEP 4: CREATE JUNCTION TABLES (Many-to-Many Relationships)
-- ============================================

-- SHOW_GENRES: Links TV shows to their genres
CREATE TABLE show_genres (
    show_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    PRIMARY KEY (show_id, genre_id),
    FOREIGN KEY (show_id) REFERENCES tv_shows(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- SHOW_CAST: Links TV shows to actors with character names
CREATE TABLE show_cast (
    show_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    character_name VARCHAR(255),
    PRIMARY KEY (show_id, actor_id),
    FOREIGN KEY (show_id) REFERENCES tv_shows(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
);

-- SHOW_NETWORKS: Links TV shows to broadcasting networks
CREATE TABLE show_networks (
    show_id INTEGER NOT NULL,
    network_id INTEGER NOT NULL,
    PRIMARY KEY (show_id, network_id),
    FOREIGN KEY (show_id) REFERENCES tv_shows(id) ON DELETE CASCADE,
    FOREIGN KEY (network_id) REFERENCES networks(id) ON DELETE CASCADE
);

-- SHOW_STUDIOS: Links TV shows to production studios
CREATE TABLE show_studios (
    show_id INTEGER NOT NULL,
    studio_id INTEGER NOT NULL,
    PRIMARY KEY (show_id, studio_id),
    FOREIGN KEY (show_id) REFERENCES tv_shows(id) ON DELETE CASCADE,
    FOREIGN KEY (studio_id) REFERENCES studios(id) ON DELETE CASCADE
);

-- SHOW_CREATORS: Links TV shows to their creators
CREATE TABLE show_creators (
    show_id INTEGER NOT NULL,
    creator_id INTEGER NOT NULL,
    PRIMARY KEY (show_id, creator_id),
    FOREIGN KEY (show_id) REFERENCES tv_shows(id) ON DELETE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE
);

-- ============================================
-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index on TV show name for searching
CREATE INDEX idx_tv_shows_name ON tv_shows(name);

-- Index on popularity for sorting
CREATE INDEX idx_tv_shows_popularity ON tv_shows(popularity DESC);

-- Index on rating for filtering
CREATE INDEX idx_tv_shows_rating ON tv_shows(tmdb_rating DESC);

-- Index on status for filtering (e.g., "Returning Series", "Ended")
CREATE INDEX idx_tv_shows_status ON tv_shows(status);

-- Indexes on foreign keys in junction tables (improves JOIN performance)
CREATE INDEX idx_show_genres_show_id ON show_genres(show_id);
CREATE INDEX idx_show_genres_genre_id ON show_genres(genre_id);

CREATE INDEX idx_show_cast_show_id ON show_cast(show_id);
CREATE INDEX idx_show_cast_actor_id ON show_cast(actor_id);

CREATE INDEX idx_show_networks_show_id ON show_networks(show_id);
CREATE INDEX idx_show_networks_network_id ON show_networks(network_id);

CREATE INDEX idx_show_studios_show_id ON show_studios(show_id);
CREATE INDEX idx_show_studios_studio_id ON show_studios(studio_id);

CREATE INDEX idx_show_creators_show_id ON show_creators(show_id);
CREATE INDEX idx_show_creators_creator_id ON show_creators(creator_id);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your tables were created successfully

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count tables (should be 11)
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- ============================================
-- EXAMPLE QUERIES (for testing later)
-- ============================================

/*
-- Insert a test genre
INSERT INTO genres (name) VALUES ('Drama');

-- Insert a test TV show
INSERT INTO tv_shows (id, name, original_name, seasons, episodes, status) 
VALUES (1, 'Test Show', 'Test Show', 1, 10, 'Returning Series');

-- Link show to genre
INSERT INTO show_genres (show_id, genre_id) VALUES (1, 1);

-- Query shows by genre
SELECT ts.name, g.name as genre
FROM tv_shows ts
JOIN show_genres sg ON ts.id = sg.show_id
JOIN genres g ON sg.genre_id = g.id
WHERE g.name = 'Drama';
*/

-- ============================================
-- SCRIPT COMPLETE!
-- ============================================
-- All 11 tables created successfully
-- Ready for data migration
-- ============================================
