import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatTime } from "@/utils/formatTime";
import { Album, Track } from "@/types/music";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, Plus, MoreHorizontal, Heart, 
  Volume2, VolumeX, Clock, BarChart3, Music
} from "lucide-react";
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
  customTracks?: Track[];
}

const TrackList = ({ album, standalone = false, customTracks }: TrackListProps) => {
  const { play, currentTrack, addToQueue, isPlaying, pause, resume } = useMusicPlayer();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // If customTracks are provided, use those
  // If standalone is true, use all tracks from all albums
  // Otherwise use album tracks
  const tracks = customTracks 
    ? customTracks 
    : standalone 
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

  const TableHeader = () => (
    <div className="text-player-subtext text-sm grid grid-cols-[16px_1fr_auto_auto] gap-4 py-2 px-4 border-b border-white/5">
      <span>#</span>
      <span>TITLE</span>
      <span className="hidden md:block">ALBUM</span>
      <div className="flex items-center">
        <Clock size={14} className="mr-2" />
      </div>
    </div>
  );

  const Equalizer = () => (
    <div className="equalizer">
      <div className="equalizer-bar"></div>
      <div className="equalizer-bar"></div>
      <div className="equalizer-bar"></div>
      <div className="equalizer-bar"></div>
    </div>
  );

  const NoTracksAvailable = () => (
    <motion.div 
      className="py-16 text-center text-player-subtext flex flex-col items-center justify-center opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Music size={48} className="mb-4 text-player-subtext/30" />
      <p className="text-lg">No tracks available</p>
      <p className="text-sm mt-2">This album has no playable tracks</p>
    </motion.div>
  );

  return (
    <motion.div 
      className={`w-full ${standalone ? 'px-1' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <TableHeader />

      <div className="divide-y divide-white/5">
        <AnimatePresence>
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            const isCurrentlyPlaying = isCurrentTrack && isPlaying;
            const canPlay = !!track.previewUrl;
            const isHovered = hoverIndex === index;
            
            return (
              <motion.div 
                key={track.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className={`group grid grid-cols-[16px_1fr_auto_auto] gap-4 py-3 px-4 hover:bg-white/5 transition-colors rounded-md ${
                  isCurrentTrack ? 'bg-white/5 text-player-highlight' : canPlay ? 'text-player-text' : 'text-player-text/60'
                }`}
                onClick={() => canPlay && handlePlayToggle(track.id)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="flex items-center">
                  <div className="w-4 text-center">
                    {isCurrentTrack ? (
                      <div className="w-4 flex justify-center">
                        {isCurrentlyPlaying ? (
                          <Equalizer />
                        ) : (
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayToggle(track.id);
                            }}
                            className="focus:outline-none"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Play size={14} className="text-player-highlight ml-0.5" />
                          </motion.button>
                        )}
                      </div>
                    ) : (
                      <>
                        <span className={`${(isHovered && canPlay) ? 'hidden' : 'block'}`}>{index + 1}</span>
                        {canPlay ? (
                          <motion.button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayToggle(track.id);
                            }}
                            className={`focus:outline-none ${isHovered ? 'block' : 'hidden'}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Play size={14} className="ml-0.5" />
                          </motion.button>
                        ) : (
                          <span className={`text-xs text-player-subtext/50 ${isHovered ? 'block' : 'hidden'}`}>
                            <VolumeX size={14} />
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div className="min-w-0 flex items-center">
                  <div className="mr-3 w-10 h-10 flex-shrink-0 rounded overflow-hidden group-hover:shadow-md transition-shadow">
                    <img 
                      src={track.albumCover} 
                      alt={track.album}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium truncate">
                      {track.title}
                    </p>
                    <p className="text-player-subtext text-sm truncate flex items-center">
                      {track.artist}
                      {!canPlay && <span className="text-[10px] ml-2 px-1.5 py-0.5 bg-player-card rounded-sm">No preview</span>}
                    </p>
                  </div>
                </div>
                
                <span className="text-player-subtext text-sm hidden md:block truncate self-center">
                  {track.album}
                </span>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={(e) => toggleFavorite(track.id, e)}
                    className={`opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ${
                      favorites.has(track.id) ? 'text-player-highlight' : 'text-player-subtext hover:text-white'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart size={16} fill={favorites.has(track.id) ? 'currentColor' : 'none'} />
                  </motion.button>
                  
                  <span className="text-player-subtext text-sm self-center">
                    {formatTime(track.duration)}
                  </span>
                  
                  {canPlay && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.button 
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-player-subtext hover:text-white transition-colors"
                          onClick={(e) => e.stopPropagation()}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MoreHorizontal size={16} />
                        </motion.button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-player-card border-white/10 text-player-text min-w-40 shadow-xl">
                        <DropdownMenuItem 
                          className="cursor-pointer focus:text-player-highlight focus:bg-white/5 gap-2 py-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            const track = tracks[index];
                            if (track && track.previewUrl) play(track);
                          }}
                        >
                          <Play size={14} />
                          <span>Play Preview</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer focus:text-player-highlight focus:bg-white/5 gap-2 py-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            const track = tracks[index];
                            if (track && track.previewUrl) addToQueue(track);
                          }}
                        >
                          <Plus size={14} />
                          <span>Add to Queue</span>
                        </DropdownMenuItem>
                        {track.artistId && (
                          <DropdownMenuItem 
                            className="cursor-pointer focus:text-player-highlight focus:bg-white/5 gap-2 py-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://open.spotify.com/artist/${track.artistId}`, '_blank');
                            }}
                          >
                            <BarChart3 size={14} />
                            <span>View Artist</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {tracks.length === 0 && <NoTracksAvailable />}
      
      <div className="mt-6 mb-2 text-sm text-player-subtext/70 text-center">
        <p>
          <Volume2 size={14} className="inline-block mr-1 mb-0.5" /> 
          Only 30-second previews are available through the Spotify API.
        </p>
      </div>
    </motion.div>
  );
};

export default TrackList;
