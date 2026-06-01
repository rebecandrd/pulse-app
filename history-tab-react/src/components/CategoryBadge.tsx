import type { CategoryType } from "../data/history-data";
import { categoryStyles } from "../lib/category-styles";

interface CategoryBadgeProps {
  category: CategoryType;
  label: string;
}

export function CategoryBadge({ category, label }: CategoryBadgeProps) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-[0.4px] px-[7px] py-[2px] rounded-[4px] shrink-0 ${categoryStyles[category]}`}
    >
      {label}
    </span>
  );
}
