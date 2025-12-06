import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModuleID } from '../types';

interface CentralCommandProps {
  activeModule: ModuleID | null;
  onActivate: (id: ModuleID) => void;
  onReset: () => void;
}

export const CentralCommand: React.FC<CentralCommandProps> = ({ activeModule, onActivate, onReset }) => {
  const MotionDiv = motion.div as any;
  const MotionButton = motion.button as any;

  // Configuration for the 4 modules
  const modules = [
    { id: ModuleID.OVERVIEW, label: 'OVERVIEW', cx: '50%', cy: '15%' },
    { id: ModuleID.NETWORK, label: 'NETWORK', cx: '85%', cy: '50%' },
    { id: ModuleID.LOGIC, label: 'LOGIC', cx: '50%', cy: '85%' },
    { id: ModuleID.ANALYTICS, label: 'ANALYTICS', cx: '15%', cy: '50%' },
  ];

  return (
    <>
      {/* 
        THE ECLIPSE CORE
        This is the central ring that expands to frame the content.
      */}
      <MotionDiv
        layoutId="system-core"
        className="fixed z-40 flex items-center justify-center overflow-hidden border-2 border-sys-border bg-sys-surface/80 backdrop-blur-sm"
        initial={false}
        animate={{
            width: activeModule ? 'calc(100vw - 48px)' : '320px',
            height: activeModule ? 'calc(100vh - 48px)' : '320px',
            borderRadius: activeModule ? '4px' : '9999px',
            left: '50%',
            top: '50%',
            x: '-50%',
            y: '-50%',
            borderColor: activeModule ? '#333' : '#333'
        }}
        transition={{ 
            type: "spring", 
            stiffness: 90, 
            damping: 20,
            mass: 1
        }}
      >
          {/* Internal Complex Geometry (Only visible in center mode) */}
          <AnimatePresence>
            {!activeModule && (
                <MotionDiv
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    {/* Outer Static Ring */}
                    <div className="absolute w-[90%] h-[90%] border border-sys-dim/20 rounded-full" />
                    
                    {/* Dashed Rotating Ring */}
                    <div className="absolute w-[82%] h-[82%] border-2 border-dashed border-sys-dim/40 rounded-full animate-spin-slow" />
                    
                    {/* Inner Counter-Rotating Ring */}
                    <div className="absolute w-[60%] h-[60%] border-2 border-sys-dim/20 rounded-full border-t-sys-accent border-r-transparent border-b-sys-accent border-l-transparent animate-spin-reverse-slow" />
                    
                    {/* Central Solid Core */}
                    <div className="w-16 h-16 bg-sys-surface border border-sys-border rounded-full flex items-center justify-center relative shadow-glow">
                        <div className="w-2 h-2 bg-sys-accent" />
                        {/* Crosshairs */}
                        <div className="absolute w-full h-[1px] bg-sys-border" />
                        <div className="absolute h-full w-[1px] bg-sys-border" />
                    </div>
                </MotionDiv>
            )}
          </AnimatePresence>
      </MotionDiv>

      {/* 
        MODULE SELECTORS (Satellite Buttons)
        Visible when system is idle.
      */}
      {!activeModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="relative w-[600px] h-[600px] pointer-events-auto">
                {modules.map((mod) => (
                    <MotionButton
                        key={mod.id}
                        className="absolute w-32 h-12 flex items-center justify-center group"
                        style={{ 
                            left: mod.cx, 
                            top: mod.cy, 
                            x: '-50%', 
                            y: '-50%' 
                        }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onActivate(mod.id)}
                    >
                        <div className="absolute inset-0 bg-sys-surface border border-sys-border group-hover:border-sys-accent transition-colors shadow-lg" />
                        
                        {/* Connector Line to Center */}
                        <div className="absolute w-[100px] h-[1px] bg-sys-border -z-10 group-hover:bg-sys-accent transition-colors"
                            style={{
                                top: '50%',
                                left: '50%',
                                transformOrigin: 'left center',
                                transform: `rotate(${
                                    mod.id === ModuleID.NETWORK ? 180 : 
                                    mod.id === ModuleID.ANALYTICS ? 0 : 
                                    mod.id === ModuleID.OVERVIEW ? 90 : 270
                                }deg) translateX(64px)` // Offset by half button width
                            }}
                        />

                        <div className="relative z-10 flex items-center gap-3">
                             <span className="text-xs font-bold tracking-widest text-sys-text group-hover:text-sys-accent transition-colors font-mono">
                                {mod.label}
                             </span>
                             <div className="w-1.5 h-1.5 bg-sys-dim group-hover:bg-sys-accent" />
                        </div>
                    </MotionButton>
                ))}
            </div>
        </div>
      )}

      {/* 
        Close/Reset Trigger (Invisible overlay or button)
        In this system, the "Close" button is inside the Module Frame, 
        but we can add an overlay click handler if desired.
      */}
    </>
  );
};