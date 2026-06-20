# CLAUDE.md — InteractLab: Full Project Reference

> **This file is the source of truth for all future work.**
> It documents what is actually built, every technical decision made,
> every bug fixed, and what to do (and not do) next time.

---

## 0. Project Overview

**InteractLab** is Abdullah's teaching website — a collection of standalone,
client-side-only interactive tools used live in 1-on-1 coding mentor sessions.
No backend. No login. No build step. Everything runs in the browser.

**Hosted on GitHub Pages** (static, HTTPS).
**Also works by double-clicking `index.html`** (file://) — this is a hard requirement
because the mentor sometimes just opens the file locally.

The site has two layers:
1. **Main site shell** — homepage + existing topic tools (bitwise, recursion, sorting)
2. **Week 16 Revision App** — the most complex tool, lives in `/week16-revision-app/`

---

## 1. Repository Structure

```
InteractLab/
├── index.html                        # Homepage — links to all tools
├── topics.html                       # Topics listing page
├── 404.html                          # Roadmap placeholder (not yet built)
├── bitwise-and-number-systems.html   # Existing standalone tool
├── recursion-and-big-o.html          # Existing standalone tool
├── sorting-algorithms.html           # Existing standalone tool
├── sitemap.xml
├── assets/
│   ├── css/site.css                  # Shared design system for ALL pages
│   └── js/site.js                    # Shared JS (mobile nav toggle, copyright year)
└── week16-revision-app/
    ├── index.html                    # App shell — 3 tabs, loads all scripts
    ├── styles.css                    # App-specific styles (builds on site.css)
    ├── app.js                        # Main controller — routing, rendering, state
    ├── pyodide-runner.js             # Pyodide load/execute wrapper
    ├── README.md                     # How to open/host, how to update content
    ├── content/
    │   ├── topics.js                 # 13 topic sections as structured data
    │   └── problems.js               # 10 practice problems as structured data
    └── components/
        ├── inline-runner.js          # Lightweight Try-It runner (Revision tab)
        └── full-ide.js               # CodeMirror 5 IDE (IDE tab)
```

---

## 2. Main Site — Design System (site.css)

The shared design system is in `assets/css/site.css`. Every page links to it.
The week16 app links to it as `../assets/css/site.css`.

**Key CSS variables defined in site.css:**
```css
:root {
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
  --bg: #fafaf9;
  --bg-elevated: #ffffff;
  --bg-muted: #f5f5f4;
  --bg-subtle: #eeede9;
  --text: #0f172a;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;
  --border: rgba(15, 23, 42, 0.08);
  --border-strong: rgba(15, 23, 42, 0.14);
  --radius: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 20px 50px rgba(15, 23, 42, 0.08);
  --teal: #0d9488;
  --teal-dark: #0f766e;
  --teal-light: #ccfbf1;
  --teal-glow: rgba(13, 148, 136, 0.25);
  --purple: #7c3aed;
  --purple-light: #ede9fe;
  --amber: #d97706;
  --amber-light: #fef3c7;
  --blue: #2563eb;
  --blue-light: #dbeafe;
  --green: #059669;
  --green-light: #d1fae5;
  --header-h: 60px;               /* IMPORTANT — used in week16 app layout */
  --content-wide: 1120px;
  --content-narrow: 820px;
}
```

**Dark mode:** `site.css` has a `prefers-color-scheme: dark` block that overrides
bg/text/shadow variables. All components inherit dark mode automatically.

**Components in site.css:** `.site-header`, `.site-nav`, `.site-footer`,
`.tutorial-shell`, `.tutorial-hero`, `.tutorial-main`, `.home-wrap`,
`.home-hero`, `.btn`, `.tutorial-card`, `.tutorial-grid`, `.path-steps`,
`.features-row`, `.home-section`.

**The nav on all tutorial pages** includes a "Python Revision" link pointing to
`week16-revision-app/index.html`. This was added to all 4 existing pages:
`bitwise-and-number-systems.html`, `recursion-and-big-o.html`,
`sorting-algorithms.html`, `topics.html`.

---

## 3. Week 16 Revision App — What It Is

A standalone teaching tool for the **comprehensive revision session** between
Weeks 15 and 17 of Abdullah's coding program. Three tabs:

1. **Revision** — 13 topic sections with analogy callouts, concept cards,
   inline runnable code examples, and "connects to" footers.
2. **Practice** — 10 multi-concept practice problems in a card grid. Click a
   card to open it in the IDE. No auto-grading — mentor verifies output live.
3. **IDE** — CodeMirror 5 editor + output pane. Shows a problem statement +
   hint panel when opened from Practice. Shows a scratch pad when opened
   directly from the IDE tab.

**Student profile:** Beginner, low English proficiency, completed Weeks 1–15.
**Voice:** Simple English, warm, second person, analogy before abstraction.
**Rule:** No week numbers in the UI. Topic names only.

---

## 4. CRITICAL: Tech Stack Decisions (Do Not Change Without Reading This)

### 4A. NO ES Modules

**All JS uses the global namespace pattern, not ES module `import`/`export`.**

Reason: Chrome blocks ES module imports when a page is opened from `file://`
(cross-origin restriction). Since the mentor sometimes double-clicks `index.html`,
ES modules would silently fail and nothing would render.

**The pattern used:**
```js
// topics.js
window.TOPICS = [...];

// problems.js
window.PROBLEMS = [...];

// pyodide-runner.js
window.PyRunner = { runPython, loadPyodideIfNeeded, isPyodideReady };

// inline-runner.js
window.InlineRunner = { create: function(container, code) {...} };

// full-ide.js
window.FullIDE = function(mountEl, options) {...};  // constructor

// app.js — uses all of the above via window globals
```

Scripts are loaded as plain `<script>` tags at the **end of `<body>`** in
dependency order. No `type="module"`. No `defer` needed (end-of-body scripts
run after HTML is parsed). No `DOMContentLoaded` wrapper in app.js — the
`buildRevision()`, `buildPractice()`, `handleHash()` calls run directly.

### 4B. CodeMirror 5 (NOT CodeMirror 6)

**Using CodeMirror 5.65.17 from cdnjs CDN.**

Reason: CodeMirror 6 is ESM-only. It requires `import()` or `<script type="module">`,
both of which fail from `file://` in Chrome. CodeMirror 5 ships as a traditional
script bundle that works from any context.

CDN links in `week16-revision-app/index.html`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/codemirror.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/theme/one-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.17/mode/python/python.min.js"></script>
```

**CodeMirror 5 config used:**
```js
CodeMirror(mountEl, {
  value: starterCode,
  mode: 'python',
  theme: 'one-dark',
  lineNumbers: true,
  indentUnit: 4,
  tabSize: 4,
  indentWithTabs: false,
  lineWrapping: true,
  autofocus: false,
  extraKeys: { Tab: /* indent 4 spaces */ }
});
```

### 4C. Pyodide v0.26.4

**Loaded lazily from jsdelivr CDN on first Run click.**

CDN: `https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js`

Pyodide is NOT loaded on page load. It's injected as a `<script>` tag when the
user first clicks Run. After that it's cached globally (`window.pyodide` via
`loadPyodideIfNeeded()`). First load takes ~5–10 seconds on a decent connection.

### 4D. Script load order in index.html

```html
<!-- CDN: CodeMirror 5 JS (must come first — FullIDE depends on it) -->
<script src="https://cdnjs.cloudflare.com/...codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/...python.min.js"></script>

<!-- App scripts in dependency order -->
<script src="content/topics.js"></script>      <!-- sets window.TOPICS -->
<script src="content/problems.js"></script>    <!-- sets window.PROBLEMS -->
<script src="pyodide-runner.js"></script>      <!-- sets window.PyRunner -->
<script src="components/inline-runner.js"></script>  <!-- sets window.InlineRunner -->
<script src="components/full-ide.js"></script>       <!-- sets window.FullIDE -->
<script src="app.js"></script>                 <!-- runs everything -->
```

---

## 5. Week 16 App — CSS Layout Architecture

### 5A. Tab-bar height variable

`styles.css` defines:
```css
:root { --tab-h: 49px; }
```

This is used alongside `--header-h` (from `site.css`) for calculating sticky
positions and IDE height. If the tab bar ever changes size, update `--tab-h`.

### 5B. View containers

```css
.view { display: none; }

#view-revision.active { display: flex; flex-direction: column; }
#view-practice.active { display: block; }
#view-ide.active {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-h) - var(--tab-h));
  overflow: hidden;
}
```

**Why the IDE has a fixed height:** The IDE must fill exactly the viewport height
below the header and tab bar. Without an explicit height, the flex children
(editor + output) collapse to zero height, making CodeMirror unclickable.

**NEVER add `overflow: hidden` to `body` or `.app-shell` for the IDE.**
This breaks `position: sticky` on the site header, causing it to
detach and overlap the page — the dark editor background then appears as a
"black rectangle" at the top of the page covering the toolbar. The current
approach gives `#view-ide.active` a direct calculated height — no body side effects.

