import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TandaSearch from "@/components/TandaSearch";
import TandaResultsTable from "@/components/TandaResultsTable";

const Tandas = () => {
  const [searchParams, setSearchParams] = useState(null);
  const navigate = useNavigate();

  const { data: tandas, isLoading } = useQuery({
    queryKey: ["tandas", searchParams],
    queryFn: async () => {
      let query = supabase
        .from("tanda")
        .select(`
          *,
          tanda_song (
            order_in_tanda,
            song (
              id,
              title,
              type,
              style,
              recording_year,
              is_instrumental,
              spotify_id,
              orchestra (name),
              song_singer (
                singer (name)
              )
            )
          )
        `);

      if (searchParams) {
        const { data: user } = await supabase.auth.getUser();
        const userId = user?.user?.id;

        // Handle visibility filters
        const visibilityConditions = [];
        if (searchParams.includeMine && userId) {
          visibilityConditions.push(`user_id.eq.${userId}`);
        }
        if (searchParams.includePublic) {
          visibilityConditions.push(`visibility.eq.public`);
        }
        if (searchParams.includeShared && userId) {
          const { data: sharedTandas } = await supabase
            .from('tanda_shared')
            .select('tanda_id')
            .eq('user_id', userId);
          
          if (sharedTandas?.length) {
            const sharedIds = sharedTandas.map(st => st.tanda_id);
            visibilityConditions.push(`id.in.(${sharedIds.join(',')})`);
          }
        }

        if (visibilityConditions.length > 0) {
          query = query.or(visibilityConditions.join(','));
        }

        // Handle other filters
        if (searchParams.orchestra) {
          query = query.contains('tanda_song.song.orchestra.name', [searchParams.orchestra]);
        }
        if (searchParams.singer) {
          query = query.contains('tanda_song.song.song_singer.singer.name', [searchParams.singer]);
        }
        if (searchParams.type) {
          query = query.contains('tanda_song.song.type', [searchParams.type]);
        }
        if (searchParams.style) {
          query = query.contains('tanda_song.song.style', [searchParams.style]);
        }
        if (searchParams.yearFrom || searchParams.yearTo) {
          const yearConditions = [];
          if (searchParams.yearFrom) {
            yearConditions.push(`recording_year >= ${searchParams.yearFrom}`);
          }
          if (searchParams.yearTo) {
            yearConditions.push(`recording_year <= ${searchParams.yearTo}`);
          }
          query = query.contains('tanda_song.song', yearConditions);
        }
        if (searchParams.isInstrumental) {
          // For instrumental tandas, all songs must be instrumental
          query = query.not('tanda_song.song.is_instrumental', 'eq', false);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: searchParams !== null,
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-tango-light">Tandas</h1>
          <Button
            onClick={() => navigate('/tandas/create')}
            className="bg-tango-red hover:bg-tango-red/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Tanda
          </Button>
        </div>
        <TandaSearch onSearch={handleSearch} />
      </div>
      
      <ScrollArea className="h-[calc(100vh-300px)]">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
          </div>
        ) : (
          <TandaResultsTable tandas={tandas || []} />
        )}
      </ScrollArea>
    </main>
  );
};

export default Tandas;