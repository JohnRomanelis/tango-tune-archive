import { Home, Search, Library, PlusSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-tango-dark border-r border-gray-800 p-6">
      <div className="mb-8">
        <h1 className="text-tango-gold text-2xl font-bold">TandaBase</h1>
      </div>
      
      <nav className="space-y-6">
        <div className="space-y-3">
          <Link to="/" className="flex items-center space-x-3 text-tango-light hover:text-tango-gold transition-colors">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link to="/search" className="flex items-center space-x-3 text-tango-light hover:text-tango-gold transition-colors">
            <Search className="w-5 h-5" />
            <span>Search</span>
          </Link>
          <Link to="/library" className="flex items-center space-x-3 text-tango-light hover:text-tango-gold transition-colors">
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-gray-800 space-y-3">
          <Link to="/create-tanda" className="flex items-center space-x-3 text-tango-light hover:text-tango-gold transition-colors">
            <PlusSquare className="w-5 h-5" />
            <span>Create Tanda</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;