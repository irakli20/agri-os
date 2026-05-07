'use client';

import React, { useMemo, useState } from 'react';
import { GameShell } from '@/components/game/GameShell';
import { MarketplaceNav } from '@/components/game/MarketplaceNav';
import { useGameStore } from '@/lib/game-store';
import { cn } from '@/lib/utils';
import type { EquipmentItem } from '@/lib/marketplace-data';
import Image from 'next/image';
import {
    Armchair,
    Gauge,
    Gem,
    Package,
    Ruler,
    Scale,
    ShoppingCart,
    Tractor,
    Truck,
    Warehouse,
    Wheat,
    Zap
} from 'lucide-react';

type MachineryCategory = 'seeding' | 'yield' | 'harvest' | 'transport';

interface CornMachinery {
    id: string;
    name: string;
    brand: string;
    category: MachineryCategory;
    family: 'Seeders' | 'Planters' | 'Seed Tanks' | 'Sprayers' | 'Manure Spreaders' | 'Fertilizer Spreaders' | 'Slurry Tankers' | 'Slurry Tools' | 'Combines' | 'Trailers';
    description: string;
    price: number;
    maintenance: number;
    specs: {
        power: string;
        capacity: string;
        weight: string;
        width: string;
        speed: string;
    };
    compatibleCrops: string[];
    operations: string[];
    color: string;
    accent: string;
    image?: string;
    isCornEssential?: boolean;
}

const CATEGORY_LABELS: Record<MachineryCategory, string> = {
    seeding: 'Seeding',
    yield: 'Yield Improvements',
    harvest: 'Harvest',
    transport: 'Transport',
};

