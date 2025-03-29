
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Track, Album } from '@/types/music';
import { toast } from '@/components/ui/use-toast';
import { getMusicData } from '@/services/musicService';

type MusicPlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  albums: Album[];
  queue: Track[];
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seekTo: (progress: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  loading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [queue, setQueue] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        const data = await getMusicData();
        setAlbums(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching music data:', error);
        toast({
          title: 'Error loading music data',
          description: 'Please try again later',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      next();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = (track: Track) => {
    setCurrentTrack(track);
    
    // Reset the audio element to ensure it loads the new track
    if (audioRef.current) {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing track:', error);
        toast({
          title: 'Playback Error',
          description: 'Could not play this track. It may not be available in your region.',
          variant: 'destructive',
        });
      });
      setIsPlaying(true);
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const next = () => {
    if (queue.length > 0) {
      // Play the next track in the queue
      const nextTrack = queue[0];
      setQueue(prev => prev.slice(1)); // Remove the first track from the queue
      play(nextTrack);
    } else if (currentTrack) {
      // Find the current album and track
      const currentAlbum = albums.find(album => 
        album.tracks.some(track => track.id === currentTrack.id)
      );
      
      if (currentAlbum) {
        const currentTrackIndex = currentAlbum.tracks.findIndex(track => track.id === currentTrack.id);
        const nextTrackIndex = (currentTrackIndex + 1) % currentAlbum.tracks.length;
        play(currentAlbum.tracks[nextTrackIndex]);
      }
    }
  };

  const previous = () => {
    if (currentTrack) {
      // Find the current album and track
      const currentAlbum = albums.find(album => 
        album.tracks.some(track => track.id === currentTrack.id)
      );
      
      if (currentAlbum) {
        const currentTrackIndex = currentAlbum.tracks.findIndex(track => track.id === currentTrack.id);
        const prevTrackIndex = (currentTrackIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
        play(currentAlbum.tracks[prevTrackIndex]);
      }
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const seekTo = (newProgress: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
      setProgress(newProgress);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
    toast({
      title: 'Added to Queue',
      description: `${track.title} by ${track.artist}`,
    });
  };

  const removeFromQueue = (trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        volume,
        albums,
        queue,
        play,
        pause,
        resume,
        next,
        previous,
        setVolume,
        seekTo,
        addToQueue,
        removeFromQueue,
        clearQueue,
        loading,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
