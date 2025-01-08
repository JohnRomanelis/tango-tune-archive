import { useState, useMemo } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SongTableRow from "./song/SongTableRow";
import SortableTableHeader from "./song/SortableTableHeader";
import { Song, SortField, SortConfig } from "@/types/song";

interface SongResultsTableProps {
  songs: Song[];
  likedSongs?: number[];
  selectedTrackId: string | null;
  isModerator: boolean;
  onSongClick: (spotify_id: string | null) => void;
  onLikeClick: (e: React.MouseEvent, songId: number) => void;
  onAddClick?: (song: Song) => void;
}

const SongResultsTable = ({
  songs,
  likedSongs = [],
  selectedTrackId,
  isModerator,
  onSongClick,
  onLikeClick,
  onAddClick,
}: SongResultsTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'title',
    direction: 'asc',
  });

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedSongs = useMemo(() => {
    const sorted = [...songs].sort((a, b) => {
      let comparison = 0;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      // Primary sort based on selected field
      switch (sortConfig.field) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'orchestra':
          comparison = (a.orchestra?.name || '').localeCompare(b.orchestra?.name || '');
          break;
        case 'singer':
          const singerA = a.song_singer?.[0]?.singer?.name || '';
          const singerB = b.song_singer?.[0]?.singer?.name || '';
          comparison = singerA.localeCompare(singerB);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'style':
          comparison = a.style.localeCompare(b.style);
          break;
        case 'year':
          const yearA = a.recording_year || 0;
          const yearB = b.recording_year || 0;
          comparison = yearA - yearB;
          break;
      }

      // If primary sort yields equality, sort by type
      if (comparison === 0) {
        comparison = a.type.localeCompare(b.type);
        
        // If type is also equal, sort by year
        if (comparison === 0) {
          const yearA = a.recording_year || 0;
          const yearB = b.recording_year || 0;
          comparison = yearA - yearB;
        }
      }

      return comparison * direction;
    });

    return sorted;
  }, [songs, sortConfig]);

  return (
    <div className="rounded-md bg-tango-gray overflow-x-auto">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader className="bg-tango-darkGray border-b border-tango-gray/20">
            <TableRow>
              <TableHead className="text-tango-light w-[40px]"></TableHead>
              <SortableTableHeader
                field="title"
                label="Title"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="orchestra"
                label="Orchestra"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="singer"
                label="Singer"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="type"
                label="Type"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="style"
                label="Style"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <SortableTableHeader
                field="year"
                label="Year"
                currentSort={sortConfig}
                onSort={handleSort}
              />
              <TableHead className="text-tango-light w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSongs.map((song) => (
              <SongTableRow
                key={song.id}
                song={song}
                isSelected={song.spotify_id === selectedTrackId}
                isLiked={likedSongs.includes(song.id)}
                isModerator={isModerator}
                onSongClick={() => onSongClick(song.spotify_id || null)}
                onLikeClick={(e) => onLikeClick(e, song.id)}
                onAddClick={onAddClick ? () => onAddClick(song) : undefined}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SongResultsTable;