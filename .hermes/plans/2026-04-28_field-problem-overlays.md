# Field Problem Overlay Visualization Plan (Revised)

**Date**: 2026-04-28
**Goal**: Render pest, disease, weed, nutrient, and drought problem areas as semi-transparent SVG heatmap overlays ON TOP of the existing multispectral field images (rgb, ndvi, ndre, thermal) already shown in the field detail view.

## Key constraint
- NO new generated images — use the EXISTING field image as the background
- Render SVG overlays on top with radial gradient transparency so the field image shows through
- Overlays must match the current active spectral band (rgb/ndvi/ndre/thermal)

## Already exists
- field-overlay-generator.ts: generateHeatmapSVG() produces SVG with radialGradient stop-opacity
- Field images: rgb-field.png, ndvi-field.png, ndre-field.png, thermal-field.png
- Pest/disease data with pressure levels

## Files

NEW:
- components/registry/FieldProblemOverlay.tsx — SVG overlay rendered over field image

MODIFIED:
- app/fields/[id]/page.tsx — wrap field image in container + overlay
