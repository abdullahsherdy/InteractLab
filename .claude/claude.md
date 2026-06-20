# CLAUDE.md — Week 16 Revision Web App
## Full Build Spec & Working Instructions

---

## 0. What This Is

A **standalone, client-side-only web application** used live in a mentor session as
**Week 16: the comprehensive revision week**, sitting between Week 15 (last regular
content week) and Week 17 (Stacks & Queues — start of the DSA-heavy phase).

This is NOT a docx. This is NOT a normal weekly guide. It is a teaching tool: a single
HTML/CSS/JS app (no backend, no build step required to run it — open `index.html` and
it works) that lets the mentor walk the student through everything learned so far,
let the student run real code inline as concepts are reviewed, then move into a bank
of harder, multi-concept practice problems with a full IDE.

No server-side code anywhere. No login, no persistence beyond `localStorage` is NOT
allowed inside Claude-generated artifacts in other contexts, but **this app is a
standalone file delivered to run outside Claude.ai, in the student's own browser** —
so normal `localStorage` IS fine here for saving in-progress code between problems.
(This restriction only applies to Claude.ai Artifacts, not to delivered HTML files.)

---

## 1. Audience & Voice

- **Student:** Beginner, low English proficiency, has now completed Weeks 1–15.
  Confident with basics, functions, OOP (with effort), recursion (with effort),
  Big-O (conceptual), sorting algorithms.
- **Tone:** Same as all prior materials — simple English, warm, second person,
  analogy before abstraction. Do NOT introduce new jargon. Every concept
  reviewed here should use the SAME analogy it was originally taught with
  (see Section 4 below — these are not new explanations, they are reminders).
- **Session context:** This is used live, mentor driving or co-driving with the
  student at the keyboard. The mentor may jump around — this is why tab-based
  nav with deep-linkable sections matters.

---

## 2. Critical Constraint: Do Not Reference Week Numbers in the UI

Per explicit instruction: **the guide must NOT label sections by week number.**
Organize and label everything by **topic only**. Internally (in this CLAUDE.md,
in code comments) it's fine to map topics back to weeks for content-accuracy
purposes, but nothing user-facing should say "Week 3" or "Week 9" etc.

Use topic names as section identifiers: "Functions", "Lists & Dictionaries",
"File I/O & Errors", "OOP — Classes & Objects", "OOP — Inheritance & Dunders",
"Recursion", "Big-O Notation", "Sorting Algorithms", etc.

---

## 3. Tech Stack (Locked Decisions)

| Decision | Choice | Why |
|---|---|---|
| Framework | **None — vanilla HTML/CSS/JS** (or vanilla + small utility libs if needed) | No server, no build step, must run by double-clicking `index.html` or simple static hosting |
| Python execution | **Pyodide** (WebAssembly CPython), loaded from CDN, cached after first load | Confirmed acceptable — students have decent internet |
| Code editor component | **CodeMirror 6** (via CDN/ESM) — syntax highlighting, line numbers, indent handling | Lightweight, no build step needed, good mobile support |
| Persistence | `localStorage` for in-progress student code per problem (optional nice-to-have, not core requirement) | This is a delivered standalone app, not a Claude.ai artifact — localStorage is fine here |
| Hosting/delivery | Single folder: `index.html`, `styles.css`, `app.js` (or a few split JS modules), no Node build step required at runtime | Mentor just opens the file or drops it on simple static hosting |

**Pyodide loading strategy:**
- Load Pyodide lazily — NOT on initial page load. Trigger the load (with a visible
  loading state) the first time the student clicks "Run" on ANY code block (inline
  try-it or full IDE). Cache the loaded instance globally for the rest of the session.
- Show a clear, friendly loading indicator the first time ("Setting up Python in
  your browser — this happens once and takes a few seconds...").
- Handle the case where Pyodide fails to load (offline, blocked CDN) gracefully —
  show a clear error, don't break the rest of the app.

---

## 4. Content Scope — Topics to Cover (Weeks 1–15, topic-labeled)

Source of truth for accuracy: the original weekly guides' content (referenced via
the established analogies/patterns below — re-derive details consistently with how
this program has always taught them). Organize as **13 topic sections**, in this order:

