import React, { useState, useEffect, useRef } from 'react';
import { LayoutGroup } from 'framer-motion';
import { ModuleID } from './types';
import { CentralCommand } from './components/SolarNavigation';
import { SystemFrame } from './components/ui/Card';

// Modules
import { OverviewModule } from './components/Dashboard';
import { NetworkModule } from './components/DataGrid';
import { LogicModule } from './components/ProcessFlow';
import { AnalyticsModule } from './components/ControlPanel';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleID | null>(null);
  const [time, setTime] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
        setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Flow Field Background Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 100
    });

    // Init particles
    for(let i=0; i<100; i++) particles.push(createParticle());

    const animate = () => {
        ctx.fillStyle = 'rgba(8, 8, 8, 0.1)'; // Trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 68, 0, 0.3)'; // Particle Color
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.1;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Reset dead
            if (p.life <= 0) {
                Object.assign(p, createParticle());
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-sys-bg text-sys-text relative overflow-hidden selection:bg-sys-accent selection:text-black">
      {/* Background Layers */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-50 pointer-events-none" />
      <div className="noise-overlay" />
      
      {/* 
        PERSISTENT HUD 
        Generic telemetry visible at all times in the corners.
      */}
      <div className="fixed top-6 left-8 z-30 hidden md:block pointer-events-none">
          <div className="text-[10px] font-mono text-sys-dim tracking-widest mb-1">SYSTEM_ZERO // V1.0</div>
          <div className="flex gap-1">
              <div className="w-16 h-1 bg-sys-accent" />
              <div className="w-4 h-1 bg-sys-dim" />
          </div>
      </div>

      <div className="fixed top-6 right-8 z-30 hidden md:block text-right pointer-events-none">
          <div className="text-xl font-mono font-bold tracking-tight">{time}</div>
          <div className="text-[10px] font-mono text-sys-dim tracking-widest">LOCAL_TIME</div>
      </div>

      <div className="fixed bottom-6 left-8 z-30 hidden md:flex gap-6 items-end pointer-events-none">
          <div>
              <div className="text-[10px] font-mono text-sys-dim">FPS</div>
              <div className="text-sm font-mono text-sys-accent">60.0</div>
          </div>
          <div>
              <div className="text-[10px] font-mono text-sys-dim">LATENCY</div>
              <div className="text-sm font-mono text-sys-text">4ms</div>
          </div>
      </div>

      <div className="fixed bottom-6 right-8 z-30 hidden md:block text-right pointer-events-none">
          <div className="flex items-center justify-end gap-2 mb-1">
              <span className="text-[10px] font-mono text-sys-dim">STATUS</span>
              <div className="w-2 h-2 rounded-full bg-sys-accent animate-pulse" />
          </div>
          <div className="text-[10px] font-mono text-sys-text">ALL_SYSTEMS_NOMINAL</div>
      </div>

      <LayoutGroup>
        {/* Navigation Core */}
        <CentralCommand 
            activeModule={activeModule} 
            onActivate={setActiveModule} 
            onReset={() => setActiveModule(null)} 
        />

        {/* Content Container (Expanded View) */}
        <div className={`
            fixed inset-0 z-40 flex items-center justify-center pointer-events-none
        `}>
            {/* 
                We use a fixed container size that matches the expanded ring size.
                The 24px padding ensures it sits inside the ring border.
            */}
            <div className={`
                w-[calc(100vw-64px)] h-[calc(100vh-64px)] pointer-events-auto
                ${activeModule ? 'opacity-100 transition-opacity duration-500 delay-300' : 'opacity-0 pointer-events-none'}
            `}>
                {activeModule === ModuleID.OVERVIEW && (
                    <SystemFrame title="Overview" isActive={activeModule === ModuleID.OVERVIEW} onClose={() => setActiveModule(null)}>
                        <OverviewModule />
                    </SystemFrame>
                )}
                {activeModule === ModuleID.NETWORK && (
                    <SystemFrame title="Network Topology" isActive={activeModule === ModuleID.NETWORK} onClose={() => setActiveModule(null)}>
                        <NetworkModule />
                    </SystemFrame>
                )}
                {activeModule === ModuleID.LOGIC && (
                    <SystemFrame title="Logic Flow" isActive={activeModule === ModuleID.LOGIC} onClose={() => setActiveModule(null)}>
                        <LogicModule />
                    </SystemFrame>
                )}
                {activeModule === ModuleID.ANALYTICS && (
                    <SystemFrame title="Metric Analytics" isActive={activeModule === ModuleID.ANALYTICS} onClose={() => setActiveModule(null)}>
                        <AnalyticsModule />
                    </SystemFrame>
                )}
            </div>
        </div>
      </LayoutGroup>
    </div>
  );
};

export default App;