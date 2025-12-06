import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const DATA = Array.from({ length: 40 }).map((_, i) => ({
    idx: i,
    val: 50 + Math.sin(i * 0.2) * 30 + Math.random() * 10
}));

export const AnalyticsModule: React.FC = () => {
  return (
    <div className="h-full flex flex-col gap-6">
        {/* Main Chart */}
        <div className="flex-1 border border-sys-border bg-sys-surface/50 p-4 relative">
            <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-sys-accent bg-sys-border/30">REAL_TIME_FLUX</div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DATA}>
                    <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF4400" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#FF4400" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                    <XAxis hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#eee' }}
                        itemStyle={{ fontFamily: 'monospace', fontSize: '11px', color: '#FF4400' }}
                        cursor={{ stroke: '#FF4400', strokeWidth: 1 }}
                    />
                    <Area 
                        type="step" 
                        dataKey="val" 
                        stroke="#FF4400" 
                        strokeWidth={2}
                        fill="url(#colorVal)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>

        {/* Secondary Metrics */}
        <div className="h-32 grid grid-cols-2 gap-4">
             <div className="border border-sys-border bg-sys-surface p-4">
                 <div className="text-[10px] font-mono text-sys-dim mb-1">THROUGHPUT</div>
                 <div className="text-3xl font-mono text-sys-text">1.2<span className="text-sm text-sys-dim">TB/s</span></div>
             </div>
             <div className="border border-sys-border bg-sys-surface p-4">
                 <div className="text-[10px] font-mono text-sys-dim mb-1">ERROR_RATE</div>
                 <div className="text-3xl font-mono text-sys-text">0.00<span className="text-sm text-sys-dim">%</span></div>
             </div>
        </div>
    </div>
  );
};