interface Song {
  orchestra?: {
    name: string;
  };
  type?: string;
  style?: string;
  recording_year?: number;
}

interface TandaSong {
  song: Song;
}

interface TandaMetadata {
  songCount: number;
  orchestras: string[];
  types: string[];
  styles: string[];
  yearRange: string;
}

export const getTandaMetadata = (tanda: { tanda_song?: TandaSong[] }): TandaMetadata => {
  const songs = tanda.tanda_song || [];
  const orchestras = new Set(
    songs
      .map((ts) => ts.song?.orchestra?.name)
      .filter((name): name is string => name !== undefined)
  );
  const types = new Set(
    songs
      .map((ts) => ts.song?.type)
      .filter((type): type is string => type !== undefined)
  );
  const styles = new Set(
    songs
      .map((ts) => ts.song?.style)
      .filter((style): style is string => style !== undefined)
  );
  const years = songs
    .map((ts) => ts.song?.recording_year)
    .filter((year): year is number => year !== undefined);

  return {
    songCount: songs.length,
    orchestras: Array.from(orchestras),
    types: Array.from(types),
    styles: Array.from(styles),
    yearRange: years.length ? `${Math.min(...years)}-${Math.max(...years)}` : 'N/A'
  };
};