'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface HistoryItem {
  id: number;
  simulation_type: string;
  sub_type: string;
  configuration: any;
  created_at: string;
}

export default function SimulationHistoryPage() {
  const { loggedIn } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<any | null>(null);

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/history', {
          credentials: 'include',
        });
        
        if (!res.ok) throw new Error('Failed to fetch history records');
        
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : data.history || []);
      } catch (err: any) {
        console.error('Error fetching history:', err);
        setError('Could not load simulation history from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [loggedIn]);

  const filteredHistory = history.filter((item) => {
    if (filterType === 'all') return true;
    return item.simulation_type.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="page-container min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="grow max-w-5xl w-full mx-auto px-6 py-10 flex flex-col gap-6">
        {!loggedIn ? (
          <div className="w-full max-w-md mx-auto p-8 bg-card border border-border rounded-xl shadow-sm text-center flex flex-col gap-4 my-auto">
            <h2 className="text-2xl font-semibold text-foreground">Simulation History</h2>
            <p className="text-sm text-muted-foreground">
              Please log in via the navigation header to view your saved simulation configurations.
            </p>
          </div>
        ) : (
          <>
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Simulation History Log</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Inspect, filter, and review your persisted simulation state snapshots.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Filter By:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-900 text-white border border-border text-xs rounded-lg p-2.5 outline-none focus:border-cyan-500 w-full sm:w-44"
                >
                  <option value="all">All Simulations</option>
                  <option value="boids">Boids (Flocking)</option>
                  <option value="attractor">Strange Attractors</option>
                  <option value="satellite">Satellite Tracking</option>
                </select>
              </div>
            </div>

            {/* Content State */}
            {loading ? (
              <div className="text-center py-16 text-sm text-muted-foreground animate-pulse">
                Loading history logs from PostgreSQL...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-sm text-red-400 bg-red-950/20 rounded-lg border border-red-900/40">
                {error}
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground bg-slate-900/30 rounded-lg border border-border">
                No simulation records found for this category.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Sub-Type</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-[#090d16]">
                    {filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3 font-mono text-cyan-400">#{item.id}</td>
                        <td className="p-3 font-medium text-foreground capitalize">{item.simulation_type}</td>
                        <td className="p-3 text-muted-foreground capitalize">{item.sub_type || 'Standard'}</td>
                        <td className="p-3 text-slate-400">{new Date(item.created_at).toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedConfig(item.configuration)}
                            className="px-3 py-1 bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 rounded transition font-medium"
                          >
                            View Config
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Configuration Inspector Modal */}
            {selectedConfig && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 z-50">
                <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-semibold text-white">Configuration Payload Inspector</h3>
                    <button
                      onClick={() => setSelectedConfig(null)}
                      className="text-slate-400 hover:text-white text-base font-bold px-2"
                    >
                      ✕
                    </button>
                  </div>
                  <pre className="bg-[#05070c] text-cyan-300 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-80 border border-slate-800">
                    {JSON.stringify(selectedConfig, null, 2)}
                  </pre>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSelectedConfig(null)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}