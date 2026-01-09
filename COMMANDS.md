# Agri-OS Terminal Commands

## Initial Setup

### Navigate to Project
```bash
cd /home/iraklisheng/.gemini/antigravity/scratch/agri-os
```

### Install Dependencies
```bash
npm install
```

This installs:
- Next.js 14.2.0
- React 18.3.0
- Deck.gl 9.0.0 (geospatial rendering)
- Zustand 4.5.0 (state management)
- Vercel AI SDK 3.0.0
- ShadCN UI dependencies
- TypeScript and Tailwind CSS

### Configure Environment
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add:
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Get from https://account.mapbox.com/
- `OPENAI_API_KEY` - For AI generation (Phase 3)
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` - For database (Phase 2+)

### Start Development Server
```bash
npm run dev
```

Access at: **http://localhost:3000**

---

## Alternative: Automated Setup

```bash
cd /home/iraklisheng/.gemini/antigravity/scratch/agri-os
./setup.sh
```

This script will:
1. Check Node.js version (requires v18+)
2. Install all dependencies
3. Create `.env.local` from template
4. Display next steps

---

## Build Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
```

### Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint
```

---

## Verification Commands

### Check Installation
```bash
# Verify Node.js version
node --version       # Should be v18.0.0+

# Verify npm version
npm --version

# List installed packages
npm list deck.gl zustand next
```

### Check Project Structure
```bash
# View directory tree
tree -L 3 -I node_modules

# Or using find
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*"
```

### TypeScript Compilation
```bash
# Check for TypeScript errors
npx tsc --noEmit
```

---

## Next Steps

After installation, you should see:
- ✅ Dark mode interface
- ✅ Full-screen map canvas
- ✅ Command bar placeholder
- ✅ Status indicator: "Phase 1: The Shell"

**Ready for Phase 2**: MicaSense Altum TIFF rendering
