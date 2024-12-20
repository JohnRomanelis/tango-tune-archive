import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";

const TopNav = () => {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { data: userRole, isError } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setUserEmail(session.user.email);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/login");
      } else {
        setUserEmail(session.user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
    }
  };

  if (isError) {
    return null;
  }

  return (
    <div className="bg-tango-darkGray border-b border-tango-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Navigation */}
          <div className="flex">
            <Link to="/" className="flex items-center text-tango-red text-2xl font-bold">
              TandaBase
            </Link>
            <nav className="ml-10 flex items-center space-x-8">
              <Link to="/songs" className="text-tango-light hover:text-tango-red transition-colors">
                Songs
              </Link>
              <Link to="/tandas" className="text-tango-light hover:text-tango-red transition-colors">
                Tandas
              </Link>
              <Link to="/playlists" className="text-tango-light hover:text-tango-red transition-colors">
                Playlists
              </Link>
              {userRole === "moderator" && (
                <Link to="/maintenance" className="text-tango-light hover:text-tango-red transition-colors">
                  Maintenance
                </Link>
              )}
            </nav>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center">
            <div className="flex flex-col items-end">
              <span className="text-tango-light text-sm">
                {userEmail}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-tango-light hover:text-tango-red transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;