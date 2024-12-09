import { Globe, Lock, Users, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Playlist {
  id: number;
  title: string;
  description: string | null;
  visibility: "private" | "public" | "shared";
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

const PlaylistCard = ({ playlist, onDelete }: PlaylistCardProps) => {
  const tandaCount = playlist.playlist_tanda?.length || 0;

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

      <p className="text-sm text-tango-light/80">
        {tandaCount} {tandaCount === 1 ? "tanda" : "tandas"}
      </p>

      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PlaylistCard;