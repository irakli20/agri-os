# Agri-OS

A next-generation farm management platform with AI-driven interface generation for precision agriculture.

## 🌾 Vision

Agri-OS is a "Generative ERP for Agriculture" - a malleable interface where drone pilots and agronomists interact with an AI Agent to dynamically generate dashboards, analytics, and control panels based on immediate context.

## 🚀 Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **UI Framework**: Tailwind CSS, ShadCN UI
- **Geospatial Engine**: Deck.gl (high-performance WebGL rendering)
- **State Management**: Zustand
- **AI Orchestration**: Vercel AI SDK
- **Database**: Supabase (PostgreSQL + PostGIS)

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# - NEXT_PUBLIC_MAPBOX_TOKEN (for basemap tiles)
# - OPENAI_API_KEY (for AI generation)
# - SUPABASE credentials (for database)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🗂️ Project Structure

```
agri-os/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with dark mode
│   ├── page.tsx           # Main canvas interface
│   └── globals.css        # Global styles and theme
├── components/
│   ├── registry/          # Generative Component Registry (AI tools)
│   │   └── MapCanvas.tsx  # Main map component (Deck.gl)
│   └── ui/                # ShadCN UI components
├── lib/
│   ├── utils.ts           # cn() utility for class merging
│   └── map-store.ts       # Zustand store for map state
├── types/
│   └── index.ts           # TypeScript definitions
└── public/                # Static assets
```

## 🎯 Development Phases

### Phase 1: The Shell ✅ (Current)
- [x] Next.js 14 setup
- [x] Deck.gl map integration
- [x] Dark mode basemap
- [x] Zustand state management
- [x] Component registry structure

### Phase 2: The Eye (Next)
- [ ] MicaSense Tiff ingestion
- [ ] Cloud Optimized GeoTIFF (COG) rendering
- [ ] NDVI/NDRE layer visualization
- [ ] Multispectral band switching

### Phase 3: The Brain
- [ ] Vercel AI SDK integration
- [ ] Natural language command bar (Cmd+K)
- [ ] Chat-to-UI generation loop
- [ ] Component registry AI tools

### Phase 4: The Reach
- [ ] Syngenta Cropwise API integration
- [ ] Growth stage modeling
- [ ] Weather data integration
- [ ] VRA (Variable Rate Application) tools

## 🧩 Generative Component Registry

The AI doesn't write code from scratch - it selects from a registry of "Smart Components":

- `<SpectrumSlider />` - Toggle Altum layers (RGB, NIR, Thermal)
- `<SprayCalculator />` - Dynamic tank mixing calculator
- `<WeatherCard />` - Wind/drift risk visualization
- `<GrowthStageBar />` - Cropwise growth stage data
- `<MissionEditor />` - Polygon boundary editor

## 🎨 Design Philosophy

**Malleability**: The interface adapts to unique workflows by generating custom UI on the fly.

**Domain Awareness**: Built for expert drone pilots who understand NDVI, VRA, and spray logistics.

**Performance**: Deck.gl handles heavy agronomic data (multispectral TIFFs) that would overwhelm traditional mapping libraries.

## 📝 License

Proprietary - Agri-OS Platform

---

Built with ❤️ for precision agriculture
```
