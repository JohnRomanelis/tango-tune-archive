import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TandaSearch from "@/components/TandaSearch";

interface TandasHeaderProps {
  onSearch: (params: any) => void;
}

const TandasHeader = ({ onSearch }: TandasHeaderProps) => {
  const navigate = useNavigate();

  return (
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
      <TandaSearch onSearch={onSearch} />
    </div>
  );
};

export default TandasHeader;