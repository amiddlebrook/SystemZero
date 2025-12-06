import React from 'react';
import { motion } from 'framer-motion';

// Dendritic Tree Data
const TREE = [
    { id: 1, label: 'ROOT_PROCESS', x: 50, y: 0, children: [2, 3] },
    { id: 2, label: 'AUTH_SERVICE', x: 25, y: 33, children: [4, 5] },
    { id: 3, label: 'DATA_LAYER', x: 75, y: 33, children: [6] },
    { id: 4, label: 'TOKEN_VAL', x: 15, y: 66, children: [] },
    { id: 5, label: 'SESSION_MGR', x: 35, y: 66, children: [] },
    { id: 6, label: 'QUERY_EXEC', x: 75, y: 66, children: [7, 8] },
    { id: 7, label: 'CACHE_HIT', x: 65, y: 99, children: [] },
    { id: 8, label: 'DB_FETCH', x: 85, y: 99, children: [] },
];

export const LogicModule: React.FC = () => {
    const MotionDiv = motion.div as any;

  return (
    <div className="h-full w-full relative flex items-center justify-center min-h-[500px]">
        {/* SVG Layer for Dendritic Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {TREE.map(node => (
                node.children.map(childId => {
                    const child = TREE.find(n => n.id === childId);
                    if (!child) return null;
                    return (
                        <motion.line
                            key={`${node.id}-${child.id}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            x1={`${node.x}%`} y1={`${node.y + 5}%`} // +5 to offset from center of node text
                            x2={`${child.x}%`} y2={`${child.y + 5}%`}
                            stroke="#333"
                            strokeWidth="2"
                        />
                    );
                })
            ))}
        </svg>

        {/* Node Layer */}
        {TREE.map((node, i) => (
            <MotionDiv
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y + 5}%` }}
            >
                <div className="bg-sys-surface border border-sys-border px-3 py-2 flex items-center gap-2 shadow-depth hover:border-sys-accent transition-colors cursor-pointer group">
                    <div className="w-2 h-2 bg-sys-dim group-hover:bg-sys-accent" />
                    <span className="text-xs font-mono font-bold text-sys-text">{node.label}</span>
                </div>
            </MotionDiv>
        ))}
    </div>
  );
};