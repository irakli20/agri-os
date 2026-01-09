'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Sprout, Maximize2, Info } from 'lucide-react';

interface Crop3DViewerProps {
    cropType: string;
    stage: string; // e.g., "V3", "VT", "R1"
    className?: string;
}

// Procedural Corn Plant Component
function CornPlant({ stage, position }: { stage: string; position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null);

    // Growth parameters based on stage
    const params = useMemo(() => {
        switch (stage) {
            case 'VE': return { height: 0.5, leaves: 2, leafScale: 0.3, color: '#86efac' };
            case 'V3': return { height: 1.5, leaves: 4, leafScale: 0.6, color: '#4ade80' };
            case 'V6': return { height: 3.0, leaves: 8, leafScale: 1.0, color: '#22c55e' };
            case 'VT': return { height: 6.0, leaves: 12, leafScale: 1.5, color: '#16a34a', tassel: true };
            case 'R1': return { height: 6.5, leaves: 12, leafScale: 1.5, color: '#15803d', tassel: true, silk: true };
            default: return { height: 1.0, leaves: 3, leafScale: 0.5, color: '#4ade80' };
        }
    }, [stage]);

    useFrame((state) => {
        if (group.current) {
            // Gentle wind animation
            group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
            group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
        }
    });

    return (
        <group ref={group} position={position}>
            {/* Stalk */}
            <mesh position={[0, params.height / 2, 0]}>
                <cylinderGeometry args={[0.05, 0.08, params.height, 8]} />
                <meshStandardMaterial color={params.color} roughness={0.8} />
            </mesh>

            {/* Leaves */}
            {Array.from({ length: params.leaves }).map((_, i) => {
                const angle = (i / params.leaves) * Math.PI * 4; // Spiral arrangement
                const y = (i / params.leaves) * params.height * 0.8 + 0.2;
                const scale = params.leafScale * (1 - i / params.leaves * 0.3);

                return (
                    <group key={i} position={[0, y, 0]} rotation={[0, angle, Math.PI / 4]}>
                        <mesh position={[0.5 * scale, 0, 0]} rotation={[0, 0, -0.2]}>
                            <boxGeometry args={[1.0 * scale, 0.02, 0.15 * scale]} />
                            <meshStandardMaterial color={params.color} roughness={0.6} />
                        </mesh>
                    </group>
                );
            })}

            {/* Tassel (if applicable) */}
            {params.tassel && (
                <group position={[0, params.height, 0]}>
                    <mesh>
                        <coneGeometry args={[0.2, 0.5, 8]} />
                        <meshStandardMaterial color="#fde047" />
                    </mesh>
                </group>
            )}

            {/* Silk/Ear (if applicable) */}
            {params.silk && (
                <group position={[0.1, params.height * 0.6, 0]} rotation={[0, 0, -0.5]}>
                    <mesh>
                        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
                        <meshStandardMaterial color="#fde047" />
                    </mesh>
                    <mesh position={[0, 0.25, 0]}>
                        <cylinderGeometry args={[0.02, 0.05, 0.2, 8]} />
                        <meshStandardMaterial color="#713f12" />
                    </mesh>
                </group>
            )}
        </group>
    );
}

export function Crop3DViewer({ cropType, stage, className }: Crop3DViewerProps) {
    const [showInfo, setShowInfo] = useState(false);

    return (
        <div className={cn("relative rounded-xl overflow-hidden bg-gradient-to-b from-blue-900/20 to-green-900/20 border border-white/10", className)}>
            <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <Sprout className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-sm">{cropType} • Stage {stage}</span>
                </div>
            </div>

            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                    <Info className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <Maximize2 className="w-4 h-4 text-white" />
                </button>
            </div>

            {showInfo && (
                <div className="absolute top-16 right-4 z-10 w-64 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 animate-in slide-in-from-right-4">
                    <h4 className="font-bold mb-2">Growth Stage Details</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                        Current GDD accumulation indicates {stage} stage. Key development markers:
                    </p>
                    <ul className="text-xs space-y-1 list-disc list-inside text-gray-300">
                        <li>Root system expansion</li>
                        <li>Leaf collar formation</li>
                        <li>Photosynthetic capacity increasing</li>
                    </ul>
                </div>
            )}

            <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Environment preset="sunset" />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <CornPlant stage={stage} position={[0, -1, 0]} />
                </Float>

                <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-muted-foreground">
                    Drag to rotate • Scroll to zoom
                </div>
            </div>
        </div>
    );
}