const CORN_MACHINERY: CornMachinery[] = [
    {
        id: 'mach-mzuri-protil',
        name: 'PRO-TIL 4T Xzact',
        brand: 'Mzuri',
        category: 'seeding',
        family: 'Seeders',
        description: 'Strip-till direct drill for maize and mixed rotations. Seeds directly into residue with minimal soil disturbance.',
        price: 133000,
        maintenance: 520,
        specs: { power: '147 kW / 200 hp', capacity: '5912 l', weight: '6.9 t', width: '4 m', speed: '9 mph' },
        compatibleCrops: ['Corn', 'Sunflowers', 'Soybeans', 'Sugar Beet'],
        operations: ['Direct seeding', 'Residue planting', 'Pre-plant pass reduction'],
        color: 'from-lime-500 to-lime-700',
        accent: 'text-lime-300',
        image: '/marketplace/machinery/mzuri-protil.png',
        isCornEssential: true,
    },
    {
        id: 'mach-amazone-precea',
        name: 'Precea 4500-2C Super',
        brand: 'Amazone',
        category: 'seeding',
        family: 'Planters',
        description: 'High-speed precision planter for maize and sunflower rows with accurate singulation.',
        price: 49500,
        maintenance: 260,
        specs: { power: '95 kW / 130 hp', capacity: '700 l', weight: '2.7 t', width: '4.5 m', speed: '9 mph' },
        compatibleCrops: ['Corn', 'Sunflowers', 'Soybeans'],
        operations: ['Precision corn planting', 'Variable-rate seeding', 'Row establishment'],
        color: 'from-orange-500 to-orange-700',
        accent: 'text-orange-300',
        image: '/marketplace/machinery/amazone-precea.png',
        isCornEssential: true,
    },
    {
        id: 'mach-kuhn-maxima',
        name: 'MAXIMA 3 TI L',
        brand: 'Kuhn',
        category: 'seeding',
        family: 'Planters',
        description: 'Compact precision planter for corn, sunflower, soybean, and beet rotations.',
        price: 59000,
        maintenance: 280,
        specs: { power: '110 kW / 150 hp', capacity: '760 l', weight: '3.1 t', width: '6 m', speed: '8 mph' },
        compatibleCrops: ['Corn', 'Sunflowers', 'Soybeans', 'Sugar Beet'],
        operations: ['Precision planting', 'Seed depth control', 'Starter fertilizer placement'],
        color: 'from-red-500 to-red-700',
        accent: 'text-red-300',
        image: '/marketplace/machinery/kuhn-maxima.png',
        isCornEssential: true,
    },
    {
        id: 'mach-horsch-maestro',
        name: 'Maestro 9.75 RX',
        brand: 'Horsch',
        category: 'seeding',
        family: 'Planters',
        description: 'Large precision planter for maize and oilseed rotations. Requires wheel weights on lighter tractors.',
        price: 65000,
        maintenance: 340,
        specs: { power: '125 kW / 170 hp', capacity: '630 l', weight: '2.4 t', width: '6.7 m', speed: '9 mph' },
        compatibleCrops: ['Corn', 'Sunflowers', 'Soybeans'],
        operations: ['High-speed planting', 'Corn row spacing', 'Seed metering'],
        color: 'from-red-600 to-rose-800',
        accent: 'text-red-300',
        image: '/marketplace/machinery/horsch-maestro.png',
    },
    {
        id: 'mach-grimme-matrix',
        name: 'MATRIX 1800',
        brand: 'Grimme',
        category: 'seeding',
        family: 'Planters',
        description: 'Specialized planter suited for beet and precision vegetable seed placement, useful in rotation years.',
        price: 81000,
        maintenance: 410,
        specs: { power: '118 kW / 160 hp', capacity: '900 l', weight: '3.6 t', width: '6 m', speed: '7 mph' },
        compatibleCrops: ['Sugar Beet', 'Soybeans'],
        operations: ['Precision beet planting', 'Fine seed metering', 'Rotation support'],
        color: 'from-red-500 to-red-800',
        accent: 'text-red-300',
        image: '/marketplace/machinery/grimme-matrix.png',
    },
    {
        id: 'mach-kverneland-optima',
        name: 'Optima TF Profi',
        brand: 'Kverneland',
        category: 'seeding',
        family: 'Planters',
        description: 'Foldable precision planter for corn and sunflower acreage with strong transport ergonomics.',
        price: 72000,
        maintenance: 360,
        specs: { power: '132 kW / 180 hp', capacity: '700 l', weight: '4.1 t', width: '6 m', speed: '8 mph' },
        compatibleCrops: ['Corn', 'Sunflowers', 'Soybeans'],
        operations: ['Precision planting', 'Folding transport', 'Row crop setup'],
        color: 'from-red-600 to-red-900',
        accent: 'text-red-300',
    },
    {
        id: 'mach-kinze-blue-drive',
        name: 'Blue Drive 4905',
        brand: 'Kinze',
        category: 'seeding',
        family: 'Planters',
        description: 'High-capacity planter platform for large corn and soybean fields.',
        price: 118000,
        maintenance: 560,
        specs: { power: '184 kW / 250 hp', capacity: '2460 l', weight: '8.2 t', width: '12 m', speed: '8 mph' },
        compatibleCrops: ['Corn', 'Soybeans'],
        operations: ['Large-field planting', 'Bulk seed handling', 'High acreage windows'],
        color: 'from-sky-500 to-blue-800',
        accent: 'text-sky-300',
    },
    {
        id: 'mach-lemken-zirkon',
        name: 'Zirkon 12 Strip Prep',
        brand: 'Lemken',
        category: 'yield',
        family: 'Fertilizer Spreaders',
        description: 'Seedbed and nutrient prep implement for pre-plant corn field readiness.',
        price: 38500,
        maintenance: 180,
        specs: { power: '88 kW / 120 hp', capacity: 'n/a', weight: '2.1 t', width: '4 m', speed: '7 mph' },
        compatibleCrops: ['Corn', 'Wheat', 'Soybeans'],
        operations: ['Seedbed finishing', 'Nutrient incorporation', 'Pre-plant preparation'],
        color: 'from-blue-500 to-cyan-800',
        accent: 'text-cyan-300',
    },
    {
        id: 'mach-amazone-zats',
        name: 'ZA-TS ProfisPro',
        brand: 'Amazone',
        category: 'yield',
        family: 'Fertilizer Spreaders',
        description: 'Twin-disc fertilizer spreader for corn top-dress and broadacre NPK applications.',
        price: 46000,
        maintenance: 230,
        specs: { power: '74 kW / 100 hp', capacity: '4200 l', weight: '1.7 t', width: '36 m', speed: '12 mph' },
        compatibleCrops: ['Corn', 'Wheat', 'Canola', 'Soybeans'],
        operations: ['Top-dress nitrogen', 'NPK spreading', 'Variable-rate applications'],
        color: 'from-green-500 to-emerald-800',
        accent: 'text-emerald-300',
        isCornEssential: true,
    },
    {
        id: 'mach-hardi-ranger',
        name: 'Ranger 5500',
        brand: 'Hardi',
        category: 'yield',
        family: 'Sprayers',
        description: 'Trailed sprayer for herbicide, fungicide, and insecticide windows in corn.',
        price: 78000,
        maintenance: 430,
        specs: { power: '110 kW / 150 hp', capacity: '5500 l', weight: '4.8 t', width: '24 m', speed: '10 mph' },
        compatibleCrops: ['Corn', 'Canola', 'Wheat', 'Soybeans'],
        operations: ['Herbicide pass', 'Fungicide pass', 'Insecticide rescue treatment'],
        color: 'from-yellow-500 to-stone-700',
        accent: 'text-yellow-300',
        isCornEssential: true,
    },
    {
        id: 'mach-claas-lexion-corn',
        name: 'Lexion Corn Pack',
        brand: 'CLAAS',
        category: 'harvest',
        family: 'Combines',
        description: 'High-capacity combine setup with corn header compatibility for timely harvest windows.',
        price: 285000,
        maintenance: 920,
        specs: { power: '335 kW / 455 hp', capacity: '11000 l', weight: '18.4 t', width: '8 row', speed: '6 mph' },
        compatibleCrops: ['Corn', 'Wheat', 'Barley'],
        operations: ['Corn harvest', 'Grain handling', 'Harvest loss reduction'],
        color: 'from-lime-500 to-neutral-800',
        accent: 'text-lime-300',
        isCornEssential: true,
    },
    {
        id: 'mach-hawe-grain-cart',
        name: 'ULW 3000 Grain Cart',
        brand: 'Hawe',
        category: 'transport',
        family: 'Trailers',
        description: 'Grain cart for combine unloading and field-to-road transfer during corn harvest.',
        price: 64000,
        maintenance: 260,
        specs: { power: '110 kW / 150 hp', capacity: '30000 l', weight: '7.5 t', width: '3 m', speed: '15 mph' },
        compatibleCrops: ['Corn', 'Wheat', 'Barley', 'Soybeans'],
        operations: ['Harvest logistics', 'Combine unloading', 'Grain transport'],
        color: 'from-green-500 to-green-800',
        accent: 'text-green-300',
    },
];

