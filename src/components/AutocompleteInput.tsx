import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { name: string }[];
  placeholder?: string;
}

const AutocompleteInput = ({
  label,
  value,
  onChange,
  options = [], // Provide default empty array
  placeholder,
}: AutocompleteInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];
  
  const filteredOptions = safeOptions.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Only show command when we have filtered options and input
  const showCommands = open && inputValue && filteredOptions.length > 0;

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
          onBlur={() => {
            // Delay closing to allow for item selection
            setTimeout(() => setOpen(false), 200);
          }}
          placeholder={placeholder}
          className="bg-tango-darkGray text-tango-light"
        />
        {showCommands && (
          <div className="absolute z-10 w-full mt-1">
            <Command className="rounded-lg border shadow-md bg-tango-gray">
              <CommandInput 
                placeholder={`Search ${label.toLowerCase()}...`}
                value={inputValue}
                onValueChange={setInputValue}
              />
              <CommandEmpty>No results found.</CommandEmpty>
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