import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AutocompleteList from "./autocomplete/AutocompleteList";

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { name: string }[];
  placeholder?: string;
  disabled?: boolean;
}

const AutocompleteInput = ({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
}: AutocompleteInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<{ name: string }[]>(options);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const safeOptions = Array.isArray(options) ? options : [];
    const filtered = safeOptions.filter((option) =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setInputValue(newValue);
            onChange(newValue);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onBlur={() => {
            setTimeout(() => setOpen(false), 200);
          }}
          placeholder={placeholder}
          className="bg-tango-darkGray text-tango-light border-tango-border focus:border-tango-red transition-colors"
          disabled={disabled}
        />
        <div className={`absolute z-50 w-full mt-1 ${!open && 'hidden'}`}>
          <AutocompleteList
            inputValue={inputValue}
            options={filteredOptions}
            onSelect={(value) => {
              onChange(value);
              setInputValue(value);
              setOpen(false);
            }}
            onInputChange={(value) => {
              setInputValue(value);
              onChange(value);
            }}
            label={label}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default AutocompleteInput;