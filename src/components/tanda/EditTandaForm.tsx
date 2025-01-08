import { Button } from "@/components/ui/button";
import TandaForm from "@/components/tanda/TandaForm";
import SelectedSongsList from "@/components/tanda/SelectedSongsList";
import { useNavigate } from "react-router-dom";

interface EditTandaFormProps {
  title: string;
  comments: string;
  spotifyLink: string;
  isPublic: boolean;
  selectedSongs: any[];
  selectedTrackId: string | null;
  onTitleChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
  onSpotifyLinkChange: (value: string) => void;
  onVisibilityChange: (value: boolean) => void;
  onSongClick: (spotify_id: string | null) => void;
  onRemoveSong: (songId: number) => void;
  onReorder: (result: any) => void;
  onUpdate: () => void;
}

const EditTandaForm = ({
  title,
  comments,
  spotifyLink,
  isPublic,
  selectedSongs,
  selectedTrackId,
  onTitleChange,
  onCommentsChange,
  onSpotifyLinkChange,
  onVisibilityChange,
  onSongClick,
  onRemoveSong,
  onReorder,
  onUpdate
}: EditTandaFormProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-2/5 space-y-6">
      <TandaForm
        title={title}
        comments={comments}
        spotifyLink={spotifyLink}
        isPublic={isPublic}
        onTitleChange={onTitleChange}
        onCommentsChange={onCommentsChange}
        onSpotifyLinkChange={onSpotifyLinkChange}
        onVisibilityChange={onVisibilityChange}
      />

      <SelectedSongsList
        songs={selectedSongs}
        onSongClick={onSongClick}
        onRemoveSong={onRemoveSong}
        onReorder={onReorder}
      />

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate("/tandas")}
        >
          Cancel
        </Button>
        <Button
          onClick={onUpdate}
          className="bg-tango-red hover:bg-tango-red/90"
        >
          Update Tanda
        </Button>
      </div>
    </div>
  );
};

export default EditTandaForm;