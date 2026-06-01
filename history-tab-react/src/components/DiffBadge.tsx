import type { DiffValue } from "../data/history-data";

interface DiffBadgeProps {
  diff: DiffValue;
}

export function DiffBadge({ diff }: DiffBadgeProps) {
  return (
    <span className="inline-flex items-center gap-0 ml-[2px] align-baseline">
      <span className="text-[11.5px] font-medium text-[#991b1b] bg-[#fef2f2] px-[7px] py-[1px] rounded-l-[3px] border border-[#fecaca] line-through">
        {diff.old}
      </span>
      <span className="text-[10px] text-[--text-muted,#9ca3af] px-[4px] py-[1px] bg-[--bg-surface,#f5f6f8] border-t border-b border-[--border,#e5e7eb] leading-none flex items-center">
        →
      </span>
      <span className="text-[11.5px] font-medium text-[#065f46] bg-[#ecfdf5] px-[7px] py-[1px] rounded-r-[3px] border border-[#a7f3d0]">
        {diff.new}
      </span>
    </span>
  );
}
