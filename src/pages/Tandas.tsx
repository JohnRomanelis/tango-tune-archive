import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, User, Users, Globe, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TandaSearch from "@/components/TandaSearch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

const Tandas = () => {
  const [searchParams, setSearchParams] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
      toast({
        title: "Success",
        description: "Tanda deleted successfully",
      });
    }
  };

  const getTandaMetadata = (tanda) => {
    const songs = tanda.tanda_song || [];
    const orchestras = new Set(songs.map(ts => ts.song.orchestra.name));
    const types = new Set(songs.map(ts => ts.song.type));
    const styles = new Set(songs.map(ts => ts.song.style));
    const years = songs.map(ts => ts.song.recording_year).filter(Boolean);
    
    return {
      songCount: songs.length,
      orchestras: Array.from(orchestras),
      types: Array.from(types),
      styles: Array.from(styles),
      yearRange: years.length ? `${Math.min(...years)}-${Math.max(...years)}` : 'N/A'
    };
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tandas?.map((tanda) => {
              const metadata = getTandaMetadata(tanda);
              const { data: { user } } = await supabase.auth.getUser();
              const isOwner = user?.id === tanda.user_id;

              return (
                <Sheet key={tanda.id}>
                  <SheetTrigger asChild>
                    <div className="bg-tango-gray rounded-lg p-4 cursor-pointer hover:bg-tango-gray/90 relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-tango-light">{tanda.title}</h3>
                        <div className="flex items-center space-x-2">
                          {tanda.visibility === 'public' && <Globe className="h-4 w-4 text-tango-light" />}
                          {tanda.visibility === 'shared' && <Users className="h-4 w-4 text-tango-light" />}
                          {isOwner && <User className="h-4 w-4 text-tango-light" />}
                        </div>
                      </div>
                      <div className="text-sm text-tango-light/80 space-y-1">
                        <p>{metadata.songCount} songs</p>
                        <p>Orchestras: {metadata.orchestras.join(', ')}</p>
                        <p>Types: {metadata.types.join(', ')}</p>
                        <p>Styles: {metadata.styles.join(', ')}</p>
                        <p>Years: {metadata.yearRange}</p>
                      </div>
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTanda(tanda.id);
                          }}
                          className="absolute top-2 right-2 text-tango-red hover:text-tango-red/80"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[400px] sm:w-[540px] bg-tango-darkGray border-tango-gray">
                    <SheetHeader>
                      <SheetTitle className="text-tango-light">{tanda.title}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4 text-tango-light">
                      <p className="text-sm text-tango-light/80">{tanda.comments}</p>
                      <div className="space-y-4">
                        {tanda.tanda_song?.map((ts, index) => (
                          <div key={ts.song.id} className="bg-tango-gray p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{ts.song.title}</p>
                                <p className="text-sm text-tango-light/80">
                                  {ts.song.orchestra.name} ({ts.song.recording_year})
                                </p>
                                <p className="text-sm text-tango-light/80">
                                  {ts.song.type} - {ts.song.style}
                                </p>
                              </div>
                              <span className="text-sm text-tango-light/60">#{index + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </main>
  );
};

export default Tandas;
