import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SingerTable from "@/components/singer/SingerTable";
import SingerDialog from "@/components/singer/SingerDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Singers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSinger, setSelectedSinger] = useState<any>(null);
  const { toast } = useToast();

  const { data: singers, refetch } = useQuery({
    queryKey: ["singers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("singer")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const filteredSingers = singers?.filter(singer =>
    singer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (singer: any) => {
    setSelectedSinger(singer);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedSinger(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("singer")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete singer",
      });
    } else {
      toast({
        title: "Success",
        description: "Singer deleted successfully",
      });
      refetch();
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-tango-light">Singers</h1>
        <Button onClick={handleAdd} className="bg-tango-red hover:bg-tango-red/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Singer
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tango-light/50" />
        <Input
          placeholder="Search singers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-tango-darkGray text-tango-light border-tango-gray"
        />
      </div>

      <SingerTable
        singers={filteredSingers || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SingerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        singer={selectedSinger}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </main>
  );
};

export default Singers;