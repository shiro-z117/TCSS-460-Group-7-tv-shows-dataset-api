
import pandas as pd
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Set SUPABASE_URL and SUPABASE_KEY in .env file")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("\n" + "="*70)
print("🚀 100% ACCURATE IMPORT: 7,382 TV SHOWS")
print("="*70)

# PHASE 1
print("\n📥 PHASE 1: Reading CSV...")
df_raw = pd.read_csv('tv_last1years.csv', dtype=str)
print(f"✅ CSV loaded: {len(df_raw)} rows, {len(df_raw.columns)} columns")

# PHASE 2
print("\n🔍 PHASE 2: Validating data...")
df_clean = df_raw.copy()
for col in df_clean.columns:
    if df_clean[col].dtype == 'object':
        df_clean[col] = df_clean[col].str.strip()

df_clean['ID'] = pd.to_numeric(df_clean['ID'], errors='coerce').astype('Int64')
df_clean['First Air Date'] = pd.to_datetime(df_clean['First Air Date'], errors='coerce')
df_clean['Last Air Date'] = pd.to_datetime(df_clean['Last Air Date'], errors='coerce')

numeric_cols = ['Seasons', 'Episodes', 'Popularity', 'TMDb Rating', 'Vote Count']
for col in numeric_cols:
    if col in df_clean.columns:
        df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce')

df_clean = df_clean.dropna(subset=['ID', 'Name', 'First Air Date', 'Last Air Date'])
print(f"✅ Data cleaned: {len(df_clean)} rows valid")

# PHASE 3
print("\n📤 PHASE 3: Importing reference data...")

def split_and_extract(value, separator=';'):
    if pd.isna(value) or value == '':
        return []
    return [item.strip() for item in str(value).split(separator) if item.strip()]

# Genres
genres_set = set()
for genres_str in df_clean['Genres'].dropna():
    genres_set.update(split_and_extract(genres_str, '; '))
genre_records = [{'name': g} for g in sorted(genres_set) if g]
if genre_records:
    supabase.table('genres').delete().neq('id', -1).execute()
    for i in range(0, len(genre_records), 500):
        supabase.table('genres').insert(genre_records[i:i+500], returning='minimal').execute()
print(f"1️⃣ ✅ Imported {len(genre_records)} genres")

# Creators
creators_set = set()
for creators_str in df_clean['Creators'].dropna():
    creators_set.update(split_and_extract(creators_str, '; '))
creator_records = [{'name': c} for c in sorted(creators_set) if c]
if creator_records:
    supabase.table('creators').delete().neq('id', -1).execute()
    for i in range(0, len(creator_records), 500):
        supabase.table('creators').insert(creator_records[i:i+500], returning='minimal').execute()
print(f"2️⃣ ✅ Imported {len(creator_records)} creators")

# Networks
networks_set = set()
for network_str in df_clean['Networks'].dropna():
    networks_set.update(split_and_extract(network_str, '; '))
network_records = [{'name': n} for n in sorted(networks_set) if n]
if network_records:
    supabase.table('networks').delete().neq('id', -1).execute()
    for i in range(0, len(network_records), 500):
        supabase.table('networks').insert(network_records[i:i+500], returning='minimal').execute()
print(f"3️⃣ ✅ Imported {len(network_records)} networks")

# Studios
studios_set = set()
for studios_str in df_clean['Studios'].dropna():
    studios_set.update(split_and_extract(studios_str, '; '))
studio_records = [{'name': s} for s in sorted(studios_set) if s]
if studio_records:
    supabase.table('studios').delete().neq('id', -1).execute()
    for i in range(0, len(studio_records), 500):
        supabase.table('studios').insert(studio_records[i:i+500], returning='minimal').execute()
print(f"4️⃣ ✅ Imported {len(studio_records)} studios")

# Actors
actors_set = set()
actor_cols = [f'Actor {i} Name' for i in range(1, 11)]
for col in actor_cols:
    if col in df_clean.columns:
        for actor_name in df_clean[col].dropna():
            if actor_name.strip():
                actors_set.add(actor_name.strip())
