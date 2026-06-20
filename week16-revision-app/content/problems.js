export const problems = [
{
    id: 'p1',
    title: 'Gradebook Builder',
    tags: ['Functions', 'Lists', 'Dictionaries'],
    difficulty: 'easy',
    statement: `You are building a gradebook tool for a teacher.
The gradebook is a dictionary mapping student names to their score (0–100).

Implement four functions:
• add_grade(gradebook, student, score) — add or update a student's score
• get_average(gradebook) — return the class average; return 0 if empty
• top_student(gradebook) — return the name of the student with the highest score
• grade_letter(score) — return 'A' (≥90), 'B' (≥75), 'C' (≥60), or 'F' otherwise

Then use them together to print a full class report.`,
    hint: `For get_average, use sum() and len() on the dict values.
For top_student, look at the max() function with a key argument — or loop and track the best.
grade_letter is just a chain of if/elif — write the highest boundary first.`,
    starterCode: `# Gradebook Builder

def add_grade(gradebook, student, score):
    """Add or update a student's score in the gradebook dict."""
    pass

def get_average(gradebook):
    """Return the class average score. Return 0 if gradebook is empty."""
    pass

def top_student(gradebook):
    """Return the name of the student with the highest score."""
    pass

def grade_letter(score):
    """Return 'A' (>=90), 'B' (>=75), 'C' (>=60), or 'F' otherwise."""
    pass


# --- Test your code ---
gradebook = {}
add_grade(gradebook, "Alice", 88)
add_grade(gradebook, "Bob", 95)
add_grade(gradebook, "Cass", 72)
add_grade(gradebook, "Dave", 45)
add_grade(gradebook, "Alice", 91)   # update Alice's score

print("Gradebook:", gradebook)
print(f"Average: {get_average(gradebook):.1f}")
print(f"Top student: {top_student(gradebook)}")
print()
print("--- Report ---")
for name, score in gradebook.items():
    print(f"{name}: {score}  ({grade_letter(score)})")
`
},

{
    id: 'p2',
    title: 'CSV Data Processor',
    tags: ['File I/O', 'Error Handling', 'Dictionaries'],
    difficulty: 'medium',
    statement: `You have student records as a CSV string (pretend it came from a file).
Some rows are broken — missing values, non-numeric scores, or scores outside 0–100.

Implement:
• parse_csv(csv_text) — parse and return a list of valid student dicts.
  Each dict has keys: "name", "score" (float), "subject".
  Skip invalid rows and print a warning message for each one skipped.
• subject_averages(students) — return {subject: average_score} for all subjects.

A valid row has a non-empty name, a numeric score between 0 and 100, and a subject.`,
    hint: `Use csv_text.strip().split("\\n") to get rows, then split each row on ",".
Wrap the score conversion in try/except ValueError.
Check 0 <= score <= 100 after converting.
For subject_averages, loop through the list and group scores by subject in a dict.`,
    starterCode: `# CSV Data Processor

csv_data = """name,score,subject
Alice,88,Math
Bob,not_a_number,Science
Cass,95,Math
Dave,,History
Eve,72,Science
Frank,101,Math
Grace,61,History
"""

def parse_csv(csv_text):
    """
    Parse CSV text and return a list of valid student dicts.
    Skip the header row. Skip and warn about invalid rows.
    """
    students = []
    rows = csv_text.strip().split("\\n")
    # rows[0] is the header — skip it
    for row in rows[1:]:
        pass  # your code here
    return students


def subject_averages(students):
    """Return a dict: {subject: average_score} for all valid students."""
    pass


# --- Run it ---
students = parse_csv(csv_data)
print(f"\\nValid students loaded: {len(students)}")
print()
averages = subject_averages(students)
if averages:
    print("Subject averages:")
    for subject, avg in sorted(averages.items()):
        print(f"  {subject}: {avg:.1f}")
`
},

  {
    id: 'p3',
    title: 'Text Cleaner & Analyser',
    tags: ['Strings', 'Comprehensions', 'Lambda'],
    difficulty: 'easy',
    statement: `You have a messy list of student names. Clean and process it using comprehensions and lambdas — no explicit for-loops for the main tasks.

Task 1: Clean the names — strip whitespace, apply title case, remove empty strings.
  Use a list comprehension.

Task 2: Sort cleaned names by last name, then first name.
  Use sorted() with a lambda key.

Task 3: Build a dict mapping first name → full name.
  Only include names that have at least a first and last word.
  Use a dict comprehension.

Task 4 (bonus): Count how many names belong to each "initial" (first letter of last name).
  Use a dict comprehension or a loop — your choice.`,
    hint: `Task 1: [name.strip().title() for name in raw_names if name.strip()]
Task 2: Sort key = lambda n: (n.split()[-1], n.split()[0]) — last name first, then first name.
Task 3: {n.split()[0]: n for n in clean_names if len(n.split()) >= 2}
Task 4: Think about grouping — you might need a regular dict with setdefault or a comprehension with a unique list of initials.`,
    starterCode: `# Text Cleaner & Analyser

raw_names = [
    "  ALICE SMITH  ",
    "bob jones",
    "  Carol White ",
    "DAVE BROWN",
    "eve green  ",
    "",
    "  Frank   ",          # only one name — no last name
    "grace HALL",
    "  henry KING  ",
]

# Task 1: Clean (strip + title case + skip empty)
clean_names = []  # replace with a list comprehension

# Task 2: Sort by last name, then first name (use lambda)
sorted_names = []  # replace with sorted() + lambda

# Task 3: {first_name: full_name} — only for names with first + last
name_dict = {}  # replace with dict comprehension

# Task 4 (bonus): {initial: count} — group by first letter of last name
initials = {}  # your approach here

print("Clean:  ", clean_names)
print("Sorted: ", sorted_names)
print("Dict:   ", name_dict)
print("Initials:", initials)
`
  },

  {
    id: 'p4',
    title: 'Library System — Classes from Scratch',
    tags: ['OOP', 'Classes'],
    difficulty: 'medium',
    statement: `Build a small library management system from scratch. No starter method bodies — read the docstrings and implement.

class Book:
  Attributes: title (str), author (str), pages (int, must be > 0), is_available (bool, default True)
  Methods: borrow() — mark unavailable, raise ValueError if already borrowed
           return_book() — mark available
           __str__ — "Title by Author (N pages) — Available" or "Borrowed"

class Library:
  Methods: add_book(book) — add a Book to the collection
           find_by_author(author) — return list of books by that author (case-insensitive)
           available_books() — return list of available books
           borrow_book(title) — find by title and borrow it; raise ValueError if not found
           summary() — print total count and available count`,
    hint: `Book.__init__ should raise ValueError if pages <= 0.
For borrow(), check self.is_available before setting it to False.
Library can store books in a list (self._books = []).
find_by_author: compare author.lower() to each book's author.lower().
borrow_book: loop through books, match by title, then call book.borrow().`,
    starterCode: `# Library System — OOP from Scratch

class Book:
    """
    Represents a book in the library.
    pages must be > 0 — raise ValueError if not.
    is_available starts as True.
    """
    pass


class Library:
    """
    A collection of Book objects.
    Store them in a list: self._books
    """
    pass


# --- Test your code ---
try:
    bad = Book("Ghost", "Author", -5)  # should raise ValueError
except ValueError as e:
    print(f"Caught: {e}")

lib = Library()
lib.add_book(Book("Dune", "Frank Herbert", 412))
lib.add_book(Book("Foundation", "Isaac Asimov", 244))
lib.add_book(Book("I, Robot", "Isaac Asimov", 320))
lib.add_book(Book("Neuromancer", "William Gibson", 271))

lib.summary()
print()
asimov = lib.find_by_author("isaac asimov")
print("Asimov books:")
for b in asimov:
    print(" ", b)

print()
lib.borrow_book("Dune")
lib.summary()

try:
    lib.borrow_book("Dune")  # already borrowed
except ValueError as e:
    print(f"Caught: {e}")
`
  },

  {
    id: 'p5',
    title: 'Extended Library — Inheritance & Dunders',
    tags: ['OOP', 'Inheritance', 'Dunders'],
    difficulty: 'medium',
    statement: `Extend your Library system with an EBook subclass and add dunders to both classes.

1. Paste your Book and Library classes from Problem 4.

2. Create EBook(Book):
   • Extra attribute: file_size_mb (float)
   • pages is optional (default None — ebooks don't always have a page count)
   • property download_size: returns "X.X MB" formatted string
   • __len__: returns file_size_mb rounded to int
   • __repr__: EBook('title', 'author', file_size_mb=X.X)
   • Override __str__: "Title by Author [eBook, X.X MB]"

3. Add to Book:
   • __repr__: Book('title', 'author', pages)
   • __eq__: two books are equal if they have the same title and author (case-insensitive)`,
    hint: `EBook.__init__ should call super().__init__(title, author, pages or 1) — or adjust parent to allow pages=None.
For download_size property: return f"{self.file_size_mb:.1f} MB"
__len__ returns int(round(self.file_size_mb))
__eq__ in Book: compare self.title.lower() == other.title.lower() and same for author.`,
    starterCode: `# Extended Library — Inheritance & Dunders

# Paste your Book and Library classes here, then add the extensions.

class Book:
    pass   # paste + extend with __repr__ and __eq__


class Library:
    pass   # paste as-is


class EBook(Book):
    """
    Electronic book. Inherits from Book.
    file_size_mb: float
    pages: optional (default None)
    """
    pass


# --- Test your code ---
b1 = Book("Dune", "Frank Herbert", 412)
b2 = Book("dune", "frank herbert", 412)   # same title/author, different case
e1 = EBook("Python Crash Course", "Eric Matthes", file_size_mb=4.2)
e2 = EBook("Clean Code", "Robert Martin", file_size_mb=8.7, pages=431)

print(b1)
print(repr(b1))
print(f"b1 == b2: {b1 == b2}")   # True — same book
print()
print(e1)
print(repr(e1))
print(f"Size: {e1.download_size}")
print(f"len(e1): {len(e1)}")
print()

lib = Library()
lib.add_book(b1)
lib.add_book(e1)
lib.add_book(e2)
lib.summary()
lib.borrow_book("Python Crash Course")
lib.summary()
`
  },

  {
    id: 'p6',
    title: 'Recursive List Flattener',
    tags: ['Recursion'],
    difficulty: 'medium',
    statement: `Write a recursive function that flattens a deeply nested list of any depth.

flatten([1, [2, [3, 4]], 5])            → [1, 2, 3, 4, 5]
flatten([1, [2, 3], [4, [5, [6]]]])     → [1, 2, 3, 4, 5, 6]
flatten([[[[1]]], 2, [3]])              → [1, 2, 3]
flatten([])                            → []
flatten([1, 2, 3])                     → [1, 2, 3]  (no nesting)

Hint: think about what you do for each element in the list.
If the element is a list itself, recurse. If it isn't, it's a base case.`,
    hint: `Loop over the input list. For each item:
  • If isinstance(item, list) → recurse: extend your result with flatten(item)
  • Otherwise → it's a plain value, just append it to your result

The base case is implicit — when the item is not a list, you stop going deeper.
An empty list [] just means the for-loop body never runs — your result stays [].`,
    starterCode: `# Recursive List Flattener

def flatten(nested):
    """
    Recursively flatten a nested list of any depth.
    Returns a new flat list — don't modify the original.
    """
    pass


# --- Test your code ---
tests = [
    [1, [2, [3, 4]], 5],
    [1, [2, 3], [4, [5, [6]]]],
    [[[[1]]], 2, [3]],
    [],
    [1, 2, 3],
    ["a", ["b", ["c", "d"]], "e"],
]

all_pass = True
for t in tests:
    result = flatten(t)
    print(f"Input:  {t}")
    print(f"Output: {result}")
    print()
`
  },

  {
    id: 'p7',
    title: 'Binary Search Tree — Recursion + OOP',
    tags: ['Recursion', 'OOP'],
    difficulty: 'medium-hard',
    statement: `Build a Binary Search Tree (BST) using a class with recursive methods.

A BST rule: values smaller than the current node go LEFT; larger go RIGHT.

Implement BSTNode:
• __init__(value) — store value, set left and right to None
• insert(val) — recursively insert a new value (ignore duplicates)
• contains(val) — recursively check if val exists in this subtree → bool
• inorder() — recursively return all values as a sorted list (left → self → right)

This is a preview of the data structure pattern you'll see all of Week 17+.`,
    hint: `insert: if val < self.value, go left. If self.left is None, create a new BSTNode there. Otherwise, self.left.insert(val). Mirror for right.
contains: if val == self.value, return True. If val < self.value and self.left exists, recurse left. Same for right. If no child to follow, return False.
inorder: return self.left.inorder() (if left exists) + [self.value] + self.right.inorder() (if right exists).`,
    starterCode: `# Binary Search Tree — Recursion + OOP

class BSTNode:
    """A node in a Binary Search Tree."""

    def __init__(self, value):
        self.value = value
        self.left  = None
        self.right = None

    def insert(self, val):
        """Recursively insert val. Ignore if val already exists."""
        pass

    def contains(self, val):
        """Recursively check if val is in this subtree. Returns bool."""
        pass

    def inorder(self):
        """Recursively return all values in sorted order."""
        pass


# --- Test your code ---
root = BSTNode(50)
for v in [30, 70, 20, 40, 60, 80, 35, 45]:
    root.insert(v)

sorted_vals = root.inorder()
print("Inorder (should be sorted):", sorted_vals)
print("Is sorted?", sorted_vals == sorted(sorted_vals))

print("\\nContains checks:")
for test_val in [20, 45, 55, 80, 100]:
    print(f"  {test_val}: {root.contains(test_val)}")

# Insert a duplicate — should be silently ignored
root.insert(50)
print("\\nAfter inserting duplicate 50, inorder still:", root.inorder())
`
  },

  {
    id: 'p8',
    title: 'Big-O Detective',
    tags: ['Big-O'],
    difficulty: 'medium',
    statement: `Analyse the three code snippets below and write your Big-O reasoning as print statements.

There's no single correct output format — your mentor will verify your reasoning live.

For each snippet, identify:
• Worst-case time complexity (with justification)
• Best-case time complexity if different
• Space complexity

Snippet A: removes duplicates from a list using a list as the "seen" tracker.
Snippet B: counts how many times you can halve n before reaching 1.
Snippet C: a triple-nested loop over an n×n matrix.`,
    hint: `Snippet A: the key question is what "item not in result" costs — searching a list is O(n). The outer loop is O(n), and for each item you do an O(n) search → O(n²) worst case.
Snippet B: you halve n each step → how many times can you halve n? That's log₂(n) → O(log n).
Snippet C: three nested loops each going 0..n → O(n³).`,
    starterCode: `# Big-O Detective

# --- Snippet A: De-duplicate a list ---
def snippet_a(data):
    result = []
    for item in data:
        if item not in result:  # <- what does "in" cost on a list?
            result.append(item)
    return result

# --- Snippet B: Halving counter ---
def snippet_b(n):
    count = 0
    while n > 1:
        n = n // 2
        count += 1
    return count

# --- Snippet C: Triple loop over n×n matrix ---
def snippet_c(matrix):
    n = len(matrix)
    total = 0
    for i in range(n):
        for j in range(n):
            for k in range(n):
                total += matrix[i][j] * matrix[j][k]
    return total


# ============================================================
# Your Analysis — write it as print statements
# ============================================================
print("=== Big-O Analysis ===")
print()
print("Snippet A (remove duplicates):")
print("  Outer loop: O(?)")
print("  'in result' check cost: O(?)")
print("  Worst-case time: O(?)  — because ...")
print("  Space: O(?)  — because ...")
print()
print("Snippet B (halving counter):")
print("  Time: O(?)  — because ...")
print()
print("Snippet C (triple loop):")
print("  Time: O(?)  — because ...")
print()

# Verify the functions work:
sample = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
print("--- Verification ---")
print("Snippet A:", snippet_a(sample))
print("Snippet B(64):", snippet_b(64), "steps (expect 6)")
matrix = [[1, 2], [3, 4]]
print("Snippet C:", snippet_c(matrix))
`
  },

  {
    id: 'p9',
    title: 'Implement Insertion Sort + Justify Big-O',
    tags: ['Sorting', 'Big-O'],
    difficulty: 'medium',
    statement: `Implement insertion sort from scratch, then explain its complexity in the docstring.

How insertion sort works (think of sorting playing cards):
• Go through the array left to right. Each new item is your "key."
• Slide the key left, past any larger items, until it's in the right spot.
• Repeat until the whole array is sorted.

After implementing, fill in the docstring with:
• Time complexity (worst, average, best case) with justification
• Space complexity
• When would you choose insertion sort over merge sort?`,
    hint: `Outer loop: i from 1 to len(arr)-1.
key = arr[i]
Inner loop: j from i-1 down to 0, while arr[j] > key: shift arr[j] to arr[j+1], j -= 1
After inner loop: place key at arr[j+1]
Best case: already sorted — inner loop never runs → O(n). Worst case: reversed → O(n²).`,
    starterCode: `# Insertion Sort + Big-O Justification

def insertion_sort(arr):
    """
    Sort arr using insertion sort. Returns a new sorted list.

    Time complexity:
      Worst case:   O(?)  — when input is ...
      Average case: O(?)
      Best case:    O(?)  — when input is ...
    Space complexity: O(?)

    When to use insertion sort over merge sort:
      ...
    """
    arr = arr[:]   # work on a copy — don't mutate the original
    # Your implementation here
    return arr


def is_sorted(arr):
    """Verify the result is sorted."""
    return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))


# --- Test your code ---
test_cases = [
    ([64, 34, 25, 12, 22, 11, 90], "random"),
    ([1, 2, 3, 4, 5],              "already sorted (best case)"),
    ([5, 4, 3, 2, 1],              "reverse sorted (worst case)"),
    ([3],                          "single element"),
    ([],                           "empty"),
    ([2, 2, 2, 1],                 "with duplicates"),
]

print("Insertion Sort Tests")
print("-" * 40)
all_pass = True
for arr, label in test_cases:
    result = insertion_sort(arr)
    ok = is_sorted(result) if result else True
    all_pass = all_pass and ok
    status = "✓" if ok else "✗"
    print(f"{status} {label}")
    print(f"  Input:  {arr}")
    print(f"  Output: {result}")

print()
print("All tests passed!" if all_pass else "Some tests FAILED — check your code.")
`
  },

  {
    id: 'p10',
    title: 'Student Records Capstone',
    tags: ['OOP', 'File I/O', 'Sorting', 'Error Handling'],
    difficulty: 'medium-hard',
    statement: `This is the capstone problem. It deliberately feels like a small real program.

You have student records as CSV text (pretend it came from a file).
Build a full pipeline:

1. class Student — with attributes name, score (float), subject, email.
   Add: grade_letter property, first_name property, __str__, __repr__, __lt__ (by score).

2. load_students(csv_text) — parse the CSV, return a list of Student objects.
   Skip invalid rows quietly (no warnings needed this time).

3. report(students) — print a full report:
   • All students sorted by score (highest first) with grade letter
   • Class average and the highest/lowest scores
   • Subject breakdown: average score per subject, sorted alphabetically`,
    hint: `Student.__lt__ enables sorted() to work on Student objects directly.
grade_letter: use a @property returning 'A'/'B'/'C'/'F'.
first_name: self.name.split()[0]
load_students: skip header, split each row on ",", wrap in try/except.
For subject averages: build a dict of {subject: [scores]}, then compute average per subject.`,
    starterCode: `# Student Records Capstone

CSV_DATA = """name,score,subject,email
Alice Smith,88,Math,alice@school.edu
Bob Jones,72,Science,bob@school.edu
Cass White,95,Math,cass@school.edu
Dave Brown,61,History,dave@school.edu
Eve Green,84,Science,eve@school.edu
Frank Black,53,Math,frank@school.edu
Grace Hall,91,History,grace@school.edu
Henry King,78,Science,henry@school.edu
"""


class Student:
    """
    One student record.
    Attributes: name, score (float), subject, email
    Properties: grade_letter, first_name
    Dunders: __str__, __repr__, __lt__ (compare by score for sorting)
    """
    pass


def load_students(csv_text):
    """
    Parse CSV_DATA and return a list of Student objects.
    Skip the header and any rows with missing/invalid data.
    """
    pass


def report(students):
    """
    Print:
    1. All students sorted by score descending (with grade letter)
    2. Class stats: average, highest score, lowest score
    3. Subject averages (alphabetical order)
    """
    pass


# --- Run it ---
students = load_students(CSV_DATA)
print(f"Loaded {len(students)} students.\\n")
report(students)
`
  }
];
