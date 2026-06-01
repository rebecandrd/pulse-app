// ─── History Data ──────────────────────────────────────────────────────────
// Complete dataset extracted from project-detail.html History tab

export type CategoryType =
  | "project-update"
  | "effort-update"
  | "effort-review"
  | "project-review"
  | "assignment"
  | "credential"
  | "milestone"
  | "deployment"
  | "risk"
  | "scope"
  | "budget"
  | "dependency"
  | "integration"
  | "note"
  | "setup";

export type ScopeType = "project" | "effort";

export interface DiffValue {
  old: string;
  new: string;
}

export interface HistoryEntry {
  id: string;
  avatar: { initials: string; bg: string; color: string };
  category: CategoryType;
  categoryLabel: string;
  scope: ScopeType;
  time: string;
  actor: string;
  description: string;
  objects?: string[];
  diff?: DiffValue;
}

export interface DayGroup {
  label: string;
  items: HistoryEntry[];
}

export interface TimeGroup {
  label: string;
  fullLabel: string;
  days?: DayGroup[];
  items?: HistoryEntry[];
}

// ─── Avatar presets ────────────────────────────────────────────────────────
const AV = {
  LM: { initials: "LM", bg: "#fde8d8", color: "#b45309" },
  SK: { initials: "SK", bg: "#e8f4fd", color: "#1d5fa6" },
  DR: { initials: "DR", bg: "#f5eeff", color: "#6d28d9" },
  RN_red: { initials: "RN", bg: "#fef2f2", color: "#991b1b" },
  RN_yellow: { initials: "RN", bg: "#fef9c3", color: "#854d0e" },
  AK: { initials: "AK", bg: "#f0fdf4", color: "#15803d" },
} as const;

// ─── Complete history items ────────────────────────────────────────────────

