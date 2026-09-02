# Lnked Lists — Visualizer Build Brief

>This file is a build brief for Claude Code / Codex
> to add a new InteractLab tool: `linked-lists.html`.
>
> Follow `CLAUDE.md` (InteractLab) tech constraints exactly — see **Build
> Constraints** at the bottom before writing any code.

---

## 1. Topic Overview

Every structure the student has used so far (lists, strings, hash tables)
lives in one continuous block of memory — instant index access. Linked lists
flip that: a chain of separate node objects, each holding a value and a
pointer to the next node. No index jump — reaching node 5 means walking the
chain one link at a time. Trade-off: **lose instant access, gain instant
insertion/deletion**.

**Connects back to:** Stacks & Queues, Hash Tables (collision chaining is a
tiny linked list per bucket).
**Connects forward to:** Recursion Refresher & Trees — a tree node is just a
linked-list node with two `next` pointers (`left`, `right`) instead of one.

---

## 2. Sections & Core Analogies

| # | Section | Analogy | Core Idea |
|---|---------|---------|-----------|
| 1 | Singly Linked Lists — Nodes & Traversal | Treasure hunt — each clue points to the next | `Node(value, next)`, `head`, walk with `current = current.next` |
| 2 | Insert & Delete Operations | Train cars coupling/uncoupling | O(1) insert/delete once you're at the right node — no shifting |
| 3 | Doubly Linked Lists | Dance line holding hands both directions | `prev` + `next`; O(1) removal with a held reference |
| 4 | Cycle Detection — Floyd's Algorithm | Two runners on a track, one 2x speed | slow/fast pointers; collision ⇒ cycle exists, O(1) space |

---

## 3. Reference Implementations (from the guide)

### 3.1 Singly Linked List — Node, append, traversal
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None  # points to nothing yet

class LinkedList:
    def __init__(self):
        self.head = None  # empty list starts with no first node

    def append(self, value):
        new_node = Node(value)
        if self.head is None:
            self.head = new_node
            return
        current = self.head
        while current.next is not None:  # walk to the last node
            current = current.next
        current.next = new_node  # link the last node forward

    def to_list(self):
        result = []
        current = self.head
        while current is not None:
            result.append(current.value)
            current = current.next  # step to the next clue
        return result  # RETURN, not print
```

### 3.2 Insert at head / delete by value
```python
def insert_at_head(self, value):
    new_node = Node(value)
    new_node.next = self.head  # new car couples to the old front
    self.head = new_node        # new car becomes the front

def delete_value(self, target):
    if self.head is None:
        return False
    if self.head.value == target:  # deleting the very first car
        self.head = self.head.next
        return True
    previous = self.head
    current = self.head.next
    while current is not None:
        if current.value == target:
            previous.next = current.next  # skip over the deleted car
            return True
        previous = current
        current = current.next
    return False  # target was never found
```

### 3.3 Doubly Linked List — append, remove_node
```python
class DNode:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, value):
        new_node = DNode(value)
        if self.head is None:
            self.head = self.tail = new_node
            return
        new_node.prev = self.tail   # link backward to old last dancer
        self.tail.next = new_node   # link old last dancer forward
        self.tail = new_node        # new dancer is now the end

    def remove_node(self, node):
        if node.prev:
            node.prev.next = node.next
        else:
            self.head = node.next   # removing the very first dancer
        if node.next:
            node.next.prev = node.prev
        else:
            self.tail = node.prev   # removing the very last dancer
```

### 3.4 Floyd's Cycle Detection
```python
def has_cycle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next        # one step
        fast = fast.next.next   # two steps
        if slow is fast:        # SAME object, not same value
            return True
    return False
