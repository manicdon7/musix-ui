import { Track, Album } from "@/types/music";
import { getFeaturedAlbums, getPopularTracks, searchTracks as apiSearchTracks } from "./spotifyApiClient";
import { toast } from "@/components/ui/use-toast";

// Sample data for initial/fallback loading
const sampleAlbums: Album[] = [
  {
    id: "1",
    name: "Night Visions",
    artist: "Imagine Dragons",
    coverUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
    genre: "Alternative Rock",
    releaseDate: "2012-09-04",
    tracks: [
      {
        id: "1-1",
        title: "Radioactive",
        artist: "Imagine Dragons",
        album: "Night Visions",
        albumCover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/6de49836f503672c7732b9defa3933e445651e9c",
        duration: 187,
        artistId: "53XhwfbYqKCa1cC15pYq2q"
      },
      {
        id: "1-2",
        title: "Demons",
        artist: "Imagine Dragons",
        album: "Night Visions",
        albumCover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/6de49836f503672c7732b9defa3933e445651e9c",
        duration: 175,
        artistId: "53XhwfbYqKCa1cC15pYq2q"
      },
      {
        id: "1-3",
        title: "On Top Of The World",
        artist: "Imagine Dragons",
        album: "Night Visions",
        albumCover: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/6de49836f503672c7732b9defa3933e445651e9c",
        duration: 192,
        artistId: "53XhwfbYqKCa1cC15pYq2q"
      }
    ]
  },
  {
    id: "2",
    name: "Back in Black",
    artist: "AC/DC",
    coverUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
    genre: "Hard Rock",
    releaseDate: "1980-07-25",
    tracks: [
      {
        id: "2-1",
        title: "Back in Black",
        artist: "AC/DC",
        album: "Back in Black",
        albumCover: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/9ced9f5ab2d9f9d6d996a8c394cfc651f8654ec8",
        duration: 210,
        artistId: "711MCceyCBcFnzjGY4Q7Un"
      },
      {
        id: "2-2",
        title: "Hells Bells",
        artist: "AC/DC",
        album: "Back in Black",
        albumCover: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/9ced9f5ab2d9f9d6d996a8c394cfc651f8654ec8",
        duration: 240,
        artistId: "711MCceyCBcFnzjGY4Q7Un"
      },
      {
        id: "2-3",
        title: "You Shook Me All Night Long",
        artist: "AC/DC",
        album: "Back in Black",
        albumCover: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/9ced9f5ab2d9f9d6d996a8c394cfc651f8654ec8",
        duration: 214,
        artistId: "711MCceyCBcFnzjGY4Q7Un"
      }
    ]
  },
  {
    id: "3",
    name: "Random Access Memories",
    artist: "Daft Punk",
    coverUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&h=500&fit=crop",
    genre: "Electronic",
    releaseDate: "2013-05-17",
    tracks: [
      {
        id: "3-1",
        title: "Get Lucky",
        artist: "Daft Punk ft. Pharrell Williams",
        album: "Random Access Memories",
        albumCover: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/d95e233201bcd8d5845ba70e410bcdd12238a6f7",
        duration: 248,
        artistId: "4tZwfgrHOc3mvqYlEYSvVi"
      },
      {
        id: "3-2",
        title: "Instant Crush",
        artist: "Daft Punk ft. Julian Casablancas",
        album: "Random Access Memories",
        albumCover: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/d95e233201bcd8d5845ba70e410bcdd12238a6f7",
        duration: 321,
        artistId: "4tZwfgrHOc3mvqYlEYSvVi"
      },
      {
        id: "3-3",
        title: "Lose Yourself to Dance",
        artist: "Daft Punk ft. Pharrell Williams",
        album: "Random Access Memories",
        albumCover: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/d95e233201bcd8d5845ba70e410bcdd12238a6f7",
        duration: 353,
        artistId: "4tZwfgrHOc3mvqYlEYSvVi"
      }
    ]
  },
  {
    id: "4",
    name: "Future Nostalgia",
    artist: "Dua Lipa",
    coverUrl: "https://images.unsplash.com/photo-1624914023671-a5a3a3d0a2a8?w=500&h=500&fit=crop",
    genre: "Pop",
    releaseDate: "2020-03-27",
    tracks: [
      {
        id: "4-1",
        title: "Don't Start Now",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        albumCover: "https://images.unsplash.com/photo-1624914023671-a5a3a3d0a2a8?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/3ebca6eeb51243388b52e8d2108621cf5455b6b2",
        duration: 183,
        artistId: "6M2wZ9GZgrQXHCFfjv46we"
      },
      {
        id: "4-2",
        title: "Physical",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        albumCover: "https://images.unsplash.com/photo-1624914023671-a5a3a3d0a2a8?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/3ebca6eeb51243388b52e8d2108621cf5455b6b2",
        duration: 194,
        artistId: "6M2wZ9GZgrQXHCFfjv46we"
      },
      {
        id: "4-3",
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        albumCover: "https://images.unsplash.com/photo-1624914023671-a5a3a3d0a2a8?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/3ebca6eeb51243388b52e8d2108621cf5455b6b2",
        duration: 203,
        artistId: "6M2wZ9GZgrQXHCFfjv46we"
      }
    ]
  },
  {
    id: "5",
    name: "Rumours",
    artist: "Fleetwood Mac",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd847f5a?w=500&h=500&fit=crop",
    genre: "Rock",
    releaseDate: "1977-02-04",
    tracks: [
      {
        id: "5-1",
        title: "Dreams",
        artist: "Fleetwood Mac",
        album: "Rumours",
        albumCover: "https://images.unsplash.com/photo-1614613535308-eb5fbd847f5a?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/834bc2f8a98e7194114d0d59b5e7cc9e9ce67ec0",
        duration: 254,
        artistId: "08GQAI4eElDnROBrJRGE0X"
      },
      {
        id: "5-2",
        title: "Go Your Own Way",
        artist: "Fleetwood Mac",
        album: "Rumours",
        albumCover: "https://images.unsplash.com/photo-1614613535308-eb5fbd847f5a?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/834bc2f8a98e7194114d0d59b5e7cc9e9ce67ec0",
        duration: 223,
        artistId: "08GQAI4eElDnROBrJRGE0X"
      },
      {
        id: "5-3",
        title: "The Chain",
        artist: "Fleetwood Mac",
        album: "Rumours",
        albumCover: "https://images.unsplash.com/photo-1614613535308-eb5fbd847f5a?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/834bc2f8a98e7194114d0d59b5e7cc9e9ce67ec0",
        duration: 267,
        artistId: "08GQAI4eElDnROBrJRGE0X"
      }
    ]
  },
  {
    id: "6",
    name: "To Pimp a Butterfly",
    artist: "Kendrick Lamar",
    coverUrl: "https://images.unsplash.com/photo-1558584673-c834fb1cc3d1?w=500&h=500&fit=crop",
    genre: "Hip-Hop",
    releaseDate: "2015-03-15",
    tracks: [
      {
        id: "6-1",
        title: "Alright",
        artist: "Kendrick Lamar",
        album: "To Pimp a Butterfly",
        albumCover: "https://images.unsplash.com/photo-1558584673-c834fb1cc3d1?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/f95e0dba1a76b44fa2b52da2bc273d5141997bb4",
        duration: 219,
        artistId: "2YZyLoL8N0Wb9xBt1NhZWg"
      },
      {
        id: "6-2",
        title: "King Kunta",
        artist: "Kendrick Lamar",
        album: "To Pimp a Butterfly",
        albumCover: "https://images.unsplash.com/photo-1558584673-c834fb1cc3d1?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/f95e0dba1a76b44fa2b52da2bc273d5141997bb4",
        duration: 214,
        artistId: "2YZyLoL8N0Wb9xBt1NhZWg"
      },
      {
        id: "6-3",
        title: "The Blacker the Berry",
        artist: "Kendrick Lamar",
        album: "To Pimp a Butterfly",
        albumCover: "https://images.unsplash.com/photo-1558584673-c834fb1cc3d1?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/f95e0dba1a76b44fa2b52da2bc273d5141997bb4",
        duration: 335,
        artistId: "2YZyLoL8N0Wb9xBt1NhZWg"
      }
    ]
  },
  {
    id: "7",
    name: "Blue",
    artist: "Joni Mitchell",
    coverUrl: "https://images.unsplash.com/photo-1614846384571-1e053edee56f?w=500&h=500&fit=crop",
    genre: "Folk",
    releaseDate: "1971-06-22",
    tracks: [
      {
        id: "7-1",
        title: "River",
        artist: "Joni Mitchell",
        album: "Blue",
        albumCover: "https://images.unsplash.com/photo-1614846384571-1e053edee56f?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/5a0aa8c7534ace5cf41be23c39a14fd478588f94",
        duration: 245,
        artistId: "5hW4L513tZJa3mnsGwwdo5"
      },
      {
        id: "7-2",
        title: "A Case of You",
        artist: "Joni Mitchell",
        album: "Blue",
        albumCover: "https://images.unsplash.com/photo-1614846384571-1e053edee56f?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/5a0aa8c7534ace5cf41be23c39a14fd478588f94",
        duration: 263,
        artistId: "5hW4L513tZJa3mnsGwwdo5"
      },
      {
        id: "7-3",
        title: "California",
        artist: "Joni Mitchell",
        album: "Blue",
        albumCover: "https://images.unsplash.com/photo-1614846384571-1e053edee56f?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/5a0aa8c7534ace5cf41be23c39a14fd478588f94",
        duration: 231,
        artistId: "5hW4L513tZJa3mnsGwwdo5"
      }
    ]
  },
  {
    id: "8",
    name: "Currents",
    artist: "Tame Impala",
    coverUrl: "https://images.unsplash.com/photo-1633493702341-4d04841df53b?w=500&h=500&fit=crop",
    genre: "Psychedelic Pop",
    releaseDate: "2015-07-17",
    tracks: [
      {
        id: "8-1",
        title: "Let It Happen",
        artist: "Tame Impala",
        album: "Currents",
        albumCover: "https://images.unsplash.com/photo-1633493702341-4d04841df53b?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/05c56f7c54c1372b70e60464c91bca12a8c6c066",
        duration: 467,
        artistId: "5INjqkS1o8h1imAzPqGZBb"
      },
      {
        id: "8-2",
        title: "The Less I Know The Better",
        artist: "Tame Impala",
        album: "Currents",
        albumCover: "https://images.unsplash.com/photo-1633493702341-4d04841df53b?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/05c56f7c54c1372b70e60464c91bca12a8c6c066",
        duration: 216,
        artistId: "5INjqkS1o8h1imAzPqGZBb"
      },
      {
        id: "8-3",
        title: "Eventually",
        artist: "Tame Impala",
        album: "Currents",
        albumCover: "https://images.unsplash.com/photo-1633493702341-4d04841df53b?w=500&h=500&fit=crop",
        previewUrl: "https://p.scdn.co/mp3-preview/05c56f7c54c1372b70e60464c91bca12a8c6c066",
        duration: 321,
        artistId: "5INjqkS1o8h1imAzPqGZBb"
      }
    ]
  }
];

