import { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ title, children, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col items-center justify-center text-center h-full ${className}`}>
      <h3 className="text-sm font-medium text-muted mb-2">{title}</h3>
      <div className="flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}