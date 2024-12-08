import { Play } from "lucide-react";

interface Tanda {
  id: number;
  title: string;
  comments?: string;
  created_at: string;
  tanda_song: {
    song: {
      title: string;
      orchestra: {
        name: string;
      };
    };
  }[];
}

interface FeaturedSectionProps {
  tandas?: Tanda[];
}

const FeaturedSection = ({ tandas = [] }: FeaturedSectionProps) => {
  return (
    <div className="p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-tango-light mb-4">Featured Tandas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tandas.map((tanda) => (
          <div 
            key={tanda.id}
            className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800/70 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-tango-light font-semibold">{tanda.title}</h3>
                <p className="text-gray-400 text-sm">
                  {tanda.tanda_song[0]?.song.orchestra.name || "Unknown Orchestra"}
                </p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-tango-red rounded-full p-2 hover:scale-105 transform">
                <Play className="w-4 h-4 text-tango-light" />
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              <p>{new Date(tanda.created_at).toLocaleDateString()}</p>
              <p>{tanda.tanda_song.length} songs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;