import type { DayGroup } from "../data/history-data";
import { HistoryItem } from "./HistoryItem";

interface HistoryDayGroupProps {
  day: DayGroup;
  visibleIds: Set<string> | null;
}

export function HistoryDayGroup({ day, visibleIds }: HistoryDayGroupProps) {
  const visibleItems = visibleIds
    ? day.items.filter((item) => visibleIds.has(item.id))
    : day.items;

  if (visibleItems.length === 0) return null;

  return (
    <div className="mb-1">
      <div className="text-[11.5px] font-medium text-[--text-secondary,#6b7280] py-[10px] pb-[6px]">
        {day.label}
      </div>
      {visibleItems.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