```

---

## 4. Practice Sheet (for optional "try it" problems in the tool)

1. **Easy** — Build and Print: `build_list(values)` + `print_list(head)`
2. **Easy** — Reverse a Linked List in place (3-pointer technique: previous, current, saved-next)
3. **Medium** — Remove the N-th Node From the End (two pointers, gap of n)
4. **Medium** — Find the Cycle's Starting Node (Floyd's phase 2: reset one pointer to head, advance both by 1)
5. **Medium-Hard** — Merge Two Sorted Linked Lists (dummy head + tail pointer, relink don't recreate)

**Mini-Project:** `PlaylistManager` — doubly linked list backed, with
`add_song`, `remove_song`, `play_next`, `play_previous`, `to_list`.

---

## 5. Common Bugs to Make Visible in the Visualizer

- Overwriting `current.next` before saving where it used to point (need a temp `next_node` var)
- Forgetting to update `self.head` when deleting the first node
- Doubly linked list: updating `.next` but forgetting `.prev` (or vice versa)
- Comparing `slow.value == fast.value` instead of `slow is fast` for cycle detection (false positives on repeated values)
- Not handling `head is None` / single-node list first

---

## 6. Visualization Requirements (what to actually build)

Build **one new standalone tool**, `linked-lists.html`, matching the visual
language of the existing tools (`bitwise-and-number-systems.html`,
`recursion-and-big-o.html`, `sorting-algorithms.html`) and reusing
`assets/css/site.css` + `assets/js/site.js`.

### Suggested interactive modules (pick creative, hands-on over static diagrams)

1. **Node Chain Builder (Singly)**
   - Boxes-and-arrows canvas/SVG rendering: each node is a box with `value` +
     an arrow to the next box; `head` labeled with a pointer flag; last node's
     arrow points to a `None` bubble.
   - Buttons: `append(value)`, `insert_at_head(value)`, `delete_value(value)`.
   - Every operation **animates step by step** (highlight the pointer being
     reassigned, show the old link fading out and the new link drawing in) —
     this directly visualizes the "save next before you overwrite it" bug
     from the Tips section.
   - A toggle to intentionally trigger the "overwrite before saving" bug and
     show the chain breaking (orphaned nodes) — turns Common Mistake #1 into
     a teaching moment.

2. **Doubly Linked List Dance Line**
   - Same node-chain visual but with **two arrows per link** (next in one
     color, prev in another — reuse `--teal` and `--purple` from the design
     system).
   - `remove_node(node)` animation must visibly update both neighbors'
     pointers, one after another, to reinforce Tip 6 ("touches two pointers,
     not one").

3. **Floyd's Cycle Detection — Tortoise & Hare Race**
   - Circular or linear track view (support both a cyclic and acyclic list
     toggle).
   - Two markers (slow = 1 step/tick, fast = 2 steps/tick) animate along the
     chain in real time (use `requestAnimationFrame` or a simple `setInterval`
     step loop with a speed slider).
   - On collision (`slow is fast`), flash both markers and the node; on fast
     reaching `None`, show a clear "no cycle" state.
   - Optional: implement the phase-2 "find cycle start" reset-one-pointer-to-head
     animation as a follow-up stage.

4. **Playlist Manager Mini-Demo** (stretch goal)
   - A small "now playing" UI backed by the doubly linked list visual from
     module 2, with `play_next` / `play_previous` buttons that visibly move a
     "cursor" indicator along the chain.

### Interaction/UX notes
- Keep controls simple and large-tap-target (student is a beginner, low
  English proficiency) — short button labels, tooltips/hint text in simple
  English, no jargon beyond what's in this guide.
- Every animated step should have a one-line caption in plain English
  (e.g. "Saving current.next before we change it..." / "Two runners collide
  — a cycle exists!").
- No auto-grading, no scoring — this is a *demonstration + free-play* tool,
  consistent with the Week 16 Revision App's Practice tab philosophy (mentor
  verifies understanding live).
- Support both **auto-play** (step through an example automatically) and
  **manual step** (click "Next Step" to advance one operation at a time).

---

## 7. Build Constraints (from InteractLab CLAUDE.md — do not violate)

- **No ES modules.** Plain `<script>` tags, `window.Foo = ...` globals only
  (the site must work from `file://`).
- **No CodeMirror 6.** If code display/editing is needed, use CodeMirror 5.65.17
  from cdnjs, same pattern as the Week 16 app.
- Use the shared design system: `assets/css/site.css` — reuse `--teal`,
  `--purple`, `--amber`, `--blue`, `--green` variables for node/pointer
  color-coding rather than inventing new colors.
- Never add `overflow: hidden` to `body`, `html`, or any ancestor of a
  sticky element without verifying sticky positioning still works.
- No template literals for multi-line Python strings if you embed any code
  samples as data — use `\n`-escaped regular strings (linter constraint from
  the Week 16 app).
- Add the new tool to `index.html` (homepage tutorial card) and to the
  `<nav>` of the four existing tutorial pages, same pattern as the "Python
  Revision" link.
- **No week numbers in the UI** — call it "Linked Lists", not "Week 20".

---

## 8. Suggested File Additions

```
InteractLab/
└── linked-lists.html      # new standalone tool, mirrors existing tool pages
    (inline <script> or a small linked-lists.js — your call, but keep it
    dependency-free beyond CodeMirror 5 if code display is used)
```
