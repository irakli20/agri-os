# Agri-OS

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss&logoColor=white)
![Deck.gl](https://img.shields.io/badge/Deck.gl-9-7c3aed)
![Mapbox GL](https://img.shields.io/badge/Mapbox_GL-3-000000?logo=mapbox)
![Three.js](https://img.shields.io/badge/Three.js-0.181-000000?logo=three.js)
![Zustand](https://img.shields.io/badge/Zustand-persisted_state-f59e0b)

Agri-OS is a Next.js 14 farm management platform that combines precision-ag monitoring, turn-based farm strategy simulation, marketplace operations, agronomy intelligence, procurement, finance, scouting, weather, and an autonomous operations orchestrator.

The app is built as an operational cockpit: field health, weekly priorities, weather windows, inventory, service bookings, and automation decisions all flow through one farm management surface.

## 🌾 Feature Grid

| Area | What it does |
| --- | --- |
| 🎮 Strategy Mode | Turn-based farm simulation with weekly advancement, owned/rented fields, crop cycles, XP, levels, reputation, season reset, and fast-forward controls. |
| 🌽 Corn Expert Mode | Detailed corn workflow with BBCH growth stages, corn stage timeline, aerial survey, pre-plant burndown, nutrient and irrigation milestones, and harvest readiness. |
| 🛰️ Field Management | Multispectral field analysis, NDVI health cards, boundary editing, soil testing, scouting, plant counts, harvest logs, and field operation workflows. |
| 🔥 Problem Overlays | SVG heatmap overlays for pest, disease, weed, nutrient, and drought pressure with pulsing hotspots, radial blending, challenge-aware activation, legends, and opacity controls. |
| 🗺️ Geospatial Views | Deck.gl and Mapbox GL maps, editable boundaries, multispectral image layers, and LIDAR-style elevation/crop-height visualization. |
| 🛒 Marketplace | Buy or rent seeded field listings, purchase supplies, browse equipment, and book field services such as plowing, tilling, planting, spraying, harvesting, and irrigation. |
| 📦 Inventory & Procurement | Track chemicals, seeds, fertilizers, tools, spare parts, fuel, warehouse zones, reorder points, supplier quotes, deal alerts, and procurement orders. |
| 🤖 Orchestrator Engine | Autonomous decision engine with priority scoring, approval/decline flows, action lifecycle tracking, audit events, KPI snapshots, incident controls, and emergency stop. |
| 🧠 Agronomy Intelligence | Pest, disease, and weed pressure analysis with disease triangle logic, economic thresholds, treatment recommendations, soil health signals, and predictive analytics. |
| 🥾 Scouting System | Schedule missions, run quick scouts, upload imagery, perform multispectral drone surveys, track plant counts, and review scouting history. |
| 🌦️ Weather System | Weekly generated weather, 24-hour forecasts, spray windows, fieldwork/harvest windows, alerts, wind and precipitation operation impacts, and drought prediction. |
| 💰 Finance & Review | Transaction history, budgets, payment workflows, season review, yield/cost/timing attribution, model tuning, and economic benchmarking. |

## 🎮 Strategy Mode

Strategy Mode turns farm management into a week-by-week operating simulation. Players start with working capital, buy or rent fields from the marketplace, prepare land, plant crops, respond to seasonal risks, and advance the calendar through Spring, Summer, Autumn, and Winter.

Key mechanics include:

- Weekly planning with generated weather and fieldwork, spray, and harvest windows.
- Weekly challenge priorities across pests, disease, weeds, nutrients, and weather stress.
- Crop cycle progression from scouting and soil testing through tillage, planting, growth, harvest, and post-harvest work.
- Corn Expert Mode with BBCH stages from sowing through physiological maturity.
- Automation toggles for auto-procurement, auto-booking, auto-irrigation, and auto-field operations.
- XP rewards, level progression, reputation, equipment maintenance, operator capacity, season reset, and fast-forward controls.

## 🛰️ Field Management

Field pages combine agronomic monitoring with practical operations.

- Switch between RGB, NDVI, NDRE, GNDVI, SAVI, and thermal imagery.
- Compare layers with an image comparison slider.
- View NDVI-derived health scores and status cards.
- Edit field boundaries with Mapbox GL and Turf-powered area calculations.
- Track soil samples, management zones, and soil testing workflows.
- Schedule scouting, log quick observations, upload images, run drone survey reports, and record plant counts.
- Log harvest outcomes and connect field state to Strategy Mode operations.
- Inspect LIDAR-style elevation, absolute elevation, and crop-height overlays.

## 🔥 Field Problem Overlay System

Agri-OS renders problem pressure directly over existing multispectral field images using generated SVG overlays.

Supported overlays:

- Pest infestation
- Disease spread
- Weed pressure
- Nutrient deficiency
- Drought stress

The overlay generator creates deterministic hotspot patterns per field, applies radial gradient blending, animates pulsing hotspots, boosts severity for active weekly challenges, and exposes field-page opacity controls and a color legend.

## 🛒 Marketplace

The marketplace supports the farm economy and operational workflow:

- 15 seeded field listings with buy/rent pricing, size, soil type, water source, elevation, rainfall, category, and corn suitability metadata.
- Farm supplies including seeds, fertilizers, chemicals, and fuel.
- Equipment and machinery browsing.
- Service booking for plowing, tilling, planting, spraying, harvesting, irrigation, aerial surveys, residue management, and fertilizer application.
- Strategy Mode integration so purchases, rentals, inputs, and services affect cash, fields, and weekly challenge completion.

## 📦 Inventory, Procurement & Finance

Agri-OS includes business operations beyond the map.

- Inventory tracking for chemicals, seeds, fertilizers, tools, spare parts, and fuel.
- Warehouse zone monitoring with capacity, temperature, humidity, status, reorder points, expiry dates, and batch numbers.
- Supplier management, price quotes, bulk discounts, deal alerts, and procurement order creation.
- Finance dashboards with available balance, expenses, cash flow, projected spend, budgets, payment controls, and transaction history.

## 🤖 Orchestrator Engine

The orchestrator is the autonomous operating layer for farm decisions.

- Manual, assisted, and fully automated modes.
- Decision queue with confidence, priority scoring, ROI, evidence, risks, dependencies, and approval controls.
- Action lifecycle tracking, overrides, contingency plans, and audit logging.
- KPI snapshots for field performance and operational outcomes.
- Digital twin sync status, sensor status, drift reporting, and calibration metadata.
- Incident management with emergency-stop and release controls.
- Season review with yield, cost, timing, avoided-loss, and economic benchmark attribution.

## 🧠 Agronomy Intelligence

Agronomy modules turn field state into treatment recommendations and risk evidence.

- Disease triangle calculations for host, pathogen, and environment pressure.
- Weather-triggered disease and pest risk analysis.
- Pest, disease, and weed pressure observations.
- Economic threshold evaluation and treatment justification.
- Product recommendations with active ingredients, rates, cost, efficacy, resistance risk, environmental impact, timing, and condition guidance.
- Soil health and predictive analytics surfaces for compaction, moisture, nutrients, and operational risk.

## 🥾 Scouting System

Scouting workflows are available from field pages and modals.

- Schedule scouting missions and multispectral drone surveys.
- Use quick scout reports for pest, disease, weed, irrigation, equipment, and other observations.
- Upload scouting imagery.
- Track plant counts and BBCH/crop-stage observations.
- Review scouting history by field.

## 🌦️ Weather System

Weather drives both operational planning and simulation pressure.

- Weekly weather generation in Strategy Mode.
- Fieldwork, spray, and harvest window flags.
- 24-hour forecast table with wind, humidity, precipitation, UV index, and spray scores.
- Weather alerts and alert configuration.
- Drought prediction and precipitation/wind impact on operations.

## 🧰 Tech Stack

- **Framework**: Next.js 14 App Router, React 18, TypeScript
- **Styling**: Tailwind CSS, custom app shell, responsive dashboard components
- **Maps**: Deck.gl, Mapbox GL, Turf
- **3D**: Three.js, React Three Fiber, Drei
- **State**: Zustand with localStorage persistence
- **UI**: Lucide React icons, Radix Slot, reusable modal and dashboard components
- **Geospatial/Imagery**: loaders.gl GeoTIFF packages, SVG heatmap rendering, multispectral image layers
- **APIs**: Next.js route handlers for orchestrator, decisions, actions, incidents, audit, KPI, review, model tuning, sensors, twin sync, benchmarking, and agronomy recommendations

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional environment variables:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_UNLIMITED_TEST_FUNDS=true
```

`NEXT_PUBLIC_MAPBOX_TOKEN` enables Mapbox basemap and boundary editing. `NEXT_PUBLIC_UNLIMITED_TEST_FUNDS=true` is useful for testing Strategy Mode purchases and service bookings without cash constraints.

## 📜 Scripts

```bash
npm run dev        # Start the local development server
npm run build      # Build the production app
npm run start      # Serve the production build
npm run lint       # Run Next.js linting
npm run test:smoke # Run the smoke test script
```

## 🗂️ Project Structure

```text
app/                         Next.js App Router pages and API routes
app/game/                    Strategy Mode dashboard, fields, and marketplace
app/api/                     Orchestrator, agronomy, review, KPI, incident, and sensor APIs
components/game/             Strategy Mode controls, corn timeline, coach, and game shell
components/modals/           Operational workflows for scouting, booking, procurement, soil tests, reports, and harvests
components/orchestrator/     Decision queue, control panel, metrics, sensors, timeline, and twin status
components/registry/         Map, field health, weather, fleet, task, and 3D viewer cards
lib/                         Stores, simulation logic, agronomy data, marketplace data, overlays, weather, and orchestrator modules
types/                       Shared TypeScript domain types
```

## 📝 License

Proprietary - Agri-OS Platform
