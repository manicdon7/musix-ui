import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatTime } from "@/utils/formatTime";
import { Heart, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

  const Equalizer = () => (
    <div className="equalizer">
      <div className="equalizer-bar"></div>
      <div className="equalizer-bar"></div>
      <div className="equalizer-bar"></div>
      <div className="equalizer-bar"></div>
    </div>
  );

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
    <motion.div 
      className="flex flex-col min-w-0 w-full max-w-xs"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 mb-2 min-w-0">
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <img 
            src={currentTrack.albumCover}
            alt={`${currentTrack.album} by ${currentTrack.artist}`}
            className="w-14 h-14 rounded-md flex-shrink-0 object-cover shadow-md"
          />
          {isPlaying && (
            <div className="absolute bottom-1 right-1">
              <Equalizer />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-md">
            <motion.button
              onClick={toggleFavorite}
              className="text-white hover:text-player-highlight transition-colors mx-1"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
            
            {currentTrack.artistId && (
              <motion.a
                href={`https://open.spotify.com/artist/${currentTrack.artistId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-player-highlight transition-colors mx-1"
                aria-label="Open in Spotify"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink size={16} />
              </motion.a>
            )}
          </div>
        </motion.div>
        
        <div className="min-w-0">
          <motion.p 
            className="text-player-text font-medium truncate"
            animate={{ 
              color: isPlaying ? ['#FFFFFF', '#5E35B1', '#2196F3', '#FFFFFF'] : '#FFFFFF'
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {currentTrack.title}
          </motion.p>
          <p className="text-player-subtext text-sm truncate">{currentTrack.artist}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 w-full">
        <span className="text-player-subtext text-xs">
          {formatTime(audioRef.current?.currentTime || 0)}
        </span>
        
        <div 
          className="progress-bar flex-grow group relative"
          onClick={handleSeek}
        >
          <div 
            className="progress-bar-filled" 
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Animated dot on the progress bar */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-glow opacity-0 group-hover:opacity-100"
            style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        <span className="text-player-subtext text-xs">
          {formatTime(currentTrack.duration)}
        </span>
      </div>
    </motion.div>
  );
};

export default NowPlaying;
