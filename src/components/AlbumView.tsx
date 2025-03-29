import { useParams } from "react-router-dom";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import TrackList from "./TrackList";
import { Play, Pause, Calendar, Clock, Music2, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import MusicPlayerLayout from "./MusicPlayerLayout";
import { useState, useEffect } from "react";

const AlbumContent = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, play, isPlaying, currentTrack, pause, resume } = useMusicPlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const album = albums.find(a => a.id === albumId);
  
  useEffect(() => {
    if (!album) return;
    
    // Check if album is in favorites
    const favAlbums = JSON.parse(localStorage.getItem('favoriteAlbums') || '[]');
    setIsFavorite(favAlbums.includes(album.id));
  }, [album]);

  const toggleFavorite = () => {
    if (!album) return;
    
    const favAlbums = JSON.parse(localStorage.getItem('favoriteAlbums') || '[]');
    
    if (isFavorite) {
      const newFavs = favAlbums.filter((id: string) => id !== album.id);
      localStorage.setItem('favoriteAlbums', JSON.stringify(newFavs));
      setIsFavorite(false);
    } else {
      favAlbums.push(album.id);
      localStorage.setItem('favoriteAlbums', JSON.stringify(favAlbums));
      setIsFavorite(true);
    }
  };
  
  if (!album) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-player-subtext">
        <Music2 size={64} className="mb-4 opacity-30" />
        <h2 className="text-2xl font-bold mb-2">Album Not Found</h2>
        <p>The album you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  const isAlbumPlaying = isPlaying && currentTrack && album.tracks.some(t => t.id === currentTrack.id);
  
  const handlePlayAlbum = () => {
    if (isAlbumPlaying) {
      pause();
    } else if (currentTrack && album.tracks.some(t => t.id === currentTrack.id)) {
      resume();
    } else if (album.tracks.length > 0) {
      play(album.tracks[0]);
    }
  };

  // Format the release date
  const formattedDate = album.releaseDate 
    ? new Date(album.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <motion.div 
      className="py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden">
        {/* Background blur effect */}
        <div 
          className="absolute inset-0 bg-no-repeat bg-cover opacity-20 blur-xl"
          style={{ backgroundImage: `url(${album.coverUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-player-background/70 to-player-background" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8 px-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <img
              src={album.coverUrl}
              alt={album.name}
              className="w-56 h-56 md:w-64 md:h-64 shadow-xl rounded-lg album-shadow"
            />
            <motion.div 
              className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg"
              whileHover={{ scale: 1.02 }}
              onClick={handlePlayAlbum}
            >
              <motion.button
                className="rounded-full bg-gradient-to-r from-player-gradientStart to-player-gradientEnd text-white p-5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAlbumPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="text-center md:text-left max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-player-subtext uppercase text-sm tracking-widest mb-2">Album</div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{album.name}</h1>
            
            <div className="flex flex-col md:flex-row md:items-center text-player-subtext mb-4 gap-1 md:gap-4">
              <div className="font-medium text-white">{album.artist}</div>
              
              {album.releaseDate && (
                <>
                  <div className="hidden md:block">•</div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1.5" />
                    <span>{formattedDate}</span>
                  </div>
                </>
              )}
              
              <div className="hidden md:block">•</div>
              <div className="flex items-center">
                <Music2 size={14} className="mr-1.5" />
                <span>{album.tracks.length} songs</span>
              </div>
              
              {album.genre && (
                <>
                  <div className="hidden md:block">•</div>
                  <div className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                    {album.genre}
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <motion.button 
                onClick={handlePlayAlbum}
                className="rounded-full bg-gradient-to-r from-player-gradientStart to-player-gradientEnd hover:opacity-90 text-white px-8 py-3 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAlbumPlaying ? "Pause" : "Play"}
              </motion.button>
              
              <motion.button 
                onClick={toggleFavorite}
                className={`p-3 rounded-full ${isFavorite ? 'text-player-highlight' : 'text-player-subtext'} hover:bg-white/5`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.button>
              
              <motion.button 
                className="p-3 rounded-full text-player-subtext hover:text-white hover:bg-white/5"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 px-4"
      >
        <TrackList album={album} />
      </motion.div>
    </motion.div>
  );
};

// This wrapper component ensures AlbumContent is always within MusicPlayerLayout
const AlbumView = () => {
  return (
    <MusicPlayerLayout>
      <AlbumContent />
    </MusicPlayerLayout>
  );
};

export default AlbumView;