1. **Python Basics** — variables, types, type conversion, f-strings, input/output
2. **Conditionals & Loops** — if/elif/else, for, while, break/continue
3. **Functions & Lists** — def, return vs print (⚠️ flagged concept), parameters,
   default params (⚠️ mutable default argument trap — flagged concept), list
   indexing/slicing, append/pop
4. **Dictionaries** — key-value pairs, `.get()`, `.items()`, looping, list vs dict
5. **File I/O** — open/with, read/write, CSV basics, FileNotFoundError
6. **Strings & Basic Error Handling** — string methods, slicing, try/except,
   common exceptions
7. **Advanced Operators, Comprehensions & Lambda** — all operators, bitwise intro,
   list/dict comprehensions, lambda
8. **OOP — Classes & Objects** — class, `__init__`, self, instance methods,
   class/static methods
9. **OOP — Encapsulation, Inheritance, Dunders** — `_protected`, `@property`,
   inheritance, `super()`, `__str__`, `__len__`
10. **Recursion** — base case, call stack, factorial, Fibonacci, string reversal
11. **Big-O Notation** — O(1)/O(n)/O(n²)/O(log n)/O(n log n), the phone book
    analogy, the 4 analysis rules, space complexity
12. **Sorting Algorithms** — bubble, selection, insertion, merge, quick, stability
13. **Putting It All Together** — a short closing section explicitly connecting
    recursion + OOP + Big-O as the three pillars the next phase (data structures)
    depends on, since Stacks/Queues/Linked Lists/Trees all lean on these three.

### Two Concepts Requiring Extra (Triple) Emphasis
Per established program priorities, these get a concept card AND a tip AND a row
in the common-mistakes table, same as always:
- **`return` vs `print`**
- **Mutable default arguments** (`def f(scores=[])` trap)

### Each Topic Section Should Contain
- A short "remember the analogy" callout (re-use the original analogy, don't invent
  a new one)
- 1–2 compact concept reminders (not full re-teaching — this is revision, assume
  prior exposure, just refresh)
- One inline "Try It" runnable code snippet per section (lightweight runner, see
  Section 6) demonstrating the core idea
- A one-line "connects to" note showing what later topic depends on this one
  (e.g., Recursion → "this is the engine behind tree traversal, coming up next")

Do not pad this into 15 full lesson guides. This is revision — tight, scannable,
fast to navigate live in a session. Favor concept cards + runnable examples over
long prose.

---

## 5. App Structure — Tab-Based Shell

Three top-level tabs/views (confirmed):

1. **Revision** — the 13 topic sections from Section 4, navigable via a sidebar or
   top topic-picker within the tab (since there are 13 sections, some in-tab nav
   is needed — a left rail of topic links with active-state highlighting and smooth
   scroll/jump works well)
2. **Practice** — the 10 practice problems (see Section 7), browsable as a list/grid
   with topic tags and difficulty, click into a problem to open it
3. **IDE** — the full-featured code IDE (see Section 8), which a problem from the
   Practice tab opens into, but should also be reachable as a blank scratch IDE
   directly from the tab itself (so the mentor can free-code anytime)

**Navigation requirements:**
- Persistent top-level tab bar, clearly indicating active tab
- Keyboard accessible (tab/arrow navigation between tabs, Enter/Space to activate)
- State should persist reasonably when switching tabs (e.g., don't lose IDE code
  if the mentor flips to Revision and back)
- Deep-linkable where reasonable (e.g., `#practice/problem-4` or `#revision/recursion`)
  using simple hash routing — no router library needed

---

## 6. Inline "Try It" Runner (Lightweight, for Revision tab)

- Small, embedded directly under each concept's code example
- Pre-filled with the example code (editable)
- Single "Run ▶" button, output appears directly below (stdout captured from Pyodide)
- No file I/O, no test cases, no starter-code scaffolding — just run and see output
- Should be visually distinct from the full Practice IDE (smaller, lighter chrome)
  so it reads as "quick demo" not "real workspace"
- Errors from Python should be shown clearly but not alarmingly (this is a learning
  tool — a traceback is useful information, style it readably, not as a scary red wall)

---

## 7. Practice Problems — 10 Problems, Multi-Concept, No Auto-Grading

**Confirmed approach:** ~10 problems, each meatier and spanning multiple topics
rather than many small single-concept drills. **No automated output checking** —
free-run only, mentor verifies correctness live. This matters for design — no
test-runner UI, no pass/fail state needed, just Run + Output.

