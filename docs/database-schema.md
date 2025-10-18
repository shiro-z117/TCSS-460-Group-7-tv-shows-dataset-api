# TV Shows Database Schema

## Tables Created (11 Total)

### Main Table
- **TV_SHOWS**: Stores TV show information (id, name, original_name, first_air_date, last_air_date, seasons, episodes, status, overview, popularity, tmdb_rating, vote_count, poster_url, backdrop_url)

### Lookup Tables
- **GENRES**: Store genre types (id, name)
- **ACTORS**: Store actor information (id, name, profile_url)
- **NETWORKS**: Store network information (id, name, logo_url, country)
- **STUDIOS**: Store studio information (id, name, logo_url, country)
- **CREATORS**: Store creator information (id, name)

### Junction Tables (Many-to-Many Relationships)
- **SHOW_GENRES**: Links shows to genres
- **SHOW_CAST**: Links shows to actors with character names
- **SHOW_NETWORKS**: Links shows to networks
- **SHOW_STUDIOS**: Links shows to studios
- **SHOW_CREATORS**: Links shows to creators

## Sample Data
- ✅ 10 TV shows inserted (Breaking Bad, Game of Thrones, Stranger Things, etc.)
- ✅ 6 genres created (Drama, Comedy, Sci-Fi, Fantasy, Horror, Adventure)
- ✅ Shows linked to genres

## Database Indexes Created
- idx_tv_shows_name
- idx_tv_shows_popularity
- idx_tv_shows_rating
- idx_tv_shows_status
- All foreign key indexes for junction tables

## Status
✅ Database fully set up in Supabase and ready for API integration
