import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";

const TopNav = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const { data: userRole } = useUserRole();

  useEffect(() => {
    const getUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
        }
      }
    };
    getUsername();
  }, []);

  const handleLogout = async () => {
    try {
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
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "An unexpected error occurred",
      });
    }
  };

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
              {userRole === 'moderator' && (
                <Link to="/maintenance" className="text-tango-light hover:text-tango-red transition-colors">
                  Maintenance
                </Link>
              )}
            </nav>
          </div>

          {/* Right side - User info and dropdown */}
          <div className="flex items-center">
            <div className="flex flex-col items-end mr-4">
              <span className="text-tango-light text-sm font-medium">
                {username}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-tango-light hover:text-tango-red transition-colors"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-tango-menuBg border-tango-border"
              >
                <DropdownMenuItem
                  className="text-tango-light hover:bg-tango-menuHover cursor-pointer"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-tango-light hover:bg-tango-menuHover cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;