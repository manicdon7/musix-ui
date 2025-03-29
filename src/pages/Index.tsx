import MusicPlayerLayout from "@/components/MusicPlayerLayout";
import AlbumCarousel from "@/components/AlbumCarousel";
import TrackList from "@/components/TrackList";
import { Music, Headphones, Sparkles, TrendingUp, Radio, Disc, ListMusic } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      }
    }
  };

  const shimmer = {
    initial: { 
      backgroundPosition: "0% 0%" 
    },
    animate: { 
      backgroundPosition: "100% 0%",
      transition: { 
        repeat: Infinity, 
        repeatType: "mirror" as const, 
        duration: 3 
      }
    }
  };

  return (
    <MusicPlayerLayout>
      <motion.div 
        className="text-white min-h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hero section with glass morphism and gradient */}
        <motion.div 
          className="py-8 px-8 bg-gradient-to-b from-player-highlight/20 to-transparent relative overflow-hidden"
          initial={{ height: "30%" }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full opacity-30 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          >
            {Array(30).fill(0).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 2}px`,
                  height: `${Math.random() * 8 + 2}px`,
                  background: `linear-gradient(${Math.random() * 360}deg, #5E35B1, #2196F3)`,
                  filter: "blur(1px)"
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 6 + 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </motion.div>

          <motion.div
            className="glass-effect p-8 z-10 relative max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 15,
              delay: 0.2 
            }}
          >
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, 0, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatType: "loop" 
                }}
                className="music-icon-container w-14 h-14"
              >
                <Headphones size={28} className="text-white" />
              </motion.div>
              
              <div className="flex flex-col">
                <h1 className="text-5xl font-bold mb-2 gradient-text">
                  Musix 
                </h1>
                <motion.p 
                  className="text-player-subtext text-lg mt-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Discover and enjoy premium music from Spotify
                </motion.p>
              </div>
              
              <motion.div
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  scale: [1, 1.2, 1, 1.2, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: 1
                }}
              >
                <Sparkles size={28} className="text-yellow-300" />
              </motion.div>
            </motion.div>
            
            <motion.div className="flex gap-4 mt-8">
              <motion.div 
                className="flex-1 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <TrendingUp className="text-player-highlightAlt mb-2" size={24} />
                <h3 className="font-medium text-white">Charts</h3>
                <p className="text-player-subtext text-sm mt-1">Top tracks this week</p>
              </motion.div>
              
              <motion.div 
                className="flex-1 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Radio className="text-player-highlightAlt mb-2" size={24} />
                <h3 className="font-medium text-white">Radio</h3>
                <p className="text-player-subtext text-sm mt-1">Based on your taste</p>
              </motion.div>
              
              <motion.div 
                className="flex-1 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 cursor-pointer"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ListMusic className="text-player-highlightAlt mb-2" size={24} />
                <h3 className="font-medium text-white">Playlists</h3>
                <p className="text-player-subtext text-sm mt-1">Curated collections</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Album carousel with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 px-4"
        >
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <AlbumCarousel />
          </motion.div>
        </motion.div>
        
        {/* Track list section */}
        <motion.div 
          className="mt-10 px-4"
          variants={container}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
        >
          <motion.div 
            className="px-4"
            variants={item}
          >
            <motion.div 
              className="flex items-center gap-3 mb-6"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="music-icon-container"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{ 
                  rotate: { duration: 8, ease: "linear", repeat: Infinity },
                }}
              >
                <Disc className="text-white" size={16} />
              </motion.div>
              <h2 className="text-2xl font-bold gradient-text">
                All Tracks
              </h2>
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                className="h-px w-32 bg-gradient-to-r from-transparent via-player-highlight to-transparent self-end mb-1"
              />
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={item}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative px-4"
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-player-gradientStart/20 to-player-gradientEnd/20 rounded-lg blur-xl opacity-50"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
              }}
            />
            <div className="glass-effect overflow-hidden rounded-xl p-2 relative">
              <TrackList standalone />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </MusicPlayerLayout>
  );
};

export default Index;