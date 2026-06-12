'use client';

import { type ElementType, useMemo, useState } from 'react';
import { AlertTriangle, BatteryCharging, Gauge, Plane, RotateCcw, SprayCan, TimerReset, TrendingUp, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    RavenSimulationParams,
    RavenTelemetryPoint,
    defaultRavenSimulationParams,
    runRavenSimulation,
} from '@/lib/raven-simulation';

type ControlKey = keyof Pick<
    RavenSimulationParams,
    | 'tankLiters'
    | 'applicationRateLHa'
    | 'swathM'
    | 'spraySpeedKmh'
    | 'turnSpeedKmh'
    | 'rowLengthM'
    | 'turnRadiusM'
    | 'refillMinutes'
    | 'aircraftCount'
    | 'batteryCapacityKwh'
    | 'pumpCapacityLMin'
    | 'servicePricePerHa'
>;

const controls: Array<{ key: ControlKey; label: string; unit: string; min: number; max: number; step: number }> = [
    { key: 'tankLiters', label: 'Tank size', unit: 'L', min: 100, max: 300, step: 10 },
    { key: 'applicationRateLHa', label: 'Application rate', unit: 'L/ha', min: 8, max: 40, step: 1 },
    { key: 'swathM', label: 'Swath', unit: 'm', min: 12, max: 30, step: 1 },
    { key: 'spraySpeedKmh', label: 'Spray speed', unit: 'km/h', min: 100, max: 180, step: 5 },
    { key: 'turnSpeedKmh', label: 'Turn speed', unit: 'km/h', min: 30, max: 55, step: 1 },
    { key: 'rowLengthM', label: 'Row length', unit: 'm', min: 400, max: 1400, step: 50 },
    { key: 'turnRadiusM', label: 'Turn radius', unit: 'm', min: 15, max: 45, step: 1 },
    { key: 'refillMinutes', label: 'Refill time', unit: 'min', min: 3, max: 20, step: 1 },
    { key: 'aircraftCount', label: 'Aircraft count', unit: 'Ravens', min: 1, max: 2, step: 1 },
    { key: 'batteryCapacityKwh', label: 'Battery', unit: 'kWh', min: 30, max: 120, step: 5 },
    { key: 'pumpCapacityLMin', label: 'Pump capacity', unit: 'L/min', min: 80, max: 180, step: 5 },
    { key: 'servicePricePerHa', label: 'Service price', unit: '$/ha', min: 10, max: 45, step: 1 },
];

const phaseColors: Record<string, string> = {
    ready: '#94a3b8',
    launch: '#fb923c',
    transition: '#60a5fa',
    spray: '#22c55e',
    turn: '#eab308',
    return: '#a78bfa',
    landing: '#f472b6',
    refill: '#38bdf8',
};

function formatNumber(value: number, digits = 1) {
    return value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function StatCard({ icon: Icon, label, value, detail, accent = 'text-primary' }: { icon: ElementType; label: string; value: string; detail: string; accent?: string }) {
    return (
        <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/10 p-2">
                    <Icon className={cn('h-5 w-5', accent)} />
                </div>
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    <p className="text-2xl font-semibold text-white">{value}</p>
                </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{detail}</p>
        </div>
    );
}

function FieldMap({ result }: { result: ReturnType<typeof runRavenSimulation> }) {
    const width = 760;
    const height = 320;
    const margin = 42;
    const scaleX = (x: number) => margin + (x / result.field.lengthM) * (width - margin * 2);
    const scaleY = (y: number) => margin + (y / result.field.widthM) * (height - margin * 2);
    const path = result.telemetry
        .filter((_, index) => index % 4 === 0)
        .map((point, index) => `${index === 0 ? 'M' : 'L'} ${scaleX(Math.max(0, Math.min(result.field.lengthM, point.x))).toFixed(1)} ${scaleY(Math.max(0, Math.min(result.field.widthM, point.y))).toFixed(1)}`)
        .join(' ');
    const last = result.telemetry.findLast((point) => point.phase !== 'refill') ?? result.telemetry[result.telemetry.length - 1];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full rounded-xl bg-[#07111d]">
            <defs>
                <linearGradient id="sprayGradient" x1="0" x2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                    <stop offset="50%" stopColor="#22c55e" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.18" />
                </linearGradient>
            </defs>
            <rect x={margin} y={margin} width={width - margin * 2} height={height - margin * 2} fill="#0f2a1c" stroke="#2dd4bf" strokeOpacity="0.35" rx="16" />
            {Array.from({ length: Math.ceil(result.field.widthM / result.params.swathM) + 1 }).map((_, index) => {
                const y = scaleY(index * result.params.swathM);
                return <line key={index} x1={margin} x2={width - margin} y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.08" strokeDasharray="6 8" />;
            })}
            {result.coverage.map((lane) => {
                const y = scaleY(lane.y);
                const laneHeight = Math.max(5, (lane.width / result.field.widthM) * (height - margin * 2));
                return (
                    <rect
                        key={lane.id}
                        x={scaleX(Math.min(lane.x1, lane.x2))}
                        y={y - laneHeight / 2}
                        width={Math.abs(scaleX(lane.x2) - scaleX(lane.x1))}
                        height={laneHeight}
                        fill="url(#sprayGradient)"
                        stroke="#22c55e"
                        strokeOpacity="0.35"
                        rx="5"
                    />
                );
            })}
            <path d={path} fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
            <circle cx={scaleX(0)} cy={scaleY(result.params.swathM / 2)} r="5" fill="#fb923c" />
            <circle cx={scaleX(last.x)} cy={scaleY(last.y)} r="7" fill="#38bdf8" stroke="white" strokeWidth="2" />
            <text x={margin} y="24" fill="#cbd5e1" fontSize="13">Top-down field coverage, turn zones, and Raven S200-JF path</text>
            <text x={width - margin} y={height - 14} textAnchor="end" fill="#94a3b8" fontSize="12">
                {result.field.lengthM} m rows × {Math.round(result.field.widthM)} m treated width
            </text>
        </svg>
    );
}

function Sparkline({ points, value, label, color, max }: { points: RavenTelemetryPoint[]; value: (point: RavenTelemetryPoint) => number; label: string; color: string; max?: number }) {
    const width = 420;
    const height = 92;
    const sampled = points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 160)) === 0);
    const values = sampled.map(value);
    const maximum = max ?? Math.max(...values, 1);
    const path = sampled
        .map((point, index) => {
            const x = (index / Math.max(1, sampled.length - 1)) * width;
            const y = height - (value(point) / maximum) * (height - 12) - 6;
            return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');

    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span>max {formatNumber(maximum, 0)}</span>
            </div>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full">
                <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
                <line x1="0" x2={width} y1={height - 6} y2={height - 6} stroke="white" strokeOpacity="0.12" />
            </svg>
        </div>
    );
}

