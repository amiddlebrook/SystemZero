import React from 'react';
import { Card } from './ui/Card';
import { Activity, Clock, Globe, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const marketStatus = {
    session: "NY-LND OVERLAP",
    volatility: "HIGH (VIX 22.4)",
    liquidity: "DEEP",
    time: "09:42:15 EST"
  };

  const performanceMetrics = [
    { label: "Daily P&L", value: "+$1.24M", status: "good" },
    { label: "Sharpe (Roll)", value: "2.84", status: "good" },
    { label: "Exp. Shortfall", value: "-0.45%", status: "neutral" },
    { label: "Gross Exp.", value: "$42.5M", status: "good" },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Event Header */}
      <div className="col-span-12">
        <Card className="h-full bg-gradient-to-r from-apex-panel to-apex-bg border-l-4 border-l-apex-accent">
          <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold font-sans text-white mb-2">Alpha-One Omni Fund</h1>
                <div className="flex space-x-6 text-apex-muted text-sm font-mono">
                    <span className="flex items-center gap-2"><Globe size={14} /> {marketStatus.session}</span>
                    <span className="flex items-center gap-2"><Activity size={14} /> {marketStatus.volatility}</span>
                    <span className="flex items-center gap-2"><Clock size={14} /> {marketStatus.time}</span>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-apex-muted mb-1">RISK GATEWAY</div>
                <div className="text-apex-success font-mono font-bold flex items-center gap-2">
                    <ShieldCheck size={16} />
                    AUTHORIZED
                </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Validation Metrics */}
      <div className="col-span-4 h-64">
        <Card title="Live Performance Metrics" className="h-full">
            <div className="grid grid-cols-2 gap-4">
                {performanceMetrics.map((m, i) => (
                    <div key={i} className="p-3 bg-apex-bg/40 rounded border border-apex-border">
                        <div className="text-xs text-apex-muted uppercase mb-1">{m.label}</div>
                        <div className={`text-xl font-mono font-bold ${m.status === 'good' ? 'text-apex-success' : m.status === 'neutral' ? 'text-apex-warning' : 'text-apex-danger'}`}>
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>

      {/* Algo List */}
      <div className="col-span-8 h-64">
        <Card title="Active Algorithms" className="h-full">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-apex-muted uppercase bg-apex-bg/50 font-mono">
                    <tr>
                        <th className="px-4 py-2">Strategy ID</th>
                        <th className="px-4 py-2">Target Asset</th>
                        <th className="px-4 py-2">Signal Strength</th>
                        <th className="px-4 py-2 text-right">Net Exposure</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-apex-border">
                    <tr className="hover:bg-apex-bg/30">
                        <td className="px-4 py-3 font-mono text-xs text-apex-accent">STAT-ARB-04</td>
                        <td className="px-4 py-3 font-bold">ES_F / NQ_F</td>
                        <td className="px-4 py-3 text-apex-success">STRONG BUY (+0.84)</td>
                        <td className="px-4 py-3 text-right font-mono">$4.2M</td>
                    </tr>
                    <tr className="hover:bg-apex-bg/30">
                        <td className="px-4 py-3 font-mono text-xs text-apex-accent">MEAN-REV-22</td>
                        <td className="px-4 py-3 font-bold">EURUSD</td>
                        <td className="px-4 py-3 text-apex-warning">NEUTRAL (-0.12)</td>
                        <td className="px-4 py-3 text-right font-mono">$1.1M</td>
                    </tr>
                    <tr className="hover:bg-apex-bg/30">
                        <td className="px-4 py-3 font-mono text-xs text-apex-accent">VOL-CARRY-09</td>
                        <td className="px-4 py-3 font-bold">VIX Futures</td>
                        <td className="px-4 py-3 text-apex-danger">SELL (-0.65)</td>
                        <td className="px-4 py-3 text-right font-mono">-$2.5M</td>
                    </tr>
                </tbody>
            </table>
        </Card>
      </div>
      
      {/* System Log */}
      <div className="col-span-12 h-64">
          <Card title="System Execution Log" className="h-full">
              <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-3 text-apex-muted">
                      <span className="text-apex-accent">[09:42:11]</span>
                      <span>Latency Spike detected on venue BATS. Rerouting to IEX.</span>
                      <span className="ml-auto opacity-50">NET_OK</span>
                  </div>
                  <div className="flex items-center gap-3 text-apex-muted">
                      <span className="text-apex-accent">[09:41:55]</span>
                      <span>Order #9921 filled: BUY 500 TSLA @ 241.50 (VWAP Execution).</span>
                      <span className="ml-auto opacity-50 text-apex-success">FILL</span>
                  </div>
                  <div className="flex items-center gap-3 text-apex-muted">
                      <span className="text-apex-accent">[09:41:00]</span>
                      <span>Risk Model updated covariance matrix. VaR recalculating...</span>
                      <span className="ml-auto opacity-50">SYS</span>
                  </div>
                  <div className="flex items-center gap-3 text-apex-muted">
                      <span className="text-apex-accent">[09:40:22]</span>
                      <span>Analyst adjustment: Reduced max position size for Tech Sector to 4%.</span>
                      <span className="ml-auto opacity-50 text-apex-warning">MANUAL</span>
                  </div>
              </div>
          </Card>
      </div>
    </div>
  );
};