import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', headerAction }) => {
  return (
    <div className={`bg-apex-panel border border-apex-border rounded-sm overflow-hidden flex flex-col ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-apex-border flex justify-between items-center bg-apex-bg/50">
          <h3 className="text-sm font-mono font-bold text-apex-accent uppercase tracking-wider">{title}</h3>
          {headerAction}
        </div>
      )}
      <div className="p-4 flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};