import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Music } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";

const Maintenance = () => {
  const navigate = useNavigate();
  const { data: userRole } = useUserRole();

  useEffect(() => {
    if (userRole && userRole !== "moderator") {
      navigate("/");
    }
  }, [userRole, navigate]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-6">Maintenance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="bg-tango-gray hover:bg-tango-gray/90 cursor-pointer transition-colors"
          onClick={() => navigate("/maintenance/general-issues")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tango-light">
              <AlertCircle className="h-6 w-6 text-tango-red" />
              General Issues
            </CardTitle>
            <CardDescription className="text-tango-light/70">
              Handle general issues and requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-tango-light/60">
              Coming soon...
            </p>
          </CardContent>
        </Card>

        <Card 
          className="bg-tango-gray hover:bg-tango-gray/90 cursor-pointer transition-colors"
          onClick={() => navigate("/maintenance/song-suggestions")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tango-light">
              <Music className="h-6 w-6 text-tango-red" />
              Song Suggestions
            </CardTitle>
            <CardDescription className="text-tango-light/70">
              Review and manage song suggestions from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-tango-light/60">
              Review, approve, or reject song suggestions submitted by users
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Maintenance;