// Sample playlists for the library page
export const samplePlaylists = [
  {
    id: "pl-1",
    name: "Workout Mix",
    description: "High-energy tracks to keep you motivated",
    coverUrl: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=500&h=500&fit=crop",
    trackIds: ["1-1", "2-1", "4-2", "6-1", "8-1"]
  },
  {
    id: "pl-2",
    name: "Chill Vibes",
    description: "Relaxing tunes for unwinding",
    coverUrl: "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?w=500&h=500&fit=crop",
    trackIds: ["3-1", "5-1", "7-2", "8-3"]
  },
  {
    id: "pl-3",
    name: "Classic Rock",
    description: "Timeless rock classics",
    coverUrl: "https://images.unsplash.com/photo-1461784180009-27c1303a64b6?w=500&h=500&fit=crop",
    trackIds: ["2-1", "2-2", "2-3", "5-2", "5-3"]
  },
  {
    id: "pl-4",
    name: "Recent Hits",
    description: "Current top tracks",
    coverUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    trackIds: ["4-1", "4-2", "4-3", "8-2"]
  }
];

// Sample genres for the discover page
export const sampleGenres = [
  {
    id: "g-1",
    name: "Rock",
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&h=500&fit=crop",
    albumIds: ["2", "5"]
  },
  {
    id: "g-2",
    name: "Pop",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop",
    albumIds: ["4"]
  },
  {
    id: "g-3",
    name: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=500&h=500&fit=crop",
    albumIds: ["3"]
  },
  {
    id: "g-4",
    name: "Hip-Hop",
    coverUrl: "https://images.unsplash.com/photo-1485120750507-a3bf477acd63?w=500&h=500&fit=crop",
    albumIds: ["6"]
  },
  {
    id: "g-5",
    name: "Folk",
    coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=500&h=500&fit=crop",
    albumIds: ["7"]
  },
  {
    id: "g-6",
    name: "Alternative",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop",
    albumIds: ["1", "8"]
  }
];

