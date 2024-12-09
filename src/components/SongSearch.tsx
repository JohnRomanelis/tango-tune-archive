import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface SongSearchProps {
  onSearch: (params: any) => void;
}

const SongSearch = ({ onSearch }: SongSearchProps) => {
  const [open, setOpen] = useState(false);
  const [orchestraValue, setOrchestraValue] = useState("");
  const [title, setTitle] = useState("");
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
      orchestra: orchestraValue || undefined,
      singer: singer || undefined,
      yearFrom: yearFrom ? parseInt(yearFrom) : undefined,
      yearTo: yearTo ? parseInt(yearTo) : undefined,
      isInstrumental,
      type: type || undefined,
      style: style || undefined,
    };
    onSearch(searchParams);
  }, [title, orchestraValue, singer, yearFrom, yearTo, isInstrumental, type, style, onSearch]);

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

        <div className="space-y-2">
          <Label>Orchestra</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-tango-darkGray text-tango-light"
              >
                {orchestraValue
                  ? orchestras?.find((orchestra) => orchestra.name === orchestraValue)?.name
                  : "Select orchestra..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search orchestra..." />
                <CommandEmpty>No orchestra found.</CommandEmpty>
                <CommandGroup>
                  {orchestras?.map((orchestra) => (
                    <CommandItem
                      key={orchestra.name}
                      onSelect={() => {
                        setOrchestraValue(orchestra.name === orchestraValue ? "" : orchestra.name);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          orchestraValue === orchestra.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {orchestra.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Singer</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between bg-tango-darkGray text-tango-light"
              >
                {singer || "Select singer..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search singer..." />
                <CommandEmpty>No singer found.</CommandEmpty>
                <CommandGroup>
                  {singers?.map((s) => (
                    <CommandItem
                      key={s.name}
                      onSelect={() => setSinger(s.name === singer ? "" : s.name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          singer === s.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {s.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

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