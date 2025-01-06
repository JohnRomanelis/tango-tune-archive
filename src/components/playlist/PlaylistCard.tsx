import { Globe, Lock, Users, Trash, Pencil, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

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
  isLiked: boolean;
  onLikeToggle: () => void;
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

const PlaylistCard = ({ playlist, onDelete, isLiked, onLikeToggle }: PlaylistCardProps) => {
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

      <div className="bg-tango-darkGray rounded p-3 mt-2 border border-tango-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-tango-light">
            {tandaCount} {tandaCount === 1 ? "tanda" : "tandas"}
          </span>
          <span className="text-sm font-semibold text-tango-red bg-tango-gray px-2 py-1 rounded">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`${isLiked ? 'text-tango-red' : 'text-tango-light'} opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity`}
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle();
          }}
        >
          <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
        </Button>
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