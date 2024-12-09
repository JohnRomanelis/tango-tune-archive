import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const TopNav = () => {
  const { toast } = useToast();

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
            </nav>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center">
            <div className="flex flex-col items-end">
              <span className="text-tango-light text-sm">
                {supabase.auth.getUser().then(({ data }) => data?.user?.email)}
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