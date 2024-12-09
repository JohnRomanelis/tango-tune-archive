import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import TandaSearch from "@/components/TandaSearch";
import TandasGrid from "@/components/tanda/TandasGrid";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Tandas = () => {
  const [searchParams, setSearchParams] = useState(null);
  const user = useAuthRedirect();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tandas, isLoading } = useQuery({
    queryKey: ["tandas", searchParams, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

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
        const userId = user?.id;

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

        if (searchParams.orchestra) {
          query = query.ilike('tanda_song.song.orchestra.name', `%${searchParams.orchestra}%`);
        }
        if (searchParams.singer) {
          // First, get song IDs that match the singer
          const { data: songIds } = await supabase
            .from('song_singer')
            .select(`
              song_id,
              singer!inner (
                name
              )
            `)
            .eq('singer.name', searchParams.singer);

          if (songIds?.length) {
            query = query.in('tanda_song.song.id', songIds.map(s => s.song_id));
          } else {
            // If no songs found with this singer, return empty result
            return [];
          }
        }
        if (searchParams.type) {
          query = query.eq('tanda_song.song.type', searchParams.type);
        }
        if (searchParams.style) {
          query = query.eq('tanda_song.song.style', searchParams.style);
        }
        if (searchParams.yearFrom || searchParams.yearTo) {
          if (searchParams.yearFrom) {
            query = query.gte('tanda_song.song.recording_year', searchParams.yearFrom);
          }
          if (searchParams.yearTo) {
            query = query.lte('tanda_song.song.recording_year', searchParams.yearTo);
          }
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter instrumental tandas after fetching
      if (searchParams?.isInstrumental) {
        return data?.filter(tanda => 
          tanda.tanda_song?.every(ts => ts.song?.is_instrumental)
        ) || [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  const handleDeleteTanda = async (tandaId: number) => {
    const { error } = await supabase.from("tanda").delete().eq("id", tandaId);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete tanda",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ["tandas"] });
      toast({
        title: "Success",
        description: "Tanda deleted successfully",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

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
        <TandasGrid
          tandas={tandas || []}
          isLoading={isLoading}
          currentUserId={user?.id}
          onDelete={handleDeleteTanda}
        />
      </ScrollArea>
    </main>
  );
};

export default Tandas;