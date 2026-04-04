'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Bell, Shield, User } from 'lucide-react';

export default function SettingsPage() {
    return (
        <AppShell>
            <div className="page-shell">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <p className="page-header-meta">Workspace Preferences</p>
                        <h1 className="text-3xl font-bold">Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your farm preferences and system configuration
                        </p>
                    </div>
                    <button className="cta-primary">Save Changes</button>
                </div>

                {/* Settings Sections */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Profile */}
                    <div className="card-soft rounded-2xl p-6 xl:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Profile</h2>
                        </div>
                        <div className="space-y-4 max-w-2xl">
                            <div>
                                <label className="text-sm text-muted-foreground">Farm Name</label>
                                <input
                                    type="text"
                                    defaultValue="Greenfield Farms"
                                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Location</label>
                                <input
                                    type="text"
                                    defaultValue="Salinas Valley, California"
                                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-muted-foreground">Primary Contact Email</label>
                                <input
                                    type="email"
                                    defaultValue="ops@greenfieldfarms.com"
                                    className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="card-soft rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Notifications</h2>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Field health alerts</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-white/20 bg-white/5" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Drone maintenance reminders</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-white/20 bg-white/5" />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm">Weather alerts</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-white/20 bg-white/5" />
                            </label>
                        </div>
                    </div>

                    {/* Data & Privacy */}
                    <div className="card-soft rounded-2xl p-6 xl:col-span-3">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-semibold">Data & Privacy</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Data Encryption</p>
                                <p>Your farm data is encrypted at rest and in transit.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Backup Policy</p>
                                <p>Automatic nightly backups with 30-day retention.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">Access Logs</p>
                                <p>Review user access history and critical events.</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="cta-secondary">Download Data Export</button>
                            <button className="cta-secondary">View Audit Log</button>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
