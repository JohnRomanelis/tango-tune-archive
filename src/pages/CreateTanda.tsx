import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Minus, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SongSearch from "@/components/SongSearch";
import SongResultsTable from "@/components/SongResultsTable";
import SpotifyPlayer from "@/components/SpotifyPlayer";

interface TandaSong {
  id: number;
  title: string;
  spotify_id: string | null;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
}

const CreateTanda = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [spotifyLink, setSpotifyLink] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<TandaSong[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  const handleAddSong = (song: TandaSong) => {
    if (selectedSongs.some(s => s.id === song.id)) {
      toast({
        title: "Song already in tanda",
        description: "This song is already part of the tanda.",
        variant: "destructive",
      });
      return;
    }
    setSelectedSongs(prev => [...prev, song]);
  };

  const handleRemoveSong = (songId: number) => {
    setSelectedSongs(prev => prev.filter(song => song.id !== songId));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(selectedSongs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedSongs(items);
  };

  const handleSaveTanda = async () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please enter a title for the tanda.",
        variant: "destructive",
      });
      return;
    }

    if (selectedSongs.length === 0) {
      toast({
        title: "No songs selected",
        description: "Please add at least one song to the tanda.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Insert tanda
      const { data: tanda, error: tandaError } = await supabase
        .from('tanda')
        .insert({
          title,
          comments,
          spotify_link: spotifyLink,
          user_id: user.id,
          visibility: 'private'
        })
        .select()
        .single();

      if (tandaError) throw tandaError;

      // Insert tanda_song entries
      const tandaSongEntries = selectedSongs.map((song, index) => ({
        tanda_id: tanda.id,
        song_id: song.id,
        order_in_tanda: index + 1
      }));

      const { error: tandaSongError } = await supabase
        .from('tanda_song')
        .insert(tandaSongEntries);

      if (tandaSongError) throw tandaSongError;

      toast({
        title: "Success",
        description: "Tanda created successfully!",
      });

      navigate('/tandas');
    } catch (error) {
      console.error('Error creating tanda:', error);
      toast({
        title: "Error",
        description: "Failed to create tanda. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <div className="flex space-x-6">
        {/* Left side - Tanda form and selected songs */}
        <div className="w-1/2 space-y-6">
          <div className="bg-tango-gray rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold text-tango-light mb-4">Create New Tanda</h2>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-tango-darkGray text-tango-light"
                placeholder="Enter tanda title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="bg-tango-darkGray text-tango-light"
                placeholder="Add any comments..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spotify">Spotify Link</Label>
              <Input
                id="spotify"
                value={spotifyLink}
                onChange={(e) => setSpotifyLink(e.target.value)}
                className="bg-tango-darkGray text-tango-light"
                placeholder="Add Spotify playlist link..."
              />
            </div>
          </div>

          <div className="bg-tango-gray rounded-lg p-6">
            <h3 className="text-xl font-semibold text-tango-light mb-4">Selected Songs</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="songs">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {selectedSongs.map((song, index) => (
                      <Draggable
                        key={song.id}
                        draggableId={song.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center space-x-2 bg-tango-darkGray p-2 rounded-md group hover:bg-tango-darkGray/80"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-tango-light" />
                            </div>
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => handleSongClick(song.spotify_id || null)}
                            >
                              <div className="text-tango-light">{song.title}</div>
                              <div className="text-sm text-tango-light/70">
                                {song.orchestra?.name} - {song.song_singer?.map(s => s.singer.name).join(', ') || 'Instrumental'}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSong(song.id)}
                              className="opacity-0 group-hover:opacity-100 text-tango-light hover:text-tango-red"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveTanda}
              className="bg-tango-red hover:bg-tango-red/90"
            >
              Save Tanda
            </Button>
          </div>
        </div>

        {/* Right side - Song search and player */}
        <div className="w-1/2 space-y-6">
          <div className="space-y-6">
            <SongSearch onSearch={() => {}} />
            <ScrollArea className="h-[calc(100vh-500px)]">
              <SongResultsTable
                songs={[]}
                likedSongs={[]}
                selectedTrackId={selectedTrackId}
                onSongClick={handleSongClick}
                onLikeClick={() => {}}
                onAddClick={handleAddSong}
              />
            </ScrollArea>
          </div>
          <div className="fixed bottom-0 right-0 w-1/2 pr-4 sm:pr-6 lg:pr-8">
            <SpotifyPlayer trackId={selectedTrackId} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateTanda;