export type RavenPhase =
    | 'ready'
    | 'launch'
    | 'transition'
    | 'spray'
    | 'turn'
    | 'return'
    | 'landing'
    | 'refill';

export type PropellerMode = 'deployed' | 'folded';

export interface RavenSimulationParams {
    tankLiters: number;
    dryMassKg: number;
    applicationRateLHa: number;
    swathM: number;
    spraySpeedKmh: number;
    turnSpeedKmh: number;
    rowLengthM: number;
    turnRadiusM: number;
    refillMinutes: number;
    aircraftCount: number;
    batteryCapacityKwh: number;
    pumpCapacityLMin: number;
    servicePricePerHa: number;
    dayHours: number;
    wingAreaM2: number;
    baseCdA: number;
}

export interface RavenTelemetryPoint {
    t: number;
    phase: RavenPhase;
    x: number;
    y: number;
    z: number;
    speedMps: number;
    headingDeg: number;
    massKg: number;
    liquidL: number;
    wingLiftN: number;
    blownLiftN: number;
    u15ThrustN: number;
    u15XxlThrustN: number;
    dragN: number;
    powerKw: number;
    energyKwh: number;
    batteryRemainingKwh: number;
    pumpFlowLMin: number;
    sprayedHa: number;
    sprayOn: boolean;
    propellerMode: PropellerMode;
    flapAngleDeg: number;
    clEffective: number;
}

export interface PhaseSummary {
    phase: RavenPhase;
    seconds: number;
    energyKwh: number;
    sprayedHa: number;
    averagePowerKw: number;
}

export interface CoverageLane {
    id: number;
    x1: number;
    x2: number;
    y: number;
    width: number;
    sprayedHa: number;
}

export interface CoverageWarning {
    kind: 'pump-capacity' | 'tank-limited' | 'coverage-gap' | 'hover-margin';
    message: string;
}

export interface ProductivitySummary {
    passesCompleted: number;
    hectaresPerTank: number;
    litersSprayed: number;
    sortieMinutes: number;
    cycleMinutes: number;
    sprayOnlyHaPerHour: number;
    sortieHaPerHour: number;
    cycleHaPerHourPerAircraft: number;
    fleetHaPerHour: number;
    dailyHa8h: number;
    dailyHa10h: number;
    revenuePerDay: number;
    sortiesPerDay: number;
    refillCyclesPerDay: number;
    averagePumpFlowLMin: number;
    averageSpraySpeedKmh: number;
    energyPerSortieKwh: number;
    batteryUsePercent: number;
    sprayTimePercent: number;
    turnTimePercent: number;
}

export interface RavenSimulationResult {
    params: RavenSimulationParams;
    telemetry: RavenTelemetryPoint[];
    phaseSummaries: PhaseSummary[];
    coverage: CoverageLane[];
    warnings: CoverageWarning[];
    productivity: ProductivitySummary;
    field: {
        lengthM: number;
        widthM: number;
        turnRadiusM: number;
    };
}

export const defaultRavenSimulationParams: RavenSimulationParams = {
    tankLiters: 200,
    dryMassKg: 200,
    applicationRateLHa: 20,
    swathM: 20,
    spraySpeedKmh: 140,
    turnSpeedKmh: 40,
    rowLengthM: 1000,
    turnRadiusM: 20,
    refillMinutes: 8,
    aircraftCount: 1,
    batteryCapacityKwh: 60,
    pumpCapacityLMin: 140,
    servicePricePerHa: 20,
    dayHours: 10,
    wingAreaM2: 9.5,
    baseCdA: 1.25,
};

const RHO = 1.225;
const G = 9.80665;
const MAX_U15_THRUST_N = 4 * 36.5 * G;
const MAX_U15_XXL_THRUST_N = 2 * 100 * G;
const TOTAL_ROTOR_STATIC_THRUST_N = MAX_U15_THRUST_N + MAX_U15_XXL_THRUST_N;

