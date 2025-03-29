
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatTime } from "@/utils/formatTime";
import { Album } from "@/types/music";
import { Play, Pause, Plus, MoreHorizontal, Heart, Volume2, VolumeX } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface TrackListProps {
  album?: Album;
  standalone?: boolean;
}

const TrackList = ({ album, standalone = false }: TrackListProps) => {
  const { play, currentTrack, addToQueue, isPlaying, pause, resume } = useMusicPlayer();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // If standalone is true, we use all tracks from all albums
  const tracks = standalone 
    ? useMusicPlayer().albums.flatMap(a => a.tracks) 
    : album?.tracks || [];

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('musicFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const toggleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    
    if (newFavorites.has(trackId)) {
      newFavorites.delete(trackId);
    } else {
      newFavorites.add(trackId);
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('musicFavorites', JSON.stringify([...newFavorites]));
  };

  const handlePlayToggle = (trackId: string) => {
    if (currentTrack?.id === trackId) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      const track = tracks.find(t => t.id === trackId);
      if (track) {
        play(track);
      }
    }
  };

  const hasPreviewUrl = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    return track?.previewUrl ? true : false;
  };

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
          const isCurrentlyPlaying = isCurrentTrack && isPlaying;
          const canPlay = !!track.previewUrl;
          
          return (
            <div 
              key={track.id}
              className={`group grid grid-cols-[16px_1fr_auto_auto] gap-4 py-3 px-4 hover:bg-white/5 transition-colors ${
                isCurrentTrack ? 'text-player-highlight' : canPlay ? 'text-player-text' : 'text-player-text/60'
              }`}
              onClick={() => canPlay && handlePlayToggle(track.id)}
            >
              <div className="flex items-center">
                <div className="w-4 text-center">
                  {isCurrentTrack ? (
                    <span className="now-playing">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayToggle(track.id);
                        }}
                        className="focus:outline-none"
                      >
                        {isCurrentlyPlaying ? (
                          <Pause size={14} className="text-player-highlight" />
                        ) : (
                          <Play size={14} className="text-player-highlight ml-0.5" />
                        )}
                      </button>
                    </span>
                  ) : (
                    <>
                      <span className="group-hover:hidden">{index + 1}</span>
                      {canPlay ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayToggle(track.id);
                          }}
                          className="hidden group-hover:block focus:outline-none"
                        >
                          <Play size={14} className="ml-0.5" />
                        </button>
                      ) : (
                        <span className="hidden group-hover:block text-xs text-player-subtext/50">
                          <VolumeX size={14} />
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="min-w-0 flex items-center">
                <div className="mr-3 w-10 h-10 flex-shrink-0 rounded overflow-hidden">
                  <img 
                    src={track.albumCover} 
                    alt={track.album}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium truncate">
                    {track.title}
                    {!canPlay && <span className="text-xs ml-2 text-player-subtext/50">(No preview)</span>}
                  </p>
                  <p className="text-player-subtext text-sm truncate">{track.artist}</p>
                </div>
              </div>
              
              <span className="text-player-subtext text-sm hidden md:block truncate self-center">
                {track.album}
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => toggleFavorite(track.id, e)}
                  className={`opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ${
                    favorites.has(track.id) ? 'text-player-highlight' : 'text-player-subtext hover:text-white'
                  }`}
                >
                  <Heart size={16} fill={favorites.has(track.id) ? 'currentColor' : 'none'} />
                </button>
                
                <span className="text-player-subtext text-sm self-center">
                  {formatTime(track.duration)}
                </span>
                
                {canPlay && (
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
                          const track = tracks[index];
                          if (track && track.previewUrl) play(track);
                        }}
                      >
                        Play Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer focus:text-player-highlight focus:bg-white/5"
                        onClick={(e) => {
                          e.stopPropagation();
                          const track = tracks[index];
                          if (track && track.previewUrl) addToQueue(track);
                        }}
                      >
                        <Plus size={14} className="mr-1.5" />
                        Add to Queue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {tracks.length === 0 && (
        <div className="py-8 text-center text-player-subtext">
          No tracks available
        </div>
      )}
      
      <div className="mt-4 text-sm text-player-subtext/70 text-center">
        <p>
          <Volume2 size={14} className="inline-block mr-1 mb-0.5" /> 
          Only 30-second previews are available through the Spotify API.
        </p>
      </div>
    </div>
  );
};

export default TrackList;
