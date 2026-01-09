import { AppShell } from '@/components/layout/AppShell';
import { Settings as SettingsIcon, User, Bell, Database, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
    return (
        <AppShell>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your farm preferences and system configuration
                    </p>
                </div>

                {/* Settings Sections */}
                <div className="space-y-4">
                    {/* Profile */}
                    <div className="glass-panel rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Profile</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground">Farm Name</label>
                                <input
                                    type="text"
                                    defaultValue="Greenfield Farms"
                                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Location</label>
                                <input
                                    type="text"
                                    defaultValue="Salinas Valley, California"
                                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="glass-panel rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Notifications</h2>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Field health alerts</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Drone maintenance reminders</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Weather alerts</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5" />
                            </label>
                        </div>
                    </div>

                    {/* Data & Privacy */}
                    <div className="glass-panel rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Data & Privacy</h2>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>Your farm data is encrypted and stored securely.</p>
                            <button className="text-primary hover:underline">Export all data</button>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
