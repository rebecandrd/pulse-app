/* ════════════════════════════════════════════════════
   PULSE — Weekly hours model
   Slice 1 of the Dashboard story map.

   One source of truth for:
     · the per-role weekly hour formulas (design = 5h + 2h per extra dev, cap 11h)
     · the Monday–Sunday week window and its reset
     · requested / allocated / logged hours per discipline
   ════════════════════════════════════════════════════ */

var PulseHours = (function () {
  'use strict';

  /* ── Week basis ──────────────────────────────────────
     The project wizard allocates on a 40h full-time week. The hours API
     prorates on 35h. They are declared here so the two can be reconciled
     in one place instead of drifting screen by screen. Anything that
     prints an hour figure derived from a commitment reads this. */
  var WEEK_BASIS = { fullTime: 40, partTime: 20, note: '40h full-time week' };

  /* ── Role formulas ───────────────────────────────────
     Design: 5h for one full-time dev, +2h for each additional dev,
     capped at 11h (which the 4-dev maximum reaches exactly). */
  var DESIGN_BASE = 5, DESIGN_STEP = 2, DESIGN_CAP = 11, DEV_MAX = 4;

  function designHours(devCount) {
    var d = clampDevs(devCount);
    return Math.min(DESIGN_CAP, DESIGN_BASE + Math.max(0, d - 1) * DESIGN_STEP);
  }

  function clampDevs(d) { return Math.max(1, Math.min(DEV_MAX, parseInt(d, 10) || 1)); }

  /* Returns the parts of the design calculation so a screen can show the
     working, not just the result. */
  function designBreakdown(devCount) {
    var d = clampDevs(devCount);
    var extra = Math.max(0, d - 1);
    var raw = DESIGN_BASE + extra * DESIGN_STEP;
    return {
      devs: d,
      base: DESIGN_BASE,
      extraDevs: extra,
      step: DESIGN_STEP,
      raw: raw,
      cap: DESIGN_CAP,
      capped: raw > DESIGN_CAP,
      total: Math.min(DESIGN_CAP, raw),
      expression: extra > 0
        ? DESIGN_BASE + 'h + ' + extra + ' × ' + DESIGN_STEP + 'h'
        : DESIGN_BASE + 'h base'
    };
  }

  var ROLE_FORMULA = {
    design: { label: 'Design',    fn: designHours,                       text: function (d) { return designBreakdown(d).expression; } },
    pm:     { label: 'PM',        fn: function (d) { return clampDevs(d) * 3; }, text: function (d) { return clampDevs(d) + ' dev' + (clampDevs(d) > 1 ? 's' : '') + ' × 3h'; } },
    qa:     { label: 'QA',        fn: function ()  { return 5; },        text: function () { return '~1h/day · flat'; } },
    arch:   { label: 'Architect', fn: function (d) { return clampDevs(d) * 1; }, text: function (d) { return clampDevs(d) + ' dev' + (clampDevs(d) > 1 ? 's' : '') + ' × 1h'; } }
  };

  function roleHours(role, devCount) {
    var f = ROLE_FORMULA[role];
    return f ? f.fn(devCount) : 0;
  }

  /* ── Week window (resets Monday) ─────────────────────── */
  function startOfWeek(date) {
    var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));   // 0 = Monday
    return d;
  }

  /* offset 0 = the week in progress, -1 = the last complete week */
  function weekWindow(offset) {
    var s = startOfWeek(new Date());
    s.setDate(s.getDate() + (offset || 0) * 7);
    var e = new Date(s); e.setDate(e.getDate() + 6);
    return {
      offset: offset || 0,
      start: s,
      end: e,
      label: rangeLabel(s, e),
      shortLabel: (offset === 0 ? 'This week' : offset === -1 ? 'Last week' : rangeLabel(s, e)),
      businessDays: 5,
      inProgress: (offset || 0) === 0,
      /* How much of the week has elapsed, Mon=0 … Sun=1. Lets a screen say
         "4h of 9h with 2 days left" instead of flagging a false underrun. */
      elapsed: (offset || 0) < 0 ? 1 : Math.min(1, ((new Date() - s) / 86400000) / 7)
    };
  }

  function rangeLabel(s, e) {
    var m = { month: 'short', day: 'numeric' };
    var a = s.toLocaleDateString('en-US', m), b = e.toLocaleDateString('en-US', m);
    return a + ' – ' + b;
  }

  function daysUntilReset() {
    var s = startOfWeek(new Date()); s.setDate(s.getDate() + 7);
    return Math.ceil((s - new Date()) / 86400000);
  }

  /* ── Formatting ──────────────────────────────────────── */
  function fmtH(n) {
    if (n === null || n === undefined) return '—';
    var r = Math.round(n * 10) / 10;
    return (r % 1 === 0 ? r.toFixed(0) : r.toFixed(1)) + 'h';
  }

  /* ── Status of logged against allocated ──────────────── */
  function hourState(logged, allocated, win) {
    if (!allocated) return { key: 'none', label: 'No budget', tone: 'muted' };
    var pct = logged / allocated;
    if (pct > 1)    return { key: 'over',   label: 'Over budget',  tone: 'bad',  pct: pct };
    if (pct >= 0.9) return { key: 'atlimit', label: 'At limit',    tone: 'warn', pct: pct };
    /* Judge the spend against how much of the week has gone by, so a quiet
       Monday does not read the same as an untouched Friday. A complete week
       expects the whole budget; a week in progress expects its elapsed share.
       Nothing is called unused before roughly midweek — zero hours on a
       Monday is not a signal, it is just Monday. */
    var expected = (win && win.inProgress) ? win.elapsed : 1;
    if (expected >= 0.3 && pct / expected < 0.5) {
      return { key: 'unused', label: logged === 0 ? 'Unused' : 'Barely used', tone: 'warn', pct: pct };
    }
    return { key: 'ok', label: 'On track', tone: 'good', pct: pct };
  }

  /* ════════════════════════════════════════════════════
     Fixture data — the five projects the PM manages.
     devs / engagement drive the allocated figures through the formulas
     above, so changing a dev count changes every screen at once.
     ════════════════════════════════════════════════════ */
  var PROJECTS = [
    {
      id: 'eventsquid', code: 'ES', name: 'EventSquid', client: 'Squid Events Ltd.',
      devs: 3, engagement: 'mixed', devAllocated: 80,
      weeks: {
        '-1': { logged: { dev: 74, qa: 5.5, design: 9.5, pm: 8 },  effortsTouched: 12 },
        '0':  { logged: { dev: 11, qa: 1,   design: 3.5, pm: 1.5 }, effortsTouched: 3 }
      },
      designers: ['CH']
    },
    {
      id: 'chantmasters', code: 'CM', name: 'Chantmasters', client: 'Chantmasters LLC',
      devs: 2, engagement: 'full', devAllocated: 80,
      weeks: {
        '-1': { logged: { dev: 71, qa: 4, design: 2, pm: 6 },   effortsTouched: 7 },
        '0':  { logged: { dev: 9,  qa: 0, design: 1, pm: 1 },   effortsTouched: 2 }
      },
      designers: ['CH']
    },
    {
      id: 'carmnet', code: 'CN', name: 'Carmnet', client: 'Carmnet Automotive',
      devs: 2, engagement: 'mixed', devAllocated: 60,
      weeks: {
        '-1': { logged: { dev: 58, qa: 5, design: 0, pm: 5.5 }, effortsTouched: 0 },
        '0':  { logged: { dev: 7,  qa: 0, design: 0, pm: 0.5 }, effortsTouched: 0 }
      },
      designers: []
    },
    {
      id: 'tapp', code: 'TA', name: 'TAPP', client: 'TAPP Corp',
      devs: 4, engagement: 'full', devAllocated: 160,
      weeks: {
        '-1': { logged: { dev: 142, qa: 6, design: 11, pm: 13.5 }, effortsTouched: 15 },
        '0':  { logged: { dev: 21,  qa: 1, design: 2,  pm: 2 },    effortsTouched: 4 }
      },
      designers: ['LM']
    },
    {
      id: 'designops', code: 'DO', name: 'DesignOps', client: 'Internal',
      devs: 1, engagement: 'part', devAllocated: 20,
      weeks: {
        '-1': { logged: { dev: 18, qa: 0, design: 5,   pm: 3 },   effortsTouched: 2 },
        '0':  { logged: { dev: 2,  qa: 0, design: 0.5, pm: 0.5 }, effortsTouched: 1 }
      },
      designers: ['CH']
    }
  ];

  var DISCIPLINES = [
    { key: 'dev',    label: 'Dev',    color: '#3b82f6' },
    { key: 'design', label: 'Design', color: '#d1457f' },
    { key: 'qa',     label: 'QA',     color: '#8b5cf6' },
    { key: 'pm',     label: 'PM',     color: '#0ea5a4' }
  ];

  function getProject(id) {
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].id === id) return PROJECTS[i];
    return null;
  }

  /* Allocated hours per discipline. Dev comes from the engagement;
     every other role is computed from the dev count. */
  function allocatedFor(p, key) {
    if (key === 'dev') return p.devAllocated;
    return roleHours(key === 'arch' ? 'arch' : key, p.devs);
  }

  /* The full picture for one project in one week. */
  function projectWeek(p, offset) {
    var win = weekWindow(offset);
    var wk = p.weeks[String(offset)] || { logged: {}, effortsTouched: 0 };
    var rows = DISCIPLINES.map(function (d) {
      var allocated = allocatedFor(p, d.key);
      var logged = wk.logged[d.key] || 0;
      return {
        key: d.key, label: d.label, color: d.color,
        allocated: allocated,
        logged: logged,
        remaining: Math.max(0, allocated - logged),
        over: Math.max(0, logged - allocated),
        state: hourState(logged, allocated, win),
        formula: ROLE_FORMULA[d.key]
          ? ROLE_FORMULA[d.key].text(p.devs)
          : (p.engagement === 'full' ? p.devs + ' × ' + WEEK_BASIS.fullTime + 'h/wk' :
             p.engagement === 'part' ? p.devs + ' × ' + WEEK_BASIS.partTime + 'h/wk' :
             '1 × ' + WEEK_BASIS.fullTime + 'h + ' + (p.devs - 1) + ' × ' + WEEK_BASIS.partTime + 'h')
      };
    });
    var totals = rows.reduce(function (a, r) {
      a.allocated += r.allocated; a.logged += r.logged; return a;
    }, { allocated: 0, logged: 0 });
    totals.remaining = Math.max(0, totals.allocated - totals.logged);
    return {
      project: p, window: win, rows: rows, totals: totals,
      effortsTouched: wk.effortsTouched,
      active: wk.effortsTouched > 0
    };
  }

  /* ── Section visibility (requirement 3.5) ─────────────── */
  var STORE_KEY = 'pulse.sections.v1';

  function readPrefs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writePrefs(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* private window */ }
  }
  function isSectionVisible(id) {
    var p = readPrefs();
    return p[id] !== false;
  }
  function setSectionVisible(id, on) {
    var p = readPrefs(); p[id] = !!on; writePrefs(p);
    document.querySelectorAll('[data-section="' + id + '"]').forEach(function (el) { el.hidden = !on; });
  }
  function applySections() {
    document.querySelectorAll('[data-section]').forEach(function (el) {
      el.hidden = !isSectionVisible(el.dataset.section);
    });
  }

  return {
    WEEK_BASIS: WEEK_BASIS,
    DESIGN_CAP: DESIGN_CAP,
    DEV_MAX: DEV_MAX,
    DISCIPLINES: DISCIPLINES,
    PROJECTS: PROJECTS,
    designHours: designHours,
    designBreakdown: designBreakdown,
    roleHours: roleHours,
    weekWindow: weekWindow,
    daysUntilReset: daysUntilReset,
    hourState: hourState,
    fmtH: fmtH,
    getProject: getProject,
    projectWeek: projectWeek,
    isSectionVisible: isSectionVisible,
    setSectionVisible: setSectionVisible,
    applySections: applySections
  };
})();


