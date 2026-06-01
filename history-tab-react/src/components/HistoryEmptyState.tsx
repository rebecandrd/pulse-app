export function HistoryEmptyState() {
  return (
    <div className="text-center py-10 px-5 text-[--text-muted,#9ca3af] text-[13px]">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-8 h-8 mb-2 opacity-[0.35] mx-auto"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
      <div>No history entries match your filters.</div>
    </div>
  );
}
