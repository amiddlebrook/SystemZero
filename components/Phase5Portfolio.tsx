import React from 'react';
import { Card } from './ui/Card';
import { AlertTriangle, CheckCircle, Cpu, Layers } from 'lucide-react';

export const Phase5Portfolio: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-12">
        <Card title="Algorithmic Execution Status" className="h-full">
          <div className="grid grid-cols-4 gap-4">
            {/* Algo 1 */}
            <div className="col-span-1 bg-apex-bg border border-apex-accent/50 rounded p-3 relative overflow-hidden group hover:border-apex-accent transition-colors">
              <div className="absolute top-0 right-0 p-1 bg-apex-accent text-white text-[10px] font-bold">
                RUNNING
              </div>
              <h4 className="text-xs text-apex-muted font-mono mb-2">TWAP-EXEC-01</h4>
              <div className="space-y-2 mb-4">
                <div className="text-xs border-l-2 border-apex-success pl-2">
                  <div className="font-bold">AAPL</div>
                  <div className="text-[10px] text-apex-muted">Buy 50,000 shares</div>
                </div>
                <div className="text-xs border-l-2 border-apex-success pl-2">
                  <div className="font-bold">Progress</div>
                  <div className="text-[10px] text-apex-muted">42% Complete</div>
                </div>
              </div>
              <div className="mt-auto pt-2 border-t border-apex-border flex justify-between items-end">
                <span className="text-xs text-apex-muted">Avg Price</span>
                <span className="font-mono font-bold text-lg text-white">182.45</span>
              </div>
            </div>

            {/* Algo 2 */}
            <div className="col-span-1 bg-apex-bg border border-apex-border rounded p-3 relative overflow-hidden hover:border-apex-accent transition-colors">
              <div className="absolute top-0 right-0 p-1 bg-apex-success text-apex-bg text-[10px] font-bold">
                COMPLETE
              </div>
              <h4 className="text-xs text-apex-muted font-mono mb-2">SNIPER-LIQ-09</h4>
              <div className="space-y-2 mb-4">
                <div className="text-xs border-l-2 border-apex-success pl-2">
                  <div className="font-bold">MSFT</div>
                  <div className="text-[10px] text-apex-muted">Sell 10,000 shares</div>
                </div>
                <div className="text-xs border-l-2 border-apex-success pl-2">
                  <div className="font-bold">Slippage</div>
                  <div className="text-[10px] text-apex-success">-0.2 bps</div>
                </div>
              </div>
              <div className="mt-auto pt-2 border-t border-apex-border flex justify-between items-end">
                <span className="text-xs text-apex-muted">Realized P&L</span>
                <span className="font-mono font-bold text-lg text-apex-success">+$2.1K</span>
              </div>
            </div>

             {/* Algo 3 - Paused */}
             <div className="col-span-1 bg-apex-warning/10 border border-apex-warning/30 rounded p-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 bg-apex-warning text-white text-[10px] font-bold">
                PAUSED
              </div>
              <h4 className="text-xs text-apex-muted font-mono mb-2">ICEBERG-03</h4>
              <div className="space-y-2 mb-4 text-apex-muted">
                 <div className="text-xs pl-2">NVDA (Buy)</div>
                 <div className="text-xs pl-2">Limit Limit 450.00</div>
              </div>
              <div className="mt-auto pt-2 border-t border-apex-warning/30 text-center">
                  <span className="text-[10px] text-apex-warning font-mono">PRICE DEVIATION > 2%</span>
              </div>
            </div>

             {/* Stats */}
             <div className="col-span-1 bg-apex-bg/20 border border-dashed border-apex-border rounded p-3 flex flex-col items-center justify-center">
                 <div className="text-apex-muted text-xs mb-2">DAILY FILL RATE</div>
                 <div className="text-3xl font-bold text-white font-mono">98.4%</div>
                 <div className="text-apex-success text-xs mt-1">High Quality</div>
             </div>
          </div>
        </Card>
      </div>
      
      {/* Portfolio Composition */}
      <div className="col-span-12 h-40">
          <Card className="h-full bg-apex-bg flex flex-row items-center justify-between px-8">
             <div>
                 <h3 className="text-sm font-bold text-apex-text mb-2">Risk Limits & Controls</h3>
                 <div className="flex gap-6">
                     <div className="flex items-center gap-2 text-apex-success text-xs font-mono">
                         <CheckCircle size={14} /> Gross Leverage (2.4x)
                     </div>
                     <div className="flex items-center gap-2 text-apex-success text-xs font-mono">
                         <CheckCircle size={14} /> Concentration Limit (5%)
                     </div>
                     <div className="flex items-center gap-2 text-apex-warning text-xs font-mono">
                         <AlertTriangle size={14} /> Gamma Exposure
                     </div>
                 </div>
             </div>
             
             <div className="text-right flex gap-8">
                 <div>
                    <div className="text-xs text-apex-muted mb-1">LONG EXP</div>
                    <div className="text-2xl font-bold font-mono text-apex-success">$24.2M</div>
                 </div>
                 <div>
                    <div className="text-xs text-apex-muted mb-1">SHORT EXP</div>
                    <div className="text-2xl font-bold font-mono text-apex-danger">-$18.3M</div>
                 </div>
                 <div>
                    <div className="text-xs text-apex-muted mb-1">NET</div>
                    <div className="text-2xl font-bold font-mono text-white">$5.9M</div>
                 </div>
             </div>
          </Card>
      </div>
    </div>
  );
};