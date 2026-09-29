interface ThemeToggleItemProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggleItem({ isDarkMode, onToggle }: ThemeToggleItemProps) {
  return (
    <div 
      onClick={onToggle}
      className="flex items-center justify-between px-4 py-2.5 text-xs text-foreground hover:bg-border transition-colors cursor-pointer select-none"
    >
      <span className="font-medium flex items-center gap-2">
        {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </span>
      
      {/* Toggle Switch */}
      <div className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-border'}`}>
        <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}