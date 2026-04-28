import type { WeeklyChallenge, WeeklyChallengePriority, GameTime } from './game-store';
import type { Field } from './mock-data';
import { canPerformOperation } from './game-logic/field-simulation';

export type CornChallengeCategory = 'pest' | 'disease' | 'weed' | 'nutrient' | 'weather' | 'other';
export type CornChallengeSeverity = 'mild' | 'moderate' | 'severe';
export type CornChallengeInputType = 'herbicide' | 'insecticide' | 'fungicide' | 'fertilizer' | 'seed' | 'none';

export interface CornChallengeTemplate {
    id: string;
    name: string;
    category: CornChallengeCategory;
    escalationWeeks: number;
    description: string;
    symptoms: string;
    timing: { minGrowthDay: number; maxGrowthDay: number };
    severity: CornChallengeSeverity;
    yieldImpactPct: number;
    mitigationOperations: string[];
    mitigationDescription: string;
    mitigationCost: number;
    requiresInput: { type: CornChallengeInputType; productHint?: string };
}

const MILD_SEVERITY: CornChallengeSeverity = 'mild';
const SEASON_ORDER: GameTime['season'][] = ['Spring', 'Summer', 'Autumn', 'Winter'];
const WEEKS_PER_SEASON = 12;
const SEVERITY_MULTIPLIER: Record<CornChallengeSeverity, number> = {
    mild: 1,
    moderate: 2,
    severe: 4,
};

function challengeWeekNumber(gameTime: GameTime): number {
    return ((gameTime.year - 1) * SEASON_ORDER.length * WEEKS_PER_SEASON)
        + (SEASON_ORDER.indexOf(gameTime.season) * WEEKS_PER_SEASON)
        + gameTime.week;
}

export function getChallengeWeekNumber(gameTime: GameTime): number {
    return challengeWeekNumber(gameTime);
}

const DAY_BY_BBCH: Record<string, number> = {
    '00': 1,
    '05': 5,
    '11': 8,
    '12': 12,
    '13': 16,
    '14': 24,
    '16': 34,
    '31': 48,
    '33': 56,
    '35': 64,
    '53': 70,
    '69': 76,
    '74': 84,
    '79': 92,
    '83': 100,
    '87': 110,
    '89': 120,
};

