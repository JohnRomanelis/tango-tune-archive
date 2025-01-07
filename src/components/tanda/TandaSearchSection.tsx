import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useTandasQuery } from "@/hooks/useTandasQuery";
import { Loader2 } from "lucide-react";

interface TandaSearchSectionProps {
  onAddTanda: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
}

const TandaSearchSection = ({ onAddTanda, onTandaClick }: TandaSearchSectionProps) => {
  const [searchParams, setSearchParams] = useState({
    includeMine: true,
    includePublic: true,
    includeShared: true
  });
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const session = useSession();

  const { data: tandas, isLoading } = useTandasQuery(searchParams, session?.user?.id);

  const handleSearch = (params: any) => {
    setSearchParams(params);
    // Debug log to see the search results
    console.log("Search params:", params);
    console.log("Search results:", tandas);
  };

  const handleSongClick = (spotify_id: string | null) => {
    if (spotify_id) {
      setSelectedTrackId(spotify_id);
    }
  };

  return (
    <div className="space-y-6">
      <TandaSearch onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
        </div>
      ) : (
        <TandasGrid
          tandas={tandas || []}
          currentUserId={session?.user?.id}
          onAddClick={onAddTanda}
          onTandaClick={onTandaClick}
          onSongClick={handleSongClick}
          showAddButton
        />
      )}

      {selectedTrackId && (
        <SpotifyPlayer
          trackId={selectedTrackId}
          onClose={() => setSelectedTrackId(null)}
        />
      )}
    </div>
  );
};

export default TandaSearchSection;