import React from 'react';

const StatBlock = ({ label, value, unit, trend }: any) => (
    <div className="bg-sys-surface border border-sys-border p-4 flex flex-col justify-between group hover:border-sys-dim transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono text-sys-dim uppercase">{label}</span>
            {trend && (
                <span className="text-[10px] font-mono text-sys-accent">{trend}</span>
            )}
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-sys-text font-mono">{value}</span>
            <span className="text-xs font-mono text-sys-dim">{unit}</span>
        </div>
        <div className="w-full h-1 bg-sys-bg mt-3 overflow-hidden">
            <div className="h-full bg-sys-dim group-hover:bg-sys-accent transition-colors" style={{ width: `${Math.random() * 80 + 20}%` }} />
        </div>
    </div>
);

export const OverviewModule: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatBlock label="System Load" value="42" unit="%" trend="+2.4%" />
            <StatBlock label="Active Threads" value="8,192" unit="" trend="NOMINAL" />
            <StatBlock label="Memory" value="16.4" unit="GB" trend="STABLE" />
            <StatBlock label="Uptime" value="842" unit="HRS" trend="" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Console Log Area */}
            <div className="border border-sys-border bg-sys-bg p-4 font-mono text-xs h-64 overflow-hidden relative">
                <div className="absolute top-0 right-0 px-2 bg-sys-surface text-sys-dim text-[10px] border-l border-b border-sys-border">SYS_LOG</div>
                <div className="flex flex-col gap-1 text-sys-dim opacity-80">
                    <span className="text-sys-accent">>> SYSTEM_INIT_COMPLETE</span>
                    <span>[10:42:01] Loading core modules... OK</span>
                    <span>[10:42:02] Establishing neural handshake... OK</span>
                    <span>[10:42:05] Flow field simulation started.</span>
                    <span>[10:42:08] Listener active on port 8080.</span>
                    <span className="text-white">>> WAITING_FOR_INPUT...</span>
                </div>
            </div>

            {/* Visualizer Placeholder */}
            <div className="border border-sys-border bg-sys-surface p-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-30" />
                <div className="w-32 h-32 border-2 border-sys-accent rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-24 h-24 border border-sys-dim rounded-full border-dashed animate-spin-slow" />
                </div>
                <div className="absolute bottom-4 left-4 text-[10px] font-mono text-sys-accent">CORE_TEMP: 45C</div>
            </div>
        </div>
    </div>
  );
};