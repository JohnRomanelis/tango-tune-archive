import { Loader2 } from "lucide-react";
import TandaCard from "./TandaCard";

interface TandasGridProps {
  tandas: any[];
  isLoading: boolean;
  currentUserId?: string | null;
  onDelete?: (id: number) => void;
  onAddClick?: (tanda: any) => void;
  showAddButton?: boolean;
}

const TandasGrid = ({ 
  tandas, 
  isLoading, 
  currentUserId, 
  onDelete,
  onAddClick,
  showAddButton 
}: TandasGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tandas?.map((tanda) => (
        <TandaCard
          key={tanda.id}
          tanda={tanda}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onAdd={showAddButton ? () => onAddClick?.(tanda) : undefined}
        />
      ))}
    </div>
  );
};

export default TandasGrid;