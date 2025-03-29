
import { Album } from "@/types/music";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const { play, isPlaying, currentTrack } = useMusicPlayer();

  const isAlbumPlaying = isPlaying && 
    currentTrack && 
    album.tracks.some(track => track.id === currentTrack.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (album.tracks.length > 0) {
      play(album.tracks[0]);
    }
  };

  return (
    <div className="snap-start min-w-[200px] w-[200px]">
      <Link to={`/album/${album.id}`}>
        <div className="album-cover album-shadow bg-player-card p-2 relative group">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button 
              className="rounded-full bg-player-highlight hover:bg-opacity-80 p-2.5 transform scale-90 group-hover:scale-100 transition-all duration-300"
              onClick={handlePlay}
              aria-label={isAlbumPlaying ? "Pause album" : "Play album"}
            >
              {isAlbumPlaying ? 
                <Pause size={20} className="text-white" /> : 
                <Play size={20} className="text-white ml-0.5" />
              }
            </button>
          </div>
          
          <img 
            src={album.coverUrl} 
            alt={`${album.name} by ${album.artist}`}
            className="w-full aspect-square object-cover rounded"
          />
          
          <div className="pt-2 text-left">
            <h3 className="text-player-text font-semibold truncate">{album.name}</h3>
            <p className="text-player-subtext text-sm truncate">{album.artist}</p>
            {album.genre && (
              <span className="text-xs text-player-subtext/70 mt-1 inline-block">
                {album.genre}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AlbumCard;
