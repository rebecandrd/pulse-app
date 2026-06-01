import type { TimeGroup } from "../data/history-data";
import { HistoryItem } from "./HistoryItem";
import { HistoryDayGroup } from "./HistoryDayGroup";

interface HistoryTimeGroupProps {
  group: TimeGroup;
  /** Set of visible item IDs after filtering. If null, all items are visible. */
  visibleIds: Set<string> | null;
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-[13px] h-[13px] opacity-50"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 1.5" />
    </svg>
  );
}

export function HistoryTimeGroup({ group, visibleIds }: HistoryTimeGroupProps) {
  // Check if group has any visible items
  const hasVisibleItems = (() => {
    if (visibleIds === null) return true;
    if (group.items) {
      return group.items.some((item) => visibleIds.has(item.id));
    }
    if (group.days) {
      return group.days.some((day) =>
        day.items.some((item) => visibleIds.has(item.id))
      );
    }
    return false;
  })();

  if (!hasVisibleItems) return null;

  return (
    <div className="mb-7 last:mb-0">
      {/* Time label */}
      <div className="text-[11px] font-semibold uppercase tracking-[0.7px] text-[--text-muted,#9ca3af] pb-[10px] border-b border-[--border,#e5e7eb] mb-[2px] flex items-center gap-2">
        <ClockIcon />
        {group.fullLabel}
      </div>

      {/* Direct items (Today, Yesterday) */}
      {group.items?.map((item) => {
        if (visibleIds !== null && !visibleIds.has(item.id)) return null;
        return <HistoryItem key={item.id} item={item} />;
      })}

      {/* Day groups (Earlier) */}
      {group.days?.map((day) => (
        <HistoryDayGroup key={day.label} day={day} visibleIds={visibleIds} />
      ))}
    </div>
  );
}
