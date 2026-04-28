'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useFieldStore } from '@/lib/field-store';
import {
    MULTISPECTRAL_LAYERS,
    SOIL_SAMPLES,
    MANAGEMENT_ZONES,
    FIELD_ANALYSES
} from '@/lib/field-analysis-data';
import {
    ArrowLeft, Layers, MapPin, Droplets, Thermometer,
    AlertTriangle, Download,
    Zap, Target, GitCompare, Bug, Calculator, User, CheckCircle, Edit3, X, Camera, History, Undo2, Trash2, Bot, Gauge, ShieldAlert, ArrowRightCircle, SlidersHorizontal, MoreHorizontal, LayoutGrid, Map as MapIcon, List, FlaskConical, RefreshCw, Leaf, Droplet
} from 'lucide-react';
import { ScoutingHistoryModal } from '@/components/modals/ScoutingHistoryModal';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComparisonSlider } from '@/components/ui/ComparisonSlider';
import { HarvestLogModal } from '@/components/modals/HarvestLogModal';
import { PestDiseaseMonitorModal } from '@/components/modals/PestDiseaseMonitorModal';
import { ScoutingScheduleModal } from '@/components/modals/ScoutingScheduleModal';
import { ScoutingReportModal } from '@/components/modals/ScoutingReportModal';
import { PlantCountModal } from '@/components/modals/PlantCountModal';
import { ImageUploadModal } from '@/components/modals/ImageUploadModal';
import { FieldStatusPanel } from '@/components/game/FieldStatusPanel';
import { strategyActionClass } from '@/components/game/strategy-ui';
import { BiomemakersService } from '@/lib/services/biomemakers';

import { ScoutingStorage, type ScoutingMission } from '@/lib/scouting-data';
import { getFieldKpiSnapshots, type FieldKpiSnapshot } from '@/lib/orchestrator/kpi';
import Image from 'next/image';
import { getFieldOverlay, svgToDataUrl } from '@/lib/field-overlay-generator';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { areaToAcres } from '@/lib/geo-utils';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const IS_PLACEHOLDER_TOKEN = !MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_token_here';
mapboxgl.accessToken = MAPBOX_TOKEN;

const LAYER_IMAGES: Record<string, string> = {
    'ndvi': '/ndvi-field.png',
    'ndre': '/ndre-field.png',
    'thermal': '/thermal-field.png',
    'rgb': '/rgb-field.png',
    'gndvi': '/ndvi-field.png',
    'savi': '/ndvi-field.png',
};

const PROBLEM_OVERLAYS = [
    { id: 'pest', name: 'Pest Infestation', color: 'text-red-400', icon: 'Bug' },
    { id: 'disease', name: 'Disease Spread', color: 'text-purple-400', icon: 'Droplet' },
    { id: 'weed', name: 'Weed Pressure', color: 'text-green-400', icon: 'Leaf' },
    { id: 'nutrient', name: 'Nutrient Deficiency', color: 'text-yellow-400', icon: 'FlaskConical' },
    { id: 'drought', name: 'Drought Stress', color: 'text-blue-400', icon: 'Droplets' },
];

import { useGameStore } from '@/lib/game-store';
import { useOrchestratorStore } from '@/lib/orchestrator';

