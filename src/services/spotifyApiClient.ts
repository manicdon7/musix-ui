
import { Track, Album } from "@/types/music";
import { toast } from "@/components/ui/use-toast";

// Spotify API URLs
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";

// Spotify API token management
let accessToken: string | null = localStorage.getItem('spotify_access_token');
let tokenExpiry: number = parseInt(localStorage.getItem('spotify_token_expiry') || '0');

// Initialize with your credentials
const CLIENT_ID = "";
const CLIENT_SECRET = "";

// Use the provided token
const API_TOKEN = "";

// Set initial token
if (API_TOKEN && !accessToken) {
  accessToken = API_TOKEN;
  // Set expiry to 1 hour from now (Spotify token lifetime)
  tokenExpiry = Date.now() + 3600 * 1000;
  localStorage.setItem('spotify_access_token', accessToken);
  localStorage.setItem('spotify_token_expiry', tokenExpiry.toString());
}

// Helper function to refresh token using client credentials
const refreshToken = async () => {
  try {
    const response = await fetch(SPOTIFY_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;
    
    // Store token in localStorage
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_token_expiry', tokenExpiry.toString());
    
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Helper function for API requests
const spotifyFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Check if token is expired
  if (!accessToken || Date.now() > tokenExpiry) {
    try {
      // Try to refresh the token
      await refreshToken();
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Could not authenticate with Spotify.",
        variant: "destructive",
      });
      throw new Error("Authentication failed");
    }
  }

  const response = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    accessToken = null;
    toast({
      title: "Spotify Authentication Error",
      description: "Your session has expired. Please refresh the page.",
      variant: "destructive",
    });
    throw new Error("Spotify token expired");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Spotify API error: ${response.status} ${errorData.error?.message || response.statusText}`);
  }

  return await response.json();
};

// Map Spotify track to our Track model
const mapSpotifyTrack = (track: any): Track => ({
  id: track.id,
  title: track.name,
  artist: track.artists.map((artist: any) => artist.name).join(", "),
  album: track.album?.name || "Unknown Album",
  albumCover: track.album?.images[0]?.url || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500&fit=crop",
  previewUrl: track.preview_url || "",
  duration: Math.round(track.duration_ms / 1000),
  artistId: track.artists[0]?.id,
  artistImageUrl: null,
});

// Map Spotify album to our Album model
const mapSpotifyAlbum = (album: any, tracks: Track[] = []): Album => ({
  id: album.id,
  name: album.name,
  artist: album.artists.map((artist: any) => artist.name).join(", "),
  coverUrl: album.images[0]?.url || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&h=500&fit=crop",
  tracks: tracks,
  releaseDate: album.release_date,
  genre: album.genres?.[0],
});

// Get featured playlists/albums from Spotify
export const getFeaturedAlbums = async (): Promise<Album[]> => {
  try {
    // Get new releases
    const newReleasesResponse = await spotifyFetch("/browse/new-releases?limit=10");
    
    // For each album, get its tracks
    const albums = await Promise.all(
      newReleasesResponse.albums.items.map(async (album: any) => {
        const tracksResponse = await spotifyFetch(`/albums/${album.id}/tracks?limit=20`);
        
        // For each track, get full track details
        const trackPromises = tracksResponse.items.map(async (item: any) => {
          try {
            const trackResponse = await spotifyFetch(`/tracks/${item.id}`);
            return mapSpotifyTrack(trackResponse);
          } catch (error) {
            console.error("Error fetching track details:", error);
            // Create a minimal track with available data
            return {
              id: item.id,
              title: item.name,
              artist: item.artists.map((artist: any) => artist.name).join(", "),
              album: album.name,
              albumCover: album.images[0]?.url,
              previewUrl: item.preview_url || "",
              duration: Math.round(item.duration_ms / 1000) || 30,
            } as Track;
          }
        });
        
        const tracks = await Promise.all(trackPromises);
        return mapSpotifyAlbum(album, tracks);
      })
    );
    
    return albums.filter(album => album.tracks.length > 0);
  } catch (error) {
    console.error("Error fetching featured albums:", error);
    throw error;
  }
};

// Get popular tracks from Spotify
export const getPopularTracks = async (): Promise<Track[]> => {
  try {
    // Get top tracks from several playlists
    const playlistResponse = await spotifyFetch("/browse/featured-playlists?limit=2");
    const playlist = playlistResponse.playlists.items[0];
    
    if (!playlist) {
      throw new Error("No playlists found");
    }
    
    const tracksResponse = await spotifyFetch(`/playlists/${playlist.id}/tracks?limit=25`);
    
    // Map tracks
    const tracks = tracksResponse.items
      .filter((item: any) => item.track && item.track.preview_url)
      .map((item: any) => mapSpotifyTrack(item.track));
    
    return tracks;
  } catch (error) {
    console.error("Error fetching popular tracks:", error);
    throw error;
  }
};

// Search for tracks
export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query) return [];
  
  try {
    const response = await spotifyFetch(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
    
    if (!response.tracks || !Array.isArray(response.tracks.items)) {
      return [];
    }
    
    return response.tracks.items
      .filter(track => track.preview_url) // Only include tracks with preview URLs
      .map(mapSpotifyTrack);
  } catch (error) {
    console.error("Error searching tracks:", error);
    throw error;
  }
};

// Get albums by an artist
export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
  try {
    const albumsResponse = await spotifyFetch(`/artists/${artistId}/albums?include_groups=album&limit=10`);
    
    if (!albumsResponse.items || !Array.isArray(albumsResponse.items)) {
      return [];
    }
    
    // For each album, get its tracks
    const albums = await Promise.all(
      albumsResponse.items.map(async (album: any) => {
        const tracksResponse = await spotifyFetch(`/albums/${album.id}/tracks?limit=20`);
        
        // For each track, get full track details to get preview_url
        const tracks = await Promise.all(
          tracksResponse.items.map(async (item: any) => {
            try {
              const trackResponse = await spotifyFetch(`/tracks/${item.id}`);
              return mapSpotifyTrack(trackResponse);
            } catch (error) {
              // Return minimal track data if full details fail
              return {
                id: item.id,
                title: item.name,
                artist: item.artists.map((artist: any) => artist.name).join(", "),
                album: album.name,
                albumCover: album.images[0]?.url,
                previewUrl: "",
                duration: Math.round(item.duration_ms / 1000) || 30,
              } as Track;
            }
          })
        );
        
        // Only include tracks with preview URLs
        const validTracks = tracks.filter(track => track.previewUrl);
        
        return mapSpotifyAlbum(album, validTracks);
      })
    );
    
    // Only return albums with playable tracks
    return albums.filter(album => album.tracks.length > 0);
  } catch (error) {
    console.error("Error fetching artist albums:", error);
    throw error;
  }
};
