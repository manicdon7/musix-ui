
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
    
    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      toast({
        title: 'Playback Error',
        description: 'Could not play this track. Trying next track if available.',
        variant: 'destructive',
      });
      // Attempt to play next track
      setTimeout(() => next(), 1000);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
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
          description: 'Could not play this track. It may be region-restricted or no longer available.',
          variant: 'destructive',
        });
        // Check if we have more tracks in queue to try playing instead
        if (queue.length > 0) {
          const nextTrack = queue[0];
          setQueue(prev => prev.slice(1)); // Remove the first track from the queue
          setTimeout(() => play(nextTrack), 500);
        }
      });
      setIsPlaying(true);
      
      // Show toast notification
      toast({
        title: 'Now Playing',
        description: `${track.title} by ${track.artist}`,
      });
    }
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    if (currentTrack && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error resuming playback:', error);
      });
      setIsPlaying(true);
    }
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
      } else {
        // If track isn't in any album, just play the first track from the first album as fallback
        const allTracks = albums.flatMap(a => a.tracks);
        const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
        if (currentIndex >= 0 && allTracks.length > 0) {
          const nextIndex = (currentIndex + 1) % allTracks.length;
          play(allTracks[nextIndex]);
        }
      }
    }
  };

  const previous = () => {
    if (currentTrack) {
      // If the current time is more than 3 seconds, just restart the track
      if (audioRef.current && audioRef.current.currentTime > 3) {
        audioRef.current.currentTime = 0;
        return;
      }
      
      // Find the current album and track
      const currentAlbum = albums.find(album => 
        album.tracks.some(track => track.id === currentTrack.id)
      );
      
      if (currentAlbum) {
        const currentTrackIndex = currentAlbum.tracks.findIndex(track => track.id === currentTrack.id);
        const prevTrackIndex = (currentTrackIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
        play(currentAlbum.tracks[prevTrackIndex]);
      } else {
        // If track isn't in any album, go to previous track in all tracks as fallback
        const allTracks = albums.flatMap(a => a.tracks);
        const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
        if (currentIndex >= 0 && allTracks.length > 0) {
          const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
          play(allTracks[prevIndex]);
        }
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
    toast({
      title: 'Queue Cleared',
      description: 'All tracks have been removed from the queue',
    });
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
