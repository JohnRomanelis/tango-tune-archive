import { ScrollArea } from "@/components/ui/scroll-area";
import TandaCard from "./TandaCard";
import TandaDetailsDialog from "./TandaDetailsDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TandasGridProps {
  tandas: any[];
  currentUserId?: string | null;
  onTandaDeleted?: () => void;
  onAddClick?: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
  onSongClick?: (spotify_id: string | null) => void;
  onLikeClick?: (tandaId: number, isLiked: boolean) => void;
  likedTandaIds?: number[];
  showAddButton?: boolean;
}

const TandasGrid = ({ 
  tandas, 
  currentUserId, 
  onTandaDeleted,
  onAddClick,
  onTandaClick,
  onSongClick,
  onLikeClick,
  likedTandaIds = [],
  showAddButton 
}: TandasGridProps) => {
  const [selectedTanda, setSelectedTanda] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      
      onTandaDeleted?.();
    } catch (error) {
      console.error('Error deleting tanda:', error);
      toast({
        title: "Error",
        description: "Failed to delete tanda",
        variant: "destructive",
      });
    }
  };

  const handleEditTanda = (tanda: any) => {
    navigate(`/tandas/${tanda.id}/edit`);
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tandas.map((tanda) => (
            <div
              key={tanda.id}
              onClick={() => onTandaClick ? onTandaClick(tanda) : setSelectedTanda(tanda)}
              className="cursor-pointer"
            >
              <TandaCard
                tanda={tanda}
                currentUserId={currentUserId}
                onDelete={() => handleDeleteTanda(tanda.id)}
                onAddClick={onAddClick ? () => onAddClick(tanda) : undefined}
                onSongClick={onSongClick}
                onEditClick={() => handleEditTanda(tanda)}
                onLikeClick={onLikeClick ? () => onLikeClick(tanda.id, likedTandaIds.includes(tanda.id)) : undefined}
                isLiked={likedTandaIds.includes(tanda.id)}
                showAddButton={showAddButton}
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