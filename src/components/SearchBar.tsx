import { useState, useEffect, useRef } from "react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { Search, X, Loader2, Music, Play } from "lucide-react";
import { searchTracks } from "@/services/musicService";
import { useDebounce } from "@/hooks/useDebounce";
import { Track } from "@/types/music";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const { play } = useMusicPlayer();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      const search = async () => {
        setIsSearching(true);
        const results = await searchTracks(debouncedQuery);
        setSearchResults(results);
        setIsSearching(false);
        setIsResultsVisible(true);
      };
      
      search();
    } else {
      setSearchResults([]);
      setIsResultsVisible(false);
    }
  }, [debouncedQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setQuery("");
    setSearchResults([]);
    setIsResultsVisible(false);
  };

  const handlePlay = (track: Track) => {
    play(track);
    setIsResultsVisible(false);
  };

  const SearchIcon = () => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-player-subtext"
    >
      <Search size={18} />
    </motion.div>
  );

  return (
    <div className="relative" ref={searchRef}>
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isSearching ? (
          <motion.div 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-player-highlight"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={18} />
          </motion.div>
        ) : (
          <SearchIcon />
        )}
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks..."
          className="pl-10 pr-8 py-2.5 bg-white/5 text-player-text rounded-full w-full focus:outline-none focus:ring-1 focus:ring-player-highlight/50 focus:bg-white/10 transition-all"
          onFocus={() => {
            if (query && searchResults.length > 0) {
              setIsResultsVisible(true);
            }
          }}
        />
        
        <AnimatePresence>
          {query && (
            <motion.button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-player-subtext hover:text-white"
              onClick={handleClear}
              aria-label="Clear search"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      
      <AnimatePresence>
        {isResultsVisible && (
          <motion.div 
            className="absolute top-full mt-2 left-0 right-0 bg-player-card rounded-lg shadow-lg z-50 max-h-[350px] overflow-y-auto border border-white/5 backdrop-blur-md"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isSearching ? (
              <div className="p-6 text-center text-player-subtext flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={24} className="mb-2 text-player-highlight" />
                </motion.div>
                <p>Searching for "{debouncedQuery}"...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center">
                <Music size={28} className="mx-auto mb-2 text-player-subtext/50" />
                <p className="text-player-subtext">No results found for "{debouncedQuery}"</p>
                <p className="text-player-subtext/70 text-sm mt-2">Try another search term</p>
              </div>
            ) : (
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-player-subtext border-b border-white/5">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </div>
                {searchResults.map((track) => (
                  <motion.div
                    key={track.id}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-md cursor-pointer transition-colors"
                    onClick={() => handlePlay(track)}
                    whileHover={{ x: 3 }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="relative group">
                      <img
                        src={track.albumCover}
                        alt={track.album}
                        className="w-11 h-11 rounded-md object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.div 
                          whileHover={{ scale: 1.1 }} 
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play size={16} className="text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-player-text font-medium truncate">{track.title}</p>
                      <p className="text-player-subtext text-sm truncate">{track.artist}</p>
                    </div>
                    {!track.previewUrl && (
                      <span className="text-player-subtext/50 text-xs px-2 py-1 bg-white/5 rounded-full">
                        No preview
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
