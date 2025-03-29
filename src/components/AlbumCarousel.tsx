
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import AlbumCard from "./AlbumCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const AlbumCarousel = () => {
  const { albums, loading } = useMusicPlayer();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const { current } = scrollRef;
    const scrollAmount = 220; // Slightly wider than card width to account for margin
    
    if (direction === 'left') {
      current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-player-text mb-4">Albums</h2>
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[200px] w-[200px] bg-player-card rounded-md animate-pulse">
              <div className="aspect-square bg-gray-700/30 rounded mb-2"></div>
              <div className="h-5 bg-gray-700/30 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700/30 rounded w-1/2 mb-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold text-player-text mb-4">Albums</h2>
      
      <div className="relative group">
        <div ref={scrollRef} className="album-carousel">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
        
        <button 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        
        <button 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="text-white" size={24} />
        </button>
      </div>
    </div>
  );
};

export default AlbumCarousel;
