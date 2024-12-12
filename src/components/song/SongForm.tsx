import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { X, Plus } from "lucide-react";

interface Singer {
  id: number;
  name: string;
}

interface Orchestra {
  id: number;
  name: string;
}

interface SongFormProps {
  initialData?: {
    id?: number;
    title: string;
    type: string;
    style: string;
    recording_year?: number;
    is_instrumental: boolean;
    orchestra_id?: number;
    spotify_id?: string;
    singers?: number[];
  };
  onSubmit: (data: any) => Promise<void>;
}

const SongForm = ({ initialData, onSubmit }: SongFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    type: "tango",
    style: "rhythmic",
    recording_year: "",
    is_instrumental: false,
    orchestra_id: "",
    spotify_id: "",
    singers: [] as number[],
    ...initialData,
  });

  const { data: orchestras } = useQuery({
    queryKey: ["orchestras"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orchestra")
        .select("*")
        .order("name");
      return data as Orchestra[];
    },
  });

  const { data: singers } = useQuery({
    queryKey: ["singers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("singer")
        .select("*")
        .order("name");
      return data as Singer[];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      navigate("/songs");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSingerToggle = (singerId: number) => {
    setFormData(prev => ({
      ...prev,
      singers: prev.singers.includes(singerId)
        ? prev.singers.filter(id => id !== singerId)
        : [...prev.singers, singerId],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="bg-tango-darkGray text-tango-light"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type *</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
            required
          >
            <option value="tango">Tango</option>
            <option value="milonga">Milonga</option>
            <option value="vals">Vals</option>
          </select>
        </div>

        <div>
          <Label htmlFor="style">Style *</Label>
          <select
            id="style"
            value={formData.style}
            onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
            required
          >
            <option value="rhythmic">Rhythmic</option>
            <option value="melodic">Melodic</option>
            <option value="dramatic">Dramatic</option>
          </select>
        </div>

        <div>
          <Label htmlFor="recording_year">Recording Year</Label>
          <Input
            id="recording_year"
            type="number"
            value={formData.recording_year}
            onChange={(e) => setFormData(prev => ({ ...prev, recording_year: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="bg-tango-darkGray text-tango-light"
          />
        </div>

        <div>
          <Label htmlFor="orchestra">Orchestra</Label>
          <select
            id="orchestra"
            value={formData.orchestra_id}
            onChange={(e) => setFormData(prev => ({ ...prev, orchestra_id: e.target.value ? parseInt(e.target.value) : undefined }))}
            className="w-full bg-tango-darkGray text-tango-light rounded-md border border-input px-3 py-2"
          >
            <option value="">Select Orchestra</option>
            {orchestras?.map((orchestra) => (
              <option key={orchestra.id} value={orchestra.id}>
                {orchestra.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Singers</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {singers?.map((singer) => (
              <div
                key={singer.id}
                className={`p-2 rounded-md cursor-pointer border ${
                  formData.singers.includes(singer.id)
                    ? "border-tango-red bg-tango-red/10"
                    : "border-tango-gray"
                }`}
                onClick={() => handleSingerToggle(singer.id)}
              >
                {singer.name}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_instrumental"
            checked={formData.is_instrumental}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_instrumental: checked }))}
          />
          <Label htmlFor="is_instrumental">Instrumental</Label>
        </div>

        <div>
          <Label htmlFor="spotify_id">Spotify ID</Label>
          <Input
            id="spotify_id"
            value={formData.spotify_id || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, spotify_id: e.target.value }))}
            className="bg-tango-darkGray text-tango-light"
            placeholder="Spotify track ID"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/songs")}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-tango-red hover:bg-tango-red/90">
          {initialData ? "Update Song" : "Add Song"}
        </Button>
      </div>
    </form>
  );
};

export default SongForm;