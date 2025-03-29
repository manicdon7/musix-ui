import { useMusicPlayer } from "@/context/MusicPlayerContext";
import AlbumCard from "./AlbumCard";
import { ChevronLeft, ChevronRight, Disc, Sparkles } from "lucide-react";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const AlbumCarousel = () => {
  const { albums, loading } = useMusicPlayer();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const { current } = scrollRef;
    const scrollAmount = 230; // Slightly wider than card width to account for margin
    
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div 
            className="music-icon-container"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Disc className="text-white" size={16} />
          </motion.div>
          <h2 className="text-2xl font-bold gradient-text">Featured Albums</h2>
        </div>
        <div className="flex gap-5 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <motion.div 
              key={i} 
              className="min-w-[200px] w-[200px] rounded-lg overflow-hidden bg-player-card/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className="aspect-square bg-player-cardHover/30 animate-pulse" />
              <div className="p-3">
                <div className="h-5 bg-player-cardHover/30 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-player-cardHover/30 rounded w-1/2 animate-pulse"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="p-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-3 mb-6"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div 
          className="music-icon-container"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <Disc className="text-white" size={16} />
        </motion.div>
        <h2 className="text-2xl font-bold gradient-text">Featured Albums</h2>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Sparkles size={18} className="text-yellow-300 ml-1" />
        </motion.div>
      </motion.div>
      
      <div className="relative group">
        <ScrollArea className="w-full overflow-x-auto">
          <div 
            ref={scrollRef} 
            className="album-carousel"
          >
            {albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AlbumCard album={album} />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
        
        <motion.button 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="text-white" size={28} />
        </motion.button>
        
        <motion.button 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="text-white" size={28} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AlbumCarousel;
