import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SongTableRow from "./song/SongTableRow";

interface Song {
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
  return (
    <div className="rounded-md bg-tango-gray">
      <Table>
        <TableHeader className="bg-tango-darkGray border-b border-tango-gray/20">
          <TableRow>
            <TableHead className="text-tango-light w-[40px]"></TableHead>
            <TableHead className="text-tango-light">Title</TableHead>
            <TableHead className="text-tango-light">Orchestra</TableHead>
            <TableHead className="text-tango-light">Singer</TableHead>
            <TableHead className="text-tango-light">Type</TableHead>
            <TableHead className="text-tango-light">Style</TableHead>
            <TableHead className="text-tango-light">Year</TableHead>
            <TableHead className="text-tango-light w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
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
  );
};

export default SongResultsTable;