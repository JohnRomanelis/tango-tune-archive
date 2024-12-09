import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { name: string }[];
  placeholder: string;
}

const AutocompleteInput = ({ label, value, onChange, options = [], placeholder }: AutocompleteInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Ensure options is always an array
  const safeOptions = options || [];
  
  const filteredOptions = safeOptions.filter(option =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="bg-tango-darkGray text-tango-light"
        />
        {open && inputValue && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1">
            <Command className="rounded-lg border shadow-md bg-tango-gray">
              <CommandInput placeholder={`Search ${label.toLowerCase()}...`} value={inputValue} />
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="max-h-48 overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.name}
                    onSelect={() => {
                      onChange(option.name);
                      setInputValue(option.name);
                      setOpen(false);
                    }}
                    className="cursor-pointer hover:bg-tango-darkGray"
                  >
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutocompleteInput;