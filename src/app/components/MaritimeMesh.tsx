'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function MaritimeMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<string>('Connecting...');
  const [modeInfo, setModeInfo] = useState<{ isLive: boolean; count: number; bbox: number[][] | null }>({
    isLive: false,
    count: 0,
    bbox: null,
  });

  const latestDataRef = useRef<any>(null);
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const zoomRef = useRef<number>(1.0);
  const [zoomDisplay, setZoomDisplay] = useState<number>(1.0);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderMesh(ctx, canvas.width, canvas.height, latestDataRef.current, panRef.current, zoomRef.current);
  }, []);

  // Attach native non-passive wheel listener to the container wrapper to guarantee window scroll blocking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault(); // Blocks page scrolling completely over the map area

      const zoomFactor = 1.1;
      let newZoom = e.deltaY < 0 ? zoomRef.current * zoomFactor : zoomRef.current / zoomFactor;
      newZoom = Math.max(0.2, Math.min(10.0, newZoom));

      zoomRef.current = newZoom;
      setZoomDisplay(newZoom);
      redrawCanvas();
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
    };
  }, [redrawCanvas]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws/maritime');

    ws.onopen = () => {
      setStatus('Connected to Maritime Stream');
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.success && canvasRef.current) {
          const data = payload.data;
          latestDataRef.current = data;
          
          setModeInfo({
            isLive: data.isLive,
            count: data.vesselCount,
            bbox: data.bbox,
          });

          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            renderMesh(ctx, canvas.width, canvas.height, data, panRef.current, zoomRef.current);
          }
        }
      } catch (err) {
        console.error('Failed to parse maritime mesh frame', err);
      }
    };

    ws.onerror = () => {
      setStatus('Maritime WebSocket Error');
    };

    ws.onclose = () => {
      setStatus('Disconnected from Maritime stream');
    };

    return () => {
      ws.close();
    };
  }, []);

  const renderMesh = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number, 
    data: any, 
    currentPan: { x: number; y: number }, 
    currentZoom: number
  ) => {
    ctx.save();
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    ctx.translate(currentPan.x, currentPan.y);
    ctx.scale(currentZoom, currentZoom);

    if (data && data.polygons) {
      for (const poly of data.polygons) {
        if (!poly.vertices || poly.vertices.length === 0) continue;

        ctx.beginPath();
        ctx.moveTo(poly.vertices[0][0], poly.vertices[0][1]);
        for (let i = 1; i < poly.vertices.length; i++) {
          ctx.lineTo(poly.vertices[i][0], poly.vertices[i][1]);
        }
        ctx.closePath();

        const normalizedDensity = Math.min(Math.max(1000 / (poly.area + 1), 0.1), 1.0);
        ctx.fillStyle = `rgba(56, 189, 248, ${normalizedDensity * 0.15})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(56, 189, 248, ${normalizedDensity * 0.5})`;
        ctx.lineWidth = 1.2 / currentZoom;
        ctx.stroke();
      }
    }

    if (data && data.points) {
      ctx.fillStyle = data.isLive ? '#22c55e' : '#38bdf8'; 
      for (const pt of data.points) {
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 3 / currentZoom, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    panRef.current = {
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    };
    redrawCanvas();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    e.currentTarget.style.cursor = 'grab';
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleResetView = () => {
    zoomRef.current = 1.0;
    panRef.current = { x: 0, y: 0 };
    setZoomDisplay(1.0);
    redrawCanvas();
  };

  return (
    <div className="w-full max-w-4xl bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 my-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">Dynamic Maritime Voronoi Traffic Grid</h3>
          <button 
            onClick={handleResetView}
            className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition"
          >
            Reset View
          </button>
        </div>
        
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded font-medium bg-slate-800 text-slate-300">
          <span>
            {modeInfo.isLive ? (
              <span className="text-green-400 font-bold">● LIVE AIS FEED ACTIVE</span>
            ) : (
              <span className="text-amber-400 font-bold">● SMOOTH DRIFT FALLBACK MODE</span>
            )}
            {' '}({modeInfo.count} active nodes) | Zoom: {zoomDisplay.toFixed(1)}x
          </span>

          {modeInfo.bbox && (
            <span className="text-slate-400 font-mono">
              Target BBox: [{modeInfo.bbox[0].join(', ')}] to [{modeInfo.bbox[1].join(', ')}]
            </span>
          )}
        </div>
      </div>

      {/* Container wrapper handling both wheel zoom blocking and pointer drag interactions */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex justify-center items-center bg-[#090d16] p-3 rounded-lg w-full touch-none cursor-grab select-none"
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-auto max-w-full rounded bg-[#0f172a] shadow-inner pointer-events-none"
        />
      </div>
    </div>
  );
}