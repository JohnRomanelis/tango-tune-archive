import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Singer {
  id: number;
  name: string;
}

interface SingerSelectProps {
  singers: Singer[];
  selectedSingers: number[];
  onSingerToggle: (singerId: number) => void;
}

const SingerSelect = ({ singers, selectedSingers, onSingerToggle }: SingerSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSingers, setFilteredSingers] = useState(singers);

  useEffect(() => {
    const filtered = singers.filter((singer) =>
      singer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSingers(filtered);
  }, [searchTerm, singers]);

  return (
    <div className="space-y-2">
      <Label>Singers</Label>
      <Input
        type="text"
        placeholder="Search singers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-tango-darkGray text-tango-light mb-2"
      />
      <ScrollArea className="h-48">
        <div className="grid grid-cols-2 gap-2">
          {filteredSingers.map((singer) => (
            <div
              key={singer.id}
              className={`p-2 rounded-md cursor-pointer border ${
                selectedSingers.includes(singer.id)
                  ? "border-tango-red bg-tango-red/10"
                  : "border-tango-gray"
              }`}
              onClick={() => onSingerToggle(singer.id)}
            >
              {singer.name}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SingerSelect;