import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import IssueTable from "@/components/issue/IssueTable";
import IssueFilters from "@/components/issue/IssueFilters";
import { Loader2 } from "lucide-react";

type IssueStatus = Database["public"]["Enums"]["issue_status"];
type SortField = 'type' | 'user_id' | 'created_at';
type SortDirection = 'asc' | 'desc';

const Issues = () => {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const { data: issues, isLoading, refetch } = useQuery({
    queryKey: ['issues', statusFilter, typeFilter, sortField, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from('issue')
        .select(`
          *,
          issue_type (
            name
          )
        `);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('type_id', parseInt(typeFilter));
      }

      query = query.order(sortField, { ascending: sortDirection === 'asc' });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching issues:', error);
        throw error;
      }

      return data;
    },
  });

  const handleUpdateIssue = async (issueId: number, newStatus: IssueStatus) => {
    try {
      const { error } = await supabase
        .from('issue')
        .update({ status: newStatus })
        .eq('id', issueId);

      if (error) throw error;

      refetch();
      toast({
        title: "Success",
        description: "Issue status updated successfully",
      });
    } catch (error) {
      console.error('Error updating issue:', error);
      toast({
        title: "Error",
        description: "Failed to update issue status",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-8">General Issues</h1>
      
      <div className="bg-tango-gray rounded-lg p-6">
        <IssueFilters
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onStatusChange={setStatusFilter}
          onTypeChange={setTypeFilter}
        />

        <IssueTable
          issues={issues || []}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onStatusChange={handleUpdateIssue}
        />
      </div>
    </main>
  );
};

export default Issues;