import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { GripVertical, Minus } from "lucide-react";

interface Song {
  id: number;
  title: string;
  spotify_id?: string | null;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
  recording_year?: number;
}

interface SelectedSongsListProps {
  songs: Song[];
  onSongClick: (spotify_id: string | null) => void;
  onRemoveSong: (id: number) => void;
  onReorder: (result: any) => void;
}

const SelectedSongsList = ({
  songs,
  onSongClick,
  onRemoveSong,
  onReorder,
}: SelectedSongsListProps) => {
  return (
    <div className="bg-tango-gray rounded-lg p-6">
      <h3 className="text-xl font-semibold text-tango-light mb-4">Selected Songs</h3>
      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId="songs">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {songs.map((song, index) => (
                <Draggable
                  key={song.id}
                  draggableId={song.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex flex-col bg-tango-darkGray p-3 rounded-md group hover:bg-tango-darkGray/80"
                    >
                      <div className="flex items-center space-x-2">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="h-4 w-4 text-tango-light" />
                        </div>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => onSongClick(song.spotify_id || null)}
                        >
                          <div className="text-tango-light font-medium">{song.title}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveSong(song.id)}
                          className="text-tango-light hover:text-tango-red"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-1 ml-6 text-sm text-tango-light/70">
                        {song.orchestra?.name} - {song.song_singer?.map(s => s.singer.name).join(', ') || 'Instrumental'}
                        {song.recording_year && ` (${song.recording_year})`}
                      </div>
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
  );
};

export default SelectedSongsList;