import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, Clock3,
  Download, Globe2, LayoutDashboard, Network, Plus, Radio, RefreshCw,
  Search, Server, ShieldCheck, Target, Trash2, Workflow, X, Zap
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import './styles.css';

type View = 'overview' | 'network' | 'missions' | 'analytics';
type Status = 'queued' | 'active' | 'complete';
type Priority = 'critical' | 'high' | 'normal';
type Mission = {
  id: string;
  title: string;
  owner: string;
  status: Status;
  priority: Priority;
  created: string;
};
type NodeSpec = { id: string; name: string; role: string; segment: string; load: number; x: number; y: number };
type Health = { status: string; service: string; timestamp: string; colo: string; version: string; latency: number };

const STORAGE_KEY = 'systemzero-missions-v2';
const initialMissions: Mission[] = [
  { id: 'SZ-1042', title: 'Validate perimeter sensor coverage', owner: 'Ops Alpha', status: 'active', priority: 'critical', created: '2026-10-14T13:00:00Z' },
  { id: 'SZ-1041', title: 'Review secondary uplink routes', owner: 'Network Team', status: 'active', priority: 'high', created: '2026-10-14T10:00:00Z' },
  { id: 'SZ-1040', title: 'Audit alert escalation playbook', owner: 'Ops Beta', status: 'queued', priority: 'normal', created: '2026-10-13T16:00:00Z' },
  { id: 'SZ-1039', title: 'Verify east relay redundancy', owner: 'Network Team', status: 'complete', priority: 'high', created: '2026-10-12T10:00:00Z' },
  { id: 'SZ-1038', title: 'Reconcile event stream identifiers', owner: 'Ops Alpha', status: 'complete', priority: 'normal', created: '2026-10-11T10:00:00Z' },
  { id: 'SZ-1037', title: 'Prepare resilience drill schedule', owner: 'Ops Beta', status: 'queued', priority: 'normal', created: '2026-10-10T10:00:00Z' }
];

const nodes: NodeSpec[] = [
  { id: 'core', name: 'COMMAND CORE', role: 'Control plane', segment: 'Central', load: 38, x: 49, y: 46 },
  { id: 'edge', name: 'EDGE GATEWAY', role: 'Ingress routing', segment: 'North', load: 72, x: 27, y: 22 },
  { id: 'relay', name: 'RELAY NODE', role: 'Message distribution', segment: 'East', load: 46, x: 78, y: 29 },
  { id: 'sensor', name: 'SENSOR MESH', role: 'Signal collection', segment: 'West', load: 64, x: 16, y: 62 },
  { id: 'archive', name: 'ARCHIVE', role: 'Retention', segment: 'South', load: 28, x: 56, y: 78 },
  { id: 'backup', name: 'FAILOVER', role: 'Standby capacity', segment: 'East', load: 19, x: 84, y: 69 }
];
const links = [['core', 'edge'], ['core', 'relay'], ['core', 'sensor'], ['core', 'archive'], ['core', 'backup'], ['edge', 'sensor'], ['relay', 'backup']];
const views: { id: View; label: string; description: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', description: 'Command center', icon: LayoutDashboard },
  { id: 'network', label: 'Network', description: 'Topology reference', icon: Network },
  { id: 'missions', label: 'Operations', description: 'Local task board', icon: Target },
  { id: 'analytics', label: 'Analytics', description: 'Simulation trends', icon: Activity }
];
const nextStatus: Record<Status, Status> = { queued: 'active', active: 'complete', complete: 'queued' };

