'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, GizmoHelper, GizmoViewport, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { Layers, Mountain, Sprout, Maximize2, Minimize2, RefreshCw, Sun } from 'lucide-react';
import { terrainNoise, cropNoise } from '@/lib/lidar-utils';

interface Field3DViewerProps {
    className?: string;
}

function TerrainMesh({ visible }: { visible: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(100, 100, 64, 64);
        const posAttribute = geo.attributes.position;

        for (let i = 0; i < posAttribute.count; i++) {
            const x = posAttribute.getX(i);
            const y = posAttribute.getY(i);
            const height = terrainNoise(x, y);
            posAttribute.setZ(i, height);
        }

        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} visible={visible} receiveShadow>
            <meshStandardMaterial
                color="#8d6e63"
                roughness={0.8}
                metalness={0.1}
            />
        </mesh>
    );
}

function CropMesh({ visible }: { visible: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                minHeight: { value: 0.0 },
                maxHeight: { value: 2.0 },
            },
            vertexShader: `
                varying float vHeight;
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    vHeight = position.z;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying float vHeight;
                uniform float minHeight;
                uniform float maxHeight;
                
                vec3 getColor(float h) {
                    float t = smoothstep(minHeight, maxHeight, h);
                    // Vibrant Red to Bright Green
                    return mix(vec3(1.0, 0.1, 0.1), vec3(0.1, 1.0, 0.1), t);
                }

                void main() {
                    vec3 color = getColor(vHeight);
                    gl_FragColor = vec4(color, 0.9);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            wireframe: false,
        });
    }, []);

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(100, 100, 64, 64);
        const posAttribute = geo.attributes.position;

        for (let i = 0; i < posAttribute.count; i++) {
            const x = posAttribute.getX(i);
            const y = posAttribute.getY(i);

            const terrainH = terrainNoise(x, y);
            const cropH = cropNoise(x, y);

            posAttribute.setZ(i, terrainH + cropH);
        }

        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <mesh ref={meshRef} geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} visible={visible} castShadow>
        </mesh>
    );
}

function LidarPoints({ visible }: { visible: boolean }) {
    const pointsRef = useRef<THREE.Points>(null);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const count = 20000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            const terrainH = terrainNoise(x, z);
            const cropH = cropNoise(x, z);

            const y = terrainH + cropH;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            const t = Math.min(Math.max(cropH / 1.5, 0), 1);
            const r = 1.0 - t;
            const g = t;
            const b = 0.0;

            colors[i * 3] = r;
            colors[i * 3 + 1] = g;
            colors[i * 3 + 2] = b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, []);

    return (
        <points ref={pointsRef} geometry={geometry} visible={visible}>
            <pointsMaterial size={0.2} vertexColors sizeAttenuation transparent opacity={0.8} />
        </points>
    );
}

export function Field3DViewer({ className }: Field3DViewerProps) {
    const [showGround, setShowGround] = useState(true);
    const [showCropSurface, setShowCropSurface] = useState(false);
    const [showLidarPoints, setShowLidarPoints] = useState(true);
    const [autoRotate, setAutoRotate] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);

    return (
        <div className={cn(
            "relative overflow-hidden bg-black border border-white/10 transition-all duration-300",
            isFullScreen ? "fixed inset-0 z-50 rounded-none" : "rounded-xl",
            className
        )}>
            {/* Controls Overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 space-y-3 shadow-xl">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Layers className="w-3 h-3" /> Layers
                    </div>

                    <button
                        onClick={() => setShowGround(!showGround)}
                        className={cn(
                            "flex items-center gap-2 text-sm w-full p-2 rounded-lg transition-colors",
                            showGround ? "bg-white/20 text-white font-medium" : "text-muted-foreground hover:bg-white/10"
                        )}
                    >
                        <Mountain className="w-4 h-4" />
                        Ground Elevation
                    </button>

                    <button
                        onClick={() => setShowLidarPoints(!showLidarPoints)}
                        className={cn(
                            "flex items-center gap-2 text-sm w-full p-2 rounded-lg transition-colors",
                            showLidarPoints ? "bg-white/20 text-white font-medium" : "text-muted-foreground hover:bg-white/10"
                        )}
                    >
                        <Sun className="w-4 h-4" />
                        Crop LIDAR (Points)
                    </button>

                    <button
                        onClick={() => setShowCropSurface(!showCropSurface)}
                        className={cn(
                            "flex items-center gap-2 text-sm w-full p-2 rounded-lg transition-colors",
                            showCropSurface ? "bg-white/20 text-white font-medium" : "text-muted-foreground hover:bg-white/10"
                        )}
                    >
                        <Sprout className="w-4 h-4" />
                        Crop Surface (Mesh)
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl">
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Crop Height Analysis</div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-red-400 font-bold">Low</span>
                        <div className="w-48 h-3 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 shadow-inner" />
                        <span className="text-xs text-green-400 font-bold">High</span>
                    </div>
                </div>
            </div>

            {/* View Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={cn(
                        "p-3 rounded-xl border border-white/10 transition-all shadow-lg",
                        autoRotate ? "bg-primary text-primary-foreground" : "bg-black/60 text-white hover:bg-white/10"
                    )}
                    title="Toggle Rotation"
                >
                    <RefreshCw className={cn("w-5 h-5", autoRotate && "animate-spin-slow")} />
                </button>
                <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-3 rounded-xl border border-white/10 bg-black/60 text-white hover:bg-white/10 transition-all shadow-lg"
                    title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                >
                    {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
            </div>

            <Canvas camera={{ position: [50, 50, 50], fov: 50 }} shadows dpr={[1, 2]}>
                <color attach="background" args={['#0a0a0a']} />
                <fog attach="fog" args={['#0a0a0a', 60, 200]} />

                <ambientLight intensity={0.4} />
                <directionalLight position={[50, 80, 30]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
                <pointLight position={[-20, 20, -20]} intensity={0.5} color="#blue" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <group position={[0, -5, 0]}>
                    <TerrainMesh visible={showGround} />
                    <LidarPoints visible={showLidarPoints} />
                    <CropMesh visible={showCropSurface} />
                </group>

                <OrbitControls
                    autoRotate={autoRotate}
                    autoRotateSpeed={0.8}
                    maxPolarAngle={Math.PI / 2 - 0.1}
                    enableZoom={true}
                />
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
                </GizmoHelper>
            </Canvas>
        </div>
    );
}
