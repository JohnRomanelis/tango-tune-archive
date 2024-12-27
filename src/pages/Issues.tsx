import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type IssueStatus = Database["public"]["Enums"]["issue_status"];

type Issue = {
  id: number;
  description: string;
  status: IssueStatus;
  created_at: string;
  issue_type: {
    name: string;
  };
  profiles: {
    email: string;
  } | null;
};

const Issues = () => {
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (userRole && userRole !== 'moderator') {
      navigate('/');
    }
  }, [userRole, navigate]);

  const { data: issues, isLoading: issuesLoading, error } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      console.log("Fetching issues, user role:", userRole); // Debug log

      const { data, error } = await supabase
        .from("issue")
        .select(`
          *,
          issue_type (
            name
          ),
          profiles:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching issues:", error); // Debug log
        throw error;
      }

      console.log("Fetched issues:", data); // Debug log
      return data as Issue[];
    },
    enabled: userRole === 'moderator',
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-tango-light mb-8">Issue Management</h1>
      
      <div className="bg-tango-darkGray border border-tango-gray rounded-lg p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-tango-light">Type</TableHead>
              <TableHead className="text-tango-light">Description</TableHead>
              <TableHead className="text-tango-light">Submitted By</TableHead>
              <TableHead className="text-tango-light">Date</TableHead>
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
                  {issue.profiles?.email || 'Unknown'}
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