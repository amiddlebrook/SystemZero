import React, { useState } from 'react';
import { SolarNavigation } from './components/SolarNavigation';
import { Dashboard } from './components/Dashboard';
import { Phase1Odds } from './components/Phase1Odds'; // Market Data
import { Phase2Lattice } from './components/Phase2Lattice'; // Factor Analysis
import { Phase3Fusion } from './components/Phase3Fusion'; // Signal Fusion
import { Phase5Portfolio } from './components/Phase5Portfolio'; // Execution
import { Phase } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activePhase, setActivePhase] = useState<Phase>(Phase.DASHBOARD);

  // Content Renderer based on active phase
  const renderContent = () => {
    switch (activePhase) {
      case Phase.DASHBOARD:
        return <Dashboard />;
      case Phase.MARKETS: // Was ODDS
        return <Phase1Odds />;
      case Phase.FACTORS: // Was LATTICE
        return <Phase2Lattice />;
      case Phase.FUSION:
        return <Phase3Fusion />;
      case Phase.EXECUTION: // Was PORTFOLIO/PICKS logic split
        return <Phase5Portfolio />;
      default:
        return (
            <div className="flex items-center justify-center h-full text-apex-muted font-mono">
                AWAITING MODULE INITIALIZATION...
            </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-screen bg-apex-bg overflow-hidden text-apex-text selection:bg-apex-accent selection:text-white">
      {/* Left: Solar Navigation (Fixed Width) */}
      <div className="w-[500px] h-full relative flex items-center justify-center border-r border-apex-border/30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#2A3447 1px, transparent 1px), linear-gradient(90deg, #2A3447 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        <div className="relative z-10 scale-75 transform-gpu">
             <SolarNavigation activePhase={activePhase} onPhaseChange={setActivePhase} />
        </div>

        {/* Brand / Logo Area */}
        <div className="absolute top-8 left-8 z-20">
            <h1 className="text-2xl font-bold font-mono tracking-tighter text-white">APEX<span className="text-apex-accent">.QUANT</span></h1>
            <p className="text-[10px] text-apex-muted tracking-widest uppercase mt-1">HFT Execution Engine v3.0</p>
        </div>
      </div>

      {/* Right: Content Area (Fluid) */}
      <div className="flex-1 h-full relative flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-apex-border/30 flex items-center justify-between px-8 bg-apex-bg/50 backdrop-blur-sm z-20">
            <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-apex-muted">TERMINAL ID:</span>
                <span className="text-xs font-mono text-apex-accent">TRD-NYC-09</span>
            </div>
            <div className="flex items-center gap-4">
                 <button className="text-xs font-mono text-apex-muted hover:text-white transition-colors">SETTINGS</button>
                 <button className="text-xs font-mono text-apex-muted hover:text-white transition-colors">REPORTS</button>
                 <div className="w-2 h-2 rounded-full bg-apex-success animate-pulse"></div>
            </div>
        </div>

        {/* Main Content Container with Transitions */}
        <div className="flex-1 p-8 overflow-hidden relative">
             <AnimatePresence mode="wait">
                <motion.div
                    key={activePhase}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                >
                    {renderContent()}
                </motion.div>
             </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;