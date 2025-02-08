import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import SongSearch from "@/components/SongSearch";
import SongResultsTable from "@/components/SongResultsTable";
import { useSongQuery } from "@/hooks/useSongQuery";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useUserRole } from "@/hooks/useUserRole";

interface Song {
  id: number;
  title: string;
  spotify_id?: string | null;
  orchestra?: { name: string };
  song_singer?: Array<{ singer: { name: string } }>;
}

interface SongSearchSectionProps {
  selectedTrackId: string | null;
  onSongClick: (spotify_id: string | null) => void;
  onAddSong: (song: Song) => void;
}

const SongSearchSection = ({
  selectedTrackId,
  onSongClick,
  onAddSong,
}: SongSearchSectionProps) => {
  const [searchParams, setSearchParams] = useState(null);
  const { data: userRole } = useUserRole();
  const { data: likedSongs } = useLikedSongs();
  const { data: songs, isLoading } = useSongQuery(searchParams);

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const handleClosePlayer = () => {
    onSongClick(null);
  };

  return (
    <div className="space-y-6">
      <SongSearch onSearch={handleSearch} />
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
          </div>
        ) : (
          <SongResultsTable
            songs={songs || []}
            likedSongs={likedSongs}
            selectedTrackId={selectedTrackId}
            isModerator={userRole === 'moderator'}
            onSongClick={onSongClick}
            onLikeClick={() => {}} // Empty function since we don't need like functionality here
            onAddClick={onAddSong}
          />
        )}
      </div>
      {selectedTrackId && (
        <SpotifyPlayer trackId={selectedTrackId} onClose={handleClosePlayer} />
      )}
    </div>
  );
};

export default SongSearchSection;