import { PlayCircle } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import SongRowActions from "./SongRowActions";

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

interface SongTableRowProps {
  song: Song;
  isSelected: boolean;
  isLiked: boolean;
  isModerator: boolean;
  onSongClick: () => void;
  onLikeClick: (e: React.MouseEvent) => void;
  onAddClick?: () => void;
}

const SongTableRow = ({
  song,
  isSelected,
  isLiked,
  isModerator,
  onSongClick,
  onLikeClick,
  onAddClick,
}: SongTableRowProps) => {
  return (
    <TableRow
      className="hover:bg-tango-darkGray/50 cursor-pointer transition-colors rounded-lg group"
      onClick={onSongClick}
    >
      <TableCell>
        {song.spotify_id && (
          <PlayCircle
            className={`h-4 w-4 ${
              isSelected
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
        {song.song_singer && song.song_singer.length > 0
          ? song.song_singer.map(s => s.singer.name).join(', ')
          : 'Instrumental'}
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
        <SongRowActions
          songId={song.id}
          isLiked={isLiked}
          isModerator={isModerator}
          onLikeClick={onLikeClick}
          onAddClick={onAddClick}
        />
      </TableCell>
    </TableRow>
  );
};

export default SongTableRow;