export const getMusicData = async (): Promise<Album[]> => {
  try {
    console.log("Fetching music data from Spotify...");
    const albums = await getFeaturedAlbums();
    console.log("Fetched albums:", albums);
    return albums.length > 0 ? albums : sampleAlbums;
  } catch (error) {
    console.error('Error fetching music data:', error);
    toast({
      title: "Unable to load Spotify data",
      description: "Using sample data instead. Please check your API key.",
      variant: "destructive",
    });
    return sampleAlbums;
  }
};

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!query) return [];
  
  try {
    console.log("Searching for tracks:", query);
    const tracks = await apiSearchTracks(query);
    // Ensure we only return tracks that have preview URLs
    const tracksWithPreviews = tracks.filter(track => track.previewUrl);
    console.log(`Found ${tracksWithPreviews.length} tracks with previews`);
    return tracksWithPreviews;
  } catch (error) {
    console.error('Error searching tracks:', error);
    toast({
      title: "Search Error",
      description: "Unable to search Spotify. Please check your API key.",
      variant: "destructive",
    });
    
    // Fallback to filtering local data
    const allTracks = sampleAlbums.flatMap(album => album.tracks);
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) || 
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
  }
};

// Helper function to get a playlist's tracks
export const getPlaylistTracks = (playlistId: string): Track[] => {
  const playlist = samplePlaylists.find(p => p.id === playlistId);
  if (!playlist) return [];
  
  const allTracks = sampleAlbums.flatMap(album => album.tracks);
  return playlist.trackIds.map(id => allTracks.find(track => track.id === id)!)
    .filter(track => track !== undefined);
};

// Helper function to get albums by genre
export const getGenreAlbums = (genreId: string): Album[] => {
  const genre = sampleGenres.find(g => g.id === genreId);
  if (!genre) return [];
  
  return genre.albumIds.map(id => sampleAlbums.find(album => album.id === id)!)
    .filter(album => album !== undefined);
};
