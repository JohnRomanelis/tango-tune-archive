import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Sidebar from "@/components/Sidebar";
import FeaturedSection from "@/components/FeaturedSection";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Check authentication status
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // Fetch featured tandas
  const { data: featuredTandas, isLoading: tandasLoading } = useQuery({
    queryKey: ["featuredTandas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tanda")
        .select(`
          id,
          title,
          comments,
          created_at,
          tanda_song (
            song (
              title,
              orchestra_id,
              orchestra (name)
            )
          )
        `)
        .eq("visibility", "public")
        .limit(6);

      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/login");
    }
  }, [session, sessionLoading, navigate]);

  if (sessionLoading || tandasLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tango-darkGray">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-tango-darkGray">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-tango-darkGray/90 backdrop-blur-sm z-10 p-6">
          <div className="flex items-center justify-between">
            <input
              type="search"
              placeholder="Search for songs, orchestras, or singers..."
              className="w-full max-w-md px-4 py-2 rounded-full bg-tango-gray text-tango-light border border-tango-gray focus:outline-none focus:border-tango-red"
            />
            {session && (
              <span className="text-tango-light ml-4">
                Welcome, {session.user.email}
              </span>
            )}
          </div>
        </div>
        <FeaturedSection tandas={featuredTandas} />
      </main>
    </div>
  );
};

export default Index;