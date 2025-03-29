
import { Album } from "@/types/music";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const { play } = useMusicPlayer();

  const handlePlay = () => {
    if (album.tracks.length > 0) {
      play(album.tracks[0]);
    }
  };

  return (
    <div className="snap-start min-w-[200px] w-[200px]">
      <div 
        className="album-cover album-shadow bg-player-card p-2" 
        onClick={handlePlay}
      >
        <img 
          src={album.coverUrl} 
          alt={`${album.name} by ${album.artist}`}
          className="w-full aspect-square object-cover rounded"
        />
        <div className="pt-2 text-left">
          <h3 className="text-player-text font-semibold truncate">{album.name}</h3>
          <p className="text-player-subtext text-sm truncate">{album.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default AlbumCard;
