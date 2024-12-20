export interface Song {
  id: number;
  title: string;
  type: string;
  style: string;
  recording_year?: number;
  is_instrumental?: boolean;
  spotify_id?: string;
  orchestra?: { id: number; name: string } | null;
  song_singer?: Array<{ singer: { id: number; name: string } }>;
}

export interface SongTemplate {
  id: string;
  title: string;
  recording_year: string;
  spotify_id: string;
  duration: number;
}

export type SortField = 'title' | 'orchestra' | 'singer' | 'type' | 'style' | 'year';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export type SuggestionStatus = 'pending' | 'approved' | 'approved-edited' | 'rejected';

export interface SongSuggestion extends Omit<Song, 'id'> {
  id: number;
  user_id?: string;
  status: SuggestionStatus;
  created_at?: string;
  updated_at?: string;
  suggested_song_singer?: Array<{ singer: { id: number; name: string } }>;
}