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

export type SortField = 'title' | 'orchestra' | 'singer' | 'type' | 'style' | 'year';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}