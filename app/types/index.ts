export type statusGameBase = 'top-game' | 'released' | 'upcoming';

export type categoryGameBase =
    | 'all'
    | 'action'
    | 'adventure'
    | 'rpg'
    | 'strategy';

export interface IFiltersGame {
    search: string;
    category: categoryGameBase;
    status: statusGameBase;
}

export interface IGame {
    id: string | number;
    title: string;
    thumbnail: string;
    short_description: string;
    game_url?: string;
    category?: string;
    release_date?: string; // ISO date string
    status?: statusGameBase[];
    developer?: string;
    publisher?: string;
    rating?: number; // 1 to 5
    favorite?: boolean;
    platform?: string[];
}
