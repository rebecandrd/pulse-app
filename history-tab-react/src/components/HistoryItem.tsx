import type { HistoryEntry } from "../data/history-data";
import { CategoryBadge } from "./CategoryBadge";
import { ScopeIcon } from "./ScopeIcon";
import { DiffBadge } from "./DiffBadge";

interface HistoryItemProps {
  item: HistoryEntry;
}

/**
 * Renders the description line with {object} references highlighted.
 * Text wrapped in {curly braces} in the description is rendered as .hist-obj (accent-colored, font-medium).
 */
function renderDescription(item: HistoryEntry) {
  const parts: React.ReactNode[] = [];
  const desc = item.description;

  // Split on {object} patterns
  const regex = /\{([^}]+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(desc)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      parts.push(desc.slice(lastIndex, match.index));
    }
    // The highlighted object
    parts.push(
      <span key={match.index} className="font-medium text-[--accent,#3b5bdb]">
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < desc.length) {
    parts.push(desc.slice(lastIndex));
  }

  return parts;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const scopeLabel = item.scope === "effort" ? "Effort" : "Project";

  return (
    <div className="flex gap-3 px-4 py-[11px] items-start bg-white border border-[--border,#e5e7eb] rounded-[10px] mb-1 transition-colors hover:border-[--border-strong,#d1d5db]">
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-[1px]"
        style={{ background: item.avatar.bg, color: item.avatar.color }}
      >
        {item.avatar.initials}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Top row: category + scope + time */}
        <div className="flex items-center gap-2 mb-[3px] flex-wrap">
          <CategoryBadge category={item.category} label={item.categoryLabel} />
          <span className="text-[10px] text-[--text-muted,#9ca3af] font-medium shrink-0">
            <ScopeIcon scope={item.scope} />
            {scopeLabel}
          </span>
          <span className="text-[10.5px] text-[--text-muted,#9ca3af] ml-auto shrink-0 whitespace-nowrap">
            {item.time}
          </span>
        </div>

        {/* Description line */}
        <div className="text-[12.5px] text-[--text-primary,#111827] leading-[1.5]">
          <span className="font-semibold">{item.actor}</span>{" "}
          {renderDescription(item)}
          {item.diff && (
            <>
              {" "}
              <DiffBadge diff={item.diff} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
