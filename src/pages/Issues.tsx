import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
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
import { format } from "date-fns";
import { Loader2, ArrowUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type IssueStatus = Database["public"]["Enums"]["issue_status"];

type Issue = {
  id: number;
  description: string;
  status: IssueStatus;
  created_at: string;
  user_id: string;
  issue_type: {
    name: string;
  };
};

type SortField = 'type' | 'user_id' | 'created_at';
type SortDirection = 'asc' | 'desc';

const Issues = () => {
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Filtering state
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Fetch issue types for filter dropdown
  const { data: issueTypes } = useQuery({
    queryKey: ["issue-types"],
    queryFn: async () => {
      const { data } = await supabase
        .from("issue_type")
        .select("*");
      return data;
    },
  });

  useEffect(() => {
    if (userRole && userRole !== 'moderator') {
      navigate('/');
    }
  }, [userRole, navigate]);

  const { data: issues, isLoading: issuesLoading, error } = useQuery({
    queryKey: ["issues", statusFilter, typeFilter, sortField, sortDirection],
    queryFn: async () => {
      console.log("Fetching issues, user role:", userRole);

      let query = supabase
        .from("issue")
        .select(`
          *,
          issue_type (
            name
          )
        `);

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (typeFilter !== 'all') {
        query = query.eq('type_id', typeFilter);
      }

      // Apply sorting
      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching issues:", error);
        throw error;
      }

      console.log("Fetched issues:", data);
      return data as Issue[];
    },
    enabled: userRole === 'moderator',
  });

  const updateIssueStatus = async (issueId: number, newStatus: IssueStatus) => {
    const { error } = await supabase
      .from('issue')
      .update({ status: newStatus })
      .eq('id', issueId);

    if (error) {
      console.error('Error updating issue status:', error);
      toast({
        variant: "destructive",
        title: "Error updating issue status",
        description: "Please try again later",
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching issues",
        description: "Please try again later",
      });
      console.error("Query error:", error);
    }
  }, [error, toast]);

  if (roleLoading || issuesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  if (!userRole) {
    return null;
  }

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-tango-light mb-8">Issue Management</h1>
      
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-tango-light mb-2">
            Filter by Status
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value: IssueStatus | 'all') => setStatusFilter(value)}
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
            onValueChange={setTypeFilter}
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
      
      <div className="bg-tango-darkGray border border-tango-gray rounded-lg p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead 
                className="text-tango-light cursor-pointer"
                onClick={() => handleSort('type')}
              >
                Type {getSortIcon('type')}
              </TableHead>
              <TableHead className="text-tango-light">Description</TableHead>
              <TableHead 
                className="text-tango-light cursor-pointer"
                onClick={() => handleSort('user_id')}
              >
                User ID {getSortIcon('user_id')}
              </TableHead>
              <TableHead 
                className="text-tango-light cursor-pointer"
                onClick={() => handleSort('created_at')}
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
                    onValueChange={(value) => updateIssueStatus(issue.id, value as IssueStatus)}
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
      </div>
    </div>
  );
};

export default Issues;