export default function FieldDetailPage({ params }: { params: { id: string } }) {
    const { getFieldsForMode, updateField, deleteField } = useFieldStore();
    const {
        gameMode,
        abandonField,
        weeklyChallenges,
        openWeeklyPlanner,
        advanceTime,
        performFieldOperation,
        completeChallenge,
        refreshWeeklyChallenges
    } = useGameStore();

    // Get fields based on active mode
    const activeFields = getFieldsForMode(gameMode ? 'strategy' : 'demo');
    const field = activeFields.find(f => f.id === params.id);
    const analysis = useMemo(() => {
        const existing = FIELD_ANALYSES.find(a => a.fieldId === params.id);
        if (existing) return existing;
        if (!field) return null;

        // Generate synthetic analysis for new fields
        return {
            fieldId: field.id,
            captureDate: new Date().toISOString(),
            resolution: 5,
            coverage: 100,
            indices: {
                ndvi: { min: 0.6, max: 0.85, avg: 0.72, std: 0.08 },
                ndre: { min: 0.55, max: 0.78, avg: 0.65, std: 0.07 },
                thermal: { min: 72, max: 82, avg: 76, std: 3.5 },
            },
            anomalies: [],
        };
    }, [params.id, field]);

    const [soilSamples, setSoilSamples] = useState(() => {
        const existing = SOIL_SAMPLES.filter(s => s.fieldId === params.id);
        return existing.length > 0 ? existing : [];
    });
    const [requestingBeCrop, setRequestingBeCrop] = useState<string | null>(null);

    const handleRequestBeCrop = async (sampleId: string) => {
        setRequestingBeCrop(sampleId);
        try {
            const report = await BiomemakersService.getSampleReport(sampleId);
            setSoilSamples(prev => prev.map(s => s.id === sampleId ? { ...s, biomemakersReport: report } : s));
        } catch (error) {
            console.error("Failed to fetch BeCrop report:", error);
        } finally {
            setRequestingBeCrop(null);
        }
    };

    const zones = useMemo(() => {
        const existing = MANAGEMENT_ZONES.filter(z => z.fieldId === params.id);
        if (existing.length > 0) return existing;
        return [];
    }, [params.id]);

    const [activeLayer, setActiveLayer] = useState(field?.image && field?.id?.startsWith('field-') && !['field-1', 'field-2', 'field-3', 'field-4', 'field-5'].includes(field?.id) ? 'rgb' : 'ndvi');

    // Track loaded image dimensions to match SVG viewBox to image aspect ratio
    const [imageDims, setImageDims] = useState<{ w: number; h: number }>({ w: 100, h: 100 });

    // Fix activeLayer after Zustand hydration (field may be undefined on initial SSR render)
    useEffect(() => {
        if (field?.image && field?.id?.startsWith('field-') && !['field-1', 'field-2', 'field-3', 'field-4', 'field-5'].includes(field?.id)) {
            setActiveLayer('rgb');
        }
    }, [field?.id, field?.image]);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [comparisonLayer, setComparisonLayer] = useState('thermal');
    const [showSoilOverlay, setShowSoilOverlay] = useState(false);
    const [showZones, setShowZones] = useState(false);
    const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
    const [pestMonitorOpen, setPestMonitorOpen] = useState(false);
    const [activeProblemOverlays, setActiveProblemOverlays] = useState<string[]>([]);
    const [overlayOpacity, setOverlayOpacity] = useState(60);
    const [selectedSoilSample, setSelectedSoilSample] = useState<string | null>(null);

    // Zoom & Pan State
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Scouting State
    const [scoutingScheduleOpen, setScoutingScheduleOpen] = useState(false);
    const [scoutingReportOpen, setScoutingReportOpen] = useState(false);
    const [plantCountOpen, setPlantCountOpen] = useState(false);
    const [imageUploadOpen, setImageUploadOpen] = useState(false);
    const [scoutingHistoryOpen, setScoutingHistoryOpen] = useState(false);
    const [activeScoutingMission, setActiveScoutingMission] = useState<ScoutingMission | null>(null);
    const [scoutingMissions, setScoutingMissions] = useState<ScoutingMission[]>([]);

    useEffect(() => {
        setScoutingMissions(ScoutingStorage.getMissionsByField(params.id));
    }, [params.id, scoutingScheduleOpen, scoutingReportOpen]);
    const kpiRefreshVersion = useOrchestratorStore(
        (state) => state.activeDecisions.length + state.completedActions.length + state.pendingAlerts.length
    );
    const fieldKpis: FieldKpiSnapshot | null = kpiRefreshVersion >= 0
        ? (getFieldKpiSnapshots({ fieldId: params.id }).fields[0] || null)
        : null;

    const handleOpenReport = (mission: ScoutingMission) => {
        setActiveScoutingMission(mission);
        setScoutingReportOpen(true);
    };

    const [isProcessing, setIsProcessing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editBoundary, setEditBoundary] = useState<[number, number][]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [boundaryHistory, setBoundaryHistory] = useState<[number, number][][]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [draggedPinIndex, setDraggedPinIndex] = useState<number | null>(null);
    const [showDeleteFieldConfirm, setShowDeleteFieldConfirm] = useState(false);
    const [viewMode, setViewMode] = useState<'balanced' | 'map' | 'ops'>('balanced');
    const [mapControlsOpen, setMapControlsOpen] = useState(true);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const router = useRouter();
    const mapContainerRef = useRef<SVGSVGElement>(null);
    const mapZoomContainerRef = useRef<HTMLDivElement>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    // Track drag vs click
    const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
    const isDraggingRef = useRef(false);
    const DRAG_THRESHOLD = 5; // pixels - movement less than this is considered a click, not a drag

    // Handle wheel zoom with proper event prevention
    useEffect(() => {
        const container = mapZoomContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const scaleAmount = -e.deltaY * 0.001;
            setZoom(z => Math.min(Math.max(1, z + scaleAmount), 5));
        };

        // Add listener with passive: false to allow preventDefault
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    // Save boundary state to history
    const saveToHistory = (newBoundary: [number, number][]) => {
        setBoundaryHistory(prev => {
            // Remove any future history if we're not at the end
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push([...newBoundary]);
            return newHistory;
        });
        setHistoryIndex(prev => prev + 1);
    };

    // Undo last action
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setEditBoundary([...boundaryHistory[newIndex]]);
        }
    }, [historyIndex, boundaryHistory]);

    // Keyboard shortcut for undo and prevent browser zoom
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isEditing) return;

            // Check for Ctrl+Z or Cmd+Z
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }
        };

        // Prevent browser zoom with Ctrl/Cmd + wheel
        const handleWindowWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWindowWheel, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWindowWheel);
        };
    }, [isEditing, handleUndo]);

    // Convert field coordinates (lat/lng or SVG) to SVG coordinates (0-100)
    // This creates a stable mapping that never changes for a given set of input coords
    const coordsToSvg = (coords: [number, number][]): [number, number][] => {
        if (!coords || !Array.isArray(coords) || coords.length === 0) return [];

        // Filter out invalid coords (null, non-array, NaN) to prevent crashes
        const validCoords = coords.filter(c =>
            Array.isArray(c) && c.length >= 2 &&
            typeof c[0] === 'number' && !isNaN(c[0]) && isFinite(c[0]) &&
            typeof c[1] === 'number' && !isNaN(c[1]) && isFinite(c[1])
        );

        if (validCoords.length === 0) return [];

        // Detect if coordinates are already in SVG space by checking their SPREAD.
        // Geographic (lat/lng) coords for a field have a tiny spread (~0.01-0.1 degrees).
        // SVG percentage coords (0-100) have a wide spread (~10-80 units).
        const xs = validCoords.map(c => c[0]);
        const ys = validCoords.map(c => c[1]);
        const spreadX = Math.max(...xs) - Math.min(...xs);
        const spreadY = Math.max(...ys) - Math.min(...ys);
        if (spreadX > 2 || spreadY > 2) {
            // Wide spread = already SVG coordinates, return as-is
            return validCoords.map(c => [c[0], c[1]] as [number, number]);
        }
        // Convert from lat/lng to SVG (0-100) with padding
        const lons = validCoords.map(c => c[0]);
        const lats = validCoords.map(c => c[1]);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const padLon = (maxLon - minLon) * 0.15 || 0.001;
        const padLat = (maxLat - minLat) * 0.15 || 0.001;
        const dLon = (maxLon - minLon) + 2 * padLon;
        const dLat = (maxLat - minLat) + 2 * padLat;
        return validCoords.map(c => [
            ((c[0] - (minLon - padLon)) / dLon) * 100,
            100 - ((c[1] - (minLat - padLat)) / dLat) * 100
        ] as [number, number]);
    };

    // Initialize edit boundary when entering edit mode
    useEffect(() => {
        if (isEditing && field) {
            // Convert field coordinates to SVG space for editing
            const svgCoords = coordsToSvg(field.coordinates);
            setEditBoundary(svgCoords);
            setBoundaryHistory([svgCoords]);
            setHistoryIndex(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- field reference intentionally excluded to avoid resetting boundary mid-edit
    }, [isEditing]);

    const isNewField = params.id.startsWith('field-') && !['field-1', 'field-2', 'field-3', 'field-4', 'field-5'].includes(params.id);

    // Editing Handlers - all work directly in SVG coordinate space (0-100)
    const handleSimulatedClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isEditing || !mapContainerRef.current || draggedPinIndex !== null) return;

        // Don't add pins if user was dragging (panning the map)
        if (isDraggingRef.current) {
            return;
        }

        // Get click position in SVG coordinate space
        const svg = mapContainerRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
        const clickX = svgPt.x;
        const clickY = svgPt.y;

        const pinThreshold = 3;
        const lineThreshold = 2;

        // Check if clicking on an existing pin (editBoundary is already in SVG coords)
        for (let i = 0; i < editBoundary.length; i++) {
            const px = editBoundary[i][0];
            const py = editBoundary[i][1];
            const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);
            if (dist < pinThreshold) return;
        }

        // Check if click is near a line segment to insert pin there
        let insertIndex = editBoundary.length;
        for (let i = 0; i < editBoundary.length; i++) {
            const x1 = editBoundary[i][0];
            const y1 = editBoundary[i][1];
            const x2 = editBoundary[(i + 1) % editBoundary.length][0];
            const y2 = editBoundary[(i + 1) % editBoundary.length][1];

            const dx = x2 - x1;
            const dy = y2 - y1;
            const len2 = dx * dx + dy * dy;
            if (len2 === 0) continue;
            let t = ((clickX - x1) * dx + (clickY - y1) * dy) / len2;
            t = Math.max(0, Math.min(1, t));
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;
            const dist = Math.sqrt((clickX - projX) ** 2 + (clickY - projY) ** 2);
            if (dist < lineThreshold) {
                insertIndex = i + 1;
                break;
            }
        }

        // Store SVG coords directly — no lat/lng conversion
        const newPin: [number, number] = [clickX, clickY];
        setEditBoundary(prev => {
            const newBoundary = [...prev];
            newBoundary.splice(insertIndex, 0, newPin);
            return newBoundary;
        });
        saveToHistory([...editBoundary.slice(0, insertIndex), newPin, ...editBoundary.slice(insertIndex)]);
    };

    const handleSimulatedMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isEditing || draggedPinIndex === null || !mapContainerRef.current) return;

        // Get mouse position directly in SVG coordinate space
        const svg = mapContainerRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());

        const svgX = svgPt.x;
        const svgY = svgPt.y;

        // Safety check to prevent NaN/Infinity
        if (isNaN(svgX) || !isFinite(svgX) || isNaN(svgY) || !isFinite(svgY)) return;

        // Constraint to 0-100%
        const clampedX = Math.max(0, Math.min(100, svgX));
        const clampedY = Math.max(0, Math.min(100, svgY));

        // Store SVG coords directly — no lat/lng conversion
        setEditBoundary(prev => {
            const newBoundary = [...prev];
            newBoundary[draggedPinIndex] = [clampedX, clampedY];
            return newBoundary;
        });
    };

    const handlePinMouseDown = (e: React.MouseEvent, index: number) => {
        if (!isEditing) return;
        e.stopPropagation();
        setDraggedPinIndex(index);
    };

    const handleMouseUp = () => {
        if (draggedPinIndex !== null) {
            // Save to history when pin drag completes
            saveToHistory(editBoundary);
        }
        setDraggedPinIndex(null);
    };

    const handleSaveBoundary = () => {
        if (!field) return;

        // Ensure we only save valid coordinates
        const validUnsavedBoundary = editBoundary.filter(c =>
            Array.isArray(c) && c.length >= 2 &&
            !isNaN(c[0]) && isFinite(c[0]) &&
            !isNaN(c[1]) && isFinite(c[1])
        );

        if (validUnsavedBoundary.length < 3) {
            // Don't save if we don't have enough valid points for a polygon
            setIsEditing(false);
            return;
        }

        updateField(field.id, {
            coordinates: validUnsavedBoundary,
            acres: field.acres
        });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditBoundary([]);
    };

    const handleDeleteBoundary = () => {
        if (!field) return;

        updateField(field.id, {
            coordinates: [],
            acres: 0,
        });

        setEditBoundary([]);
        setBoundaryHistory([]);
        setHistoryIndex(-1);
        setIsEditing(false);
        setShowDeleteConfirm(false);
    };

    const handleDeleteField = () => {
        if (!field) return;
        const fieldId = field.id;
        setShowDeleteFieldConfirm(false);

        // If in strategy mode, abandon the field ownership
        if (gameMode) {
            abandonField(fieldId);
        }

        router.push('/fields');
        // Defer deletion so navigation starts before store update triggers re-render
        setTimeout(() => deleteField(fieldId), 100);
    };

    const handleHarvestSubmit = (harvestData: any) => {
        if (!field) return;

        // Perform the harvest operation in the game store
        const result = performFieldOperation(field.id, 'op-harvest');

        if (result.success) {
            // Find and complete any harvest-related challenges for this field
            const harvestChallenge = weeklyChallenges.find(ch =>
                ch.status === 'open' &&
                ch.fieldId === field.id &&
                (ch.operationId === 'op-harvest' || ch.title.toLowerCase().includes('harvest'))
            );

            if (harvestChallenge) {
                completeChallenge(harvestChallenge.id);
            }

            // Also refresh challenges to ensure UI is in sync
            refreshWeeklyChallenges();
        }
    };

    // Simulate processing completion for new fields
    useEffect(() => {
        if (isNewField && isProcessing) {
            const timer = setTimeout(() => setIsProcessing(false), 4500);
            return () => clearTimeout(timer);
        }
    }, [isNewField, isProcessing]);

    useEffect(() => {
        if (!moreMenuOpen) return;
        const onClickOutside = (event: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setMoreMenuOpen(false);
            }
        };
        window.addEventListener('mousedown', onClickOutside);
        return () => window.removeEventListener('mousedown', onClickOutside);
    }, [moreMenuOpen]);

    const generatedOverlays = useMemo(() => {
        if (!field) return {};
        return {
            pest: getFieldOverlay(field.id, 'pest', field, weeklyChallenges),
            disease: getFieldOverlay(field.id, 'disease', field, weeklyChallenges),
            weed: getFieldOverlay(field.id, 'weed', field, weeklyChallenges),
            nutrient: getFieldOverlay(field.id, 'nutrient', field, weeklyChallenges),
            drought: getFieldOverlay(field.id, 'drought', field, weeklyChallenges),
        };
    }, [field, weeklyChallenges]);

    const fieldChallenges = useMemo(() => {
        if (!field) return [];
        return weeklyChallenges.filter(ch => ch.status === 'open' && ch.fieldId === field.id);
    }, [weeklyChallenges, field]);

    // Memoize LIDAR Overlay to prevent re-calculation on every render (especially during zoom/pan)
    const lidarOverlaySvg = useMemo(() => {
        if (field && activeLayer.startsWith('lidar-')) {
            const type = activeLayer === 'lidar-elevation' ? 'elevation' :
                activeLayer === 'lidar-absolute' ? 'absolute' : 'crop-height';
            return getFieldOverlay(field.id, type as any).svg;
        }
        return null;
    }, [activeLayer, field]);

    if (!field) {
        return (
            <AppShell>
                <div className="h-full flex items-center justify-center p-6">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Field Not Found</h2>
                        <p className="text-muted-foreground mb-6">The field you are looking for does not exist or has been removed.</p>
                        <Link href="/fields" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Fields
                        </Link>
                    </div>
                </div>
            </AppShell>
        );
    }

    const currentLayer = MULTISPECTRAL_LAYERS.find(l => l.id === activeLayer);
    const currentComparisonLayer = MULTISPECTRAL_LAYERS.find(l => l.id === comparisonLayer);
    const openRiskCount = [
        field.inputStatus?.needsProtection,
        field.inputStatus?.needsWater,
        field.inputStatus?.needsNutrients
    ].filter(Boolean).length;
    const topFieldChallenge = fieldChallenges[0] || null;
    const stageLabel = (field.farmingStage || 'fallow').replace(/_/g, ' ');
    const guidanceText = topFieldChallenge
        ? topFieldChallenge.title
        : field.farmingStage === 'harvest_ready'
            ? 'Harvest timing window is open.'
            : openRiskCount > 0
                ? 'Resolve active agronomic risks this week.'
                : 'Field is stable. Continue scouting cadence.';
    const guidanceSubtext = topFieldChallenge
        ? topFieldChallenge.description
        : openRiskCount > 0
            ? 'Use services/weekly planner to address risk quickly.'
            : 'No urgent blockers detected on this field.';
    const mapSectionClass = viewMode === 'ops'
        ? 'h-[340px] md:h-[400px] flex-none relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl mx-4 md:mx-6 mt-4 md:mt-6'
        : 'flex-1 min-h-[400px] relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl mx-4 md:mx-6 mt-4 md:mt-6';
    const bottomPanelClass = viewMode === 'ops'
        ? 'flex-1 min-h-0 border-t border-white/10 bg-black/20 overflow-hidden'
        : 'h-48 md:h-64 shrink-0 border-t border-white/10 bg-black/20 overflow-hidden';
    const hasAnyProblemOverlay = Object.values(generatedOverlays).some((overlay: any) => overlay?.hasProblems);
    const activeProblemOverlayCount = activeProblemOverlays.filter(
        overlayId => generatedOverlays[overlayId as keyof typeof generatedOverlays]?.hasProblems
    ).length;
    const handleOpenWeeklyPlan = () => {
        openWeeklyPlanner();
        // Fallback in case component closures are stale during hot-reload sessions.
        setTimeout(() => {
            if (!useGameStore.getState().isWeeklyPlannerOpen) {
                useGameStore.setState({ isWeeklyPlannerOpen: true });
            }
        }, 0);
    };


    return (
        <AppShell>
            <div className="h-full flex flex-col page-enter">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-primary/15 shrink-0">
                    <Link href="/fields" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Fields
                    </Link>

                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-3xl font-bold">{field.name}</h1>
                            <p className="text-muted-foreground mt-1">
                                {field.crop} • {field.acres} acres • Planted {new Date(field.plantingDate).toLocaleDateString()}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    <Gauge className="w-3.5 h-3.5" />
                                    Stage: {stageLabel}
                                </span>
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border",
                                    openRiskCount > 0
                                        ? "border-orange-300/20 bg-orange-500/10 text-orange-200"
                                        : "border-primary/20 bg-primary/10 text-primary"
                                )}>
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    {openRiskCount > 0 ? `${openRiskCount} Active Risks` : 'Low Risk'}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                                    <Target className="w-3.5 h-3.5" />
                                    {fieldChallenges.length} Weekly Priorities
                                </span>
                            </div>
                            <div className="mission-banner mt-4 fade-up">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="icon-chip h-9 w-9">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-[220px] flex-1">
                                        <div className="text-sm font-bold text-white">Mission Focus</div>
                                        <div className="text-xs text-primary/90">{guidanceText}</div>
                                    </div>
                                    <button
                                        onClick={handleOpenWeeklyPlan}
                                        data-guide-id="field-cta-open-weekly-plan"
                                        className="cta-primary text-xs"
                                    >
                                        Open Weekly Plan
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 rounded-2xl border border-secondary/20 bg-secondary/10 p-3">
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <h2 className="text-sm font-semibold text-secondary">Season KPI Snapshot</h2>
                                </div>
                                {fieldKpis ? (
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                        <div className="rounded-lg bg-black/20 border border-white/10 p-2">
                                            <div className="text-[11px] text-secondary/80">Yield</div>
                                            <div className="text-sm font-semibold">{fieldKpis.kpis.yield.toFixed(2)} t</div>
                                        </div>
                                        <div className="rounded-lg bg-black/20 border border-white/10 p-2">
                                            <div className="text-[11px] text-secondary/80">Cost</div>
                                            <div className="text-sm font-semibold">${fieldKpis.kpis.cost.toLocaleString()}</div>
                                        </div>
                                        <div className="rounded-lg bg-black/20 border border-white/10 p-2">
                                            <div className="text-[11px] text-secondary/80">Timing</div>
                                            <div className="text-sm font-semibold">{fieldKpis.kpis.timingAdherencePct.toFixed(1)}%</div>
                                        </div>
                                        <div className="rounded-lg bg-black/20 border border-white/10 p-2">
                                            <div className="text-[11px] text-secondary/80">Stress Events</div>
                                            <div className="text-sm font-semibold">{fieldKpis.kpis.stressEvents}</div>
                                        </div>
                                        <div className="rounded-lg bg-black/20 border border-white/10 p-2">
                                            <div className="text-[11px] text-secondary/80">Avoided Loss</div>
                                            <div className="text-sm font-semibold text-primary">${fieldKpis.kpis.avoidedLoss.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-secondary/80">No KPI data yet. Complete decisions and actions to populate this field.</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-1">
                                <button
                                    onClick={() => setViewMode('balanced')}
                                    className={cn(
                                        "px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors",
                                        viewMode === 'balanced' ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                    Balanced
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={cn(
                                        "px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors",
                                        viewMode === 'map' ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <MapIcon className="w-3.5 h-3.5" />
                                    Map
                                </button>
                                <button
                                    onClick={() => setViewMode('ops')}
                                    className={cn(
                                        "px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors",
                                        viewMode === 'ops' ? "bg-white text-black" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <List className="w-3.5 h-3.5" />
                                    Ops
                                </button>
                            </div>
                            <button
                                onClick={() => setComparisonMode(!comparisonMode)}
                                className={cn(
                                    "px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-semibold",
                                    comparisonMode ? "bg-secondary text-cyan-950 border border-secondary/50" : "cta-secondary"
                                )}
                            >
                                <GitCompare className="w-4 h-4" />
                                {comparisonMode ? 'Exit' : 'Compare'}
                            </button>
                            <button
                                onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                                className={cn(
                                    "px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-semibold",
                                    isEditing
                                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
                                        : "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-100 border border-yellow-300/30"
                                )}
                            >
                                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                {isEditing ? 'Cancel Edit' : 'Edit Boundary'}
                            </button>
                            {isEditing && (
                                <>
                                    <button
                                        onClick={handleUndo}
                                        disabled={historyIndex <= 0}
                                        className={cn(
                                            "px-4 py-2 rounded-xl flex items-center gap-2 transition-colors font-semibold",
                                            historyIndex <= 0
                                                ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                                                : "bg-blue-500/25 text-blue-100 hover:bg-blue-500/35 border border-blue-300/30"
                                        )}
                                        title="Undo last action (Ctrl+Z)"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                        Undo
                                    </button>
                                    <button
                                        onClick={handleSaveBoundary}
                                        className="px-4 py-2 bg-green-500 text-green-950 rounded-xl hover:bg-green-400 flex items-center gap-2 transition-colors shadow-lg shadow-green-500/30 font-semibold"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setImageUploadOpen(true)}
                                className="cta-secondary flex items-center gap-2 text-sm"
                            >
                                <Camera className="w-4 h-4" />
                                Upload Photo
                            </button>
                            <button
                                onClick={() => setScoutingHistoryOpen(true)}
                                className="cta-secondary flex items-center gap-2 text-sm"
                            >
                                <History className="w-4 h-4" />
                                Scouting History
                            </button>
                            <button className="cta-primary flex items-center gap-2 text-sm">
                                <Download className="w-4 h-4" />
                                Export Data
                            </button>
                            <div className="relative" ref={moreMenuRef}>
                                <button
                                    onClick={() => setMoreMenuOpen((prev) => !prev)}
                                    className="cta-secondary flex items-center gap-2 text-sm"
                                >
                                    <MoreHorizontal className="w-4 h-4" />
                                    More
                                </button>
                                {moreMenuOpen && (
                                    <div className="absolute right-0 top-12 z-[70] w-52 rounded-xl border border-white/15 bg-zinc-950/95 shadow-2xl p-1.5">
                                        {isEditing && (
                                            <button
                                                onClick={() => {
                                                    setShowDeleteConfirm(true);
                                                    setMoreMenuOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 text-red-300 flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Boundary
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setShowDeleteFieldConfirm(true);
                                                setMoreMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/10 text-red-300 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Field
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    {/* Game Mode Status Panel */}
                    {gameMode && viewMode !== 'map' && (
                        <div className="px-4 md:px-6 pt-4 space-y-3">
                            <FieldStatusPanel field={field} />
                            <div className="rounded-xl card-soft p-4 fade-up">
                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                        <Bot className="w-4 h-4 text-primary" />
                                        Strategy Coach Guidance
                                    </div>
                                    <div className="text-sm font-semibold">{guidanceText}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{guidanceSubtext}</div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {(field.inputStatus?.needsWater || field.inputStatus?.needsNutrients) && (
                                            <button
                                                onClick={() => router.push(`/game/marketplace/services?fieldId=${field.id}`)}
                                                data-guide-id="field-cta-go-services"
                                                className={strategyActionClass('primary', 'px-3 py-1.5 text-xs')}
                                            >
                                                <ArrowRightCircle className="w-3.5 h-3.5" />
                                                Go to Services
                                            </button>
                                        )}
                                        {fieldChallenges.length === 0 && !field.inputStatus?.needsProtection && field.farmingStage !== 'harvest_ready' && (
                                            <button
                                                onClick={() => advanceTime()}
                                                data-guide-id="field-cta-advance-week"
                                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                                            >
                                                <ArrowRightCircle className="w-3.5 h-3.5" />
                                                Advance Week
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Map View Section - Takes remaining space */}
                    <div className={mapSectionClass}>
                        {/* Multispectral Image Display */}
                        {comparisonMode ? (
                            <ComparisonSlider
                                leftImage={(() => {
                                    if (activeLayer.startsWith('lidar-')) {
                                        const type = activeLayer === 'lidar-elevation' ? 'elevation' :
                                            activeLayer === 'lidar-absolute' ? 'absolute' : 'crop-height';
                                        const overlay = getFieldOverlay(field.id, type as any);
                                        return svgToDataUrl(overlay.svg);
                                    }
                                    return LAYER_IMAGES[activeLayer];
                                })()}
                                leftLabel={currentLayer?.name || ''}
                                rightImage={(() => {
                                    if (comparisonLayer.startsWith('lidar-')) {
                                        const type = comparisonLayer === 'lidar-elevation' ? 'elevation' :
                                            comparisonLayer === 'lidar-absolute' ? 'absolute' : 'crop-height';
                                        const overlay = getFieldOverlay(field.id, type as any);
                                        return svgToDataUrl(overlay.svg);
                                    }
                                    return LAYER_IMAGES[comparisonLayer];
                                })()}
                                rightLabel={currentComparisonLayer?.name || ''}
                                className="absolute inset-0"
                            />
                        ) : (
                            <div
                                ref={mapZoomContainerRef}
                                className="absolute inset-0 overflow-hidden cursor-move"
                                style={{
                                    touchAction: 'none',
                                    overscrollBehavior: 'none'
                                }}
                                onMouseDown={(e) => {
                                    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
                                    isDraggingRef.current = false;
                                    setIsDragging(true);
                                    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                                }}
                                onMouseMove={(e) => {
                                    if (isDragging && dragStartPosRef.current) {
                                        const dx = e.clientX - dragStartPosRef.current.x;
                                        const dy = e.clientY - dragStartPosRef.current.y;
                                        const distance = Math.sqrt(dx * dx + dy * dy);
                                        if (distance > DRAG_THRESHOLD) {
                                            isDraggingRef.current = true;
                                        }
                                        setPan({
                                            x: e.clientX - dragStart.x,
                                            y: e.clientY - dragStart.y
                                        });
                                    }
                                }}
                                onMouseUp={() => {
                                    setIsDragging(false);
                                    // Small delay to allow click handler to check drag state
                                    setTimeout(() => {
                                        isDraggingRef.current = false;
                                        dragStartPosRef.current = null;
                                    }, 50);
                                }}
                                onMouseLeave={() => {
                                    setIsDragging(false);
                                    isDraggingRef.current = false;
                                    dragStartPosRef.current = null;
                                }}
                            >
                                <div
                                    style={{
                                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                        transformOrigin: 'center'
                                    }}
                                    className="w-full h-full relative"
                                >
                                    <Image
                                        src={(isEditing || activeLayer === 'rgb') && field.image ? field.image : LAYER_IMAGES[activeLayer]}
                                        alt={currentLayer?.name || ''}
                                        fill
                                        className="object-contain"
                                        priority
                                        onLoad={(e) => {
                                            const img = e.target as HTMLImageElement;
                                            if (img.naturalWidth && img.naturalHeight) {
                                                setImageDims({ w: img.naturalWidth, h: img.naturalHeight });
                                            }
                                        }}
                                    />

                                    {/* Field Boundary Overlay (Drawn with pins) */}
                                    <div className="absolute inset-0 z-20">
                                        {isEditing ? (
                                            /* EDIT MODE: Use shared projection bounds */
                                            <svg
                                                className="w-full h-full absolute inset-0"
                                                ref={mapContainerRef}
                                                viewBox={`0 0 ${imageDims.w > imageDims.h ? 100 : 100 * imageDims.w / imageDims.h} ${imageDims.h > imageDims.w ? 100 : 100 * imageDims.h / imageDims.w}`}
                                                preserveAspectRatio="xMidYMid meet"
                                                onClick={handleSimulatedClick}
                                                onMouseMove={handleSimulatedMouseMove}
                                                onMouseUp={handleMouseUp}
                                                onMouseLeave={handleMouseUp}
                                            >
                                                {editBoundary.length > 1 && (() => {
                                                    return (
                                                        <>
                                                            <polyline
                                                                points={editBoundary.map(c => `${c[0]},${c[1]}`).join(" ")}
                                                                fill="rgba(34, 197, 94, 0.3)"
                                                                stroke="#22c55e"
                                                                strokeWidth="1"
                                                            />
                                                            {editBoundary.length > 2 && (
                                                                <line
                                                                    x1={editBoundary[editBoundary.length - 1][0]}
                                                                    y1={editBoundary[editBoundary.length - 1][1]}
                                                                    x2={editBoundary[0][0]}
                                                                    y2={editBoundary[0][1]}
                                                                    stroke="#22c55e"
                                                                    strokeWidth="1"
                                                                />
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                                {editBoundary.map((coord, i) => (
                                                    <circle
                                                        key={i}
                                                        cx={coord[0]}
                                                        cy={coord[1]}
                                                        r="1.5"
                                                        fill="#22c55e"
                                                        stroke="white"
                                                        strokeWidth="0.5"
                                                        style={{ cursor: draggedPinIndex === i ? 'grabbing' : 'grab', pointerEvents: 'auto' }}
                                                        onMouseDown={(e) => handlePinMouseDown(e, i)}
                                                    />
                                                ))}
                                            </svg>
                                        ) : (
                                            /* VIEW MODE: render coordinates directly as SVG positions */
                                            <svg
                                                className="w-full h-full absolute inset-0"
                                                viewBox={`0 0 ${imageDims.w > imageDims.h ? 100 : 100 * imageDims.w / imageDims.h} ${imageDims.h > imageDims.w ? 100 : 100 * imageDims.h / imageDims.w}`}
                                                preserveAspectRatio="xMidYMid meet"
                                            >
                                                {field.coordinates && field.coordinates.length > 2 && (() => {
                                                    const svgCoords = coordsToSvg(field.coordinates);
                                                    return (
                                                        <>
                                                            <polyline
                                                                points={svgCoords.map(c => `${c[0]},${c[1]}`).join(" ")}
                                                                fill="rgba(34, 197, 94, 0.15)"
                                                                stroke="#22c55e"
                                                                strokeWidth="1"
                                                            />
                                                            {svgCoords.length > 2 && (
                                                                <line
                                                                    x1={svgCoords[svgCoords.length - 1][0]}
                                                                    y1={svgCoords[svgCoords.length - 1][1]}
                                                                    x2={svgCoords[0][0]}
                                                                    y2={svgCoords[0][1]}
                                                                    stroke="#22c55e"
                                                                    strokeWidth="1"
                                                                />
                                                            )}
                                                            {svgCoords.map((c, i) => (
                                                                <circle
                                                                    key={i}
                                                                    cx={c[0]}
                                                                    cy={c[1]}
                                                                    r="1.5"
                                                                    fill="#22c55e"
                                                                    stroke="white"
                                                                    strokeWidth="0.3"
                                                                />
                                                            ))}
                                                        </>
                                                    );
                                                })()}
                                            </svg>
                                        )}
                                    </div>

                                    {/* No Boundary Message */}
                                    {isEditing && editBoundary.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                                            <div className="glass-panel rounded-xl p-6 text-center">
                                                <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                                    <MapPin className="w-8 h-8 text-yellow-400" />
                                                </div>
                                                <h3 className="text-lg font-bold mb-2">No Boundary Defined</h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Click anywhere on the map to start adding boundary points.
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Add at least 3 points to create a field boundary.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Problem Overlays */}
                                    {activeProblemOverlays.map(overlayId => {
                                        const overlayData = generatedOverlays[overlayId as keyof typeof generatedOverlays];
                                        if (!overlayData?.hasProblems) return null;
                                        const svgDataUrl = svgToDataUrl(overlayData.svg);
                                        return (
                                            <div
                                                key={overlayId}
                                                className="absolute inset-0 pointer-events-none z-10 backdrop-blur-[1px] saturate-125"
                                                style={{ opacity: 1 }}
                                            >
                                                <div
                                                    className="w-full h-full bg-contain bg-center bg-no-repeat blur-[0.2px]"
                                                    style={{ backgroundImage: `url("${svgDataUrl}")` }}
                                                />
                                            </div>
                                        );
                                    })}

                                    {activeProblemOverlays.length > 0 && activeProblemOverlayCount === 0 && (
                                        <div className="absolute inset-x-0 top-4 z-30 flex justify-center pointer-events-none">
                                            <div className="rounded-full border border-emerald-400/25 bg-black/45 px-3 py-1.5 text-xs font-medium text-emerald-100 shadow-lg backdrop-blur-md">
                                                No active problems detected
                                            </div>
                                        </div>
                                    )}

                                    {/* LIDAR Overlay */}
                                    {activeLayer.startsWith('lidar-') && (() => {
                                        // Memoize this calculation in a real app, or rely on the fact that getFieldOverlay might be fast enough if cached.
                                        // Given the performance issues, we should memoize the result of getFieldOverlay outside the render loop or use useMemo.
                                        // For now, let's use useMemo in the component body, but since we are inside a map/conditional here, we can't.
                                        // Best approach: Pre-calculate the active overlay in the component body.

                                        // However, since we are here, let's assume the user will fix the component structure.
                                        // For this specific block, we can't easily useMemo. 
                                        // Let's move the calculation to the main component body.
                                        return null; // Rendered via memoized value below
                                    })()}

                                    {/* Render Memoized LIDAR Overlay */}
                                    {activeLayer.startsWith('lidar-') && lidarOverlaySvg && (
                                        <div
                                            className="absolute inset-0 z-10 pointer-events-none"
                                            dangerouslySetInnerHTML={{ __html: lidarOverlaySvg }}
                                        />
                                    )}

                                    {/* Soil Sample Markers */}
                                    {showSoilOverlay && soilSamples.map((sample) => {
                                        const x = ((sample.location[0] + 121.6550) / 0.0050) * 100;
                                        const y = ((36.6800 - sample.location[1]) / 0.0050) * 100;
                                        return (
                                            <div
                                                key={sample.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedSoilSample(selectedSoilSample === sample.id ? null : sample.id);
                                                }}
                                                className="absolute cursor-pointer group z-20"
                                                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                                            >
                                                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg group-hover:scale-125 transition-transform" />
                                                {selectedSoilSample === sample.id && (
                                                    <div className="absolute left-8 top-0 glass-panel rounded-lg p-3 w-64 z-30 animate-in fade-in zoom-in-95 duration-200 cursor-auto" onClick={e => e.stopPropagation()}>
                                                        <div className="text-xs font-semibold mb-2 flex items-center justify-between">
                                                            <span>Soil Sample {sample.id}</span>
                                                            {sample.biomemakersReport && (
                                                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">
                                                                    BeCrop Score: {sample.biomemakersReport.score}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                                                            <div><div className="text-muted-foreground">pH</div><div className="font-medium">{sample.ph}</div></div>
                                                            <div><div className="text-muted-foreground">Nitrogen</div><div className="font-medium">{sample.nitrogen} ppm</div></div>
                                                            <div><div className="text-muted-foreground">Moisture</div><div className="font-medium">{sample.moisture}%</div></div>
                                                        </div>

                                                        {sample.biomemakersReport ? (
                                                            <div className="mt-3 pt-3 border-t border-white/10">
                                                                <div className="text-xs font-semibold mb-2 text-green-400 flex items-center gap-1">
                                                                    <FlaskConical className="w-3.5 h-3.5" />
                                                                    Biomemakers Analysis
                                                                </div>
                                                                <div className="space-y-1.5 text-[11px]">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Fungi/Bacteria</span>
                                                                        <span className="font-medium">{sample.biomemakersReport.biology.fungi_bacteria_ratio.rank}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Mycorrhizal</span>
                                                                        <span className="font-medium">{sample.biomemakersReport.biology.arbuscular_mycorrhizal.rank}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-muted-foreground">Pathogen Risk</span>
                                                                        <span className="font-medium">{sample.biomemakersReport.biology.pathogen_risk.rank}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRequestBeCrop(sample.id)}
                                                                disabled={requestingBeCrop === sample.id}
                                                                className="w-full mt-2 py-1.5 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded border border-blue-500/30 font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                                                            >
                                                                {requestingBeCrop === sample.id ? (
                                                                    <>
                                                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                                        Analyzing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FlaskConical className="w-3.5 h-3.5" />
                                                                        Request BeCrop Report
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Edit Mode Instructions - Outside zoomable area */}
                        {isEditing && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 glass-panel rounded-lg px-4 py-2 text-sm pointer-events-none">
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Click to add pin
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Drag to move
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">Ctrl+Z</kbd>
                                        Undo
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Zoom Level Indicator */}
                        <div className="absolute bottom-4 right-4 z-50 glass-panel rounded-lg px-3 py-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span>Zoom:</span>
                                <span className="font-medium text-foreground">{Math.round(zoom * 100)}%</span>
                            </div>
                        </div>

                        {/* Processing Overlay - Outside zoomable area */}
                        {isNewField && isProcessing && (
                            <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
                                <div className="max-w-md glass-panel p-8 rounded-3xl border-primary/20 shadow-2xl animate-in fade-in zoom-in duration-500">
                                    <div className="relative w-20 h-20 mx-auto mb-6">
                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                        <Zap className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white">Processing Satellite Data</h3>
                                    <p className="text-sm text-white/70 leading-relaxed mb-6">
                                        We have queued a multispectral task for <strong>{field.name}</strong>.
                                        Initial health indices (NDVI, NDRE) are being calculated using our latest orbital pass.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: '65%' }} />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
                                            <span>Analyzing Spectral Bands</span>
                                            <span>65% Complete</span>
                                        </div>
                                        <button
                                            onClick={() => setIsProcessing(false)}
                                            className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all border border-white/5"
                                        >
                                            Skip & View Analysis
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => setMapControlsOpen((prev) => !prev)}
                            className="absolute top-4 right-4 z-50 px-3 py-2 rounded-lg bg-black/50 hover:bg-black/65 border border-white/15 text-xs font-semibold flex items-center gap-2"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Map Controls
                        </button>

                        {mapControlsOpen && (
                            <div className="absolute top-16 right-4 z-50 glass-panel rounded-xl p-4 w-[300px] space-y-3 max-h-[calc(100%-90px)] overflow-y-auto">
                                <div className="text-sm font-medium flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    Layer Controls
                                </div>
                                <div className="space-y-2">
                                    <div className="text-xs text-muted-foreground">{comparisonMode ? 'Left Layer' : 'Active Layer'}</div>
                                    {MULTISPECTRAL_LAYERS.map((layer) => (
                                        <button
                                            key={layer.id}
                                            onClick={() => setActiveLayer(layer.id)}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-lg text-left text-sm transition-colors",
                                                activeLayer === layer.id ? "bg-primary text-primary-foreground" : "bg-white/5 hover:bg-white/10"
                                            )}
                                        >
                                            <div className="font-medium">{layer.name}</div>
                                            <div className="text-xs opacity-70 mt-0.5">{layer.type.toUpperCase()}</div>
                                        </button>
                                    ))}
                                </div>

                                {comparisonMode && (
                                    <div className="space-y-2 pt-3 border-t border-white/10">
                                        <div className="text-xs text-muted-foreground">Comparison Layer (Right)</div>
                                        {MULTISPECTRAL_LAYERS.map((layer) => (
                                            <button
                                                key={`compare-${layer.id}`}
                                                onClick={() => setComparisonLayer(layer.id)}
                                                className={cn(
                                                    "w-full px-3 py-2 rounded-lg text-left text-sm transition-colors",
                                                    comparisonLayer === layer.id ? "bg-secondary text-cyan-950" : "bg-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="font-medium">{layer.name}</div>
                                                <div className="text-xs opacity-70 mt-0.5">{layer.type.toUpperCase()}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-3 border-t border-white/10 space-y-3">
                                    <div className="text-sm font-medium">Analysis Overlays</div>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /><span className="text-sm">Soil Samples</span></div>
                                        <input type="checkbox" checked={showSoilOverlay} onChange={(e) => setShowSoilOverlay(e.target.checked)} className="w-4 h-4" />
                                    </label>
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /><span className="text-sm">Management Zones</span></div>
                                        <input type="checkbox" checked={showZones} onChange={(e) => setShowZones(e.target.checked)} className="w-4 h-4" />
                                    </label>
                                    <div>
                                        <div className="text-xs text-muted-foreground mb-1">Problem Overlay Opacity</div>
                                        <input
                                            type="range"
                                            min={20}
                                            max={100}
                                            step={5}
                                            value={100}
                                            onChange={() => setOverlayOpacity(100)}
                                            className="w-full"
                                        />
                                        <div className="text-[11px] text-muted-foreground mt-1">100%</div>
                                    </div>
                                    <div className="pt-1">
                                        <div className="text-xs text-muted-foreground mb-2">Problem Overlays</div>
                                        {PROBLEM_OVERLAYS.map(overlay => {
                                            const IconComp = overlay.id === 'pest' ? Bug :
                                                overlay.id === 'disease' ? Droplet :
                                                overlay.id === 'weed' ? Leaf :
                                                overlay.id === 'nutrient' ? FlaskConical :
                                                Droplets;
                                            const overlayData = generatedOverlays[overlay.id as keyof typeof generatedOverlays];
                                            return (
                                            <label key={overlay.id} className="flex items-center justify-between cursor-pointer mb-2">
                                                <div className="flex items-center gap-2">
                                                    <IconComp className={cn("w-4 h-4", overlay.color)} />
                                                    <span className="text-sm">{overlay.name}</span>
                                                    {!overlayData?.hasProblems && (
                                                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">clear</span>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={activeProblemOverlays.includes(overlay.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setActiveProblemOverlays([...activeProblemOverlays, overlay.id]);
                                                        else setActiveProblemOverlays(activeProblemOverlays.filter(id => id !== overlay.id));
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                            </label>
                                            );
                                        })}
                                        {!hasAnyProblemOverlay && (
                                            <div className="mt-2 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                                                No active problems detected
                                            </div>
                                        )}
                                        <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-2">
                                            <div className="h-2 rounded-full overflow-hidden flex">
                                                <div className="flex-1 bg-red-500" />
                                                <div className="flex-1 bg-purple-500" />
                                                <div className="flex-1 bg-green-500" />
                                                <div className="flex-1 bg-yellow-400" />
                                                <div className="flex-1 bg-blue-500" />
                                            </div>
                                            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                                                <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />Pest</span>
                                                <span><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1" />Disease</span>
                                                <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Weed</span>
                                                <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />Nutrient</span>
                                                <span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />Drought</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Panel - Scrollable content */}
                {viewMode !== 'map' && (
                    <div className={bottomPanelClass}>
                        <div className="h-full overflow-y-auto px-4 md:px-6 py-4">
                            <div className="space-y-4">
                                {/* Quick Actions Row */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPlantCountOpen(true)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Calculator className="w-4 h-4 text-green-400" />
                                        Stand Count
                                    </button>
                                    <button
                                        onClick={() => setScoutingScheduleOpen(true)}
                                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Schedule Scout
                                    </button>
                                </div>

                                {/* Scouting & Analysis Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {/* Scouting Missions List */}
                                    <div className="lg:col-span-2 glass-panel p-4 rounded-xl">
                                        <div className="flex items-center justify-between mb-3">
                                            <h2 className="text-base font-bold flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-blue-400" />
                                                Scouting Missions
                                            </h2>
                                        </div>

                                        <div className="space-y-2">
                                            {scoutingMissions.length === 0 ? (
                                                <div className="text-center py-4 text-muted-foreground text-sm">
                                                    <p>No scouting missions scheduled</p>
                                                </div>
                                            ) : (
                                                scoutingMissions.map(mission => (
                                                    <div key={mission.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-lg flex items-center justify-center",
                                                                mission.status === 'completed' ? "bg-green-500/20 text-green-400" :
                                                                    mission.status === 'overdue' ? "bg-red-500/20 text-red-400" :
                                                                        "bg-blue-500/20 text-blue-400"
                                                            )}>
                                                                {mission.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-sm">{mission.templateId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {mission.scoutName} • {new Date(mission.date).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded-full text-xs font-medium uppercase",
                                                                mission.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                                    mission.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                                        'bg-blue-500/20 text-blue-400'
                                                            )}>
                                                                {mission.priority}
                                                            </span>

                                                            {mission.status !== 'completed' && (
                                                                <button
                                                                    onClick={() => handleOpenReport(mission)}
                                                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-medium transition-colors"
                                                                >
                                                                    Start
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Analysis Stats */}
                                    <div className="space-y-3">
                                        {analysis && (
                                            <div className="glass-panel p-4 rounded-xl">
                                                <h3 className="text-sm font-semibold mb-2">Index Statistics</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="glass-panel rounded p-2 bg-white/5">
                                                        <div className="text-xs text-muted-foreground">NDVI Avg</div>
                                                        <div className="text-lg font-bold text-green-400">{analysis.indices.ndvi.avg.toFixed(2)}</div>
                                                    </div>
                                                    <div className="glass-panel rounded p-2 bg-white/5">
                                                        <div className="text-xs text-muted-foreground">Thermal</div>
                                                        <div className="text-lg font-bold text-orange-400">{analysis.indices.thermal.avg.toFixed(0)}°F</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {zones.length > 0 && (
                                            <div className="glass-panel p-4 rounded-xl">
                                                <h3 className="text-sm font-semibold mb-2">Management Zones</h3>
                                                <div className="space-y-1">
                                                    {zones.slice(0, 3).map(zone => (
                                                        <div key={zone.id} className="flex justify-between items-center p-2 bg-white/5 rounded text-xs">
                                                            <div>
                                                                <div className="font-medium">{zone.name}</div>
                                                                <div className="text-muted-foreground">{zone.area} acres</div>
                                                            </div>
                                                            <div className="text-green-400">{zone.avgNDVI.toFixed(2)} NDVI</div>
                                                        </div>
                                                    ))}
                                                    {zones.length > 3 && (
                                                        <div className="text-center text-xs text-muted-foreground py-1">
                                                            +{zones.length - 3} more zones
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modals */}
                <HarvestLogModal
                    isOpen={isHarvestModalOpen}
                    onClose={() => setIsHarvestModalOpen(false)}
                    fieldName={field.name}
                    initialCrop={field.crop}
                    onSubmit={handleHarvestSubmit}
                />

                <PestDiseaseMonitorModal
                    isOpen={pestMonitorOpen}
                    onClose={() => setPestMonitorOpen(false)}
                    fieldId={field.id}
                />

                <ScoutingScheduleModal
                    isOpen={scoutingScheduleOpen}
                    onClose={() => setScoutingScheduleOpen(false)}
                    fieldId={field.id}
                    fieldName={field.name}
                    onSchedule={() => setScoutingMissions(ScoutingStorage.getMissionsByField(params.id))}
                />

                {
                    activeScoutingMission && (
                        <ScoutingReportModal
                            isOpen={scoutingReportOpen}
                            onClose={() => {
                                setScoutingReportOpen(false);
                                setActiveScoutingMission(null);
                            }}
                            mission={activeScoutingMission}
                        />
                    )
                }

                <PlantCountModal
                    isOpen={plantCountOpen}
                    onClose={() => setPlantCountOpen(false)}
                    fieldId={field.id}
                />

                <ImageUploadModal
                    isOpen={imageUploadOpen}
                    onClose={() => setImageUploadOpen(false)}
                    preselectedFieldId={field.id}
                />

                <ScoutingHistoryModal
                    isOpen={scoutingHistoryOpen}
                    onClose={() => setScoutingHistoryOpen(false)}
                    fieldId={field.id}
                />

                {/* Delete Boundary Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="glass-panel rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Delete Field Boundary?</h2>
                                    <p className="text-sm text-muted-foreground">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to delete the boundary for <strong>{field?.name}</strong>?
                                This will remove all boundary coordinates and reset the field area to 0 acres.
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteBoundary}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Boundary
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Field Confirmation Modal */}
                {showDeleteFieldConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                            <h2 className="text-xl font-bold mb-2">Delete Field?</h2>
                            <p className="text-muted-foreground mb-6">Are you sure you want to delete <span className="text-white font-medium">{field?.name}</span>? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteFieldConfirm(false)}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteField}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </AppShell>
    );
}
