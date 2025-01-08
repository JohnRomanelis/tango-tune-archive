import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OrchestraTable from "@/components/orchestra/OrchestraTable";
import OrchestraDialog from "@/components/orchestra/OrchestraDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Orchestras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrchestra, setSelectedOrchestra] = useState<any>(null);
  const { toast } = useToast();

  const { data: orchestras, refetch } = useQuery({
    queryKey: ["orchestras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orchestra")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const filteredOrchestras = orchestras?.filter(orchestra =>
    orchestra.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (orchestra: any) => {
    setSelectedOrchestra(orchestra);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedOrchestra(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("orchestra")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete orchestra",
      });
    } else {
      toast({
        title: "Success",
        description: "Orchestra deleted successfully",
      });
      refetch();
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-tango-light">Orchestras</h1>
        <Button onClick={handleAdd} className="bg-tango-red hover:bg-tango-red/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Orchestra
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tango-light/50" />
        <Input
          placeholder="Search orchestras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-tango-darkGray text-tango-light border-tango-gray"
        />
      </div>

      <OrchestraTable
        orchestras={filteredOrchestras || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <OrchestraDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        orchestra={selectedOrchestra}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </main>
  );
};

export default Orchestras;