
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumCover: string;
  previewUrl: string;
  duration: number;
  artistId?: string;
  artistImageUrl?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverUrl: string;
  tracks: Track[];
  releaseDate?: string;
  genre?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  biography?: string;
}

export interface ApiResponse<T> {
  results: T[];
  headers?: {
    'x-ratelimit-remaining'?: string;
    'x-ratelimit-limit'?: string;
  };
  total?: number;
}
