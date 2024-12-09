import React from "react";

interface SpotifyPlayerProps {
  trackId: string;
  onClose: () => void;
}

const SpotifyPlayer = ({ trackId, onClose }: SpotifyPlayerProps) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-tango-darkGray p-4 border-t border-tango-gray">
      <div className="relative">
        <button
          onClick={onClose}
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