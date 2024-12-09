import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TandaYearRangeProps {
  yearFrom?: number;
  yearTo?: number;
  onYearChange: (type: 'from' | 'to', value: number | undefined) => void;
}

const TandaYearRange = ({ yearFrom, yearTo, onYearChange }: TandaYearRangeProps) => {
  return (
    <div className="space-y-2">
      <Label>Year Range</Label>
      <div className="flex space-x-2">
        <Input
          placeholder="From..."
          type="number"
          value={yearFrom || ""}
          onChange={(e) => onYearChange('from', e.target.value ? Number(e.target.value) : undefined)}
          className="bg-tango-darkGray text-tango-light"
        />
        <Input
          placeholder="To..."
          type="number"
          value={yearTo || ""}
          onChange={(e) => onYearChange('to', e.target.value ? Number(e.target.value) : undefined)}
          className="bg-tango-darkGray text-tango-light"
        />
      </div>
    </div>
  );
};

export default TandaYearRange;