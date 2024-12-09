import PlaylistCard from "./PlaylistCard";

interface Playlist {
  id: number;
  title: string;
  description: string | null;
  visibility: "private" | "public" | "shared";
  playlist_tanda?: Array<{
    order_in_playlist: number;
    tanda: {
      id: number;
      title: string;
    };
  }>;
}

interface PlaylistsGridProps {
  playlists: Playlist[];
  onDeletePlaylist: (id: number) => void;
}

const PlaylistsGrid = ({ playlists, onDeletePlaylist }: PlaylistsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          playlist={playlist}
          onDelete={() => onDeletePlaylist(playlist.id)}
        />
      ))}
    </div>
  );
};

export default PlaylistsGrid;