import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, Music2, Settings } from "lucide-react";

const Maintenance = () => {
  const { data: userRole } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole && userRole !== 'moderator') {
      navigate('/');
    }
  }, [userRole, navigate]);

  if (!userRole) {
    return null;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-tango-light mb-8">Maintenance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="bg-tango-darkGray border-tango-gray hover:border-tango-red transition-colors cursor-pointer"
          onClick={() => navigate('/maintenance/issues')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tango-light">
              <MessageSquare className="h-5 w-5" />
              General Issues
            </CardTitle>
            <CardDescription className="text-tango-light/70">
              Handle general issues and requests from users
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="bg-tango-darkGray border-tango-gray hover:border-tango-red transition-colors cursor-pointer"
          onClick={() => navigate('/maintenance/song-suggestions')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tango-light">
              <Settings className="h-5 w-5" />
              Song Suggestions
            </CardTitle>
            <CardDescription className="text-tango-light/70">
              Review and manage song suggestions from users
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="bg-tango-darkGray border-tango-gray hover:border-tango-red transition-colors cursor-pointer"
          onClick={() => navigate('/maintenance/orchestras')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-tango-light">
              <Music2 className="h-5 w-5" />
              Orchestras
            </CardTitle>
            <CardDescription className="text-tango-light/70">
              Manage orchestra database entries
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
};

export default Maintenance;