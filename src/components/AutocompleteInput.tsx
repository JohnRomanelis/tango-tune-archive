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
  options,
  placeholder,
}: AutocompleteInputProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Update filtered options when input changes or options change
  useEffect(() => {
    if (options) {
      setFilteredOptions(
        options.filter((option) =>
          option.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }
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
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Delay closing to allow for item selection
            setTimeout(() => setOpen(false), 200);
          }}
          placeholder={placeholder}
          className="bg-tango-darkGray text-tango-light"
        />
        {open && filteredOptions.length > 0 && (
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