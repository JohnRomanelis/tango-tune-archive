import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface PlaylistFormProps {
  title: string;
  description: string;
  spotifyLink: string;
  isPublic: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSpotifyLinkChange: (value: string) => void;
  onVisibilityChange: (value: boolean) => void;
}

const PlaylistForm = ({
  title,
  description,
  spotifyLink,
  isPublic,
  onTitleChange,
  onDescriptionChange,
  onSpotifyLinkChange,
  onVisibilityChange,
}: PlaylistFormProps) => {
  return (
    <div className="bg-tango-gray rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-tango-light mb-4">Create New Playlist</h2>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          placeholder="Enter playlist title..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          placeholder="Add a description..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spotify">Spotify Link</Label>
        <Input
          id="spotify"
          value={spotifyLink}
          onChange={(e) => onSpotifyLinkChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          placeholder="Add Spotify playlist link..."
        />
      </div>

      <div className="space-y-2">
        <Label>Visibility</Label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isPublic}
            onCheckedChange={onVisibilityChange}
          />
          <span className="text-sm text-tango-light">
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistForm;