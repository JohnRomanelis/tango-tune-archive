import { useState } from "react";
import AutocompleteInput from "@/components/AutocompleteInput";
import SingerSelect from "@/components/song/SingerSelect";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SongType, SongStyle } from "@/types/song";

interface SharedSongFieldsProps {
  orchestraId: string;
  selectedSingers: number[];
  isInstrumental: boolean;
  type: SongType;
  style: SongStyle;
  orchestras: any[];
  singers: any[];
  onOrchestraSelect: (orchestraName: string) => void;
  onSingersChange: (singers: number[]) => void;
  onInstrumentalChange: (value: boolean) => void;
  onTypeChange: (value: SongType) => void;
  onStyleChange: (value: SongStyle) => void;
}

const SharedSongFields = ({
  orchestraId,
  selectedSingers,
  isInstrumental,
  type,
  style,
  orchestras,
  singers,
  onOrchestraSelect,
  onSingersChange,
  onInstrumentalChange,
  onTypeChange,
  onStyleChange,
}: SharedSongFieldsProps) => {
  const selectedOrchestra = orchestras?.find(
    o => o.id?.toString() === orchestraId
  );

  return (
    <div className="space-y-4">
      <AutocompleteInput
        label="Orchestra"
        value={selectedOrchestra?.name || ""}
        onChange={onOrchestraSelect}
        options={orchestras || []}
        placeholder="Search orchestras..."
      />

      {singers && (
        <SingerSelect
          singers={singers}
          selectedSingers={selectedSingers}
          onSingerToggle={(singerId) => {
            onSingersChange(
              selectedSingers.includes(singerId)
                ? selectedSingers.filter(id => id !== singerId)
                : [...selectedSingers, singerId]
            );
          }}
        />
      )}

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            value={type}
            onChange={(e) => onTypeChange(e.target.value as SongType)}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
          >
            <option value="tango">Tango</option>
            <option value="milonga">Milonga</option>
            <option value="vals">Vals</option>
          </select>
        </div>

        <div className="flex-1">
          <Label htmlFor="style">Style</Label>
          <select
            id="style"
            value={style}
            onChange={(e) => onStyleChange(e.target.value as SongStyle)}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
          >
            <option value="rhythmic">Rhythmic</option>
            <option value="melodic">Melodic</option>
            <option value="dramatic">Dramatic</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_instrumental"
          checked={isInstrumental}
          onCheckedChange={onInstrumentalChange}
          className="data-[state=checked]:bg-tango-red"
        />
        <Label htmlFor="is_instrumental">Instrumental</Label>
      </div>
    </div>
  );
};

export default SharedSongFields;