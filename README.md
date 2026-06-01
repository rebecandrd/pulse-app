# Pulse — Project Management App

A production-grade SaaS project management UI built with pure HTML, CSS, and vanilla JS.

## Project Structure

```
pulse-app/
├── css/
│   └── pulse.css          ← Shared design system (tokens, sidebar, topbar, components)
├── js/
│   └── pulse.js           ← Shared utilities (navigation, tag inputs, kanban DnD, toast)
├── index.html             ← Dashboard (PM / Developer / Designer / QA role switcher)
├── projects.html          ← Current Projects (card grid + table view, search & filter)
├── project-detail.html    ← Project Detail (Overview tab + Efforts Kanban board)
├── new-project.html       ← New Project Wizard (5-step guided form)
└── README.md              ← This file
```

## Pages

### `index.html` — Dashboard
Role-based dashboard with a CSS-only switcher (no JS required for role switching).
- **PM**: KPI cards, projects health table, recent activity, pending reviews, team workload
- **Developer**: Per-project tabs with KPI strip + live Kanban board (drag-and-drop)
- **Designer**: Design-focused KPI strip + project tabs
- **QA**: Alert bar, test pass/fail stats, QA task queue

### `projects.html` — Current Projects
Workspace view for all assigned projects.
- Card grid (3 columns) with status badges, progress bars, team avatars, task counts
- Table view with sortable columns
- Live search + status/role filter dropdowns
- "New Project" button → `new-project.html`
- Project cards → `project-detail.html`

### `project-detail.html` — Project Detail
Full project view with tab navigation.
- **Overview tab**: KPI cards, project info, work summary, recent activity, team members
- **Efforts tab**: Full Kanban board with 5 columns, drag-and-drop, blocked card highlighting

### `new-project.html` — New Project Wizard
5-step guided project creation flow (no scroll, wizard pattern).
1. Basic info (name, org, type, summary)
2. Project setup (type selector → dynamic team roles + hours, user assignment)
3. Timeline (start/end dates, sprint settings)
4. Tags & platforms (tag inputs with suggestions)
5. Review & confirm (editable summary → creates project → redirects to `projects.html`)

## Design System

All shared styles live in `css/pulse.css`:
- CSS custom properties (design tokens)
- Sidebar + topbar
- Buttons, badges, avatars, progress bars
- Kanban board components
- KPI cards, project cards
- Form elements (inputs, selects, tag inputs)
- Data tables
- Activity & review lists

## Tech Stack

- **HTML5** — semantic, no framework
- **CSS3** — custom properties, grid, flexbox, CSS-only role switching (radio + `~` sibling selectors)
- **Vanilla JS** — minimal, no dependencies
- **DM Sans + DM Mono** — Google Fonts

## Getting Started

Open `index.html` in a browser. No build step, no server required.

> **Note**: Pages are designed at 1440×1024px viewport. For best results, open in a browser at full width or use browser zoom.

## Navigation Flow

```
index.html (Dashboard)
    └── projects.html (All Projects)
            ├── project-detail.html (Project Detail / Kanban)
            └── new-project.html (Create Project)
                    └── projects.html (on success)
```
