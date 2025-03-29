
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX 
} from "lucide-react";

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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4">
        <button 
          className="player-button"
          onClick={previous}
          disabled={!currentTrack}
          aria-label="Previous track"
        >
          <SkipBack size={20} />
        </button>
        
        <button 
          className={`${currentTrack ? 'player-button-primary' : 'player-button bg-gray-700/50 cursor-not-allowed'}`}
          onClick={handlePlayPause}
          disabled={!currentTrack}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button 
          className="player-button"
          onClick={next}
          disabled={!currentTrack}
          aria-label="Next track"
        >
          <SkipForward size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          className="text-player-subtext"
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
