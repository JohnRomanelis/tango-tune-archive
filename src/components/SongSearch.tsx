import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SongFilters from "./song/SongFilters";

interface SearchParams {
  title?: string;
  orchestra?: string;
  singer?: string;
  yearFrom?: number;
  yearTo?: number;
  isInstrumental?: boolean;
  type?: string;
  style?: string;
  likedOnly?: boolean;
}

interface SongSearchProps {
  onSearch: (params: SearchParams) => void;
}

const SongSearch = ({ onSearch }: SongSearchProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({});

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
    
    if (searchParams.title) cleanedParams.title = searchParams.title;
    if (searchParams.orchestra) cleanedParams.orchestra = searchParams.orchestra;
    if (searchParams.singer) cleanedParams.singer = searchParams.singer;
    if (searchParams.yearFrom) cleanedParams.yearFrom = Number(searchParams.yearFrom);
    if (searchParams.yearTo) cleanedParams.yearTo = Number(searchParams.yearTo);
    if (searchParams.isInstrumental !== undefined) cleanedParams.isInstrumental = searchParams.isInstrumental;
    if (searchParams.type) cleanedParams.type = searchParams.type;
    if (searchParams.style) cleanedParams.style = searchParams.style;
    if (searchParams.likedOnly) cleanedParams.likedOnly = searchParams.likedOnly;

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
      <SongFilters
        searchParams={searchParams}
        orchestras={orchestras || []}
        singers={singers || []}
        onParamsChange={setSearchParams}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSearch}
          className="bg-tango-red hover:bg-tango-red/90"
        >
          Search Songs
        </Button>
      </div>
    </div>
  );
};

export default SongSearch;