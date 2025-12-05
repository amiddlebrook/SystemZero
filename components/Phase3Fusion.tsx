import React from 'react';
import { Card } from './ui/Card';
import { ArrowRight, Sigma } from 'lucide-react';

export const Phase3Fusion: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      <div className="col-span-12 h-32">
        <Card className="h-full flex items-center justify-around bg-gradient-to-r from-apex-bg to-apex-panel border border-apex-accent/20">
            {/* Step 1 */}
            <div className="text-center">
                <div className="text-xs text-apex-muted mb-1">RAW SIGNAL</div>
                <div className="text-2xl font-mono font-bold text-apex-text">0.72</div>
                <div className="text-[10px] text-apex-muted">Confidence</div>
            </div>
            
            <ArrowRight className="text-apex-muted/30" />
            
            {/* Step 2 */}
            <div className="text-center">
                <div className="text-xs text-apex-muted mb-1">RISK ADJUSTMENT</div>
                <div className="text-2xl font-mono font-bold text-apex-danger">-0.15</div>
                <div className="text-[10px] text-apex-muted">Vol Drag</div>
            </div>

             <ArrowRight className="text-apex-muted/30" />
             
            {/* Step 3 */}
            <div className="text-center">
                <div className="text-xs text-apex-muted mb-1">FINAL SIZE</div>
                <div className="text-3xl font-mono font-bold text-apex-accent">4.5%</div>
                <div className="text-[10px] text-apex-muted">Of AUM</div>
            </div>
        </Card>
      </div>

      <div className="col-span-8">
          <Card title="Bayesian Signal Fusion" className="h-[400px]">
              <table className="w-full text-sm">
                  <thead className="bg-apex-bg/50 text-apex-muted font-mono text-xs uppercase">
                      <tr>
                          <th className="px-4 py-2 text-left">Input Model</th>
                          <th className="px-4 py-2 text-right">Raw Output</th>
                          <th className="px-4 py-2 text-right">Confidence (w)</th>
                          <th className="px-4 py-2 text-right">Net Weight</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-apex-border font-mono text-xs">
                      <tr>
                          <td className="px-4 py-3">Technical (Trend Following)</td>
                          <td className="px-4 py-3 text-right text-apex-success">LONG</td>
                          <td className="px-4 py-3 text-right">0.65</td>
                          <td className="px-4 py-3 text-right text-apex-success">35%</td>
                      </tr>
                      <tr>
                          <td className="px-4 py-3">Fundamental (Earnings Yield)</td>
                          <td className="px-4 py-3 text-right text-apex-success">LONG</td>
                          <td className="px-4 py-3 text-right">0.80</td>
                          <td className="px-4 py-3 text-right text-apex-success">45%</td>
                      </tr>
                      <tr>
                          <td className="px-4 py-3">Sentiment (NLP News)</td>
                          <td className="px-4 py-3 text-right text-apex-danger">SHORT</td>
                          <td className="px-4 py-3 text-right">0.40</td>
                          <td className="px-4 py-3 text-right text-apex-danger">-10%</td>
                      </tr>
                      <tr>
                          <td className="px-4 py-3">Macro (Rate Curve)</td>
                          <td className="px-4 py-3 text-right text-apex-muted">NEUTRAL</td>
                          <td className="px-4 py-3 text-right">0.90</td>
                          <td className="px-4 py-3 text-right text-apex-muted">0%</td>
                      </tr>
                      <tr className="bg-apex-bg/20 font-bold text-apex-text">
                          <td className="px-4 py-4">AGGREGATE SIGNAL</td>
                          <td className="px-4 py-4 text-right"></td>
                          <td className="px-4 py-4 text-right"></td>
                          <td className="px-4 py-4 text-right text-lg text-apex-accent">STRONG BUY</td>
                      </tr>
                  </tbody>
              </table>
          </Card>
      </div>

      <div className="col-span-4 flex flex-col gap-4">
          <Card title="Kelly Criterion & Sizing">
             <div className="p-4 bg-apex-bg/40 rounded border border-apex-border text-center">
                 <div className="text-xs text-apex-muted mb-2">WIN PROBABILITY</div>
                 <div className="text-3xl font-mono font-bold text-white">58.2%</div>
                 <div className="text-xs text-apex-muted mt-1">(Historical)</div>
             </div>
             
             <div className="p-4 bg-apex-bg/40 rounded border border-apex-border text-center mt-4">
                 <div className="text-xs text-apex-muted mb-2">PAYOFF RATIO</div>
                 <div className="text-3xl font-mono font-bold text-apex-accent">1.4:1</div>
                 <div className="text-xs text-apex-muted mt-1">(Reward/Risk)</div>
             </div>

             <div className="mt-4 p-2 bg-blue-900/20 border border-blue-500/50 rounded text-center">
                 <span className="text-blue-400 font-bold font-mono text-sm">OPTIMAL f: 0.28</span>
             </div>
          </Card>
      </div>
    </div>
  );
};