function machineToEquipmentItem(machine: CornMachinery): EquipmentItem {
    const category = machine.family === 'Combines' ? 'harvester' : machine.family === 'Trailers' ? 'tractor' : 'implement';

    return {
        id: machine.id,
        name: `${machine.brand} ${machine.name}`,
        category,
        description: machine.description,
        price: machine.price,
        maintainanceCostPerWeek: machine.maintenance,
        specs: {
            Power: machine.specs.power,
            Capacity: machine.specs.capacity,
            Weight: machine.specs.weight,
            Width: machine.specs.width,
            Speed: machine.specs.speed,
        },
        icon: machine.family === 'Combines' ? '🌽' : machine.family === 'Trailers' ? '🚚' : '🚜',
        image: '',
        status: 'ready',
    };
}

function MachineryIllustration({ machine, isSelected }: { machine: CornMachinery; isSelected?: boolean }) {
    if (machine.image) {
        return (
            <div className="relative h-52 overflow-hidden rounded-t-2xl bg-[#252927]">
                <Image
                    src={machine.image}
                    alt={`${machine.brand} ${machine.name}`}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className={cn(
                        "object-cover object-center transition-transform duration-500",
                        isSelected ? "scale-[1.03]" : "group-hover:scale-[1.04]"
                    )}
                    priority={machine.id === 'mach-mzuri-protil'}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#262927] to-transparent" />
                {machine.isCornEssential && (
                    <div className="absolute right-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-xs font-bold text-lime-200">
                        Corn core
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={cn(
            "relative flex h-40 items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br",
            machine.color
        )}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_52%)]" />
            <div className="absolute inset-x-8 bottom-5 h-4 rounded-full bg-black/25 blur-md" />
            <div className={cn(
                "relative flex h-24 w-44 items-center justify-center rounded-2xl border border-white/20 bg-black/25 shadow-2xl transition-transform",
                isSelected ? "scale-105" : "group-hover:scale-105"
            )}>
                {machine.family === 'Combines' ? (
                    <Wheat className="h-16 w-16 text-white drop-shadow-lg" />
                ) : machine.family === 'Trailers' ? (
                    <Truck className="h-16 w-16 text-white drop-shadow-lg" />
                ) : machine.family === 'Sprayers' ? (
                    <Armchair className="h-16 w-16 rotate-180 text-white drop-shadow-lg" />
                ) : (
                    <Tractor className="h-16 w-16 text-white drop-shadow-lg" />
                )}
            </div>
            <div className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/85">
                {machine.family}
            </div>
            {machine.isCornEssential && (
                <div className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-lime-200">
                    Corn core
                </div>
            )}
        </div>
    );
}

function SpecPill({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Icon className="h-5 w-5 text-white/80" />
            <span>{label}</span>
        </div>
    );
}

export default function EquipmentMarketplacePage() {
    const { players, currentPlayerId, buyEquipment, equipment } = useGameStore();
    const player = players.find((p) => p.id === currentPlayerId);
    const [activeCategory, setActiveCategory] = useState<MachineryCategory>('seeding');
    const filteredMachines = useMemo(
        () => CORN_MACHINERY.filter((machine) => machine.category === activeCategory),
        [activeCategory]
    );
    const [selectedId, setSelectedId] = useState(filteredMachines[0]?.id ?? CORN_MACHINERY[0].id);
    const selectedMachine = CORN_MACHINERY.find((machine) => machine.id === selectedId) ?? filteredMachines[0] ?? CORN_MACHINERY[0];
    const ownedIds = new Set(equipment.map((item) => item.id));

    const handleCategoryChange = (category: MachineryCategory) => {
        setActiveCategory(category);
        const firstInCategory = CORN_MACHINERY.find((machine) => machine.category === category);
        if (firstInCategory) setSelectedId(firstInCategory.id);
    };

    const handleBuy = () => {
        buyEquipment(machineToEquipmentItem(selectedMachine), selectedMachine.price);
    };

    return (
        <GameShell>
            <div className="h-full overflow-y-auto bg-[#202321] p-6">
                <div className="mx-auto max-w-[1600px] space-y-8">
                    <header className="flex flex-col gap-5 border-b border-white/15 pb-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-lime-500 text-black shadow-lg shadow-lime-500/20">
                                    <Tractor className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-light uppercase tracking-[0.12em] text-white">Vehicles</h1>
                                    <p className="mt-1 text-sm text-muted-foreground">Corn-focused machinery with equipment-specific specs and crop fit.</p>
                                </div>
                            </div>
                            <MarketplaceNav />
                        </div>
                        <div className="rounded-3xl bg-black px-7 py-4 text-xl font-semibold uppercase tracking-wide text-white shadow-xl">
                            Balance: <span className="text-lime-400">${(player?.balance ?? 0).toLocaleString()}</span>
                        </div>
                    </header>

                    <section className="grid gap-3 md:grid-cols-4">
                        {(Object.keys(CATEGORY_LABELS) as MachineryCategory[]).map((category) => {
                            const count = CORN_MACHINERY.filter((machine) => machine.category === category).length;
                            return (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryChange(category)}
                                    className={cn(
                                        "group rounded-2xl border p-4 text-left transition-all",
                                        activeCategory === category
                                            ? "border-lime-400 bg-lime-500 text-black shadow-lg shadow-lime-500/20"
                                            : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
                                    )}
                                >
                                    <div className={cn("text-xs font-bold uppercase tracking-[0.18em]", activeCategory === category ? "text-black/65" : "text-lime-400")}>Category</div>
                                    <div className="mt-1 text-lg font-bold uppercase">{CATEGORY_LABELS[category]}</div>
                                    <div className={cn("mt-3 text-xs", activeCategory === category ? "text-black/70" : "text-muted-foreground")}>{count} machines</div>
                                </button>
                            );
                        })}
                    </section>

                    <section>
                        <h2 className="mb-5 text-2xl font-bold uppercase tracking-wide">{CATEGORY_LABELS[activeCategory]}</h2>
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                            {filteredMachines.map((machine) => {
                                const isSelected = machine.id === selectedMachine.id;
                                const isOwned = ownedIds.has(machine.id);
                                return (
                                    <button
                                        key={machine.id}
                                        onClick={() => setSelectedId(machine.id)}
                                        className={cn(
                                            "group overflow-hidden rounded-2xl border bg-[#262927] text-left shadow-xl transition-all",
                                            isSelected ? "border-lime-400 shadow-lime-500/10" : "border-white/10 hover:border-white/25"
                                        )}
                                    >
                                        <MachineryIllustration machine={machine} isSelected={isSelected} />
                                        <div className={cn("space-y-3 border-t border-white/10 p-5", isSelected && "bg-lime-500 text-black")}>
                                            <div>
                                                <div className={cn("text-xs font-bold uppercase tracking-[0.16em]", isSelected ? "text-black/60" : machine.accent)}>
                                                    {machine.brand}
                                                </div>
                                                <div className="mt-1 min-h-[48px] text-lg font-bold">{machine.name}</div>
                                            </div>
                                            <div className="flex items-end justify-between gap-4">
                                                <div className="text-2xl font-light">${machine.price.toLocaleString()}</div>
                                                {isOwned && (
                                                    <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                                                        Owned
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="grid gap-8 border-t border-white/15 pt-7 lg:grid-cols-[minmax(280px,0.9fr)_1.5fr]">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">{selectedMachine.brand}</div>
                            <h2 className="mt-2 text-4xl font-bold uppercase tracking-wide">{selectedMachine.name}</h2>
                            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{selectedMachine.description}</p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                {selectedMachine.operations.map((operation) => (
                                    <span key={operation} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-foreground/80">
                                        {operation}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid gap-4 md:grid-cols-5">
                                <SpecPill icon={Zap} label={selectedMachine.specs.power} />
                                <SpecPill icon={Package} label={selectedMachine.specs.capacity} />
                                <SpecPill icon={Scale} label={selectedMachine.specs.weight} />
                                <SpecPill icon={Ruler} label={selectedMachine.specs.width} />
                                <SpecPill icon={Gauge} label={selectedMachine.specs.speed} />
                            </div>
                            <div className="grid gap-4 border-y border-white/10 py-5 md:grid-cols-2">
                                <div>
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        <Wheat className="h-4 w-4 text-lime-400" />
                                        Crop Compatibility
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-2xl">
                                        {selectedMachine.compatibleCrops.map((crop) => (
                                            <span key={crop} title={crop} className="rounded-xl bg-white/5 px-3 py-2 text-base font-semibold">
                                                {crop === 'Corn' ? '🌽' : crop === 'Sunflowers' ? '🌻' : crop === 'Soybeans' ? '🫘' : crop === 'Sugar Beet' ? '🌱' : crop === 'Wheat' ? '🌾' : crop}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                        <Warehouse className="h-4 w-4 text-lime-400" />
                                        Ownership Data
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-xl bg-white/5 p-3">
                                            <div className="text-muted-foreground">Maintenance</div>
                                            <div className="mt-1 font-semibold">${selectedMachine.maintenance}/week</div>
                                        </div>
                                        <div className="rounded-xl bg-white/5 p-3">
                                            <div className="text-muted-foreground">Family</div>
                                            <div className="mt-1 font-semibold">{selectedMachine.family}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Gem className="h-4 w-4 text-lime-400" />
                                    Recommended for Corn Focus operations where timing and field windows matter.
                                </div>
                                <button
                                    onClick={handleBuy}
                                    disabled={ownedIds.has(selectedMachine.id) || (player?.balance ?? 0) < selectedMachine.price}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-500 px-6 py-3 font-bold text-black transition-colors hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {ownedIds.has(selectedMachine.id) ? 'Owned' : `Buy $${selectedMachine.price.toLocaleString()}`}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </GameShell>
    );
}
