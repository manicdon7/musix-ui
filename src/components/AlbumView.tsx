
import { useParams } from "react-router-dom";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import TrackList from "./TrackList";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import MusicPlayerLayout from "./MusicPlayerLayout";

const AlbumContent = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const { albums, play, isPlaying, currentTrack, pause, resume } = useMusicPlayer();
  
  const album = albums.find(a => a.id === albumId);
  
  if (!album) {
    return <div className="text-center p-8 text-player-text">Album not found</div>;
  }
  
  const isAlbumPlaying = isPlaying && currentTrack && album.tracks.some(t => t.id === currentTrack.id);
  
  const handlePlayAlbum = () => {
    if (isAlbumPlaying) {
      pause();
    } else if (currentTrack && album.tracks.some(t => t.id === currentTrack.id)) {
      resume();
    } else if (album.tracks.length > 0) {
      play(album.tracks[0]);
    }
  };

  return (
    <div className="py-6 animate-slide-up">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-6 mb-6">
        <img
          src={album.coverUrl}
          alt={album.name}
          className="w-48 h-48 md:w-56 md:h-56 shadow-lg rounded"
        />
        
        <div className="text-center md:text-left">
          <p className="text-player-subtext uppercase text-sm">Album</p>
          <h1 className="text-4xl md:text-5xl font-bold text-player-text mt-1 mb-2">{album.name}</h1>
          <p className="text-player-subtext mb-4">
            <span className="font-medium text-player-text">{album.artist}</span> • {album.tracks.length} songs
          </p>
          
          <Button 
            onClick={handlePlayAlbum}
            className="rounded-full bg-player-highlight hover:bg-opacity-80 text-white"
          >
            {isAlbumPlaying ? <Pause className="mr-2" size={16} /> : <Play className="mr-2" size={16} />}
            {isAlbumPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>
      
      <TrackList album={album} />
    </div>
  );
};

// This wrapper component ensures AlbumContent is always within MusicPlayerLayout
const AlbumView = () => {
  return (
    <MusicPlayerLayout>
      <AlbumContent />
    </MusicPlayerLayout>
  );
};

export default AlbumView;