function loadMissions(): Mission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialMissions;
    const data: unknown = JSON.parse(raw);
    if (Array.isArray(data) && data.every(item => item && typeof item.id === 'string' && typeof item.title === 'string' && ['queued', 'active', 'complete'].includes(item.status) && ['critical', 'high', 'normal'].includes(item.priority) && typeof item.owner === 'string')) return data as Mission[];
  } catch {
    // Private browsing may prohibit storage; the demo remains usable in memory.
  }
  return initialMissions;
}
function dateLabel(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
function downloadSnapshot(missions: Mission[]) {
  const snapshot = { schema: 'systemzero.snapshot.v1', exportedAt: new Date().toISOString(), mode: 'local-demo', missions };
  const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'systemzero-snapshot.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function Brand() {
  return <div className="brand"><span className="brand-symbol"><Zap size={21} strokeWidth={2.5} /></span><div><strong>SYSTEM<span>ZERO</span></strong><small>OPERATIONS CONSOLE</small></div></div>;
}
function StatusPill({ live }: { live: boolean }) {
  return <span className={'status-pill ' + (live ? 'status-online' : 'status-local')}><span className="status-dot" />{live ? 'EDGE ONLINE' : 'LOCAL PREVIEW'}</span>;
}
function SectionHeading({ eyebrow, title, description, right }: { eyebrow: string; title: string; description: string; right?: React.ReactNode }) {
  return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>{right && <div className="section-actions">{right}</div>}</div>;
}
function Surface({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={'surface ' + className}>{children}</section>;
}
function MiniBars({ values }: { values: number[] }) {
  return <div className="mini-bars" aria-hidden="true">{values.map((value, index) => <i key={index} style={{ height: (Math.max(8, value) + '%') }} />)}</div>;
}
function Metric({ label, value, note, icon: Icon, bars, emphasis = false }: { label: string; value: string; note: string; icon: typeof Activity; bars: number[]; emphasis?: boolean }) {
  return <Surface className={'metric ' + (emphasis ? 'metric-emphasis' : '')}><div className="metric-top"><span>{label}</span><Icon size={17} /></div><div className="metric-value">{value}</div><div className="metric-bottom"><span>{note}</span><MiniBars values={bars} /></div></Surface>;
}

function Overview({ missions, health, onOpenMissions, onRefresh }: { missions: Mission[]; health: Health | null; onOpenMissions: () => void; onRefresh: () => void }) {
  const active = missions.filter(item => item.status === 'active').length;
  const complete = missions.filter(item => item.status === 'complete').length;
  const critical = missions.filter(item => item.priority === 'critical' && item.status !== 'complete').length;
  const recent = missions.slice(0, 4);
  return <>
    <SectionHeading eyebrow="01 / COMMAND OVERVIEW" title="Operational overview" description="A structured workspace for tracking workflows, signals, and system readiness." right={<button className="button button-outline" onClick={() => downloadSnapshot(missions)}><Download size={15} /> Export snapshot</button>} />
    <div className="notice"><ShieldCheck size={17} /><span><strong>Demo workspace.</strong> Operations, topology, and trends are sample data stored in your browser. Only Edge Health reflects a real Cloudflare request.</span></div>
    <div className="metrics-grid">
      <Metric label="TOTAL OPERATIONS" value={String(missions.length).padStart(2, '0')} note="Locally tracked" icon={Target} bars={[34, 47, 58, 42, 68, 72, 82, 72]} emphasis />
      <Metric label="ACTIVE TASKS" value={String(active).padStart(2, '0')} note="Currently in progress" icon={Activity} bars={[28, 45, 52, 38, 60, 48, 71, 64]} />
      <Metric label="COMPLETED" value={String(complete).padStart(2, '0')} note="Marked complete" icon={CheckCircle2} bars={[22, 28, 42, 43, 55, 71, 76, 90]} />
      <Metric label="CRITICAL OPEN" value={String(critical).padStart(2, '0')} note="Needs prioritization" icon={Zap} bars={[20, 25, 14, 39, 25, 55, 48, 33]} />
    </div>
    <div className="content-grid">
      <Surface className="hero-panel">
        <div className="panel-header"><div><div className="eyebrow">SYSTEM STATUS / LIVE</div><h3>Cloudflare edge connection</h3></div><button className="icon-button" onClick={onRefresh} aria-label="Refresh edge health" title="Refresh edge health"><RefreshCw size={17} /></button></div>
        <div className="edge-illustration"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="edge-core"><Globe2 size={43} strokeWidth={1.3} /></div><div className="edge-cross edge-cross-one">+</div><div className="edge-cross edge-cross-two">+</div><div className="edge-cross edge-cross-three">+</div></div>
        <div className="edge-metrics"><div><small>CONNECTION</small><strong>{health ? 'CONNECTED' : 'NOT CONNECTED'}</strong></div><div><small>EDGE LOCATION</small><strong>{health?.colo || '—'}</strong></div><div><small>RESPONSE</small><strong>{health ? String(health.latency) + ' ms' : '—'}</strong></div></div>
        <p className="footnote">{health ? 'Verified via GET /api/health at ' + new Date(health.timestamp).toLocaleTimeString() : 'The Cloudflare health endpoint is unavailable in this preview. Use the deployed Worker for live data.'}</p>
      </Surface>
      <Surface className="recent-panel">
        <div className="panel-header"><div><div className="eyebrow">TASK QUEUE / LOCAL</div><h3>Recent operations</h3></div><button className="text-button" onClick={onOpenMissions}>View all <ArrowRight size={15} /></button></div>
        <div className="recent-list">{recent.length === 0 ? <div className="empty-state">No operations yet. Create one in the Operations tab.</div> : recent.map(item => <div className="recent-row" key={item.id}><div className={'recent-icon priority-' + item.priority}><Target size={17} /></div><div className="recent-details"><strong>{item.title}</strong><span>{item.id} · {item.owner}</span></div><span className={'tag status-' + item.status}>{item.status}</span></div>)}</div>
        <button className="panel-link" onClick={onOpenMissions}>Manage operations <ChevronRight size={16} /></button>
      </Surface>
    </div>
    <div className="bottom-strip"><div><Radio size={16}/><span>EDGE HEALTH</span><strong>{health ? 'RESPONDING' : 'UNVERIFIED'}</strong></div><div><Server size={16}/><span>STORAGE</span><strong>THIS BROWSER</strong></div><div><Clock3 size={16}/><span>SYNC MODE</span><strong>LOCAL ONLY</strong></div></div>
  </>;
}

function Topology({ health }: { health: Health | null }) {
  const [selected, setSelected] = useState('core');
  const node = nodes.find(item => item.id === selected) || nodes[0];
  const nodeById = (id: string) => nodes.find(item => item.id === id) || nodes[0];
  return <>
    <SectionHeading eyebrow="02 / NETWORK MODEL" title="Reference topology" description="Explore a sample control-plane architecture. Nodes are illustrative, not discovered infrastructure." />
    <div className="notice"><Network size={17}/><span><strong>Reference model.</strong> No network discovery or scanning is performed. The actual deployed edge status is shown separately.</span></div>
    <div className="topology-layout">
      <Surface className="topology-panel">
        <div className="panel-header"><div><div className="eyebrow">SYSTEM MAP / SAMPLE</div><h3>Network visualization</h3></div><span className="minor-tag">06 NODES</span></div>
        <div className="topology-canvas">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="topology-lines">{links.map(([a, b]) => { const from = nodeById(a), to = nodeById(b); return <line key={a + b} x1={from.x} y1={from.y} x2={to.x} y2={to.y} vectorEffect="non-scaling-stroke" stroke={selected === a || selected === b ? '#ec855a' : '#39505c'} strokeWidth="1.3" strokeDasharray={selected === a || selected === b ? undefined : '3 5'} opacity={selected === a || selected === b ? 0.8 : 0.5} />; })}</svg>
          {nodes.map(item => <button className={'topology-node ' + (selected === item.id ? 'selected' : '')} key={item.id} style={{ left: item.x + '%', top: item.y + '%' }} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} title={item.name}><span className="node-circle"><Server size={17}/></span><span className="node-caption">{item.name}</span></button>)}
          <div className="topology-coordinate">SYSTEM ZERO / TOPOLOGY 01</div>
        </div>
      </Surface>
      <Surface className="detail-panel">
        <div className="eyebrow">NODE INSPECTOR</div><div className="detail-icon"><Server size={24}/></div><h3>{node.name}</h3><p>{node.role}</p>
        <div className="detail-list"><div><span>IDENTIFIER</span><strong>{node.id.toUpperCase()}</strong></div><div><span>REGION</span><strong>{node.segment}</strong></div><div><span>MODEL LOAD</span><strong>{node.load}%</strong></div><div><span>DATA SOURCE</span><strong>DEMO</strong></div></div>
        <div className="meter-label"><span>Modeled capacity</span><span>{node.load}%</span></div><div className="meter"><div style={{ width: node.load + '%' }}/></div>
        <div className="detail-separator" /><div className="eyebrow">DEPLOYED EDGE / VERIFIED</div><div className="edge-inline"><span className={'status-dot ' + (health ? 'lit' : '')}/><strong>{health ? 'HEALTHY' : 'NOT CONNECTED'}</strong></div><p className="hint">Health responses do not verify the sample nodes above.</p>
      </Surface>
    </div>
  </>;
}

function Operations({ missions, setMissions }: { missions: Mission[]; setMissions: React.Dispatch<React.SetStateAction<Mission[]>> }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const filtered = useMemo(() => missions.filter(item => (filter === 'all' || item.status === filter) && (item.title + ' ' + item.owner + ' ' + item.id).toLowerCase().includes(query.toLowerCase())), [missions, filter, query]);
  function createMission(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    const mission: Mission = { id: 'SZ-' + Date.now().toString(36).toUpperCase(), title: title.trim().slice(0, 140), owner: owner.trim().slice(0, 60) || 'Unassigned', priority, status: 'queued', created: new Date().toISOString() };
    setMissions(current => [mission, ...current]);
    setTitle(''); setOwner(''); setPriority('normal'); setOpen(false); setFilter('all'); setQuery('');
  }
  return <>
    <SectionHeading eyebrow="03 / OPERATIONS" title="Operations board" description="Create, prioritize, and manage work locally. All changes are saved to this browser." right={<><button className="button button-outline" onClick={() => downloadSnapshot(missions)}><Download size={15}/> Export</button><button className="button button-primary" onClick={() => setOpen(true)}><Plus size={16}/> New operation</button></>} />
    <div className="notice"><ShieldCheck size={17}/><span><strong>Browser-local persistence.</strong> Operations are not shared between devices or stored on a remote server.</span></div>
    <Surface className="operations-panel">
      <div className="operations-toolbar"><div className="search-box"><Search size={17}/><input aria-label="Search operations" placeholder="Search operations, IDs, or owners..." value={query} onChange={event => setQuery(event.target.value)}/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}</div><div className="filter-buttons">{(['all', 'queued', 'active', 'complete'] as const).map(value => <button key={value} className={filter === value ? 'filter-active' : ''} onClick={() => setFilter(value)}>{value === 'all' ? 'All tasks' : value}</button>)}</div></div>
      <div className="table-wrap"><table className="operations-table"><thead><tr><th>OPERATION</th><th>PRIORITY</th><th>OWNER</th><th>CREATED</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{filtered.map(item => <tr key={item.id}><td><div className="task-cell"><span className="task-id">{item.id}</span><strong>{item.title}</strong></div></td><td><span className={'priority-label priority-' + item.priority}><span/> {item.priority}</span></td><td>{item.owner}</td><td>{dateLabel(item.created)}</td><td><span className={'tag status-' + item.status}>{item.status}</span></td><td><div className="action-group"><button title="Advance status" aria-label={'Advance ' + item.title + ' status'} onClick={() => setMissions(current => current.map(entry => entry.id === item.id ? { ...entry, status: nextStatus[entry.status] } : entry))}><ArrowRight size={16}/></button><button title="Delete operation" aria-label={'Delete ' + item.title} onClick={() => setMissions(current => current.filter(entry => entry.id !== item.id))}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No matching operations. Change filters or create a new one.</div>}</div>
      <div className="table-footer"><span>SHOWING {filtered.length} OF {missions.length} OPERATIONS</span><button className="text-button" onClick={() => { if (window.confirm('Restore demo operations? This replaces your local task list.')) setMissions(initialMissions); }}>Reset demo data <RefreshCw size={14}/></button></div>
    </Surface>
    {open && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}><form className="modal" onSubmit={createMission} aria-label="Create operation"><div className="modal-top"><div><div className="eyebrow">NEW / OPERATION</div><h3>Create operation</h3></div><button type="button" className="icon-button" aria-label="Close" onClick={() => setOpen(false)}><X size={19}/></button></div><label>OPERATION TITLE<input required autoFocus maxLength={140} value={title} onChange={event => setTitle(event.target.value)} placeholder="Describe the task"/></label><label>OWNER<input maxLength={60} value={owner} onChange={event => setOwner(event.target.value)} placeholder="Team or assignee"/></label><label>PRIORITY<select value={priority} onChange={event => setPriority(event.target.value as Priority)}><option value="normal">Normal</option><option value="high">High</option><option value="critical">Critical</option></select></label><div className="modal-actions"><button className="button button-outline" type="button" onClick={() => setOpen(false)}>Cancel</button><button className="button button-primary" type="submit"><Plus size={16}/> Create operation</button></div></form></div>}
  </>;
}

function Analytics({ missions }: { missions: Mission[] }) {
  const data = useMemo(() => Array.from({ length: 14 }, (_, day) => ({
    day: 'D' + String(day + 1).padStart(2, '0'),
    throughput: Math.round(36 + Math.sin(day * 0.7) * 13 + day * 2.7),
    baseline: Math.round(30 + Math.cos(day * 0.5) * 9 + day * 1.5)
  })), []);
  const counts: Record<Status, number> = { queued: 0, active: 0, complete: 0 };
  missions.forEach(mission => { counts[mission.status] += 1; });
  const denominator = Math.max(1, missions.length);
  return <>
    <SectionHeading eyebrow="04 / ANALYTICS" title="Signal intelligence" description="Illustrative trend data and real counts from your local operations board." />
    <div className="notice"><Activity size={17}/><span><strong>Simulated signal series.</strong> The graph is a deterministic demonstration, not live monitoring or market data.</span></div>
    <div className="analytics-layout">
      <Surface className="chart-panel"><div className="panel-header"><div><div className="eyebrow">TIME SERIES / SIMULATED</div><h3>Signal activity</h3></div><span className="minor-tag">14 INTERVALS</span></div><div className="chart-legend"><span><i className="legend-accent"/> Simulated throughput</span><span><i className="legend-muted"/> Reference baseline</span></div><div className="chart-box"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 15, right: 4, bottom: 0, left: -24 }}><defs><linearGradient id="signal-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f68d61" stopOpacity={0.33}/><stop offset="100%" stopColor="#f68d61" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#233340" strokeDasharray="3 6" vertical={false}/><XAxis dataKey="day" tick={{ fill: '#8595a3', fontSize: 11 }} axisLine={false} tickLine={false}/><YAxis tick={{ fill: '#8595a3', fontSize: 11 }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ background: '#14212b', border: '1px solid #355060', borderRadius: 8, color: '#f0f5f8' }}/><Area type="monotone" dataKey="baseline" stroke="#688398" strokeWidth={2} fill="none" dot={false}/><Area type="monotone" dataKey="throughput" stroke="#f68d61" strokeWidth={3} fill="url(#signal-gradient)" dot={false}/></AreaChart></ResponsiveContainer></div></Surface>
      <Surface className="distribution-panel"><div className="eyebrow">TASK DISTRIBUTION / LOCAL</div><h3>Execution progress</h3><div className="donut" style={{ background: 'conic-gradient(#e98962 0% ' + (counts.complete / denominator * 100) + '%, #64c3ad ' + (counts.complete / denominator * 100) + '% ' + ((counts.complete + counts.active) / denominator * 100) + '%, #425765 ' + ((counts.complete + counts.active) / denominator * 100) + '% 100%)' }}><div><strong>{Math.round(counts.complete / denominator * 100)}%</strong><span>COMPLETE</span></div></div><div className="distribution-list">{(['complete', 'active', 'queued'] as const).map(status => <div key={status}><span className={'distribution-dot distribution-' + status}/><span>{status}</span><strong>{counts[status]}</strong></div>)}</div></Surface>
    </div>
    <div className="insight-grid"><Surface><div className="eyebrow">WORK IN PROGRESS</div><div className="insight-value">{counts.active}</div><p>Operations currently active</p></Surface><Surface><div className="eyebrow">COMPLETION RATE</div><div className="insight-value">{Math.round(counts.complete / denominator * 100)}%</div><p>Based on local task status</p></Surface><Surface><div className="eyebrow">SIMULATION SERIES</div><div className="insight-value">14</div><p>Fixed, reproducible sample points</p></Surface></div>
  </>;
}

