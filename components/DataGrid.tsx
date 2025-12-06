import React from 'react';
import { motion } from 'framer-motion';

const NODES = Array.from({ length: 32 }).map((_, i) => ({
    id: `N-${i.toString().padStart(2, '0')}`,
    status: Math.random() > 0.9 ? 'warn' : 'ok',
}));

export const NetworkModule: React.FC = () => {
  const MotionDiv = motion.div as any;
  
  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-6 border-b border-sys-border pb-4">
            <div>
                <h3 className="text-sm font-bold text-sys-text uppercase">Topology Map</h3>
                <p className="text-xs text-sys-dim font-mono">ZONE_A // SECTOR_7</p>
            </div>
            <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sys-accent" />
                    <span className="text-[10px] font-mono text-sys-dim">ONLINE</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sys-dim" />
                    <span className="text-[10px] font-mono text-sys-dim">OFFLINE</span>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-px bg-sys-border border border-sys-border">
            {NODES.map((node, i) => (
                <MotionDiv
                    key={node.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className="bg-sys-surface aspect-square relative group hover:bg-sys-dim/10 transition-colors p-2 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-sys-dim">{node.id}</span>
                        <div className={`w-1 h-1 ${node.status === 'warn' ? 'bg-sys-accent animate-pulse' : 'bg-sys-dim'}`} />
                    </div>
                    
                    {/* Schematic Lines */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                        <div className="w-full h-[1px] bg-sys-dim" />
                        <div className="h-full w-[1px] bg-sys-dim absolute" />
                        <div className="w-4 h-4 border border-sys-dim rounded-full bg-sys-bg z-10" />
                    </div>
                </MotionDiv>
            ))}
        </div>
    </div>
  );
};