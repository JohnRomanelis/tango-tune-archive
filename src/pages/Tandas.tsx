import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import TandasHeader from "@/components/tanda/TandasHeader";
import TandasGrid from "@/components/tanda/TandasGrid";

const Tandas = () => {
  const [searchParams, setSearchParams] = useState(null);
  const user = useAuthRedirect();

  const { data: tandas, isLoading, refetch } = useQuery({
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

        // Apply other filters
        if (searchParams.orchestra) {
          query = query.ilike('tanda_song.song.orchestra.name', `%${searchParams.orchestra}%`);
        }
        if (searchParams.singer) {
          const { data: songIds } = await supabase
            .from('song_singer')
            .select('song_id, singer!inner(name)')
            .eq('singer.name', searchParams.singer);

          if (songIds?.length) {
            query = query.in('tanda_song.song.id', songIds.map(s => s.song_id));
          } else {
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

      if (searchParams?.isInstrumental) {
        return data?.filter(tanda => 
          tanda.tanda_song?.every(ts => ts.song?.is_instrumental)
        ) || [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <TandasHeader onSearch={setSearchParams} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
        </div>
      ) : (
        <TandasGrid
          tandas={tandas || []}
          currentUserId={user.id}
          onTandaDeleted={refetch}
        />
      )}
    </main>
  );
};

export default Tandas;