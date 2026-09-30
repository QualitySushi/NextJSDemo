"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BoidsSimulation from "./components/BoidsSimulation";
import SatelliteGlobe from "./components/SatelliteGlobe";
import MaritimeMesh from "./components/MaritimeMesh";
import AttractorCanvas from "./components/AttractorCanvas";

export default function Home() {
  const [boidsEnabled, setBoidsEnabled] = useState(false);
  const [satelliteEnabled, setSatelliteEnabled] = useState(false);
  const [maritimeEnabled, setMaritimeEnabled] = useState(false);
  const [attractorEnabled, setAttractorEnabled] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-col flex-1 items-center justify-center font-sans px-4">

        {/* Existing Main Welcome Card */}
        <main className="flex w-full max-w-4xl flex-col items-center justify-between py-16 px-8 bg-card border border-border rounded-xl my-8 sm:items-start shadow-sm">
          <Image
            className="dark:invert h-5 w-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />

          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left mb-8">
            <h1 className="max-w-xl text-3xl font-semibold leading-10 tracking-tight text-foreground">
              Polyglot architecture bridging Next.js, Express, and Python compute layers.
            </h1>

            <p className="max-w-md text-lg leading-8 text-muted">
              Explore live simulations, 3D satellite telemetry, dynamic maritime flows, and chaotic vector attractors below.
            </p>
          </div>

          {/* Visualization Controls */}
          <div className="w-full border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Visualizations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={satelliteEnabled}
                  onChange={(event) =>
                    setSatelliteEnabled(event.target.checked)
                  }
                />
                <span className="text-sm text-foreground">
                  Satellite Globe
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={boidsEnabled}
                  onChange={(event) =>
                    setBoidsEnabled(event.target.checked)
                  }
                />
                <span className="text-sm text-foreground">
                  Boids Simulation
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maritimeEnabled}
                  onChange={(event) =>
                    setMaritimeEnabled(event.target.checked)
                  }
                />
                <span className="text-sm text-foreground">
                  Maritime Mesh
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attractorEnabled}
                  onChange={(event) =>
                    setAttractorEnabled(event.target.checked)
                  }
                />
                <span className="text-sm text-foreground">
                  Chaotic Attractor
                </span>
              </label>

            </div>
          </div>
        </main>

        {/* Visualizations */}

        {satelliteEnabled && <SatelliteGlobe />}

        {boidsEnabled && <BoidsSimulation />}

        {maritimeEnabled && <MaritimeMesh />}

        {attractorEnabled && <AttractorCanvas />}

      </div>

      <Footer />
    </div>
  );
}