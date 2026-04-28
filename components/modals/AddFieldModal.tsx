'use client';

import { useRef, useEffect, useState } from 'react';
import {
    X,
    MapPin,
    Sprout,
    Ruler,
    Calendar,
    CheckCircle,
    Map as MapIcon,
    Trash2,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { areaToAcres, formatArea } from '@/lib/geo-utils';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const IS_PLACEHOLDER_TOKEN = !MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_token_here';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface AddFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (field: any) => void;
}

const CROPS = ['Corn', 'Soybeans', 'Wheat', 'Cotton', 'Rice', 'Sunflowers', 'Potatoes', 'Grapes (Vineyard)'];

export function AddFieldModal({ isOpen, onClose, onSubmit }: AddFieldModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        crop: '',
        acres: '',
        plantingDate: '',
        soilType: '',
        irrigationType: '',
        boundary: [] as [number, number][]
    });

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isPolygonClosed, setIsPolygonClosed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFormData({
                name: '',
                crop: '',
                acres: '',
                plantingDate: '',
                soilType: '',
                irrigationType: '',
                boundary: []
            });
            setIsPolygonClosed(false);
            setIsSuccess(false);
            setIsDrawing(false);
            if (uploadedImage) {
                URL.revokeObjectURL(uploadedImage);
                setUploadedImage(null);
            }
        }
    }, [isOpen]);

    // Cleanup object URL on unmount
    useEffect(() => {
        return () => {
            if (uploadedImage) {
                URL.revokeObjectURL(uploadedImage);
            }
        };
    }, [uploadedImage]);

    useEffect(() => {
        if (!isOpen || !mapContainerRef.current) return;

        // Simulation Mode: No Mapbox token, use static image and coordinate simulation
        if (IS_PLACEHOLDER_TOKEN) {
            console.log('Agri-OS: Mapbox token is placeholder. Entering Satellite Simulation Mode.');
            return;
        }

        // Initialize Mapbox with a slightly delayed timeout to ensure container is fully rendered/sized
        const initTimer = setTimeout(() => {
            if (!mapContainerRef.current || mapRef.current) return;

            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [44.8, 41.7], // Georgia (Country center is approx here)
                zoom: 12, // Zoomed in closer for field definition
                attributionControl: false
            });

            map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

            map.on('load', () => {
                map.addSource('field-boundary', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: { type: 'Polygon', coordinates: [[]] },
                        properties: {}
                    }
                });

                map.addLayer({
                    id: 'field-boundary-fill',
                    type: 'fill',
                    source: 'field-boundary',
                    paint: {
                        'fill-color': '#22c55e',
                        'fill-opacity': 0.3
                    }
                });

                map.addLayer({
                    id: 'field-boundary-outline',
                    type: 'line',
                    source: 'field-boundary',
                    paint: {
                        'line-color': '#22c55e',
                        'line-width': 2
                    }
                });

                // Explicitly trigger a resize to ensure it fits the container
                map.resize();
            });

            map.on('click', (e) => {
                if (isPolygonClosed) return;

                const newCoord: [number, number] = [e.lngLat.lng, e.lngLat.lat];

                setFormData((prev: any) => {
                    const newBoundary = [...prev.boundary, newCoord];

                    // Update Source
                    const source = map.getSource('field-boundary') as mapboxgl.GeoJSONSource;
                    if (source) {
                        const isClosing = newBoundary.length > 2 &&
                            turf.distance(newCoord, newBoundary[0], { units: 'meters' }) < 20;

                        let geometry: any;
                        if (isPolygonClosed || isClosing) {
                            geometry = {
                                type: 'Polygon',
                                coordinates: [[...newBoundary.slice(0, -1), newBoundary[0]]]
                            };
                            setIsPolygonClosed(true);
                        } else {
                            geometry = {
                                type: 'LineString',
                                coordinates: newBoundary
                            };
                        }

                        source.setData({
                            type: 'Feature',
                            geometry,
                            properties: {}
                        });

                        if (isClosing) {
                            return { ...prev, boundary: newBoundary.slice(0, -1) };
                        }
                    }

                    // Add Marker
                    const marker = createMarker(map, newCoord, newBoundary.length - 1);

                    // If first marker, add click listener to close
                    if (newBoundary.length === 1) {
                        marker.getElement().addEventListener('click', (ev) => {
                            ev.stopPropagation();
                            if (formData.boundary.length >= 3) {
                                setIsPolygonClosed(true);
                            }
                        });
                        marker.getElement().style.cursor = 'pointer';
                    }

                    // Calculate Area
                    if (newBoundary.length > 2) {
                        const polygonBound = isPolygonClosed ? [...newBoundary] : [...newBoundary, newBoundary[0]];
                        const polygon = turf.polygon([polygonBound]);
                        const areaSqM = turf.area(polygon);
                        const acres = areaToAcres(areaSqM);
                        return { ...prev, boundary: newBoundary, acres: acres.toFixed(1) };
                    }

                    return { ...prev, boundary: newBoundary };
                });
            });

            mapRef.current = map;
        }, 100);

        return () => {
            clearTimeout(initTimer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            // Clean up markers
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];
        };
    }, [isOpen]);

    // ---- PIN SYSTEM (rewritten from scratch) ----
    const overlayRef = useRef<HTMLDivElement>(null);
    const [dragIdx, setDragIdx] = useState<number | null>(null);
    const dragStartRef = useRef<{ mx: number; my: number; coord: [number, number] } | null>(null);
    const wasDragRef = useRef(false);

    // Convert a pixel position (relative to the overlay) to [lng, lat]
    const pxToCoord = (px: number, py: number, w: number, h: number): [number, number] => {
        const lng = 44.8 + (px / w - 0.5) * 0.05;
        const lat = 41.7 - (py / h - 0.5) * 0.05;
        return [lng, lat];
    };

    // Convert a [lng, lat] to pixel position (relative to the overlay)
    const coordToPx = (coord: [number, number], w: number, h: number): { x: number; y: number } => {
        const x = ((coord[0] - 44.8) / 0.05 + 0.5) * w;
        const y = (-(coord[1] - 41.7) / 0.05 + 0.5) * h;
        return { x, y };
    };

    // Mapbox Draggable Markers
    const createMarker = (map: mapboxgl.Map, coord: [number, number], index: number) => {
        const marker = new mapboxgl.Marker({
            color: '#22c55e',
            scale: 0.8,
            draggable: true
        })
            .setLngLat(coord)
            .addTo(map);

        marker.on('dragend', () => {
            const newLngLat = marker.getLngLat();
            setFormData((prev: any) => {
                const newBoundary = [...prev.boundary];
                newBoundary[index] = [newLngLat.lng, newLngLat.lat];

                // Recalculate area if enough points
                let newAcres = prev.acres;
                if (newBoundary.length > 2) {
                    try {
                        const poly = turf.polygon([[...newBoundary, newBoundary[0]]]);
                        newAcres = areaToAcres(turf.area(poly)).toFixed(1);
                    } catch (e) { }
                }

                return { ...prev, boundary: newBoundary, acres: newAcres };
            });
        });

        markersRef.current.push(marker);
        return marker;
    };

    // ---------- CLICK TO PLACE A NEW PIN ----------
    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!IS_PLACEHOLDER_TOKEN || isPolygonClosed || dragIdx !== null) return;

        // Auto-start drawing on first click
        if (!isDrawing) setIsDrawing(true);

        const el = overlayRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const newCoord = pxToCoord(px, py, rect.width, rect.height);

        setFormData((prev: any) => {
            const newBoundary = [...prev.boundary, newCoord];
            let newAcres = prev.acres;
            if (newBoundary.length > 2) {
                try {
                    const polygon = turf.polygon([[...newBoundary, newBoundary[0]]]);
                    newAcres = areaToAcres(turf.area(polygon)).toFixed(1);
                } catch (_) { }
            }
            return { ...prev, boundary: newBoundary, acres: newAcres };
        });
    };

    // ---------- PIN MOUSE DOWN (start drag) ----------
    const handlePinDown = (e: React.MouseEvent, idx: number, coord: [number, number]) => {
        e.stopPropagation(); // prevent map click
        e.preventDefault();  // prevent text selection
        setDragIdx(idx);
        wasDragRef.current = false;
        dragStartRef.current = { mx: e.clientX, my: e.clientY, coord: [...coord] };
    };

    // ---------- MOUSE MOVE (drag pin) ----------
    const handleOverlayMouseMove = (e: React.MouseEvent) => {
        if (dragIdx === null || !dragStartRef.current || !overlayRef.current) return;

        const dx = e.clientX - dragStartRef.current.mx;
        const dy = e.clientY - dragStartRef.current.my;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
            wasDragRef.current = true;
        }

        if (!wasDragRef.current) return;

        const rect = overlayRef.current.getBoundingClientRect();
        const dLng = (dx / rect.width) * 0.05;
        const dLat = -(dy / rect.height) * 0.05;
        const newLng = dragStartRef.current.coord[0] + dLng;
        const newLat = dragStartRef.current.coord[1] + dLat;

        setFormData((prev: any) => {
            const newBoundary = [...prev.boundary];
            newBoundary[dragIdx] = [newLng, newLat];
            let newAcres = prev.acres;
            if (newBoundary.length > 2) {
                try {
                    const polygon = turf.polygon([[...newBoundary, newBoundary[0]]]);
                    newAcres = areaToAcres(turf.area(polygon)).toFixed(1);
                } catch (_) { }
            }
            return { ...prev, boundary: newBoundary, acres: newAcres };
        });
    };

    // ---------- MOUSE UP (end drag) ----------
    const handleOverlayMouseUp = () => {
        if (dragIdx !== null) {
            // Delay clearing wasDrag so pin onClick can see it
            setTimeout(() => { wasDragRef.current = false; }, 100);
        }
        setDragIdx(null);
        dragStartRef.current = null;
    };

    // ---------- PIN CLICK (close polygon or no-op) ----------
    const handlePinClick = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation(); // ALWAYS prevent map click
        if (wasDragRef.current) return; // was a drag, not a click

        if (idx === 0 && formData.boundary.length >= 3) {
            setIsPolygonClosed(true);
            const polygonBound = [...formData.boundary, formData.boundary[0]];
            const polygon = turf.polygon([polygonBound]);
            const acres = areaToAcres(turf.area(polygon));
            setFormData(prev => ({ ...prev, acres: acres.toFixed(1) }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to a persistent base64 data URL (blob URLs die on navigation)
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                // Compress via canvas to keep localStorage size reasonable
                const canvas = document.createElement('canvas');
                const MAX_SIZE = 800;
                let w = img.width;
                let h = img.height;
                if (w > MAX_SIZE || h > MAX_SIZE) {
                    const ratio = Math.min(MAX_SIZE / w, MAX_SIZE / h);
                    w = Math.round(w * ratio);
                    h = Math.round(h * ratio);
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, w, h);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                setUploadedImage(dataUrl);
                setIsDrawing(true);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    if (!isOpen) return null;

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const coordinates = formData.boundary.length > 2
            ? [...formData.boundary, formData.boundary[0]] // Ensure closed polygon
            : formData.boundary.length > 0 ? formData.boundary : [[0, 0]];

        const newField = {
            id: `field-${Date.now()}`,
            name: formData.name,
            acres: parseFloat(formData.acres) || 0,
            crop: formData.crop,
            plantingDate: formData.plantingDate || new Date().toISOString().split('T')[0],
            ndviScore: 0.15,
            healthStatus: 'attention' as const,
            farmingStage: 'scouted' as const,
            cropStage: 'none' as const,
            lastFlightDate: new Date().toISOString().split('T')[0],
            coordinates: coordinates,
            image: uploadedImage || '/ndvi-field.png'
        };

        onSubmit?.(newField);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8">
            <div className="glass-panel rounded-2xl w-full max-w-[95vw] h-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Field Added!' : 'Add New Field'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Field registered successfully' : 'Define boundaries and crop details'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Steps */}
                {!isSuccess && (
                    <div className="px-6 pt-4 shrink-0">
                        <div className="flex items-center justify-between max-w-2xl mx-auto">
                            {['Boundaries', 'Crop Details', 'Review'].map((label, i) => (
                                <div key={label} className="flex items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                        step > i + 1 ? "bg-green-500 text-white" :
                                            step === i + 1 ? "bg-primary text-primary-foreground" :
                                                "bg-white/10 text-muted-foreground"
                                    )}>
                                        {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        "ml-2 text-sm hidden sm:block",
                                        step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground"
                                    )}>
                                        {label}
                                    </span>
                                    {i < 2 && (
                                        <div className={cn(
                                            "w-12 sm:w-24 h-0.5 mx-2 sm:mx-4",
                                            step > i + 1 ? "bg-green-500" : "bg-white/10"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-6 h-full">
                        {isSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Field Registered</h3>
                                <p className="text-muted-foreground mb-8 max-w-md">
                                    <span className="text-foreground font-medium">{formData.name}</span> ({formData.acres} acres) has been successfully added to your farm management system.
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setStep(1);
                                            setFormData({
                                                name: '', crop: '', acres: '', plantingDate: '', soilType: '', irrigationType: '', boundary: []
                                            });
                                            setIsPolygonClosed(false);
                                            setIsDrawing(false);
                                            markersRef.current.forEach(m => m.remove());
                                            markersRef.current = [];
                                            setIsSuccess(false);
                                        }}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors font-medium text-lg"
                                    >
                                        Add Another Field
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-bold text-lg"
                                    >
                                        Return to Dashboard
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Boundaries */}
                                {step === 1 && (
                                    <div className="flex flex-col h-full space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Field Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => updateField('name', e.target.value)}
                                                    placeholder="e.g., North Valley Extension"
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground bg-white/5 p-4 rounded-xl border border-white/10 h-full">
                                                <div className="flex items-center gap-2">
                                                    <Ruler className="w-4 h-4 text-primary" />
                                                    <span>Live Area Calculation:</span>
                                                </div>
                                                <div className="font-mono font-bold text-xl text-foreground">
                                                    {formData.acres || '0.0'} acres
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-sm font-medium transition-all flex items-center gap-2"
                                            >
                                                <Upload className="w-4 h-4 text-primary" />
                                                {uploadedImage ? 'Change Map Image' : 'Upload Custom Map'}
                                            </button>
                                            {uploadedImage && (
                                                <button
                                                    onClick={() => {
                                                        if (uploadedImage) URL.revokeObjectURL(uploadedImage);
                                                        setUploadedImage(null);
                                                    }}
                                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 text-sm font-medium transition-all flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove Image
                                                </button>
                                            )}
                                        </div>

                                        <div
                                            ref={overlayRef}
                                            className="flex-1 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative min-h-[400px] cursor-crosshair"
                                            onClick={handleMapClick}
                                            onMouseMove={handleOverlayMouseMove}
                                            onMouseUp={handleOverlayMouseUp}
                                            onMouseLeave={handleOverlayMouseUp}
                                        >
                                            <div
                                                ref={mapContainerRef}
                                                className="absolute inset-0"
                                                style={IS_PLACEHOLDER_TOKEN ? {
                                                    backgroundImage: `url(${uploadedImage || '/ndvi-field.png'})`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                } : {}}
                                            />

                                            {/* Simulated Pins Overlay */}
                                            {IS_PLACEHOLDER_TOKEN && (
                                                <div className="absolute inset-0 pointer-events-none z-20">
                                                    <svg className="w-full h-full">
                                                        {formData.boundary.length > 1 && (
                                                            <polyline
                                                                points={formData.boundary.map(coord => {
                                                                    const el = overlayRef.current;
                                                                    if (!el) return "0,0";
                                                                    const { x, y } = coordToPx(coord, el.clientWidth, el.clientHeight);
                                                                    return `${x},${y}`;
                                                                }).join(" ")}
                                                                fill={isPolygonClosed ? "rgba(34, 197, 94, 0.3)" : "none"}
                                                                stroke="#22c55e"
                                                                strokeWidth="3"
                                                                strokeDasharray={isPolygonClosed ? "0" : "5,5"}
                                                            />
                                                        )}
                                                        {isPolygonClosed && formData.boundary.length > 2 && (() => {
                                                            const el = overlayRef.current;
                                                            if (!el) return null;
                                                            const w = el.clientWidth;
                                                            const h = el.clientHeight;
                                                            const last = coordToPx(formData.boundary[formData.boundary.length - 1], w, h);
                                                            const first = coordToPx(formData.boundary[0], w, h);
                                                            return (
                                                                <line
                                                                    x1={last.x} y1={last.y}
                                                                    x2={first.x} y2={first.y}
                                                                    stroke="#22c55e"
                                                                    strokeWidth="3"
                                                                />
                                                            );
                                                        })()}
                                                    </svg>
                                                    {formData.boundary.map((coord, i) => {
                                                        const el = overlayRef.current;
                                                        if (!el) return null;
                                                        const { x, y } = coordToPx(coord, el.clientWidth, el.clientHeight);

                                                        return (
                                                            <div
                                                                key={i}
                                                                className={cn(
                                                                    "absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white shadow-xl flex items-center justify-center",
                                                                    i === 0 ? "bg-red-500 scale-125 z-30 cursor-pointer pointer-events-auto" : "bg-green-500 scale-100 z-20 cursor-move pointer-events-auto",
                                                                    dragIdx === i && "scale-125 shadow-2xl z-40"
                                                                )}
                                                                style={{ left: x, top: y }}
                                                                onMouseDown={(e) => handlePinDown(e, i, coord)}
                                                                onClick={(e) => handlePinClick(e, i)}
                                                            >
                                                                {i === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {!isDrawing && formData.boundary.length === 0 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] z-10">
                                                    <button
                                                        onClick={() => {
                                                            setIsDrawing(true);
                                                            if (mapRef.current) {
                                                                mapRef.current.resize();
                                                            }
                                                        }}
                                                        className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-2xl hover:bg-primary/90 transition-all flex items-center gap-3 scale-110 active:scale-100"
                                                    >
                                                        <MapIcon className="w-6 h-6" />
                                                        Start Placing Pins
                                                    </button>
                                                </div>
                                            )}

                                            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                                <div className="bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-sm font-medium text-white flex items-center gap-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                                                    {formData.boundary.length < 3 ? 'Click 3 points to define area' : 'Click to add more points'}
                                                </div>
                                                {formData.boundary.length > 0 && (
                                                    <div className="flex gap-2">
                                                        {formData.boundary.length >= 3 && !isPolygonClosed && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsPolygonClosed(true);

                                                                    const polygonBound = [...formData.boundary, formData.boundary[0]];
                                                                    const polygon = turf.polygon([polygonBound]);
                                                                    const areaSqM = turf.area(polygon);
                                                                    const acres = areaToAcres(areaSqM);
                                                                    setFormData(prev => ({ ...prev, acres: acres.toFixed(1) }));

                                                                    if (mapRef.current) {
                                                                        const source = mapRef.current.getSource('field-boundary') as mapboxgl.GeoJSONSource;
                                                                        if (source) {
                                                                            source.setData({
                                                                                type: 'Feature',
                                                                                geometry: {
                                                                                    type: 'Polygon',
                                                                                    coordinates: [polygonBound]
                                                                                },
                                                                                properties: {}
                                                                            });
                                                                        }
                                                                    }
                                                                }}
                                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl border border-green-400/20 text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Close Field
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormData(prev => ({ ...prev, boundary: [], acres: '' }));
                                                                setIsPolygonClosed(false);
                                                                markersRef.current.forEach(m => m.remove());
                                                                markersRef.current = [];
                                                                if (mapRef.current) {
                                                                    const source = mapRef.current.getSource('field-boundary') as mapboxgl.GeoJSONSource;
                                                                    if (source) source.setData({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [[]] }, properties: {} });
                                                                }
                                                            }}
                                                            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-4 py-2 rounded-xl border border-red-500/20 text-xs font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-red-500/20"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Reset Drawing
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Crop Details */}
                                {step === 2 && (
                                    <div className="max-w-3xl mx-auto space-y-8 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 uppercase tracking-wide opacity-70">Current Crop</label>
                                                <select
                                                    value={formData.crop}
                                                    onChange={(e) => updateField('crop', e.target.value)}
                                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-lg"
                                                >
                                                    <option value="">Select Primary Crop</option>
                                                    {CROPS.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 uppercase tracking-wide opacity-70">Field Area (Acres)</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={formData.acres}
                                                        onChange={(e) => updateField('acres', e.target.value)}
                                                        placeholder="42.5"
                                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                                                    />
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">AC</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2 uppercase tracking-wide opacity-70">Planting Date</label>
                                                <div className="relative">
                                                    <input
                                                        type="date"
                                                        value={formData.plantingDate}
                                                        onChange={(e) => updateField('plantingDate', e.target.value)}
                                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                                                    />
                                                    <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 uppercase tracking-wide opacity-70">Soil Classification</label>
                                                <select
                                                    value={formData.soilType}
                                                    onChange={(e) => updateField('soilType', e.target.value)}
                                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-lg"
                                                >
                                                    <option value="">Select Soil Profile</option>
                                                    <option value="loam">Loam / Alluvial</option>
                                                    <option value="sandy">Sandy / Sandy Loam</option>
                                                    <option value="clay">Heavy Clay</option>
                                                    <option value="silt">Silt / Muck</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 uppercase tracking-wide opacity-70">Irrigation System</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {['pivot', 'drip', 'flood', 'none'].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => updateField('irrigationType', type)}
                                                        className={cn(
                                                            "px-4 py-3 rounded-xl border text-sm font-medium transition-all capitalize",
                                                            formData.irrigationType === type
                                                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                                                        )}
                                                    >
                                                        {type === 'none' ? 'Rainfed' : type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Review */}
                                {step === 3 && (
                                    <div className="max-w-2xl mx-auto space-y-6 py-4">
                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                <h3 className="text-xl font-bold">Registration Summary</h3>
                                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-widest">Ready to Commit</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                <div className="space-y-1">
                                                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Field Name</div>
                                                    <div className="text-lg font-semibold">{formData.name}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Crop Allocation</div>
                                                    <div className="text-lg font-semibold flex items-center gap-2">
                                                        <Sprout className="w-5 h-5 text-green-400" />
                                                        {formData.crop}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Calculated Area</div>
                                                    <div className="text-lg font-semibold">{formData.acres} acres</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Target Planting</div>
                                                    <div className="text-lg font-semibold">{formData.plantingDate || 'Not specified'}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Infrastructure</div>
                                                    <div className="text-lg font-semibold capitalize">{formData.soilType || 'N/A'} Soil / {formData.irrigationType || 'N/A'} Irrigation</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4 shadow-inner">
                                            <MapPin className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <div className="font-bold text-blue-400 mb-1">Automated Geospatial Analysis</div>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    Agri-OS will automatically begin processing satellite imagery for this coordinate set. Initial NDVI and health baseline models will be generated within 24 hours.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between bg-black/20 shrink-0">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all font-medium"
                        >
                            {step === 1 ? 'Cancel Registration' : 'Previous Step'}
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={
                                (step === 1 && (!formData.name || !isPolygonClosed)) ||
                                (step === 2 && (!formData.crop || !formData.acres)) ||
                                isSubmitting
                            }
                            className={cn(
                                "px-12 py-3 bg-primary text-primary-foreground rounded-xl transition-all font-bold text-lg",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale",
                                "hover:bg-primary/90 shadow-xl shadow-primary/20"
                            )}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Synchronizing...
                                </div>
                            ) : step === 3 ? 'Confirm & Create Field' : 'Save & Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
