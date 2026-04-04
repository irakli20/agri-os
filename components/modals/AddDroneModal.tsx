'use client';

import { useState } from 'react';
import { X, Plane } from 'lucide-react';

interface AddDroneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (droneData: any) => void;
}

export function AddDroneModal({ isOpen, onClose, onSubmit }: AddDroneModalProps) {
    const [formData, setFormData] = useState({
        model: '',
        serialNumber: '',
        purchaseDate: '',
        batteryCapacity: '',
        maxFlightTime: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            id: `drone-${Date.now()}`,
            status: 'ready',
            batteryLevel: 100,
            flightHours: 0,
            lastMaintenance: new Date().toISOString(),
        });
        onClose();
        setFormData({ model: '', serialNumber: '', purchaseDate: '', batteryCapacity: '', maxFlightTime: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="glass-panel rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Add New Drone</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Drone Model *</label>
                        <select
                            required
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select model...</option>
                            <option value="DJI Agras T40">DJI Agras T40</option>
                            <option value="DJI Agras T30">DJI Agras T30</option>
                            <option value="DJI Matrice 350 RTK">DJI Matrice 350 RTK</option>
                            <option value="DJI Matrice 300 RTK">DJI Matrice 300 RTK</option>
                            <option value="DJI Phantom 4 Multispectral">DJI Phantom 4 Multispectral</option>
                            <option value="DJI Mavic 3 Multispectral">DJI Mavic 3 Multispectral</option>
                            <option value="senseFly eBee X">senseFly eBee X</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Serial Number *</label>
                            <input
                                type="text"
                                required
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                placeholder="e.g., AG-2024-001"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Purchase Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.purchaseDate}
                                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Battery Capacity (mAh)</label>
                            <input
                                type="number"
                                value={formData.batteryCapacity}
                                onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                                placeholder="e.g., 5000"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Max Flight Time (min)</label>
                            <input
                                type="number"
                                value={formData.maxFlightTime}
                                onChange={(e) => setFormData({ ...formData, maxFlightTime: e.target.value })}
                                placeholder="e.g., 45"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <div className="flex gap-3">
                            <Plane className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-400 mb-1">Initial Setup</p>
                                <p className="text-muted-foreground">
                                    The drone will be added with &quot;Ready&quot; status and 100% battery. You can update these values later from the Fleet page.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Add Drone
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
