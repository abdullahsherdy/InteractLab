import { topics }            from './content/topics.js';
import { problems }           from './content/problems.js';
import { createInlineRunner } from './components/inline-runner.js';
import { FullIDE }            from './components/full-ide.js';

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  activeTab:      'revision',
  activeTopic:    topics[0].id,
  activeProblem:  null,
  ideInstance:    null,
  ideInitialised: false,
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const viewRevision = document.getElementById('view-revision');
const viewPractice = document.getElementById('view-practice');
const viewIde      = document.getElementById('view-ide');
const tabBtns      = document.querySelectorAll('.tab-btn');

// ─── Tab routing ─────────────────────────────────────────────────────────────
function activateTab(tabId) {
  state.activeTab = tabId;

  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
    btn.setAttribute('aria-selected', btn.dataset.tab === tabId);
  });

  viewRevision.classList.toggle('active', tabId === 'revision');
  viewPractice.classList.toggle('active', tabId === 'practice');
  viewIde.classList.toggle('active',      tabId === 'ide');

  if (tabId === 'ide' && !state.ideInitialised) {
    initIDE(null);
  }

  const topicHash = tabId === 'revision' && state.activeTopic ? `/${state.activeTopic}` : '';
  history.replaceState(null, '', `#${tabId}${topicHash}`);
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(btn.dataset.tab); }
  });
});

// ─── Revision tab ────────────────────────────────────────────────────────────
function buildRevision() {
  const sidebar   = document.getElementById('topic-sidebar');
  const content   = document.getElementById('topic-content');

  sidebar.innerHTML = `<div class="sidebar-label">Topics</div>` +
    topics.map((t, i) =>
      `<button class="sidebar-link" data-topic="${t.id}" aria-label="Jump to ${t.title}">
         <span class="link-num">${String(i + 1).padStart(2, '0')}</span>
         <span>${t.title}</span>
       </button>`
    ).join('');

  content.innerHTML = topics.map(t => buildTopicSection(t)).join('');

  sidebar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-topic]');
    if (!btn) return;
    const id = btn.dataset.topic;
    const section = content.querySelector(`#topic-${id}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveTopic(id);
    }
  });

  // Wire up inline runners
  content.querySelectorAll('.inline-runner').forEach(container => {
    const code = decodeURIComponent(container.dataset.code || '');
    createInlineRunner(container, code);
  });

  // Intersection observer for sidebar highlight
  const sections = content.querySelectorAll('.topic-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveTopic(entry.target.dataset.topicId);
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

function setActiveTopic(id) {
  state.activeTopic = id;
  document.querySelectorAll('.sidebar-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.topic === id);
  });
  history.replaceState(null, '', `#revision/${id}`);
}

function buildTopicSection(t) {
  const conceptsHtml = t.concepts.map(c => {
    const isWarning = c.type === 'warning';
    return `
      <div class="concept-card${isWarning ? ' warning' : ''}">
        <div class="concept-header">
          <span class="concept-title">${escHtml(c.title)}</span>
          ${c.badge ? `<span class="concept-badge">${escHtml(c.badge)}</span>` : ''}
        </div>
        <div class="concept-body">${c.body}</div>
      </div>`;
  }).join('');

  const encodedCode = encodeURIComponent(t.tryItCode || '');
  const runnerHtml = t.tryItCode ? `
    <div class="inline-runner" data-code="${encodedCode}">
      <div class="runner-header">
        <span class="runner-label">Try It</span>
        <button class="runner-run-btn" aria-label="Run code">▶ Run</button>
      </div>
      <textarea class="runner-code" spellcheck="false" aria-label="Editable Python code"></textarea>
      <div class="runner-output" role="log" aria-live="polite"></div>
    </div>` : '';

  return `
    <section class="topic-section" id="topic-${t.id}" data-topic-id="${t.id}">
      <h2>${escHtml(t.title)}</h2>
      <div class="analogy-card">
        <div class="analogy-icon">💡</div>
        <div class="analogy-text">${t.analogy}</div>
      </div>
      <div class="concepts-grid">${conceptsHtml}</div>
      ${runnerHtml}
      <div class="connects-to">
        <span class="connects-to-label">Connects to</span>
        <span>${escHtml(t.connectsTo)}</span>
      </div>
    </section>`;
}

// ─── Practice tab ────────────────────────────────────────────────────────────
function buildPractice() {
  const container = document.getElementById('practice-content');
  const diffLabel = { easy: '✅ Easy', medium: '🟡 Medium', 'medium-hard': '🔴 Medium-Hard' };

  container.innerHTML = `
    <div class="practice-header">
      <h2>Practice Problems</h2>
      <p>10 multi-concept problems. Click any card to open it in the IDE. Your mentor verifies your output live — no auto-grading.</p>
    </div>
    <div class="problems-grid">
      ${problems.map((p, i) => `
        <button class="problem-card" data-problem="${p.id}" aria-label="Open problem: ${escHtml(p.title)}">
          <div class="problem-card-top">
            <span class="problem-num">Problem ${i + 1}</span>
            <span class="difficulty-badge ${p.difficulty}">${diffLabel[p.difficulty] || p.difficulty}</span>
          </div>
          <h3>${escHtml(p.title)}</h3>
          <p>${escHtml(p.statement.split('\n')[0])}</p>
          <div class="problem-tags">
            ${p.tags.map(tag => `<span class="problem-tag">${escHtml(tag)}</span>`).join('')}
          </div>
          <div class="open-ide-arrow">Open in IDE →</div>
        </button>`
      ).join('')}
    </div>`;

  container.addEventListener('click', (e) => {
    const card = e.target.closest('[data-problem]');
    if (!card) return;
    openProblemInIDE(card.dataset.problem);
  });
}

