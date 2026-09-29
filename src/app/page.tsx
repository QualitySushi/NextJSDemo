import Image from "next/image";
import Header from './components/Header';
import Footer from './components/Footer';
import BoidsSimulation from './components/BoidsSimulation';
import SatelliteGlobe from './components/SatelliteGlobe';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
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
              Explore the live NumPy-accelerated Boids simulation and real-time satellite telemetry 3D globe below.
            </p>
          </div>
        </main>

        {/* Embedded Satellite Telemetry Globe */}
        <SatelliteGlobe />

        {/* Embedded Boids Simulation */}
        <BoidsSimulation />

      </div>
      <Footer/>
    </div>
  );
}