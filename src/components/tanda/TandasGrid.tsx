import { Loader2 } from "lucide-react";
import TandaCard from "./TandaCard";

interface TandasGridProps {
  tandas: any[];
  isLoading: boolean;
  currentUserId?: string;
  onDelete?: (id: number) => void;
  onAddClick?: (tanda: any) => void;
  onTandaClick?: (tanda: any) => void;
  onSongClick?: (spotify_id: string | null) => void;
  showAddButton?: boolean;
}

const TandasGrid = ({
  tandas,
  isLoading,
  currentUserId,
  onDelete,
  onAddClick,
  onTandaClick,
  onSongClick,
  showAddButton = false,
}: TandasGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  if (!tandas.length) {
    return (
      <div className="text-center text-tango-light py-8">
        No tandas found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tandas.map((tanda) => (
        <div key={tanda.id} onClick={() => onTandaClick?.(tanda)}>
          <TandaCard
            tanda={tanda}
            currentUserId={currentUserId}
            onDelete={onDelete ? () => onDelete(tanda.id) : undefined}
            onAddClick={onAddClick ? () => onAddClick(tanda) : undefined}
            onSongClick={onSongClick}
            showAddButton={showAddButton}
          />
        </div>
      ))}
    </div>
  );
};

export default TandasGrid;