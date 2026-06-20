/* Week 16 Revision App — main controller
   Runs after all scripts are loaded (placed at end of <body>).
   Uses globals: window.TOPICS, window.PROBLEMS, window.PyRunner,
                 window.InlineRunner, window.FullIDE */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────────────
  var state = {
    activeTab:      'revision',
    activeTopic:    window.TOPICS[0].id,
    activeProblem:  null,
    ideInstance:    null,
    ideInitialised: false
  };

  // ── DOM refs ───────────────────────────────────────────────────────────────
  var viewRevision = document.getElementById('view-revision');
  var viewPractice = document.getElementById('view-practice');
  var viewIde      = document.getElementById('view-ide');
  var tabBtns      = document.querySelectorAll('.tab-btn');

  // ── Tab routing ────────────────────────────────────────────────────────────
  function activateTab(tabId) {
    state.activeTab = tabId;

    tabBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
      btn.setAttribute('aria-selected', btn.dataset.tab === tabId);
    });

    viewRevision.classList.toggle('active', tabId === 'revision');
    viewPractice.classList.toggle('active', tabId === 'practice');
    viewIde.classList.toggle('active',      tabId === 'ide');

    // Lock page scroll in IDE mode so the editor fills the viewport
    document.body.classList.toggle('ide-active', tabId === 'ide');

    if (tabId === 'ide' && !state.ideInitialised) {
      initIDE(null);
    } else if (tabId === 'ide' && state.ideInstance && state.ideInstance.editor) {
      // Refresh CodeMirror after it becomes visible
      setTimeout(function () { state.ideInstance.editor.refresh(); }, 50);
    }

    var topicSuffix = (tabId === 'revision' && state.activeTopic) ? '/' + state.activeTopic : '';
    try { history.replaceState(null, '', '#' + tabId + topicSuffix); } catch (e) {}
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { activateTab(btn.dataset.tab); });
  });

  // ── Revision tab ───────────────────────────────────────────────────────────
  function buildRevision() {
    var sidebar = document.getElementById('topic-sidebar');
    var content = document.getElementById('topic-content');
    if (!sidebar || !content) return;

    var sidebarHtml = '<div class="sidebar-label">Topics</div>';
    window.TOPICS.forEach(function (t, i) {
      sidebarHtml +=
        '<button class="sidebar-link" data-topic="' + t.id + '" aria-label="Jump to ' + esc(t.title) + '">' +
        '<span class="link-num">' + pad(i + 1) + '</span>' +
        '<span>' + esc(t.title) + '</span>' +
        '</button>';
    });
    sidebar.innerHTML = sidebarHtml;

    content.innerHTML = window.TOPICS.map(buildTopicSection).join('');

    sidebar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-topic]');
      if (!btn) return;
      var id = btn.dataset.topic;
      var section = content.querySelector('#topic-' + id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveTopic(id);
      }
    });

    // Wire inline runners
    content.querySelectorAll('.inline-runner').forEach(function (container) {
      var code = decodeURIComponent(container.dataset.code || '');
      window.InlineRunner.create(container, code);
    });

    // Sidebar highlight via IntersectionObserver
    if (window.IntersectionObserver) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveTopic(entry.target.dataset.topicId);
        });
      }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

      content.querySelectorAll('.topic-section').forEach(function (s) {
        observer.observe(s);
      });
    }
  }

  function setActiveTopic(id) {
    state.activeTopic = id;
    document.querySelectorAll('.sidebar-link').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.topic === id);
    });
    try { history.replaceState(null, '', '#revision/' + id); } catch (e) {}
  }

  function buildTopicSection(t) {
    var conceptsHtml = t.concepts.map(function (c) {
      return '<div class="concept-card' + (c.type === 'warning' ? ' warning' : '') + '">' +
        '<div class="concept-header">' +
        '<span class="concept-title">' + esc(c.title) + '</span>' +
        (c.badge ? '<span class="concept-badge">' + c.badge + '</span>' : '') +
        '</div>' +
        '<div class="concept-body">' + c.body + '</div>' +
        '</div>';
    }).join('');

    var runnerHtml = '';
    if (t.tryItCode) {
      var encoded = encodeURIComponent(t.tryItCode);
      runnerHtml =
        '<div class="inline-runner" data-code="' + encoded + '">' +
        '<div class="runner-header">' +
        '<span class="runner-label">Try It</span>' +
        '<button class="runner-run-btn" aria-label="Run code">&#9654; Run</button>' +
        '</div>' +
        '<textarea class="runner-code" spellcheck="false" aria-label="Editable Python code"></textarea>' +
        '<div class="runner-output" role="log" aria-live="polite"></div>' +
        '</div>';
    }

    return '<section class="topic-section" id="topic-' + t.id + '" data-topic-id="' + t.id + '">' +
      '<h2>' + esc(t.title) + '</h2>' +
      '<div class="analogy-card">' +
      '<div class="analogy-icon">&#128161;</div>' +
      '<div class="analogy-text">' + t.analogy + '</div>' +
      '</div>' +
      '<div class="concepts-grid">' + conceptsHtml + '</div>' +
      runnerHtml +
      '<div class="connects-to">' +
      '<span class="connects-to-label">Connects to</span>' +
      '<span>' + esc(t.connectsTo) + '</span>' +
      '</div>' +
      '</section>';
  }

  // ── Practice tab ───────────────────────────────────────────────────────────
  function buildPractice() {
    var container = document.getElementById('practice-content');
    if (!container) return;

    var diffLabel = { easy: '&#9989; Easy', medium: '&#128993; Medium', 'medium-hard': '&#128308; Medium-Hard' };

    var html = '<div class="practice-header">' +
      '<h2>Practice Problems</h2>' +
      '<p>10 multi-concept problems. Click any card to open it in the IDE. Your mentor checks your output live — no auto-grading.</p>' +
      '</div>' +
      '<div class="problems-grid">';

    window.PROBLEMS.forEach(function (p, i) {
      var firstLine = p.statement.split('\n')[0];
      html +=
        '<button class="problem-card" data-problem="' + p.id + '" aria-label="Open: ' + esc(p.title) + '">' +
        '<div class="problem-card-top">' +
        '<span class="problem-num">Problem ' + (i + 1) + '</span>' +
        '<span class="difficulty-badge ' + p.difficulty + '">' + (diffLabel[p.difficulty] || p.difficulty) + '</span>' +
        '</div>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(firstLine) + '</p>' +
        '<div class="problem-tags">' +
        p.tags.map(function (tag) { return '<span class="problem-tag">' + esc(tag) + '</span>'; }).join('') +
        '</div>' +
        '<div class="open-ide-arrow">Open in IDE &#8594;</div>' +
        '</button>';
    });

    html += '</div>';
    container.innerHTML = html;

    container.addEventListener('click', function (e) {
      var card = e.target.closest('[data-problem]');
      if (card) openProblemInIDE(card.dataset.problem);
    });
  }

  // ── IDE tab ────────────────────────────────────────────────────────────────
  function initIDE(problemId) {
    state.ideInitialised = true;
    var problem = problemId ? (window.PROBLEMS.filter(function (p) { return p.id === problemId; })[0] || null) : null;
    state.activeProblem = problem;

    renderIDEPanel(problem);

    var mountEl      = document.getElementById('ide-mount');
    var outputEl     = document.getElementById('ide-output');
    var runBtn       = document.getElementById('ide-run-btn');
    var resetBtn     = document.getElementById('ide-reset-btn');
    var clearBtn     = document.getElementById('ide-clear-btn');
    var scratchLabel = document.getElementById('ide-scratch-label');

    var starterCode = problem ? problem.starterCode : defaultScratchCode();
    if (scratchLabel) scratchLabel.textContent = problem ? '' : 'Scratch pad — write anything';

    if (state.ideInstance) {
      state.ideInstance.starterCode = starterCode;
      state.ideInstance.reset();
    } else {
      state.ideInstance = new window.FullIDE(mountEl, { starterCode: starterCode });
      state.ideInstance.init();
    }

    outputEl.innerHTML = '<div class="output-idle">Output will appear here after you click Run.</div>';

    if (runBtn)   runBtn.onclick   = function () { state.ideInstance.run(outputEl, runBtn); };
    if (resetBtn) resetBtn.onclick = function () {
      state.ideInstance.reset();
      outputEl.innerHTML = '<div class="output-idle">Code reset. Click Run to execute.</div>';
    };
    if (clearBtn) clearBtn.onclick = function () {
      outputEl.innerHTML = '<div class="output-idle">Output cleared.</div>';
    };
  }

  function openProblemInIDE(problemId) {
    state.ideInitialised = false;
    activateTab('ide');
    initIDE(problemId);
    try { history.replaceState(null, '', '#ide/' + problemId); } catch (e) {}
  }

  function renderIDEPanel(problem) {
    var panel = document.getElementById('ide-problem-panel');
    if (!panel) return;

    if (!problem) { panel.classList.add('hidden'); return; }

    panel.classList.remove('hidden');
    var diffLabel = { easy: '&#9989; Easy', medium: '&#128993; Medium', 'medium-hard': '&#128308; Medium-Hard' };

    panel.innerHTML =
      '<div class="problem-panel-header">' +
      '<h3>' + esc(problem.title) + '</h3>' +
      '<div class="problem-panel-meta">' +
      '<span class="difficulty-badge ' + problem.difficulty + '">' + (diffLabel[problem.difficulty] || problem.difficulty) + '</span>' +
      problem.tags.map(function (t) { return '<span class="problem-tag">' + esc(t) + '</span>'; }).join('') +
      '</div>' +
      '</div>' +
      '<div class="problem-panel-body">' +
      '<div class="problem-statement">' + esc(problem.statement) + '</div>' +
      '<button class="hint-toggle" aria-expanded="false">&#128161; Show Hint</button>' +
      '<div class="hint-body">' + esc(problem.hint) + '</div>' +
      '</div>';

    var hintBtn  = panel.querySelector('.hint-toggle');
    var hintBody = panel.querySelector('.hint-body');
    hintBtn.addEventListener('click', function () {
      var open = hintBody.classList.toggle('open');
      hintBtn.innerHTML = open ? '&#128161; Hide Hint' : '&#128161; Show Hint';
      hintBtn.setAttribute('aria-expanded', open);
    });
  }

  function defaultScratchCode() {
    return '# Scratch pad — write any Python here\n# Click Run to execute\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nnames = ["Alice", "Bob", "Cass"]\nfor name in names:\n    print(greet(name))\n';
  }

  // ── Hash routing ───────────────────────────────────────────────────────────
  function handleHash() {
    var hash = (location.hash || '').replace('#', '');
    if (!hash) { activateTab('revision'); return; }

    var parts = hash.split('/');
    var tab   = parts[0];
    var sub   = parts[1];

    if (tab === 'practice') {
      activateTab('practice');
    } else if (tab === 'ide') {
      activateTab('ide');
      if (sub) initIDE(sub);
      else if (!state.ideInitialised) initIDE(null);
    } else {
      activateTab('revision');
      if (sub) {
        var section = document.getElementById('topic-' + sub);
        if (section) {
          setTimeout(function () { section.scrollIntoView({ block: 'start' }); }, 80);
          setActiveTopic(sub);
        }
      }
    }
  }

  window.addEventListener('hashchange', handleHash);

  // ── Mobile nav toggle ──────────────────────────────────────────────────────
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav   = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  // ── Boot ───────────────────────────────────────────────────────────────────
  buildRevision();
  buildPractice();
  handleHash();

})();
