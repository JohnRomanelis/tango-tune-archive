import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Song {
  id: number;
  title: string;
  type: string;
  style: string;
  recording_year?: number;
  is_instrumental?: boolean;
  spotify_id?: string;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
}

interface SongResultsTableProps {
  songs: Song[];
  likedSongs?: number[];
  selectedTrackId: string | null;
  onSongClick: (spotify_id: string | null) => void;
  onLikeClick: (e: React.MouseEvent, songId: number) => void;
}

const SongResultsTable = ({
  songs,
  likedSongs = [],
  selectedTrackId,
  onSongClick,
  onLikeClick,
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
            <TableHead className="text-tango-light w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song) => (
            <TableRow
              key={song.id}
              className="hover:bg-tango-darkGray/50 cursor-pointer transition-colors rounded-lg group"
              onClick={() => onSongClick(song.spotify_id || null)}
            >
              <TableCell>
                {song.spotify_id && (
                  <PlayCircle
                    className={`h-4 w-4 ${
                      song.spotify_id === selectedTrackId
                        ? 'text-tango-red'
                        : 'text-tango-light group-hover:text-tango-light/80'
                    }`}
                  />
                )}
              </TableCell>
              <TableCell className="font-medium text-tango-light">
                {song.title}
              </TableCell>
              <TableCell className="text-tango-light">
                {song.orchestra?.name || 'Unknown'}
              </TableCell>
              <TableCell className="text-tango-light">
                {song.song_singer?.map(s => s.singer.name).join(', ') || 'Instrumental'}
              </TableCell>
              <TableCell className="text-tango-light capitalize">
                {song.type}
              </TableCell>
              <TableCell className="text-tango-light capitalize">
                {song.style}
              </TableCell>
              <TableCell className="text-tango-light">
                {song.recording_year || '-'}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`${
                    likedSongs.includes(song.id) ? 'text-tango-red' : 'text-gray-400'
                  } hover:text-tango-red`}
                  onClick={(e) => onLikeClick(e, song.id)}
                >
                  <Heart
                    className="h-4 w-4"
                    fill={likedSongs.includes(song.id) ? "currentColor" : "none"}
                  />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SongResultsTable;