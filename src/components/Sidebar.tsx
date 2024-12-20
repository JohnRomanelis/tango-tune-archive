import { Home, Search, Library, Music, ListMusic, PlaySquare, PlusSquare, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Sidebar = () => {
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
    <div className="w-64 h-screen bg-tango-darkGray border-r border-tango-gray p-6">
      <div className="mb-8">
        <h1 className="text-tango-red text-2xl font-bold">TandaBase</h1>
      </div>
      
      <nav className="space-y-6">
        <div className="space-y-3">
          <Link to="/" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/search" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-tango-gray space-y-3">
          <div className="text-sm text-gray-400 uppercase mb-2">Library</div>
          <Link to="/songs" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <Music className="w-5 h-5" />
            <span>Songs</span>
          </Link>
          <Link to="/tandas" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <ListMusic className="w-5 h-5" />
            <span>Tandas</span>
          </Link>
          <Link to="/playlists" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <PlaySquare className="w-5 h-5" />
            <span>Playlists</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-tango-gray space-y-3">
          <div className="text-sm text-gray-400 uppercase mb-2">Create New</div>
          <Link to="/songs/new" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <PlusSquare className="w-5 h-5" />
            <span>Add Song</span>
          </Link>
          <Link to="/tandas/new" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <PlusSquare className="w-5 h-5" />
            <span>Create Tanda</span>
          </Link>
          <Link to="/playlists/new" className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors">
            <PlusSquare className="w-5 h-5" />
            <span>Create Playlist</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-tango-gray">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-tango-light hover:text-tango-red transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;