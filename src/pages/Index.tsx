import Sidebar from "@/components/Sidebar";
import FeaturedSection from "@/components/FeaturedSection";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-tango-dark">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-tango-dark/90 backdrop-blur-sm z-10 p-6">
          <div className="flex items-center space-x-4">
            <input
              type="search"
              placeholder="Search for songs, orchestras, or singers..."
              className="w-full max-w-md px-4 py-2 rounded-full bg-gray-800 text-tango-light border border-gray-700 focus:outline-none focus:border-tango-gold"
            />
          </div>
        </div>
        <FeaturedSection />
      </main>
    </div>
  );
};

export default Index;