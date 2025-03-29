
import MusicPlayerLayout from "@/components/MusicPlayerLayout";
import AlbumCarousel from "@/components/AlbumCarousel";
import TrackList from "@/components/TrackList";
import { Music, Headphones } from "lucide-react";

const Index = () => {
  return (
    <MusicPlayerLayout>
      <div className="text-white animate-slide-up">
        <div className="py-4 px-6 bg-gradient-to-b from-player-highlight/30 to-transparent">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Headphones size={32} className="text-player-highlight" />
            Welcome to Music Player
          </h1>
          <p className="text-player-subtext">
            Discover and enjoy music from independent artists
          </p>
        </div>
        
        <AlbumCarousel />
        
        <div className="mt-6">
          <div className="px-6">
            <div className="flex items-center gap-3 mb-4">
              <Music className="text-player-highlight" size={24} />
              <h2 className="text-2xl font-bold text-player-text">All Tracks</h2>
            </div>
          </div>
          <TrackList standalone />
        </div>
      </div>
    </MusicPlayerLayout>
  );
};

export default Index;
