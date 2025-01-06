import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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
          <Command className="rounded-lg border border-tango-border shadow-lg bg-tango-menuBg">
            <CommandInput 
              placeholder={`Search ${label.toLowerCase()}...`}
              value={inputValue}
              onValueChange={(value) => {
                setInputValue(value);
                onChange(value);
              }}
              className="border-b border-tango-border"
              disabled={disabled}
            />
            <CommandList className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-tango-border scrollbar-track-transparent">
              <CommandEmpty className="py-2 px-4 text-sm text-tango-light/70">
                No results found.
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.name}
                    value={option.name}
                    onSelect={(value) => {
                      onChange(value);
                      setInputValue(value);
                      setOpen(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-tango-light hover:bg-tango-menuHover transition-colors"
                  >
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  );
};

export default AutocompleteInput;