import React from 'react';
import { Card } from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const depthData = [
  { price: 4100, volume: 120 },
  { price: 4102, volume: 200 },
  { price: 4104, volume: 450 },
  { price: 4106, volume: 800 },
  { price: 4108, volume: 1500 }, // Mid
  { price: 4110, volume: 1400 },
  { price: 4112, volume: 600 },
  { price: 4114, volume: 300 },
  { price: 4116, volume: 100 },
];

const spreadData = [
  { exchange: 'NYSE', bid: 4108.05, ask: 4108.10 },
  { exchange: 'NASDAQ', bid: 4108.04, ask: 4108.11 },
  { exchange: 'BATS', bid: 4108.00, ask: 4108.15 },
  { exchange: 'IEX', bid: 4108.02, ask: 4108.12 },
];

export const Phase1Odds: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-8 h-[400px]">
        <Card title="Liquidity Depth Analysis (ES_F)" className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={depthData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="price" stroke="#94A3B8" />
              <YAxis stroke="#E2E8F0" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#151B2B', borderColor: '#2A3447', color: '#E2E8F0' }}
              />
              <Area type="monotone" dataKey="volume" stroke="#3B82F6" fillOpacity={1} fill="url(#colorVol)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="col-span-4 h-[400px]">
        <Card title="NBBO & Venue Pricing" className="h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-apex-muted border-b border-apex-border">
                  <th className="py-2 text-left">Venue</th>
                  <th className="py-2 text-right">Bid</th>
                  <th className="py-2 text-right">Ask</th>
                </tr>
              </thead>
              <tbody>
                {spreadData.map((b, i) => (
                  <tr key={i} className="border-b border-apex-border/50 hover:bg-apex-bg/30">
                    <td className="py-3 text-apex-text">{b.exchange}</td>
                    <td className="py-3 text-right text-apex-success">{b.bid.toFixed(2)}</td>
                    <td className="py-3 text-right text-apex-danger">{b.ask.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-apex-bg/40 border border-apex-border rounded text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-apex-muted">Spread Efficiency</span>
              <span className="text-apex-accent">0.8ms Latency</span>
            </div>
            <div className="w-full bg-apex-bg h-1 rounded overflow-hidden">
                <div className="bg-apex-accent h-full" style={{ width: '85%' }}></div>
            </div>
            <div className="mt-2 text-[10px] text-apex-muted">
                Arbitrage opportunity detected across NASDAQ/IEX.
            </div>
          </div>
        </Card>
      </div>

      <div className="col-span-12">
        <Card className="flex items-center justify-between bg-apex-bg/30">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-apex-success/20 flex items-center justify-center text-apex-success font-bold">
                    Q1
                </div>
                <div>
                    <h4 className="text-sm font-bold text-apex-text">Market Regime: TRENDING</h4>
                    <p className="text-xs text-apex-muted">High liquidity, low slippage environment. Aggressive execution enabled.</p>
                </div>
            </div>
            <button className="bg-apex-accent text-white px-4 py-2 rounded-sm text-xs font-mono font-bold hover:bg-blue-600 transition-colors">
                ANALYZE ALPHA FACTORS
            </button>
        </Card>
      </div>
    </div>
  );
};