export const historyData: TimeGroup[] = [
  {
    label: "Today",
    fullLabel: "Today \u00b7 March 31, 2026",
    items: [
      {
        id: "t1",
        avatar: AV.LM,
        category: "project-update",
        categoryLabel: "Project Update",
        scope: "project",
        time: "4:12 PM",
        actor: "Lucas Martin",
        description: "changed project type",
        diff: { old: "Fulfillment", new: "Maintenance" },
      },
      {
        id: "t2",
        avatar: AV.SK,
        category: "effort-update",
        categoryLabel: "Effort Update",
        scope: "effort",
        time: "3:28 PM",
        actor: "Sarah Kim",
        description: "moved",
        objects: ["TAPP-089 \u00b7 Refactor auth token handler"],
        diff: { old: "Review", new: "Done" },
      },
      {
        id: "t3",
        avatar: AV.RN_red,
        category: "risk",
        categoryLabel: "Risk Flagged",
        scope: "project",
        time: "3:10 PM",
        actor: "Ravi Nair",
        description:
          "escalated risk on {Third-party payment SDK update} \u2014 vendor deprecating v2 API by Apr 15, migration incomplete",
        objects: ["Third-party payment SDK update"],
      },
      {
        id: "t4",
        avatar: AV.LM,
        category: "credential",
        categoryLabel: "Credential Update",
        scope: "project",
        time: "2:55 PM",
        actor: "Lucas Martin",
        description:
          "marked {SendGrid Email Service} as outdated \u2014 key last verified Oct 2025, account owner left the team",
        objects: ["SendGrid Email Service"],
      },
      {
        id: "t5",
        avatar: AV.DR,
        category: "deployment",
        categoryLabel: "Deployment",
        scope: "project",
        time: "2:20 PM",
        actor: "Daniel Reyes",
        description:
          "deployed {v2.4.1-rc.3} to staging \u2014 includes auth token handler fix and session persistence patch",
        objects: ["v2.4.1-rc.3"],
      },
      {
        id: "t6",
        avatar: AV.LM,
        category: "project-review",
        categoryLabel: "Project Review",
        scope: "project",
        time: "1:30 PM",
        actor: "Lucas Martin",
        description: "completed temperature review \u2014 Temperature:",
        diff: { old: "Stable", new: "Fair" },
      },
      {
        id: "t7",
        avatar: AV.SK,
        category: "scope",
        categoryLabel: "Scope Change",
        scope: "effort",
        time: "12:45 PM",
        actor: "Sarah Kim",
        description:
          "split {TAPP-087 \u00b7 Notification preferences UI} into 3 sub-efforts \u2014 mobile, web, email digest",
        objects: ["TAPP-087 \u00b7 Notification preferences UI"],
      },
      {
        id: "t8",
        avatar: AV.LM,
        category: "effort-update",
        categoryLabel: "Effort Update",
        scope: "effort",
        time: "11:08 AM",
        actor: "Lucas Martin",
        description:
          "updated acceptance threshold on {TAPP-091 \u00b7 Push notification delivery rate}",
        objects: ["TAPP-091 \u00b7 Push notification delivery rate"],
        diff: { old: "95%", new: "98%" },
      },
      {
        id: "t9",
        avatar: AV.RN_yellow,
        category: "dependency",
        categoryLabel: "Dependency",
        scope: "effort",
        time: "10:32 AM",
        actor: "Ravi Nair",
        description:
          "linked {TAPP-094} as dependency of {TAPP-091} \u2014 analytics schema required before push notification tracking",
        objects: ["TAPP-094", "TAPP-091"],
      },
      {
        id: "t10",
        avatar: AV.AK,
        category: "assignment",
        categoryLabel: "Assignment Change",
        scope: "effort",
        time: "9:55 AM",
        actor: "Anika Kapoor",
        description: "assigned {TAPP-094 \u00b7 Analytics event schema v2} \u2014 Dev:",
        objects: ["TAPP-094 \u00b7 Analytics event schema v2"],
        diff: { old: "none", new: "Daniel Reyes" },
      },
      {
        id: "t11",
        avatar: AV.SK,
        category: "effort-update",
        categoryLabel: "Effort Update",
        scope: "effort",
        time: "9:20 AM",
        actor: "Sarah Kim",
        description:
          "changed priority on {TAPP-041 \u00b7 Design system tokens migration}",
        objects: ["TAPP-041 \u00b7 Design system tokens migration"],
        diff: { old: "Medium", new: "High" },
      },
      {
        id: "t12",
        avatar: AV.LM,
        category: "note",
        categoryLabel: "Note",
        scope: "project",
        time: "8:45 AM",
        actor: "Lucas Martin",
        description:
          'added standup note \u2014 "Client demo moved to Friday. Need staging deploy stable by Thursday EOD."',
      },
    ],
  },
  {
    label: "Yesterday",
    fullLabel: "Yesterday \u00b7 March 30, 2026",
    items: [
      {
        id: "y1",
        avatar: AV.LM,
        category: "project-update",
        categoryLabel: "Project Update",
        scope: "project",
        time: "5:05 PM",
        actor: "Lucas Martin",
        description: "changed project status",
        diff: { old: "On Track", new: "At Risk" },
      },
      {
        id: "y2",
        avatar: AV.LM,
        category: "project-update",
        categoryLabel: "Project Update",
        scope: "project",
        time: "4:19 PM",
        actor: "Lucas Martin",
        description:
          "updated project description \u2014 added scope details for notification system overhaul",
      },
      {
        id: "y3",
        avatar: AV.DR,
        category: "effort-review",
        categoryLabel: "Effort Review",
        scope: "effort",
        time: "3:02 PM",
        actor: "Daniel Reyes",
        description:
          "approved QA review on {TAPP-088 \u00b7 Mobile session persistence} \u2014 2 comments, passed all acceptance criteria",
        objects: ["TAPP-088 \u00b7 Mobile session persistence"],
      },
      {
        id: "y4",
        avatar: AV.SK,
        category: "milestone",
        categoryLabel: "Milestone Update",
        scope: "project",
        time: "1:47 PM",
        actor: "Sarah Kim",
        description:
          "marked {Sprint 3 \u00b7 Backend Stability} as complete \u2014 14 of 14 efforts done",
        objects: ["Sprint 3 \u00b7 Backend Stability"],
      },
      {
        id: "y5",
        avatar: AV.AK,
        category: "assignment",
        categoryLabel: "Assignment Change",
        scope: "project",
        time: "11:15 AM",
        actor: "Anika Kapoor",
        description: "changed role requirement \u2014 QA hours:",
        diff: { old: "20h/sprint", new: "30h/sprint" },
      },
      {
        id: "y6",
        avatar: AV.AK,
        category: "assignment",
        categoryLabel: "Assignment Change",
        scope: "project",
        time: "10:30 AM",
        actor: "Anika Kapoor",
        description: "removed {Jordan Price} from the team \u2014 QA:",
        objects: ["Jordan Price"],
        diff: { old: "Jordan Price", new: "none" },
      },
      {
        id: "y7",
        avatar: AV.RN_yellow,
        category: "effort-update",
        categoryLabel: "Effort Update",
        scope: "effort",
        time: "9:14 AM",
        actor: "Ravi Nair",
        description:
          "flagged {TAPP-086 \u00b7 Offline sync conflict resolution} as blocked \u2014 dependency on external API contract",
        objects: ["TAPP-086 \u00b7 Offline sync conflict resolution"],
      },
      {
        id: "y8",
        avatar: AV.LM,
        category: "budget",
        categoryLabel: "Budget Update",
        scope: "project",
        time: "8:50 AM",
        actor: "Lucas Martin",
        description:
          "updated Sprint 4 budget consumed \u2014 52% burned at 40% timeline",
        diff: { old: "142h / 380h", new: "198h / 380h" },
      },
      {
        id: "y9",
        avatar: AV.DR,
        category: "integration",
        categoryLabel: "Integration",
        scope: "project",
        time: "8:30 AM",
        actor: "Daniel Reyes",
        description:
          "connected {Datadog APM} to staging environment \u2014 error tracking and latency dashboards enabled",
        objects: ["Datadog APM"],
      },
      {
        id: "y10",
        avatar: AV.SK,
        category: "note",
        categoryLabel: "Note",
        scope: "effort",
        time: "8:10 AM",
        actor: "Sarah Kim",
        description:
          'added note on {TAPP-086} \u2014 "Spoke with vendor PM, API contract v3 draft expected by Apr 2. Unblocking ETA: Apr 4."',
        objects: ["TAPP-086"],
      },
    ],
  },
  {
    label: "Earlier",
    fullLabel: "Earlier",
    days: [
      {
        label: "March 28, 2026",
        items: [
          {
            id: "e1",
            avatar: AV.LM,
            category: "credential",
            categoryLabel: "Credential Update",
            scope: "project",
            time: "4:10 PM",
            actor: "Lucas Martin",
            description:
              "verified {Figma Team Workspace} \u2014 SSO access confirmed for all team members",
            objects: ["Figma Team Workspace"],
          },
          {
            id: "e2",
            avatar: AV.DR,
            category: "effort-review",
            categoryLabel: "Effort Review",
            scope: "effort",
            time: "2:45 PM",
            actor: "Daniel Reyes",
            description:
              "rejected code review on {TAPP-083 \u00b7 Realtime dashboard polling} \u2014 4 blocking issues found",
            objects: ["TAPP-083 \u00b7 Realtime dashboard polling"],
          },
          {
            id: "e3",
            avatar: AV.SK,
            category: "effort-update",
            categoryLabel: "Effort Update",
            scope: "effort",
            time: "11:30 AM",
            actor: "Sarah Kim",
            description:
              "created effort {TAPP-094 \u00b7 Analytics event schema v2} \u2014 added to Sprint 4, priority High",
            objects: ["TAPP-094 \u00b7 Analytics event schema v2"],
          },
          {
            id: "e4",
            avatar: AV.RN_yellow,
            category: "deployment",
            categoryLabel: "Deployment",
            scope: "project",
            time: "10:15 AM",
            actor: "Ravi Nair",
            description:
              "deployed {v2.4.0} to production \u2014 Sprint 3 release, 14 efforts included",
            objects: ["v2.4.0"],
          },
          {
            id: "e5",
            avatar: AV.LM,
            category: "risk",
            categoryLabel: "Risk Resolved",
            scope: "project",
            time: "9:40 AM",
            actor: "Lucas Martin",
            description:
              "resolved risk {SSO provider outage} \u2014 vendor confirmed fix deployed, no user impact after failover",
            objects: ["SSO provider outage"],
          },
        ],
      },
      {
        label: "March 25, 2026",
        items: [
          {
            id: "e6",
            avatar: AV.LM,
            category: "project-update",
            categoryLabel: "Project Update",
            scope: "project",
            time: "5:52 PM",
            actor: "Lucas Martin",
            description: "changed sprint due date on {Sprint 4}",
            objects: ["Sprint 4"],
            diff: { old: "Apr 25", new: "Apr 30" },
          },
          {
            id: "e7",
            avatar: AV.LM,
            category: "project-update",
            categoryLabel: "Project Update",
            scope: "project",
            time: "5:40 PM",
            actor: "Lucas Martin",
            description:
              "updated client contact \u2014 added {Rachel Brooks} as Stakeholder",
            objects: ["Rachel Brooks"],
          },
          {
            id: "e8",
            avatar: AV.SK,
            category: "effort-update",
            categoryLabel: "Effort Update",
            scope: "effort",
            time: "11:03 AM",
            actor: "Sarah Kim",
            description:
              "added {TAPP-093 \u00b7 Crash reporting integration} to Sprint 4 backlog",
            objects: ["TAPP-093 \u00b7 Crash reporting integration"],
          },
          {
            id: "e9",
            avatar: AV.LM,
            category: "scope",
            categoryLabel: "Scope Change",
            scope: "project",
            time: "10:20 AM",
            actor: "Lucas Martin",
            description:
              "added {Accessibility audit} to Sprint 4 scope \u2014 client requested WCAG 2.1 AA compliance by launch",
            objects: ["Accessibility audit"],
          },
          {
            id: "e10",
            avatar: AV.DR,
            category: "integration",
            categoryLabel: "Integration",
            scope: "project",
            time: "9:30 AM",
            actor: "Daniel Reyes",
            description:
              "configured {GitHub Actions CI pipeline} \u2014 automated lint, test, and staging deploy on merge to develop",
            objects: ["GitHub Actions CI pipeline"],
          },
          {
            id: "e11",
            avatar: AV.RN_yellow,
            category: "dependency",
            categoryLabel: "Dependency",
            scope: "effort",
            time: "8:45 AM",
            actor: "Ravi Nair",
            description:
              "unlinked dependency {TAPP-083 \u2192 TAPP-079} \u2014 polling refactor no longer requires legacy endpoint",
            objects: ["TAPP-083 \u2192 TAPP-079"],
          },
        ],
      },
      {
        label: "March 21, 2026",
        items: [
          {
            id: "e12",
            avatar: AV.LM,
            category: "project-review",
            categoryLabel: "Project Review",
            scope: "project",
            time: "4:15 PM",
            actor: "Lucas Martin",
            description: "completed velocity review \u2014 Velocity:",
            diff: { old: "72%", new: "85%" },
          },
          {
            id: "e13",
            avatar: AV.AK,
            category: "assignment",
            categoryLabel: "Assignment Change",
            scope: "project",
            time: "3:41 PM",
            actor: "Anika Kapoor",
            description: "added {Priya Mehta} to the team \u2014 Designer:",
            objects: ["Priya Mehta"],
            diff: { old: "none", new: "Priya Mehta" },
          },
          {
            id: "e14",
            avatar: AV.LM,
            category: "project-update",
            categoryLabel: "Project Update",
            scope: "project",
            time: "2:05 PM",
            actor: "Lucas Martin",
            description: "updated budget on {Sprint 4} \u2014 added design scope",
            objects: ["Sprint 4"],
            diff: { old: "320h", new: "380h" },
          },
          {
            id: "e15",
            avatar: AV.SK,
            category: "milestone",
            categoryLabel: "Milestone Update",
            scope: "project",
            time: "10:18 AM",
            actor: "Sarah Kim",
            description:
              "created milestone {Sprint 4 \u00b7 Mobile UX Polish} \u2014 target Apr 30",
            objects: ["Sprint 4 \u00b7 Mobile UX Polish"],
          },
          {
            id: "e16",
            avatar: AV.RN_yellow,
            category: "risk",
            categoryLabel: "Risk Flagged",
            scope: "project",
            time: "9:50 AM",
            actor: "Ravi Nair",
            description:
              "flagged risk {SSO provider outage} \u2014 intermittent 503s from identity provider affecting login flow on staging",
            objects: ["SSO provider outage"],
          },
          {
            id: "e17",
            avatar: AV.LM,
            category: "budget",
            categoryLabel: "Budget Update",
            scope: "project",
            time: "9:15 AM",
            actor: "Lucas Martin",
            description: "logged time adjustment on Sprint 3 \u2014 carried over",
            diff: { old: "18h unused", new: "Sprint 4 buffer" },
          },
        ],
      },
      {
        label: "March 17, 2026",
        items: [
          {
            id: "e18",
            avatar: AV.LM,
            category: "credential",
            categoryLabel: "Credential Update",
            scope: "project",
            time: "3:20 PM",
            actor: "Lucas Martin",
            description:
              "flagged {Production PostgreSQL} for review \u2014 password rotation overdue since Feb 2026",
            objects: ["Production PostgreSQL"],
          },
          {
            id: "e19",
            avatar: AV.AK,
            category: "assignment",
            categoryLabel: "Assignment Change",
            scope: "effort",
            time: "2:10 PM",
            actor: "Anika Kapoor",
            description:
              "reassigned {TAPP-035 \u00b7 API integration SSO providers} \u2014 Dev:",
            objects: ["TAPP-035 \u00b7 API integration SSO providers"],
            diff: { old: "Ravi Nair", new: "Daniel Reyes" },
          },
          {
            id: "e20",
            avatar: AV.LM,
            category: "milestone",
            categoryLabel: "Milestone Update",
            scope: "project",
            time: "11:45 AM",
            actor: "Lucas Martin",
            description:
              "updated milestone {Sprint 3 \u00b7 Backend Stability} target date \u2014 scope increased",
            objects: ["Sprint 3 \u00b7 Backend Stability"],
            diff: { old: "Mar 20", new: "Mar 28" },
          },
          {
            id: "e21",
            avatar: AV.DR,
            category: "effort-review",
            categoryLabel: "Effort Review",
            scope: "effort",
            time: "10:05 AM",
            actor: "Daniel Reyes",
            description:
              "requested changes on {TAPP-031 \u00b7 Rebuild onboarding stepper} \u2014 accessibility issues in tab order",
            objects: ["TAPP-031 \u00b7 Rebuild onboarding stepper"],
          },
          {
            id: "e22",
            avatar: AV.SK,
            category: "deployment",
            categoryLabel: "Deployment",
            scope: "project",
            time: "9:30 AM",
            actor: "Sarah Kim",
            description:
              "deployed {v2.3.2-hotfix} to production \u2014 fixes critical session timeout bug reported by client",
            objects: ["v2.3.2-hotfix"],
          },
          {
            id: "e23",
            avatar: AV.LM,
            category: "note",
            categoryLabel: "Note",
            scope: "project",
            time: "9:00 AM",
            actor: "Lucas Martin",
            description:
              'added note \u2014 "Post-mortem scheduled for session timeout incident. Root cause: token refresh race condition in mobile WebView."',
          },
          {
            id: "e24",
            avatar: AV.AK,
            category: "scope",
            categoryLabel: "Scope Change",
            scope: "project",
            time: "8:20 AM",
            actor: "Anika Kapoor",
            description:
              "deferred {Dark mode support} from Sprint 3 to Sprint 5 \u2014 reprioritized after client feedback",
            objects: ["Dark mode support"],
          },
        ],
      },
      {
        label: "March 14, 2026",
        items: [
          {
            id: "e25",
            avatar: AV.LM,
            category: "project-review",
            categoryLabel: "Project Review",
            scope: "project",
            time: "5:00 PM",
            actor: "Lucas Martin",
            description:
              "completed velocity review \u2014 team ramping up after onboarding",
            diff: { old: "58%", new: "72%" },
          },
          {
            id: "e26",
            avatar: AV.LM,
            category: "credential",
            categoryLabel: "Credential Update",
            scope: "project",
            time: "4:30 PM",
            actor: "Lucas Martin",
            description: "added credentials \u2014",
            objects: [
              "Stripe Payment Gateway",
              "Staging SSH",
              "Production PostgreSQL",
            ],
          },
          {
            id: "e27",
            avatar: AV.AK,
            category: "assignment",
            categoryLabel: "Assignment Change",
            scope: "project",
            time: "4:15 PM",
            actor: "Anika Kapoor",
            description: "assigned initial team \u2014 PM:",
            diff: { old: "none", new: "Lucas Martin" },
          },
          {
            id: "e28",
            avatar: AV.LM,
            category: "setup",
            categoryLabel: "Setup",
            scope: "project",
            time: "4:00 PM",
            actor: "Lucas Martin",
            description:
              "configured project \u2014 linked to {DesignOps}, connected Figma workspace, added repositories",
            objects: ["DesignOps"],
          },
          {
            id: "e29",
            avatar: AV.DR,
            category: "integration",
            categoryLabel: "Integration",
            scope: "project",
            time: "10:30 AM",
            actor: "Daniel Reyes",
            description:
              "connected {Slack #tapp-engineering} channel \u2014 notifications for deployments, blocked efforts, and risk alerts",
            objects: ["Slack #tapp-engineering"],
          },
          {
            id: "e30",
            avatar: AV.AK,
            category: "setup",
            categoryLabel: "Setup",
            scope: "project",
            time: "9:00 AM",
            actor: "Anika Kapoor",
            description:
              "created the project {TAPP} \u2014 type: Fulfillment, organization: TAPP Inc., started Jan 14, 2026",
            objects: ["TAPP"],
          },
        ],
      },
    ],
  },
];

// ─── Filter options ────────────────────────────────────────────────────────

export const typeOptions = [
  "Effort Update",
  "Effort Review",
  "Project Update",
  "Project Review",
  "Assignment Change",
  "Credential Update",
  "Milestone Update",
  "Deployment",
  "Risk",
  "Scope Change",
  "Budget Update",
  "Dependency",
  "Integration",
  "Note",
  "Setup",
] as const;

export const userOptions = [
  "Lucas Martin",
  "Sarah Kim",
  "Daniel Reyes",
  "Ravi Nair",
  "Anika Kapoor",
] as const;

export const dateOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "Last 7 days" },
  { value: "month", label: "Last 30 days" },
] as const;
