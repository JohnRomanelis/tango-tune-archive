import { ScrollArea } from "@/components/ui/scroll-area";
import TandaCard from "./TandaCard";
import TandaDetailsDialog from "./TandaDetailsDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TandasGridProps {
  tandas: any[];
  currentUserId: string | null;
  onTandaDeleted: () => void;
}

const TandasGrid = ({ tandas, currentUserId, onTandaDeleted }: TandasGridProps) => {
  const [selectedTanda, setSelectedTanda] = useState<any>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteTanda = async (tandaId: number) => {
    try {
      const { error } = await supabase
        .from("tanda")
        .delete()
        .eq("id", tandaId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tanda deleted successfully",
      });
      
      onTandaDeleted();
    } catch (error) {
      console.error('Error deleting tanda:', error);
      toast({
        title: "Error",
        description: "Failed to delete tanda",
        variant: "destructive",
      });
    }
  };

  const handleSongClick = (spotify_id: string | null) => {
    if (!spotify_id) return;
    setSelectedTrackId(spotify_id);
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tandas.map((tanda) => (
            <div
              key={tanda.id}
              onClick={() => setSelectedTanda(tanda)}
              className="cursor-pointer"
            >
              <TandaCard
                tanda={tanda}
                currentUserId={currentUserId}
                onDelete={() => handleDeleteTanda(tanda.id)}
                onSongClick={handleSongClick}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      <TandaDetailsDialog
        tanda={selectedTanda}
        isOpen={!!selectedTanda}
        onClose={() => setSelectedTanda(null)}
      />
    </>
  );
};

export default TandasGrid;