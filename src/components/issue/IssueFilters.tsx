import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type IssueStatus = Database["public"]["Enums"]["issue_status"];

interface IssueFiltersProps {
  statusFilter: IssueStatus | 'all';
  typeFilter: string;
  onStatusChange: (value: IssueStatus | 'all') => void;
  onTypeChange: (value: string) => void;
}

const IssueFilters = ({ 
  statusFilter, 
  typeFilter, 
  onStatusChange, 
  onTypeChange 
}: IssueFiltersProps) => {
  const { data: issueTypes } = useQuery({
    queryKey: ["issue-types"],
    queryFn: async () => {
      const { data } = await supabase
        .from("issue_type")
        .select("*");
      return data;
    },
  });

  return (
    <div className="flex gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-tango-light mb-2">
          Filter by Status
        </label>
        <Select
          value={statusFilter}
          onValueChange={(value: IssueStatus | 'all') => onStatusChange(value)}
        >
          <SelectTrigger className="w-[180px] bg-tango-darkGray text-tango-light">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-tango-darkGray border-tango-gray">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-tango-light mb-2">
          Filter by Type
        </label>
        <Select
          value={typeFilter}
          onValueChange={onTypeChange}
        >
          <SelectTrigger className="w-[180px] bg-tango-darkGray text-tango-light">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-tango-darkGray border-tango-gray">
            <SelectItem value="all">All Types</SelectItem>
            {issueTypes?.map(type => (
              <SelectItem key={type.id} value={type.id.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IssueFilters;