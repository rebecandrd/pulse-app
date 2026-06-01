/* ════════════════════════════════════════════════════
   PULSE — Shared JavaScript Utilities
   ════════════════════════════════════════════════════ */

// ── Sidebar mobile toggle ────────────────────────────
function toggleSidebar() {
  var sb = document.querySelector('.sidebar');
  var bd = document.getElementById('sbBackdrop');
  if (!sb) return;
  var open = sb.classList.toggle('sb-open');
  if (bd) bd.classList.toggle('show', open);
}


// ── Active nav link ─────────────────────────────────
(function() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(function(el) {
    if (el.dataset.nav === page) {
      el.classList.add('active');
      // Also activate parent sb-item if inside sb-sub
      var parent = el.closest('.sb-sub');
      if (parent) {
        var parentItem = parent.previousElementSibling;
        if (parentItem && parentItem.classList.contains('sb-item')) {
          parentItem.classList.add('active');
        }
      }
    }
  });
})();

// ── Tag input helper ────────────────────────────────
function initTagInput(wrapId, inputId, suggestContainerId) {
  var wrap  = document.getElementById(wrapId);
  var input = document.getElementById(inputId);
  if (!wrap || !input) return;

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      var v = input.value.trim().replace(/,$/, '');
      if (v) addTagPill(v, wrap, input);
    }
    if (e.key === 'Backspace' && !input.value) {
      var pills = wrap.querySelectorAll('.tag-pill');
      if (pills.length) pills[pills.length - 1].remove();
    }
  });

  if (suggestContainerId) {
    var container = document.getElementById(suggestContainerId);
    if (container) {
      container.addEventListener('click', function(e) {
        var s = e.target.closest('.tag-suggest');
        if (!s) return;
        addTagPill(s.textContent.trim(), wrap, input);
        s.remove();
      });
    }
  }
}

function addTagPill(val, wrap, input) {
  var pill = document.createElement('span');
  pill.className = 'tag-pill';
  var x = document.createElement('span');
  x.className = 'tag-pill-x';
  x.textContent = '×';
  x.addEventListener('click', function() { pill.remove(); });
  pill.textContent = val + ' ';
  pill.appendChild(x);
  wrap.insertBefore(pill, input);
  input.value = '';
}

function getTagsFromWrap(wrapId) {
  var wrap = document.getElementById(wrapId);
  if (!wrap) return [];
  return Array.from(wrap.querySelectorAll('.tag-pill')).map(function(p) {
    return p.textContent.replace('×', '').trim();
  });
}

// ── Toast ───────────────────────────────────────────
function showToast(message, duration) {
  duration = duration || 3000;
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, duration);
}

// ── View switcher ────────────────────────────────────
function initViewSwitcher(switcherId, views) {
  // views = [{btnId, panelId}]
  var switcher = document.getElementById(switcherId);
  if (!switcher) return;
  switcher.querySelectorAll('.view-sw-btn').forEach(function(btn, i) {
    btn.addEventListener('click', function() {
      switcher.querySelectorAll('.view-sw-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      views.forEach(function(v, j) {
        var panel = document.getElementById(v.panelId);
        if (panel) panel.style.display = j === i ? '' : 'none';
      });
    });
  });
}

// ── Search/filter helper ─────────────────────────────
function filterItems(inputId, items, getTextFn) {
  var input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', function() {
    var q = input.value.toLowerCase().trim();
    items.forEach(function(item) {
      var text = getTextFn(item).toLowerCase();
      item.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });
}

// ── Format date ──────────────────────────────────────
function formatDate(d) {
  if (!d) return '—';
  var dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Drag-and-drop Kanban ─────────────────────────────
function initKanbanDnD(boardId) {
  var board = document.getElementById(boardId);
  if (!board) return;
  var dragging = null;
  board.addEventListener('dragstart', function(e) {
    var card = e.target.closest('.kb-card');
    if (!card) return;
    dragging = card;
    setTimeout(function() { card.style.opacity = '0.5'; }, 0);
  });
  board.addEventListener('dragend', function(e) {
    var card = e.target.closest('.kb-card');
    if (card) card.style.opacity = '';
    dragging = null;
  });
  board.addEventListener('dragover', function(e) {
    e.preventDefault();
    var col = e.target.closest('.kb-cards');
    if (col && dragging) {
      var afterEl = getDragAfterElement(col, e.clientY);
      if (afterEl) col.insertBefore(dragging, afterEl);
      else col.appendChild(dragging);
    }
  });
  function getDragAfterElement(container, y) {
    var els = Array.from(container.querySelectorAll('.kb-card:not(.dragging)'));
    return els.reduce(function(closest, child) {
      var box = child.getBoundingClientRect();
      var offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}

// ── Role profile dropdown (dashboard) ───────────────
function initRoleDropdown() {
  var btn = document.getElementById('userProfileBtn');
  var dd  = document.getElementById('userDropdown');
  if (!btn || !dd) return;

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var open = dd.classList.contains('open');
    dd.classList.toggle('open', !open);
    btn.classList.toggle('open', !open);
  });
  dd.addEventListener('click', function(e) { e.stopPropagation(); });
  document.addEventListener('click', function() {
    dd.classList.remove('open');
    btn.classList.remove('open');
  });
}

// ── Pending Actions — accordion ─────────────────────
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.pa-group').forEach(function(group, i) {
      var hdr = group.querySelector('.pa-group-hdr');
      if (!hdr) return;

      // Wrap all sibling rows in a .pa-rows container
      var rows = Array.from(group.querySelectorAll('.pa-row'));
      if (rows.length) {
        var wrap = document.createElement('div');
        wrap.className = 'pa-rows';
        rows[0].parentNode.insertBefore(wrap, rows[0]);
        rows.forEach(function(r) { wrap.appendChild(r); });
      }

      // Add chevron to header
      var chev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chev.setAttribute('class', 'pa-chev');
      chev.setAttribute('viewBox', '0 0 16 16');
      chev.setAttribute('fill', 'none');
      chev.setAttribute('stroke', 'currentColor');
      chev.setAttribute('stroke-width', '1.5');
      chev.style.cssText = 'width:14px;height:14px';
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M4 6l4 4 4-4');
      chev.appendChild(path);
      hdr.appendChild(chev);

      // Open "Pending Reviews" (index 3) by default, rest collapsed
      if (i === 3) group.classList.add('pa-open');

      // Toggle on click
      hdr.addEventListener('click', function() {
        group.classList.toggle('pa-open');
      });
    });
  });
})();

// ── Pending Actions — view-tab switcher ─────────────
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.pa-vtab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        var card = tab.closest('.card');
        card.querySelectorAll('.pa-vtab').forEach(function(t) {
          t.classList.remove('pa-vtab-active');
        });
        tab.classList.add('pa-vtab-active');
        var target = tab.dataset.patab;
        card.querySelectorAll('.pa-view').forEach(function(view) {
          view.style.display = view.dataset.paview === target ? 'flex' : 'none';
        });
      });
    });
  });
})();

// ── User details dropdown close behaviour ───────────
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var details = document.querySelector('.user-details');
    if (!details) return;

    var roleLabels = {
      'role-pm':     'PM',
      'role-dev':    'DEV',
      'role-design': 'DES',
      'role-qa':     'QA'
    };

    // Close and update role badge when a role item is selected
    details.querySelectorAll('.role-item').forEach(function(label) {
      label.addEventListener('click', function() {
        details.removeAttribute('open');
        var abbr = roleLabels[label.id];
        if (abbr) {
          var roleSpan = details.querySelector('.upb-role');
          if (roleSpan) roleSpan.textContent = abbr;
          var badge = details.querySelector('.udrop-badge');
          if (badge) badge.lastChild.textContent = abbr;
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!details.contains(e.target)) {
        details.removeAttribute('open');
      }
    });
  });
})();