function PhaseTimeline({ result }: { result: ReturnType<typeof runRavenSimulation> }) {
    const totalSeconds = result.phaseSummaries.reduce((sum, phase) => sum + phase.seconds, 0);

    return (
        <div className="glass-panel rounded-xl p-4">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Flight phase timeline</h2>
                    <p className="text-sm text-muted-foreground">Rotor assist peaks in launch/turn/landing; folded U15 props reduce cruise drag.</p>
                </div>
                <TimerReset className="h-5 w-5 text-primary" />
            </div>
            <div className="flex h-5 overflow-hidden rounded-full bg-white/10">
                {result.phaseSummaries.map((phase) => (
                    <div
                        key={phase.phase}
                        style={{ width: `${(phase.seconds / totalSeconds) * 100}%`, backgroundColor: phaseColors[phase.phase] }}
                        title={`${phase.phase}: ${formatNumber(phase.seconds / 60)} min`}
                    />
                ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {result.phaseSummaries.map((phase) => (
                    <div key={phase.phase} className="rounded-lg bg-white/[0.04] p-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: phaseColors[phase.phase] }} />
                            <span className="capitalize text-sm font-medium">{phase.phase}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{formatNumber(phase.seconds / 60)} min · {formatNumber(phase.energyKwh)} kWh · {formatNumber(phase.sprayedHa)} ha</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function RavenSimulationDashboard() {
    const [params, setParams] = useState<RavenSimulationParams>(defaultRavenSimulationParams);
    const result = useMemo(() => runRavenSimulation(params), [params]);
    const latestFlightPoint = result.telemetry.findLast((point) => point.phase !== 'refill') ?? result.telemetry[result.telemetry.length - 1];

    const updateParam = (key: ControlKey, value: number) => {
        setParams((current) => ({ ...current, [key]: value }));
    };

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Rotor-assisted blown-wing simulation</p>
                    <h1 className="mt-2 text-3xl font-bold text-white">Raven S200-JF mission lab</h1>
                    <p className="mt-2 max-w-4xl text-muted-foreground">
                        Models Raven as a wing-borne agricultural aircraft with blown-wing lift, folded cruise lift props, rotor-assisted STOL launch, slow row-end turns, variable-rate spraying, landing, and refill-cycle productivity.
                    </p>
                </div>
                <button
                    onClick={() => setParams(defaultRavenSimulationParams)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
                >
                    <RotateCcw className="h-4 w-4" /> Reset conservative target
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={SprayCan} label="Per tank" value={`${formatNumber(result.productivity.hectaresPerTank)} ha`} detail={`${formatNumber(result.productivity.litersSprayed, 0)} L sprayed over ${result.productivity.passesCompleted} passes`} accent="text-green-400" />
                <StatCard icon={Gauge} label="Cycle productivity" value={`${formatNumber(result.productivity.fleetHaPerHour)} ha/h`} detail={`${params.aircraftCount} aircraft incl. ${params.refillMinutes} min refill cycles`} accent="text-blue-400" />
                <StatCard icon={BatteryCharging} label="Energy" value={`${formatNumber(result.productivity.energyPerSortieKwh)} kWh`} detail={`${formatNumber(result.productivity.batteryUsePercent)}% of configured battery per sortie`} accent="text-yellow-400" />
                <StatCard icon={TrendingUp} label="10h revenue" value={`$${formatNumber(result.productivity.revenuePerDay, 0)}`} detail={`${formatNumber(result.productivity.dailyHa10h)} ha/day at $${params.servicePricePerHa}/ha`} accent="text-emerald-400" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-6">
                    <div className="glass-panel h-[390px] rounded-xl p-4">
                        <FieldMap result={result} />
                    </div>
                    <PhaseTimeline result={result} />
                    <div className="glass-panel rounded-xl p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Telemetry plots</h2>
                                <p className="text-sm text-muted-foreground">Speed-linked pump flow, tank mass decline, lift sharing, and cumulative energy.</p>
                            </div>
                            <Wind className="h-5 w-5 text-primary" />
                        </div>
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                            <Sparkline points={result.telemetry} label="Ground speed (km/h)" value={(p) => p.speedMps * 3.6} color="#60a5fa" max={Math.max(180, params.spraySpeedKmh)} />
                            <Sparkline points={result.telemetry} label="Liquid remaining (L)" value={(p) => p.liquidL} color="#22c55e" max={params.tankLiters} />
                            <Sparkline points={result.telemetry} label="Pump flow (L/min)" value={(p) => p.pumpFlowLMin} color="#38bdf8" max={params.pumpCapacityLMin} />
                            <Sparkline points={result.telemetry} label="Rotor lift contribution (kgf)" value={(p) => (p.u15ThrustN + p.u15XxlThrustN) / 9.80665} color="#f97316" max={346} />
                            <Sparkline points={result.telemetry} label="Wing + blown lift (kgf)" value={(p) => (p.wingLiftN + p.blownLiftN) / 9.80665} color="#a78bfa" max={Math.max(450, params.dryMassKg + params.tankLiters)} />
                            <Sparkline points={result.telemetry} label="Energy used (kWh)" value={(p) => p.energyKwh} color="#facc15" max={params.batteryCapacityKwh} />
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="glass-panel rounded-xl p-4">
                        <h2 className="text-lg font-semibold">Mission controls</h2>
                        <p className="mb-4 text-sm text-muted-foreground">Adjust the commercial target envelope without changing the modular physics engine.</p>
                        <div className="space-y-4">
                            {controls.map((control) => (
                                <label key={control.key} className="block">
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{control.label}</span>
                                        <span className="font-medium text-white">{params[control.key]} {control.unit}</span>
                                    </div>
                                    <input
                                        className="w-full accent-primary"
                                        type="range"
                                        min={control.min}
                                        max={control.max}
                                        step={control.step}
                                        value={params[control.key]}
                                        onChange={(event) => updateParam(control.key, Number(event.target.value))}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl p-4">
                        <h2 className="text-lg font-semibold">Aircraft state at landing</h2>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg bg-white/[0.04] p-3"><span className="text-muted-foreground">Mass</span><p className="text-lg font-semibold">{formatNumber(latestFlightPoint.massKg)} kg</p></div>
                            <div className="rounded-lg bg-white/[0.04] p-3"><span className="text-muted-foreground">Battery</span><p className="text-lg font-semibold">{formatNumber(latestFlightPoint.batteryRemainingKwh)} kWh</p></div>
                            <div className="rounded-lg bg-white/[0.04] p-3"><span className="text-muted-foreground">Spray time</span><p className="text-lg font-semibold">{formatNumber(result.productivity.sprayTimePercent)}%</p></div>
                            <div className="rounded-lg bg-white/[0.04] p-3"><span className="text-muted-foreground">Turn time</span><p className="text-lg font-semibold">{formatNumber(result.productivity.turnTimePercent)}%</p></div>
                            <div className="rounded-lg bg-white/[0.04] p-3"><span className="text-muted-foreground">Avg flow</span><p className="text-lg font-semibold">{formatNumber(result.productivity.averagePumpFlowLMin)} L/min</p></div>
                            <div className="rounded-lg bg-white/[0.04] p-3"><span className="text-muted-foreground">Sorties/day</span><p className="text-lg font-semibold">{formatNumber(result.productivity.sortiesPerDay)}</p></div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl p-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold"><Plane className="h-5 w-5 text-primary" /> Flight model notes</h2>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li>• Productive passes use folded U15 lift props and low flap drag.</li>
                            <li>• Launch is near-STOL: rotor thrust is below full-tank hover weight, so wing/blown lift builds with speed.</li>
                            <li>• Row-end turns stop spraying, deploy flaps, unfold lift props, and use ~{params.turnRadiusM} m assisted turns.</li>
                            <li>• Pump flow is speed-linked to hold {params.applicationRateLHa} L/ha and prevent over-application in turns.</li>
                        </ul>
                    </div>

                    {result.warnings.length > 0 && (
                        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                            <h2 className="flex items-center gap-2 font-semibold text-yellow-200"><AlertTriangle className="h-5 w-5" /> Simulation warnings</h2>
                            <ul className="mt-3 space-y-2 text-sm text-yellow-100/80">
                                {result.warnings.map((warning) => (
                                    <li key={warning.kind}>• {warning.message}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
