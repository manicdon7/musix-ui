
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle
} from "lucide-react";
import { useState } from "react";

const PlaybackControls = () => {
  const { 
    isPlaying, 
    pause, 
    resume, 
    next, 
    previous, 
    volume, 
    setVolume, 
    currentTrack 
  } = useMusicPlayer();
  
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

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
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <button 
          className={`text-player-subtext hover:text-white transition-colors ${shuffle ? 'text-player-highlight' : ''}`}
          onClick={toggleShuffle}
          aria-label="Shuffle"
        >
          <Shuffle size={16} />
        </button>
        
        <button 
          className="player-button"
          onClick={previous}
          disabled={!currentTrack}
          aria-label="Previous track"
        >
          <SkipBack size={18} />
        </button>
        
        <button 
          className={`${currentTrack ? 'player-button-primary' : 'player-button bg-gray-700/50 cursor-not-allowed'}`}
          onClick={handlePlayPause}
          disabled={!currentTrack}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        
        <button 
          className="player-button"
          onClick={next}
          disabled={!currentTrack}
          aria-label="Next track"
        >
          <SkipForward size={18} />
        </button>
        
        <button 
          className={`text-player-subtext hover:text-white transition-colors ${repeat ? 'text-player-highlight' : ''}`}
          onClick={toggleRepeat}
          aria-label="Repeat"
        >
          <Repeat size={16} />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          className="text-player-subtext hover:text-white transition-colors"
          onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
          aria-label={volume === 0 ? "Unmute" : "Mute"}
        >
          {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
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
      </div>
    </div>
  );
};

export default PlaybackControls;
