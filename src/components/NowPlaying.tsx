
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatTime } from "@/utils/formatTime";

const NowPlaying = () => {
  const { currentTrack, progress, isPlaying, seekTo, audioRef } = useMusicPlayer();

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
        <div className="w-14 h-14 bg-player-card rounded flex-shrink-0"></div>
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
        <img 
          src={currentTrack.albumCover}
          alt={`${currentTrack.album} by ${currentTrack.artist}`}
          className="w-14 h-14 rounded flex-shrink-0 object-cover"
        />
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
          className="progress-bar flex-grow"
          onClick={handleSeek}
        >
          <div 
            className="progress-bar-filled" 
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