export const CORN_CHALLENGE_TEMPLATES: CornChallengeTemplate[] = [
    {
        id: 'european-corn-borer',
        name: 'European Corn Borer Infestation',
        category: 'pest',
        escalationWeeks: 2,
        description: 'First-generation European corn borer larvae feed in whorls before tunneling into stalks. Once larvae are inside the stalk, control becomes difficult and plants can lose standability and ear fill.',
        symptoms: 'Shot-hole feeding in leaves, small frass deposits in the whorl, broken tassels, stalk tunneling, and weak plants that lodge later in the season.',
        timing: { minGrowthDay: 34, maxGrowthDay: 56 },
        severity: 'severe',
        yieldImpactPct: 15,
        mitigationOperations: ['serv-spray-drone', 'op-apply-herbicide', 'op-scout'],
        mitigationDescription: 'Scout whorls and apply a labeled pyrethroid or Bt-compatible insecticide while larvae are exposed, ideally within 48 hours of threshold detection.',
        mitigationCost: 1200,
        requiresInput: { type: 'insecticide', productHint: 'Pyrethroid insecticide' },
    },
    {
        id: 'corn-rootworm',
        name: 'Corn Rootworm Pressure',
        category: 'pest',
        escalationWeeks: 2,
        description: 'Corn rootworm larvae prune nodal roots below ground. Economic damage is highest in continuous corn or fields without rootworm traits or soil insecticide protection.',
        symptoms: 'Root pruning, goose-necked plants, uneven growth, drought-like stress, and lodging after wind or irrigation.',
        timing: { minGrowthDay: 8, maxGrowthDay: 48 },
        severity: 'severe',
        yieldImpactPct: 20,
        mitigationOperations: ['op-scout', 'serv-spray-drone'],
        mitigationDescription: 'Dig roots to rate pruning. For current-season rescue, monitor adult beetles and protect silks if needed; for next planting, use a Bt rootworm trait or soil insecticide.',
        mitigationCost: 1800,
        requiresInput: { type: 'insecticide', productHint: 'Soil insecticide or Bt rootworm trait' },
    },
    {
        id: 'fall-armyworm',
        name: 'Fall Armyworm Feeding',
        category: 'pest',
        escalationWeeks: 2,
        description: 'Fall armyworm can move quickly through late vegetative and reproductive corn, especially in warm weather. Larger larvae cause most of the feeding and are harder to control.',
        symptoms: 'Ragged leaf holes, window-pane feeding, wet frass in whorls, and feeding injury on ears or husks.',
        timing: { minGrowthDay: 48, maxGrowthDay: 110 },
        severity: 'moderate',
        yieldImpactPct: 10,
        mitigationOperations: ['serv-spray-drone', 'op-apply-herbicide', 'op-scout'],
        mitigationDescription: 'Scout whorls and ear zones. Apply a labeled insecticide before larvae exceed threshold size and before they move deep into the whorl.',
        mitigationCost: 950,
        requiresInput: { type: 'insecticide', productHint: 'Lepidopteran insecticide' },
    },
    {
        id: 'corn-earworm',
        name: 'Corn Earworm at Silking',
        category: 'pest',
        escalationWeeks: 2,
        description: 'Corn earworm moths lay eggs on fresh silks. Larvae feed on silks and developing kernels, causing direct grain injury and opening infection courts for ear molds.',
        symptoms: 'Clipped silks, frass at ear tips, kernel feeding on the upper ear, and damaged husks near the silk channel.',
        timing: { minGrowthDay: 76, maxGrowthDay: 100 },
        severity: 'moderate',
        yieldImpactPct: 8,
        mitigationOperations: ['serv-spray-drone', 'op-apply-herbicide', 'op-scout'],
        mitigationDescription: 'Treat at silk emergence when moth pressure is high, targeting fresh silks before larvae enter the ear tip.',
        mitigationCost: 900,
        requiresInput: { type: 'insecticide', productHint: 'Silk-stage insecticide' },
    },
    {
        id: 'black-cutworm',
        name: 'Black Cutworm Seedling Injury',
        category: 'pest',
        escalationWeeks: 2,
        description: 'Black cutworm larvae cut young corn plants near the soil surface. Rescue treatment can preserve stand if cutting is caught early.',
        symptoms: 'Wilted or severed seedlings, plants cut at the soil line, missing plants in patches, and larvae curled in soil near damaged plants.',
        timing: { minGrowthDay: 8, maxGrowthDay: 24 },
        severity: 'severe',
        yieldImpactPct: 12,
        mitigationOperations: ['serv-spray-drone', 'op-apply-herbicide', 'op-scout'],
        mitigationDescription: 'Scout damaged rows and apply a rescue insecticide when cutting reaches threshold and larvae are still active.',
        mitigationCost: 850,
        requiresInput: { type: 'insecticide', productHint: 'Cutworm rescue insecticide' },
    },
    {
        id: 'wireworm',
        name: 'Wireworm Stand Loss',
        category: 'pest',
        escalationWeeks: 2,
        description: 'Wireworms feed on seed and seedlings in cool soils. Injury usually appears as skips or weak plants shortly after planting.',
        symptoms: 'Poor emergence, hollowed seed, wilted seedlings, thin stand, and dead plants with feeding marks below ground.',
        timing: { minGrowthDay: 1, maxGrowthDay: 8 },
        severity: 'moderate',
        yieldImpactPct: 7,
        mitigationOperations: ['op-scout', 'weekly-plan-open'],
        mitigationDescription: 'Confirm stand loss with scouting. In severe areas, plan seed treatment or in-furrow insecticide for the next planting; replant only if stand loss exceeds the economic threshold.',
        mitigationCost: 650,
        requiresInput: { type: 'seed', productHint: 'Insecticide seed treatment' },
    },
    {
        id: 'gray-leaf-spot',
        name: 'Gray Leaf Spot',
        category: 'disease',
        escalationWeeks: 3,
        description: 'Gray leaf spot develops under humid, warm conditions and can remove large amounts of photosynthetic leaf area during grain fill.',
        symptoms: 'Narrow rectangular gray to tan lesions between leaf veins, often beginning on lower leaves and moving upward.',
        timing: { minGrowthDay: 70, maxGrowthDay: 110 },
        severity: 'severe',
        yieldImpactPct: 18,
        mitigationOperations: ['serv-spray-drone', 'op-apply-herbicide', 'op-scout'],
        mitigationDescription: 'Apply a labeled foliar fungicide near VT to R1 when lesions are active on the ear leaf or below and forecast humidity remains high.',
        mitigationCost: 1400,
        requiresInput: { type: 'fungicide', productHint: 'Strobilurin/triazole fungicide' },
    },
    {
        id: 'northern-corn-leaf-blight',
        name: 'Northern Corn Leaf Blight',
        category: 'disease',
        escalationWeeks: 3,
        description: 'Northern corn leaf blight reduces green leaf area before and during grain fill, especially in fields with susceptible hybrids and heavy residue.',
        symptoms: 'Long cigar-shaped gray-green to tan lesions, usually starting on lower canopy leaves.',
        timing: { minGrowthDay: 48, maxGrowthDay: 110 },
        severity: 'moderate',
        yieldImpactPct: 12,
        mitigationOperations: ['serv-spray-drone', 'op-apply-herbicide', 'op-scout'],
        mitigationDescription: 'Scout from V10 through VT and apply a foliar fungicide when lesions are active and weather favors continued disease spread.',
        mitigationCost: 1300,
        requiresInput: { type: 'fungicide', productHint: 'Foliar corn fungicide' },
    },
    {
        id: 'southern-rust',
        name: 'Southern Rust',
        category: 'disease',
        escalationWeeks: 3,
        description: 'Southern rust can explode quickly in warm, humid weather. Early detection is critical because yield loss occurs when upper leaves are infected before dent.',
        symptoms: 'Small orange pustules mostly on the upper leaf surface, dusty spores, and rapid spread across the upper canopy.',
        timing: { minGrowthDay: 70, maxGrowthDay: 110 },
        severity: 'severe',
        yieldImpactPct: 25,
        mitigationOperations: ['serv-spray-drone', 'op-apply-herbicide', 'op-scout'],
        mitigationDescription: 'Apply a labeled fungicide at first detection when crop is before dent and weather remains favorable for rust.',
        mitigationCost: 1500,
        requiresInput: { type: 'fungicide', productHint: 'Rust-active fungicide' },
    },
    {
        id: 'fusarium-ear-rot',
        name: 'Fusarium Ear Rot',
        category: 'disease',
        escalationWeeks: 3,
        description: 'Fusarium ear rot is favored by insect injury and stress during grain fill. It can reduce grain quality and increase mycotoxin risk.',
        symptoms: 'White to pink mold on scattered kernels or ear tips, often near insect feeding damage.',
        timing: { minGrowthDay: 84, maxGrowthDay: 120 },
        severity: 'moderate',
        yieldImpactPct: 10,
        mitigationOperations: ['op-scout', 'op-harvest'],
        mitigationDescription: 'Scout ears, reduce insect injury where possible, harvest timely, dry grain promptly, and prioritize resistant hybrids in future seasons.',
        mitigationCost: 700,
        requiresInput: { type: 'none' },
    },
    {
        id: 'common-smut',
        name: 'Common Smut',
        category: 'disease',
        escalationWeeks: 3,
        description: 'Common smut infects injured or rapidly growing tissue. Direct rescue treatment is rarely economical, so management focuses on minimizing injury and tracking affected ears.',
        symptoms: 'White to gray galls on leaves, stalks, tassels, or ears that later rupture into dark powdery spores.',
        timing: { minGrowthDay: 76, maxGrowthDay: 84 },
        severity: 'mild',
        yieldImpactPct: 4,
        mitigationOperations: ['op-scout', 'weekly-plan-open'],
        mitigationDescription: 'There is no reliable direct foliar rescue. Scout affected areas, avoid mechanical injury, and select tolerant hybrids next season.',
        mitigationCost: 250,
        requiresInput: { type: 'none' },
    },
    {
        id: 'palmer-amaranth',
        name: 'Palmer Amaranth Escape',
        category: 'weed',
        escalationWeeks: 3,
        description: 'Palmer amaranth grows rapidly and can cause major corn yield loss if allowed to compete after early vegetative stages.',
        symptoms: 'Fast-growing pigweed plants above the canopy, dense flushes in row middles, and broadleaf competition for light and nitrogen.',
        timing: { minGrowthDay: 16, maxGrowthDay: 48 },
        severity: 'severe',
        yieldImpactPct: 35,
        mitigationOperations: ['op-apply-herbicide', 'serv-spray-drone', 'op-scout'],
        mitigationDescription: 'Apply a timely post-emergence herbicide with effective residual activity while weeds are small and actively growing.',
        mitigationCost: 1100,
        requiresInput: { type: 'herbicide', productHint: 'Post-emergence broadleaf herbicide' },
    },
    {
        id: 'giant-foxtail',
        name: 'Giant Foxtail Competition',
        category: 'weed',
        escalationWeeks: 3,
        description: 'Giant foxtail competes strongly for nitrogen and moisture, especially when it emerges with corn and escapes early control.',
        symptoms: 'Grassy weeds in rows, bristly seedheads later in the season, and thin corn where grass density is high.',
        timing: { minGrowthDay: 16, maxGrowthDay: 48 },
        severity: 'moderate',
        yieldImpactPct: 12,
        mitigationOperations: ['op-apply-herbicide', 'serv-spray-drone', 'op-scout'],
        mitigationDescription: 'Apply a labeled post grass herbicide or tank mix before foxtail exceeds label height limits.',
        mitigationCost: 850,
        requiresInput: { type: 'herbicide', productHint: 'Grass herbicide' },
    },
    {
        id: 'johnsongrass',
        name: 'Johnsongrass Rhizome Spread',
        category: 'weed',
        escalationWeeks: 3,
        description: 'Johnsongrass spreads from rhizomes and seed. It competes heavily and can persist for years if patches are not controlled.',
        symptoms: 'Tall coarse grass patches, rhizome regrowth after tillage, and clumps that overtop corn.',
        timing: { minGrowthDay: 16, maxGrowthDay: 84 },
        severity: 'moderate',
        yieldImpactPct: 15,
        mitigationOperations: ['op-apply-herbicide', 'serv-spray-drone', 'op-scout'],
        mitigationDescription: 'Spot spray actively growing patches with a labeled systemic herbicide and prevent seed production.',
        mitigationCost: 900,
        requiresInput: { type: 'herbicide', productHint: 'Systemic grass herbicide' },
    },
    {
        id: 'velvetleaf',
        name: 'Velvetleaf Broadleaf Competition',
        category: 'weed',
        escalationWeeks: 3,
        description: 'Velvetleaf shades young corn and removes water and nutrients during the critical weed-free period.',
        symptoms: 'Large heart-shaped fuzzy leaves, broadleaf plants in row middles, and shaded corn in dense patches.',
        timing: { minGrowthDay: 16, maxGrowthDay: 48 },
        severity: 'moderate',
        yieldImpactPct: 10,
        mitigationOperations: ['op-apply-herbicide', 'serv-spray-drone', 'op-scout'],
        mitigationDescription: 'Apply a labeled post-emergence broadleaf herbicide such as dicamba or 2,4-D where crop stage and label restrictions allow.',
        mitigationCost: 800,
        requiresInput: { type: 'herbicide', productHint: 'Dicamba or 2,4-D corn herbicide' },
    },
    {
        id: 'waterhemp',
        name: 'Waterhemp Escape',
        category: 'weed',
        escalationWeeks: 3,
        description: 'Waterhemp emerges over a long period and often carries herbicide resistance, so single-mode rescue programs can fail.',
        symptoms: 'Smooth pigweed plants of different sizes, dense late flushes, and broadleaf competition that persists after earlier spray passes.',
        timing: { minGrowthDay: 16, maxGrowthDay: 48 },
        severity: 'severe',
        yieldImpactPct: 28,
        mitigationOperations: ['op-apply-herbicide', 'serv-spray-drone', 'op-scout'],
        mitigationDescription: 'Use a multi-mode post-emergence program with residual control and target small actively growing weeds.',
        mitigationCost: 1150,
        requiresInput: { type: 'herbicide', productHint: 'Multi-mode residual herbicide' },
    },
    {
        id: 'nitrogen-deficiency',
        name: 'Nitrogen Deficiency',
        category: 'nutrient',
        escalationWeeks: 4,
        description: 'Corn nitrogen demand rises quickly from V6 through reproductive stages. Deficiency during this period directly limits canopy growth and grain fill.',
        symptoms: 'V-shaped yellowing from the leaf tip down the midrib on lower leaves, pale canopy color, and reduced vigor.',
        timing: { minGrowthDay: 34, maxGrowthDay: 92 },
        severity: 'severe',
        yieldImpactPct: 22,
        mitigationOperations: ['op-topdress-fertilizer', 'serv-topdress-fertilizer', 'op-soil-test'],
        mitigationDescription: 'Side-dress UAN or urea as soon as field conditions allow, using soil and tissue information to avoid over-application.',
        mitigationCost: 1600,
        requiresInput: { type: 'fertilizer', productHint: 'UAN or urea 46-0-0' },
    },
    {
        id: 'phosphorus-deficiency',
        name: 'Phosphorus Deficiency',
        category: 'nutrient',
        escalationWeeks: 4,
        description: 'Phosphorus deficiency is most visible in cool early growth and restricts root development and early vigor.',
        symptoms: 'Purple or red leaf margins, stunted seedlings, delayed growth, and poor early root mass.',
        timing: { minGrowthDay: 8, maxGrowthDay: 24 },
        severity: 'moderate',
        yieldImpactPct: 8,
        mitigationOperations: ['op-soil-test', 'op-apply-fertilizer-incorporated'],
        mitigationDescription: 'Confirm with soil testing and apply starter or banded phosphorus in the seed zone where label and timing allow.',
        mitigationCost: 1000,
        requiresInput: { type: 'fertilizer', productHint: 'Starter phosphate fertilizer' },
    },
    {
        id: 'potassium-deficiency',
        name: 'Potassium Deficiency',
        category: 'nutrient',
        escalationWeeks: 4,
        description: 'Potassium supports water regulation and stalk strength. Deficiency increases drought stress and stalk lodging risk.',
        symptoms: 'Yellow then brown firing along lower leaf margins, weak stalks, and poor staygreen during grain fill.',
        timing: { minGrowthDay: 34, maxGrowthDay: 100 },
        severity: 'moderate',
        yieldImpactPct: 12,
        mitigationOperations: ['op-soil-test', 'op-topdress-fertilizer', 'serv-topdress-fertilizer'],
        mitigationDescription: 'Use soil tests to confirm low K and apply potassium ahead of expected demand; foliar feeding is only a short-term support.',
        mitigationCost: 1200,
        requiresInput: { type: 'fertilizer', productHint: 'Potash or foliar potassium' },
    },
    {
        id: 'zinc-deficiency',
        name: 'Zinc Deficiency',
        category: 'nutrient',
        escalationWeeks: 4,
        description: 'Zinc deficiency is common on high-pH, sandy, or low organic matter soils and is most visible in young corn.',
        symptoms: 'Interveinal chlorotic stripes on younger leaves, shortened internodes, and pale bands near the leaf base.',
        timing: { minGrowthDay: 12, maxGrowthDay: 34 },
        severity: 'mild',
        yieldImpactPct: 5,
        mitigationOperations: ['op-soil-test', 'op-topdress-fertilizer'],
        mitigationDescription: 'Confirm with soil or tissue testing and apply foliar zinc where deficiency is active.',
        mitigationCost: 450,
        requiresInput: { type: 'fertilizer', productHint: 'Foliar zinc' },
    },
    {
        id: 'sulfur-deficiency',
        name: 'Sulfur Deficiency',
        category: 'nutrient',
        escalationWeeks: 4,
        description: 'Sulfur deficiency can mimic nitrogen stress but appears first on newer leaves because sulfur is less mobile in the plant.',
        symptoms: 'General yellowing of new leaves, pale striping, slow growth, and uneven symptoms in sandy or low organic matter areas.',
        timing: { minGrowthDay: 24, maxGrowthDay: 40 },
        severity: 'moderate',
        yieldImpactPct: 7,
        mitigationOperations: ['op-topdress-fertilizer', 'serv-topdress-fertilizer', 'op-soil-test'],
        mitigationDescription: 'Side-dress ammonium sulfate or another sulfate source where deficiency is confirmed or likely.',
        mitigationCost: 700,
        requiresInput: { type: 'fertilizer', productHint: 'Ammonium sulfate' },
    },
    {
        id: 'drought-during-silking',
        name: 'Drought During Silking',
        category: 'weather',
        escalationWeeks: 1,
        description: 'Water stress at silking is one of the highest-risk periods in corn because pollination and kernel set depend on adequate moisture.',
        symptoms: 'Leaf rolling, delayed silk emergence, poor pollen-silk synchrony, kernel abortion, and barren ear tips.',
        timing: { minGrowthDay: 74, maxGrowthDay: 80 },
        severity: 'severe',
        yieldImpactPct: 30,
        mitigationOperations: ['serv-irrigate', 'op-irrigation-setup', 'op-scout'],
        mitigationDescription: 'Irrigate if available and prioritize fields at R1. If irrigation is not available, scout after pollination to estimate kernel set and adjust yield expectations.',
        mitigationCost: 1700,
        requiresInput: { type: 'none' },
    },
    {
        id: 'hail-damage',
        name: 'Hail Damage',
        category: 'weather',
        escalationWeeks: 1,
        description: 'Hail strips leaf area and can bruise stalks or ears. Yield impact depends strongly on growth stage and remaining green leaf area.',
        symptoms: 'Shredded leaves, bruised stalks, broken plants, exposed ear tissue, and stripped upper canopy.',
        timing: { minGrowthDay: 1, maxGrowthDay: 120 },
        severity: 'moderate',
        yieldImpactPct: 14,
        mitigationOperations: ['op-scout', 'serv-spray-drone'],
        mitigationDescription: 'Wait several days to assess regrowth, estimate remaining leaf area, and consider fungicide if wounds and wet weather create disease risk.',
        mitigationCost: 900,
        requiresInput: { type: 'fungicide', productHint: 'Protective fungicide if disease risk is high' },
    },
    {
        id: 'lodging-from-wind',
        name: 'Wind Lodging and Green Snap',
        category: 'weather',
        escalationWeeks: 1,
        description: 'Strong winds can snap fast-growing vegetative corn or lodge stalks late in grain fill, reducing harvest efficiency and yield.',
        symptoms: 'Green snap above nodes, goose-necked plants, stalks leaning or broken below the ear, and harvest rows lying in one direction.',
        timing: { minGrowthDay: 48, maxGrowthDay: 120 },
        severity: 'severe',
        yieldImpactPct: 18,
        mitigationOperations: ['op-scout', 'op-harvest'],
        mitigationDescription: 'Scout standability. If crop is near maturity and stalk lodging is increasing, harvest early to preserve grain and reduce field loss.',
        mitigationCost: 1000,
        requiresInput: { type: 'none' },
    },
    {
        id: 'soil-compaction',
        name: 'Soil Compaction',
        category: 'other',
        escalationWeeks: 4,
        description: 'Compacted soil restricts corn roots, water infiltration, and nutrient uptake throughout the season. Wet traffic is the most common cause.',
        symptoms: 'Stunted strips, shallow roots, ponding after rain, sidewall smear, and drought stress even when rainfall has been adequate.',
        timing: { minGrowthDay: 1, maxGrowthDay: 120 },
        severity: 'moderate',
        yieldImpactPct: 10,
        mitigationOperations: ['op-scout', 'op-plow'],
        mitigationDescription: 'Avoid additional wet field traffic this season. Scout root restriction and plan subsoiling or deep ripping when soil moisture is suitable after harvest.',
        mitigationCost: 900,
        requiresInput: { type: 'none' },
    },
    {
        id: 'bird-damage',
        name: 'Bird Damage to Seedlings',
        category: 'other',
        escalationWeeks: 4,
        description: 'Birds can pull seedlings or feed on seed in newly emerged corn, creating skips and stand gaps.',
        symptoms: 'Pulled seedlings, missing plants, seed remnants on the soil surface, and uneven stand in field edges or near roosting areas.',
        timing: { minGrowthDay: 8, maxGrowthDay: 16 },
        severity: 'mild',
        yieldImpactPct: 4,
        mitigationOperations: ['op-scout', 'weekly-plan-open'],
        mitigationDescription: 'Count final stand after emergence. Replant only where stand loss is severe enough to beat the expected yield from the remaining stand.',
        mitigationCost: 400,
        requiresInput: { type: 'seed', productHint: 'Replant seed if stand is below threshold' },
    },
    {
        id: 'uneven-emergence',
        name: 'Uneven Corn Emergence',
        category: 'other',
        escalationWeeks: 4,
        description: 'Uneven emergence creates late plants that act like weeds beside earlier plants, reducing ear size and uniformity.',
        symptoms: 'Late seedlings two or more leaves behind neighbors, irregular rows, sidewall compaction, and plants shaded by earlier emerging corn.',
        timing: { minGrowthDay: 8, maxGrowthDay: 12 },
        severity: 'moderate',
        yieldImpactPct: 9,
        mitigationOperations: ['op-scout', 'weekly-plan-open'],
        mitigationDescription: 'Diagnose planter depth, seed-to-soil contact, residue, and soil temperature issues. Replant only if stand and uniformity fall below local thresholds.',
        mitigationCost: 600,
        requiresInput: { type: 'seed', productHint: 'Replant seed if severe' },
    },
];

