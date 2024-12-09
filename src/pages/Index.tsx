import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import FeaturedSection from "@/components/FeaturedSection";

const Index = () => {
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <FeaturedSection tandas={featuredTandas} />
    </main>
  );
};

export default Index;