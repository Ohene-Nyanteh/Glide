# Glide

Glide is a modern, full-featured **music streaming and playback platform** built with performance and flexibility in mind.  
It provides a beautiful, responsive UI with **real-time lyrics synchronization**, **intelligent audio management**, and **smooth playback transitions** powered by the **Flow** Management engine.

---

## Features

- **Dynamic Lyrics Synchronization**  
  Displays lyrics in perfect sync with the current playback, with support for staggered timing, karaoke-style highlighting, and smooth animations.

- **Flow Audio Engine Integration**  
  Uses the custom-built [Flow](https://www.npmjs.com/package/flow) package for precise audio management.  
  Flow provides robust APIs for controlling playback, managing states, events, and custom transitions.

- **Full Media Controls**  
  Seamlessly control playback with play, pause, skip, loop, shuffle, seek, and volume adjustments.  
  Supports both keyboard shortcuts and mobile touch gestures.

- **Smart Queues & Playlists**  
  Create and manage playlists with queue support, autoplay behavior, and persistent playback state.

- **Modern UI/UX**  
  Built with React and Tailwind CSS for a fast, fluid, and visually appealing experience.  
  Dark mode and responsive layouts are fully supported.

- **Crossfade & Transitions**  
  Enjoy smooth transitions between songs using Flow’s crossfade engine for a professional playback feel.

- **Offline Caching (optional)**  
  Cache tracks locally for uninterrupted playback even without an internet connection.

---

## Tech Stack

- **Frontend:** React-Native, Nativewind, expo
- **Audio Engine:** [Flow](https://www.npmjs.com/package/@ohene/flow-player)  
- **Backend (optional):** Node.js / Next.js API routes  
- **Build Tools:** Expo

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ohene-Nyanteh/Glide.git
cd glide
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

---

## Project Structure

```
glide/
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks for player state
│   ├── context/        # Player and lyric contexts
│   ├── app/          # Main app views
│   ├── utils/          # Helper functions
├── public/             # Assets and static files
├── package.json
└── README.md
```

---

## Roadmap

* [ ] Advanced lyric timing editor
* [ ] Visualizer / waveform support
* [ ] Streaming from custom APIs
* [ ] Collaborative playlists

---

## Contributing

Contributions, feedback, and feature suggestions are welcome!
Please open an issue or submit a pull request if you’d like to help improve Glide.

---

## License

This project is licensed under the **MIT License**.

---

**Built with passion.**
