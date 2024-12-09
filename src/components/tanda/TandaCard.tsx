import { Globe, Lock, Users, Trash, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TandaCardProps {
  tanda: {
    id: number;
    title: string;
    comments?: string | null;
    visibility?: "private" | "public" | "shared";
    tanda_song?: Array<{
      order_in_tanda: number;
      song: {
        id: number;
        title: string;
        type?: string;
        style?: string;
        recording_year?: number | null;
        spotify_id?: string | null;
        orchestra?: {
          name: string;
        } | null;
        song_singer?: Array<{
          singer: {
            name: string;
          };
        }> | null;
      };
    }>;
  };
  showAddButton?: boolean;
  onAdd?: () => void;
  onDelete?: () => void;
  onSongClick?: (spotify_id: string | null) => void;
  selectedTrackId?: string | null;
  currentUserId?: string;
  userId?: string | null;
}

const TandaCard = ({
  tanda,
  showAddButton = false,
  onAdd,
  onDelete,
  onSongClick,
  selectedTrackId,
  currentUserId,
  userId,
}: TandaCardProps) => {
  const canDelete = currentUserId === userId;
  const songCount = tanda.tanda_song?.length || 0;

  const getYearRange = () => {
    if (!tanda.tanda_song?.length) return "Unknown";
    const years = tanda.tanda_song
      .map((ts) => ts.song.recording_year)
      .filter(Boolean) as number[];
    if (years.length === 0) return "Unknown";
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? min : `${min} - ${max}`;
  };

  const getStyles = () => {
    if (!tanda.tanda_song?.length) return "Unknown";
    const styles = new Set(
      tanda.tanda_song.map((ts) => ts.song.style).filter(Boolean)
    );
    return Array.from(styles).join(", ");
  };

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

      <div className="space-y-1 text-sm text-tango-light/80 mb-4">
        <p>Orchestra: {tanda.tanda_song?.[0]?.song.orchestra?.name || "Unknown"}</p>
        <p>Years: {getYearRange()}</p>
        <p className="capitalize">Style: {getStyles()}</p>
      </div>

      <div className="space-y-2">
        {tanda.tanda_song?.map((ts) => (
          <div
            key={ts.song.id}
            className={`bg-tango-darkGray p-2 rounded cursor-pointer hover:bg-tango-darkGray/80 transition-colors ${
              ts.song.spotify_id === selectedTrackId ? "ring-1 ring-tango-red" : ""
            }`}
            onClick={() => onSongClick?.(ts.song.spotify_id || null)}
          >
            <div className="flex items-center gap-2">
              {ts.song.spotify_id && (
                <PlayCircle
                  className={`h-4 w-4 ${
                    ts.song.spotify_id === selectedTrackId
                      ? "text-tango-red"
                      : "text-tango-light"
                  }`}
                />
              )}
              <div>
                <p className="font-medium text-tango-light">{ts.song.title}</p>
                <p className="text-xs text-tango-light/80">
                  {ts.song.orchestra?.name} -{" "}
                  {ts.song.song_singer?.map((s) => s.singer.name).join(", ") ||
                    "Instrumental"}{" "}
                  ({ts.song.recording_year || "Unknown"})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddButton && onAdd && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="absolute bottom-2 right-2 text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity"
        >
          Add to Playlist
        </Button>
      )}

      {canDelete && onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Tanda</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{tanda.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-tango-red hover:bg-tango-red/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default TandaCard;