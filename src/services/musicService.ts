
import { Track, Album } from "@/types/music";

const BASE_URL = "https://v1.nocodeapi.com/lovable/spotify/IUKWHlPSwCsOefLt";

// Sample data for initial loading
const sampleAlbums: Album[] = [
  {
    id: "1",
    name: "Night Visions",
    artist: "Imagine Dragons",
    coverUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
    tracks: [
      {
        id: "1-1",
        title: "Radioactive",
        artist: "Imagine Dragons",
        album: "Night Visions",
        albumCover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/9747b0923f2adb136e2152168b644a247213dd6e",
        duration: 187
      },
      {
        id: "1-2",
        title: "Demons",
        artist: "Imagine Dragons",
        album: "Night Visions",
        albumCover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/3e298c093aa358a66e9b3315da6a5cf0a5c37a41",
        duration: 175
      }
    ]
  },
  {
    id: "2",
    name: "Back in Black",
    artist: "AC/DC",
    coverUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
    tracks: [
      {
        id: "2-1",
        title: "Back in Black",
        artist: "AC/DC",
        album: "Back in Black",
        albumCover: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/410047b29c4a354e66a6ca78f9a638e9c9c8dfa3",
        duration: 210
      },
      {
        id: "2-2",
        title: "Hells Bells",
        artist: "AC/DC",
        album: "Back in Black",
        albumCover: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/4f0b1901ac81fae5e08ae8cd8c3647e1b0fbbf80",
        duration: 240
      }
    ]
  },
  {
    id: "3",
    name: "Random Access Memories",
    artist: "Daft Punk",
    coverUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&h=500&fit=crop",
    tracks: [
      {
        id: "3-1",
        title: "Get Lucky",
        artist: "Daft Punk ft. Pharrell Williams",
        album: "Random Access Memories",
        albumCover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/98710c7aa2b9666452b4bfa08879e64f67dc3109",
        duration: 248
      },
      {
        id: "3-2",
        title: "Instant Crush",
        artist: "Daft Punk ft. Julian Casablancas",
        album: "Random Access Memories",
        albumCover: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/52b9b4af1708962af8bb2b9ad929e1cda4863c67",
        duration: 222
      }
    ]
  },
  {
    id: "4",
    name: "Hotel California",
    artist: "Eagles",
    coverUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=500&fit=crop",
    tracks: [
      {
        id: "4-1",
        title: "Hotel California",
        artist: "Eagles",
        album: "Hotel California",
        albumCover: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/ef04a813af32afab0732dce0a9efa7543e1b47ab",
        duration: 391
      },
      {
        id: "4-2",
        title: "New Kid In Town",
        artist: "Eagles",
        album: "Hotel California",
        albumCover: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/bd8670abe87cec36c817cbf4c6b9b294b8b65961",
        duration: 307
      }
    ]
  }
];

export const getMusicData = async (): Promise<Album[]> => {
  // In a real app, this would fetch from a real API
  // For now, we'll return sample data
  return sampleAlbums;
};

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
    
    if (!response.ok) {
      throw new Error('Failed to search tracks');
    }
    
    const data = await response.json();
    
    if (!data.tracks || !data.tracks.items) {
      return [];
    }
    
    return data.tracks.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      albumCover: track.album.images[0]?.url || '',
      previewUrl: track.preview_url,
      duration: Math.floor(track.duration_ms / 1000)
    }));
  } catch (error) {
    console.error('Error searching tracks:', error);
    
    // Fallback to filtering local data
    const allTracks = sampleAlbums.flatMap(album => album.tracks);
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) || 
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
  }
};
