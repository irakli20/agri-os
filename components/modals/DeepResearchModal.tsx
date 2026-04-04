import React, { useState } from 'react';
import { X, Map as MapIcon, CloudRain, TestTube, Sprout, Home, BarChart3, Droplets, Target, ShieldCheck, Thermometer, Wind, AlertTriangle, Layers, Info, CheckCircle, Plus, FileText } from 'lucide-react';
import { MarketplaceField } from '@/lib/marketplace-data';
import { cn } from '@/lib/utils';

interface DeepResearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    field: MarketplaceField;
    mockAssessment: any; // Data passed from the parent for consistency
    activeTab: 'executive' | 'terrain' | 'remediation' | 'chemistry' | 'climate' | 'crops' | 'infrastructure';
    setActiveTab: (tab: 'executive' | 'terrain' | 'remediation' | 'chemistry' | 'climate' | 'crops' | 'infrastructure') => void;
}

export function DeepResearchModal({ isOpen, onClose, field, mockAssessment, activeTab, setActiveTab }: DeepResearchModalProps) {
    if (!isOpen) return null;

    const qualityScore = field.overallRating * 20;

    // Generate mock historical data based on field name/id naturally
    const generateHistoricalYields = () => {
        const base = qualityScore * 1.5;
        return Array.from({ length: 10 }, (_, i) => ({
            year: 2025 - i,
            crop: i % 3 === 0 ? 'Soybeans' : 'Corn',
            yield: (base + (Math.random() * 40 - 20)).toFixed(1),
            rainfall: (20 + (Math.random() * 15 - 5)).toFixed(1)
        }));
    };

    const historicalData = generateHistoricalYields();

    return (
        <div className="absolute left-0 top-0 bottom-0 w-[400px] md:w-1/3 z-50 flex flex-col bg-background/95 backdrop-blur-xl border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-300">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 bg-background/95 backdrop-blur-md">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/30">
                            Level IV Deep AI Analysis
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">{field.location}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Comprehensive Research: {field.name}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors border border-white/10"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto custom-scrollbar border-b border-white/10 bg-black/40 px-6 hide-scrollbar shrink-0">
                {[
                    { id: 'executive', label: 'Executive Summary', icon: Target },
                    { id: 'terrain', label: 'Terrain & Topography', icon: Layers },
                    { id: 'remediation', label: 'Remediation Plan', icon: AlertTriangle },
                    { id: 'chemistry', label: 'Soil Chemistry', icon: TestTube },
                    { id: 'climate', label: 'Climate & History', icon: CloudRain },
                    { id: 'crops', label: 'Crop Suitability', icon: Sprout },
                    { id: 'infrastructure', label: 'Infrastructure', icon: Home },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all whitespace-nowrap border-b-2",
                                isActive
                                    ? "border-blue-500 text-blue-400 bg-blue-500/10"
                                    : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                <div className="max-w-5xl mx-auto min-h-[50vh]">

                    {/* 1. Executive Summary & AI Recommendation */}
                    {activeTab === 'executive' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 prose prose-invert bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                                    <p className="text-sm leading-relaxed text-blue-100">
                                        This parcel represents a <strong>{qualityScore > 80 ? 'Tier 1' : 'Tier 2'} agricultural asset</strong>.
                                        Based on our 10-year deep environmental scan and multi-spectral analysis, the underlying soil matrix shows robust resilience, though
                                        historical cropping patterns indicate slight nitrogen depletion in the upper horizons. The geospatial evaluation confirms optimal sun exposure and manageable slope gradients across 92% of the total arable acreage. Soil compaction layers are relatively shallow, suggesting that standard deep-ripping procedures prior to the next planting season should suffice to restore optimal root penetration profiles.
                                    </p>
                                    <p className="text-sm leading-relaxed text-blue-100 mt-4">
                                        Furthermore, proximity to regional processing facilities and established grain elevators significantly reduces projected haulage overheads. Given the stable macroeconomic forecasts for primary cereal commodities over the next 36 months, this land holds considerable strategic value for expanding operations looking to leverage economies of scale in this geographical quadrant. The micro-biodome analysis indicates a healthy ratio of symbiotic fungi to pest-pathogens, reducing the immediate dependency on aggressive, broad-spectrum fungicidal applications.
                                    </p>
                                    <p className="text-blue-200 mt-4 text-sm">
                                        <strong>Primary Recommendation:</strong> The asking price of ${field.buyPrice.toLocaleString()} is
                                        {field.buyPrice / field.sizeHectares < 8000 ? ' heavily undervalued compared to regional comparables' : ' aligned with current market valuations'}.
                                        We recommend immediate acquisition if capital allows, followed by a regenerative cover-crop cycle to restore {mockAssessment.npk} levels prior to intensive cash-cropping. The calculated risk adjusted return over a 5-year holding period comfortably exceeds standard mutual fund benchmarks, positioning this not just as an operational asset, but as a robust store of value against inflationary pressures.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="card-soft p-4 rounded-xl border border-white/10 bg-black/20">
                                        <div className="text-sm text-muted-foreground mb-1">Investment Risk Score</div>
                                        <div className="text-3xl font-bold text-green-400 flex items-center gap-2">
                                            {100 - qualityScore}/100
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">Lower is better. Reflects climate & soil stability.</div>
                                    </div>
                                    <div className="card-soft p-4 rounded-xl border border-white/10 bg-black/20">
                                        <div className="text-sm text-muted-foreground mb-1">Projected ROI (Year 1)</div>
                                        <div className="text-3xl font-bold text-blue-400 flex items-center gap-2">
                                            {qualityScore > 75 ? '12.4%' : '8.2%'}
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                                    <h4 className="font-bold text-white mb-3">Strengths & Opportunities</h4>
                                    <ul className="space-y-2 text-sm text-slate-300">
                                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" /> High Baseline Organic Matter ({mockAssessment.soilMoisture} moisture retention capacity)</li>
                                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" /> Excellent historical yield stability during drought years</li>
                                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" /> Favorable micro-climate minimizes early frost risks</li>
                                        <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" /> Existing deep-well infrastructure in excellent condition</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                                    <h4 className="font-bold text-white mb-3">Threats & Liabilities</h4>
                                    <ul className="space-y-2 text-sm text-slate-300">
                                        <li className="flex items-start gap-2"><Info className="w-4 h-4 text-amber-500 mt-0.5" /> Immediate remediation required for {mockAssessment.npk}</li>
                                        <li className="flex items-start gap-2"><Info className="w-4 h-4 text-amber-500 mt-0.5" /> {mockAssessment.weedPressure} weed pressure history indicates persistent seed bank</li>
                                        <li className="flex items-start gap-2"><Info className="w-4 h-4 text-amber-500 mt-0.5" /> Moderate compaction in turn-row zones affecting root depth</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Deep Soil & Terrain Analysis */}
                    {activeTab === 'terrain' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                        The terrain exhibits a gentle 2.4% average slope descending towards the southwest quadrant. This topography facilitates excellent natural shedding of excess precipitation, mitigating severe waterlogging risks during torrential spring storms. The primary pedological association consists of a well-drained, silty clay loam (Typic Argiudoll), which smoothly transitions into a heavier, poorly drained clay loam within the localized lower depressions identified in the spatial analysis (see blue zones on map).
                                    </p>
                                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                        Subsurface profiling via Ground Penetrating Radar (GPR) anomalies indicates a hardpan layer formulation at an approximate depth of 14 to 16 inches, predominantly concentrated in the historical turn-row zones at the northern boundary and the south-eastern egress point (see red zones on map). This is indicative of repeated heavy machinery traffic under suboptimal moisture conditions by previous operators.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="p-4 rounded-xl border border-white/5 bg-slate-800/50">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Erosion Susceptibility</div>
                                            <div className="text-lg font-bold text-emerald-400">Minimal Asset Risk</div>
                                            <div className="text-xs text-slate-400 mt-1">Wind break lines effective.</div>
                                        </div>
                                        <div className="p-4 rounded-xl border border-white/5 bg-slate-800/50">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Avg Compaction Psi</div>
                                            <div className="text-lg font-bold text-rose-400">310 PSI (Restricted)</div>
                                            <div className="text-xs text-slate-400 mt-1">Deep ripping highly advised.</div>
                                        </div>
                                        <div className="col-span-2 p-5 rounded-xl border border-white/5 bg-slate-800/50">
                                            <div className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider flex justify-between">
                                                <span>Soil Horizon Depth Profile</span>
                                                <span className="text-emerald-400 text-[10px]">Optimal Configuration</span>
                                            </div>
                                            <div className="w-full h-10 bg-black/40 rounded-lg overflow-hidden flex text-[10px] font-bold items-center text-center shadow-inner">
                                                <div className="h-full bg-amber-900/80 w-[35%] border-r border-black/50 text-amber-100/90 flex flex-col items-center justify-center">
                                                    <span>O/A Horizon</span>
                                                    <span className="font-normal opacity-70">Topsoil (35cm)</span>
                                                </div>
                                                <div className="h-full bg-[#5c3a21]/90 w-[45%] border-r border-black/50 text-orange-200/70 flex flex-col items-center justify-center">
                                                    <span>B Horizon</span>
                                                    <span className="font-normal opacity-70">Subsoil (45cm)</span>
                                                </div>
                                                <div className="h-full bg-stone-900/80 w-[20%] text-stone-400/50 flex flex-col items-center justify-center">
                                                    <span>C Horizon</span>
                                                    <span className="font-normal opacity-70">Parent (Base)</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-3 italic">
                                                * Unusually deep A-horizon provides massive buffering capacity against short term drought stress and chemical burn.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2.5 Remediation Action Plan */}
                    {activeTab === 'remediation' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 text-amber-500/10 rotate-12">
                                    <AlertTriangle className="w-48 h-48" />
                                </div>
                                <h3 className="text-xl font-bold flex items-center gap-2 text-amber-500 mb-4 relative z-10">
                                    Prescriptive Remediation Action Plan
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl relative z-10 mb-6">
                                    To achieve maximum Genetic Yield Potential (GYP) in the subsequent growing season, our agronomic models dictate the following pre-plant inputs. These calculated volumes and cost estimates are specifically tailored to the deficiencies noted in the deep soil profile and the persistent weed seedbed identified by aerial imagery. Ignoring these intervention steps will drastically increase output volatility.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><TestTube className="w-5 h-5" /></div>
                                            <div>
                                                <div className="font-bold text-white">Fertility Correction</div>
                                                <div className="text-xs text-muted-foreground">Addressing {mockAssessment.npk}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 px-2">
                                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-slate-300">Dry NPK (15-15-15) Blend</span>
                                                <span className="font-mono text-emerald-400">1.2 Tons</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-slate-300">Anhydrous Ammonia (82-0-0)</span>
                                                <span className="font-mono text-emerald-400">0.8 Tons</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-slate-300">Micronutrient Pack (Zn, B)</span>
                                                <span className="font-mono text-emerald-400">45 lbs</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Estimated Material Cost</span>
                                                <span className="font-mono font-bold text-white text-lg">$2,140.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black/40 rounded-xl p-5 border border-white/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Wind className="w-5 h-5" /></div>
                                            <div>
                                                <div className="font-bold text-white">Herbicide Burndown Strategy</div>
                                                <div className="text-xs text-muted-foreground">Targeting {mockAssessment.weedPressure} Pressure</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 px-2">
                                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-slate-300">Glyphosate (480g/L) Pre-Emerge</span>
                                                <span className="font-mono text-rose-400">40 Liters</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-slate-300">S-metolachlor residual tank mix</span>
                                                <span className="font-mono text-rose-400">12 Liters</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                                <span className="text-slate-300">Adjuvant / Surfactant load</span>
                                                <span className="font-mono text-rose-400">5 Liters</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Estimated Material Cost</span>
                                                <span className="font-mono font-bold text-white text-lg">$850.50</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between bg-black/50 p-4 rounded-xl border border-white/5 relative z-10">
                                    <div className="text-sm text-slate-400">
                                        Application labor & machinery depreciation estimated at <strong className="text-white">$15.00/ha</strong> via standard terrestrial broadcasting. Premium for variable-rate drone application is not factored into this base modeling.
                                    </div>
                                    <div className="text-right ml-6 shrink-0">
                                        <div className="text-xs font-bold text-amber-500 uppercase mb-1">Total Intervention Capital Required</div>
                                        <div className="text-2xl font-mono font-bold text-white">$3,140.50</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. Comprehensive Nutrient Profile */}
                    {activeTab === 'chemistry' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                <h4 className="font-bold text-white mb-4">Detailed Laboratory Breakdown Commentary</h4>
                                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                                    <p>
                                        The Cation Exchange Capacity (CEC) observed here at 18 meq/100g is exceptionally favorable. A CEC of this magnitude implies that the soil colloids have a vast reservoir to hold onto positively charged nutrient ions (cations) such as Calcium, Magnesium, and Potassium. This protects against leaching losses during heavy rain events. Farmers can therefore safely apply larger, less frequent fertilization strategies, minimizing field passes and compaction events while maximizing nutrient use efficiency (NUE).
                                    </p>
                                    <p>
                                        The pH buffering capacity is similarly robust. With a baseline pH of 6.8, the solubility of essential micronutrients (particularly Iron, Manganese, and Zinc) is in the perfect sweet spot for monocot cereal absorption. The likelihood of encountering aluminum toxicity, often problematic in sub-5.5 pH soils within this agricultural belt, is practically zero.
                                    </p>
                                    <p>
                                        The singular glaring defect resides in the Nitrogen profile. The {mockAssessment.npk} status is likely an artifact of the previous tenant extracting successive high-yielding grain crops without adequate replenishment programs. While Organic Matter (OM) at 4.2% will naturally mineralize and release a steady trickle of usable nitrogen throughout the growing season, this background release rate (estimated at 15-20 lbs N/acre/year) will be woefully insufficient to satiate the aggressive vegetative growth demands of a modern hybrid crop. Immediate, front-loaded synthetic inputs are mandatory to secure canopy closure and initiate maximal ear fill.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. Climate & Historical Data */}
                    {activeTab === 'climate' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 card-soft rounded-2xl border border-white/10 bg-black/20 p-6">
                                    <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Historical Yield Performance (bu/ac)</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs uppercase text-muted-foreground bg-white/5">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Year</th>
                                                    <th className="px-4 py-3">Crop</th>
                                                    <th className="px-4 py-3">Est. Yield</th>
                                                    <th className="px-4 py-3 rounded-tr-lg">Rainfall (in)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historicalData.map((data, idx) => (
                                                    <tr key={data.year} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-2 font-mono">{data.year}</td>
                                                        <td className="px-4 py-2">
                                                            <span className={cn(
                                                                "px-2 py-0.5 rounded text-xs font-semibold",
                                                                data.crop === 'Corn' ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500"
                                                            )}>
                                                                {data.crop}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 font-semibold">{data.yield}</td>
                                                        <td className="px-4 py-2 text-muted-foreground">{data.rainfall}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl border border-white/10 bg-black/20 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                            <Thermometer className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Avg GDD (Base 50)</div>
                                            <div className="text-lg font-bold">2,450</div>
                                            <div className="text-[10px] text-muted-foreground line-clamp-1">Sufficient for 105-day RM Corn</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10 bg-black/20 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <Droplets className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Annual Precipitation</div>
                                            <div className="text-lg font-bold">34.2 in</div>
                                            <div className="text-[10px] text-muted-foreground line-clamp-1">Evenly distributed in spring</div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-white/10 bg-black/20 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-6 h-6 text-orange-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Known Historical Pests</div>
                                            <div className="text-sm font-bold">Corn Rootworm (2022)</div>
                                            <div className="text-[10px] text-orange-400 line-clamp-1">Nematode treatment recommended</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-2xl text-sm text-slate-300 leading-relaxed shadow-inner">
                                <p className="mb-4">
                                    Macro-meteorological analysis of this specific latitude/longitude coordinate reveals an incredibly stable, predictable precipitation pipeline originating from the prevailing westerlies. With an annual mean precipitation of 34.2 inches, moisture constraints are a secondary concern compared to neighboring drier counties. Crucially, 65% of this rainfall occurs between April and July, providing the exact moisture required during the most critical crop developmental stages (V6 to VT in maize, R1-R3 in soybeans).
                                </p>
                                <p>
                                    However, historical heat unit accumulation data warns of late-season growing degree day (GDD) deceleration. The 15-year trendline indicates a slight shift toward earlier first-frost dates in October. Consequently, while the thermal environment effortlessly supports 105-day relative maturity (RM) hybrids, pushing into 114+ RM seed varieties to chase absolute top-end yield presents a mathematically unjustifiable risk of frost damage before physiological black layer. Seed selection strategy must prioritize rapid dry-down characteristics overlying sheer biological potential.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 5. Crop Suitability & Optimization Models */}
                    {activeTab === 'crops' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid md:grid-cols-4 gap-4">
                                {[
                                    { crop: 'Corn (Maize)', score: 94, yield: '180-220 bu/ac', color: 'bg-yellow-500' },
                                    { crop: 'Soybeans', score: 88, yield: '55-70 bu/ac', color: 'bg-green-500' },
                                    { crop: 'Winter Wheat', score: 76, yield: '60-80 bu/ac', color: 'bg-amber-600' },
                                    { crop: 'Alfalfa', score: 62, yield: '4-6 tons/ac', color: 'bg-emerald-600' }
                                ].map((item, i) => (
                                    <div key={i} className="p-5 rounded-2xl border border-white/10 bg-black/20 relative overflow-hidden group hover:border-white/30 transition-colors">
                                        {/* Suitability Progress Bar Background */}
                                        <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full">
                                            <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }} />
                                        </div>

                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-lg">{item.crop}</h4>
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-lg font-bold",
                                                item.score > 80 ? "bg-green-500/20 text-green-400" :
                                                    item.score > 70 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                                            )}>
                                                {item.score}/100
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mb-1">Est. Yield Potential</div>
                                        <div className="text-lg font-mono text-white group-hover:text-primary transition-colors">{item.yield}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                <h4 className="font-bold text-white mb-2">Mathematical Optimization Insight</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Simulations run across 10,000 distinct weather and market pricing pathways (Monte Carlo iterations) overwhelmingly favor a traditional two-year rotation leaning heavily into Maize propagation. The soil&apos;s exceptional moisture retention (driven by the 4.2% OM) buffers the extreme water demands of corn during late-July pollination windows. While soybeans present a respectable suitability score (88), the heavy clay nature of the lower topographic depressions often leads to minor incidences of Phytophthora root rot in wet springs. Over a 10-year horizon, maximizing Corn acreage on this specific soil pedon generates a 14.8% higher Net Present Value (NPV) than a 50/50 split, assuming adequate nitrogen remediation is maintained.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 6. Infrastructure & Water Access */}
                    {activeTab === 'infrastructure' && (
                        <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
                                    <h4 className="font-bold mb-4 flex items-center gap-2 text-cyan-300">
                                        <Droplets className="w-5 h-5" /> Water & Irrigation
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Primary Source</span>
                                            <span className="font-semibold text-white">Deep Aquifer Well (400ft)</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Pumping Capacity</span>
                                            <span className="font-semibold text-white">850 GPM</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Installed Systems</span>
                                            <span className="font-semibold text-white">Center Pivot (Covers 85%)</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Water Rights</span>
                                            <span className="font-semibold text-green-400">Senior (Pre-1914)</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="p-6 rounded-2xl border border-white/10 bg-black/20">
                                    <h4 className="font-bold mb-4 flex items-center gap-2 text-white/90">
                                        <Home className="w-5 h-5" /> On-site Facilities
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Grain Storage</span>
                                            <span className="font-semibold text-white">2x 50,000 bu Silos with fans</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Machine Shed</span>
                                            <span className="font-semibold text-white">60x100ft (Insulated)</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Road Access</span>
                                            <span className="font-semibold text-white">Paved County Hwy Frontage</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Distance to Elevator</span>
                                            <span className="font-semibold text-white">12.5 Miles</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-cyan-900/10 border border-cyan-500/20 p-6 rounded-2xl text-sm text-slate-300 leading-relaxed shadow-inner">
                                <p className="mb-4">
                                    The embedded fixed-asset capital infrastructure acts as a massive multiplier for operational efficiency on this parcel. The presence of two commercial-grade, fan-aerated 50,000-bushel grain silos completely untethers the operation from the tyranny of harvest-time elevator pricing. Holding grain for post-harvest basis appreciation historically nets an additional $0.30 to $0.80 per bushel in this local market. Valuing these storage structures at current replacement costs approaches $300,000 of &quot;hidden&quot; asset value bundled into the land price.
                                </p>
                                <p>
                                    Geographically, logistics are near-perfect. Direct paved-road frontage implies zero load-limit restrictions during spring thaws, allowing unrestricted movement of heavy semi-trailers and oversized implements year-round. While the dryland farming capability is excellent, the existing deep-aquifer well equipped with Senior water rights operates as the ultimate insurance policy. In catastrophic drought scenarios, the integrated center pivot system can rescue the crop, effectively guaranteeing a yield floor that prevents total financial ruin in 1-in-50 year weather events.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
