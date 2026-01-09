import { MapCanvas } from '@/components/registry/MapCanvas';
import { SpectrumSlider } from '@/components/registry/SpectrumSlider';
import { AppShell } from '@/components/layout/AppShell';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { WeatherCard } from '@/components/registry/WeatherCard';
import { FleetStatusCard } from '@/components/registry/FleetStatusCard';
import { TaskListCard } from '@/components/registry/TaskListCard';
import { FieldHealthCard } from '@/components/registry/FieldHealthCard';
import { RecentFlightsCard } from '@/components/registry/RecentFlightsCard';
import { QuickActionsCard } from '@/components/registry/QuickActionsCard';
import { ActivityLogPanel, MOCK_ACTIVITIES } from '@/components/ui/ActivityLogPanel';

/**
 * Agri-OS Main Page
 *
 * Phase 5: Realistic Mockup & Data Population
 * - Fully populated dashboard with mock farm data
 * - 5 fields, 3 drones, active tasks, weather, and flight history
 * - Demonstrates all core features of the platform
 */
export default function Home() {
    return (
        <AppShell>
            <div className="relative w-full h-full overflow-hidden bg-background">
                {/* Full-screen map canvas (Background Layer) */}
                <MapCanvas />

                {/* Dashboard Grid Overlay (Foreground Layer) */}
                <div className="absolute inset-0 z-10 pointer-events-none overflow-y-auto">
                    <DashboardGrid className="p-4">
                        {/* Row 1: Field Health Overview (spans 2 columns) + Weather */}
                        <FieldHealthCard />
                        <WeatherCard />

                        {/* Row 2: Fleet Status + Task List + Recent Flights */}
                        <FleetStatusCard />
                        <TaskListCard />
                        <RecentFlightsCard />

                        {/* Row 3: Quick Actions + Activity Log */}
                        <QuickActionsCard />
                        <div className="h-full min-h-[300px]">
                            <ActivityLogPanel activities={MOCK_ACTIVITIES} />
                        </div>
                    </DashboardGrid>
                </div>

                {/* Fixed Controls */}
                <SpectrumSlider />
            </div>
        </AppShell>
    );
}
