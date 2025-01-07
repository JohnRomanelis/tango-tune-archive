import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useTandasQuery } from "@/hooks/useTandasQuery";
import { Loader2 } from "lucide-react";
import { SearchParams } from "@/types/tanda";

interface TandaSearchContainerProps {
  onAddTanda: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
}

const TandaSearchContainer = ({ onAddTanda, onTandaClick }: TandaSearchContainerProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    includeMine: true,
    includeShared: false,
    includePublic: false,
    includeLiked: false
  });
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const session = useSession();
  const hasSession = !!session?.user;
  const userId = session?.user?.id;

  const { data: tandas, isLoading } = useTandasQuery(
    searchTrigger > 0 ? searchParams : null,
    userId,
    searchTrigger
  );

  // Debug logs - moved after tandas declaration
  useEffect(() => {
    console.log("TandaSearchContainer state:", {
      searchParams,
      searchTrigger,
      hasSession,
      userId,
      tandasCount: tandas?.length
    });
    console.log("Session state:", {
      session,
      userId,
      isAuthenticated: !!session?.user
    });
  }, [searchParams, searchTrigger, session, userId, tandas?.length]);

  const handleSearch = (params: SearchParams) => {
    console.log("Search triggered with params:", params);
    setSearchParams(params);
    setSearchTrigger(prev => prev + 1);
  };

  const handleSongClick = (spotify_id: string | null) => {
    if (spotify_id) {
      setSelectedTrackId(spotify_id);
    }
  };

  if (!hasSession) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-300px)] text-tango-light">
        Please log in to search tandas
      </div>
    );
  }

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
          currentUserId={userId}
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

export default TandaSearchContainer;