function kmhToMps(kmh: number) {
    return kmh / 3.6;
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export function areaRateHaPerHour(speedMps: number, swathM: number) {
    return speedMps * swathM * 0.36;
}

export function requiredPumpFlowLMin(applicationRateLHa: number, speedMps: number, swathM: number) {
    return applicationRateLHa * speedMps * swathM * 0.006;
}

function clForPhase(phase: RavenPhase, speedMps: number, flapAngleDeg: number, blownPowerFraction: number) {
    const base = phase === 'spray' ? 0.62 : 0.85;
    const flapBonus = Math.sin((flapAngleDeg * Math.PI) / 180) * 1.0;
    const blownBonus = blownPowerFraction * (speedMps < 18 ? 1.25 : 0.65);
    return clamp(base + flapBonus + blownBonus, 0.5, 3.2);
}

function dragForState(params: RavenSimulationParams, phase: RavenPhase, speedMps: number, propellerMode: PropellerMode, flapAngleDeg: number) {
    const foldedPenalty = propellerMode === 'folded' ? 0.06 : 0.62;
    const flapPenalty = Math.max(0, flapAngleDeg - 5) * 0.018;
    const turnPenalty = phase === 'turn' ? 0.35 : 0;
    const cdA = params.baseCdA + foldedPenalty + flapPenalty + turnPenalty;
    return 0.5 * RHO * speedMps * speedMps * cdA;
}

function phasePowerKw(phase: RavenPhase, speedMps: number, dragN: number, rotorThrustN: number, pumpFlowLMin: number) {
    const aerodynamicKw = (dragN * speedMps) / 1000 / 0.72;
    const rotorKw = rotorThrustN > 0 ? (rotorThrustN / G) * 0.115 : 0;
    const pumpKw = pumpFlowLMin * 0.018;
    const avionicsKw = phase === 'refill' || phase === 'ready' ? 0.4 : 1.2;
    const phaseBurstKw = phase === 'launch' ? 24 : phase === 'transition' ? 12 : phase === 'landing' ? 8 : 0;
    return Math.max(0, aerodynamicKw + rotorKw + pumpKw + avionicsKw + phaseBurstKw);
}

function appendPoint(
    points: RavenTelemetryPoint[],
    params: RavenSimulationParams,
    partial: Omit<RavenTelemetryPoint, 'massKg' | 'wingLiftN' | 'blownLiftN' | 'dragN' | 'powerKw' | 'batteryRemainingKwh' | 'clEffective'>,
) {
    const massKg = params.dryMassKg + partial.liquidL;
    const weightN = massKg * G;
    const blownFraction = partial.phase === 'spray' ? 0.45 : partial.phase === 'turn' ? 0.9 : partial.phase === 'launch' ? 1 : partial.phase === 'transition' ? 0.75 : 0.65;
    const clEffective = clForPhase(partial.phase, partial.speedMps, partial.flapAngleDeg, blownFraction);
    const totalWingLiftN = 0.5 * RHO * partial.speedMps * partial.speedMps * params.wingAreaM2 * clEffective;
    const blownLiftN = totalWingLiftN * clamp(blownFraction * 0.32, 0.12, 0.38);
    const rotorLiftN = partial.u15ThrustN + partial.u15XxlThrustN;
    const wingLiftN = Math.min(Math.max(0, totalWingLiftN - blownLiftN), Math.max(0, weightN - rotorLiftN + weightN * 0.05));
    const dragN = dragForState(params, partial.phase, partial.speedMps, partial.propellerMode, partial.flapAngleDeg);
    const powerKw = phasePowerKw(partial.phase, partial.speedMps, dragN, rotorLiftN, partial.pumpFlowLMin);
    const batteryRemainingKwh = Math.max(0, params.batteryCapacityKwh - partial.energyKwh);

    points.push({
        ...partial,
        massKg,
        wingLiftN,
        blownLiftN,
        dragN,
        powerKw,
        batteryRemainingKwh,
        clEffective,
    });
}

export function runRavenSimulation(input: Partial<RavenSimulationParams> = {}): RavenSimulationResult {
    const params = { ...defaultRavenSimulationParams, ...input };
    const telemetry: RavenTelemetryPoint[] = [];
    const coverage: CoverageLane[] = [];
    const warnings: CoverageWarning[] = [];

    const spraySpeedMps = kmhToMps(params.spraySpeedKmh);
    const turnSpeedMps = kmhToMps(params.turnSpeedKmh);
    const areaPerPassHa = (params.rowLengthM * params.swathM) / 10000;
    const hectaresPerTank = params.tankLiters / params.applicationRateLHa;
    const targetPasses = Math.max(1, Math.ceil(hectaresPerTank / areaPerPassHa));
    const pumpAtSpray = requiredPumpFlowLMin(params.applicationRateLHa, spraySpeedMps, params.swathM);

    if (pumpAtSpray > params.pumpCapacityLMin) {
        warnings.push({
            kind: 'pump-capacity',
            message: `Required cruise flow is ${pumpAtSpray.toFixed(0)} L/min, above installed ${params.pumpCapacityLMin.toFixed(0)} L/min pump capacity.`,
        });
    }

    if (TOTAL_ROTOR_STATIC_THRUST_N < (params.dryMassKg + params.tankLiters) * G) {
        warnings.push({
            kind: 'hover-margin',
            message: 'Rotor static thrust is below full-tank weight, so launch is modeled as rotor-assisted STOL with blown-wing lift rather than hover.',
        });
    }

    let t = 0;
    let x = -80;
    let y = params.swathM / 2;
    let headingDeg = 0;
    let liquidL = params.tankLiters;
    let energyKwh = 0;
    let sprayedHa = 0;

    const addSegment = (phase: RavenPhase, durationS: number, startSpeed: number, endSpeed: number, options: {
        startX?: number;
        endX?: number;
        startY?: number;
        endY?: number;
        startZ?: number;
        endZ?: number;
        startHeading?: number;
        endHeading?: number;
        sprayOn?: boolean;
        propellerMode?: PropellerMode;
        flapAngleDeg?: number;
        u15Fraction?: number;
        xxlFraction?: number;
        refillTank?: boolean;
    }) => {
        const steps = Math.max(1, Math.ceil(durationS));
        for (let i = 1; i <= steps; i++) {
            const f = i / steps;
            const speedMps = startSpeed + (endSpeed - startSpeed) * f;
            x = options.startX !== undefined && options.endX !== undefined ? options.startX + (options.endX - options.startX) * f : x + Math.cos((headingDeg * Math.PI) / 180) * speedMps;
            y = options.startY !== undefined && options.endY !== undefined ? options.startY + (options.endY - options.startY) * f : y + Math.sin((headingDeg * Math.PI) / 180) * speedMps;
            const z = (options.startZ ?? 4) + ((options.endZ ?? 4) - (options.startZ ?? 4)) * f;
            headingDeg = (options.startHeading ?? headingDeg) + ((options.endHeading ?? options.startHeading ?? headingDeg) - (options.startHeading ?? headingDeg)) * f;
            const pumpFlowLMin = options.sprayOn ? Math.min(params.pumpCapacityLMin, requiredPumpFlowLMin(params.applicationRateLHa, speedMps, params.swathM)) : 0;
            if (options.refillTank) {
                liquidL = Math.min(params.tankLiters, liquidL + params.tankLiters / Math.max(1, durationS));
            }
            const liquidUsed = pumpFlowLMin / 60;
            const actualLiquidUsed = Math.min(liquidL, liquidUsed);
            liquidL -= actualLiquidUsed;
            const areaThisStep = options.sprayOn ? actualLiquidUsed / params.applicationRateLHa : 0;
            sprayedHa += areaThisStep;

            const u15Fraction = options.u15Fraction ?? 0;
            const xxlFraction = options.xxlFraction ?? 0;
            const pointBase = {
                t: t + 1,
                phase,
                x,
                y,
                z,
                speedMps,
                headingDeg,
                liquidL,
                u15ThrustN: MAX_U15_THRUST_N * u15Fraction,
                u15XxlThrustN: MAX_U15_XXL_THRUST_N * xxlFraction,
                energyKwh,
                pumpFlowLMin,
                sprayedHa,
                sprayOn: Boolean(options.sprayOn && liquidL > 0),
                propellerMode: options.propellerMode ?? 'deployed',
                flapAngleDeg: options.flapAngleDeg ?? 20,
            };
            appendPoint(telemetry, params, pointBase);
            const last = telemetry[telemetry.length - 1];
            energyKwh += last.powerKw / 3600;
            last.energyKwh = energyKwh;
            last.batteryRemainingKwh = Math.max(0, params.batteryCapacityKwh - energyKwh);
            t += 1;
        }
    };

    appendPoint(telemetry, params, {
        t,
        phase: 'ready',
        x,
        y,
        z: 0,
        speedMps: 0,
        headingDeg,
        liquidL,
        u15ThrustN: 0,
        u15XxlThrustN: 0,
        energyKwh,
        pumpFlowLMin: 0,
        sprayedHa,
        sprayOn: false,
        propellerMode: 'deployed',
        flapAngleDeg: 35,
    });

    addSegment('launch', 18, 0, 22, { startX: -80, endX: 90, startY: y, endY: y, startZ: 0, endZ: 10, startHeading: 0, endHeading: 0, flapAngleDeg: 35, propellerMode: 'deployed', u15Fraction: 0.78, xxlFraction: 0.88 });
    addSegment('transition', 24, 22, spraySpeedMps, { startX: 90, endX: 0, startY: y, endY: y, startZ: 10, endZ: 6, startHeading: 0, endHeading: 0, flapAngleDeg: 18, propellerMode: 'deployed', u15Fraction: 0.25, xxlFraction: 0.18 });

    let pass = 0;
    while (pass < targetPasses && liquidL > 0.25) {
        const passStartX = pass % 2 === 0 ? 0 : params.rowLengthM;
        const passEndX = pass % 2 === 0 ? params.rowLengthM : 0;
        const passY = params.swathM / 2 + pass * params.swathM;
        const remainingHa = liquidL / params.applicationRateLHa;
        const passHa = Math.min(areaPerPassHa, remainingHa);
        const passLength = passHa * 10000 / params.swathM;
        const actualEndX = pass % 2 === 0 ? passStartX + passLength : passStartX - passLength;
        const duration = passLength / spraySpeedMps;
        addSegment('spray', duration, spraySpeedMps, spraySpeedMps, {
            startX: passStartX,
            endX: actualEndX,
            startY: passY,
            endY: passY,
            startZ: 6,
            endZ: 6,
            startHeading: pass % 2 === 0 ? 0 : 180,
            endHeading: pass % 2 === 0 ? 0 : 180,
            sprayOn: true,
            propellerMode: 'folded',
            flapAngleDeg: 6,
            u15Fraction: 0,
            xxlFraction: 0.02,
        });
        coverage.push({ id: pass + 1, x1: passStartX, x2: actualEndX, y: passY, width: params.swathM, sprayedHa: passHa });
        pass += 1;

        if (pass < targetPasses && liquidL > 0.25) {
            const nextY = params.swathM / 2 + pass * params.swathM;
            const turnDuration = Math.max(10, (Math.PI * params.turnRadiusM) / turnSpeedMps);
            addSegment('turn', turnDuration, spraySpeedMps, turnSpeedMps, {
                startX: passEndX,
                endX: passEndX,
                startY: passY,
                endY: nextY,
                startZ: 6,
                endZ: 6,
                startHeading: pass % 2 === 0 ? 0 : 180,
                endHeading: pass % 2 === 0 ? 180 : 0,
                sprayOn: false,
                propellerMode: 'deployed',
                flapAngleDeg: 32,
                u15Fraction: 0.45,
                xxlFraction: 0.35,
            });
            addSegment('transition', 10, turnSpeedMps, spraySpeedMps, {
                startX: passEndX,
                endX: passEndX,
                startY: nextY,
                endY: nextY,
                startZ: 6,
                endZ: 6,
                startHeading: pass % 2 === 0 ? 180 : 0,
                endHeading: pass % 2 === 0 ? 180 : 0,
                sprayOn: false,
                propellerMode: 'deployed',
                flapAngleDeg: 18,
                u15Fraction: 0.18,
                xxlFraction: 0.12,
            });
        }
    }

    if (liquidL <= 0.25 && sprayedHa + 0.001 < hectaresPerTank) {
        warnings.push({
            kind: 'tank-limited',
            message: 'The tank emptied before a full final pass; the final lane is shortened to prevent under-application.',
        });
    }

    const lastPassY = params.swathM / 2 + Math.max(0, pass - 1) * params.swathM;
    addSegment('return', 35, spraySpeedMps, 24, { startX: x, endX: -90, startY: lastPassY, endY: -45, startZ: 6, endZ: 10, startHeading: headingDeg, endHeading: 225, sprayOn: false, propellerMode: 'folded', flapAngleDeg: 12, u15Fraction: 0.05, xxlFraction: 0.05 });
    addSegment('landing', 24, 24, 0, { startX: -90, endX: -25, startY: -45, endY: -15, startZ: 10, endZ: 0, startHeading: 225, endHeading: 0, sprayOn: false, propellerMode: 'deployed', flapAngleDeg: 38, u15Fraction: 0.5, xxlFraction: 0.42 });
    const sortieSeconds = t;

    addSegment('refill', params.refillMinutes * 60, 0, 0, { startX: -25, endX: -25, startY: -15, endY: -15, startZ: 0, endZ: 0, startHeading: 0, endHeading: 0, sprayOn: false, propellerMode: 'deployed', flapAngleDeg: 0, u15Fraction: 0, xxlFraction: 0, refillTank: true });

    const phaseMap = new Map<RavenPhase, PhaseSummary>();
    for (let i = 1; i < telemetry.length; i++) {
        const p = telemetry[i];
        const previous = telemetry[i - 1];
        const existing = phaseMap.get(p.phase) ?? { phase: p.phase, seconds: 0, energyKwh: 0, sprayedHa: 0, averagePowerKw: 0 };
        existing.seconds += 1;
        existing.energyKwh += Math.max(0, p.energyKwh - previous.energyKwh);
        existing.sprayedHa += Math.max(0, p.sprayedHa - previous.sprayedHa);
        phaseMap.set(p.phase, existing);
    }
    const phaseSummaries = Array.from(phaseMap.values()).map((summary) => ({
        ...summary,
        averagePowerKw: summary.seconds > 0 ? (summary.energyKwh / summary.seconds) * 3600 : 0,
    }));

    const sprayPoints = telemetry.filter((point) => point.sprayOn);
    const turnSeconds = phaseSummaries.filter((s) => s.phase === 'turn').reduce((sum, s) => sum + s.seconds, 0);
    const spraySeconds = sprayPoints.length;
    const sortieMinutes = sortieSeconds / 60;
    const cycleMinutes = sortieMinutes + params.refillMinutes;
    const energyPerSortieKwh = telemetry.find((point) => point.t >= sortieSeconds)?.energyKwh ?? energyKwh;
    const sortieHaPerHour = sprayedHa / (sortieMinutes / 60);
    const cycleHaPerHourPerAircraft = sprayedHa / (cycleMinutes / 60);
    const fleetHaPerHour = cycleHaPerHourPerAircraft * params.aircraftCount;
    const dailyHa8h = fleetHaPerHour * 8;
    const dailyHa10h = fleetHaPerHour * 10;

    return {
        params,
        telemetry,
        phaseSummaries,
        coverage,
        warnings,
        field: {
            lengthM: params.rowLengthM,
            widthM: Math.max(params.swathM * targetPasses, 1),
            turnRadiusM: params.turnRadiusM,
        },
        productivity: {
            passesCompleted: pass,
            hectaresPerTank: sprayedHa,
            litersSprayed: sprayedHa * params.applicationRateLHa,
            sortieMinutes,
            cycleMinutes,
            sprayOnlyHaPerHour: areaRateHaPerHour(spraySpeedMps, params.swathM),
            sortieHaPerHour,
            cycleHaPerHourPerAircraft,
            fleetHaPerHour,
            dailyHa8h,
            dailyHa10h,
            revenuePerDay: dailyHa10h * params.servicePricePerHa,
            sortiesPerDay: (params.dayHours * 60) / cycleMinutes * params.aircraftCount,
            refillCyclesPerDay: (params.dayHours * 60) / cycleMinutes * params.aircraftCount,
            averagePumpFlowLMin: sprayPoints.length > 0 ? sprayPoints.reduce((sum, p) => sum + p.pumpFlowLMin, 0) / sprayPoints.length : 0,
            averageSpraySpeedKmh: sprayPoints.length > 0 ? sprayPoints.reduce((sum, p) => sum + p.speedMps * 3.6, 0) / sprayPoints.length : 0,
            energyPerSortieKwh,
            batteryUsePercent: params.batteryCapacityKwh > 0 ? (energyPerSortieKwh / params.batteryCapacityKwh) * 100 : 0,
            sprayTimePercent: sortieSeconds > 0 ? (spraySeconds / sortieSeconds) * 100 : 0,
            turnTimePercent: sortieSeconds > 0 ? (turnSeconds / sortieSeconds) * 100 : 0,
        },
    };
}
