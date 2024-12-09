import { ScrollArea } from "@/components/ui/scroll-area";
import { ListOrdered } from "lucide-react";

interface PlaylistDetailsProps {
  playlist: any;
}

const PlaylistDetails = ({ playlist }: PlaylistDetailsProps) => {
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
                    <p className="capitalize">
                      Type: {pt.tanda.tanda_song[0]?.song.type || "Unknown"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {pt.tanda.tanda_song
                      .sort((a: any, b: any) => a.order_in_tanda - b.order_in_tanda)
                      .map((ts: any) => (
                        <div key={ts.song.id} className="bg-tango-gray p-2 rounded">
                          <p className="font-medium text-tango-light">
                            {ts.song.title}
                          </p>
                          <p className="text-xs text-tango-light/80">
                            {ts.song.song_singer?.map((s: any) => s.singer.name).join(", ") || "Instrumental"}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PlaylistDetails;