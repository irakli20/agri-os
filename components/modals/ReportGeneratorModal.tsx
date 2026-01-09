'use client';

import { useState } from 'react';
import {
    X,
    FileText,
    Calendar,
    Download,
    CheckCircle,
    BarChart3,
    TrendingUp,
    Leaf,
    DollarSign,
    Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (report: any) => void;
}

const REPORT_TYPES = [
    {
        id: 'financial',
        name: 'Financial Summary',
        icon: DollarSign,
        description: 'Income, expenses, and profit analysis',
        color: 'green'
    },
    {
        id: 'harvest',
        name: 'Harvest Report',
        icon: Leaf,
        description: 'Yield data and crop performance',
        color: 'orange'
    },
    {
        id: 'inventory',
        name: 'Inventory Status',
        icon: Package,
        description: 'Stock levels and procurement needs',
        color: 'blue'
    },
    {
        id: 'field_health',
        name: 'Field Health Analysis',
        icon: TrendingUp,
        description: 'NDVI scores and anomaly detection',
        color: 'green'
    },
    {
        id: 'operations',
        name: 'Operations Summary',
        icon: BarChart3,
        description: 'Tasks, equipment usage, and efficiency',
        color: 'purple'
    },
];

const DATE_RANGES = [
    'Last 7 Days',
    'Last 30 Days',
    'Last Quarter',
    'Last 6 Months',
    'Last Year',
    'Year to Date',
    'Custom Range'
];

const EXPORT_FORMATS = ['PDF', 'Excel (XLSX)', 'CSV', 'JSON'];

export function ReportGeneratorModal({ isOpen, onClose, onSubmit }: ReportGeneratorModalProps) {
    const [selectedReportType, setSelectedReportType] = useState('');
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [exportFormat, setExportFormat] = useState('PDF');
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeRawData, setIncludeRawData] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const reportConfig = {
            type: selectedReportType,
            dateRange,
            customDates: dateRange === 'Custom Range' ? { start: customStartDate, end: customEndDate } : null,
            format: exportFormat,
            options: {
                includeCharts,
                includeRawData
            },
            generatedAt: new Date().toISOString()
        };

        onSubmit?.(reportConfig);
        setIsSuccess(true);
        setIsGenerating(false);
    };

    const selectedReport = REPORT_TYPES.find(r => r.id === selectedReportType);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Report Generated!' : 'Generate Report'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Your report is ready to download' : 'Create custom farm reports and analytics'}
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

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Report Ready!</h3>
                            <p className="text-muted-foreground mb-6">
                                Your <span className="text-foreground font-medium">{selectedReport?.name}</span> report has been generated.
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        // Simulate download
                                        console.log('Downloading report...');
                                    }}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Report
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Report Type Selection */}
                            <div>
                                <h3 className="font-semibold mb-4">Select Report Type</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {REPORT_TYPES.map(report => {
                                        const Icon = report.icon;
                                        const isSelected = selectedReportType === report.id;

                                        return (
                                            <div
                                                key={report.id}
                                                onClick={() => setSelectedReportType(report.id)}
                                                className={cn(
                                                    "glass-panel rounded-xl p-4 cursor-pointer transition-all",
                                                    isSelected
                                                        ? "border-2 border-primary bg-primary/5"
                                                        : "border border-white/10 hover:bg-white/5"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                                                        `bg-${report.color}-500/20`
                                                    )}>
                                                        <Icon className={cn("w-6 h-6", `text-${report.color}-400`)} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium">{report.name}</div>
                                                        <div className="text-sm text-muted-foreground">{report.description}</div>
                                                    </div>
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                                        isSelected
                                                            ? "bg-primary border-primary"
                                                            : "border-white/30"
                                                    )}>
                                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                    Date Range
                                </h3>
                                <select
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                                >
                                    {DATE_RANGES.map(range => (
                                        <option key={range} value={range}>{range}</option>
                                    ))}
                                </select>

                                {dateRange === 'Custom Range' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={customStartDate}
                                                onChange={(e) => setCustomStartDate(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">End Date</label>
                                            <input
                                                type="date"
                                                value={customEndDate}
                                                onChange={(e) => setCustomEndDate(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Export Options */}
                            <div>
                                <h3 className="font-semibold mb-4">Export Options</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Format</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {EXPORT_FORMATS.map(format => (
                                                <button
                                                    key={format}
                                                    onClick={() => setExportFormat(format)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                                        exportFormat === format
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    {format}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={includeCharts}
                                                onChange={(e) => setIncludeCharts(e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            <div>
                                                <div className="font-medium text-sm">Include Charts & Graphs</div>
                                                <div className="text-xs text-muted-foreground">Visual representations of data</div>
                                            </div>
                                        </label>

                                        <label className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={includeRawData}
                                                onChange={(e) => setIncludeRawData(e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                            <div>
                                                <div className="font-medium text-sm">Include Raw Data Tables</div>
                                                <div className="text-xs text-muted-foreground">Detailed data appendix</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={!selectedReportType || isGenerating}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors flex items-center gap-2",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4" />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
