import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Music, Disc } from "lucide-react";
import MusicPlayerLayout from "@/components/MusicPlayerLayout";

const NotFound = () => {
  return (
    <MusicPlayerLayout>
      <div className="flex flex-col items-center justify-center h-[80vh] text-white px-4">
        <motion.div
          className="relative flex items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="relative"
          >
            <Disc size={120} className="text-player-subtext opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-player-background"></div>
            </div>
          </motion.div>
          <motion.div
            className="absolute"
            animate={{ 
              x: [0, -10, 10, -5, 5, 0],
              y: [0, 5, -8, 5, -5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            <Music size={40} className="text-player-highlight" />
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-bold gradient-text mb-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="text-2xl md:text-3xl font-semibold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Track Not Found
        </motion.h2>
        
        <motion.p 
          className="text-player-subtext mb-8 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          The page you're looking for doesn't exist or has been moved to another location.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link to="/">
            <motion.button 
              className="rounded-full bg-gradient-to-r from-player-gradientStart to-player-gradientEnd text-white px-6 py-3 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={18} />
              <span>Return to Homepage</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </MusicPlayerLayout>
  );
};

export default NotFound;
