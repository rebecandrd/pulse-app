import { HistoryTab } from "./components";

/**
 * Standalone preview wrapper for the History tab.
 * In production, <HistoryTab /> would be rendered inside the
 * project-detail page's tab-panel container instead.
 */
export default function App() {
  return (
    <div
      className="min-h-screen bg-[#f5f6f8] font-['DM_Sans',system-ui,sans-serif] text-[#111827]"
      style={
        {
          "--font": "'DM Sans', system-ui, sans-serif",
          "--font-mono": "'DM Mono', monospace",
          "--bg-white": "#ffffff",
          "--bg-surface": "#f5f6f8",
          "--bg-surface2": "#ebebee",
          "--text-primary": "#111827",
          "--text-secondary": "#6b7280",
          "--text-muted": "#9ca3af",
          "--border": "#e5e7eb",
          "--border-strong": "#d1d5db",
          "--accent": "#3b5bdb",
          "--accent-hover": "#2f4ac4",
          "--accent-light": "#eef2ff",
          "--accent-border": "#c5cffa",
          "--error": "#ef4444",
          "--error-border": "#fca5a5",
          "--radius-sm": "6px",
          "--radius-md": "8px",
          "--radius-lg": "10px",
          "--radius-xl": "12px",
        } as React.CSSProperties
      }
    >
      {/* Simulated page shell */}
      <div className="max-w-[1200px] mx-auto py-8">
        {/* Tab header (preview only) */}
        <div className="bg-white border border-[#e5e7eb] rounded-t-xl px-7 py-3 border-b-0">
          <div className="flex gap-6 text-[13px] font-medium text-[#6b7280]">
            <span className="opacity-50 cursor-pointer">Overview</span>
            <span className="opacity-50 cursor-pointer">Details</span>
            <span className="opacity-50 cursor-pointer">Efforts</span>
            <span className="opacity-50 cursor-pointer">Milestones</span>
            <span className="opacity-50 cursor-pointer">Reviews</span>
            <span className="opacity-50 cursor-pointer">Team</span>
            <span className="opacity-50 cursor-pointer">Notes</span>
            <span className="opacity-50 cursor-pointer">Reports</span>
            <span className="text-[#3b5bdb] border-b-2 border-[#3b5bdb] pb-[11px] cursor-pointer">
              History
            </span>
          </div>
        </div>

        {/* History tab content */}
        <div className="bg-white border border-[#e5e7eb] rounded-b-xl">
          <HistoryTab />
        </div>
      </div>
    </div>
  );
}