**Each problem needs:**
- Title
- Topic tags (multi — e.g., `["OOP", "Recursion"]`) for future filtering even
  though there's no week number shown
- Difficulty badge (reuse existing palette: ✅ Easy, 🟡 Medium, 🔴 Medium-Hard —
  consistent with established practice sheet conventions)
- Problem statement (plain English, a real-world framing per program convention —
  gradebook/inventory/contact-book style scenarios)
- A hint (revealed on click/toggle, not shown by default — guides without
  solving it for them)
- Starter code in the IDE when opened (some structure but NOT a full solution —
  consistent with the "no starter code for OOP reinforcement exercises" rule:
  for OOP-heavy problems, give an empty shell/docstring only, not method bodies)

**Suggested 10-problem spread (design these for real multi-concept depth):**
1. Functions + Lists + Dictionaries — e.g., build and query a small gradebook
2. File I/O + Error Handling + Dictionaries — e.g., read a CSV, handle bad rows safely
3. Strings + Comprehensions + Lambda — e.g., clean/filter/transform a dataset of text
4. OOP Classes & Objects (from scratch, no starter method bodies) — e.g., model a
   real-world entity (Library/Inventory item) with validation
5. OOP Inheritance + Dunders — e.g., extend problem 4's class hierarchy, add
   `__str__`/`__len__`/`@property`
6. Recursion — e.g., a recursive problem that isn't factorial/Fibonacci (program
   has already covered those) — something like recursive directory-size style or
   recursive flatten-a-nested-list
7. Recursion + OOP combined — e.g., a recursive method on a class (foreshadows
   trees/linked lists next phase)
8. Big-O Analysis — given 2–3 code snippets (not just sorts), identify and justify
   their Big-O; mentor verifies reasoning, not output
9. Sorting + Big-O — implement one sort from scratch AND explain why it's that
   complexity in a comment/docstring
10. Capstone-style mixed problem — combines OOP + file I/O + a loop/sort, e.g.
    "load student records from data, build objects, sort by score, report stats"
    — deliberately the hardest, meant to feel like a small real program

Feel free to refine exact scenarios, but keep the topic-spread above (this
maps every major Week 1–15 pillar to at least one problem, with the back half
deliberately foreshadowing OOP+Recursion as prerequisites for Weeks 17–24, per
established program rationale).

---

## 8. Full Practice IDE (for Practice tab problems + scratch use)

- Built on CodeMirror 6, Python syntax highlighting
- Layout: code editor pane + output console pane (split, resizable or fixed
  sensible proportions — test on a typical laptop screen, this runs live in
  session so it must be comfortable to read at presentation size/projector too)
- Controls: Run ▶, Reset (restores starter code), Clear Output
- When opened from a Practice problem: shows problem statement + hint toggle
  alongside the editor (collapsible side panel so the editor can go full width
  if needed)
- When opened as scratch IDE from the tab directly: no problem panel, just a
  clean blank editor
- stdout/stderr from Pyodide captured and displayed in output pane, errors
  styled readably (see Section 6 note on tracebacks)
- Loading state while Pyodide initializes (shared/shown once per session,
  not re-shown if already loaded from the inline runner)

---

## 9. Visual Identity (MUST match existing program materials)

Reuse the established palette from prior docx materials — this keeps visual
continuity across all of Abdullah's teaching materials:

```css
:root {
  --navy: #1B3A5C;
  --teal: #0D7377;
  --teal-light: #E6F4F4;
  --amber: #B45309;
  --amber-light: #FEF3C7;
  --green: #15803D;
  --green-light: #DCFCE7;
  --red: #B91C1C;
  --red-light: #FEE2E2;
  --orange: #C2410C;
  --orange-light: #FFEDD5;
  --purple: #6D28D9;
  --purple-light: #EDE9FE;
  --blue: #1D4ED8;
  --blue-light: #DBEAFE;
  --gray: #6B7280;
  --gray-light: #F3F4F6;
  --white: #FFFFFF;
  --black: #111827;
  --code-bg: #1E293B;
  --code-text: #E2E8F0;
}
```

- Dark code blocks (`--code-bg` / `--code-text`), Courier New / monospace,
  matching the docx materials exactly
