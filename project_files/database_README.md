# TV Shows Database Design

**Author:** Linda Miao (Group Member 2)  
**Date:** October 11, 2025  
**Database:** PostgreSQL (Supabase)

## Overview
Normalized relational database storing 7,316 TV shows with full cast, 
crew, and production information from TV shows that aired in the last 
year.

## Database Schema

### Tables (11 total)

**Main Table:**
- `tv_shows` - Core TV show information (7,316 rows)

**Lookup Tables:**
- `genres` - Unique genre types (18 rows)
- `actors` - Actor information (35,739 rows)
- `networks` - Broadcasting networks (465 rows)
- `studios` - Production studios (5,897 rows)
- `creators` - Show creators (5,604 rows)

**Junction Tables (Many-to-Many Relationships):**
- `show_genres` - Links shows to genres
- `show_cast` - Links shows to actors with character names
- `show_networks` - Links shows to networks
- `show_studios` - Links shows to studios
- `show_creators` - Links shows to creators

## Entity Relationship Diagram

See `er_diagram.png` for the complete ER diagram showing all tables and 
relationships.

## Files Included

1. **er_diagram.png** - Entity Relationship Diagram (Lucidchart)
2. **init_database.sql** - Database schema creation script
3. **import_tv_shows.py** - Python data migration script
4. **database_README.md** - This documentation
5. **Screenshots/** - Proof of successful implementation

## Setup Instructions

### Prerequisites
- PostgreSQL 14+ or Supabase account
- Python 3.9+
- Required Python packages: pandas, psycopg2-binary

### Step 1: Create Database Schema

In Supabase SQL Editor or PostgreSQL:
```sql
-- Run the schema creation script
\i init_database.sql

Step 2: Import Data
bash# Install required packages
pip install pandas psycopg2-binary

# Update DATABASE_URL in import_tv_shows.py with your credentials
# Replace YOUR_PASSWORD_HERE with your actual Supabase password

# Run the import script
python3 import_tv_shows.py

The script will:

Connect to your database
Read the CSV file
Insert all TV shows
Extract and normalize genres, actors, networks, studios, creators
Create all relationships in junction tables
Display progress every 100 shows

Database Statistics
EntityCountTV 
Shows7,316Actors35,739Genres18Networks465Studios5,897Creators5,604
Database Design Decisions
Normalization
The database is normalized to Third Normal Form (3NF):

No repeating groups (semicolon-separated values split into junction 
tables)
All non-key attributes depend on the primary key
No transitive dependencies

Many-to-Many Relationships
All complex relationships (shows-genres, shows-actors, etc.) use junction 
tables to properly model many-to-many relationships.
Indexes
Performance indexes created on:

TV show names (for search)
Popularity and ratings (for sorting)
Foreign keys in junction tables (for JOINs)

Example Queries
Find all Drama shows sorted by rating:
sqlSELECT ts.name, ts.tmdb_rating, ts.popularity
FROM tv_shows ts
JOIN show_genres sg ON ts.id = sg.show_id
JOIN genres g ON sg.genre_id = g.id
WHERE g.name = 'Drama'
ORDER BY ts.tmdb_rating DESC
LIMIT 10;
Find shows by actor:
sqlSELECT ts.name, sc.character_name, ts.tmdb_rating
FROM tv_shows ts
JOIN show_cast sc ON ts.id = sc.show_id
JOIN actors a ON sc.actor_id = a.id
WHERE a.name = 'Bryan Cranston'
ORDER BY ts.popularity DESC;
Top 10 most popular shows:
sqlSELECT name, popularity, tmdb_rating, seasons, episodes
FROM tv_shows
ORDER BY popularity DESC
LIMIT 10;
Find all Netflix shows:
sqlSELECT ts.name, ts.tmdb_rating
FROM tv_shows ts
JOIN show_networks sn ON ts.id = sn.show_id
JOIN networks n ON sn.network_id = n.id
WHERE n.name = 'Netflix'
ORDER BY ts.tmdb_rating DESC;
Count shows by genre:
sqlSELECT g.name as genre, COUNT(*) as show_count
FROM genres g
JOIN show_genres sg ON g.id = sg.genre_id
GROUP BY g.name
ORDER BY show_count DESC;
Technical Implementation
Data Source

Original CSV: tv_last1years.csv (7,382 TV shows)
Source: TMDb (The Movie Database) API

Data Cleaning

Parsed semicolon-separated fields (genres, studios, networks)
Extracted 10 actors per show with character names
Handled NULL values and missing data
Normalized text encodings

Error Handling

Duplicate detection (skips already imported shows)
Data validation (field length constraints)
Transaction rollback on errors
Continues processing after individual failures

Success Metrics

Import Success Rate: 99.1% (7,316 of 7,382 shows)
Failed Records: 66 shows (0.9%)
Failure Reason: Character name field exceeded VARCHAR(255) limit
Resolution: Can be fixed by increasing column size if needed

Database Performance

Total database size: ~50 MB
Query performance: <100ms for most queries with proper indexes
Import time: ~15 minutes for full dataset

Future Enhancements

Increase VARCHAR limits for character names (255 → 500)
Add full-text search indexes for show names and overviews
Add user ratings and reviews tables
Implement caching for frequently queried data
Add API endpoints for common queries

Contact
Linda Miao
Group Member 2 - Database Designer
TCSS 460 - Software Engineering
University of Washington Tacoma

Project Status: ✅ Complete
Last Updated: October 12, 2025

