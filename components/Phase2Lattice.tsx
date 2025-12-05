import React from 'react';
import { Card } from './ui/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { subject: 'Momentum', A: 90, B: 65, fullMark: 100 },
  { subject: 'Value', A: 45, B: 85, fullMark: 100 },
  { subject: 'Volatility', A: 88, B: 40, fullMark: 100 },
  { subject: 'Size', A: 30, B: 78, fullMark: 100 },
  { subject: 'Quality', A: 85, B: 90, fullMark: 100 },
  { subject: 'Yield', A: 20, B: 70, fullMark: 100 },
  { subject: 'Liquidity', A: 95, B: 85, fullMark: 100 },
  { subject: 'Growth', A: 80, B: 55, fullMark: 100 },
];

export const Phase2Lattice: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-7 h-[500px]">
        <Card title="Factor Exposure Analysis: Current vs Target" className="h-full">
            <div className="h-full w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#2A3447" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Current Portfolio"
                        dataKey="A"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fill="#3B82F6"
                        fillOpacity={0.2}
                    />
                    <Radar
                        name="Model Target"
                        dataKey="B"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="#10B981"
                        fillOpacity={0.2}
                    />
                    <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>

      <div className="col-span-5 flex flex-col gap-4">
          <Card title="Alpha Decay & Sensitivity" className="flex-1">
              <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border-b border-apex-border pb-2">
                      <span className="text-apex-muted">Momentum Z-Score</span>
                      <span className="font-mono text-apex-success">+2.45</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-apex-border pb-2">
                      <span className="text-apex-muted">Value Z-Score</span>
                      <span className="font-mono text-apex-danger">-1.12</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-apex-border pb-2 bg-apex-bg/30 p-2">
                      <span className="text-apex-text font-bold">Predicted Alpha</span>
                      <span className="font-mono text-apex-accent">+45 bps</span>
                  </div>
                  <div className="text-xs text-apex-muted mt-4">
                      <p className="mb-2"><strong>Driver Analysis:</strong></p>
                      <ul className="list-disc pl-4 space-y-1">
                          <li>Short-term momentum signals are decaying.</li>
                          <li>Volatility clustering indicates potential regime shift.</li>
                          <li>Liquidity premium remains attractive in small-caps.</li>
                      </ul>
                  </div>
              </div>
          </Card>
          
          <Card title="Factor Correlation Warning">
              <div className="flex items-center justify-between">
                  <div className="text-center">
                      <div className="text-2xl font-mono text-apex-warning font-bold">0.68</div>
                      <div className="text-xs text-apex-muted">Mom/Vol Corr</div>
                  </div>
                  <div className="text-right">
                      <div className="text-xs text-apex-warning">ELEVATED</div>
                      <div className="text-[10px] text-apex-muted">Threshold &le; 0.60</div>
                  </div>
              </div>
          </Card>
      </div>
    </div>
  );
};