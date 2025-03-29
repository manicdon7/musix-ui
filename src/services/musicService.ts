
import { Track, Album } from "@/types/music";
import { getFeaturedAlbums, getPopularTracks, searchTracks as apiSearchTracks } from "./jamendoApiClient";

// Sample data for initial/fallback loading
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
        previewUrl: "https://cdn.jamendo.com/track/1339919/mp32/",
        duration: 187
      },
      {
        id: "1-2",
        title: "Demons",
        artist: "Imagine Dragons",
        album: "Night Visions",
        albumCover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
        previewUrl: "https://cdn.jamendo.com/track/1339919/mp32/",
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
        previewUrl: "https://cdn.jamendo.com/track/1339919/mp32/",
        duration: 210
      },
      {
        id: "2-2",
        title: "Hells Bells",
        artist: "AC/DC",
        album: "Back in Black",
        albumCover: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
        previewUrl: "https://cdn.jamendo.com/track/1339919/mp32/",
        duration: 240
      }
    ]
  }
];

export const getMusicData = async (): Promise<Album[]> => {
  try {
    const albums = await getFeaturedAlbums();
    return albums.length > 0 ? albums : sampleAlbums;
  } catch (error) {
    console.error('Error fetching music data:', error);
    return sampleAlbums;
  }
};

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query) return [];
  
  try {
    const tracks = await apiSearchTracks(query);
    return tracks;
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
