import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface AutocompleteListProps {
  inputValue: string;
  options: { name: string }[];
  onSelect: (value: string) => void;
  onInputChange: (value: string) => void;
  label: string;
  disabled?: boolean;
}

const AutocompleteList = ({
  inputValue,
  options,
  onSelect,
  onInputChange,
  label,
  disabled,
}: AutocompleteListProps) => {
  return (
    <Command className="rounded-lg border border-tango-border shadow-lg bg-tango-menuBg">
      <CommandInput 
        placeholder={`Search ${label.toLowerCase()}...`}
        value={inputValue}
        onValueChange={onInputChange}
        className="border-b border-tango-border"
        disabled={disabled}
      />
      <CommandList className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-tango-border scrollbar-track-transparent">
        <CommandEmpty className="py-2 px-4 text-sm text-tango-light/70">
          No results found.
        </CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.name}
              value={option.name}
              onSelect={onSelect}
              className="cursor-pointer px-4 py-2 text-tango-light hover:bg-tango-menuHover transition-colors"
            >
              {option.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AutocompleteList;