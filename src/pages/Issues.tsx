import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseId } from "@/utils/idConversion";

const Issues = () => {
  const { toast } = useToast();

  const { data: issues, refetch } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issue')
        .select('*');

      if (error) {
        console.error('Error fetching issues:', error);
        throw error;
      }

      return data;
    },
  });

  const handleUpdateIssue = async (issueId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('issue')
        .update({ status: newStatus })
        .eq('id', parseId(issueId));

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

  useEffect(() => {
    // Fetch issues on mount
    refetch();
  }, [refetch]);

  return (
    <div>
      <h1>Issues</h1>
      <ul>
        {issues?.map(issue => (
          <li key={issue.id}>
            {issue.description} - {issue.status}
            <button onClick={() => handleUpdateIssue(issue.id.toString(), 'resolved')}>Resolve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Issues;
