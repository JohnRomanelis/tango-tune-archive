import { Heart, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SongRowActionsProps {
  songId: number;
  isLiked: boolean;
  isModerator: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
  onAddClick?: () => void;
}

const SongRowActions = ({
  songId,
  isLiked,
  isModerator,
  onLikeClick,
  onAddClick,
}: SongRowActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className={`${
          isLiked ? 'text-tango-red' : 'text-gray-400'
        } hover:text-tango-red`}
        onClick={onLikeClick}
      >
        <Heart
          className="h-4 w-4"
          fill={isLiked ? "currentColor" : "none"}
        />
      </Button>
      {onAddClick && (
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-tango-red"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}
      {isModerator && (
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-tango-red"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/songs/${songId}/edit`);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SongRowActions;