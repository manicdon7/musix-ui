
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatTime } from "@/utils/formatTime";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

const NowPlaying = () => {
  const { currentTrack, progress, isPlaying, seekTo, audioRef } = useMusicPlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    if (!currentTrack) return;
    
    const favorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
    setIsFavorite(favorites.includes(currentTrack.id));
  }, [currentTrack]);
  
  const toggleFavorite = () => {
    if (!currentTrack) return;
    
    const favorites = JSON.parse(localStorage.getItem('musicFavorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== currentTrack.id);
      localStorage.setItem('musicFavorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      favorites.push(currentTrack.id);
      localStorage.setItem('musicFavorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack) return;
    
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - left;
    const percentage = (clickPosition / width) * 100;
    
    seekTo(Math.max(0, Math.min(100, percentage)));
  };

  if (!currentTrack) {
    return (
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-14 h-14 bg-player-card/50 rounded-md flex-shrink-0 flex items-center justify-center">
          <span className="text-player-subtext text-2xl">♪</span>
        </div>
        <div>
          <p className="text-player-text font-medium">Not Playing</p>
          <p className="text-player-subtext text-sm">Select a track to play</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-0 w-full max-w-xs">
      <div className="flex items-center gap-4 mb-2 min-w-0">
        <div className="relative group">
          <img 
            src={currentTrack.albumCover}
            alt={`${currentTrack.album} by ${currentTrack.artist}`}
            className="w-14 h-14 rounded-md flex-shrink-0 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-md">
            <button
              onClick={toggleFavorite}
              className="text-white hover:text-player-highlight transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
        
        <div className="min-w-0">
          <p className="text-player-text font-medium truncate">{currentTrack.title}</p>
          <p className="text-player-subtext text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full">
        <span className="text-player-subtext text-xs">
          {formatTime(audioRef.current?.currentTime || 0)}
        </span>
        
        <div 
          className="progress-bar flex-grow group"
          onClick={handleSeek}
        >
          <div 
            className="progress-bar-filled group-hover:bg-player-highlight" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <span className="text-player-subtext text-xs">
          {formatTime(currentTrack.duration)}
        </span>
      </div>
    </div>
  );
};

export default NowPlaying;
