
import { ApiResponse, Track, Album } from "@/types/music";

// Use Jamendo API
const JAMENDO_API_URL = "https://api.jamendo.com/v3.0";
const CLIENT_ID = "9214814"; // This is a public API client ID for demo purposes

// Helper function to handle API responses
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

// Map Jamendo track to our Track model
const mapJamendoTrack = (track: any): Track => ({
  id: track.id,
  title: track.name,
  artist: track.artist_name,
  album: track.album_name || "Unknown Album",
  albumCover: track.album_image || track.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500&fit=crop",
  previewUrl: track.audio || track.audiodownload || "",
  duration: track.duration || 0,
  artistId: track.artist_id,
  artistImageUrl: track.artist_image
});

// Get popular tracks
export const getPopularTracks = async (): Promise<Track[]> => {
  try {
    const response = await fetch(
      `${JAMENDO_API_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=25&boost=popularity&include=musicinfo&imagesize=300`
    );
    
    const data = await handleApiResponse(response);
    
    if (!data.results || !Array.isArray(data.results)) {
      console.error("Invalid API response format:", data);
      return [];
    }
    
    return data.results.map(mapJamendoTrack);
  } catch (error) {
    console.error("Error fetching popular tracks:", error);
    return [];
  }
};

// Search for tracks
export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(
      `${JAMENDO_API_URL}/tracks/?client_id=${CLIENT_ID}&format=json&limit=20&namesearch=${encodeURIComponent(query)}&include=musicinfo&imagesize=300`
    );
    
    const data = await handleApiResponse(response);
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    return data.results.map(mapJamendoTrack);
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
};

// Get albums by an artist
export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
  try {
    const response = await fetch(
      `${JAMENDO_API_URL}/artists/albums/?client_id=${CLIENT_ID}&format=json&artist_id=${artistId}&imagesize=300`
    );
    
    const data = await handleApiResponse(response);
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    // For each album, fetch its tracks
    const albums = await Promise.all(
      data.results.map(async (album: any) => {
        const tracksResponse = await fetch(
          `${JAMENDO_API_URL}/albums/tracks/?client_id=${CLIENT_ID}&format=json&album_id=${album.id}&imagesize=300`
        );
        
        const tracksData = await handleApiResponse(tracksResponse);
        const tracks: Track[] = tracksData.results?.[0]?.tracks?.map(mapJamendoTrack) || [];
        
        return {
          id: album.id,
          name: album.name,
          artist: album.artist_name,
          coverUrl: album.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500&fit=crop",
          tracks: tracks,
          releaseDate: album.releasedate,
          genre: album.genres?.[0]?.name
        };
      })
    );
    
    return albums;
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    return [];
  }
};

// Get featured playlists/albums
export const getFeaturedAlbums = async (): Promise<Album[]> => {
  try {
    const response = await fetch(
      `${JAMENDO_API_URL}/albums/?client_id=${CLIENT_ID}&format=json&limit=10&imagesize=300&boost=popularity`
    );
    
    const data = await handleApiResponse(response);
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    // For each album, get its tracks
    const albums = await Promise.all(
      data.results.map(async (album: any) => {
        const tracksResponse = await fetch(
          `${JAMENDO_API_URL}/albums/tracks/?client_id=${CLIENT_ID}&format=json&album_id=${album.id}&imagesize=300`
        );
        
        const tracksData = await handleApiResponse(tracksResponse);
        const tracks: Track[] = tracksData.results?.[0]?.tracks?.map(mapJamendoTrack) || [];
        
        return {
          id: album.id,
          name: album.name,
          artist: album.artist_name,
          coverUrl: album.image || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500&fit=crop",
          tracks: tracks,
          releaseDate: album.releasedate,
          genre: album.genres?.[0]?.name
        };
      })
    );
    
    return albums;
  } catch (error) {
    console.error("Error fetching featured albums:", error);
    return [];
  }
};
