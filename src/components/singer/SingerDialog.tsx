import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Singer {
  id: number;
  name: string;
  sex: 'male' | 'female';
}

interface SingerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  singer?: Singer | null;
  onSuccess: () => void;
}

const SingerDialog = ({ open, onOpenChange, singer, onSuccess }: SingerDialogProps) => {
  const [name, setName] = useState("");
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (singer) {
      setName(singer.name);
      setSex(singer.sex);
    } else {
      setName("");
      setSex('male');
    }
  }, [singer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (singer) {
        const { error } = await supabase
          .from("singer")
          .update({ name, sex })
          .eq("id", singer.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Singer updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("singer")
          .insert([{ name, sex }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Singer created successfully",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save singer",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-tango-darkGray border-tango-gray">
        <DialogHeader>
          <DialogTitle className="text-tango-light">
            {singer ? "Edit Singer" : "Add Singer"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-tango-light">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-tango-gray text-tango-light border-tango-gray"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-tango-light">Gender</Label>
            <Select value={sex} onValueChange={(value: 'male' | 'female') => setSex(value)}>
              <SelectTrigger className="bg-tango-gray text-tango-light border-tango-gray">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-tango-darkGray border-tango-gray">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-tango-gray text-tango-light hover:bg-tango-gray/90"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-tango-red hover:bg-tango-red/90"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SingerDialog;