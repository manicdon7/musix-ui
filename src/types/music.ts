
export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumCover: string;
  previewUrl: string;
  duration: number;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverUrl: string;
  tracks: Track[];
}
