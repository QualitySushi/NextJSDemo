'use client';

import { useEffect, useRef, useState } from 'react';

export default function BoidsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<string>('Connecting to Gateway...');
  const [separation, setSeparation] = useState<number>(1.5);
  const [alignment, setAlignment] = useState<number>(1.0);
  const [cohesion, setCohesion] = useState<number>(1.0);
  
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to the same Express WebSocket gateway used by Electron
    const ws = new WebSocket('ws://localhost:5000');
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('Connected to Compute Gateway');
    };

    ws.onclose = () => {
      setStatus('Disconnected from Gateway');
    };

    ws.onerror = () => {
      setStatus('WebSocket Connection Error');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Render frame background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw individual boid particles
        if (data.particles) {
          ctx.fillStyle = '#38bdf8';
          for (const p of data.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } catch (err) {
        console.error('Failed to parse incoming frame:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  // Transmit live weight modifications back through the proxy to Python
  const handleSliderChange = (type: string, val: number) => {
    if (type === 'sep') setSeparation(val);
    if (type === 'align') setAlignment(val);
    if (type === 'coh') setCohesion(val);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          separation_weight: type === 'sep' ? val : separation,
          alignment_weight: type === 'align' ? val : alignment,
          cohesion_weight: type === 'coh' ? val : cohesion,
        })
      );
    }
  };

  return (
    <div className="w-full max-w-4xl bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 my-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold text-foreground">Boids Compute Engine (Web Client Live Stream)</h3>
        <div className={`text-xs p-2 rounded text-center font-medium ${status.includes('Connected') ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
          {status}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Controls Column */}
        <div className="flex flex-col gap-4 min-w-60 w-full lg:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted flex justify-between">
              <span>Separation Force</span>
              <span className="font-mono text-foreground">{separation}</span>
            </label>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.1"
              value={separation}
              onChange={(e) => handleSliderChange('sep', parseFloat(e.target.value))}
              className="accent-foreground cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted flex justify-between">
              <span>Alignment Force</span>
              <span className="font-mono text-foreground">{alignment}</span>
            </label>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.1"
              value={alignment}
              onChange={(e) => handleSliderChange('align', parseFloat(e.target.value))}
              className="accent-foreground cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted flex justify-between">
              <span>Cohesion Force</span>
              <span className="font-mono text-foreground">{cohesion}</span>
            </label>
            <input
              type="range"
              min="0.0"
              max="5.0"
              step="0.1"
              value={cohesion}
              onChange={(e) => handleSliderChange('coh', parseFloat(e.target.value))}
              className="accent-foreground cursor-pointer"
            />
          </div>
        </div>

        {/* Canvas Rendering Column */}
        <div className="flex-1 min-w-0 bg-[#090d16] p-3 rounded-lg flex justify-center items-center w-full">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-auto max-w-full rounded bg-[#0f172a] shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}