function isCornField(field: Field): boolean {
    return (field.crop || '').toLowerCase().includes('corn');
}

function getGrowthDay(gameTime: GameTime, field: Field): number | null {
    if (field.farmingStage !== 'growing' && field.farmingStage !== 'harvest_ready') return null;
    if (field.bbchStage && DAY_BY_BBCH[field.bbchStage]) return DAY_BY_BBCH[field.bbchStage];
    const seasonOffset = gameTime.season === 'Spring' ? 0 : gameTime.season === 'Summer' ? 48 : gameTime.season === 'Autumn' ? 96 : 144;
    return Math.max(1, Math.min(120, seasonOffset + ((gameTime.week - 1) * 4) + 1));
}

function seededRandom(seed: string): number {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
        hash ^= seed.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) / 4294967295;
}

function timingWeight(day: number, timing: CornChallengeTemplate['timing']): number {
    if (day < timing.minGrowthDay || day > timing.maxGrowthDay) return 0;
    const span = Math.max(1, timing.maxGrowthDay - timing.minGrowthDay);
    const mid = timing.minGrowthDay + (span / 2);
    const distance = Math.abs(day - mid) / (span / 2 || 1);
    return Math.max(0.25, 1 - (distance * 0.75));
}

function severityPriority(severity: CornChallengeSeverity): WeeklyChallengePriority {
    if (severity === 'severe') return 'critical';
    if (severity === 'moderate') return 'high';
    return 'medium';
}

