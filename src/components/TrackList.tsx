
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatTime } from "@/utils/formatTime";
import { Album } from "@/types/music";
import { Play, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

interface TrackListProps {
  album?: Album;
  standalone?: boolean;
}

const TrackList = ({ album, standalone = false }: TrackListProps) => {
  const { play, currentTrack, addToQueue, isPlaying } = useMusicPlayer();

  // If standalone is true, we use all tracks from all albums
  const tracks = standalone 
    ? useMusicPlayer().albums.flatMap(a => a.tracks) 
    : album?.tracks || [];

  return (
    <div className={`w-full ${standalone ? 'px-4' : ''}`}>
      <div className="text-player-subtext text-sm grid grid-cols-[16px_1fr_auto_auto] gap-4 py-2 px-4 border-b border-gray-700/30">
        <span>#</span>
        <span>TITLE</span>
        <span className="hidden md:block">ALBUM</span>
        <span>DURATION</span>
      </div>

      <div className="divide-y divide-gray-700/10">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          
          return (
            <div 
              key={track.id}
              className={`group grid grid-cols-[16px_1fr_auto_auto] gap-4 py-2 px-4 hover:bg-white/5 transition-colors ${
                isCurrentTrack ? 'text-player-highlight' : 'text-player-text'
              }`}
              onClick={() => play(track)}
            >
              <div className="flex items-center">
                {isCurrentTrack ? (
                  <span className="now-playing">{index + 1}</span>
                ) : (
                  <span className="group-hover:hidden">{index + 1}</span>
                )}
                <Play size={16} className="hidden group-hover:block" />
              </div>
              
              <div className="min-w-0">
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-player-subtext text-sm truncate">{track.artist}</p>
              </div>
              
              <span className="text-player-subtext text-sm hidden md:block truncate">
                {track.album}
              </span>
              
              <div className="flex items-center gap-2">
                <span className="text-player-subtext text-sm">
                  {formatTime(track.duration)}
                </span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-player-subtext hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-player-card border-gray-700 text-player-text">
                    <DropdownMenuItem 
                      className="cursor-pointer focus:text-player-highlight focus:bg-white/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        play(track);
                      }}
                    >
                      Play
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer focus:text-player-highlight focus:bg-white/5"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue(track);
                      }}
                    >
                      Add to Queue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;
