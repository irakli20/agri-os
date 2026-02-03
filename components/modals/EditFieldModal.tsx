'use client';

import { useRef, useEffect, useState } from 'react';
import {
    X,
    MapPin,
    Ruler,
    CheckCircle,
    Map as MapIcon,
    Trash2,
    Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import { areaToAcres } from '@/lib/geo-utils';
import { Field } from '@/lib/mock-data';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const IS_PLACEHOLDER_TOKEN = !MAPBOX_TOKEN || MAPBOX_TOKEN === 'your_mapbox_token_here';
mapboxgl.accessToken = MAPBOX_TOKEN;

interface EditFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    field: Field;
    onUpdate: (id: string, updates: Partial<Field>) => void;
}

const EditFieldModal = ({ isOpen, onClose, field, onUpdate }: EditFieldModalProps) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    const [boundary, setBoundary] = useState<[number, number][]>([]);
    const [acres, setAcres] = useState<string>('0');
    const [isPolygonClosed, setIsPolygonClosed] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [viewportCenter, setViewportCenter] = useState<[number, number] | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setBoundary(field.coordinates);
            setAcres(field.acres.toString());
            setIsPolygonClosed(true);
            setViewportCenter(IS_PLACEHOLDER_TOKEN
                ? [44.8, 41.7]
                : (field.coordinates.length > 0 ? field.coordinates[0] : [44.8, 41.7])
            );
        }
    }, [isOpen, field]);

    // Map initialization
    useEffect(() => {
        if (!isOpen || !mapContainerRef.current || IS_PLACEHOLDER_TOKEN) return;

        const initTimer = setTimeout(() => {
            if (!mapContainerRef.current || mapRef.current) return;

            const center = boundary.length > 0 ? boundary[0] as [number, number] : [44.8, 41.7] as [number, number];

            const map = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: center,
                zoom: 15,
                attributionControl: false
            });

            map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

            map.on('load', () => {
                map.addSource('field-boundary', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [isPolygonClosed ? [...boundary, boundary[0]] : boundary]
                        },
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
                        'line-width': 3
                    }
                });

                // Clear and recreate markers
                markersRef.current.forEach(m => m.remove());
                markersRef.current = [];

                boundary.forEach((coord, i) => {
                    const marker = new mapboxgl.Marker({
                        color: i === 0 ? '#ef4444' : '#22c55e',
                        draggable: true
                    })
                        .setLngLat(coord)
                        .addTo(map);

                    marker.on('dragend', () => {
                        const newLngLat = marker.getLngLat();
                        setBoundary(prev => {
                            const next = [...prev];
                            next[i] = [newLngLat.lng, newLngLat.lat];
                            return next;
                        });
                    });

                    markersRef.current.push(marker);
                });

                map.resize();
            });

            map.on('click', (e) => {
                if (isPolygonClosed) return;

                const newCoord: [number, number] = [e.lngLat.lng, e.lngLat.lat];
                setBoundary(prev => [...prev, newCoord]);

                const marker = new mapboxgl.Marker({
                    color: '#22c55e',
                    draggable: true
                })
                    .setLngLat(newCoord)
                    .addTo(map);

                marker.on('dragend', () => {
                    const newLngLat = marker.getLngLat();
                    setBoundary(prev => {
                        const idx = markersRef.current.indexOf(marker);
                        if (idx === -1) return prev;
                        const next = [...prev];
                        next[idx] = [newLngLat.lng, newLngLat.lat];
                        return next;
                    });
                });

                markersRef.current.push(marker);
            });

            mapRef.current = map;
        }, 100);

        return () => {
            clearTimeout(initTimer);
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];
        };
    }, [isOpen]);

    // Update map source when boundary changes
    useEffect(() => {
        if (mapRef.current && mapRef.current.isStyleLoaded() && mapRef.current.getSource('field-boundary')) {
            const source = mapRef.current.getSource('field-boundary') as mapboxgl.GeoJSONSource;
            const polyCoords = isPolygonClosed && boundary.length > 2
                ? [...boundary, boundary[0]]
                : boundary;

            source.setData({
                type: 'Feature',
                geometry: {
                    type: boundary.length > 2 ? 'Polygon' : 'LineString',
                    coordinates: boundary.length > 2 ? [polyCoords] : boundary
                } as any,
                properties: {}
            });

            // Update area
            if (boundary.length > 2) {
                try {
                    const polygon = turf.polygon([[...boundary, boundary[0]]]);
                    const areaSqM = turf.area(polygon);
                    setAcres(areaToAcres(areaSqM).toFixed(1));
                } catch (e) {
                    console.error('Invalid polygon for area calculation');
                }
            }
        }
    }, [boundary, isPolygonClosed]);

    const [draggedPinIndex, setDraggedPinIndex] = useState<number | null>(null);

    // Simulation Mode Logic
    const handleSimulatedClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!IS_PLACEHOLDER_TOKEN || !mapContainerRef.current || isPolygonClosed || draggedPinIndex !== null) return;

        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;


        const lng = 44.8 + (x / rect.width - 0.5) * 0.05;
        const lat = 41.7 - (y / rect.height - 0.5) * 0.05;

        setBoundary(prev => [...prev, [lng, lat]]);
    };

    const handleSimulatedMouseMove = (e: React.MouseEvent) => {
        if (draggedPinIndex === null || !mapContainerRef.current || boundary.length === 0) return;

        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;


        const lng = 44.8 + (x / rect.width - 0.5) * 0.05;
        const lat = 41.7 - (y / rect.height - 0.5) * 0.05;

        setBoundary(prev => {
            const next = [...prev];
            next[draggedPinIndex] = [lng, lat];
            return next;
        });
    };

    const handlePinMouseDown = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setDraggedPinIndex(index);
    };

    const handleMouseUp = () => {
        setDraggedPinIndex(null);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        onUpdate(field.id, {
            coordinates: isPolygonClosed && boundary.length > 0 ? [...boundary, boundary[0]] : boundary,
            acres: parseFloat(acres) || field.acres
        });

        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 text-white">
            <div className="glass-panel rounded-2xl w-full max-w-5xl h-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight">Edit Field Boundary</h2>
                            <p className="text-xs text-white/50">{field.name} • Adjust pins to update area</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                    {/* Map Area */}
                    <div className="flex-1 relative min-h-[300px] border-r border-white/10">
                        <div
                            ref={mapContainerRef}
                            className="absolute inset-0 bg-black/40"
                            onClick={handleSimulatedClick}
                            onMouseMove={handleSimulatedMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            style={IS_PLACEHOLDER_TOKEN ? {
                                backgroundImage: 'url(/georgia-satellite.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            } : {}}
                        />

                        {/* Simulation Pins */}
                        {IS_PLACEHOLDER_TOKEN && (
                            <div className="absolute inset-0 pointer-events-none">
                                <svg className="w-full h-full">
                                    {boundary.length > 1 && (
                                        <polyline
                                            points={boundary.map(coord => {
                                                const rect = mapContainerRef.current?.getBoundingClientRect();
                                                if (!rect) return "0,0";
                                                const x = ((coord[0] - 44.8) / 0.05 + 0.5) * rect.width;
                                                const y = (-(coord[1] - 41.7) / 0.05 + 0.5) * rect.height;
                                                return `${x},${y}`;
                                            }).join(" ")}
                                            fill={isPolygonClosed ? "rgba(34, 197, 94, 0.2)" : "none"}
                                            stroke="#22c55e"
                                            strokeWidth="3"
                                            strokeDasharray={isPolygonClosed ? "0" : "5,5"}
                                        />
                                    )}
                                </svg>
                                {boundary.map((coord, i) => {
                                    const rect = mapContainerRef.current?.getBoundingClientRect();
                                    if (!rect) return null;
                                    const x = ((coord[0] - 44.8) / 0.05 + 0.5) * rect.width;
                                    const y = (-(coord[1] - 41.7) / 0.05 + 0.5) * rect.height;

                                    return (
                                        <div
                                            key={i}
                                            className={cn(
                                                "absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-lg transition-all",
                                                i === 0 ? "bg-red-500 scale-125 z-10" : "bg-green-500",
                                                draggedPinIndex === i && "scale-150 shadow-2xl z-50 cursor-grabbing",
                                                "cursor-move pointer-events-auto"
                                            )}
                                            style={{ left: x, top: y }}
                                            onMouseDown={(e) => handlePinMouseDown(e, i)}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        <div className="absolute bottom-4 left-4 z-10 font-mono text-sm bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                            {isPolygonClosed ? 'Boundary Closed' : 'Click to add points'}
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="w-full lg:w-80 p-6 flex flex-col gap-6 bg-black/20 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="glass-panel p-4 rounded-xl border-primary/20">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Calculated Area</label>
                                <div className="flex items-end gap-2 text-2xl font-bold text-primary">
                                    {acres}
                                    <span className="text-xs mb-1.5 text-white/60">AC</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setBoundary([]);
                                    setIsPolygonClosed(false);
                                    markersRef.current.forEach(m => m.remove());
                                    markersRef.current = [];
                                }}
                                className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-all text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Reset Boundary
                            </button>

                            {boundary.length > 2 && !isPolygonClosed && (
                                <button
                                    onClick={() => setIsPolygonClosed(true)}
                                    className="w-full py-3 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl border border-green-500/20 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Close Polygon
                                </button>
                            )}
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting || boundary.length < 3 || !isPolygonClosed}
                                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 px-6 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all text-white/60"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { EditFieldModal };
