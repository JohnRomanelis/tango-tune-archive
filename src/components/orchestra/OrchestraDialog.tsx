import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Orchestra {
  id: number;
  name: string;
  is_modern: boolean;
}

interface OrchestraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orchestra?: Orchestra | null;
  onSuccess: () => void;
}

const OrchestraDialog = ({ open, onOpenChange, orchestra, onSuccess }: OrchestraDialogProps) => {
  const [name, setName] = useState("");
  const [isModern, setIsModern] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (orchestra) {
      setName(orchestra.name);
      setIsModern(orchestra.is_modern);
    } else {
      setName("");
      setIsModern(false);
    }
  }, [orchestra]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (orchestra) {
        const { error } = await supabase
          .from("orchestra")
          .update({ name, is_modern: isModern })
          .eq("id", orchestra.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Orchestra updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("orchestra")
          .insert([{ name, is_modern: isModern }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Orchestra created successfully",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save orchestra",
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
            {orchestra ? "Edit Orchestra" : "Add Orchestra"}
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
          <div className="flex items-center space-x-2">
            <Switch
              id="is-modern"
              checked={isModern}
              onCheckedChange={setIsModern}
            />
            <Label htmlFor="is-modern" className="text-tango-light">Modern Orchestra</Label>
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

export default OrchestraDialog;