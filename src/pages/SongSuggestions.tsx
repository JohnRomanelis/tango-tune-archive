import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface SongSuggestion {
  id: number;
  title: string;
  type: "tango" | "milonga" | "vals";
  style: "rhythmic" | "melodic" | "dramatic";
  recording_year: number | null;
  is_instrumental: boolean;
  orchestra: { name: string } | null;
  spotify_id: string | null;
  status: string;
  created_at: string;
  user_id: string;
  suggested_song_singer: Array<{ singer: { name: string } }>;
}

const SongSuggestions = () => {
  const navigate = useNavigate();
  const { data: userRole } = useUserRole();

  useEffect(() => {
    if (userRole && userRole !== "moderator") {
      navigate("/");
    }
  }, [userRole, navigate]);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["song-suggestions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suggested_song")
        .select(`
          *,
          orchestra:orchestra_id(name),
          suggested_song_singer(singer:singer_id(name))
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SongSuggestion[];
    },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Song Suggestions</h1>
      
      <ScrollArea className="h-[calc(100vh-200px)]">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions?.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-tango-gray p-4 rounded-lg space-y-2"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-tango-light">
                    {suggestion.title}
                  </h3>
                  <span className={`px-2 py-1 rounded text-sm capitalize ${
                    suggestion.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                    suggestion.status === "approved" ? "bg-green-500/20 text-green-500" :
                    "bg-red-500/20 text-red-500"
                  }`}>
                    {suggestion.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-tango-light/70">
                  <div>
                    <p><span className="font-medium">Type:</span> {suggestion.type}</p>
                    <p><span className="font-medium">Style:</span> {suggestion.style}</p>
                    <p><span className="font-medium">Orchestra:</span> {suggestion.orchestra?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Year:</span> {suggestion.recording_year || "N/A"}</p>
                    <p><span className="font-medium">Instrumental:</span> {suggestion.is_instrumental ? "Yes" : "No"}</p>
                    <p>
                      <span className="font-medium">Singers:</span>{" "}
                      {suggestion.suggested_song_singer.map(s => s.singer.name).join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </main>
  );
};

export default SongSuggestions;