actor_records = [{'name': a} for a in sorted(actors_set) if a]
if actor_records:
    supabase.table('actors').delete().neq('id', -1).execute()
    for i in range(0, len(actor_records), 500):
        supabase.table('actors').insert(actor_records[i:i+500], returning='minimal').execute()
print(f"5️⃣ ✅ Imported {len(actor_records)} actors")

# PHASE 4
print("\n🔗 PHASE 4: Mapping IDs...")
genres_response = supabase.table('genres').select('id, name').execute()
genre_map = {g['name']: g['id'] for g in genres_response.data}
creators_response = supabase.table('creators').select('id, name').execute()
creator_map = {c['name']: c['id'] for c in creators_response.data}
networks_response = supabase.table('networks').select('id, name').execute()
network_map = {n['name']: n['id'] for n in networks_response.data}
studios_response = supabase.table('studios').select('id, name').execute()
studio_map = {s['name']: s['id'] for s in studios_response.data}
actors_response = supabase.table('actors').select('id, name').execute()
actor_map = {a['name']: a['id'] for a in actors_response.data}
print(f"✅ Mapped all reference data")

# PHASE 5
print("\n📺 PHASE 5: Importing TV shows...")
supabase.table('tv_shows').delete().neq('id', -1).execute()
tv_shows_records = []
for _, row in df_clean.iterrows():
    show = {
        'id': int(row['ID']) if pd.notna(row['ID']) else None,
        'name': row['Name'],
        'original_name': row['Original Name'] if pd.notna(row['Original Name']) else None,
        'first_air_date': row['First Air Date'].strftime('%Y-%m-%d') if pd.notna(row['First Air Date']) else None,
        'last_air_date': row['Last Air Date'].strftime('%Y-%m-%d') if pd.notna(row['Last Air Date']) else None,
        'seasons': int(row['Seasons']) if pd.notna(row['Seasons']) else 0,
        'episodes': int(row['Episodes']) if pd.notna(row['Episodes']) else 0,
        'status': row['Status'] if pd.notna(row['Status']) else None,
        'overview': row['Overview'] if pd.notna(row['Overview']) else None,
        'popularity': float(row['Popularity']) if pd.notna(row['Popularity']) else 0,
        'tmdb_rating': float(row['TMDb Rating']) if pd.notna(row['TMDb Rating']) else 0,
        'vote_count': int(row['Vote Count']) if pd.notna(row['Vote Count']) else 0,
        'poster_url': row['Poster URL'] if pd.notna(row['Poster URL']) else None,
        'backdrop_url': row['Backdrop URL'] if pd.notna(row['Backdrop URL']) else None,
    }
    tv_shows_records.append(show)

for i in range(0, len(tv_shows_records), 500):
    batch = tv_shows_records[i:i+500]
    supabase.table('tv_shows').insert(batch, returning='minimal').execute()
    print(f"   Batch {i//500 + 1}: {len(batch)} shows")
print(f"✅ Total TV shows: {len(tv_shows_records)}")

# PHASE 6
print("\n🔗 PHASE 6: Creating relationships...")
shows_response = supabase.table('tv_shows').select('id, name').execute()
show_map = {s['name']: s['id'] for s in shows_response.data}

# Show-Genres
show_genres = []
for _, row in df_clean.iterrows():
    show_id = show_map.get(row['Name'])
    if show_id and pd.notna(row['Genres']):
        for genre_name in split_and_extract(row['Genres'], '; '):
            genre_id = genre_map.get(genre_name)
            if genre_id:
                show_genres.append({'show_id': show_id, 'genre_id': genre_id})
if show_genres:
    supabase.table('show_genres').delete().neq('show_id', -1).execute()
    for i in range(0, len(show_genres), 1000):
        supabase.table('show_genres').insert(show_genres[i:i+1000], returning='minimal').execute()
print(f"1️⃣ ✅ Show-Genre links: {len(show_genres)}")

# Show-Creators
show_creators = []
for _, row in df_clean.iterrows():
    show_id = show_map.get(row['Name'])
    if show_id and pd.notna(row['Creators']):
        for creator_name in split_and_extract(row['Creators'], '; '):
            creator_id = creator_map.get(creator_name)
            if creator_id:
                show_creators.append({'show_id': show_id, 'creator_id': creator_id})
