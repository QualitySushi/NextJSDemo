'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function BoidsSimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<string>('Connecting to Gateway...');
  const [separation, setSeparation] = useState<number>(1.5);
  const [alignment, setAlignment] = useState<number>(1.0);
  const [cohesion, setCohesion] = useState<number>(1.0);
  
  const wsRef = useRef<WebSocket | null>(null);
  
  // Use refs for weights to avoid stale closures inside the WebSocket message listener or sliders
  const weightsRef = useRef({ separation: 1.5, alignment: 1.0, cohesion: 1.0 });

  const sendWeights = useCallback((sep: number, ali: number, coh: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          separation_weight: sep,
          alignment_weight: ali,
          cohesion_weight: coh,
        })
      );
    }
  }, []);

  useEffect(() => {
    // Connect to the Express WebSocket gateway
    const ws = new WebSocket('ws://localhost:4000/ws/simulation');
    wsRef.current = ws;

    ws.onopen = () => {
      if (wsRef.current !== ws) return;

      setStatus('Connected to Compute Gateway');
      // Send initial weights upon connection
      sendWeights(weightsRef.current.separation, weightsRef.current.alignment, weightsRef.current.cohesion);
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;

      setStatus('Disconnected from Gateway');
    };

    ws.onerror = () => {
      if (wsRef.current !== ws) return;

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
        if (data.particles && Array.isArray(data.particles)) {
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
  }, [sendWeights]);

  // Transmit live weight modifications back through the proxy to Python
  const handleSliderChange = (type: string, val: number) => {
    let newSep = weightsRef.current.separation;
    let newAli = weightsRef.current.alignment;
    let newCoh = weightsRef.current.cohesion;

    if (type === 'sep') {
      setSeparation(val);
      newSep = val;
    } else if (type === 'align') {
      setAlignment(val);
      newAli = val;
    } else if (type === 'coh') {
      setCohesion(val);
      newCoh = val;
    }

    weightsRef.current = { separation: newSep, alignment: newAli, cohesion: newCoh };
    sendWeights(newSep, newAli, newCoh);
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