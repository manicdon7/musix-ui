import { useState, useEffect } from "react";
import { MusicPlayerLayout } from "@/components/MusicPlayerLayout";
import AlbumCard from "@/components/AlbumCard";
import { sampleGenres, getGenreAlbums } from "@/services/musicService";
import { motion } from "framer-motion";
import { Album } from "@/types/music";
import { Compass, Sparkles, TrendingUp, Flame } from "lucide-react";

export function Discover() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreAlbums, setGenreAlbums] = useState<Album[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load some featured albums (first 4 from the sample data)
  useEffect(() => {
    const loadFeaturedAlbums = async () => {
      setIsLoading(true);
      
      // Getting genre albums if selected
      if (selectedGenre) {
        const albums = getGenreAlbums(selectedGenre);
        setGenreAlbums(albums);
      } else {
        setGenreAlbums([]);
      }
      
      // Simulating API call for featured albums
      setTimeout(() => {
        // Get albums from different genres for the featured section
        const featured = sampleGenres.flatMap(genre => 
          getGenreAlbums(genre.id).slice(0, 1)
        ).slice(0, 4);
        
        setFeaturedAlbums(featured);
        setIsLoading(false);
      }, 800);
    };
    
    loadFeaturedAlbums();
  }, [selectedGenre]);

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

  const genreCardVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, y: -5 }
  };

  return (
    <MusicPlayerLayout>
      <div className="px-4 py-6 md:px-6 lg:px-8 space-y-8">
        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-48 md:h-64 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20" />
          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-10">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Discover New Music
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/80 mt-2 max-w-lg"
            >
              Explore new genres, artists, and trending tracks curated just for you
            </motion.p>
          </div>
          <div className="absolute bottom-0 right-0 p-4">
            <Compass className="w-12 h-12 text-white/30" />
          </div>
        </motion.div>

        {/* Genres section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            Browse Genres
          </h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {sampleGenres.map((genre) => (
              <motion.div 
                key={genre.id}
                variants={itemVariants}
                whileHover="hover"
                initial="idle"
                animate={selectedGenre === genre.id ? "hover" : "idle"}
                className={`cursor-pointer relative rounded-lg overflow-hidden h-32 group`}
                onClick={() => setSelectedGenre(genre.id === selectedGenre ? null : genre.id)}
              >
                <img 
                  src={genre.coverUrl} 
                  alt={genre.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white text-lg font-semibold">{genre.name}</p>
                </div>
                {selectedGenre === genre.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Genre results if a genre is selected */}
        {selectedGenre && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {sampleGenres.find(g => g.id === selectedGenre)?.name} Albums
            </h2>
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : genreAlbums.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {genreAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No albums found for this genre</p>
            )}
          </motion.section>
        )}

        {/* Featured albums section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Featured Albums
          </h2>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              {featuredAlbums.map((album) => (
                <motion.div key={album.id} variants={itemVariants}>
                  <AlbumCard album={album} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* New releases section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Flame className="w-5 h-5 mr-2 text-primary" />
            Latest Releases
          </h2>
          {isLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {/* Sort albums by release date (newest first) and take first 4 */}
              {[...featuredAlbums]
                .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
                .slice(0, 4)
                .map((album) => (
                  <motion.div key={album.id} variants={itemVariants}>
                    <AlbumCard album={album} />
                  </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </MusicPlayerLayout>
  );
} 