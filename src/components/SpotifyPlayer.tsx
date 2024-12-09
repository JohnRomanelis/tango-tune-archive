interface SpotifyPlayerProps {
  trackId: string | null;
}

const SpotifyPlayer = ({ trackId }: SpotifyPlayerProps) => {
  if (!trackId) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-tango-darkGray p-4 border-t border-tango-gray">
      <div className="relative">
        <button
          onClick={() => window.history.replaceState(null, '', window.location.pathname)}
          className="absolute -top-2 -right-2 bg-tango-red hover:bg-tango-red/90 text-white w-6 h-6 rounded-full flex items-center justify-center z-10"
        >
          ×
        </button>
        <iframe
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
        />
      </div>
    </div>
  );
};

export default SpotifyPlayer;