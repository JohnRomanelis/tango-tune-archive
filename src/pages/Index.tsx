import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Music, Archive, List } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/login");
    }
  }, [session, sessionLoading, navigate]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-tango-red" />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-tango-light mb-4">Welcome to TandaBase</h1>
        <p className="text-tango-light/80 text-lg max-w-3xl mx-auto">
          Your comprehensive platform for organizing and discovering tango music. 
          Create tandas, manage playlists, and explore a vast collection of tango songs 
          from legendary orchestras.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/songs">
          <Card className="bg-tango-gray border-tango-gray hover:bg-tango-gray/90 transition-colors cursor-pointer h-full">
            <CardHeader className="text-center">
              <Music className="w-12 h-12 text-tango-red mx-auto mb-4" />
              <CardTitle className="text-tango-light">Songs</CardTitle>
              <CardDescription className="text-tango-light/80">
                Explore and search tango songs from various orchestras. 
                Discover classics and hidden gems from the golden age of tango.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/tandas">
          <Card className="bg-tango-gray border-tango-gray hover:bg-tango-gray/90 transition-colors cursor-pointer h-full">
            <CardHeader className="text-center">
              <Archive className="w-12 h-12 text-tango-red mx-auto mb-4" />
              <CardTitle className="text-tango-light">Tandas</CardTitle>
              <CardDescription className="text-tango-light/80">
                Create and manage your tandas. Group songs by orchestra, 
                style, or theme for your milongas and practices.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/playlists">
          <Card className="bg-tango-gray border-tango-gray hover:bg-tango-gray/90 transition-colors cursor-pointer h-full">
            <CardHeader className="text-center">
              <List className="w-12 h-12 text-tango-red mx-auto mb-4" />
              <CardTitle className="text-tango-light">Playlists</CardTitle>
              <CardDescription className="text-tango-light/80">
                Organize your tandas into playlists. Perfect for planning 
                your events or sharing your favorite combinations.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </main>
  );
};

export default Index;