import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useTandasQuery } from "@/hooks/useTandasQuery";
import { Loader2 } from "lucide-react";
import { SearchParams } from "@/types/tanda";

interface TandaSearchSectionProps {
  onAddTanda: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
}

const TandaSearchSection = ({ onAddTanda, onTandaClick }: TandaSearchSectionProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    includeMine: true,
    includePublic: true,
    includeShared: true
  });
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const session = useSession();

  const { data: tandas, isLoading } = useTandasQuery(
    searchTrigger > 0 ? searchParams : null, 
    session?.user?.id
  );

  // Effect to log search results when they change
  useEffect(() => {
    if (searchTrigger > 0) {
      console.log("Search params:", searchParams);
      console.log("Search results:", tandas);
    }
  }, [tandas, searchParams, searchTrigger]);

  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
    setSearchTrigger(prev => prev + 1);
  };

  const handleSongClick = (spotify_id: string | null) => {
    if (spotify_id) {
      setSelectedTrackId(spotify_id);
    }
  };

  return (
    <div className="space-y-6">
      <TandaSearch onSearch={handleSearch} />
      
      {searchTrigger === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)] text-tango-light">
          Use the search filters above to find tandas
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
        </div>
      ) : tandas && tandas.length > 0 ? (
        <TandasGrid
          tandas={tandas}
          currentUserId={session?.user?.id}
          onAddClick={onAddTanda}
          onTandaClick={onTandaClick}
          onSongClick={handleSongClick}
          showAddButton
        />
      ) : (
        <div className="flex justify-center items-center h-[calc(100vh-300px)] text-tango-light">
          No tandas found matching your search criteria
        </div>
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