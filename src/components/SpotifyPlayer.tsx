interface SpotifyPlayerProps {
  trackId: string | null;
}

const SpotifyPlayer = ({ trackId }: SpotifyPlayerProps) => {
  if (!trackId) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-tango-darkGray p-4 border-t border-tango-gray">
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&autoplay=1`}
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      />
    </div>
  );
};

export default SpotifyPlayer;