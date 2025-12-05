import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { NavNode, Phase } from '../types';
import { Activity, BarChart3, BrainCircuit, Cpu, Layers, MessageSquare, Terminal } from 'lucide-react';

interface SolarNavigationProps {
  activePhase: Phase;
  onPhaseChange: (phase: Phase) => void;
}

const NODES: NavNode[] = [
  { id: Phase.DASHBOARD, label: 'Macro Dashboard', icon: Terminal, shortCode: 'MACRO', status: 'active' },
  { id: Phase.MARKETS, label: 'Liquidity Analysis', icon: Activity, shortCode: 'LIQ', status: 'complete' },
  { id: Phase.FACTORS, label: 'Alpha Factors', icon: Layers, shortCode: 'ALPHA', status: 'complete' },
  { id: Phase.FUSION, label: 'Signal Fusion', icon: BrainCircuit, shortCode: 'SIG', status: 'active' },
  { id: Phase.EXECUTION, label: 'Algo Execution', icon: Cpu, shortCode: 'ALGO', status: 'pending' },
  { id: Phase.PORTFOLIO, label: 'Portfolio Risk', icon: BarChart3, shortCode: 'RISK', status: 'locked' },
  { id: Phase.AI, label: 'Quant Assistant', icon: MessageSquare, shortCode: 'AI', status: 'active' },
];

export const SolarNavigation: React.FC<SolarNavigationProps> = ({ activePhase, onPhaseChange }) => {
  
  // Calculate positions based on active node being at (0,0)
  const nodePositions = useMemo(() => {
    const activeIndex = NODES.findIndex(n => n.id === activePhase);
    const otherNodes = NODES.filter(n => n.id !== activePhase);
    const radius = 220; // Distance from center
    
    return NODES.map((node) => {
      if (node.id === activePhase) {
        return { ...node, x: 0, y: 0, scale: 1.2, opacity: 1 };
      }
      
      // Find index in the filtered array to distribute evenly
      const indexInOrbit = otherNodes.findIndex(n => n.id === node.id);
      const angle = (indexInOrbit * (360 / otherNodes.length)) * (Math.PI / 180); // Convert to radians
      
      // Start form top (-PI/2)
      const adjustedAngle = angle - Math.PI / 2;

      return {
        ...node,
        x: Math.cos(adjustedAngle) * radius,
        y: Math.sin(adjustedAngle) * radius,
        scale: 0.8,
        opacity: 0.7
      };
    });
  }, [activePhase]);

  return (
    <div className="relative w-[600px] h-[600px] flex items-center justify-center pointer-events-none">
      {/* Orbital Rings - Decorative */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[440px] h-[440px] rounded-full border border-apex-border/30 animate-pulse-slow" />
        <div className="w-[300px] h-[300px] rounded-full border border-dashed border-apex-border/20" />
      </div>

      {/* Connecting Lines (from center to others) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {nodePositions.map((node) => {
          if (node.id === activePhase) return null;
          return (
            <motion.line
              key={`line-${node.id}`}
              x1="50%"
              y1="50%"
              x2={`calc(50% + ${node.x}px)`}
              y2={`calc(50% + ${node.y}px)`}
              stroke="#2A3447"
              strokeWidth="1"
              initial={false}
              animate={{
                x2: `calc(50% + ${node.x}px)`,
                y2: `calc(50% + ${node.y}px)`
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodePositions.map((node) => {
        const isActive = node.id === activePhase;
        const Icon = node.icon;
        
        return (
          <motion.button
            key={node.id}
            onClick={() => onPhaseChange(node.id)}
            className={`
              absolute z-10 flex flex-col items-center justify-center 
              w-24 h-24 rounded-full pointer-events-auto cursor-pointer
              transition-colors duration-300 group
              ${isActive ? 'bg-apex-bg border-2 border-apex-accent shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-apex-panel border border-apex-border hover:border-apex-accent/50'}
            `}
            initial={false}
            animate={{
              x: node.x,
              y: node.y,
              scale: node.scale,
              opacity: node.opacity
            }}
            transition={{ type: "spring", stiffness: 180, damping: 25 }}
            whileHover={{ scale: isActive ? 1.25 : 0.9 }}
          >
            <Icon 
              size={isActive ? 32 : 24} 
              className={`
                mb-2 ${isActive ? 'text-apex-accent' : 'text-apex-muted group-hover:text-apex-text'}
              `} 
            />
            <span className={`
              text-[10px] font-mono tracking-wider uppercase
              ${isActive ? 'text-apex-text font-bold' : 'text-apex-muted'}
            `}>
              {node.shortCode}
            </span>
            
            {/* Status Indicator Dot */}
            <div className={`
              absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-apex-bg
              ${node.status === 'complete' ? 'bg-apex-success' : 
                node.status === 'active' ? 'bg-apex-accent' : 
                node.status === 'locked' ? 'bg-red-900' : 'bg-apex-warning'}
            `} />
          </motion.button>
        );
      })}
      
      {/* Center Label (Floating near active node) */}
      <motion.div 
        className="absolute top-[65%] text-center pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={activePhase} // Re-animate on change
      >
         <h2 className="text-xl font-mono font-bold text-apex-text tracking-widest">{NODES.find(n => n.id === activePhase)?.label}</h2>
         <p className="text-xs text-apex-accent font-mono mt-1">ENGINE CONNECTED</p>
      </motion.div>
    </div>
  );
};