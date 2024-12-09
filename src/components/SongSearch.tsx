import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AutocompleteInput from "./AutocompleteInput";

interface SongSearchProps {
  onSearch: (params: any) => void;
}

const SongSearch = ({ onSearch }: SongSearchProps) => {
  const [title, setTitle] = useState("");
  const [orchestra, setOrchestra] = useState("");
  const [singer, setSinger] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [isInstrumental, setIsInstrumental] = useState<boolean | undefined>(undefined);
  const [type, setType] = useState<string>("");
  const [style, setStyle] = useState<string>("");

  const { data: orchestras } = useQuery({
    queryKey: ["orchestras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orchestra")
        .select("name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: singers } = useQuery({
    queryKey: ["singers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("singer")
        .select("name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const searchParams = {
      title: title || undefined,
      orchestra: orchestra || undefined,
      singer: singer || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
      isInstrumental,
      type: type || undefined,
      style: style || undefined,
    };
    onSearch(searchParams);
  }, [title, orchestra, singer, yearFrom, yearTo, isInstrumental, type, style, onSearch]);

  return (
    <div className="bg-tango-gray rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Search by title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-tango-darkGray text-tango-light"
          />
        </div>

        <AutocompleteInput
          label="Orchestra"
          value={orchestra}
          onChange={setOrchestra}
          options={orchestras || []}
          placeholder="Search orchestra..."
        />

        <AutocompleteInput
          label="Singer"
          value={singer}
          onChange={setSinger}
          options={singers || []}
          placeholder="Search singer..."
        />

        <div className="space-y-2">
          <Label>Year Range</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="From..."
              type="number"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              className="bg-tango-darkGray text-tango-light"
            />
            <Input
              placeholder="To..."
              type="number"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              className="bg-tango-darkGray text-tango-light"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
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
              checked={isInstrumental === true}
              onCheckedChange={(checked) => {
                setIsInstrumental(checked ? true : undefined);
              }}
            />
            <span className="text-sm text-tango-light">Show only instrumental</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongSearch;