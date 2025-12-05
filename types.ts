export enum Phase {
  DASHBOARD = 'DASHBOARD',
  MARKETS = 'MARKETS',
  FACTORS = 'FACTORS',
  FUSION = 'FUSION',
  EXECUTION = 'EXECUTION',
  PORTFOLIO = 'PORTFOLIO',
  AI = 'AI'
}

export interface NavNode {
  id: Phase;
  label: string;
  icon: any; // Lucide icon component
  shortCode: string;
  status: 'active' | 'pending' | 'locked' | 'complete';
}

export interface Asset {
  ticker: string;
  name: string;
  price: number;
  change: number;
  volatility: number;
}

export interface Algo {
  id: string;
  strategy: string; // e.g., "MeanRev", "Arb"
  status: 'running' | 'paused' | 'stopped';
  pnl: number;
  sharpe: number;
}

export interface Factor {
  name: string; // e.g., "Momentum", "Value"
  exposure: number; // 0-100
  contribution: number; // Basis points
}

export interface Trade {
  id: string;
  asset: string;
  side: 'BUY' | 'SELL';
  size: number;
  price: number;
  timestamp: string;
}

export interface PortfolioMeta {
  totalAum: number;
  dailyPnl: number;
  var95: number; // Value at Risk
  leverage: number;
}