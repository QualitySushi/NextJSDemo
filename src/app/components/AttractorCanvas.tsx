'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';

type AttractorType = 'clifford' | 'dejong' | 'aizawa' | 'lorenz';

type Parameters = {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  e?: number;
  f?: number;
  sigma?: number;
  rho?: number;
  beta?: number;
};

const DEFAULT_PARAMS: Record<AttractorType, Parameters> = {
  clifford: {
    a: -1.4,
    b: 1.6,
    c: 1.0,
    d: 0.7,
  },

  dejong: {
    a: -2.2,
    b: 1.0,
    c: -2.0,
    d: 1.8,
  },

  aizawa: {
    a: 0.95,
    b: 0.70,
    c: 0.60,
    d: 3.50,
    e: 0.25,
    f: 0.10,
  },

  lorenz: {
    sigma: 10.0,
    rho: 28.0,
    beta: 8.0 / 3.0,
  },
};

export default function AttractorCanvas() {
  const { loggedIn, user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedAttractor, setSelectedAttractor] =
    useState<AttractorType>('clifford');

  const [status, setStatus] = useState<string>('Connecting...');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [params, setParams] = useState<Parameters>(
    DEFAULT_PARAMS.clifford
  );

  // Pan & Zoom refs
  const panRef = useRef<{ x: number; y: number }>({
    x: 400,
    y: 250,
  });

  const zoomRef = useRef<number>(120.0);
  const [zoomDisplay, setZoomDisplay] = useState<number>(120.0);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const latestPointsRef = useRef<number[][] | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points = latestPointsRef.current;

    // Completely clear the previous frame.
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!points || points.length === 0) return;

    // Find the mathematical bounds of the attractor.
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const pt of points) {
      if (!Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) {
        continue;
      }

      minX = Math.min(minX, pt[0]);
      maxX = Math.max(maxX, pt[0]);

      minY = Math.min(minY, pt[1]);
      maxY = Math.max(maxY, pt[1]);
    }

    if (
      !Number.isFinite(minX) ||
      !Number.isFinite(maxX) ||
      !Number.isFinite(minY) ||
      !Number.isFinite(maxY)
    ) {
      return;
    }

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const padding = 40;

    const scaleX = (canvas.width - padding * 2) / dataWidth;
    const scaleY = (canvas.height - padding * 2) / dataHeight;

    const fitScale = Math.min(scaleX, scaleY);

    ctx.save();

    ctx.translate(panRef.current.x, panRef.current.y);
    ctx.scale(
      fitScale * (zoomRef.current / 120),
      fitScale * (zoomRef.current / 120)
    );

    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';

    // Small screen-space point.
    const radius = 0.4 / fitScale;

    for (const pt of points) {
      if (!Number.isFinite(pt[0]) || !Number.isFinite(pt[1])) {
        continue;
      }

      const x = pt[0] - centerX;
      const y = -(pt[1] - centerY);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, []);

  useEffect(() => {
    // Uses Next.js rewrite configured to gateway port 4000
    const ws = new WebSocket(
      `ws://${window.location.host}/ws/attractor`
    );

    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('Connected to Attractor Stream');

      ws.send(
        JSON.stringify({
          attractor_type: selectedAttractor,
          ...params,
        })
      );

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx) {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload.success && payload.points) {
          latestPointsRef.current = payload.points;
          redrawCanvas();
        }
      } catch (err) {
        console.error('Failed to parse attractor frame', err);
      }
    };

    ws.onerror = () => {
      setStatus('WebSocket Error');
    };

    ws.onclose = () => {
      setStatus('Disconnected');
    };

    return () => {
      ws.close();
    };
  }, [redrawCanvas]);

  const handleAttractorChange = (newType: AttractorType) => {
    const defaultParams = DEFAULT_PARAMS[newType];

    setSelectedAttractor(newType);
    setParams(defaultParams);
    setSaveStatus(null);

    // Reset the view when switching attractors.
    panRef.current = { x: 400, y: 250 };
    zoomRef.current = 120.0;
    setZoomDisplay(120.0);

    latestPointsRef.current = null;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          attractor_type: newType,
          ...defaultParams,
        })
      );
    }
  };

  const handleParamChange = (key: string, value: number) => {
    const updated = {
      ...params,
      [key]: value,
    };

    setParams(updated);
    setSaveStatus(null);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(updated));
    }
  };

  const handleSaveConfiguration = async () => {
    if (!loggedIn) {
      setSaveStatus('Please log in via the navigation header to save configurations.');
      return;
    }

    try {
      const res = await fetch('/api/v1/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          simulation_type: 'attractor',
          sub_type: selectedAttractor,
          configuration: params,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus('Configuration saved to your account history!');
      } else {
        setSaveStatus('Failed to save configuration.');
      }
    } catch (err) {
      console.error('Error saving history:', err);
      setSaveStatus('Network error while saving history.');
    }
  };

  // Wheel zoom and pan handlers.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const zoomFactor = 1.1;
      let newZoom =
        e.deltaY < 0
          ? zoomRef.current * zoomFactor
          : zoomRef.current / zoomFactor;

      newZoom = Math.max(10.0, Math.min(1000.0, newZoom));
      zoomRef.current = newZoom;
      setZoomDisplay(newZoom);
      redrawCanvas();
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [redrawCanvas]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX - panRef.current.x,
      y: e.clientY - panRef.current.y,
    };
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
    zoomRef.current = 120.0;
    panRef.current = { x: 400, y: 250 };
    setZoomDisplay(120.0);

    const defaultParams = DEFAULT_PARAMS[selectedAttractor];
    setParams(defaultParams);
    latestPointsRef.current = null;
    setSaveStatus(null);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          attractor_type: selectedAttractor,
          ...defaultParams,
        })
      );
    }

    redrawCanvas();
  };

  const parameterKeys =
    selectedAttractor === 'aizawa'
      ? (['a', 'b', 'c', 'd', 'e', 'f'] as const)
      : selectedAttractor === 'lorenz'
        ? (['sigma', 'rho', 'beta'] as const)
        : (['a', 'b', 'c', 'd'] as const);

  return (
    <div className="w-full max-w-4xl bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 my-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">
            Parametric Vector Fields & Chaotic Attractors
          </h3>

          <div className="flex items-center gap-3">
            <select
              value={selectedAttractor}
              onChange={(e) =>
                handleAttractorChange(e.target.value as AttractorType)
              }
              className="text-xs bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded focus:outline-none"
            >
              <option value="clifford">Clifford Attractor</option>
              <option value="dejong">De Jong Attractor</option>
              <option value="aizawa">Aizawa Attractor</option>
              <option value="lorenz">Lorenz Attractor</option>
            </select>

            <button
              onClick={handleResetView}
              className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900 p-3 rounded-lg border border-slate-800 mt-2">
          {parameterKeys.map((key) => {
            const value = params[key];
            if (value === undefined) return null;

            return (
              <div key={key} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span className="uppercase font-bold text-cyan-400">
                    {key}:
                  </span>
                  <span>{value.toFixed(2)}</span>
                </div>

                <input
                  type="range"
                  min={
                    selectedAttractor === 'lorenz'
                      ? key === 'beta' || key === 'sigma'
                        ? '0.1'
                        : '1.0'
                      : '-3.0'
                  }
                  max={
                    selectedAttractor === 'lorenz'
                      ? key === 'sigma'
                        ? '30.0'
                        : key === 'rho'
                          ? '60.0'
                          : '10.0'
                      : '3.0'
                  }
                  step="0.05"
                  value={value}
                  onChange={(e) =>
                    handleParamChange(key, parseFloat(e.target.value))
                  }
                  className="accent-cyan-400 cursor-pointer h-1 bg-slate-700 rounded-lg"
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs px-3 py-2 rounded font-medium bg-slate-800 text-slate-300">
          <span className="text-cyan-400 font-bold">
            ● {status} ({selectedAttractor.toUpperCase()})
          </span>
          <span className="text-slate-400 font-mono">
            Scale: {zoomDisplay.toFixed(0)}x
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex justify-center items-center bg-[#090d16] p-3 rounded-lg w-full touch-none cursor-grab select-none shadow-inner"
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-auto max-w-full rounded bg-[#090d16] pointer-events-none"
        />
      </div>

      {/* Backend Integration: Save Configuration Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-lg gap-3">
        <div className="text-xs text-slate-300">
          {loggedIn ? (
            <span>Logged in as <strong className="text-cyan-400">{user}</strong>. You can persist customized formulas to your profile history.</span>
          ) : (
            <span className="text-slate-400">Log in to save this chaotic attractor state to your PostgreSQL session history.</span>
          )}
        </div>

        <button
          onClick={handleSaveConfiguration}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded transition shadow disabled:opacity-50"
        >
          Save to History
        </button>
      </div>

      {saveStatus && (
        <div className="text-xs text-center font-medium text-cyan-300 bg-slate-900/50 py-1.5 rounded border border-cyan-900/50">
          {saveStatus}
        </div>
      )}
    </div>
  );
}