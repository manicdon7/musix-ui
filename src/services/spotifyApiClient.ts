
import { Track, Album } from "@/types/music";
import { toast } from "@/components/ui/use-toast";

// Spotify API URLs
const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";

// Spotify API token management
let accessToken: string | null = localStorage.getItem('spotify_access_token');
let tokenExpiry: number = parseInt(localStorage.getItem('spotify_token_expiry') || '0');

// Initialize with your token
const API_TOKEN = "BQD6Efa6-_k2o1l8dmLYGNvqwUqbWLSmgnrKZbLU_V98Pyyt8YqywsyQpLIAiBn6ZtPiCoH1NyoZzd70gHalUNXR1whDm73CqW2N8NzA4SFM-yz6xdtAXbkon8md7XPXWXzFQMYfLGijwoCOqOn9ifIYxfDriHGSBg_w8c7ZbHWgfU-6iKgcA6o-gYPqLozhXcZh9dBP-4vOghJDAgyZodSdi5F0XykqlI0cwitJLs2D6bEZhGN6nf3jVmq9fh58KLDmrUwWXkdmbdEzu9Drm8M6kFWoH05-xcoFWnt2avuUxRnsHWf3Kys7166w";

// Set initial token if provided
if (API_TOKEN && !accessToken) {
  accessToken = API_TOKEN;
  // Set expiry to 1 hour from now (typical Spotify token lifetime)
  tokenExpiry = Date.now() + 3600 * 1000;
  localStorage.setItem('spotify_access_token', accessToken);
  localStorage.setItem('spotify_token_expiry', tokenExpiry.toString());
}

// Helper function for API requests
const spotifyFetch = async (endpoint: string, options: RequestInit = {}) => {
  if (!accessToken || Date.now() > tokenExpiry) {
    // Token expired or not set
    toast({
      title: "Spotify Authentication Error",
      description: "Your Spotify session has expired. Please refresh the page.",
      variant: "destructive",
    });
    throw new Error("Spotify token expired or not available");
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
