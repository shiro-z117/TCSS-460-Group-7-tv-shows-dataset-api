// types/apiTypes.ts
export type ShowStatus = 'Ended' | 'Returning Series' | 'Canceled' | 'In Production' | 'Planned';

export interface TVShow {
    id: number;
    name: string;
    original_name: string;
    first_air_date: string;
    last_air_date?: string | null;
    seasons?: number | null;
    episodes?: number | null;
    status: ShowStatus;
    genres?: string | null;
    overview?: string | null;
    popularity?: number | null;
    tmdb_rating?: number | null;
    vote_count?: number | null;
}
