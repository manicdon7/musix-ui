
import { useState, useEffect } from "react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { Search, X } from "lucide-react";
import { searchTracks } from "@/services/musicService";
import { useDebounce } from "@/hooks/useDebounce";
import { Track } from "@/types/music";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const { play } = useMusicPlayer();
  
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

  const handleClear = () => {
    setQuery("");
    setSearchResults([]);
    setIsResultsVisible(false);
  };

  const handlePlay = (track: Track) => {
    play(track);
    setIsResultsVisible(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-player-subtext" size={18} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tracks..."
          className="pl-10 pr-8 py-2 bg-white/10 text-player-text rounded-full w-full focus:outline-none focus:bg-white/20 transition-colors"
        />
        
        {query && (
          <button 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-player-subtext hover:text-white"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {isResultsVisible && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-player-card rounded-md shadow-lg z-10 max-h-[300px] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-player-subtext">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-player-subtext">No results found</div>
          ) : (
            <div className="p-2">
              {searchResults.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer"
                  onClick={() => handlePlay(track)}
                >
                  <img
                    src={track.albumCover}
                    alt={track.album}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-player-text font-medium truncate">{track.title}</p>
                    <p className="text-player-subtext text-sm truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
