import React from 'react';
import { motion } from 'framer-motion';

interface SystemFrameProps {
  children: React.ReactNode;
  title: string;
  isActive: boolean;
  onClose?: () => void;
}

export const SystemFrame: React.FC<SystemFrameProps> = ({ children, title, isActive, onClose }) => {
  const MotionDiv = motion.div as any;
  const MotionButton = motion.button as any;

  if (!isActive) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full flex flex-col relative bg-sys-surface border-2 border-sys-border overflow-hidden shadow-depth"
    >
      {/* Holographic Beam Projection Effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-sys-accent shadow-beam z-20" />

      {/* Industrial Header */}
      <div className="relative z-10 h-16 flex items-center justify-between px-6 border-b-2 border-sys-border bg-sys-bg">
        <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-sys-accent" />
            <h1 className="text-lg font-bold uppercase tracking-wider text-sys-text font-mono">
                {title} <span className="text-sys-dim">// MOD.01</span>
            </h1>
        </div>
        
        {/* Header Decor */}
        <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-1 h-4 ${i === 4 ? 'bg-sys-accent' : 'bg-sys-border'}`} />
                ))}
            </div>
            {onClose && (
                <MotionButton
                    whileHover={{ scale: 1.05, backgroundColor: '#FF4400', color: '#000' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="h-8 px-4 border border-sys-dim text-xs font-mono text-sys-dim uppercase flex items-center transition-colors"
                >
                    Close_View
                </MotionButton>
            )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 relative overflow-hidden bg-sys-bg/50">
         {/* Background Grid */}
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        
        <div className="relative z-10 h-full overflow-auto custom-scrollbar p-8">
            {children}
        </div>
      </div>

      {/* Footer Info */}
      <div className="h-8 border-t border-sys-border bg-sys-surface flex items-center justify-between px-6">
          <span className="text-[10px] font-mono text-sys-dim">SYS_READY</span>
          <div className="flex gap-2">
             <span className="text-[10px] font-mono text-sys-accent">LIVE_FEED</span>
             <div className="w-1.5 h-1.5 rounded-full bg-sys-accent animate-pulse" />
          </div>
      </div>
    </MotionDiv>
  );
};