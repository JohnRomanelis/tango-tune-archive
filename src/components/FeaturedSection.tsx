import { Play } from "lucide-react";

const FeaturedSection = () => {
  const featuredTandas = [
    {
      id: 1,
      title: "Golden Age Classics",
      orchestra: "D'Arienzo",
      year: "1941-1943",
      songs: 4,
    },
    {
      id: 2,
      title: "Di Sarli Instrumentals",
      orchestra: "Di Sarli",
      year: "1939-1940",
      songs: 3,
    },
    // More tandas would be added here
  ];

  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-tango-light mb-4">Featured Tandas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featuredTandas.map((tanda) => (
          <div 
            key={tanda.id}
            className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800/70 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-tango-light font-semibold">{tanda.title}</h3>
                <p className="text-gray-400 text-sm">{tanda.orchestra}</p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-tango-burgundy rounded-full p-2 hover:scale-105 transform">
                <Play className="w-4 h-4 text-tango-light" />
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              <p>{tanda.year}</p>
              <p>{tanda.songs} songs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;