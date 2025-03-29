import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  ListMusic
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PlaybackControls = () => {
  const { 
    isPlaying, 
    pause, 
    resume, 
    next, 
    previous, 
    volume, 
    setVolume, 
    currentTrack,
    audioRef,
    queue
  } = useMusicPlayer();
  
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      const handleError = () => {
        console.error("Audio element error");
        setAudioError(true);
      };

      const handlePlay = () => {
        setAudioError(false);
      };

      audioRef.current.addEventListener('error', handleError);
      audioRef.current.addEventListener('play', handlePlay);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('play', handlePlay);
        }
      };
    }
  }, [audioRef]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleRepeat = () => setRepeat(!repeat);
  const toggleShuffle = () => setShuffle(!shuffle);

  return (
    <motion.div 
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-5">
        <motion.button 
          className={`text-player-subtext hover:text-white transition-colors ${shuffle ? 'gradient-text' : ''}`}
          onClick={toggleShuffle}
          aria-label="Shuffle"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Shuffle size={18} className={shuffle ? 'drop-shadow-[0_0_2px_#5E35B1]' : ''} />
        </motion.button>
        
        <motion.button 
          className="player-button"
          onClick={previous}
          disabled={!currentTrack}
          aria-label="Previous track"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipBack size={20} />
        </motion.button>
        
        <motion.button 
          className={`${currentTrack ? 'player-button-primary' : 'player-button bg-gray-700/50 cursor-not-allowed'} ${audioError ? 'bg-red-500' : ''}`}
          onClick={handlePlayPause}
          disabled={!currentTrack}
          aria-label={isPlaying ? "Pause" : "Play"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
          transition={isPlaying ? { 
            scale: { repeat: 0, duration: 0.8 },
            default: { duration: 0.2 }
          } : { duration: 0.2 }}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </motion.button>
        
        <motion.button 
          className="player-button"
          onClick={next}
          disabled={!currentTrack}
          aria-label="Next track"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward size={20} />
        </motion.button>
        
        <motion.button 
          className={`text-player-subtext hover:text-white transition-colors ${repeat ? 'gradient-text' : ''}`}
          onClick={toggleRepeat}
          aria-label="Repeat"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Repeat size={18} className={repeat ? 'drop-shadow-[0_0_2px_#5E35B1]' : ''} />
        </motion.button>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group"
          title={`${queue.length} tracks in queue`}
        >
          <motion.button 
            className="text-player-subtext hover:text-white transition-colors"
            aria-label="Queue"
            whileTap={{ scale: 0.95 }}
          >
            <ListMusic size={18} />
          </motion.button>
          {queue.length > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-player-highlight rounded-full flex items-center justify-center text-[10px] font-semibold">
              {queue.length}
            </div>
          )}
        </motion.div>
      </div>
      
      <div className="flex items-center gap-3">
        <motion.button 
          className="text-player-subtext hover:text-white transition-colors"
          onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
          aria-label={volume === 0 ? "Unmute" : "Mute"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </motion.button>
        
        <div className="relative group">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Volume"
          />
          <div className="absolute inset-y-0 left-0 pointer-events-none bg-gradient-to-r from-player-gradientStart to-player-gradientEnd rounded-full" style={{
            width: `${volume * 100}%`,
            maxWidth: '100%'
          }}></div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaybackControls;
