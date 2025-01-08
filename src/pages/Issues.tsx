import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import IssueFilters from "@/components/issue/IssueFilters";
import IssueTable from "@/components/issue/IssueTable";

type IssueStatus = Database["public"]["Enums"]["issue_status"];
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

  useEffect(() => {
    if (userRole && userRole !== 'moderator') {
      navigate('/');
    }
  }, [userRole, navigate]);

  const { data: issues, isLoading: issuesLoading, error } = useQuery({
    queryKey: ["issues", statusFilter, typeFilter, sortField, sortDirection],
    queryFn: async () => {
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

      return data;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-tango-light mb-8">Issue Management</h1>
      
      <IssueFilters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
      />
      
      <div className="bg-tango-darkGray border border-tango-gray rounded-lg p-6">
        <IssueTable
          issues={issues || []}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onStatusChange={updateIssueStatus}
        />
      </div>
    </div>
  );
};

export default Issues;