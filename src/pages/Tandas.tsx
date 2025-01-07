import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useToast } from "@/hooks/use-toast";
import TandasHeader from "@/components/tanda/TandasHeader";
import TandasGrid from "@/components/tanda/TandasGrid";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { useTandasQuery } from "@/hooks/useTandasQuery";
import { useLikedTandas } from "@/hooks/useLikedTandas";

const Tandas = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { user, isLoading: authLoading } = useAuthRedirect();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tandas, isLoading: tandasLoading } = useTandasQuery(searchParams, user?.id, searchTrigger);
  const { data: likedTandas } = useLikedTandas(user?.id);

  const likeMutation = useMutation({
    mutationFn: async ({ tandaId, isLiked }: { tandaId: number; isLiked: boolean }) => {
      if (!user?.id) throw new Error("User not authenticated");

      if (isLiked) {
        const { error } = await supabase
          .from('user_tanda_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('tanda_id', tandaId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_tanda_likes')
          .insert({ user_id: user.id, tanda_id: tandaId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likedTandas"] });
      queryClient.invalidateQueries({ queryKey: ["tandas"] });
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update tanda like status",
        variant: "destructive",
      });
    },
  });

  const handleLikeClick = (tandaId: number, isLiked: boolean) => {
    likeMutation.mutate({ tandaId, isLiked });
  };

  const handleSongClick = (spotify_id: string | null) => {
    setSelectedTrackId(spotify_id);
  };

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setSearchTrigger(prev => prev + 1);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-[200px]">
      <TandasHeader onSearch={handleSearch} />
      
      {tandasLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
        </div>
      ) : (
        <TandasGrid
          tandas={tandas || []}
          currentUserId={user?.id}
          onTandaDeleted={() => queryClient.invalidateQueries({ queryKey: ["tandas"] })}
          onSongClick={handleSongClick}
          onLikeClick={handleLikeClick}
          likedTandaIds={likedTandas}
        />
      )}

      {selectedTrackId && (
        <SpotifyPlayer
          trackId={selectedTrackId}
          onClose={() => setSelectedTrackId(null)}
        />
      )}
    </main>
  );
};

export default Tandas;