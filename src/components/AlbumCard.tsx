import { Album } from "@/types/music";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { Play, Pause, Calendar, Disc } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const { play, isPlaying, currentTrack } = useMusicPlayer();

  const isAlbumPlaying = isPlaying && 
    currentTrack && 
    album.tracks.some(track => track.id === currentTrack.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (album.tracks.length > 0) {
      play(album.tracks[0]);
    }
  };
  
  // Format the release date if available
  const formattedReleaseDate = album.releaseDate 
    ? new Date(album.releaseDate).getFullYear().toString()
    : "";

  return (
    <motion.div 
      className="snap-start min-w-[200px] w-[200px]"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <Link to={`/album/${album.id}`}>
        <div className="album-cover album-shadow relative group glass-effect">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <motion.button 
              className="rounded-full bg-gradient-to-r from-player-gradientStart to-player-gradientEnd hover:shadow-glow p-3 transform scale-90 group-hover:scale-100 transition-all duration-300"
              onClick={handlePlay}
              aria-label={isAlbumPlaying ? "Pause album" : "Play album"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isAlbumPlaying ? 
                <Pause size={22} className="text-white" /> : 
                <Play size={22} className="text-white ml-0.5" />
              }
            </motion.button>
          </div>
          
          <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm text-xs text-white px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Disc size={10} />
            <span>{album.tracks.length}</span>
          </div>
          
          <div className="w-full aspect-square overflow-hidden rounded-t-lg relative">
            <motion.img 
              src={album.coverUrl} 
              alt={`${album.name} by ${album.artist}`}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            {isAlbumPlaying && (
              <div className="absolute bottom-2 right-2">
                <div className="equalizer">
                  <div className="equalizer-bar"></div>
                  <div className="equalizer-bar"></div>
                  <div className="equalizer-bar"></div>
                  <div className="equalizer-bar"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="pt-3 pb-4 px-3 text-left">
            <h3 className="text-player-text font-semibold truncate">{album.name}</h3>
            <p className="text-player-subtext text-sm truncate">{album.artist}</p>
            
            {formattedReleaseDate && (
              <div className="flex items-center mt-2 text-player-subtext/70 text-xs">
                <Calendar size={10} className="mr-1" />
                <span>{formattedReleaseDate}</span>
                {album.genre && (
                  <>
                    <span className="mx-1">•</span>
                    <span>{album.genre}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AlbumCard;
