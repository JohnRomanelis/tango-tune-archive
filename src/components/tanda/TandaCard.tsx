import { Globe, Lock, Users, Trash, Plus, PlayCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TandaCardProps {
  tanda: any;
  currentUserId?: string | null;
  onDelete?: () => void;
  onAddClick?: () => void;
  onSongClick?: (spotify_id: string | null) => void;
  onEditClick?: () => void;
  showAddButton?: boolean;
}

const TandaCard = ({ 
  tanda, 
  currentUserId, 
  onDelete, 
  onAddClick, 
  onSongClick,
  onEditClick,
  showAddButton 
}: TandaCardProps) => {
  const isOwner = currentUserId && tanda.user_id === currentUserId;
  const songCount = tanda.tanda_song?.length || 0;

  // Get the type and style from the first song in the tanda
  const firstSong = tanda.tanda_song?.[0]?.song;
  const type = firstSong?.type || '-';
  const style = firstSong?.style || '-';

  return (
    <div className="bg-tango-gray rounded-lg p-4 relative group hover:bg-tango-gray/90 transition-colors h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-tango-light">{tanda.title}</h3>
        <div className="flex items-center gap-2">
          <div className="text-tango-light">
            {tanda.visibility === "private" && <Lock className="h-4 w-4" />}
            {tanda.visibility === "public" && <Globe className="h-4 w-4" />}
            {tanda.visibility === "shared" && <Users className="h-4 w-4" />}
          </div>
          {isOwner && onEditClick && !showAddButton && (
            <Button
              variant="ghost"
              size="icon"
              className="text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {tanda.comments && (
        <p className="text-sm text-tango-light/80 mb-4">{tanda.comments}</p>
      )}

      <div className="space-y-1 mb-4">
        <p className="text-sm text-tango-light/80">
          Orchestra: {tanda.tanda_song?.[0]?.song.orchestra?.name || "Unknown"}
        </p>
        <p className="text-sm text-tango-light/80">
          {songCount} {songCount === 1 ? "song" : "songs"}
        </p>
        <p className="text-sm text-tango-light/80 capitalize">
          Type: {type}
        </p>
        <p className="text-sm text-tango-light/80 capitalize">
          Style: {style}
        </p>
      </div>

      {onSongClick && tanda.tanda_song && (
        <div className="space-y-2 mb-4">
          {tanda.tanda_song
            .sort((a: any, b: any) => a.order_in_tanda - b.order_in_tanda)
            .map((ts: any) => (
              <div
                key={ts.song.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSongClick(ts.song.spotify_id);
                }}
                className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-tango-darkGray/50 transition-colors"
              >
                {ts.song.spotify_id && <PlayCircle className="h-4 w-4 text-tango-light" />}
                <div>
                  <p className="text-sm font-medium text-tango-light">{ts.song.title}</p>
                  <p className="text-xs text-tango-light/80">
                    {ts.song.orchestra?.name} {ts.song.recording_year ? `(${ts.song.recording_year})` : ''}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}

      {showAddButton && onAddClick && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onAddClick();
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}

      {isOwner && onDelete && !showAddButton && (
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
      )}
    </div>
  );
};

export default TandaCard;