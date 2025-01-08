import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2 } from "lucide-react";

interface Orchestra {
  id: number;
  name: string;
  is_modern: boolean;
}

interface OrchestraTableProps {
  orchestras: Orchestra[];
  onEdit: (orchestra: Orchestra) => void;
  onDelete: (id: number) => void;
}

const OrchestraTable = ({ orchestras, onEdit, onDelete }: OrchestraTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModern, setFilterModern] = useState<boolean | null>(null);

  const filteredOrchestras = orchestras.filter(orchestra => {
    const matchesSearch = orchestra.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterModern === null || orchestra.is_modern === filterModern;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search orchestras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-tango-darkGray text-tango-light"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-tango-light">Filter Modern:</span>
          <Switch
            checked={filterModern === true}
            onCheckedChange={(checked) => setFilterModern(checked ? true : false)}
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setFilterModern(null)}
            className="text-tango-light hover:text-tango-light/80"
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-tango-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-tango-light">Name</TableHead>
              <TableHead className="text-tango-light">Type</TableHead>
              <TableHead className="text-tango-light w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrchestras.map((orchestra) => (
              <TableRow key={orchestra.id}>
                <TableCell className="text-tango-light">{orchestra.name}</TableCell>
                <TableCell className="text-tango-light">
                  {orchestra.is_modern ? "Modern" : "Traditional"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(orchestra)}
                      className="text-tango-light hover:text-tango-light/80"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(orchestra.id)}
                      className="text-tango-light hover:text-tango-red"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrchestraTable;