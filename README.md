# 🏛️ AVATAR — Hand Drawing & High-Resolution Master Archive

A clean, responsive fine art exhibition website designed specifically to showcase and distribute a collection of 26 original hand drawings, anime ink studies, wildlife graphite portraits, and mythic character art.

Built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Framer Motion**.

---

## 🎨 Key Features

### 1. High-Resolution One-Click Downloads
- **Direct Card Downloads**: Every drawing card in the gallery grid has a dedicated quick-download button.
- **Master Resolution Downloads**: In the Studio Viewer, visitors can download the full-fidelity original scan/file (`Radha.png`, `DEMON SLAYER.jpg`, `ITACHI UCHIHA.jpg`, etc.) with its original file name preserved.
- **No Paywalls or Pricing**: All commercial prices and dollar figures removed; focused purely on the art and free archival collection.

### 2. Studio Zoom Viewer & 3.0x Texture Loupe
- **Interactive Pan & Zoom**: Smooth 1.0x to 3.5x zoom with mouse wheel and drag-to-pan capabilities.
- **3.0x Optical Loupe Magnifier**: Inspect delicate graphite crosshatching, charcoal tooth, and paper fibers with precision crosshairs.
- **Tone Enhancement Modes**: Toggle between Standard, High Contrast Graphite, Warm Paper, and Monochrome values.
- **Curatorial Metadata**: Title, medium, substrate, physical dimensions, creation hours, availability, and artistic notes.
- **Keyboard Shortcuts**: `Space` to inspect, `+`/`-` to zoom, `0` to reset, `Esc` to close.

### 3. Real-Time Search & Category Filter Bar
- **Instant Search**: Filter all 25 artworks live by title, medium, or tags (e.g. "Dragon", "Radha", "Lion", "Samurai", "Itachi").
- **Category Tabs**: *All Collections*, *Wildlife & Realism*, *Divine & Character*, *Mythic & Anime*, *Samurai & Gestures*.
- **Smooth Pill Animations**: Fluid Framer Motion tab transitions with dynamic item count badges.

### 4. Custom Drawing Commission & Collaboration
- Request bespoke drawing commissions or project collaborations.
- Select preferred drawing scale, framing, and submit reference photos or artistic vision.
- Celebratory gold confetti explosion upon submission.

### 5. Atelier Ambient Soundscape (Self-Contained)
- Procedural audio synthesizer built directly on the **Web Audio API**—no external audio files required.
- Generates gentle pencil sketching textures and warm acoustic studio resonance.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Animation**: Framer Motion
- **Audio**: Web Audio API (Procedural studio ambience synthesizer)
- **Data Architecture**: Decoupled metadata in `src/data/artworksData.js`

---

## 📁 Modular Project Structure

```
ART/
├── public/
│   └── artworks/             # Full resolution original drawings
│       ├── optimized/        # WebP optimized previews for instant loading
│       ├── Radha.png         # Full master scan (46.5 MB)
│       ├── DEMON SLAYER.jpg
│       ├── ITACHI UCHIHA.jpg
│       ├── LION.jpg
│       └── ...
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── ArtworkDetailModal.jsx# Studio Zoom Viewer with pan, zoom & 3x loupe
│   │       ├── CategoryFilter.jsx    # Framer Motion animated category filter bar
│   │       ├── CommissionSection.jsx # Custom drawing request form with confetti
│   │       ├── Footer.jsx            # Atelier credits & Collector's Gazette signup
│   │       ├── GalleryGrid.jsx       # Clean 2D responsive gallery wall with downloads
│   │       ├── Navbar.jsx            # Header, links & audio synthesizer toggle
│   │       └── StudioAudio.jsx       # Web Audio API ambient pencil soundscape
│   ├── data/
│   │   └── artworksData.js           # Decoupled database: 25 artworks, artist & tools
│   ├── utils/
│   │   └── downloadHelper.js         # Reliable blob download utility
│   ├── App.jsx                       # Root layout & state orchestration
│   ├── index.css                     # Dark studio palette, typography & glassmorphism
│   └── main.jsx                      # Vite entry point
├── index.html                        # Google fonts (Cinzel, Cormorant Garamond, Space Grotesk)
├── vite.config.js                    # Vite configuration with Tailwind CSS plugin
├── package.json                      # Dependencies & scripts
└── README.md                         # Documentation
```

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📝 Adding More Drawings
1. Place image files in [`public/artworks/`](file:///C:/Users/avata/ART/public/artworks/).
2. Add an entry in [`src/data/artworksData.js`](file:///C:/Users/avata/ART/src/data/artworksData.js):
```javascript
{
  id: 'art-custom-01',
  title: 'My Custom Drawing',
  category: 'pencil-charcoal',
  categoryName: 'Wildlife & Realism',
  medium: 'Graphite 6B on 300gsm Cold Press Paper',
  dimensions: '42 × 59.4 cm',
  year: '2025',
  image: '/artworks/my-drawing.jpg',
  highResImage: '/artworks/my-drawing.jpg',
  originalFilename: 'my-drawing.jpg',
  accentColor: '#c5a059',
  story: 'Artistic notes and background...',
  technique: 'Crosshatching and stump blending.',
  estimatedHours: '25 hours',
  availability: 'Downloadable Fine Art',
  tags: ['Graphite', 'Realism', 'Original'],
  featured: true
}
```
