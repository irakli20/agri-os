'use client';

import { useState } from 'react';
import {
    X,
    Plane,
    Tractor,
    Droplets,
    Wrench,
    Package,
    CheckCircle,
    Upload,
    Calendar,
    DollarSign,
    MapPin,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddEquipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (equipment: EquipmentData) => void;
}

export interface EquipmentData {
    name: string;
    category: string;
    model: string;
    serialNumber: string;
    purchaseDate: string;
    purchasePrice: number;
    location: string;
    notes: string;
}

const CATEGORIES = [
    { id: 'drone', label: 'Drone', icon: Plane, description: 'Aerial equipment and UAVs' },
    { id: 'machinery', label: 'Machinery', icon: Tractor, description: 'Tractors, harvesters, etc.' },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets, description: 'Watering systems' },
    { id: 'tool', label: 'Tools', icon: Wrench, description: 'Hand and power tools' },
    { id: 'other', label: 'Other', icon: Package, description: 'Other equipment' },
];

const LOCATIONS = [
    'Main Barn',
    'Equipment Shed A',
    'Equipment Shed B',
    'Chemical Storage',
    'Field Office',
    'North Section',
    'South Section',
];

export function AddEquipmentModal({ isOpen, onClose, onSubmit }: AddEquipmentModalProps) {
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const equipmentData: EquipmentData = {
            name,
            category,
            model,
            serialNumber,
            purchaseDate,
            purchasePrice: parseFloat(purchasePrice) || 0,
            location,
            notes,
        };

        onSubmit?.(equipmentData);
        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setStep(1);
        setCategory('');
        setName('');
        setModel('');
        setSerialNumber('');
        setPurchaseDate('');
        setPurchasePrice('');
        setLocation('');
        setNotes('');
        setIsSuccess(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <Package className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">
                                {isSuccess ? 'Equipment Added!' : 'Add New Equipment'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isSuccess ? 'Your equipment has been registered' : 'Register a new piece of equipment'}
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
                    <div className="px-6 pt-4">
                        <div className="flex items-center justify-between">
                            {['Category', 'Details', 'Location'].map((label, i) => (
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
                                            "w-16 h-0.5 mx-3",
                                            step > i + 1 ? "bg-green-500" : "bg-white/10"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Equipment Registered!</h3>
                            <p className="text-muted-foreground mb-6">
                                {name} has been added to your equipment inventory.
                            </p>
                            <div className="bg-white/5 rounded-xl p-4 text-left mb-6 max-w-sm mx-auto">
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Equipment ID</span>
                                        <span className="font-mono">EQ-{Date.now().toString(36).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Category</span>
                                        <span className="capitalize">{category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Location</span>
                                        <span>{location}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Add Another
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Category */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground mb-4">
                                        Select the equipment category
                                    </div>
                                    <div className="grid gap-3">
                                        {CATEGORIES.map((cat) => {
                                            const Icon = cat.icon;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setCategory(cat.id)}
                                                    className={cn(
                                                        "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                                        category === cat.id
                                                            ? "border-primary bg-primary/10"
                                                            : "border-white/10 bg-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-lg flex items-center justify-center",
                                                        category === cat.id ? "bg-primary/20" : "bg-white/10"
                                                    )}>
                                                        <Icon className={cn(
                                                            "w-6 h-6",
                                                            category === cat.id ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{cat.label}</div>
                                                        <div className="text-sm text-muted-foreground">{cat.description}</div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Details */}
                            {step === 2 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-2">Equipment Name *</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g., DJI Agras T40"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Model</label>
                                            <input
                                                type="text"
                                                value={model}
                                                onChange={(e) => setModel(e.target.value)}
                                                placeholder="Model number"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Serial Number</label>
                                            <input
                                                type="text"
                                                value={serialNumber}
                                                onChange={(e) => setSerialNumber(e.target.value)}
                                                placeholder="Serial number"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                Purchase Date
                                            </label>
                                            <input
                                                type="date"
                                                value={purchaseDate}
                                                onChange={(e) => setPurchaseDate(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <DollarSign className="w-4 h-4 inline mr-2" />
                                                Purchase Price
                                            </label>
                                            <input
                                                type="number"
                                                value={purchasePrice}
                                                onChange={(e) => setPurchasePrice(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>

                                    {/* Document Upload */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <FileText className="w-4 h-4 inline mr-2" />
                                            Documentation (Optional)
                                        </label>
                                        <div className="border-2 border-dashed border-white/20 hover:border-primary/50 rounded-xl p-6 text-center transition-colors cursor-pointer">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                            <div className="text-sm text-muted-foreground">
                                                Drag & drop or click to upload
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Receipts, manuals, warranties
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Location & Notes */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            Storage Location *
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {LOCATIONS.map((loc) => (
                                                <button
                                                    key={loc}
                                                    onClick={() => setLocation(loc)}
                                                    className={cn(
                                                        "p-3 rounded-xl border text-sm text-left transition-all",
                                                        location === loc
                                                            ? "border-primary bg-primary/10"
                                                            : "border-white/10 bg-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    {loc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Notes</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={4}
                                            placeholder="Additional notes about this equipment..."
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                        />
                                    </div>

                                    {/* Preview */}
                                    <div className="bg-white/5 rounded-xl p-4">
                                        <h3 className="font-semibold mb-3">Summary</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="text-muted-foreground">Category</div>
                                            <div className="font-medium capitalize">{category}</div>
                                            <div className="text-muted-foreground">Name</div>
                                            <div className="font-medium">{name || '-'}</div>
                                            <div className="text-muted-foreground">Model</div>
                                            <div className="font-medium">{model || '-'}</div>
                                            <div className="text-muted-foreground">Value</div>
                                            <div className="font-medium text-green-400">
                                                ${parseFloat(purchasePrice) ? parseFloat(purchasePrice).toLocaleString() : '0'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/10 flex justify-between">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                            disabled={(step === 1 && !category) || (step === 2 && !name) || (step === 3 && !location) || isSubmitting}
                            className={cn(
                                "px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-colors",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "hover:bg-primary/90"
                            )}
                        >
                            {isSubmitting ? 'Adding...' : step === 3 ? 'Add Equipment' : 'Continue'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