if show_creators:
    supabase.table('show_creators').delete().neq('show_id', -1).execute()
    for i in range(0, len(show_creators), 1000):
        supabase.table('show_creators').insert(show_creators[i:i+1000], returning='minimal').execute()
print(f"2️⃣ ✅ Show-Creator links: {len(show_creators)}")

# Show-Networks
show_networks = []
for _, row in df_clean.iterrows():
    show_id = show_map.get(row['Name'])
    if show_id and pd.notna(row['Networks']):
        for network_name in split_and_extract(row['Networks'], '; '):
            network_id = network_map.get(network_name)
            if network_id:
                show_networks.append({'show_id': show_id, 'network_id': network_id})
if show_networks:
    supabase.table('show_networks').delete().neq('show_id', -1).execute()
    for i in range(0, len(show_networks), 1000):
        supabase.table('show_networks').insert(show_networks[i:i+1000], returning='minimal').execute()
print(f"3️⃣ ✅ Show-Network links: {len(show_networks)}")

# Show-Studios
show_studios = []
for _, row in df_clean.iterrows():
    show_id = show_map.get(row['Name'])
    if show_id and pd.notna(row['Studios']):
        for studio_name in split_and_extract(row['Studios'], '; '):
            studio_id = studio_map.get(studio_name)
            if studio_id:
                show_studios.append({'show_id': show_id, 'studio_id': studio_id})
if show_studios:
    supabase.table('show_studios').delete().neq('show_id', -1).execute()
    for i in range(0, len(show_studios), 1000):
        supabase.table('show_studios').insert(show_studios[i:i+1000], returning='minimal').execute()
print(f"4️⃣ ✅ Show-Studio links: {len(show_studios)}")

# Show-Cast
show_cast = []
actor_name_cols = [f'Actor {i} Name' for i in range(1, 11)]
character_cols = [f'Actor {i} Character' for i in range(1, 11)]
for _, row in df_clean.iterrows():
    show_id = show_map.get(row['Name'])
    if show_id:
        for actor_col, character_col in zip(actor_name_cols, character_cols):
            actor_name = row.get(actor_col)
            character_name = row.get(character_col)
            if pd.notna(actor_name) and actor_name.strip():
                actor_id = actor_map.get(actor_name.strip())
                if actor_id:
                    show_cast.append({
                        'show_id': show_id,
                        'actor_id': actor_id,
                        'character_name': character_name if pd.notna(character_name) else None
                    })
if show_cast:
    supabase.table('show_cast').delete().neq('show_id', -1).execute()
    for i in range(0, len(show_cast), 1000):
        supabase.table('show_cast').insert(show_cast[i:i+1000], returning='minimal').execute()
print(f"5️⃣ ✅ Show-Cast links: {len(show_cast)}")

# PHASE 7
print("\n✅ PHASE 7: Final verification...")
shows_count = supabase.table('tv_shows').select('count', {count: 'exact'}).execute().count
genres_count = supabase.table('genres').select('count', {count: 'exact'}).execute().count
actors_count = supabase.table('actors').select('count', {count: 'exact'}).execute().count
show_genres_count = supabase.table('show_genres').select('count', {count: 'exact'}).execute().count
show_cast_count = supabase.table('show_cast').select('count', {count: 'exact'}).execute().count

print("\n" + "="*70)
print("IMPORT SUMMARY")
print("="*70)
print(f"Original CSV rows: {len(df_raw)}")
print(f"Rows imported: {shows_count}")
print(f"Data loss: {len(df_raw) - shows_count} rows")
print(f"Success rate: {(shows_count / len(df_raw) * 100):.2f}%")
print(f"\nReference Data: Genres: {genres_count}, Actors: {actors_count}")
print(f"Relationships: Show-Genre: {show_genres_count}, Show-Cast: {show_cast_count}")
print("="*70)

if shows_count == len(df_raw):
    print("\n✅ 100% DATA COVERAGE - SUCCESS!")
else:
    print(f"\n⚠️ {len(df_raw) - shows_count} rows not imported")

print("\n✅ Import complete!")