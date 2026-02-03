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
    Leaf, AlertTriangle, Download, Share2, Calendar,
    Zap, Target, GitCompare, Bug, Calculator, User, CheckCircle, Edit3, X
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ComparisonSlider } from '@/components/ui/ComparisonSlider';
import { HarvestLogModal } from '@/components/modals/HarvestLogModal';
import { PestDiseaseMonitorModal } from '@/components/modals/PestDiseaseMonitorModal';
import { ScoutingScheduleModal } from '@/components/modals/ScoutingScheduleModal';
import { ScoutingReportModal } from '@/components/modals/ScoutingReportModal';
import { PlantCountModal } from '@/components/modals/PlantCountModal';
// Removed EditFieldModal import

import { ScoutingStorage, type ScoutingMission } from '@/lib/scouting-data';
import Image from 'next/image';
import { getFieldOverlay } from '@/lib/field-overlay-generator';
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
    { id: 'pest', name: 'Pest Infestation', color: 'text-red-400' },
    { id: 'disease', name: 'Disease Spread', color: 'text-purple-400' },
    { id: 'weed', name: 'Weed Pressure', color: 'text-green-400' },
];

export default function FieldDetailPage({ params }: { params: { id: string } }) {
    const { fields, updateField } = useFieldStore();
    const field = fields.find(f => f.id === params.id);
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

    const soilSamples = useMemo(() => {
        const existing = SOIL_SAMPLES.filter(s => s.fieldId === params.id);
        if (existing.length > 0) return existing;
        return [];
    }, [params.id]);

    const zones = useMemo(() => {
        const existing = MANAGEMENT_ZONES.filter(z => z.fieldId === params.id);
        if (existing.length > 0) return existing;
        return [];
    }, [params.id]);

    const [activeLayer, setActiveLayer] = useState('ndvi');
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
    const [activeScoutingMission, setActiveScoutingMission] = useState<ScoutingMission | null>(null);
    const [scoutingMissions, setScoutingMissions] = useState<ScoutingMission[]>([]);

    useEffect(() => {
        setScoutingMissions(ScoutingStorage.getMissionsByField(params.id));
    }, [params.id, scoutingScheduleOpen, scoutingReportOpen]);

    const handleOpenReport = (mission: ScoutingMission) => {
        setActiveScoutingMission(mission);
        setScoutingReportOpen(true);
    };

    const [isProcessing, setIsProcessing] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editBoundary, setEditBoundary] = useState<[number, number][]>([]);
    const [draggedPinIndex, setDraggedPinIndex] = useState<number | null>(null);
    const mapContainerRef = useRef<SVGSVGElement>(null);

    // Initialize edit boundary when entering edit mode
    useEffect(() => {
        if (isEditing && field) {
            setEditBoundary(field.coordinates);
        }
    }, [isEditing, field]);

    const isNewField = params.id.startsWith('field-') && !['field-1', 'field-2', 'field-3', 'field-4', 'field-5'].includes(params.id);

    // Editing Handlers
    const handleSimulatedClick = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isEditing || !mapContainerRef.current || draggedPinIndex !== null) return;

        const rect = mapContainerRef.current.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / zoom;
        const clickY = (e.clientY - rect.top) / zoom;
        const width = mapContainerRef.current.clientWidth;
        const height = mapContainerRef.current.clientHeight;

        const pinThreshold = 15; // pixels - don't add pin if clicking on existing pin
        const lineThreshold = 10; // pixels - distance to line to insert pin

        // Check if clicking on an existing pin
        for (let i = 0; i < editBoundary.length; i++) {
            const p = editBoundary[i];
            const px = ((p[0] - 44.8) / 0.05 + 0.5) * width;
            const py = (-(p[1] - 41.7) / 0.05 + 0.5) * height;
            const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);
            
            if (dist < pinThreshold) {
                // Clicking on a pin, don't add new pin
                return;
            }
        }

        const lng = 44.8 + (clickX / width - 0.5) * 0.05;
        const lat = 41.7 - (clickY / height - 0.5) * 0.05;

        // Check if click is near a line segment to insert pin there
        let insertIndex = editBoundary.length;

        for (let i = 0; i < editBoundary.length; i++) {
            const p1 = editBoundary[i];
            const p2 = editBoundary[(i + 1) % editBoundary.length];

            const x1 = ((p1[0] - 44.8) / 0.05 + 0.5) * width;
            const y1 = (-(p1[1] - 41.7) / 0.05 + 0.5) * height;
            const x2 = ((p2[0] - 44.8) / 0.05 + 0.5) * width;
            const y2 = (-(p2[1] - 41.7) / 0.05 + 0.5) * height;

            // Distance from point to line segment
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len2 = dx * dx + dy * dy;
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

        setEditBoundary(prev => {
            const newBoundary = [...prev];
            newBoundary.splice(insertIndex, 0, [lng, lat]);
            return newBoundary;
        });
    };

    const handleSimulatedMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!isEditing || draggedPinIndex === null || !mapContainerRef.current) return;

        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        const width = mapContainerRef.current.clientWidth;
        const height = mapContainerRef.current.clientHeight;

        // Use fixed coordinate system like AddFieldModal
        const lng = 44.8 + (x / width - 0.5) * 0.05;
        const lat = 41.7 - (y / height - 0.5) * 0.05;

        setEditBoundary(prev => {
            const newBoundary = [...prev];
            newBoundary[draggedPinIndex] = [lng, lat];

            // If point 0 changes and it's a closed polygon, update the last point too
            if (draggedPinIndex === 0 && newBoundary.length > 2 &&
                newBoundary[0][0] === newBoundary[newBoundary.length - 1][0] &&
                newBoundary[0][1] === newBoundary[newBoundary.length - 1][1]) {
                newBoundary[newBoundary.length - 1] = [lng, lat];
            }
            return newBoundary;
        });
    };

    const handlePinMouseDown = (e: React.MouseEvent, index: number) => {
        if (!isEditing) return;
        e.stopPropagation();
        setDraggedPinIndex(index);
    };

    const handleMouseUp = () => {
        setDraggedPinIndex(null);
    };

    const handleSaveBoundary = () => {
        if (!field) return;

        // Recalculate Acres
        let newAcres = field.acres;
        if (editBoundary.length > 2) {
            try {
                const polygon = turf.polygon([editBoundary]);
                newAcres = parseFloat(areaToAcres(turf.area(polygon)).toFixed(1));
            } catch (e) { }
        }

        updateField(field.id, {
            coordinates: editBoundary,
            acres: newAcres
        });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditBoundary([]);
    };

    // Simulate processing completion for new fields
    useEffect(() => {
        if (isNewField && isProcessing) {
            const timer = setTimeout(() => setIsProcessing(false), 4500);
            return () => clearTimeout(timer);
        }
    }, [isNewField, isProcessing]);

    const generatedOverlays = useMemo(() => {
        if (!field) return {};
        return {
            pest: getFieldOverlay(field.id, 'pest'),
            disease: getFieldOverlay(field.id, 'disease'),
            weed: getFieldOverlay(field.id, 'weed'),
        };
    }, [field]);

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

    // Memoize LIDAR Overlay to prevent re-calculation on every render (especially during zoom/pan)
    const lidarOverlaySvg = useMemo(() => {
        if (activeLayer.startsWith('lidar-') && field) {
            const type = activeLayer === 'lidar-elevation' ? 'elevation' :
                activeLayer === 'lidar-absolute' ? 'absolute' : 'crop-height';
            return getFieldOverlay(field.id, type as any).svg;
        }
        return null;
    }, [activeLayer, field]);

    return (
        <AppShell>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-white/10 shrink-0">
                    <Link href="/fields" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Fields
                    </Link>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{field.name}</h1>
                            <p className="text-muted-foreground mt-1">
                                {field.crop} • {field.acres} acres • Planted {new Date(field.plantingDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setComparisonMode(!comparisonMode)}
                                className={cn(
                                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                                    comparisonMode ? "bg-primary text-primary-foreground" : "bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <GitCompare className="w-4 h-4" />
                                {comparisonMode ? 'Exit' : 'Compare'}
                            </button>
                            <button
                                onClick={() => setIsHarvestModalOpen(true)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Leaf className="w-4 h-4" />
                                Log Harvest
                            </button>
                            <button
                                onClick={() => setPestMonitorOpen(true)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Bug className="w-4 h-4" />
                                Pest & Disease
                            </button>
                            <button
                                onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                                className={cn(
                                    "px-4 py-2 rounded-lg flex items-center gap-2 transition-colors",
                                    isEditing
                                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
                                        : "bg-white/5 hover:bg-white/10 text-yellow-400 border border-yellow-400/20"
                                )}
                            >
                                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                {isEditing ? 'Cancel Edit' : 'Edit Boundary'}
                            </button>
                            {isEditing && (
                                <button
                                    onClick={handleSaveBoundary}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Save Changes
                                </button>
                            )}
                            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors">
                                <Download className="w-4 h-4" />
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="w-full px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
                        {/* Map View Section */}
                        <div className="h-[600px] md:h-[1000px] relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            {/* Multispectral Image Display */}
                            {/* Multispectral Image Display */}
                            {comparisonMode ? (
                                <ComparisonSlider
                                    leftImage={(() => {
                                        if (activeLayer.startsWith('lidar-')) {
                                            const type = activeLayer === 'lidar-elevation' ? 'elevation' :
                                                activeLayer === 'lidar-absolute' ? 'absolute' : 'crop-height';
                                            const overlay = getFieldOverlay(field.id, type as any);
                                            return `data:image/svg+xml;utf8,${encodeURIComponent(overlay.svg)}`;
                                        }
                                        return LAYER_IMAGES[activeLayer];
                                    })()}
                                    leftLabel={currentLayer?.name || ''}
                                    rightImage={(() => {
                                        if (comparisonLayer.startsWith('lidar-')) {
                                            const type = comparisonLayer === 'lidar-elevation' ? 'elevation' :
                                                comparisonLayer === 'lidar-absolute' ? 'absolute' : 'crop-height';
                                            const overlay = getFieldOverlay(field.id, type as any);
                                            return `data:image/svg+xml;utf8,${encodeURIComponent(overlay.svg)}`;
                                        }
                                        return LAYER_IMAGES[comparisonLayer];
                                    })()}
                                    rightLabel={currentComparisonLayer?.name || ''}
                                    className="absolute inset-0"
                                />
                            ) : (
                                <div
                                    className="absolute inset-0 overflow-hidden cursor-move"
                                    onWheel={(e) => {
                                        // e.preventDefault(); // React synthetic events don't support preventDefault on wheel in some cases, but we can try
                                        const scaleAmount = -e.deltaY * 0.001;
                                        setZoom(z => Math.min(Math.max(1, z + scaleAmount), 5));
                                    }}
                                    onMouseDown={(e) => {
                                        setIsDragging(true);
                                        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                                    }}
                                    onMouseMove={(e) => {
                                        if (isDragging) {
                                            setPan({
                                                x: e.clientX - dragStart.x,
                                                y: e.clientY - dragStart.y
                                            });
                                        }
                                    }}
                                    onMouseUp={() => setIsDragging(false)}
                                    onMouseLeave={() => setIsDragging(false)}
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
                                            src={activeLayer === 'rgb' && field.image ? field.image : LAYER_IMAGES[activeLayer]}
                                            alt={currentLayer?.name || ''}
                                            fill
                                            className="object-contain"
                                            priority
                                        />

                                        {/* Field Boundary Overlay (Drawn with pins) */}
                                        <div className="absolute inset-0 z-20">
                                            {isEditing ? (
                                                /* EDIT MODE: Simple pixel-based SVG */
                                                <svg
                                                    className="w-full h-full absolute inset-0"
                                                    ref={mapContainerRef}
                                                    onClick={handleSimulatedClick}
                                                    onMouseMove={handleSimulatedMouseMove}
                                                    onMouseUp={handleMouseUp}
                                                    onMouseLeave={handleMouseUp}
                                                >
                                                    {editBoundary.length > 1 && (() => {
                                                        const width = mapContainerRef.current?.clientWidth || 0;
                                                        const height = mapContainerRef.current?.clientHeight || 0;
                                                        if (!width || !height) return null;
                                                        
                                                        const points = editBoundary.map(coord => {
                                                            const x = ((coord[0] - 44.8) / 0.05 + 0.5) * width;
                                                            const y = (-(coord[1] - 41.7) / 0.05 + 0.5) * height;
                                                            return [x, y];
                                                        });

                                                        return (
                                                            <>
                                                                <polyline
                                                                    points={points.map(p => `${p[0]},${p[1]}`).join(" ")}
                                                                    fill="rgba(34, 197, 94, 0.3)"
                                                                    stroke="#22c55e"
                                                                    strokeWidth="3"
                                                                />
                                                                {editBoundary.length > 2 && (
                                                                    <line
                                                                        x1={points[points.length - 1][0]}
                                                                        y1={points[points.length - 1][1]}
                                                                        x2={points[0][0]}
                                                                        y2={points[0][1]}
                                                                        stroke="#22c55e"
                                                                        strokeWidth="3"
                                                                    />
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                    {editBoundary.map((coord, i) => {
                                                        const width = mapContainerRef.current?.clientWidth || 0;
                                                        const height = mapContainerRef.current?.clientHeight || 0;
                                                        if (!width || !height) return null;
                                                        const x = ((coord[0] - 44.8) / 0.05 + 0.5) * width;
                                                        const y = (-(coord[1] - 41.7) / 0.05 + 0.5) * height;

                                                        return (
                                                            <circle
                                                                key={i}
                                                                cx={x}
                                                                cy={y}
                                                                r="5"
                                                                fill={i === 0 ? "#ef4444" : "#22c55e"}
                                                                stroke="white"
                                                                strokeWidth="2"
                                                                style={{ cursor: draggedPinIndex === i ? 'grabbing' : 'grab', pointerEvents: 'auto' }}
                                                                onMouseDown={(e) => handlePinMouseDown(e, i)}
                                                            />
                                                        );
                                                    })}
                                                </svg>
                                            ) : (
                                                /* VIEW MODE: Simple Scaled SVG */
                                                <svg
                                                    viewBox="0 0 100 100"
                                                    className="w-full h-full"
                                                    preserveAspectRatio="xMidYMid meet"
                                                >
                                                    {field.coordinates && field.coordinates.length > 2 && (() => {
                                                        const coords = field.coordinates;
                                                        // NOTE: Ideally we use the same projection as edit mode for consistency, 
                                                        // but the view mode uses normalized bounding box logic to "zoom fit" the shape.
                                                        // We will keep view mode as is for now to avoid breaking the "Detail View",
                                                        // or we could switch to the simulation projection if we wanted 100% visual parity.
                                                        // Given the user wants "edit straight in the page", let's keep view mode focused on the shape.

                                                        const lons = coords.map(c => c[0]);
                                                        const lats = coords.map(c => c[1]);
                                                        const minLon = Math.min(...lons);
                                                        const maxLon = Math.max(...lons);
                                                        const minLat = Math.min(...lats);
                                                        const maxLat = Math.max(...lats);

                                                        const deltaLon = maxLon - minLon || 0.001;
                                                        const deltaLat = maxLat - minLat || 0.001;

                                                        const normalizedCoords = coords.map(c => {
                                                            const x = ((c[0] - minLon) / deltaLon) * 80 + 10;
                                                            const y = 90 - ((c[1] - minLat) / deltaLat) * 80;
                                                            return { x, y };
                                                        });

                                                        const points = normalizedCoords.map(c => `${c.x},${c.y}`).join(' ');

                                                        return (
                                                            <>
                                                                <polygon
                                                                    points={points}
                                                                    fill="rgba(34, 197, 94, 0.15)"
                                                                    stroke="#22c55e"
                                                                    strokeWidth="0.5"
                                                                    vectorEffect="non-scaling-stroke"
                                                                />
                                                                {normalizedCoords.map((c, i) => (
                                                                    <circle
                                                                        key={i}
                                                                        cx={c.x}
                                                                        cy={c.y}
                                                                        r={i === 0 ? "1.5" : "1"}
                                                                        fill={i === 0 ? "#ef4444" : "#22c55e"}
                                                                        stroke="white"
                                                                        strokeWidth="0.2"
                                                                    />
                                                                ))}
                                                            </>
                                                        );
                                                    })()}
                                                </svg>
                                            )}
                                        </div>

                                        {isNewField && isProcessing && (
                                            <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
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

                                        {/* Problem Overlays */}
                                        {activeProblemOverlays.map(overlayId => {
                                            const overlayData = generatedOverlays[overlayId as keyof typeof generatedOverlays];
                                            if (!overlayData) return null;
                                            const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(overlayData.svg)}`;
                                            return (
                                                <div
                                                    key={overlayId}
                                                    className="absolute inset-0 pointer-events-none"
                                                    style={{ opacity: overlayOpacity / 100 }}
                                                >
                                                    <img src={svgDataUrl} alt={`${overlayId} overlay`} className="w-full h-full object-contain" />
                                                </div>
                                            );
                                        })}

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
                                                            <div className="text-xs font-semibold mb-2">Soil Sample {sample.id}</div>
                                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                                <div><div className="text-muted-foreground">pH</div><div className="font-medium">{sample.ph}</div></div>
                                                                <div><div className="text-muted-foreground">Nitrogen</div><div className="font-medium">{sample.nitrogen} ppm</div></div>
                                                                <div><div className="text-muted-foreground">Moisture</div><div className="font-medium">{sample.moisture}%</div></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Layer Controls Overlay */}
                            <div className="absolute top-4 left-4 z-50 glass-panel rounded-xl p-4 w-64 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <Layers className="w-4 h-4" />
                                    {comparisonMode ? 'Left Layer' : 'Active Layer'}
                                </div>
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

                            {/* Right Controls Overlay */}
                            <div className="absolute top-4 right-4 z-50 glass-panel rounded-xl p-4 w-64 space-y-3">
                                <div className="text-sm font-medium mb-3">Analysis Overlays</div>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /><span className="text-sm">Soil Samples</span></div>
                                    <input type="checkbox" checked={showSoilOverlay} onChange={(e) => setShowSoilOverlay(e.target.checked)} className="w-4 h-4" />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-2"><Target className="w-4 h-4 text-purple-400" /><span className="text-sm">Management Zones</span></div>
                                    <input type="checkbox" checked={showZones} onChange={(e) => setShowZones(e.target.checked)} className="w-4 h-4" />
                                </label>
                                <div className="pt-3 border-t border-white/10">
                                    <div className="text-xs text-muted-foreground mb-2">Problem Overlays</div>
                                    {PROBLEM_OVERLAYS.map(overlay => (
                                        <label key={overlay.id} className="flex items-center justify-between cursor-pointer mb-2">
                                            <div className="flex items-center gap-2"><Bug className={cn("w-4 h-4", overlay.color)} /><span className="text-sm">{overlay.name}</span></div>
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
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Scouting & Analysis Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* 3D Field LIDAR Model */}
                            <div className="lg:col-span-1">

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => setPlantCountOpen(true)}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Calculator className="w-4 h-4 text-green-400" />
                                        Stand Count
                                    </button>
                                    <button
                                        onClick={() => setScoutingScheduleOpen(true)}
                                        className="flex-1 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4" />
                                        Schedule Scout
                                    </button>
                                </div>
                            </div>

                            {/* Scouting Missions List */}
                            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                        Scouting Missions
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {scoutingMissions.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No scouting missions scheduled</p>
                                        </div>
                                    ) : (
                                        scoutingMissions.map(mission => (
                                            <div key={mission.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center",
                                                        mission.status === 'completed' ? "bg-green-500/20 text-green-400" :
                                                            mission.status === 'overdue' ? "bg-red-500/20 text-red-400" :
                                                                "bg-blue-500/20 text-blue-400"
                                                    )}>
                                                        {mission.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{mission.templateId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {mission.scoutName} • {new Date(mission.date).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-medium uppercase",
                                                        mission.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                            mission.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-blue-500/20 text-blue-400'
                                                    )}>
                                                        {mission.priority}
                                                    </span>

                                                    {mission.status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleOpenReport(mission)}
                                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            Start Report
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Analysis Data Section (Simplified for brevity in this rewrite, keeping core stats) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {analysis && (
                                <div className="glass-panel p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold mb-4">Index Statistics</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="glass-panel rounded-lg p-4 bg-white/5">
                                            <div className="text-sm text-muted-foreground mb-1">NDVI Average</div>
                                            <div className="text-2xl font-bold text-green-400">{analysis.indices.ndvi.avg.toFixed(2)}</div>
                                        </div>
                                        <div className="glass-panel rounded-lg p-4 bg-white/5">
                                            <div className="text-sm text-muted-foreground mb-1">Thermal Average</div>
                                            <div className="text-2xl font-bold text-orange-400">{analysis.indices.thermal.avg.toFixed(1)}°F</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {zones.length > 0 && (
                                <div className="glass-panel p-6 rounded-2xl">
                                    <h3 className="text-lg font-semibold mb-4">Management Zones</h3>
                                    <div className="space-y-3">
                                        {zones.map(zone => (
                                            <div key={zone.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                                <div>
                                                    <div className="font-medium">{zone.name}</div>
                                                    <div className="text-xs text-muted-foreground">{zone.area} acres</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-green-400">{zone.avgNDVI.toFixed(2)} NDVI</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Modals */}
                <HarvestLogModal
                    isOpen={isHarvestModalOpen}
                    onClose={() => setIsHarvestModalOpen(false)}
                    fieldName={field.name}
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

            </div >
        </AppShell >
    );
}