function rewardXp(severity: CornChallengeSeverity): number {
    if (severity === 'severe') return 75;
    if (severity === 'moderate') return 55;
    return 35;
}

function chooseOperation(template: CornChallengeTemplate, field?: Field): string | undefined {
    if (!field) return template.mitigationOperations[0];
    // Pick the first mitigation operation that is valid for the field's current stage
    for (const op of template.mitigationOperations) {
        if (canPerformOperation(field, op).allowed) {
            return op;
        }
    }
    // No direct field operation is valid for the current stage — use acknowledge-only mode
    // so the player can review and mark done without getting blocked
    return 'weekly-plan-open';
}

function severityMultiplier(severity: CornChallengeSeverity): number {
    return SEVERITY_MULTIPLIER[severity] || 1;
}

function getEscalatedSeverity(severity?: CornChallengeSeverity): CornChallengeSeverity | null {
    if (severity === 'mild') return 'moderate';
    if (severity === 'moderate') return 'severe';
    return null;
}

export function escalateChallenges(
    challenges: WeeklyChallenge[],
    currentGameTime: GameTime,
    onEscalate?: (challenge: WeeklyChallenge, nextSeverity: CornChallengeSeverity) => void
): WeeklyChallenge[] {
    const currentWeek = challengeWeekNumber(currentGameTime);

    return challenges.map((challenge) => {
        if (
            challenge.status !== 'open' ||
            !challenge.challengeTemplateId ||
            !challenge.createdWeek ||
            !challenge.escalationWeeks ||
            challenge.severity === 'severe'
        ) {
            return challenge;
        }

        const nextSeverity = getEscalatedSeverity(challenge.severity);
        if (!nextSeverity) return challenge;

        const elapsedWeeks = currentWeek - challenge.createdWeek;
        const thresholdWeeks = challenge.severity === 'mild'
            ? challenge.escalationWeeks
            : challenge.escalationWeeks * 2;
        if (elapsedWeeks < thresholdWeeks) return challenge;

        const nextYieldImpact = Math.round((challenge.yieldImpactPct || 0) * 2);
        const nextMitigationCost = Math.round((challenge.mitigationCost || 0) * 1.5);
        const updated = {
            ...challenge,
            severity: nextSeverity,
            priority: severityPriority(nextSeverity),
            rewardXp: rewardXp(nextSeverity),
            yieldImpactPct: nextYieldImpact,
            mitigationCost: nextMitigationCost,
        };

        onEscalate?.(challenge, nextSeverity);
        return updated;
    });
}

