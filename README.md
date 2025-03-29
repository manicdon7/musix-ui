# Musix - Modern Music Player Application

![Musix](https://res.cloudinary.com/dvgpzftnf/image/upload/v1743258242/Screenshot_2025-03-29_195335_uddzyl.png)

## Overview

Musix is a modern, feature-rich music player application built with React and TypeScript. It offers a sleek UI with smooth animations, designed to provide an immersive music listening experience with a professional international theme.

## Features

- **Beautiful UI with Animations**: Modern design with smooth transitions and interactive elements powered by Framer Motion
- **Multiple Pages**:
  - **Home**: Featured albums and recently played tracks
  - **Discover**: Explore music by genre with curated recommendations
  - **Library**: Access your playlists and favorite albums
  - **Album View**: Detailed album information with tracklist
- **Music Player Controls**: Play, pause, skip tracks, and control volume
- **Search Functionality**: Search for tracks and albums with instant results
- **Playlist Management**: Browse and play from curated playlists
- **Favorites System**: Save your favorite albums for easy access
- **Responsive Design**: Works well on desktop and mobile devices

## Technologies Used

- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe JavaScript for better development experience
- **React**: UI library for building component-based interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Animation library for creating fluid transitions
- **shadcn/ui**: High-quality UI components
- **React Router**: Navigation and routing

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <https://github.com/manicdon7/musix-ui>

# Step 2: Navigate to the project directory
cd musix-ui

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server
npm run dev
```

## Usage

Once the development server is running, you can access the application at `http://localhost:8080`. Navigate through the different pages to explore all features:

- Use the search bar to find specific songs or artists
- Browse genres in the Discover page
- Check out your playlists in the Library page
- Click on albums to view their details and tracks
- Play tracks and control playback with the player controls at the bottom

## Project Structure

- **src/components/**: Reusable UI components
- **src/pages/**: Main application pages
- **src/services/**: API services and music data management
- **src/context/**: React context providers for state management
- **src/types/**: TypeScript type definitions
- **src/utils/**: Utility functions

## Customization

You can customize various aspects of the application:

- Edit the theme colors in `tailwind.config.ts`
- Add or modify albums in `src/services/musicService.ts`
- Create new playlists in the `samplePlaylists` array
- Change icons by modifying the Lucide icon imports

## Deployment

To deploy this project, you can use any static site hosting service like Netlify, Vercel, or GitHub Pages.

## Credits

- Music data structure inspired by Spotify API
- UI design influenced by modern streaming platforms
- Sample album covers from Unsplash

## License

This project is available for personal and commercial use.

---

Created with ❤️ by https://github.com/manicdon7