- Concept cards with colored left-accent borders, consistent with the docx
  `conceptCard()` visual pattern (colored header strip + body)
- Difficulty badges reuse the established style: ✅ Easy (green), 🟡 Medium
  (amber), 🔴 Medium-Hard (red)
- This is also referenced as visually consistent with `bitwise_number_Sys.html`
  — the established CSS variable system and component look for all prior
  interactive HTML tools in this program. If that file is available when this
  is built, load and match it directly rather than reinventing from this list.

---

## 10. UX Requirements (Senior Front-End Bar)

- **Accessibility:** semantic HTML, proper heading hierarchy, ARIA labels on
  tab controls and the IDE run/reset buttons, sufficient color contrast
  (verify amber/red text-on-light combos meet WCAG AA), full keyboard
  navigability (tabs, accordions, run buttons — no mouse-only interactions),
  visible focus states
- **Responsive:** must work reasonably on a laptop (primary use case — live
  session) down to tablet width; mobile-friendly is a bonus, not the priority
- **Animations:** purposeful, not decorative noise — section transitions,
  tab switches, hint reveal, output appearing after Run. Respect
  `prefers-reduced-motion`.
- **Performance:** Pyodide is the heavy cost (~6-20MB) — lazy-load it, show
  real progress/loading feedback, never block the UI thread during execution
  (Pyodide should run in a way that doesn't freeze tab-switching — consider
  running Pyodide in a Web Worker if straightforward, otherwise ensure the
  loading/running states are clearly communicated so freezes don't read as bugs)
- **Error states:** Pyodide load failure, Python runtime errors, empty
  code-run — all need clear, friendly, non-scary handling appropriate for
  a beginner audience

---

## 11. File Deliverables

```
/week16-revision-app/
├── index.html          # shell, tab structure, mounts everything
├── styles.css           # full visual system (Section 9)
├── app.js                # tab routing, state management
├── pyodide-runner.js     # Pyodide load/init/execute wrapper, shared by both IDEs
├── content/
│   ├── topics.js         # the 13 topic sections' content as structured data
│   └── problems.js        # the 10 practice problems as structured data
├── components/
│   ├── inline-runner.js   # lightweight Try-It component (Section 6)
│   └── full-ide.js        # CodeMirror-based Practice IDE (Section 8)
└── README.md              # how to open/host this, how to update content later
```

Keep content (topic text, problem statements) in data files (`topics.js`,
`problems.js`) separate from rendering logic — makes it easy for Abdullah to
edit wording later without touching app logic.

---

## 12. Build Order (Recommended)

1. Static shell: tab bar, 3 empty views, routing, visual system in place
2. Revision tab: render all 13 topics from structured data, sidebar nav working
3. Pyodide wrapper: load-on-demand, execute(code) → {stdout, stderr}, with loading UI
4. Inline Try-It runner wired into Revision tab code examples
5. Practice tab: problem list/grid, tags, difficulty badges, click-through
6. Full IDE: CodeMirror integration, problem panel, Run/Reset/Clear, wired to
   the same Pyodide wrapper
7. Polish pass: animations, accessibility audit, responsive check, error states
8. Content accuracy pass: verify every topic section and problem against the
   actual established teaching content/analogies from Weeks 1–15

---

## 13. Open Questions to Resolve Before/During Build

- Exact wording for each of the 13 "remember the analogy" callouts — should
  pull verbatim from how each concept was originally taught (function = recipe,
  dict = phone book, try/except = seatbelt, O(log n) = phone book halving, etc.)
  to stay consistent — confirm these analogies if a build session has access to
  the full set of prior weekly guides, or re-derive carefully if not.
- Final exact scenarios/wording for the 10 practice problems (Section 7 gives
  the topic spread and shape — word them in the same plain-English, real-world
  style as existing practice sheets).
- Whether `bitwise_number_Sys.html` is available to pull exact CSS values from
  directly, or whether the palette in Section 9 should be used as the sole source.

---

## 14. Non-Goals (Explicitly Out of Scope)

- No backend, no database, no user accounts
- No auto-grading / test-case validation on practice problems
- No week numbers anywhere in the UI
- No new frameworks (React/Vue/etc.) unless a future session explicitly
  decides one is warranted — default is vanilla JS + CodeMirror
- Not a replacement for the docx weekly guides — this is a session tool only