### 5C. Revision sidebar sticky

```css
.topic-sidebar {
  position: sticky;
  top: calc(var(--header-h) + var(--tab-h));
  height: calc(100vh - var(--header-h) - var(--tab-h));
  overflow-y: auto;
  align-self: flex-start;
}
```

**`position: sticky` only works if NO ancestor has `overflow: hidden` or
`overflow: auto`.** The revision layout has no overflow constraints — the
page itself scrolls, and the sidebar sticks within that scroll.

`.topic-content` (the main content area) also has NO `overflow-y: auto`.
The page scrolls naturally. This is intentional.

### 5D. CodeMirror height — JS-driven

**CodeMirror 5 height is set entirely in JavaScript, not CSS.**

The `FullIDE.resize()` method:
1. Reads `this.mountEl.clientHeight` (the `#ide-mount` div's computed pixel height)
2. Falls back to `.editor-pane` height minus the pane header if that returns 0
3. Falls back to 480px as absolute minimum
4. Calls `editor.setSize(null, h)` with the real pixel value
5. Calls `editor.refresh()` to repaint

`resize()` is called:
- 80ms after `init()` (CSS must be applied before measuring)
- 80ms when IDE tab is re-opened (re-measure after DOM settles)
- 80ms when switching problems (panel visibility changes available width)
- On every `window.resize` event

**Never use `editor.setSize('100%', '100%')`.** This sets height to 100% of the
parent, which fails if the parent's height comes purely from flexbox without a
fixed ancestor height. **Never use `editor.refresh()` alone** — it repaints but
does NOT fix a zero-height editor. `setSize(null, px)` is always required.

---

## 6. Week 16 App — JavaScript Architecture

### 6A. Global objects (all set on `window`)

| Global | Set in | What it does |
|---|---|---|
| `window.TOPICS` | `content/topics.js` | Array of 13 topic objects |
| `window.PROBLEMS` | `content/problems.js` | Array of 10 problem objects |
| `window.PyRunner` | `pyodide-runner.js` | Pyodide load/execute wrapper |
| `window.InlineRunner` | `components/inline-runner.js` | Inline Try-It factory |
| `window.FullIDE` | `components/full-ide.js` | CodeMirror IDE constructor |

### 6B. App state (in app.js IIFE)

```js
var state = {
  activeTab:      'revision',   // 'revision' | 'practice' | 'ide'
  activeTopic:    TOPICS[0].id, // currently highlighted sidebar topic
  activeProblem:  null,         // problem object or null (scratch mode)
  ideInstance:    null,         // FullIDE instance (created once, reused)
  ideInitialised: false         // whether initIDE() has been called
};
```

### 6C. Hash routing

| Hash | Result |
|---|---|
| (none) or `#revision` | Revision tab |
| `#revision/topic-id` | Revision tab, scrolls to that topic |
| `#practice` | Practice tab |
| `#ide` | IDE tab, scratch mode |
| `#ide/problem-id` | IDE tab, loads that problem |

Hash is updated via `history.replaceState()` whenever tab or topic changes.
`hashchange` event handles browser back/forward.

### 6D. PyRunner API

```js
window.PyRunner.runPython(code, onProgress)
  // Returns Promise<{ stdout, stderr, error, loadError }>
  // onProgress(message) is called while Pyodide is loading
  // loadError: true means Pyodide itself failed to load (not a Python error)

window.PyRunner.loadPyodideIfNeeded(onProgress)
  // Returns Promise<{ ok, error }>
  // Safe to call multiple times — concurrent callers queue and resolve together

window.PyRunner.isPyodideReady()
  // Returns bool — synchronous check
```

### 6E. FullIDE API

```js
var ide = new window.FullIDE(mountEl, { starterCode: '...' });
ide.init();       // creates CodeMirror, queues resize()
ide.resize();     // measures container, calls setSize(null, h), refresh()
ide.getCode();    // returns string
ide.setCode(s);   // sets editor content
ide.reset();      // restores starterCode
ide.run(outputEl, runBtn);  // runs code via PyRunner, renders result
```

### 6F. InlineRunner API

```js
window.InlineRunner.create(container, code);
// container: a .inline-runner DOM element (with .runner-code, .runner-run-btn, .runner-output inside)
// code: the pre-filled Python code string
// Wires up the Run button, Tab key handling, output display
```

---

## 7. Content Data Format

### 7A. topics.js — Topic object shape

```js
{
  id: 'python-basics',          // kebab-case, used as URL hash and DOM id
  title: 'Python Basics',       // display title
  analogy: 'HTML string...',    // the "remember this" callout — can contain HTML tags
  concepts: [
    {
      title: 'Variables & Types',
      body: 'HTML string...',   // can contain <code>, <strong>, <em>
      type: 'warning',          // optional — adds left amber border
      badge: '⚠️ Common mistake' // optional — shown in concept card header
    }
  ],
  tryItCode: 'Python code as \n-escaped string', // NOT a template literal
  connectsTo: 'plain text string'
}
```

**IMPORTANT:** `tryItCode` must be a regular JS string with `\n` for newlines,
NOT a template literal. Template literals caused issues with the linter and
future edits. Python f-strings like `f"{name}"` are safe in JS strings since
`{name}` without `$` is not interpolated by JavaScript.

### 7B. problems.js — Problem object shape

```js
{
  id: 'p1',                          // used as URL hash
  title: 'Gradebook Builder',
  tags: ['Functions', 'Lists', 'Dictionaries'],
  difficulty: 'easy',                // 'easy' | 'medium' | 'medium-hard'
  statement: 'Multi-line string...',  // shown in problem panel and card
  hint: 'Multi-line string...',       // revealed on click in problem panel
  starterCode: 'Python code...'       // loaded into IDE when problem is opened
}
```

### 7C. The 13 Topics (in order)

| # | id | Title |
|---|---|---|
| 1 | `python-basics` | Python Basics |
| 2 | `conditionals-loops` | Conditionals & Loops |
| 3 | `functions-lists` | Functions & Lists |
| 4 | `dictionaries` | Dictionaries |
| 5 | `file-io` | File I/O |
| 6 | `strings-errors` | Strings & Error Handling |
| 7 | `comprehensions-lambda` | Comprehensions & Lambda |
| 8 | `oop-classes` | OOP — Classes & Objects |
| 9 | `oop-inheritance` | OOP — Encapsulation, Inheritance & Dunders |
| 10 | `recursion` | Recursion |
| 11 | `big-o` | Big-O Notation |
| 12 | `sorting` | Sorting Algorithms |
| 13 | `putting-together` | Putting It All Together |

### 7D. The 10 Practice Problems (in order)

| # | id | Title | Tags | Difficulty |
|---|---|---|---|---|
| 1 | `p1` | Gradebook Builder | Functions, Lists, Dictionaries | Easy |
| 2 | `p2` | CSV Data Processor | File I/O, Error Handling, Dictionaries | Medium |
| 3 | `p3` | Text Cleaner & Analyser | Strings, Comprehensions, Lambda | Easy |
| 4 | `p4` | Library System — Classes from Scratch | OOP, Classes | Medium |
| 5 | `p5` | Extended Library — Inheritance & Dunders | OOP, Inheritance, Dunders | Medium |
| 6 | `p6` | Recursive List Flattener | Recursion | Medium |
| 7 | `p7` | Binary Search Tree — Recursion + OOP | Recursion, OOP | Medium-Hard |
| 8 | `p8` | Big-O Detective | Big-O | Medium |
| 9 | `p9` | Implement Insertion Sort + Justify Big-O | Sorting, Big-O | Medium |
| 10 | `p10` | Student Records Capstone | OOP, File I/O, Sorting, Error Handling | Medium-Hard |

---

## 8. Bugs Encountered and Their Fixes

This section is critical. These bugs were real and cost significant debugging
time. Do not re-introduce these patterns.

### Bug 1: Blank page — ES modules don't work from file://

**Symptom:** Revision tab shows nothing. No errors visible to user.

**Cause:** Original code used `<script type="module">` and `import`/`export`.
Chrome silently blocks ES module cross-origin requests from `file://`.

**Fix:** Converted everything to plain `<script>` tags with `window` globals.
No `import`, no `export`, no `type="module"` anywhere.

### Bug 2: DOMContentLoaded never fired

**Symptom:** After fixing ES modules, content still didn't load.

**Cause:** Inside the module, `document.addEventListener('DOMContentLoaded', ...)`
was called. But with `<script>` at the end of `<body>` (not a module), the DOM
is already parsed when the script runs — `DOMContentLoaded` may have already
fired or the timing is unreliable.

**Fix:** Removed the `DOMContentLoaded` wrapper. `buildRevision()`,
`buildPractice()`, `handleHash()` are called directly at the bottom of app.js
inside the IIFE. Scripts at end of body run after HTML is parsed — no event
needed.

### Bug 3: Sidebar disappears on scroll

**Symptom:** Sidebar is visible on page load but vanishes when the user scrolls
down through the revision topics.

**Cause:** `.view.active` had `overflow: hidden`. This creates a new scroll
container and breaks `position: sticky` on any descendant. Sticky elements only
stick relative to their nearest scrolling ancestor — if that ancestor has
`overflow: hidden`, sticky never activates.

**Fix:**
- Removed `overflow: hidden` from `.view.active` entirely.
- Removed `overflow-y: auto` from `.topic-content` — the PAGE itself now scrolls.
- Sidebar `position: sticky` now sticks relative to the viewport (the body scroll).
- Added `align-self: flex-start` to sidebar so it doesn't stretch to the full
  height of the (potentially very long) content column.

### Bug 4: CodeMirror editor not writable / zero height

**Symptom:** IDE tab opens, editor appears but clicking in it does nothing.

**Cause 1 (original):** `editor.setSize('100%', '100%')` sets CSS height to
`100%` of the parent. If the parent has no explicit pixel height (only a
flex-derived height), `100%` resolves to 0.

**Cause 2 (after first fix attempt):** `editor.refresh()` alone does not change
the editor's height — it only repaints at its current (zero) height.

**Fix:** `FullIDE.resize()` method:
```js
var h = this.mountEl.clientHeight;
if (!h || h < 50) { /* walk up to .editor-pane, subtract header */ }
if (!h || h < 50) h = 480;  // absolute fallback
this.editor.setSize(null, h);  // sets explicit pixel height
this.editor.refresh();          // repaints at new height
```

Called after 80ms delay (so CSS has been applied before measuring).

### Bug 5: Black rectangle covers toolbar / "IDE crashed"

**Symptom:** After opening the IDE tab, a black block appears at the TOP of the
page — sometimes before the IDE view even — covering the Run/Reset buttons and
the problem panel header.

**Cause:** A previous fix tried `body.ide-active { overflow: hidden }` to lock
the page scroll for the IDE. This breaks `position: sticky` on the
`<header class="site-header">`. When sticky fails on the header, the
`app-shell` (which had `height: calc(100vh - header-h)`) starts from `y=0`
instead of below the header. The dark `#1e293b` background of `.cm-editor-wrap`
fills that mis-positioned space, appearing as a black rectangle that overlaps
the toolbar.

**Fix:** Removed ALL `body.ide-active` CSS and JS. Instead, `#view-ide.active`
gets a direct explicit height in CSS:
```css
#view-ide.active {
  height: calc(100vh - var(--header-h) - var(--tab-h));
  overflow: hidden;
}
```

No body manipulation. No `position: sticky` breakage. Clean.

---

## 9. Rules for Future Work

1. **Never add `overflow: hidden` to `body`, `html`, or `.app-shell`** unless
   you have thoroughly verified sticky positioning still works everywhere.

2. **Never use ES module syntax** (`import`/`export`/`type="module"`) in this
   project. Always use `window.Foo = ...` globals.

3. **Never use `editor.setSize('100%', '100%')`** or `editor.refresh()` alone
   to fix CodeMirror height. Always measure the container with `clientHeight`
   and pass a pixel value to `setSize(null, h)`.

4. **Never use template literals for multi-line Python code strings in topics.js
   or problems.js.** Use regular strings with `\n` escapes. Template literals
   caused linter issues.

5. **Never put topic content inline in app.js or index.html.** Content lives
   in `content/topics.js` and `content/problems.js` only. This is what lets
   Abdullah edit wording without touching logic.

6. **Never add week numbers to the UI.** Topic names only. This is a standing
   instruction from Abdullah.

7. **Never add auto-grading.** Practice problems run free — mentor verifies
   output live. No pass/fail states.

8. **Do not upgrade CodeMirror to v6** without solving the file:// constraint
   first (e.g., pre-bundling with esbuild into a single UMD file).

---

## 10. Main Site Integration

The week16 revision app is integrated into the main site:

- **Homepage (`index.html`):** Has a tutorial card linking to
  `week16-revision-app/index.html` with tags: OOP, recursion, Big-O, sorting, Pyodide.
- **All tutorial pages:** `bitwise-and-number-systems.html`,
  `recursion-and-big-o.html`, `sorting-algorithms.html`, `topics.html` — all
  have "Python Revision" added to their `<nav>` linking to the app.
- **The revision app** links back to the main site with
  `<a href="../index.html">` for the logo and "Home" nav link.

---

## 11. Hosting & Deployment

- **GitHub Pages** — push to `main` branch, GitHub deploys automatically.
- All paths are relative — no hardcoded domain or repo name.
- All CDN resources (CodeMirror, Pyodide) are fetched at runtime from
  external CDNs. No local copies of CDN files.
- **Pyodide requires HTTPS or localhost** for full functionality (WASM and
  SharedArrayBuffer APIs). GitHub Pages provides HTTPS. Local `file://` works
  for most Pyodide features (basic Python execution).
- First Pyodide load: ~5–10 seconds on a decent connection, ~10MB download.
  Pyodide is cached by the browser after first load.

---

## 12. What Still Doesn't Exist (Future Work)

- **localStorage persistence** — saving in-progress IDE code per problem
  between sessions. Planned but not implemented.
- **Roadmap page** — `404.html` is a placeholder. A real roadmap/curriculum
  overview page for the full course hasn't been built.
- **Mobile sidebar** — the sidebar is hidden on `<700px` via CSS. On mobile
  there's no way to jump between topics. A dropdown or drawer alternative
  for small screens hasn't been built.
- **Problem filtering by tag** — the practice grid shows all 10 problems. A
  filter by topic tag (e.g., show only OOP problems) would be useful.
- **More InteractLab tools** — the existing three (bitwise, recursion, sorting)
  are complete. Future topics (linked lists, stacks, queues, trees) would each
  get their own standalone tool.

---

## 13. Audience & Content Voice (Unchanged)

- **Student:** Beginner, low English proficiency, completed Weeks 1–15 of
  Abdullah's coding program.
- **Tone:** Simple English, warm, second person, analogy before abstraction.
  Do NOT introduce jargon. Every reviewed concept uses the SAME analogy it was
  originally taught with.
- **Key analogies to preserve:**
  - Variable = labelled box
  - Function = recipe
  - Dictionary = phone book
  - try/except = seatbelt
  - Recursion = Russian nesting dolls
  - Big-O O(log n) = phone book halving strategy
  - Class = blueprint; object = building from that blueprint
  - Inheritance = child learning the family trade
  - Sorting = tidying a bookshelf with different strategies
