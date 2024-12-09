import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface TandaFormProps {
  title: string;
  comments: string;
  spotifyLink: string;
  isPublic: boolean;
  onTitleChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
  onSpotifyLinkChange: (value: string) => void;
  onVisibilityChange: (value: boolean) => void;
}

const TandaForm = ({
  title,
  comments,
  spotifyLink,
  isPublic,
  onTitleChange,
  onCommentsChange,
  onSpotifyLinkChange,
  onVisibilityChange,
}: TandaFormProps) => {
  return (
    <div className="bg-tango-gray rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-tango-light mb-4">Create New Tanda</h2>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          placeholder="Enter tanda title..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          placeholder="Add any comments..."
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

export default TandaForm;