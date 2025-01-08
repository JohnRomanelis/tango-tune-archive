import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Orchestra {
  id?: number;
  name: string;
  is_modern: boolean;
}

interface OrchestraDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (orchestra: Orchestra) => void;
  orchestra?: Orchestra;
}

const OrchestraDialog = ({ open, onClose, onSave, orchestra }: OrchestraDialogProps) => {
  const [formData, setFormData] = useState<Orchestra>({
    name: "",
    is_modern: false,
  });

  useEffect(() => {
    if (orchestra) {
      setFormData(orchestra);
    } else {
      setFormData({ name: "", is_modern: false });
    }
  }, [orchestra]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-tango-gray border-tango-border">
        <DialogHeader>
          <DialogTitle className="text-tango-light">
            {orchestra ? "Edit Orchestra" : "Add New Orchestra"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-tango-light">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-tango-darkGray text-tango-light"
              placeholder="Enter orchestra name..."
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_modern"
              checked={formData.is_modern}
              onCheckedChange={(checked) => setFormData({ ...formData, is_modern: checked })}
            />
            <Label htmlFor="is_modern" className="text-tango-light">Modern Orchestra</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-tango-light border-tango-border hover:bg-tango-darkGray"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-tango-red hover:bg-tango-red/90 text-white"
            >
              {orchestra ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrchestraDialog;