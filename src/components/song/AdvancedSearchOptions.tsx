import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AutocompleteInput from "@/components/AutocompleteInput";

interface AdvancedSearchOptionsProps {
  orchestras: { name: string }[];
  onAdvancedSearchChange: (params: { alsoPlayedBy?: string }) => void;
}

const AdvancedSearchOptions = ({ 
  orchestras,
  onAdvancedSearchChange 
}: AdvancedSearchOptionsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [alsoPlayedBy, setAlsoPlayedBy] = useState("");

  const handleAlsoPlayedByChange = (value: string) => {
    setAlsoPlayedBy(value);
    onAdvancedSearchChange({ alsoPlayedBy: value });
  };

  return (
    <div className="mt-4">
      <Button
        variant="ghost"
        className="w-full flex justify-between items-center text-tango-light hover:text-tango-light/80"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Advanced Search</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isExpanded && (
        <div className="mt-4 p-4 bg-tango-darkGray/50 rounded-lg">
          <div className="space-y-4">
            <AutocompleteInput
              label="Also Played By Orchestra"
              value={alsoPlayedBy}
              onChange={handleAlsoPlayedByChange}
              options={orchestras}
              placeholder="Search orchestra..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchOptions;