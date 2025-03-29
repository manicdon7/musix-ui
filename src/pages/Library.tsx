import { useState, useEffect } from "react";
import { MusicPlayerLayout } from "@/components/MusicPlayerLayout";
import AlbumCard from "@/components/AlbumCard";
import { motion, AnimatePresence } from "framer-motion";
import { Album } from "@/types/music";
import { samplePlaylists, getPlaylistTracks, getMusicData } from "@/services/musicService";
import { Book, Heart, ListMusic, Play, Plus } from "lucide-react";
import TrackList  from "@/components/TrackList";

export function Library() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<any[]>([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allAlbums, setAllAlbums] = useState<Album[]>([]);

  // Load user's library data
  useEffect(() => {
    const loadLibraryData = async () => {
      setIsLoading(true);
      
      try {
        // Load all albums to find favorites
        const albums = await getMusicData();
        setAllAlbums(albums);
        
        // Check local storage for favorite albums
        const storedFavorites = localStorage.getItem('favoriteAlbums');
        const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
        
        // Filter albums to find favorites
        const favorites = albums.filter(album => favoriteIds.includes(album.id));
        setFavoriteAlbums(favorites);
        
        // If a playlist is selected, get its tracks
        if (selectedPlaylist) {
          const tracks = getPlaylistTracks(selectedPlaylist);
          setPlaylistTracks(tracks);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading library data:", error);
        setIsLoading(false);
      }
    };
    
    loadLibraryData();
  }, [selectedPlaylist]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <MusicPlayerLayout>
      <div className="px-4 py-6 md:px-6 lg:px-8 space-y-8">
        {/* Library header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-xl bg-gradient-to-r from-primary/20 via-background to-secondary/20 overflow-hidden backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <Book className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Your Library</h1>
              <p className="text-muted-foreground">Your music collections and playlists</p>
            </div>
          </div>
        </motion.div>

        {/* Playlists section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ListMusic className="w-5 h-5 mr-2 text-primary" />
            Your Playlists
          </h2>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {/* Add new playlist card */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="rounded-lg border border-dashed border-border p-6 flex flex-col items-center justify-center gap-3 h-52 cursor-pointer hover:bg-accent/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium">Create New Playlist</p>
              <p className="text-xs text-muted-foreground text-center">Add your favorite tracks to a new collection</p>
            </motion.div>
            
            {/* Playlist cards */}
            {samplePlaylists.map((playlist) => (
              <motion.div 
                key={playlist.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className={`rounded-lg overflow-hidden cursor-pointer border border-border/50 ${selectedPlaylist === playlist.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedPlaylist(selectedPlaylist === playlist.id ? null : playlist.id)}
              >
                <div className="relative aspect-square">
                  <img 
                    src={playlist.coverUrl} 
                    alt={playlist.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Play className="w-6 h-6 text-white" fill="white" />
                    </motion.div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold truncate">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{playlist.description}</p>
                  <p className="text-xs mt-1">{playlist.trackIds.length} tracks</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Selected playlist tracks */}
        <AnimatePresence>
          {selectedPlaylist && (
            <motion.section
              initial={{ opacity: 0, height: 0, overflow: "hidden" }}
              animate={{ opacity: 1, height: "auto", overflow: "visible" }}
              exit={{ opacity: 0, height: 0, overflow: "hidden" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {samplePlaylists.find(p => p.id === selectedPlaylist)?.name} Tracks
                </h2>
                <button className="text-sm text-primary hover:underline" onClick={() => setSelectedPlaylist(null)}>
                  Close
                </button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <TrackList customTracks={playlistTracks} />
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Favorites section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-primary" fill="#ec4899" />
            Favorite Albums
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : favoriteAlbums.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {favoriteAlbums.map((album) => (
                <motion.div key={album.id} variants={itemVariants}>
                  <AlbumCard album={album} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-border/50 p-10 text-center"
            >
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Favorite Albums Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't added any albums to your favorites yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Browse the Discover page and click the heart icon on any album to add it to your favorites.
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </MusicPlayerLayout>
  );
} 