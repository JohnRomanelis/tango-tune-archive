import { Globe, Lock, Users, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TandaCardProps {
  tanda: any;
  currentUserId?: string | null;
  onDelete?: () => void;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

const TandaCard = ({ tanda, currentUserId, onDelete, onAddClick, showAddButton }: TandaCardProps) => {
  const isOwner = currentUserId && tanda.user_id === currentUserId;
  const songCount = tanda.tanda_song?.length || 0;

  // Get the type and style from the first song in the tanda
  const firstSong = tanda.tanda_song?.[0]?.song;
  const type = firstSong?.type || '-';
  const style = firstSong?.style || '-';

  return (
    <div className="bg-tango-gray rounded-lg p-4 relative group hover:bg-tango-gray/90 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-tango-light">{tanda.title}</h3>
        <div className="text-tango-light">
          {tanda.visibility === "private" && <Lock className="h-4 w-4" />}
          {tanda.visibility === "public" && <Globe className="h-4 w-4" />}
          {tanda.visibility === "shared" && <Users className="h-4 w-4" />}
        </div>
      </div>

      {tanda.comments && (
        <p className="text-sm text-tango-light/80 mb-4">{tanda.comments}</p>
      )}

      <div className="space-y-1 mb-4">
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