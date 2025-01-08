import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import OrchestraTable from "@/components/orchestra/OrchestraTable";
import OrchestraDialog from "@/components/orchestra/OrchestraDialog";

interface Orchestra {
  id: number;
  name: string;
  is_modern: boolean;
}

const Orchestras = () => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrchestra, setSelectedOrchestra] = useState<Orchestra | undefined>();

  const { data: orchestras, isLoading, refetch } = useQuery({
    queryKey: ["orchestras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orchestra")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching orchestras:", error);
        throw error;
      }
      return data;
    },
  });

  const handleSave = async (orchestra: Orchestra) => {
    try {
      if (orchestra.id) {
        const { error } = await supabase
          .from("orchestra")
          .update({
            name: orchestra.name,
            is_modern: orchestra.is_modern,
          })
          .eq("id", orchestra.id);

        if (error) throw error;
        toast({ description: "Orchestra updated successfully" });
      } else {
        const { error } = await supabase
          .from("orchestra")
          .insert([
            {
              name: orchestra.name,
              is_modern: orchestra.is_modern,
            },
          ]);

        if (error) throw error;
        toast({ description: "Orchestra added successfully" });
      }

      setDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving orchestra:", error);
      toast({
        variant: "destructive",
        description: "Failed to save orchestra. Please try again.",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("orchestra")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ description: "Orchestra deleted successfully" });
      refetch();
    } catch (error) {
      console.error("Error deleting orchestra:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete orchestra. Please try again.",
      });
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tango-light">Orchestras</h1>
        <Button
          onClick={() => {
            setSelectedOrchestra(undefined);
            setDialogOpen(true);
          }}
          className="bg-tango-red hover:bg-tango-red/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Orchestra
        </Button>
      </div>

      <div className="bg-tango-gray rounded-lg p-6">
        <OrchestraTable
          orchestras={orchestras || []}
          onEdit={(orchestra) => {
            setSelectedOrchestra(orchestra);
            setDialogOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <OrchestraDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedOrchestra(undefined);
        }}
        onSave={handleSave}
        orchestra={selectedOrchestra}
      />
    </main>
  );
};

export default Orchestras;