
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import AlbumCard from "./AlbumCard";
import { ChevronLeft, ChevronRight, Disc } from "lucide-react";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Disc className="text-player-highlight" size={24} />
          <h2 className="text-2xl font-bold text-player-text">Albums</h2>
        </div>
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
      <div className="flex items-center gap-3 mb-4">
        <Disc className="text-player-highlight" size={24} />
        <h2 className="text-2xl font-bold text-player-text">Albums</h2>
      </div>
      
      <div className="relative group">
        <ScrollArea className="w-full overflow-x-auto pb-4">
          <div 
            ref={scrollRef} 
            className="album-carousel"
            style={{ paddingBottom: '4px' }}
          >
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </ScrollArea>
        
        <button 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        
        <button 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
