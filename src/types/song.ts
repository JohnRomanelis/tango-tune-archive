export type SongType = "tango" | "milonga" | "vals";
export type SongStyle = "rhythmic" | "melodic" | "dramatic";
export type SortField = 'title' | 'orchestra' | 'singer' | 'type' | 'style' | 'year';
export type SortDirection = 'asc' | 'desc';
export type SuggestionStatus = 'pending' | 'approved' | 'approved-edited' | 'rejected';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface Song {
  id: number;
  title: string;
  type: SongType;
  style: SongStyle;
  recording_year?: number;
  is_instrumental?: boolean;
  spotify_id?: string;
  orchestra?: { id: number; name: string } | null;
  song_singer?: Array<{ singer: { id: number; name: string } }>;
  duration?: number;
}

export interface SongSuggestion extends Omit<Song, 'id'> {
  id: number;
  user_id?: string;
  status: SuggestionStatus;
  created_at?: string;
  updated_at?: string;
  duration?: number;
  suggested_song_singer?: Array<{ singer: { id: number; name: string } }>;
}