import { ScrollArea } from "@/components/ui/scroll-area";
import { ListOrdered, PlayCircle } from "lucide-react";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useState } from "react";

interface PlaylistDetailsProps {
  playlist: any;
}

const PlaylistDetails = ({ playlist }: PlaylistDetailsProps) => {
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  if (!playlist) return null;

  const getYearRange = (tandaSongs: any[]) => {
    const years = tandaSongs
      .map((ts: any) => ts.song.recording_year)
      .filter(Boolean);
    if (years.length === 0) return "Unknown";
    const min = Math.min(...years);
    const max = Math.max(...years);
    return min === max ? min : `${min} - ${max}`;
  };

  const getStyles = (tandaSongs: any[]) => {
    const styles = new Set(
      tandaSongs
        .map((ts: any) => ts.song.style)
        .filter(Boolean)
    );
    return Array.from(styles).join(", ");
  };

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  return (
    <div className="bg-tango-gray rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-tango-light mb-2">{playlist.title}</h2>
        {playlist.description && (
          <p className="text-tango-light/80">{playlist.description}</p>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-tango-light">
          <ListOrdered className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Tandas</h3>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {playlist.playlist_tanda
              ?.sort((a: any, b: any) => a.order_in_playlist - b.order_in_playlist)
              .map((pt: any) => (
                <div key={pt.tanda.id} className="bg-tango-darkGray p-4 rounded-lg">
                  <h4 className="text-tango-light font-semibold mb-2">
                    {pt.tanda.title}
                  </h4>
                  
                  <div className="space-y-1 text-sm text-tango-light/80 mb-3">
                    <p>Orchestra: {pt.tanda.tanda_song[0]?.song.orchestra?.name || "Unknown"}</p>
                    <p>Years: {getYearRange(pt.tanda.tanda_song)}</p>
                    <p className="capitalize">Type: {pt.tanda.tanda_song[0]?.song.type || "Unknown"}</p>
                    <p className="capitalize">Styles: {getStyles(pt.tanda.tanda_song)}</p>
                  </div>

                  <div className="space-y-2">
                    {pt.tanda.tanda_song
                      .sort((a: any, b: any) => a.order_in_tanda - b.order_in_tanda)
                      .map((ts: any) => (
                        <div 
                          key={ts.song.id} 
                          className={`bg-tango-gray p-2 rounded cursor-pointer hover:bg-tango-gray/80 transition-colors ${
                            ts.song.spotify_id === selectedTrackId ? 'ring-1 ring-tango-red' : ''
                          }`}
                          onClick={() => handleSongClick(ts.song.spotify_id)}
                        >
                          <div className="flex items-center gap-2">
                            {ts.song.spotify_id && (
                              <PlayCircle className="h-4 w-4 text-tango-light" />
                            )}
                            <div>
                              <p className="font-medium text-tango-light">
                                {ts.song.title}
                              </p>
                              <p className="text-xs text-tango-light/80">
                                {ts.song.orchestra?.name} - {ts.song.song_singer?.map((s: any) => s.singer.name).join(", ") || "Instrumental"} ({ts.song.recording_year || "Unknown"})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>

      {selectedTrackId && (
        <SpotifyPlayer
          trackId={selectedTrackId}
          onClose={() => setSelectedTrackId(null)}
        />
      )}
    </div>
  );
};

export default PlaylistDetails;