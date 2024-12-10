import { Globe, Lock, Users, Trash, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Playlist {
  id: number;
  title: string;
  description: string | null;
  visibility: "private" | "public" | "shared";
  total_duration?: number;
  playlist_tanda?: Array<{
    order_in_playlist: number;
    tanda: {
      id: number;
      title: string;
    };
  }>;
}

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete: () => void;
}

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
};

const PlaylistCard = ({ playlist, onDelete }: PlaylistCardProps) => {
  const navigate = useNavigate();
  const tandaCount = playlist.playlist_tanda?.length || 0;
  const duration = playlist.total_duration || 0;

  return (
    <div className="bg-tango-gray rounded-lg p-4 relative group hover:bg-tango-gray/90 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-tango-light">{playlist.title}</h3>
        <div className="text-tango-light">
          {playlist.visibility === "private" && <Lock className="h-4 w-4" />}
          {playlist.visibility === "public" && <Globe className="h-4 w-4" />}
          {playlist.visibility === "shared" && <Users className="h-4 w-4" />}
        </div>
      </div>

      {playlist.description && (
        <p className="text-sm text-tango-light/80 mb-4">{playlist.description}</p>
      )}

      <div className="space-y-1">
        <p className="text-sm text-tango-light/80">
          {tandaCount} {tandaCount === 1 ? "tanda" : "tandas"}
        </p>
        <p className="text-sm text-tango-light/80">
          Duration: {formatDuration(duration)}
        </p>
      </div>

      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/playlists/edit/${playlist.id}`);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlaylistCard;