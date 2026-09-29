interface BadgeProps {
  variant?: 'active' | 'pending' | 'archived' | 'success' | 'error' | 'default';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    active: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    archived: 'bg-border text-muted border-border',
    default: 'bg-border/50 text-foreground border-border',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}