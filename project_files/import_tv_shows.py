"""
TV Shows Database Import Script
Author: Linda Miao (Group Member 2)
Date: October 11, 2025

This script imports TV show data from CSV into Supabase PostgreSQL database.
It handles all the complex parsing of semicolon-separated fields and creates
proper normalized relationships across 11 tables.
"""

import pandas as pd
import psycopg2
from psycopg2 import sql
import sys

# ============================================
# CONFIGURATION - EDIT THESE!
# ============================================

# IMPORTANT: Replace YOUR_PASSWORD_HERE with your actual Supabase password!
DATABASE_URL = 
"postgresql://postgres:YOUR_PASSWORD_HERE@db.upecgalwqhmcgowhwvrg.supabase.co:5432/postgres"

CSV_FILE_PATH = "/Users/miuyanhong/Desktop/2025 fall quarter/460/wk3/tv_last1years.csv"

# ============================================
# HELPER FUNCTIONS
# ============================================

def connect_to_database():
    """Test connection to database"""
    try:
        print("🔌 Connecting to Supabase database...")
        conn = psycopg2.connect(DATABASE_URL)
        print("✅ Connection successful!")
        return conn
    except Exception as e:
        print("❌ CONNECTION FAILED!")
        print(f"Error: {e}")
        print("\n💡 Check:")
        print("1. Did you replace YOUR_PASSWORD_HERE with your actual password?")
        print("2. Is your password correct?")
        print("3. Is your internet connection working?")
        sys.exit(1)

def split_semicolon_field(value):
    """Split semicolon-separated values and clean them"""
    if pd.isna(value) or value == '':
        return []
    return [item.strip() for item in str(value).split(';') if item.strip()]

def insert_or_get_id(cursor, table, name_field, name_value):
    """Insert a value into a lookup table or get existing ID"""
    if not name_value or pd.isna(name_value):
        return None
    
    # Try to get existing ID
    cursor.execute(
        sql.SQL("SELECT id FROM {} WHERE {} = %s").format(
            sql.Identifier(table),
            sql.Identifier(name_field)
        ),
        (name_value,)
    )
    result = cursor.fetchone()
    
    if result:
        return result[0]
    
    # Insert new value
    cursor.execute(
        sql.SQL("INSERT INTO {} ({}) VALUES (%s) RETURNING id").format(
            sql.Identifier(table),
            sql.Identifier(name_field)
        ),
        (name_value,)
    )
    return cursor.fetchone()[0]

# ============================================
# MAIN IMPORT PROCESS
# ============================================

