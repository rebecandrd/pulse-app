import { typeOptions, userOptions, dateOptions } from "../data/history-data";

interface HistoryFiltersProps {
  search: string;
  type: string;
  user: string;
  date: string;
  shownCount: number;
  totalCount: number;
  hasFilter: boolean;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onUserChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onClear: () => void;
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="absolute left-[9px] top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-[--text-muted,#9ca3af] pointer-events-none"
    >
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" />
    </svg>
  );
}

const selectClass =
  "appearance-none px-[10px] py-[6px] pr-[26px] border border-[--border,#e5e7eb] rounded-[8px] text-xs font-[var(--font,'DM_Sans',system-ui,sans-serif)] text-[--text-secondary,#6b7280] bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22><path d=%221 1l4 4 4-4%22 fill=%22none%22 stroke=%22%239ca3af%22 stroke-width=%221.3%22/></svg>')] bg-[length:10px_6px] bg-[right_8px_center] bg-no-repeat outline-none transition-colors focus:border-[--accent,#3b5bdb] cursor-pointer";

export function HistoryFilters({
  search,
  type,
  user,
  date,
  shownCount,
  totalCount,
  hasFilter,
  onSearchChange,
  onTypeChange,
  onUserChange,
  onDateChange,
  onClear,
}: HistoryFiltersProps) {
  return (
    <div className="flex gap-2 items-center px-7 pt-4 pb-0 mb-1 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[160px] max-w-[260px]">
        <SearchIcon />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search history\u2026"
          className="w-full py-[6px] pl-7 pr-[10px] border border-[--border,#e5e7eb] rounded-[8px] text-xs font-[var(--font,'DM_Sans',system-ui,sans-serif)] text-[--text-primary,#111827] bg-white outline-none transition-colors focus:border-[--accent,#3b5bdb] placeholder:text-[--text-muted,#9ca3af]"
        />
      </div>

      {/* Type select */}
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All types</option>
        {typeOptions.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* User select */}
      <select
        value={user}
        onChange={(e) => onUserChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All users</option>
        {userOptions.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      {/* Date select */}
      <select
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        className={selectClass}
      >
        <option value="">All dates</option>
        {dateOptions.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {/* Active filter info */}
      <div className="flex gap-1 items-center ml-auto">
        {hasFilter && (
          <span className="text-[11px] text-[--text-muted,#9ca3af] whitespace-nowrap">
            {shownCount} of {totalCount}
          </span>
        )}
        {hasFilter && (
          <button
            onClick={onClear}
            className="text-[11px] text-[--text-muted,#9ca3af] cursor-pointer px-2 py-1 border border-[--border,#e5e7eb] rounded-[8px] bg-white font-[var(--font,'DM_Sans',system-ui,sans-serif)] transition-all hover:text-[--error,#ef4444] hover:border-[--error-border,#fca5a5]"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
