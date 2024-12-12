import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DurationInputProps {
  durationInSeconds: number;
  onChange: (durationInSeconds: number) => void;
}

const DurationInput = ({ durationInSeconds, onChange }: DurationInputProps) => {
  const [minutes, setMinutes] = useState(Math.floor(durationInSeconds / 60).toString());
  const [seconds, setSeconds] = useState((durationInSeconds % 60).toString());

  useEffect(() => {
    const mins = Math.floor(durationInSeconds / 60);
    const secs = durationInSeconds % 60;
    setMinutes(mins.toString());
    setSeconds(secs.toString());
  }, [durationInSeconds]);

  const handleChange = (newMinutes: string, newSeconds: string) => {
    const mins = parseInt(newMinutes) || 0;
    const secs = parseInt(newSeconds) || 0;
    onChange(mins * 60 + secs);
  };

  return (
    <div className="space-y-2">
      <Label>Duration</Label>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          min="0"
          value={minutes}
          onChange={(e) => {
            setMinutes(e.target.value);
            handleChange(e.target.value, seconds);
          }}
          className="bg-tango-darkGray text-tango-light w-20"
          placeholder="Min"
        />
        <span className="text-tango-light">:</span>
        <Input
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={(e) => {
            setSeconds(e.target.value);
            handleChange(minutes, e.target.value);
          }}
          className="bg-tango-darkGray text-tango-light w-20"
          placeholder="Sec"
        />
      </div>
    </div>
  );
};

export default DurationInput;