def main():
    print("\n" + "="*60)
    print("TV SHOWS DATABASE IMPORT SCRIPT")
    print("="*60 + "\n")
    
    # Connect to database
    conn = connect_to_database()
    cursor = conn.cursor()
    
    # Load CSV
    print(f"📂 Loading CSV file: {CSV_FILE_PATH}")
    try:
        df = pd.read_csv(CSV_FILE_PATH)
        print(f"✅ Loaded {len(df)} TV shows from CSV")
    except Exception as e:
        print(f"❌ Failed to load CSV: {e}")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("STARTING DATA IMPORT")
    print("="*60 + "\n")
    
    # Counters
    shows_imported = 0
    shows_skipped = 0
    
    # Import each show
    for index, row in df.iterrows():
        try:
            show_id = row['ID']
            
            # Check if show already exists
            cursor.execute("SELECT id FROM tv_shows WHERE id = %s", (show_id,))
            if cursor.fetchone():
                shows_skipped += 1
                continue
            
            # Insert TV show
            cursor.execute("""
                INSERT INTO tv_shows (
                    id, name, original_name, first_air_date, last_air_date,
                    seasons, episodes, status, overview, popularity,
                    tmdb_rating, vote_count, poster_url, backdrop_url
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                show_id,
                row.get('Name'),
                row.get('Original Name'),
                row.get('First Air Date') if pd.notna(row.get('First Air Date')) else None,
                row.get('Last Air Date') if pd.notna(row.get('Last Air Date')) else None,
                row.get('Seasons') if pd.notna(row.get('Seasons')) else None,
                row.get('Episodes') if pd.notna(row.get('Episodes')) else None,
                row.get('Status'),
                row.get('Overview'),
                row.get('Popularity') if pd.notna(row.get('Popularity')) else None,
                row.get('TMDb Rating') if pd.notna(row.get('TMDb Rating')) else None,
                row.get('Vote Count') if pd.notna(row.get('Vote Count')) else None,
                row.get('Poster URL'),
                row.get('Backdrop URL')
            ))
            
            # Process Genres
            genres = split_semicolon_field(row.get('Genres'))
            for genre_name in genres:
                genre_id = insert_or_get_id(cursor, 'genres', 'name', genre_name)
                if genre_id:
                    cursor.execute(
                        "INSERT INTO show_genres (show_id, genre_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                        (show_id, genre_id)
                    )
            
            # Process Creators
            creators = split_semicolon_field(row.get('Creators'))
            for creator_name in creators:
                creator_id = insert_or_get_id(cursor, 'creators', 'name', creator_name)
                if creator_id:
                    cursor.execute(
                        "INSERT INTO show_creators (show_id, creator_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                        (show_id, creator_id)
                    )
            
            # Process Networks
            networks = split_semicolon_field(row.get('Networks'))
            for network_name in networks:
                # Check if network exists
                cursor.execute("SELECT id FROM networks WHERE name = %s", (network_name,))
                result = cursor.fetchone()
                if result:
                    network_id = result[0]
                else:
                    cursor.execute(
                        "INSERT INTO networks (name) VALUES (%s) RETURNING id",
                        (network_name,)
                    )
                    network_id = cursor.fetchone()[0]
                
                cursor.execute(
                    "INSERT INTO show_networks (show_id, network_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (show_id, network_id)
                )
            
            # Process Studios
            studios = split_semicolon_field(row.get('Studios'))
            for studio_name in studios:
                # Check if studio exists
                cursor.execute("SELECT id FROM studios WHERE name = %s", (studio_name,))
                result = cursor.fetchone()
                if result:
                    studio_id = result[0]
                else:
                    cursor.execute(
                        "INSERT INTO studios (name) VALUES (%s) RETURNING id",
                        (studio_name,)
                    )
                    studio_id = cursor.fetchone()[0]
                
                cursor.execute(
                    "INSERT INTO show_studios (show_id, studio_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                    (show_id, studio_id)
                )
            
            # Process Actors (Actor 1-10)
            for i in range(1, 11):
                actor_name = row.get(f'Actor {i} Name')
                character_name = row.get(f'Actor {i} Character')
                profile_url = row.get(f'Actor {i} Profile URL')
                
                if pd.notna(actor_name) and actor_name:
                    # Check if actor exists
                    cursor.execute("SELECT id FROM actors WHERE name = %s", (actor_name,))
                    result = cursor.fetchone()
                    if result:
                        actor_id = result[0]
                    else:
                        cursor.execute(
                            "INSERT INTO actors (name, profile_url) VALUES (%s, %s) RETURNING id",
                            (actor_name, profile_url if pd.notna(profile_url) else None)
                        )
                        actor_id = cursor.fetchone()[0]
                    
                    cursor.execute(
                        "INSERT INTO show_cast (show_id, actor_id, character_name) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING",
                        (show_id, actor_id, character_name if pd.notna(character_name) else None)
                    )
            
            shows_imported += 1
            
            # Commit every 100 shows
            if shows_imported % 100 == 0:
                conn.commit()
                print(f"✅ Imported {shows_imported} shows...")
            
        except Exception as e:
            print(f"⚠️ Error importing show {show_id}: {e}")
            conn.rollback()
            continue
    
    # Final commit
    conn.commit()
    
    print("\n" + "="*60)
    print("IMPORT COMPLETE!")
    print("="*60)
    print(f"✅ Successfully imported: {shows_imported} shows")
    print(f"⏭️  Skipped (already exist): {shows_skipped} shows")
    
    # Show statistics
    print("\n📊 DATABASE STATISTICS:")
    
    cursor.execute("SELECT COUNT(*) FROM tv_shows")
    print(f"   TV Shows: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM genres")
    print(f"   Genres: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM actors")
    print(f"   Actors: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM networks")
    print(f"   Networks: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM studios")
    print(f"   Studios: {cursor.fetchone()[0]}")
    
    cursor.execute("SELECT COUNT(*) FROM creators")
    print(f"   Creators: {cursor.fetchone()[0]}")
    
    print("\n🎉 All data imported successfully!")
    
    # Close connection
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
