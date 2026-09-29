'use client';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  onClose: (id: string) => void;
}

const variantStyles: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/80',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: '✓',
    text: 'text-emerald-800 dark:text-emerald-200',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/80',
    border: 'border-red-200 dark:border-red-800',
    icon: '✕',
    text: 'text-red-800 dark:text-red-200',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/80',
    border: 'border-amber-200 dark:border-amber-800',
    icon: '⚠',
    text: 'text-amber-800 dark:text-amber-200',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/80',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'ℹ',
    text: 'text-blue-800 dark:text-blue-200',
  },
};

export default function Toast({ id, type, title, message, onClose }: ToastProps) {
  const style = variantStyles[type];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md w-80 animate-in slide-in-from-bottom-5 duration-300 ${style.bg} ${style.border}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 bg-white/60 dark:bg-black/40 ${style.text}`}>
        {style.icon}
      </div>
      <div className="flex-1">
        <h4 className={`text-xs font-bold ${style.text}`}>{title}</h4>
        <p className="text-xs text-muted mt-0.5">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)}
        className="text-muted hover:text-foreground text-xs p-1"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}