/* ════════════════════════════════════════════════════
   PULSE — Weekly hours rendering
   Markup helpers shared by Project > Details and the Dashboard,
   so one change to a bar or a pill lands on every screen.
   ════════════════════════════════════════════════════ */
(function (PH) {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function pill(state) {
    return '<span class="ph-pill ph-' + state.tone + '">' + esc(state.label) + '</span>';
  }

  /* Week strip — which window, when it resets, and how to switch. */
  PH.weekStripHTML = function (offset, handler) {
    var win = PH.weekWindow(offset);
    var days = PH.daysUntilReset();
    var note = win.inProgress
      ? 'Resets Monday · ' + days + (days === 1 ? ' day' : ' days') + ' left'
      : 'Complete week · archived';
    var btn = function (o, label) {
      return '<button class="ph-week-btn' + (o === offset ? ' active' : '') +
             '" onclick="' + handler + '(' + o + ')">' + label + '</button>';
    };
    return '<div class="ph-week">' +
             (win.inProgress ? '<span class="ph-live-dot"></span>' : '') +
             '<span class="ph-week-range">' + esc(win.label) + '</span>' +
             '<span class="ph-week-note">' + esc(note) + '</span>' +
             '<div class="ph-week-seg">' + btn(-1, 'Last week') + btn(0, 'This week') + '</div>' +
           '</div>';
  };

  /* The design hours field, with the calculation shown. */
  PH.designBudgetHTML = function (project) {
    var b = PH.designBreakdown(project.devs);
    var terms = '<span class="ph-term">' + b.devs + ' dev' + (b.devs > 1 ? 's' : '') + '</span>' +
                '<span class="ph-op">→</span>' +
                '<span class="ph-term">' + b.base + 'h base</span>';
    if (b.extraDevs > 0) {
      terms += '<span class="ph-op">+</span>' +
               '<span class="ph-term">' + b.extraDevs + ' × ' + b.step + 'h</span>';
    }
    terms += '<span class="ph-op">=</span>' +
             '<span class="ph-term ph-term-out">' + PH.fmtH(b.total) + '/week</span>';

    return '<div class="ph-budget">' +
             '<div class="ph-budget-num">' + b.total + '<span>h</span></div>' +
             '<div class="ph-budget-side">' +
               '<div class="ph-budget-lbl">Design hours per week</div>' +
               '<div class="ph-formula">' + terms + '</div>' +
               (b.capped
                 ? '<span class="ph-cap-note">Capped at ' + b.cap + 'h — the formula gives ' + b.raw + 'h</span>'
                 : (b.total === b.cap
                     ? '<span class="ph-cap-note">At the ' + b.cap + 'h ceiling</span>'
                     : '')) +
             '</div>' +
           '</div>';
  };

  /* One row per discipline: used against allocated, with what is left. */
  PH.disciplineRowsHTML = function (pw) {
    return '<div class="ph-rows">' + pw.rows.map(function (r) {
      var pct = r.allocated ? Math.min(100, (r.logged / r.allocated) * 100) : 0;
      var over = r.over > 0;
      return '<div class="ph-row">' +
        '<div class="ph-row-head">' +
          '<span class="ph-row-name"><span class="ph-row-dot" style="background:' + r.color + '"></span>' + esc(r.label) + '</span>' +
          '<span class="ph-row-formula" title="' + esc(r.formula) + '">' + esc(r.formula) + '</span>' +
        '</div>' +
        '<div class="ph-bar-wrap">' +
          '<div class="ph-bar"><div class="ph-fill' + (over ? ' ph-over' : '') + '" style="width:' + pct.toFixed(1) + '%;background:' + r.color + '"></div></div>' +
          '<div class="ph-bar-sub">' +
            '<span>used ' + PH.fmtH(r.logged) + '</span>' +
            '<span class="ph-rem">' + (over
              ? '<span class="ph-over-ink">' + PH.fmtH(r.over) + ' over</span>'
              : PH.fmtH(r.remaining) + ' left') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ph-row-figs">' +
          '<div class="ph-figs-main">' + PH.fmtH(r.logged) + ' <span class="ph-of">/ ' + PH.fmtH(r.allocated) + '</span></div>' +
          '<div class="ph-figs-sub">' + pill(r.state) + '</div>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  };

  PH.totalHTML = function (pw) {
    var t = pw.totals;
    var state = PH.hourState(t.logged, t.allocated, pw.window);
    return '<div class="ph-total">' +
             '<span class="ph-total-lbl">All disciplines</span>' +
             pill(state) +
             '<span class="ph-total-val">' + PH.fmtH(t.logged) +
               ' <span class="ph-of">/ ' + PH.fmtH(t.allocated) + '</span></span>' +
           '</div>';
  };

  /* Dashboard list. mode 'pm' leads with the design budget and activity;
     mode 'designer' leads with the ceiling on each project. */
  PH.projectListHTML = function (projects, offset, mode, href) {
    if (!projects.length) {
      return '<div class="ph-empty">No projects in this window.</div>';
    }
    return '<div class="ph-plist">' + projects.map(function (p) {
      var pw = PH.projectWeek(p, offset);
      var d = pw.rows.filter(function (r) { return r.key === 'design'; })[0];
      var pct = d.allocated ? Math.min(100, (d.logged / d.allocated) * 100) : 0;

      var meta;
      if (mode === 'pm') {
        meta = pw.active
          ? '<span>' + pw.effortsTouched + ' effort' + (pw.effortsTouched === 1 ? '' : 's') + ' active</span>'
          : '<span class="ph-pill ph-warn">No efforts this period</span>';
        meta = esc(p.client) + ' · ' + meta;
      } else {
        meta = esc(p.client) + ' · ' + PH.fmtH(d.remaining) + ' of design time left';
      }

      return '<div class="ph-prow" onclick="location.href=\'' + (href || 'project-detail.html') + '\'">' +
        '<div class="ph-prow-id">' +
          '<div class="ph-prow-icon">' + esc(p.code) + '</div>' +
          '<div class="ph-prow-body">' +
            '<div class="ph-prow-name">' + esc(p.name) + '</div>' +
            '<div class="ph-prow-meta">' + meta + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="ph-bar-wrap">' +
          '<div class="ph-bar"><div class="ph-fill' + (d.over > 0 ? ' ph-over' : '') + '" style="width:' + pct.toFixed(1) + '%;background:' + d.color + '"></div></div>' +
          '<div class="ph-bar-sub"><span>Design</span><span class="ph-rem">' +
            (d.over > 0 ? '<span class="ph-over-ink">' + PH.fmtH(d.over) + ' over</span>' : PH.fmtH(d.remaining) + ' left') +
          '</span></div>' +
        '</div>' +
        '<div class="ph-prow-figs">' +
          '<div class="ph-figs-main">' + PH.fmtH(d.logged) + ' <span class="ph-of">/ ' + PH.fmtH(d.allocated) + '</span></div>' +
          '<div class="ph-figs-sub">' + pill(d.state) + '</div>' +
        '</div>' +
      '</div>';
    }).join('') + '</div>';
  };

  /* Section show/hide menu. sections = [{id, label}] */
  PH.initVisibilityMenu = function (btnId, menuId, sections) {
    var btn = document.getElementById(btnId), menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    menu.innerHTML = '<div class="ph-vis-hdr">Sections on this dashboard</div>' +
      sections.map(function (s) {
        return '<label class="ph-vis-item">' +
                 '<input type="checkbox" id="phvis-' + s.id + '" data-sec="' + s.id + '"' +
                 (PH.isSectionVisible(s.id) ? ' checked' : '') + '> ' + esc(s.label) +
               '</label>';
      }).join('');

    menu.addEventListener('click', function (e) { e.stopPropagation(); });
    menu.addEventListener('change', function (e) {
      var cb = e.target.closest('input[data-sec]');
      if (cb) PH.setSectionVisible(cb.dataset.sec, cb.checked);
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function () { menu.classList.remove('open'); });

    PH.applySections();
  };

})(PulseHours);
