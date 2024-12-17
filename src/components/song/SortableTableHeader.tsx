import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SortField, SortDirection } from "@/types/song";

interface SortableTableHeaderProps {
  field: SortField;
  label: string;
  currentSort: {
    field: SortField;
    direction: SortDirection;
  };
  onSort: (field: SortField) => void;
}

const SortableTableHeader = ({
  field,
  label,
  currentSort,
  onSort,
}: SortableTableHeaderProps) => {
  const isActive = currentSort.field === field;

  return (
    <TableHead
      className="text-tango-light cursor-pointer hover:text-tango-red transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          currentSort.direction === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  );
};

export default SortableTableHeader;