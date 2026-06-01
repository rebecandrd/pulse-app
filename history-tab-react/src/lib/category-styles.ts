import type { CategoryType } from "../data/history-data";

// Maps each category type to Tailwind classes that match the original CSS exactly.
// Using arbitrary values to preserve the exact hex colors from the prototype.

export const categoryStyles: Record<CategoryType, string> = {
  "project-update":
    "bg-[#f8fafc] text-[#475569] border border-[#e2e8f0]",
  assignment:
    "bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]",
  "project-review":
    "bg-[#faf5ff] text-[#6d28d9] border border-[#ddd6fe]",
  "effort-review":
    "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]",
  milestone:
    "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]",
  "effort-update":
    "bg-[#fef3c7] text-[#92400e] border border-[#fde68a]",
  credential:
    "bg-[#fff7ed] text-[#9a3412] border border-[#fed7aa]",
  setup:
    "bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]",
  risk:
    "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]",
  dependency:
    "bg-[#f0f9ff] text-[#0c4a6e] border border-[#bae6fd]",
  integration:
    "bg-[#f5f3ff] text-[#5b21b6] border border-[#ddd6fe]",
  deployment:
    "bg-[#ecfdf5] text-[#064e3b] border border-[#6ee7b7]",
  budget:
    "bg-[#fefce8] text-[#713f12] border border-[#fef08a]",
  note:
    "bg-[#f8fafc] text-[#334155] border border-[#cbd5e1]",
  scope:
    "bg-[#fff1f2] text-[#9f1239] border border-[#fecdd3]",
};
