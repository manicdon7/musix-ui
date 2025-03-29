
import { ReactNode } from "react";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import PlaybackControls from "./PlaybackControls";
import NowPlaying from "./NowPlaying";
import SearchBar from "./SearchBar";

interface MusicPlayerLayoutProps {
  children: ReactNode;
}

const MusicPlayerLayout = ({ children }: MusicPlayerLayoutProps) => {
  return (
    <MusicPlayerProvider>
      <div className="min-h-screen flex flex-col bg-player-background text-white">
        <header className="w-full bg-[#070707] px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-8">Music Player</h1>
          </div>
          <div className="w-1/3 max-w-md">
            <SearchBar />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        <footer className="w-full bg-[#181818] border-t border-gray-800 px-6 py-3 flex justify-between items-center">
          <NowPlaying />
          <PlaybackControls />
          <div className="w-64 hidden md:block"></div> {/* Spacer to balance the layout */}
        </footer>
      </div>
    </MusicPlayerProvider>
  );
};

export default MusicPlayerLayout;
