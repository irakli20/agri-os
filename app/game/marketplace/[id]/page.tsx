'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { useGameStore } from '@/lib/game-store';
import { MARKETPLACE_FIELDS } from '@/lib/marketplace-data';
import { ChevronLeft, MapPin, Search, TestTube2, Bot, CheckCircle, Loader2, ArrowRight, BookOpen, History, FlaskConical, Plane, Building2, Wind, Droplets, Leaf, Activity, Beaker, Map as MapIcon, FileText, CheckCircle2, ChevronRight, X, AlertTriangle, Sprout, Tractor, GripHorizontal } from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DeepResearchModal } from '@/components/modals/DeepResearchModal';
import { DroneSurveyModal, DroneConfig } from '@/components/modals/DroneSurveyModal';
import { SoilTestModal, SoilConfig } from '@/components/modals/SoilTestModal';

export default function MarketplaceFieldDetailsPage({ params }: { params: { id: string } }) {
    const { rentField, players, currentPlayerId } = useGameStore();
    const router = useRouter();
    const field = MARKETPLACE_FIELDS.find(f => f.id === params.id);
    const player = players.find(p => p.id === currentPlayerId);

    // Provide a safe default for area if it is 'sizeHectares'
    const fieldAreaHa = field?.sizeHectares || 100;

    // Assessment Flow States
    const [isDroneModalOpen, setIsDroneModalOpen] = useState(false);
    const [droneConfig, setDroneConfig] = useState<DroneConfig | null>(null);
    const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
    const [soilConfig, setSoilConfig] = useState<SoilConfig | null>(null);

    // Map Interaction States for Manual Soil Testing
    const [isManualPlacing, setIsManualPlacing] = useState(false);
    type SoilPinData = {
        id: string;
        x: number;
        y: number;
        score: number;
        general: { ph: string; moisture: number; om: string; cec: number; };
        macro: { n: number; p: number; k: number; ca: number; mg: number; s: number; };
        micro: { fe: number; zn: string; mn: number; cu: string; b: string; };
    };
    const [manualPins, setManualPins] = useState<SoilPinData[]>([]);
    const [hoveredPin, setHoveredPin] = useState<SoilPinData | null>(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isScouting, setIsScouting] = useState(false);
    const [isTestingSoil, setIsTestingSoil] = useState(false);
    const [scoutComplete, setScoutComplete] = useState(false);
    const [soilTestComplete, setSoilTestComplete] = useState(false);
    const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
    const [displayedAnalysisText, setDisplayedAnalysisText] = useState("");

    // Remediation State
    const [remediationEstimates, setRemediationEstimates] = useState<{ fertilizerStr: string, fertCost: number, herbicideStr: string, herbCost: number, totalCost: number } | null>(null);

    // Deep Research States
    const [isGeneratingResearch, setIsGeneratingResearch] = useState(false);
    const [isDeepResearchOpen, setIsDeepResearchOpen] = useState(false);
    const [deepResearchTab, setDeepResearchTab] = useState<'executive' | 'terrain' | 'remediation' | 'chemistry' | 'climate' | 'crops' | 'infrastructure'>('executive');

    // Right Panel Visibility
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    // Map Interaction States
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [selectedSoilSample, setSelectedSoilSample] = useState<number | null>(null);

    const mapZoomContainerRef = useRef<HTMLDivElement>(null);
    const dragStartPosRef = useRef<{ x: number, y: number } | null>(null);
    const isDraggingRef = useRef(false);
    const DRAG_THRESHOLD = 5;

    useEffect(() => {
        const container = mapZoomContainerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const scaleAmount = -e.deltaY * 0.001;
            setZoom(z => Math.min(Math.max(0.2, z + scaleAmount), 5));
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    if (!field) {
        return notFound();
    }

    const isOwned = player?.ownedFieldIds.includes(field.id) || false;
    const isRented = player?.rentedFieldIds.includes(field.id) || false;

    // Determine if AI is available (needs at least one assessment)
    const canAnalyze = scoutComplete || soilTestComplete;
    const qualityScore = field.overallRating * 20;

    const generateMockSampleData = (index: number) => ({
        id: index.toString(),
        score: qualityScore + (Math.random() * 20 - 10), // Vary score slightly
        general: {
            ph: (6.0 + Math.random() * 1.5).toFixed(1),
            moisture: Math.floor(35 + Math.random() * 20),
            om: (3 + Math.random() * 2).toFixed(1),
            cec: Math.floor(10 + Math.random() * 15)
        },
        macro: {
            n: Math.floor(100 + Math.random() * 50),
            p: Math.floor(30 + Math.random() * 30),
            k: Math.floor(150 + Math.random() * 100),
            ca: Math.floor(1000 + Math.random() * 1000),
            mg: Math.floor(200 + Math.random() * 100),
            s: Math.floor(10 + Math.random() * 10)
        },
        micro: {
            fe: Math.floor(20 + Math.random() * 20),
            zn: (3 + Math.random() * 5).toFixed(1),
            mn: Math.floor(10 + Math.random() * 10),
            cu: (1 + Math.random() * 2).toFixed(1),
            b: (0.5 + Math.random() * 1).toFixed(1)
        }
    });

    // Generate 3 mock soil samples with comprehensive nutrient data
    const mockSoilSamples: SoilPinData[] = [
        { x: 30, y: 30, ...generateMockSampleData(1), id: '1' },
        { x: 70, y: 40, ...generateMockSampleData(2), id: '2' },
        { x: 50, y: 70, ...generateMockSampleData(3), id: '3' },
    ];

    // Combine standard mock samples with manually placed ones, ONLY if test is fully complete
    const activePinsObjects = isManualPlacing ? manualPins : (soilTestComplete ? (soilConfig?.density === 'manual' ? manualPins : mockSoilSamples) : []);

    // Simulated assessment data based on field properties
    const mockAssessment = {
        ndvi: (qualityScore / 100 * 0.85).toFixed(2),
        weedPressure: qualityScore < 70 ? "High" : "Low",
        soilMoisture: "45%",
        npk: qualityScore > 80 ? "Optimal" : "Deficient N",
        compaction: "Moderate"
    };

    const handleConfirmDrone = (config: DroneConfig, cost: number) => {
        setIsDroneModalOpen(false);
        setDroneConfig(config);
        setIsScouting(true);
        setTimeout(() => {
            setIsScouting(false);
            setScoutComplete(true);
            generateRemediationEstimate();
        }, 3000);
    };

    const handleConfirmSoil = (config: SoilConfig, cost: number) => {
        setIsSoilModalOpen(false);
        setSoilConfig(config);
        setIsTestingSoil(true);
        setTimeout(() => {
            setIsTestingSoil(false);
            setSoilTestComplete(true);
            setIsManualPlacing(false); // End manual placement mode if it was active
            generateRemediationEstimate();
        }, 4000);
    };

    const handleManualPlacementStart = (config: SoilConfig) => {
        setIsSoilModalOpen(false);
        setSoilConfig(config);
        setManualPins([]); // reset pins
        setIsManualPlacing(true);
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isManualPlacing || isDraggingRef.current) return;

        // Get the bounding rect of the outer container (the clickable area)
        const rect = e.currentTarget.getBoundingClientRect();

        // Click position relative to the outer container's top-left
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // The inner div is scaled from its center and offset by pan.
        // To find the position in the un-transformed space:
        // 1. Subtract pan offset
        // 2. Adjust for the scale origin being at the container center
        const containerCenterX = rect.width / 2;
        const containerCenterY = rect.height / 2;

        // Inverse of: translate(pan.x, pan.y) scale(zoom, zoom) with transformOrigin=center
        // World x = (clickX - containerCenterX - pan.x) / zoom + containerCenterX
        const worldX = (clickX - containerCenterX - pan.x) / zoom + containerCenterX;
        const worldY = (clickY - containerCenterY - pan.y) / zoom + containerCenterY;

        // Convert to percentage of the container size
        const xPercent = (worldX / rect.width) * 100;
        const yPercent = (worldY / rect.height) * 100;

        // Generate mock data for the new manual pin based on general field score
        const newPin = {
            x: xPercent,
            y: yPercent,
            ...generateMockSampleData(manualPins.length + 1),
            id: `manual-${Date.now()}` // Override id from mock data
        };

        setManualPins([...manualPins, newPin]);
    };

    const generateRemediationEstimate = () => {
        // Generate mock remediation based on field area and quality score
        // Assuming lower quality score = more inputs needed
        const fertilizerTons = (fieldAreaHa * (1 + ((100 - qualityScore) / 100)) * 0.15).toFixed(1);
        const fertilizerCost = Number((Number(fertilizerTons) * 450).toFixed(0)); // $450/ton

        const herbicideLiters = (fieldAreaHa * (qualityScore < 70 ? 2.5 : 0.8)).toFixed(1);
        const herbicideCost = Number((Number(herbicideLiters) * 35).toFixed(0)); // $35/L

        setRemediationEstimates({
            fertilizerStr: `${fertilizerTons} tons of NPK (15-15-15)`,
            fertCost: fertilizerCost,
            herbicideStr: `${herbicideLiters}L of Broad-spectrum Herbicide`,
            herbCost: herbicideCost,
            totalCost: fertilizerCost + herbicideCost + (fieldAreaHa * 15) // + $15/ha application cost
        });
    };

    const runAiAnalysis = () => {
        setIsAnalyzing(true);

        // Mock streaming effect
        const fullResponse = `Analysis Complete. \n\nThis field presents a ${qualityScore > 80 ? 'strong' : 'moderate'} investment opportunity. The ${scoutComplete ? `aerial NDVI scans indicate a vegetative baseline of ${mockAssessment.ndvi}` : 'general topography'} looks promising, but ${soilTestComplete ? `soil composition reveals ${mockAssessment.npk}` : 'there are unknown soil risks'}. \n\nRecommendation: ${field.buyPrice < 200000 ? 'Aggressive Buy - Price is below market average for this yield potential.' : 'Consider renting first to validate yield potential before committing capital.'}`;

        let i = 0;
        setDisplayedAnalysisText("");

        const interval = setInterval(() => {
            setDisplayedAnalysisText(fullResponse.slice(0, i));
            i++;
            if (i > fullResponse.length) {
                clearInterval(interval);
                setIsAnalyzing(false);
                setAiAnalysisComplete(true);
            }
        }, 30);
    };

    const handleGenerateDeepResearch = () => {
        setIsGeneratingResearch(true);
        setTimeout(() => {
            setIsGeneratingResearch(false);
            setIsDeepResearchOpen(true);
        }, 3500); // Simulate "Deep Analysis" gathering time
    };

    const handleRent = () => {
        rentField(field.id, field.rentPrice);
        router.push('/game/my-fields');
    };

    return (
        <GameShell hideSidebar title={field.name}>
            <div className="relative w-full h-full overflow-hidden bg-background">

                {/* Full Screen Interactive Map Background */}
                <div
                    className="absolute inset-0 z-0 overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto"
                    ref={mapZoomContainerRef}
                    style={{ touchAction: 'none', overscrollBehavior: 'none' }}
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
                            if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
                                isDraggingRef.current = true;
                            }
                            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                        }
                    }}
                    onMouseUp={() => {
                        setIsDragging(false);
                        setTimeout(() => { isDraggingRef.current = false; dragStartPosRef.current = null; }, 50);
                    }}
                    onMouseLeave={() => {
                        setIsDragging(false);
                        isDraggingRef.current = false;
                        dragStartPosRef.current = null;
                    }}
                    onClick={isManualPlacing ? handleMapClick : undefined}
                >
                    <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" /> {/* Dark overlay for readability */}

                    <div
                        className="w-full h-full relative"
                        style={{
                            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            transformOrigin: 'center'
                        }}
                    >
                        <Image
                            src={field.imageUrl}
                            alt={field.name}
                            fill
                            className="object-contain"
                            priority
                            draggable={false}
                        />

                        {/* Deep Research Visual Map Overlays */}
                        {isDeepResearchOpen && (
                            <div className="absolute inset-0 z-10 pointer-events-none">
                                {deepResearchTab === 'terrain' && (
                                    <svg className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay animate-in fade-in duration-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path d="M10,20 Q30,15 50,30 T90,20" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />
                                        <path d="M5,40 Q40,30 60,50 T95,45" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />
                                        <path d="M15,60 Q35,70 65,55 T85,75" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="1,1" />
                                        {/* Low Depression / Water Pooling Area */}
                                        <ellipse cx="60" cy="50" rx="15" ry="8" fill="#3b82f6" fillOpacity="0.4" className="animate-pulse" />
                                        <text x="60" y="50" fontSize="2" fill="white" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">Depression Pool</text>
                                    </svg>
                                )}
                                {deepResearchTab === 'chemistry' && (
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,_rgba(239,68,68,0.4)_0%,_transparent_30%),_radial-gradient(ellipse_at_70%_20%,_rgba(234,179,8,0.3)_0%,_transparent_25%)] mix-blend-multiply animate-in fade-in duration-700">
                                        <div className="absolute top-[60%] left-[30%] -translate-x-1/2 -translate-y-1/2 text-white text-[8px] md:text-xs font-bold bg-red-500/80 px-2 py-1 rounded backdrop-blur border border-red-500">Nitrogen Depletion Zone</div>
                                        <div className="absolute top-[20%] left-[70%] -translate-x-1/2 -translate-y-1/2 text-white text-[8px] md:text-xs font-bold bg-yellow-500/80 px-2 py-1 rounded backdrop-blur border border-yellow-500">Low Phosphorus</div>
                                    </div>
                                )}
                                {deepResearchTab === 'remediation' && (
                                    <svg className="absolute inset-0 w-full h-full opacity-80 animate-in fade-in duration-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {/* Fertilizer App Zone */}
                                        <rect x="20" y="50" width="30" height="30" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="2,2" />
                                        <rect x="20" y="50" width="30" height="30" fill="#22c55e" fillOpacity="0.1" />
                                        <text x="35" y="65" fontSize="2" fill="#22c55e" textAnchor="middle" fontWeight="bold">Fertilizer Target Zone A</text>

                                        {/* Herbicide App Zone */}
                                        <circle cx="80" cy="30" r="15" fill="none" stroke="#eab308" strokeWidth="0.5" strokeDasharray="2,2" />
                                        <circle cx="80" cy="30" r="15" fill="#eab308" fillOpacity="0.1" />
                                        <text x="80" y="30" fontSize="2" fill="#eab308" textAnchor="middle" fontWeight="bold">Weed Remediation Area</text>
                                    </svg>
                                )}
                                {deepResearchTab === 'climate' && (
                                    <svg className="absolute inset-0 w-full h-full opacity-60 animate-in fade-in duration-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path d="M0,0 L10,10 M10,0 L20,10 M20,0 L30,10 M30,0 L40,10" stroke="white" strokeWidth="0.5" opacity="0.5" />
                                        <text x="20" y="15" fontSize="2" fill="white" fontWeight="bold">Prevailing NW Winds</text>
                                        <line x1="5" y1="95" x2="95" y2="95" stroke="#10b981" strokeWidth="2" strokeDasharray="4,2" />
                                        <text x="50" y="93" fontSize="2" fill="#10b981" textAnchor="middle" fontWeight="bold">Existing Tree Windbreak</text>
                                    </svg>
                                )}
                                {deepResearchTab === 'crops' && (
                                    <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
                                        <div className="absolute inset-4 border-2 border-emerald-500/50 bg-emerald-500/10 rounded-3xl" />
                                        <div className="bg-emerald-500/80 backdrop-blur text-white font-bold px-4 py-2 rounded-xl border border-emerald-400 shadow-xl">
                                            Prime Corn/Soy Suitability Zone (92% Area)
                                        </div>
                                    </div>
                                )}
                                {deepResearchTab === 'infrastructure' && (
                                    <svg className="absolute inset-0 w-full h-full animate-in fade-in duration-700" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {/* Access Road */}
                                        <path d="M0,80 Q50,85 100,70" fill="none" stroke="#94a3b8" strokeWidth="2" />
                                        <text x="50" y="78" fontSize="2" fill="white" fontWeight="bold">Main Access Road (Gravel)</text>

                                        {/* Irrigation Well */}
                                        <circle cx="20" cy="75" r="2" fill="#3b82f6" stroke="white" strokeWidth="0.5" />
                                        <text x="20" y="72" fontSize="1.5" fill="white" textAnchor="middle" fontWeight="bold">Deep Well (600gpm)</text>

                                        {/* Silos */}
                                        <rect x="85" y="60" width="4" height="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.2" />
                                        <rect x="91" y="60" width="4" height="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.2" />
                                        <text x="90" y="58" fontSize="1.5" fill="white" textAnchor="middle" fontWeight="bold">Grain Storage Units</text>
                                    </svg>
                                )}
                            </div>
                        )}

                        {/* Simulated Scanning Effects */}
                        {isScouting && (
                            <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 animate-scan border-b border-emerald-400 shadow-[0_4px_30px_rgba(52,211,153,0.3)] saturate-150 top-0 z-20 pointer-events-none" />
                        )}

                        {/* Overlays post-scan based on config */}
                        {scoutComplete && droneConfig?.addons?.weedPressure && (
                            <div className="absolute inset-0 z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(225, 29, 72, 0.4) 0%, transparent 20%), radial-gradient(circle at 30% 70%, rgba(225, 29, 72, 0.2) 0%, transparent 15%)' }}></div>
                        )}
                        {scoutComplete && droneConfig?.type === 'thermal' && (
                            <div className="absolute inset-0 z-10 mix-blend-overlay pointer-events-none opacity-40 bg-gradient-to-tr from-blue-700 via-purple-500 to-rose-500" />
                        )}

                        {/* Soil Test Output Map Nodes - Displayed either when placed manually, or when test finishes automatically */}
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            {activePinsObjects.map((sample) => (
                                <div
                                    key={`pin-${sample.id}`}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                                    style={{ left: `${sample.x}%`, top: `${sample.y}%` }}
                                    onMouseEnter={() => !isManualPlacing && setHoveredPin(sample)}
                                    onMouseLeave={() => !isManualPlacing && setHoveredPin(null)}
                                    onClick={(e) => {
                                        if (isDraggingRef.current || isManualPlacing) return;
                                        e.stopPropagation();
                                        setSelectedSoilSample(selectedSoilSample === Number(sample.id) ? null : Number(sample.id));
                                    }}
                                >
                                    {/* Map Pin Point */}
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-help transition-transform hover:scale-125",
                                        isManualPlacing ? "bg-amber-500 animate-pulse hover:cursor-crosshair shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-blue-500"
                                    )} />
                                    {selectedSoilSample === Number(sample.id) && sample.general && (
                                        <div className="absolute left-8 -top-24 glass-panel rounded-lg p-4 w-72 z-30 animate-in fade-in zoom-in-95 duration-200 cursor-auto max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                            <div className="text-sm font-semibold mb-3 flex items-center justify-between pb-2 border-b border-white/10">
                                                <span>Soil Sample {sample.id}</span>
                                                {soilConfig?.type === 'becrop' && (
                                                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">
                                                        BeCrop Score: {sample.score?.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                {/* General - Always shown */}
                                                <div>
                                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">General Characteristics</div>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div><div className="text-muted-foreground">pH</div><div className="font-medium text-blue-300">{sample.general.ph}</div></div>
                                                        <div><div className="text-muted-foreground">Moisture</div><div className="font-medium">{sample.general.moisture}%</div></div>
                                                        {(soilConfig?.type === 'precise' || soilConfig?.type === 'becrop') && (
                                                            <>
                                                                <div><div className="text-muted-foreground">Organic Matter</div><div className="font-medium">{sample.general.om}%</div></div>
                                                                <div><div className="text-muted-foreground">CEC</div><div className="font-medium">{sample.general.cec} meq</div></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Macronutrients */}
                                                <div>
                                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Macronutrients (ppm)</div>
                                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                                        <div><div className="text-muted-foreground">N</div><div className="font-medium">{sample.macro.n}</div></div>
                                                        <div><div className="text-muted-foreground">P</div><div className="font-medium">{sample.macro.p}</div></div>
                                                        <div><div className="text-muted-foreground">K</div><div className="font-medium">{sample.macro.k}</div></div>
                                                        {(soilConfig?.type === 'precise' || soilConfig?.type === 'becrop') && (
                                                            <>
                                                                <div><div className="text-muted-foreground">Ca</div><div className="font-medium">{sample.macro.ca}</div></div>
                                                                <div><div className="text-muted-foreground">Mg</div><div className="font-medium">{sample.macro.mg}</div></div>
                                                                <div><div className="text-muted-foreground">S</div><div className="font-medium">{sample.macro.s}</div></div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Micronutrients - Only precise and becrop */}
                                                {(soilConfig?.type === 'precise' || soilConfig?.type === 'becrop') && (
                                                    <div>
                                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Micronutrients (ppm)</div>
                                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                                            <div><div className="text-muted-foreground">Fe</div><div className="font-medium">{sample.micro.fe}</div></div>
                                                            <div><div className="text-muted-foreground">Zn</div><div className="font-medium">{sample.micro.zn}</div></div>
                                                            <div><div className="text-muted-foreground">Mn</div><div className="font-medium">{sample.micro.mn}</div></div>
                                                            <div><div className="text-muted-foreground">Cu</div><div className="font-medium">{sample.micro.cu}</div></div>
                                                            <div><div className="text-muted-foreground">B</div><div className="font-medium">{sample.micro.b}</div></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* BeCrop Biology - Only becrop */}
                                                {soilConfig?.type === 'becrop' && (
                                                    <div className="pt-3 border-t border-white/10">
                                                        <div className="text-xs font-semibold mb-2 text-green-400 flex items-center gap-1">
                                                            <FlaskConical className="w-3.5 h-3.5" />
                                                            Biomemakers Analysis
                                                        </div>
                                                        <div className="space-y-1.5 text-[11px]">
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Fungi/Bacteria</span>
                                                                <span className="font-medium text-green-300">Balanced (1:1)</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-muted-foreground">Pathogen Risk</span>
                                                                <span className="font-medium text-yellow-300">Moderate</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="relative z-30 h-full flex flex-col pointer-events-none p-4 md:p-6">

                    {/* Top Header */}
                    <div className="flex justify-between items-start pointer-events-auto shrink-0 mb-6">
                        <Link href="/game/marketplace" className="inline-flex items-center px-4 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hover:bg-background">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Market
                        </Link>
                    </div>

                    {/* Side Panels Container */}
                    <div className="flex-1 flex items-start justify-end gap-6 overflow-hidden">

                        {/* Right Panel Toggle Tab */}
                        <button
                            onClick={() => setIsPanelOpen(v => !v)}
                            className="self-center shrink-0 pointer-events-auto p-2 rounded-l-xl bg-background/80 backdrop-blur-md border border-white/10 border-r-0 text-muted-foreground hover:text-white transition-colors shadow-xl"
                            title={isPanelOpen ? 'Hide Panel' : 'Show Panel'}
                        >
                            {isPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>

                        {/* Right Sidebar - Dynamic Assessments & Info */}
                        {isPanelOpen && (
                            <div className="w-[420px] max-h-full overflow-y-auto rounded-2xl bg-background/90 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto flex flex-col custom-scrollbar">

                                {/* Field Header */}
                                <div className="p-6 border-b border-white/10 shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-medium text-primary uppercase tracking-wider">{field.location}</span>
                                    </div>
                                    <h1 className="text-3xl font-bold mb-2 text-foreground">{field.name}</h1>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{field.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-xs text-muted-foreground mb-1">Buy Price</div>
                                            <div className="text-lg font-bold text-foreground">${field.buyPrice.toLocaleString()}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-xs text-muted-foreground mb-1">Rent / Season</div>
                                            <div className="text-lg font-bold text-foreground">${field.rentPrice.toLocaleString()}</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-xs text-muted-foreground mb-1">Total Area</div>
                                            <div className="text-lg font-bold text-foreground">{field.sizeHectares} ha</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="text-xs text-muted-foreground mb-1">Base Quality</div>
                                            <div className="text-lg font-bold text-foreground">{qualityScore}/100</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Assessment Section */}
                                <div className="p-6 shrink-0 flex-1">
                                    <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider">Pre-Purchase Investigation</h2>

                                    <div className="space-y-3 mb-6">
                                        {/* Drone Scouting Card */}
                                        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Search className={cn("w-5 h-5", scoutComplete ? "text-primary" : "text-muted-foreground")} />
                                                    <span className="font-semibold">Aerial Scouting</span>
                                                </div>
                                                {isScouting ? (
                                                    <div className="flex items-center gap-2 text-blue-400">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Flight in progress...
                                                    </div>
                                                ) : scoutComplete ? (
                                                    <div className="flex items-center gap-2 text-green-400">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="capitalize">{droneConfig?.type} Data Retrieved</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsDroneModalOpen(true)}
                                                        className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors border border-blue-500/20"
                                                    >
                                                        Configure
                                                        <Plane className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                            {scoutComplete && (
                                                <div className="grid grid-cols-2 gap-2 text-sm max-h-40 overflow-y-auto pr-2 custom-scrollbar fade-in">
                                                    <div className="p-2 rounded bg-black/20"><span className="text-muted-foreground text-xs block">NDVI Baseline</span><span className="font-medium text-primary">{mockAssessment.ndvi}</span></div>
                                                    <div className="p-2 rounded bg-black/20"><span className="text-muted-foreground text-xs block">Weed Pressure</span><span className="font-medium text-secondary">{mockAssessment.weedPressure}</span></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Soil Testing Card */}
                                        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <TestTube2 className={cn("w-5 h-5", soilTestComplete ? "text-primary" : "text-muted-foreground")} />
                                                    <span className="font-semibold">Soil Composition</span>
                                                </div>
                                                {isTestingSoil ? (
                                                    <div className="flex items-center gap-2 text-blue-400">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Lab test in progress...
                                                    </div>
                                                ) : soilTestComplete ? (
                                                    <div className="flex items-center gap-2 text-green-400">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span className="capitalize">{soilConfig?.type} Data Retrieved</span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setIsSoilModalOpen(true)}
                                                        className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors border border-blue-500/20"
                                                    >
                                                        Configure
                                                        <FlaskConical className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                            {soilTestComplete && (
                                                <div className="grid grid-cols-2 gap-2 text-sm max-h-40 overflow-y-auto pr-2 custom-scrollbar fade-in">
                                                    <div className="p-2 rounded bg-black/20"><span className="text-muted-foreground text-xs block">NPK Levels</span><span className="font-medium text-secondary">{mockAssessment.npk}</span></div>
                                                    <div className="p-2 rounded bg-black/20"><span className="text-muted-foreground text-xs block">Compaction</span><span className="font-medium text-primary">{mockAssessment.compaction}</span></div>
                                                    <div className="p-2 rounded bg-black/20 col-span-2"><span className="text-muted-foreground text-xs block">Moisture Limit</span><span className="font-medium">{mockAssessment.soilMoisture}</span></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Remediation Estimates Panel */}
                                        {remediationEstimates && (
                                            <div className="bg-gradient-to-br from-amber-500/10 to-rose-500/10 rounded-xl border border-amber-500/20 p-4 animate-in fade-in slide-in-from-bottom-4">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                    <span className="font-semibold text-sm text-amber-500">Deficiency Remediation Estimate</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-start text-xs">
                                                        <div className="flex gap-2 text-slate-300">
                                                            <Tractor className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                            <span className="leading-tight">{remediationEstimates.fertilizerStr}</span>
                                                        </div>
                                                        <div className="font-mono text-slate-400 shrink-0">${remediationEstimates.fertCost.toLocaleString()}</div>
                                                    </div>
                                                    <div className="flex justify-between items-start text-xs">
                                                        <div className="flex gap-2 text-slate-300">
                                                            <Wind className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                            <span className="leading-tight">{remediationEstimates.herbicideStr}</span>
                                                        </div>
                                                        <div className="font-mono text-slate-400 shrink-0">${remediationEstimates.herbCost.toLocaleString()}</div>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-amber-500/20">
                                                        <span className="text-amber-500 uppercase">Total Estimated Output</span>
                                                        <span className="font-mono text-amber-400 text-sm">${remediationEstimates.totalCost.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Historical Data (Always visible, but sparse if not scouted) */}
                                        <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                                            <div className="flex items-center gap-2 mb-3">
                                                <History className="w-5 h-5 text-purple-400" />
                                                <span className="font-semibold">Public Historical & Climate Data</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="p-2 rounded bg-black/20">
                                                    <span className="text-muted-foreground text-[10px] uppercase block">Crop Matrix (3 Yrs)</span>
                                                    <span className="font-medium text-white text-xs">Corn/Soy/Corn</span>
                                                </div>
                                                <div className="p-2 rounded bg-black/20">
                                                    <span className="text-muted-foreground text-[10px] uppercase block">Avg Rainfall</span>
                                                    <span className="font-medium text-white text-xs">34.2 in/yr</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Agent Analysis */}
                                    {canAnalyze && (
                                        <div className="mt-6 border-t border-white/10 pt-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
                                                    <Bot className="w-4 h-4" />
                                                    Agri-OS Agent Assessment
                                                </h2>
                                                {!isAnalyzing && !aiAnalysisComplete && (
                                                    <button onClick={runAiAnalysis} className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-semibold hover:bg-blue-500/30 transition-colors flex items-center gap-1 border border-blue-500/30">
                                                        <Bot className="w-3.5 h-3.5" /> Analyze
                                                    </button>
                                                )}
                                            </div>

                                            {(isAnalyzing || displayedAnalysisText || aiAnalysisComplete) && (
                                                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-sm text-blue-100 leading-relaxed font-mono relative overflow-hidden">
                                                    {isAnalyzing && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/30 overflow-hidden"><div className="h-full bg-blue-400 animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '30%' }} /></div>}
                                                    <div className="whitespace-pre-wrap">{displayedAnalysisText}{isAnalyzing && <span className="animate-pulse">_</span>}</div>

                                                    {/* Deep Research Trigger */}
                                                    {aiAnalysisComplete && (
                                                        <div className="mt-4 pt-4 border-t border-blue-500/20 flex flex-col gap-2 fade-in">
                                                            <span className="text-xs text-blue-300">Intrigued? Generate a massive 3-page deep research report on this parcel.</span>
                                                            <button
                                                                onClick={handleGenerateDeepResearch}
                                                                disabled={isGeneratingResearch}
                                                                className="w-full py-2 px-3 rounded-lg bg-blue-500 hover:bg-blue-400 text-blue-950 font-bold transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                {isGeneratingResearch ? (
                                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Compiling Deep Research...</>
                                                                ) : (
                                                                    <><BookOpen className="w-4 h-4" /> Generate Deep AI Research</>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Sticky Action Footer */}
                                <div className="p-6 bg-background border-t border-white/10 shrink-0 mt-auto">
                                    {!isOwned && !isRented ? (
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={handleRent}
                                                className="w-full py-3.5 px-4 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors font-semibold flex items-center justify-center gap-2 group"
                                            >
                                                Rent Field
                                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                                            </button>
                                            <button className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-bold shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                                                Purchase Field
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Link
                                                href="/game/my-fields"
                                                className="w-full inline-flex justify-center items-center py-3.5 px-4 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors font-semibold"
                                            >
                                                Manage Owned Field
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Modals */}
                {/* Modals */}
                <DeepResearchModal
                    isOpen={isDeepResearchOpen}
                    onClose={() => setIsDeepResearchOpen(false)}
                    field={field as any}
                    mockAssessment={mockAssessment}
                    activeTab={deepResearchTab}
                    setActiveTab={setDeepResearchTab}
                />

                <DroneSurveyModal
                    isOpen={isDroneModalOpen}
                    onClose={() => setIsDroneModalOpen(false)}
                    onConfirm={handleConfirmDrone}
                    fieldName={field.name}
                    fieldAreaHa={fieldAreaHa}
                />

                <SoilTestModal
                    isOpen={isSoilModalOpen}
                    onClose={() => setIsSoilModalOpen(false)}
                    onConfirm={handleConfirmSoil}
                    onManualPlacementStart={handleManualPlacementStart}
                    fieldName={field.name}
                    fieldAreaHa={fieldAreaHa}
                />

                {/* Manual Placement UI Control Overlay */}
                {isManualPlacing && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-amber-500/30 flex items-center gap-6 shadow-2xl animate-in fade-in slide-in-from-bottom-8">
                        <div className="flex items-center gap-3 border-r border-white/10 pr-6">
                            <div className="p-2.5 bg-amber-500 rounded-lg text-white">
                                <GripHorizontal className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Manual Pin Placement Active</h4>
                                <p className="text-slate-400 text-xs">Click on the map to drop custom soil test targets.</p>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-xs text-slate-400 mb-0.5 uppercase tracking-wider font-semibold">Pins Selected</div>
                            <div className="text-xl font-mono font-bold text-amber-500">{manualPins.length} <span className="text-sm font-sans text-slate-500">samples</span></div>
                        </div>
                        <div className="flex flex-col px-4 border-l border-white/10">
                            <div className="text-xs text-slate-400 mb-0.5 uppercase tracking-wider font-semibold">Est. Cost</div>
                            <div className="text-xl font-mono font-bold text-white">
                                ${manualPins.length * ((soilConfig?.type === 'becrop' ? 150 : soilConfig?.type === 'precise' ? 40 : 15) + (soilConfig?.depth === 'deep' ? 10 : 0))}
                            </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={() => { setIsManualPlacing(false); setIsSoilModalOpen(true); }}
                                className="px-4 py-2 rounded-xl font-medium text-white border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Find base price to pass back alongside the config, dynamically recalculate cost
                                    const typePrice = soilConfig?.type === 'becrop' ? 150 : soilConfig?.type === 'precise' ? 40 : 15;
                                    const depthPrice = soilConfig?.depth === 'deep' ? 10 : 0;
                                    const calculatedTotal = manualPins.length * (typePrice + depthPrice);

                                    // Return flow exactly as if confirmed from the modal
                                    handleConfirmSoil(soilConfig!, calculatedTotal);
                                }}
                                disabled={manualPins.length === 0}
                                className="px-5 py-2 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:shadow-none"
                            >
                                Execute Test Run
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </GameShell>
    );
}
