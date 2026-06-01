"use client";

import { useState, useMemo, useCallback } from "react";
import {
  historyData,
  type HistoryEntry,
  type TimeGroup,
} from "../data/history-data";
import { HistoryFilters } from "./HistoryFilters";
import { HistoryTimeGroup } from "./HistoryTimeGroup";
import { HistoryEmptyState } from "./HistoryEmptyState";

// ─── Date period helpers ──────────────────────────────────────────────────
// Mirrors the buildHistDateMap() logic from project-detail.html

const REFERENCE_DATE = new Date("2026-03-31");

function getItemPeriod(
  groupLabel: string,
  dayLabel?: string
): { period: string; daysAgo: number } {
  const lower = groupLabel.toLowerCase();
  if (lower.includes("today")) return { period: "today", daysAgo: 0 };
  if (lower.includes("yesterday")) return { period: "yesterday", daysAgo: 1 };

  // Earlier group — compute from day label
  if (dayLabel) {
    const d = new Date(dayLabel);
    const daysAgo = Math.floor(
      (REFERENCE_DATE.getTime() - d.getTime()) / 86400000
    );
    return { period: "earlier", daysAgo };
  }

  return { period: "earlier", daysAgo: 999 };
}

// ─── Flatten all items for counting/filtering ─────────────────────────────

interface FlatItem {
  item: HistoryEntry;
  period: string;
  daysAgo: number;
}

function flattenItems(groups: TimeGroup[]): FlatItem[] {
  const result: FlatItem[] = [];

  for (const group of groups) {
    if (group.items) {
      for (const item of group.items) {
        const { period, daysAgo } = getItemPeriod(group.fullLabel);
        result.push({ item, period, daysAgo });
      }
    }
    if (group.days) {
      for (const day of group.days) {
        for (const item of day.items) {
          const { period, daysAgo } = getItemPeriod(group.fullLabel, day.label);
          result.push({ item, period, daysAgo });
        }
      }
    }
  }

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────

export function HistoryTab() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [user, setUser] = useState("");
  const [date, setDate] = useState("");

  const flatItems = useMemo(() => flattenItems(historyData), []);

  const hasFilter = !!(search || type || user || date);

  // Filter and compute visible IDs
  const { visibleIds, shownCount } = useMemo(() => {
    if (!hasFilter) {
      return { visibleIds: null, shownCount: flatItems.length };
    }

    const q = search.toLowerCase().trim();
    const visible = new Set<string>();

    for (const { item, period, daysAgo } of flatItems) {
      let show = true;

      // Search filter — match against description + actor + category label
      if (q) {
        const text = `${item.actor} ${item.categoryLabel} ${item.description} ${item.objects?.join(" ") || ""} ${item.diff ? `${item.diff.old} ${item.diff.new}` : ""}`.toLowerCase();
        if (!text.includes(q)) show = false;
      }

      // Type filter — match category label (partial match for Risk)
      if (show && type) {
        if (type === "Risk") {
          if (!item.categoryLabel.includes("Risk")) show = false;
        } else {
          if (item.categoryLabel !== type) show = false;
        }
      }

      // User filter — match actor name
      if (show && user) {
        if (item.actor !== user) show = false;
      }

      // Date filter
      if (show && date) {
        if (date === "today" && period !== "today") show = false;
        if (date === "yesterday" && period !== "yesterday") show = false;
        if (date === "week") {
          if (period === "earlier" && daysAgo > 7) show = false;
        }
        if (date === "month") {
          if (period === "earlier" && daysAgo > 30) show = false;
        }
      }

      if (show) visible.add(item.id);
    }

    return { visibleIds: visible, shownCount: visible.size };
  }, [search, type, user, date, flatItems, hasFilter]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setType("");
    setUser("");
    setDate("");
  }, []);

  return (
    <div>
      <HistoryFilters
        search={search}
        type={type}
        user={user}
        date={date}
        shownCount={shownCount}
        totalCount={flatItems.length}
        hasFilter={hasFilter}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onUserChange={setUser}
        onDateChange={setDate}
        onClear={clearFilters}
      />

      {hasFilter && shownCount === 0 ? (
        <HistoryEmptyState />
      ) : (
        <div className="px-7 py-6 overflow-y-auto max-h-[calc(1024px-46px-100px-42px)]">
          {historyData.map((group) => (
            <HistoryTimeGroup
              key={group.label}
              group={group}
              visibleIds={visibleIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
