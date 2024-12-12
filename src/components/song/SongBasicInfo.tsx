import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SongBasicInfoProps {
  title: string;
  type: string;
  style: string;
  recordingYear: string;
  onTitleChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStyleChange: (value: string) => void;
  onRecordingYearChange: (value: string) => void;
}

const SongBasicInfo = ({
  title,
  type,
  style,
  recordingYear,
  onTitleChange,
  onTypeChange,
  onStyleChange,
  onRecordingYearChange,
}: SongBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Type *</Label>
        <select
          id="type"
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
          required
        >
          <option value="tango">Tango</option>
          <option value="milonga">Milonga</option>
          <option value="vals">Vals</option>
        </select>
      </div>

      <div>
        <Label htmlFor="style">Style *</Label>
        <select
          id="style"
          value={style}
          onChange={(e) => onStyleChange(e.target.value)}
          className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
          required
        >
          <option value="rhythmic">Rhythmic</option>
          <option value="melodic">Melodic</option>
          <option value="dramatic">Dramatic</option>
        </select>
      </div>

      <div>
        <Label htmlFor="recording_year">Recording Year</Label>
        <Input
          id="recording_year"
          type="number"
          value={recordingYear}
          onChange={(e) => onRecordingYearChange(e.target.value)}
          className="bg-tango-darkGray text-tango-light"
        />
      </div>
    </div>
  );
};

export default SongBasicInfo;