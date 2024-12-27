import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Copy } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PlaylistsGridProps {
  playlists: any[];
  onDeletePlaylist: (id: number) => void;
  onSelectPlaylist?: (id: number) => void;
  currentUserId?: string;
}

const PlaylistsGrid = ({ playlists, onDeletePlaylist, onSelectPlaylist, currentUserId }: PlaylistsGridProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDuplicatePlaylist = async (playlist: any) => {
    try {
      // First, create a new playlist
      const { data: newPlaylist, error: playlistError } = await supabase
        .from('playlist')
        .insert({
          title: `${playlist.title} - copy`,
          description: playlist.description,
          spotify_link: playlist.spotify_link,
          visibility: 'private',
          user_id: currentUserId
        })
        .select()
        .single();

      if (playlistError) throw playlistError;

      // Then, copy all tandas from the original playlist
      if (playlist.playlist_tanda && playlist.playlist_tanda.length > 0) {
        const playlistTandaEntries = playlist.playlist_tanda.map((pt: any) => ({
          playlist_id: newPlaylist.id,
          tanda_id: pt.tanda.id,
          order_in_playlist: pt.order_in_playlist
        }));

        const { error: tandaError } = await supabase
          .from('playlist_tanda')
          .insert(playlistTandaEntries);

        if (tandaError) throw tandaError;
      }

      // Invalidate the playlists query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["playlists"] });

      toast({
        title: "Success",
        description: "Playlist duplicated successfully!",
      });

      // Navigate to the playlists page
      navigate('/playlists');
    } catch (error) {
      console.error('Error duplicating playlist:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to duplicate playlist. Please try again.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {playlists.map((playlist) => (
        <Card 
          key={playlist.id} 
          className="bg-tango-darkGray border-tango-gray hover:border-tango-red transition-colors cursor-pointer relative group"
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
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicatePlaylist(playlist);
                  }}
                  title="Duplicate playlist"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {playlist.user_id === currentUserId && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/playlists/edit/${playlist.id}`);
                      }}
                      title="Edit playlist"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-tango-light opacity-0 group-hover:opacity-100 hover:text-tango-red transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePlaylist(playlist.id);
                      }}
                      title="Delete playlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
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