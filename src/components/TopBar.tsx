import { Plus } from 'lucide-react';

export type ActiveTab = 'quarantine' | 'stock' | 'logs';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  quarantineCount: number;
  inStockCount: number;
  logCount: number;
  onAddSampleConflict: () => void;
}

export function TopBar({
  activeTab,
  onSelectTab,
  quarantineCount,
  inStockCount,
  logCount,
  onAddSampleConflict,
}: TopBarProps) {
  const navItems: Array<{ id: ActiveTab; label: string; count: number }> = [
    { id: 'quarantine', label: 'Quarantine Queue', count: quarantineCount },
    { id: 'stock', label: 'Serialized Stock', count: inStockCount },
    { id: 'logs', label: 'Resolution Log', count: logCount },
  ];

  return (
    <header className="bg-white border-b border-slate-200 shrink-0">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center shrink-0">
          <span className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Meridian Sync
          </span>
        </div>

        <nav
          aria-label="Workspace navigation"
          className="hidden md:flex items-center gap-6 h-full"
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`h-full inline-flex items-center gap-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  active
                    ? 'border-blue-600 text-slate-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  ({item.count})
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onAddSampleConflict}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Plus size={14} aria-hidden="true" />
            <span>Add Test Conflict</span>
          </button>
        </div>
      </div>

      <nav
        aria-label="Mobile workspace navigation"
        className="flex md:hidden items-center border-t border-slate-100 px-3 overflow-x-auto gap-4"
      >
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`py-2.5 inline-flex items-center gap-1.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'border-blue-600 text-slate-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{item.label}</span>
              <span className="font-mono text-[11px] tabular-nums text-slate-500">
                ({item.count})
              </span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