export default function App() {
  const [view, setView] = useState<View>('overview');
  const [missions, setMissions] = useState<Mission[]>(loadMissions);
  const [health, setHealth] = useState<Health | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(missions)); } catch { /* Optional persistence */ } }, [missions]);
  useEffect(() => { const interval = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(interval); }, []);
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const start = performance.now();
        const response = await fetch('/api/health', { cache: 'no-store', headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Health check unavailable');
        const data = await response.json() as Omit<Health, 'latency'>;
        if (data.status !== 'ok' || data.service !== 'systemzero-edge') throw new Error('Unexpected health response');
        if (!cancelled) setHealth({ ...data, latency: Math.round(performance.now() - start) });
      } catch { if (!cancelled) setHealth(null); }
    };
    void check();
    const interval = window.setInterval(check, 60000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, [refreshToken]);
  function navigate(destination: View) { setView(destination); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  const title = views.find(item => item.id === view)?.label || 'Overview';
  return <div className="app-shell">
    <aside className={'sidebar ' + (mobileOpen ? 'sidebar-open' : '')}>
      <div className="sidebar-brand"><Brand/><button className="mobile-close icon-button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={19}/></button></div>
      <div className="sidebar-section-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">{views.map(item => { const Icon = item.icon; return <button key={item.id} aria-current={view === item.id ? 'page' : undefined} className={'nav-item ' + (view === item.id ? 'nav-active' : '')} onClick={() => navigate(item.id)}><Icon size={19} /><span><strong>{item.label}</strong><small>{item.description}</small></span>{view === item.id && <span className="nav-active-dot"/>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="sidebar-edge"><div className="eyebrow">DEPLOYMENT HEALTH</div><StatusPill live={!!health}/><small>{health ? 'Cloudflare Worker responding' : 'Awaiting Cloudflare endpoint'}</small></div><div className="sidebar-footer"><span>SYS.ZERO / REV 2.0</span><span>FREE EDITION</span></div></div>
    </aside>
    {mobileOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
    <div className="workspace">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Workflow size={21}/></button><span className="breadcrumb">WORKSPACE</span><ChevronRight size={14}/><strong>{title.toUpperCase()}</strong></div><div className="topbar-right"><span className="clock">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span><span className="topbar-divider"/><StatusPill live={!!health}/><span className="avatar">SZ</span></div></header>
      <main className="main-content"><div className="page-container">
        <div className="page-kicker"><span className="kicker-line"/> SYSTEM ZERO / TACTICAL OPERATIONS <span className="kicker-end">REVISION 02 — CLOUD NATIVE</span></div>
        {view === 'overview' && <Overview missions={missions} health={health} onOpenMissions={() => navigate('missions')} onRefresh={() => setRefreshToken(value => value + 1)}/>}
        {view === 'network' && <Topology health={health}/>}
        {view === 'missions' && <Operations missions={missions} setMissions={setMissions}/>}
        {view === 'analytics' && <Analytics missions={missions}/>}
        <footer className="main-footer"><span>SYSTEM ZERO <span className="muted">/</span> CONTROL INTERFACE</span><span><span className="footer-dot"/> NO PAID SERVICES REQUIRED <ArrowUpRight size={13}/></span></footer>
      </div></main>
    </div>
  </div>;
}
