import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";

type IssueStatus = Database["public"]["Enums"]["issue_status"];
type SortField = 'type' | 'user_id' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface Issue {
  id: number;
  description: string;
  status: IssueStatus;
  created_at: string;
  user_id: string;
  issue_type: {
    name: string;
  };
}

interface IssueTableProps {
  issues: Issue[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onStatusChange: (issueId: number, newStatus: IssueStatus) => void;
}

const IssueTable = ({
  issues,
  sortField,
  sortDirection,
  onSort,
  onStatusChange,
}: IssueTableProps) => {
  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'resolved':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUpDown className="ml-2 h-4 w-4 text-tango-red" /> : 
      <ArrowUpDown className="ml-2 h-4 w-4 text-tango-red rotate-180" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead 
            className="text-tango-light cursor-pointer"
            onClick={() => onSort('type')}
          >
            Type {getSortIcon('type')}
          </TableHead>
          <TableHead className="text-tango-light">Description</TableHead>
          <TableHead 
            className="text-tango-light cursor-pointer"
            onClick={() => onSort('user_id')}
          >
            User ID {getSortIcon('user_id')}
          </TableHead>
          <TableHead 
            className="text-tango-light cursor-pointer"
            onClick={() => onSort('created_at')}
          >
            Date {getSortIcon('created_at')}
          </TableHead>
          <TableHead className="text-tango-light">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues?.map((issue) => (
          <TableRow key={issue.id} className="hover:bg-tango-gray/50">
            <TableCell className="text-tango-light">
              {issue.issue_type.name}
            </TableCell>
            <TableCell className="text-tango-light">
              {issue.description}
            </TableCell>
            <TableCell className="text-tango-light">
              {issue.user_id}
            </TableCell>
            <TableCell className="text-tango-light">
              {format(new Date(issue.created_at), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <Select
                defaultValue={issue.status}
                onValueChange={(value) => onStatusChange(issue.id, value as IssueStatus)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue>
                    <Badge className={getStatusColor(issue.status)} variant="outline">
                      {issue.status}
                    </Badge>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-tango-darkGray border-tango-gray">
                  <SelectItem value="pending" className="text-yellow-500">Pending</SelectItem>
                  <SelectItem value="resolved" className="text-green-500">Resolved</SelectItem>
                  <SelectItem value="rejected" className="text-red-500">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IssueTable;