export function generateSeasonChallenges(
    gameTime: GameTime,
    field: Field,
    cornFocusMode?: boolean
): WeeklyChallenge[] {
    if (!cornFocusMode || !isCornField(field)) return [];

    const growthDay = getGrowthDay(gameTime, field);
    if (!growthDay) return [];

    const weekSeedBase = `${gameTime.year}:${gameTime.season}:${gameTime.week}`;
    const weekSeed = `${weekSeedBase}:${field.id}`;
    if (seededRandom(`${weekSeedBase}:seasonal-corn-roll`) >= 0.3) return [];

    const candidates = CORN_CHALLENGE_TEMPLATES
        .map((template) => ({ template, weight: timingWeight(growthDay, template.timing) }))
        .filter((candidate) => candidate.weight > 0)
        .sort((a, b) => {
            const scoreA = a.weight * seededRandom(`${weekSeed}:${a.template.id}`);
            const scoreB = b.weight * seededRandom(`${weekSeed}:${b.template.id}`);
            return scoreB - scoreA;
        });

    if (candidates.length === 0) return [];

    const countRoll = seededRandom(`${weekSeedBase}:seasonal-corn-count`);
    const count = countRoll > 0.88 ? 3 : countRoll > 0.62 ? 2 : 1;

    const createdWeek = challengeWeekNumber(gameTime);

    return candidates.slice(0, count).map(({ template }) => ({
        id: `season-${gameTime.year}-${gameTime.season}-${gameTime.week}-${field.id}-${template.id}`,
        title: template.name,
        description: `${template.description} Symptoms: ${template.symptoms}`,
        priority: severityPriority(MILD_SEVERITY),
        rewardXp: rewardXp(MILD_SEVERITY),
        fieldId: field.id,
        operationId: chooseOperation(template, field),
        status: 'open',
        category: template.category,
        severity: MILD_SEVERITY,
        yieldImpactPct: Math.round(template.yieldImpactPct / severityMultiplier(template.severity)),
        mitigationDescription: template.mitigationDescription,
        mitigationCost: template.mitigationCost,
        requiresInput: template.requiresInput,
        challengeTemplateId: template.id,
        symptoms: template.symptoms,
        escalationWeeks: template.escalationWeeks,
        createdWeek,
    }));
}
