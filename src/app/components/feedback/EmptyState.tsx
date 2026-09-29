import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = '🔍',
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4 shadow-sm max-w-lg mx-auto my-12">
      {/* Icon / Illustration Placeholder */}
      <div className="w-16 h-16 bg-border/50 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
        {icon}
      </div>

      {/* Text Copy */}
      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted text-sm max-w-sm mx-auto">{description}</p>
      </div>

      {/* Optional Call to Action */}
      {(actionLabel && (actionHref || onAction)) && (
        <div className="pt-2">
          {actionHref ? (
            <Link 
              href={actionHref}
              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {actionLabel}
            </Link>
          ) : (
            <button 
              onClick={onAction}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}