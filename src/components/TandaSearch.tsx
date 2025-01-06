import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AutocompleteInput from "./AutocompleteInput";
import TandaVisibilityFilters from "./tanda/TandaVisibilityFilters";
import TandaYearRange from "./tanda/TandaYearRange";
import { SearchParams } from "@/types/tanda";

const TandaSearch = ({ onSearch }: { onSearch: (params: SearchParams) => void }) => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    includeMine: true,
    includeShared: false,
    includePublic: false,
    includeLiked: false,
  });

  const { data: orchestras, isLoading: orchestrasLoading } = useQuery({
    queryKey: ["orchestras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orchestra")
        .select("name")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: singers, isLoading: singersLoading } = useQuery({
    queryKey: ["singers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("singer")
        .select("name")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const handleSearch = () => {
    const cleanedParams: SearchParams = {};
    
    if (searchParams.orchestra) cleanedParams.orchestra = searchParams.orchestra;
    if (searchParams.singer && !searchParams.isInstrumental) cleanedParams.singer = searchParams.singer;
    if (searchParams.yearFrom) cleanedParams.yearFrom = Number(searchParams.yearFrom);
    if (searchParams.yearTo) cleanedParams.yearTo = Number(searchParams.yearTo);
    if (searchParams.isInstrumental !== undefined) cleanedParams.isInstrumental = searchParams.isInstrumental;
    if (searchParams.type) cleanedParams.type = searchParams.type;
    if (searchParams.style && searchParams.type === 'tango') cleanedParams.style = searchParams.style;
    cleanedParams.includeMine = searchParams.includeMine;
    cleanedParams.includeShared = searchParams.includeShared;
    cleanedParams.includePublic = searchParams.includePublic;

    onSearch(cleanedParams);
  };

  if (orchestrasLoading || singersLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-tango-gray rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AutocompleteInput
          label="Orchestra"
          value={searchParams.orchestra || ""}
          onChange={(value) => setSearchParams(prev => ({ ...prev, orchestra: value }))}
          options={orchestras || []}
          placeholder="Search orchestra..."
        />

        <AutocompleteInput
          label="Singer"
          value={searchParams.singer || ""}
          onChange={(value) => setSearchParams(prev => ({ ...prev, singer: value }))}
          options={singers || []}
          placeholder="Search singer..."
          disabled={searchParams.isInstrumental}
        />

        <TandaYearRange
          yearFrom={searchParams.yearFrom}
          yearTo={searchParams.yearTo}
          onYearChange={(type, value) => {
            setSearchParams(prev => ({
              ...prev,
              [type === 'from' ? 'yearFrom' : 'yearTo']: value,
            }));
          }}
        />

        <div className="space-y-2">
          <Label>Type</Label>
          <select
            value={searchParams.type || ""}
            onChange={(e) => {
              const newType = e.target.value;
              setSearchParams(prev => ({ 
                ...prev, 
                type: newType,
                // Clear style if type is not tango
                style: newType !== 'tango' ? undefined : prev.style
              }));
              if (newType && newType !== 'tango') {
                toast({
                  description: "Style selection is only available for Tango type",
                });
              }
            }}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="tango">Tango</option>
            <option value="milonga">Milonga</option>
            <option value="vals">Vals</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Style</Label>
          <select
            value={searchParams.style || ""}
            onChange={(e) => setSearchParams(prev => ({ ...prev, style: e.target.value }))}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
            disabled={searchParams.type !== 'tango'}
          >
            <option value="">All Styles</option>
            <option value="rhythmic">Rhythmic</option>
            <option value="melodic">Melodic</option>
            <option value="dramatic">Dramatic</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Instrumental</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={searchParams.isInstrumental === true}
              onCheckedChange={(checked) => {
                setSearchParams(prev => ({ 
                  ...prev, 
                  isInstrumental: checked ? true : undefined,
                  // Clear singer when switching to instrumental
                  singer: checked ? undefined : prev.singer 
                }));
              }}
            />
            <span className="text-sm text-tango-light">Show only instrumental tandas</span>
          </div>
        </div>

        <TandaVisibilityFilters
          includeMine={searchParams.includeMine || false}
          includeShared={searchParams.includeShared || false}
          includePublic={searchParams.includePublic || false}
          includeLiked={searchParams.includeLiked || false}
          onVisibilityChange={(type, checked) => {
            setSearchParams(prev => ({
              ...prev,
              [`include${type.charAt(0).toUpperCase() + type.slice(1)}`]: checked,
            }));
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSearch}
          className="bg-tango-red hover:bg-tango-red/90"
        >
          Search Tandas
        </Button>
      </div>
    </div>
  );
};

export default TandaSearch;