// ─── IDE tab ─────────────────────────────────────────────────────────────────
async function initIDE(problemId) {
  state.ideInitialised = true;
  const problem = problemId ? problems.find(p => p.id === problemId) : null;
  state.activeProblem = problem || null;

  renderIDEPanel(problem);

  const mountEl = document.getElementById('ide-mount');
  const outputEl = document.getElementById('ide-output');
  const runBtn   = document.getElementById('ide-run-btn');
  const resetBtn = document.getElementById('ide-reset-btn');
  const clearBtn = document.getElementById('ide-clear-btn');
  const scratchLabel = document.getElementById('ide-scratch-label');

  const starterCode = problem ? problem.starterCode : defaultScratchCode();

  if (scratchLabel) {
    scratchLabel.textContent = problem ? '' : 'Scratch pad — write anything';
  }

  if (state.ideInstance) {
    state.ideInstance.starterCode = starterCode;
    state.ideInstance.reset();
  } else {
    state.ideInstance = new FullIDE(mountEl, { starterCode });
    await state.ideInstance.init();
  }

  outputEl.innerHTML = '<div class="output-idle">Output will appear here after you click Run.</div>';

  if (runBtn) {
    runBtn.onclick = () => state.ideInstance.run(outputEl, runBtn);
  }
  if (resetBtn) {
    resetBtn.onclick = () => {
      state.ideInstance.reset();
      outputEl.innerHTML = '<div class="output-idle">Code reset to starter. Output will appear here after you click Run.</div>';
    };
  }
  if (clearBtn) {
    clearBtn.onclick = () => {
      outputEl.innerHTML = '<div class="output-idle">Output cleared.</div>';
    };
  }
}

function openProblemInIDE(problemId) {
  state.ideInitialised = false;
  activateTab('ide');
  initIDE(problemId);
  history.replaceState(null, '', `#ide/${problemId}`);
}

function renderIDEPanel(problem) {
  const panel = document.getElementById('ide-problem-panel');
  if (!panel) return;

  if (!problem) {
    panel.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  const diffLabel = { easy: '✅ Easy', medium: '🟡 Medium', 'medium-hard': '🔴 Medium-Hard' };

  panel.innerHTML = `
    <div class="problem-panel-header">
      <h3>${escHtml(problem.title)}</h3>
      <div class="problem-panel-meta">
        <span class="difficulty-badge ${problem.difficulty}">${diffLabel[problem.difficulty] || problem.difficulty}</span>
        ${problem.tags.map(t => `<span class="problem-tag">${escHtml(t)}</span>`).join('')}
      </div>
    </div>
    <div class="problem-panel-body">
      <div class="problem-statement">${escHtml(problem.statement)}</div>
      <button class="hint-toggle" aria-expanded="false">
        💡 Show Hint
      </button>
      <div class="hint-body">${escHtml(problem.hint)}</div>
    </div>`;

  const hintBtn  = panel.querySelector('.hint-toggle');
  const hintBody = panel.querySelector('.hint-body');
  hintBtn.addEventListener('click', () => {
    const open = hintBody.classList.toggle('open');
    hintBtn.textContent = open ? '💡 Hide Hint' : '💡 Show Hint';
    hintBtn.setAttribute('aria-expanded', open);
  });
}

function defaultScratchCode() {
  return `# Scratch pad — write any Python here
# Click Run to execute it in your browser

def greet(name):
    return f"Hello, {name}!"

names = ["Alice", "Bob", "Cass"]
for name in names:
    print(greet(name))
`;
}

// ─── Hash routing ────────────────────────────────────────────────────────────
function handleHash() {
  const hash = location.hash.replace('#', '');
  if (!hash) { activateTab('revision'); return; }

  const [tab, sub] = hash.split('/');

  if (tab === 'practice') {
    activateTab('practice');
  } else if (tab === 'ide') {
    activateTab('ide');
    if (sub) initIDE(sub);
    else if (!state.ideInitialised) initIDE(null);
  } else {
    activateTab('revision');
    if (sub) {
      const section = document.getElementById(`topic-${sub}`);
      if (section) {
        setTimeout(() => section.scrollIntoView({ block: 'start' }), 100);
        setActiveTopic(sub);
      }
    }
  }
}

window.addEventListener('hashchange', handleHash);

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildRevision();
  buildPractice();
  handleHash();

  // Mobile nav toggle (shared with site.js pattern)
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  // Copyright year
  const yr = document.getElementById('copyright-year');
  if (yr) yr.textContent = new Date().getFullYear();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
