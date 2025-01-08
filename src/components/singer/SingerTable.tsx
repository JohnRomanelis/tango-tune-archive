import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Singer {
  id: number;
  name: string;
  sex: 'male' | 'female';
}

interface SingerTableProps {
  singers: Singer[];
  onEdit: (singer: Singer) => void;
  onDelete: (id: number) => void;
}

const SingerTable = ({ singers, onEdit, onDelete }: SingerTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-tango-light">Name</TableHead>
          <TableHead className="text-tango-light">Gender</TableHead>
          <TableHead className="text-tango-light text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {singers.map((singer) => (
          <TableRow key={singer.id} className="hover:bg-tango-gray/50">
            <TableCell className="text-tango-light">{singer.name}</TableCell>
            <TableCell className="text-tango-light capitalize">
              {singer.sex}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(singer)}
                className="text-tango-light hover:text-tango-red"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-tango-light hover:text-tango-red"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-tango-darkGray border-tango-gray">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-tango-light">Delete Singer</AlertDialogTitle>
                    <AlertDialogDescription className="text-tango-light/70">
                      Are you sure you want to delete this singer? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-tango-gray text-tango-light hover:bg-tango-gray/90">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(singer.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SingerTable;