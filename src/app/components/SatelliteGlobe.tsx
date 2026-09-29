'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function SatelliteGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Connecting to Tracker...');
  const [statusBg, setStatusBg] = useState('#334155');
  const [satellites, setSatellites] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  
  // Telemetry details readout state
  const [coords, setCoords] = useState({ x: '--', y: '--', z: '--', time: '--' });

  // Refs to hold Three.js instances across renders without re-initializing
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  // Orbit dragging state
  const isDraggingRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 1200, theta: 0, phi: Math.PI / 2 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Initialize Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 10000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 2. Initialize WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting & Earth Wireframe Sphere
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const earthRadius = 300;
    const sphereGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e3a8a, wireframe: true, transparent: true, opacity: 0.3
    });
    const earthSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(earthSphere);

    // 4. Orbit Drag & Zoom Handlers
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - mousePosRef.current.x;
      const deltaY = e.clientY - mousePosRef.current.y;

      sphericalRef.current.theta -= deltaX * 0.005;
      sphericalRef.current.phi -= deltaY * 0.005;

      const EPS = 0.00001;
      sphericalRef.current.phi = Math.max(EPS, Math.min(Math.PI - EPS, sphericalRef.current.phi));
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRef.current.radius += e.deltaY * 0.8;
      sphericalRef.current.radius = Math.max(350, Math.min(4000, sphericalRef.current.radius));
      updateCameraPosition();
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 5. Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Fetch initial data
    fetchSatelliteData();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  };

  const fetchSatelliteData = async () => {
    setStatus('Fetching Data Snapshot...');
    setStatusBg('#334155');
    try {
      const res = await fetch('http://localhost:8000/api/satellites');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const satArray = Array.isArray(data) ? data : (data.satellites || [data]);
      
      setSatellites(satArray);
      if (satArray.length > 0 && !selectedId) {
        setSelectedId(satArray[0].id || satArray[0].name);
      }
      
      updateSceneMeshes(satArray, selectedId || satArray[0]?.id || satArray[0]?.name);
      setStatus('Status: Snapshot Loaded Successfully');
      setStatusBg('#065f46');
    } catch (err) {
      console.error(err);
      setStatus('Status: Fetch Failed (Check Server)');
      setStatusBg('#991b1b');
    }
  };

  const updateSceneMeshes = (satArray: any[], activeSelId: string) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const EARTH_RADIUS_KM = 6371.0;
    const THREE_EARTH_RADIUS = 300.0;
    const scale = THREE_EARTH_RADIUS / EARTH_RADIUS_KM;

    const activeIds = new Set<string>();
    let primarySat: any = null;

    satArray.forEach((sat) => {
      const satId = sat.id || sat.name || 'satellite';
      activeIds.add(satId);

      const isSelected = (satId === activeSelId) || (!activeSelId && satArray.indexOf(sat) === 0);
      if (isSelected) primarySat = sat;

      const posX = (sat.x || 0) * scale;
      const posY = (sat.z || 0) * scale; // Map celestial Z to Three.js Y
      const posZ = (sat.y || 0) * scale;

      let mesh = meshesRef.current.get(satId);
      if (!mesh) {
        const geometry = new THREE.SphereGeometry(6, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: isSelected ? 0xef4444 : 0x38bdf8 });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        meshesRef.current.set(satId, mesh);
      } else {
        (mesh.material as THREE.MeshBasicMaterial).color.setHex(isSelected ? 0xef4444 : 0x38bdf8);
      }

      mesh.position.set(posX, posY, posZ);
    });

    if (!primarySat && satArray.length > 0) primarySat = satArray[0];
    if (primarySat) {
      setCoords({
        x: Number(primarySat.x || 0).toFixed(2),
        y: Number(primarySat.y || 0).toFixed(2),
        z: Number(primarySat.z || 0).toFixed(2),
        time: primarySat.time || new Date().toISOString()
      });
    }

    // Cleanup removed meshes
    meshesRef.current.forEach((mesh, id) => {
      if (!activeIds.has(id)) {
        scene.remove(mesh);
        meshesRef.current.delete(id);
      }
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setSelectedId(newId);
    updateSceneMeshes(satellites, newId);
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-card border border-border rounded-xl shadow-sm my-8">
      <h3 className="text-xl font-semibold text-foreground mb-2">Orbital Mechanics & Proximity Mesh (Live 3D View)</h3>
      <div style={{ background: statusBg }} className="text-xs p-2 rounded text-center text-white mb-4 transition-colors">
        {status}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Controls */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <button
            onClick={fetchSatelliteData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Refresh Data Snapshot
          </button>

          <div className="flex flex-col gap-1 text-sm text-foreground bg-slate-900/50 p-3 rounded border border-border">
            <div>X Position: <span className="font-mono text-blue-400">{coords.x}</span> km</div>
            <div>Y Position: <span className="font-mono text-blue-400">{coords.y}</span> km</div>
            <div>Z Position: <span className="font-mono text-blue-400">{coords.z}</span> km</div>
            <div className="text-xs text-muted-foreground mt-1 truncate">Time: {coords.time}</div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-muted-foreground">Tracked Object:</label>
            <select
              value={selectedId}
              onChange={handleSelectChange}
              className="w-full bg-slate-900 text-white border border-border p-2 rounded text-sm"
            >
              {satellites.length === 0 ? (
                <option value="">Click refresh to load...</option>
              ) : (
                satellites.map((sat) => {
                  const id = sat.id || sat.name;
                  return (
                    <option key={id} value={id}>
                      {sat.name || id}
                    </option>
                  );
                })
              )}
            </select>
          </div>
        </div>

        {/* 3D Globe Container */}
        <div className="flex-1 w-full bg-[#090d16] p-2 rounded-lg border border-border overflow-hidden">
          <div ref={containerRef} className="w-full h-112.5 rounded cursor-grab active:cursor-grabbing" />
        </div>
      </div>
    </div>
  );
}