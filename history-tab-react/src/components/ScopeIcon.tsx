import type { ScopeType } from "../data/history-data";

interface ScopeIconProps {
  scope: ScopeType;
}

export function ScopeIcon({ scope }: ScopeIconProps) {
  if (scope === "effort") {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-[10px] h-[10px] align-[-1px] mr-[2px] opacity-50 inline"
      >
        <rect x="2" y="3" width="12" height="10" rx="2" />
        <path d="M5 7h6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="w-[10px] h-[10px] align-[-1px] mr-[2px] opacity-50 inline"
    >
      <path d="M2 4h12M2 8h12M2 12h8" />
    </svg>
  );
}
