import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import AutocompleteInput from "@/components/AutocompleteInput";

interface SongFiltersProps {
  searchParams: any;
  orchestras: { name: string }[];
  singers: { name: string }[];
  onParamsChange: (params: any) => void;
}

const SongFilters = ({ searchParams, orchestras, singers, onParamsChange }: SongFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Search by title..."
          value={searchParams.title || ""}
          onChange={(e) => onParamsChange({ ...searchParams, title: e.target.value })}
          className="bg-tango-darkGray text-tango-light"
        />
      </div>

      <AutocompleteInput
        label="Orchestra"
        value={searchParams.orchestra || ""}
        onChange={(value) => onParamsChange({ ...searchParams, orchestra: value })}
        options={orchestras || []}
        placeholder="Search orchestra..."
      />

      <AutocompleteInput
        label="Singer"
        value={searchParams.singer || ""}
        onChange={(value) => onParamsChange({ ...searchParams, singer: value })}
        options={singers || []}
        placeholder="Search singer..."
      />

      <div className="space-y-2">
        <Label>Year Range</Label>
        <div className="flex space-x-2">
          <Input
            placeholder="From..."
            type="number"
            value={searchParams.yearFrom || ""}
            onChange={(e) => onParamsChange({ 
              ...searchParams, 
              yearFrom: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="bg-tango-darkGray text-tango-light"
          />
          <Input
            placeholder="To..."
            type="number"
            value={searchParams.yearTo || ""}
            onChange={(e) => onParamsChange({ 
              ...searchParams, 
              yearTo: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="bg-tango-darkGray text-tango-light"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <select
          value={searchParams.type || ""}
          onChange={(e) => onParamsChange({ ...searchParams, type: e.target.value })}
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
          onChange={(e) => onParamsChange({ ...searchParams, style: e.target.value })}
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
            checked={searchParams.isInstrumental === true}
            onCheckedChange={(checked) => onParamsChange({ 
              ...searchParams, 
              isInstrumental: checked ? true : undefined 
            })}
            className="data-[state=unchecked]:bg-tango-light data-[state=checked]:bg-tango-red"
          />
          <span className="text-sm text-tango-light">Show only instrumental</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Show Only Liked Songs</Label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={searchParams.likedOnly === true}
            onCheckedChange={(checked) => onParamsChange({ 
              ...searchParams, 
              likedOnly: checked ? true : undefined 
            })}
            className="data-[state=unchecked]:bg-tango-light data-[state=checked]:bg-tango-red"
          />
          <span className="text-sm text-tango-light">Show only songs I like</span>
        </div>
      </div>
    </div>
  );
};

export default SongFilters;