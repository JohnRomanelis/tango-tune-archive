import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface PlaylistsGridProps {
  playlists: any[];
  onDeletePlaylist: (id: number) => void;
  onSelectPlaylist?: (id: number) => void;
}

const PlaylistsGrid = ({ playlists, onDeletePlaylist, onSelectPlaylist }: PlaylistsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {playlists.map((playlist) => (
        <Card 
          key={playlist.id} 
          className="bg-tango-darkGray border-tango-gray hover:border-tango-red transition-colors cursor-pointer"
          onClick={() => onSelectPlaylist?.(playlist.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-tango-light">{playlist.title}</CardTitle>
                <CardDescription className="text-tango-gray">
                  {formatDuration(playlist.total_duration)}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-tango-light hover:text-tango-red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeletePlaylist(playlist.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-tango-light">
              {playlist.description || "No description"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlaylistsGrid;