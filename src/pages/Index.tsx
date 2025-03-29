
import MusicPlayerLayout from "@/components/MusicPlayerLayout";
import AlbumCarousel from "@/components/AlbumCarousel";
import TrackList from "@/components/TrackList";

const Index = () => {
  return (
    <MusicPlayerLayout>
      <div className="text-white animate-slide-up">
        <AlbumCarousel />
        
        <div className="mt-6">
          <div className="px-4">
            <h2 className="text-2xl font-bold text-player-text mb-4">All Tracks</h2>
          </div>
          <TrackList standalone />
        </div>
      </div>
    </MusicPlayerLayout>
  );
};

export default Index;
