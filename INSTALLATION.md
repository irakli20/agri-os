# Agri-OS Installation & Setup Commands

## Prerequisites

Ensure you have Node.js 18+ installed:
```bash
node --version  # Should be v18.0.0 or higher
```

If not installed, download from: https://nodejs.org/

## Installation Steps

### 1. Navigate to Project Directory
```bash
cd /Users/macbookpro/agri-os/agri-os
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14.2.0
- React 18.3.0
- Deck.gl 9.0.0 (geospatial rendering)
- Zustand 4.5.0 (state management)
- Vercel AI SDK 3.0.0
- ShadCN UI dependencies (class-variance-authority, clsx, tailwind-merge)
- TypeScript and Tailwind CSS

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your API keys:
- **NEXT_PUBLIC_MAPBOX_TOKEN**: Get from https://account.mapbox.com/access-tokens/
- **OPENAI_API_KEY**: For AI generation (Phase 3)
- **SUPABASE credentials**: For database (Phase 2+)

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 5. Build for Production (Optional)
```bash
npm run build
npm start
```

## Verification

After running `npm run dev`, you should see:
- ✅ Dark mode interface
- ✅ Strategy Mode pages with weekly planner and guided assistant
- ✅ Marketplace routes for fields/supplies/services/equipment
- ✅ Field-stage workflow from scouting through harvest in planner loop

## Current Test Mode Notes

- Unlimited funds mode is enabled in `lib/game-store.ts` (`UNLIMITED_TEST_FUNDS = true`) for QA flow testing.
- Use **Reset Season** in Strategy header to restart from:
  - no owned/rented fields
  - Year 1, Spring, Week 1
  - fresh marketplace acquisition loop

## Next Steps

### Phase 2: Add Multispectral Imagery
1. Prepare MicaSense Altum TIFFs as Cloud Optimized GeoTIFFs (COG)
2. Implement NDVI layer rendering
3. Add band switching controls

### Phase 3: AI Integration
1. Implement natural language command bar (Cmd+K)
2. Connect Vercel AI SDK for generative UI
3. Build chat-to-UI generation loop

### Phase 4: External Integrations
1. Connect Syngenta Cropwise API
2. Add weather data integration
3. Implement VRA tools

## Troubleshooting

### Deck.gl Build Errors
If you encounter Deck.gl transpilation errors, ensure `next.config.js` has the correct webpack aliases.

### Dark Mode Not Working
Verify that `app/layout.tsx` has `className="dark"` on the `<html>` tag.

### Map Not Rendering
Check browser console for WebGL errors. Deck.gl requires WebGL 2.0 support.

## Project Structure Reference

```
agri-os/
├── app/
│   ├── layout.tsx          # Root layout (dark mode)
│   ├── page.tsx            # Main canvas interface
│   └── globals.css         # Theme variables
├── components/
│   ├── registry/
│   │   ├── index.ts        # Component registry
│   │   └── MapCanvas.tsx   # Deck.gl map
│   └── ui/                 # ShadCN components (future)
├── lib/
│   ├── utils.ts            # cn() utility
│   └── map-store.ts        # Zustand store
├── types/
│   └── index.ts            # TypeScript definitions
└── package.json
```

---

**Built for**: Expert drone pilots and agronomists  
**Optimized for**: MicaSense Altum multispectral imagery  
**Performance**: Deck.gl WebGL rendering (not Leaflet)
