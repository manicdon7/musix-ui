import { ReactNode } from "react";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import PlaybackControls from "./PlaybackControls";
import NowPlaying from "./NowPlaying";
import SearchBar from "./SearchBar";
import { 
  Home, 
  Library, 
  Music2, 
  Headphones, 
  Heart, 
  ListMusic, 
  AlignJustify,
  User,
  Compass
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface MusicPlayerLayoutProps {
  children: ReactNode;
}

export const MusicPlayerLayout = ({ children }: MusicPlayerLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Helper to determine if a link is active
  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };
  
  return (
    <MusicPlayerProvider>
      <div className="min-h-screen flex flex-col bg-player-background text-white">
        <header className="w-full bg-[#0A0A14] px-6 py-5 flex justify-between items-center shadow-lg z-10 relative">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="music-icon-container"
              >
                <Headphones size={18} className="text-white" />
              </motion.div>
              <h1 className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform">
                Musix
              </h1>
            </Link>
            
            <div className="hidden md:flex items-center ml-10 space-x-1">
              <Link to="/" className={`nav-item flex items-center gap-2 ${isActive("/") ? "bg-white/10" : ""}`}>
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link to="/discover" className={`nav-item flex items-center gap-2 ${isActive("/discover") ? "bg-white/10" : ""}`}>
                <Compass size={18} />
                <span>Discover</span>
              </Link>
              <Link to="/library" className={`nav-item flex items-center gap-2 ${isActive("/library") ? "bg-white/10" : ""}`}>
                <Library size={18} />
                <span>Library</span>
              </Link>
            </div>
          </div>
          
          <div className="w-1/3 max-w-md">
            <SearchBar />
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link to="/library" className="nav-item flex items-center gap-2">
              <Heart size={18} />
              <span className="hidden lg:inline">Favorites</span>
            </Link>
            <div className="glass-effect p-1.5 rounded-full">
              <User size={18} className="text-player-subtext" />
            </div>
          </div>
          
          <button className="md:hidden text-player-subtext hover:text-white">
            <AlignJustify size={24} />
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-16 md:w-56 bg-[#0A0A14] hidden md:flex flex-col items-center md:items-start py-5 border-r border-white/5">
            <div className="w-full px-4 mb-6">
              <h2 className="text-xs uppercase text-player-subtext tracking-wider mb-3 hidden md:block">
                Navigation
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link to="/" className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${isActive("/") && currentPath === "/" ? "bg-white/10 text-primary" : ""}`}>
                    <Home size={20} className="min-w-5" />
                    <span className="hidden md:block">Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/discover" className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${isActive("/discover") ? "bg-white/10 text-primary" : ""}`}>
                    <Compass size={20} className="min-w-5" />
                    <span className="hidden md:block">Discover</span>
                  </Link>
                </li>
                <li>
                  <Link to="/library" className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${isActive("/library") ? "bg-white/10 text-primary" : ""}`}>
                    <Library size={20} className="min-w-5" />
                    <span className="hidden md:block">Library</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="w-full px-4">
              <h2 className="text-xs uppercase text-player-subtext tracking-wider mb-3 hidden md:block">
                Library
              </h2>
              <ul className="space-y-1">
                <li>
                  <Link to="/library" className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${isActive("/library") ? "bg-white/10 text-primary" : ""}`}>
                    <ListMusic size={20} className="min-w-5" />
                    <span className="hidden md:block">Playlists</span>
                  </Link>
                </li>
                <li>
                  <Link to="/library" className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${isActive("/library") ? "bg-white/10 text-primary" : ""}`}>
                    <Heart size={20} className="min-w-5" />
                    <span className="hidden md:block">Favorites</span>
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        
        <footer className="w-full bg-[#0A0A14] border-t border-white/5 px-6 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] flex justify-between items-center">
          <NowPlaying />
          <PlaybackControls />
          <div className="w-64 hidden md:block"></div> {/* Spacer to balance the layout */}
        </footer>
      </div>
    </MusicPlayerProvider>
  );
};

export default MusicPlayerLayout;
