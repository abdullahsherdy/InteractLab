export const topics = [
  // python basics
  {
    id: 'python-basics',
    title: 'Python Basics',
    analogy: 'A variable is a labelled box: the label is the name, what\'s inside is the value. You can swap what\'s inside any time — just assign a new value. Python figures out the type for you.',
    concepts: [
      {
        title: 'Variables & Types',
        body: `Python has four core types: <code>int</code> (whole numbers), <code>float</code> (decimals), <code>str</code> (text), <code>bool</code> (<code>True</code>/<code>False</code>). Use <code>type(x)</code> to check. Use <code>int()</code>, <code>str()</code>, <code>float()</code> to convert between them.`
      },
      {
        title: 'f-strings & Input',
        body: `<code>f"Hello {name}"</code> — put any expression inside <code>{}</code> and Python inserts the value. <code>input("prompt")</code> always returns a <strong>string</strong> — remember to convert with <code>int()</code> if you need a number.`
      }
    ],
    tryItCode: `name = "Aisha"
age = 17
score = 92.5
is_passing = True

print(f"Student: {name}")
print(f"Age: {age}, Score: {score}")
print(f"Passing: {is_passing}")
print(f"Type of score: {type(score)}")

# Type conversion
raw = "85"
grade = int(raw) + 5
print(f"Updated grade: {grade}")
`,
    connectsTo: 'Every topic — variables are the building blocks of all Python programs.'
  },

  // control flow
  {
    id: 'conditionals-loops',
    title: 'Conditionals & Loops',
    analogy: 'A conditional is a fork in the road — Python reads the sign (your condition) and picks a path. A loop is a revolving door — keep going until a condition says stop.',
    concepts: [
      {
        title: 'if / elif / else',
        body: `Python checks conditions top to bottom and runs the <strong>first</strong> branch that is <code>True</code>. If nothing matches, <code>else</code> runs. Indentation is the syntax — no curly braces.`
      },
      {
        title: 'for / while / break / continue',
        body: `<code>for item in collection</code> — loop over items one by one. <code>while condition</code> — keep going while something is true. <code>break</code> exits the loop early. <code>continue</code> skips to the next iteration.`
      }
    ],
    tryItCode: `scores = [72, 45, 90, 55, 88, 33, 95]

for score in scores:
    if score >= 90:
        grade = "A"
    elif score >= 70:
        grade = "B"
    elif score >= 55:
        grade = "C"
    else:
        grade = "F"
    print(f"{score} → {grade}")

# while loop
count = 0
while count < 3:
    print(f"Loop #{count + 1}")
    count += 1
`,
    connectsTo: 'Functions — control flow lives inside functions.'
  },

  // functions & lists

  {
    id: 'functions-lists',
    title: 'Functions & Lists',
    analogy: 'A function is a recipe: written once, used many times with different ingredients. A list is a numbered shelf: items in order, grabbed by position (starting at 0).',
    concepts: [
      {
        title: 'def / return vs print',
        body: `<code>return</code> sends a value <em>back</em> to whoever called the function — you can use it. <code>print</code> just shows text on screen — the value is lost. Functions that only <code>print</code> return <code>None</code> silently.`,
        type: 'warning',
        badge: '⚠️ Common mistake'
      },
      {
        title: 'Mutable default arguments',
        body: `<strong>Never</strong> use a mutable object (list, dict) as a default argument. <code>def f(items=[])</code> — that list is created <em>once</em> and reused across every call. The fix: use <code>None</code> as the default and create the list inside the function.`,
        type: 'warning',
        badge: '⚠️ Classic trap'
      }
    ],
    tryItCode: `# return vs print — spot the difference
def add_correct(a, b):
    return a + b        # sends the result back

def add_wrong(a, b):
    print(a + b)        # shows it but returns None

result = add_correct(3, 4)
print(f"Correct: {result + 1}")   # works — result is 7

wrong = add_wrong(3, 4)
# print(f"Wrong: {wrong + 1}")   # crashes — wrong is None

# Mutable default trap
def add_score(score, history=[]):   # DANGER
    history.append(score)
    return history

print(add_score(85))   # [85]
print(add_score(90))   # [85, 90] — bug! list wasn't reset

# The fix
def add_score_safe(score, history=None):
    if history is None:
        history = []
    history.append(score)
    return history
`,
    connectsTo: 'Dictionaries — functions organise code; dicts store structured data.'
  },

  // dictionaries
  {
    id: 'dictionaries',
    title: 'Dictionaries',
    analogy: 'A dictionary is a phone book: you look up by name (the key) and instantly get the number (the value). Far faster than checking every entry one by one — and keys must be unique, just like names in a phone book.',
    concepts: [
      {
        title: 'Key-value pairs & .get()',
        body: `<code>d["key"]</code> raises a <code>KeyError</code> if the key doesn\'t exist. <code>d.get("key", default)</code> returns the default instead — much safer when you\'re unsure if a key is there.`
      },
      {
        title: 'Looping with .items()',
        body: `<code>for key, value in d.items()</code> unpacks both at once. <code>d.keys()</code> and <code>d.values()</code> give you just one side. Use <code>"key" in d</code> to check membership — it only checks keys, not values.`
      }
    ],
    tryItCode: `gradebook = {
    "Alice": 88,
    "Bob": 95,
    "Cass": 72,
    "Dave": 45
}

# Lookup — safe vs unsafe
print(gradebook["Alice"])                   # fine
print(gradebook.get("Eve", "Not found"))    # safe fallback

# Add / update
gradebook["Eve"] = 81
gradebook["Alice"] = 91   # update existing

# Loop
for name, score in gradebook.items():
    status = "Pass" if score >= 60 else "Fail"
    print(f"{name}: {score} — {status}")

# Check membership
print("Bob" in gradebook)
print(len(gradebook))
`,
    connectsTo: 'File I/O — CSV data is commonly loaded into dictionaries.'
  },

  // file I/O
  {
    id: 'file-io',
    title: 'File I/O',
    analogy: 'Opening a file with <code>with open(...)</code> is like borrowing a library book with a guaranteed return policy: Python closes the file automatically when the <code>with</code> block ends — even if something goes wrong inside.',
    concepts: [
      {
        title: 'open() / with / modes',
        body: `<code>"r"</code> = read, <code>"w"</code> = write (overwrites), <code>"a"</code> = append. Always use <code>with open(path, mode) as f</code> — the <code>with</code> statement handles closing for you. <code>f.read()</code> gets everything; loop over <code>f</code> line by line.`
      },
      {
        title: 'FileNotFoundError & CSV basics',
        body: `Wrap file opens in <code>try/except FileNotFoundError</code> to handle missing files gracefully. CSV files are just text with commas — <code>line.split(",")</code> parses each row, or use <code>import csv</code> for robustness.`
      }
    ],
    tryItCode: `# Write a file
with open("notes.txt", "w") as f:
    f.write("Line 1: Hello\\n")
    f.write("Line 2: Python\\n")
    f.write("Line 3: World\\n")

# Read it back
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())

# Handle missing file
try:
    with open("missing.txt") as f:
        data = f.read()
except FileNotFoundError:
    print("File not found — check the filename!")

# Simple CSV parsing
csv_text = "Alice,88\\nBob,95\\nCass,72"
for row in csv_text.split("\\n"):
    parts = row.split(",")
    print(f"Name: {parts[0]}, Score: {parts[1]}")
`,
    connectsTo: 'Error Handling — file operations are where errors happen most often.'
  },
  // strings & error handling
  {
    id: 'strings-errors',
    title: 'Strings & Error Handling',
    analogy: 'A <code>try/except</code> block is a seatbelt: you hope you never need it, but when something crashes Python catches you and keeps the program running. Without it, one bad value stops everything.',
    concepts: [
      {
        title: 'String methods & slicing',
        body: `Key methods: <code>.strip()</code>, <code>.upper()</code>, <code>.lower()</code>, <code>.split(sep)</code>, <code>.join(list)</code>, <code>.replace(old, new)</code>, <code>.startswith()</code>, <code>.find()</code>. Slicing: <code>s[start:stop:step]</code> — negative indices count from the end.`
      },
      {
        title: 'try / except / common exceptions',
        body: `Common exceptions: <code>ValueError</code> (wrong type/value), <code>ZeroDivisionError</code>, <code>KeyError</code>, <code>IndexError</code>, <code>TypeError</code>, <code>FileNotFoundError</code>. Catch specific types — not bare <code>except:</code> which hides bugs.`
      }
    ],
    tryItCode: `sentence = "  Hello, World!  "
print(sentence.strip())
print(sentence.upper().strip())
print(sentence.strip().split(", "))
print(sentence[2:7])         # slicing
print(sentence[::-1].strip())  # reverse

# Error handling
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        return "Can't divide by zero!"
    except TypeError:
        return "Numbers only please!"

print(safe_divide(10, 2))
print(safe_divide(10, 0))
print(safe_divide(10, "x"))

# ValueError example
def to_int(value):
    try:
        return int(value)
    except ValueError:
        return None

print(to_int("42"))
print(to_int("hello"))
`,
    connectsTo: 'OOP — classes often validate data with try/except inside methods.'
  },
  // comprehensions & lambda
  {
    id: 'comprehensions-lambda',
    title: 'Comprehensions & Lambda',
    analogy: 'A list comprehension is like ordering at a restaurant in one line: "Give me [what I want] from [the menu] if [it meets my criteria]." A lambda is a mini-function with no name — a quick action you use once.',
    concepts: [
      {
        title: 'List & dict comprehensions',
        body: `<code>[expr for item in iterable if condition]</code> — the <code>if</code> part is optional. Dict comprehension: <code>{key_expr: val_expr for item in iterable}</code>. Much cleaner than a loop + <code>.append()</code> for building lists from scratch.`
      },
      {
        title: 'lambda + sort key',
        body: `<code>lambda x: expression</code> — an anonymous function. Most common use: <code>sorted(items, key=lambda x: x.something)</code> or <code>list.sort(key=lambda x: ...)</code>. Can only be one expression, not a full function body.`
      }
    ],
    tryItCode: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# List comprehensions
evens   = [n for n in numbers if n % 2 == 0]
squares = [n ** 2 for n in numbers]
print("Evens:  ", evens)
print("Squares:", squares)

# Dict comprehension
words = ["apple", "cat", "elephant", "dog"]
word_lengths = {word: len(word) for word in words}
print("Lengths:", word_lengths)

# Lambda with sort
students = [("Alice", 88), ("Bob", 95), ("Cass", 72), ("Dave", 61)]
by_score  = sorted(students, key=lambda s: s[1], reverse=True)
by_name   = sorted(students, key=lambda s: s[0])
print("By score:", by_score)
print("By name: ", by_name)
`,
    connectsTo: 'OOP — comprehensions make class methods cleaner and shorter.'
  },

  // OOP
  {
    id: 'oop-classes',
    title: 'OOP — Classes & Objects',
    analogy: 'A class is a blueprint: it describes what a type of thing looks like and what it can do. An object is something built from that blueprint. One blueprint, unlimited objects — each with their own data.',
    concepts: [
      {
        title: 'class / __init__ / self',
        body: `<code>__init__</code> runs automatically when you create an object. <code>self</code> is always the first parameter of instance methods — it refers to <em>this specific object</em>. Never forget <code>self</code> in the definition, but never pass it yourself when calling.`
      },
      {
        title: 'Instance vs class methods',
        body: `Instance methods take <code>self</code> — they can read/change the object\'s data. Class methods take <code>cls</code> with <code>@classmethod</code> — they work on the class itself. Static methods take neither — they\'re just utility functions that live in the class namespace.`
      }
    ],
    tryItCode: `class Student:
    school = "Coding Academy"   # class variable (shared)

    def __init__(self, name, grade):
        self.name  = name       # instance variable (unique per object)
        self.grade = grade

    def is_passing(self):
        return self.grade >= 60

    def describe(self):
        status = "passing" if self.is_passing() else "failing"
        return f"{self.name} ({self.grade}) — {status}"

    @classmethod
    def from_string(cls, data):
        name, grade = data.split(",")
        return cls(name.strip(), int(grade.strip()))

s1 = Student("Alice", 88)
s2 = Student("Bob", 45)
s3 = Student.from_string("Cass, 72")

print(s1.describe())
print(s2.describe())
print(s3.describe())
print(f"School: {Student.school}")
`,
    connectsTo: 'Inheritance — classes extend other classes. Recursion — recursive methods can live inside a class.'
  },

  // inheritance, encapsulation, dunders
  {
    id: 'oop-inheritance',
    title: 'OOP — Encapsulation, Inheritance & Dunders',
    analogy: 'Inheritance is like a child learning the family trade: they get all the parent\'s skills automatically, then add their own twist. The parent class doesn\'t change — the child just extends it.',
    concepts: [
      {
        title: '_protected / @property / encapsulation',
        body: `A single underscore <code>_attr</code> means "please don\'t touch this directly." Use <code>@property</code> to expose a computed value as if it were an attribute — callers read <code>obj.name</code> but you control what runs behind it. This is encapsulation: hiding the internals.`
      },
      {
        title: 'super() / __str__ / __len__ / __repr__',
        body: `<code>super().__init__(...)</code> calls the parent\'s <code>__init__</code> — always call this when overriding. Dunders: <code>__str__</code> = what <code>print(obj)</code> shows, <code>__repr__</code> = developer representation, <code>__len__</code> = what <code>len(obj)</code> returns, <code>__lt__</code>/<code>__eq__</code> enable comparison operators.`
      }
    ],
    tryItCode: `class Animal:
    def __init__(self, name):
        self.name = name
        self._sounds = []     # protected

    def speak(self):
        return "..."

    def __str__(self):
        return f"Animal: {self.name}"


class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # call parent __init__
        self.breed = breed

    def speak(self):
        return "Woof!"

    @property
    def profile(self):           # computed property
        return f"{self.name} ({self.breed})"

    def __str__(self):
        return f"Dog: {self.profile}"

    def __repr__(self):
        return f"Dog({self.name!r}, {self.breed!r})"

    def __len__(self):
        return len(self.name)


d = Dog("Buddy", "Labrador")
print(d)              # calls __str__
print(repr(d))        # calls __repr__
print(d.speak())
print(d.profile)      # property
print(len(d))         # __len__
print(isinstance(d, Animal))   # True — Dog IS an Animal
`,
    connectsTo: 'Recursion — recursive methods work beautifully inside inherited classes. Trees & Linked Lists (coming up) — nodes are objects with references to other objects.'
  },

  // recursion
  {
    id: 'recursion',
    title: 'Recursion',
    analogy: 'Recursion is like Russian nesting dolls: you open each doll to find a smaller one inside, until you reach the tiny one at the centre — that\'s the base case. Without a base case, the dolls go on forever (stack overflow).',
    concepts: [
      {
        title: 'Base case + recursive case',
        body: `Every recursive function needs: (1) a <strong>base case</strong> — the condition where you stop and return a direct answer; (2) a <strong>recursive case</strong> — where you call yourself with a smaller/simpler version of the problem. If you can\'t see how the problem gets smaller, you don\'t have a valid recursive structure yet.`
      },
      {
        title: 'Call stack depth',
        body: `Each recursive call adds a frame to the call stack. Python\'s default limit is 1000 frames. Deep recursion on large inputs can cause a <code>RecursionError</code>. For large-scale work, iterative solutions or tail recursion (not native in Python) are more efficient.`
      }
    ],
    tryItCode: `def factorial(n):
    if n <= 1:                     # base case — smallest doll
        return 1
    return n * factorial(n - 1)   # recursive case — open next doll

def reverse_string(s):
    if len(s) <= 1:                # base case
        return s
    return reverse_string(s[1:]) + s[0]  # recursive case

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(factorial(5))        # 120
print(factorial(0))        # 1
print(reverse_string("hello"))  # olleh
print([fibonacci(i) for i in range(8)])  # [0,1,1,2,3,5,8,13]

# See the call stack in action
def count_down(n):
    if n == 0:
        print("Blast off!")
        return
    print(f"  {n}...")
    count_down(n - 1)

count_down(4)
`,
    connectsTo: 'Trees, Linked Lists (coming up next phase) — almost every tree traversal algorithm is recursive.'
  },

  // big-O notation
  {
    id: 'big-o',
    title: 'Big-O Notation',
    analogy: 'Big-O measures how many steps an algorithm needs as the input grows. Think of a phone book: O(1) means you know the exact page. O(n) means checking every page. O(log n) means halving the book each time — you find any name in ~17 flips, even with 100,000 entries.',
    concepts: [
      {
        title: 'The complexity classes',
        body: `<strong>O(1)</strong> — constant: same steps regardless of input size (dict lookup). <strong>O(log n)</strong> — logarithmic: halving each step (binary search). <strong>O(n)</strong> — linear: one step per item (scan a list). <strong>O(n log n)</strong> — log-linear (merge sort, quick sort). <strong>O(n²)</strong> — quadratic: nested loops over the same data (bubble sort).`
      },
      {
        title: 'The 4 analysis rules',
        body: `1. Drop constants: O(2n) → O(n). 2. Drop lower-order terms: O(n² + n) → O(n²). 3. Different inputs = different variables: O(a + b), not O(n). 4. Space complexity counts memory, not just steps — a function that copies the input is O(n) space even if it loops once.`
      }
    ],
    tryItCode: `# O(1) — constant: same cost regardless of size
phonebook = {"Alice": 1234, "Bob": 5678}
def lookup(book, name):
    return book.get(name, "Not found")   # one step!

# O(n) — linear: one step per item
def find_max(nums):
    best = nums[0]
    for n in nums:      # n steps
        if n > best: best = n
    return best

# O(n²) — quadratic: nested loops
def has_duplicate(nums):
    for i in range(len(nums)):         # n steps
        for j in range(i + 1, len(nums)):  # up to n steps each
            if nums[i] == nums[j]:
                return True
    return False

# O(log n) — logarithmic: halving
def binary_search(sorted_list, target):
    lo, hi = 0, len(sorted_list) - 1
    steps = 0
    while lo <= hi:
        mid = (lo + hi) // 2
        steps += 1
        if sorted_list[mid] == target: return target, steps
        elif sorted_list[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return None, steps

data = list(range(1000))
print(lookup(phonebook, "Alice"))
print(find_max([3, 1, 4, 1, 5, 9, 2, 6]))
print(has_duplicate([1, 2, 3, 4, 5, 1]))
val, steps = binary_search(data, 731)
print(f"Found {val} in {steps} steps (out of 1000 items!)")
`,
    connectsTo: 'Sorting — every sort\'s cost maps to a complexity class. Data Structures (next phase) — you\'ll analyse trees and linked lists the same way.'
  },

  // sorting algorithms
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    analogy: 'Sorting algorithms are different strategies for tidying a messy bookshelf. Bubble sort swaps neighbours one by one — slow and exhausting. Merge sort splits the shelf in half, sorts each half, then merges — far faster for large shelves.',
    concepts: [
      {
        title: 'O(n²) sorts: Bubble, Selection, Insertion',
        body: `<strong>Bubble:</strong> compare neighbours, swap if wrong order — O(n²) worst/avg. <strong>Selection:</strong> find the minimum, place it at the front — O(n²) always. <strong>Insertion:</strong> like sorting playing cards — pick up next card, slide it left past bigger cards — O(n²) worst, O(n) best (already sorted!). All three are in-place and O(1) space.`
      },
      {
        title: 'O(n log n) sorts: Merge, Quick',
        body: `<strong>Merge sort:</strong> divide in half recursively, merge sorted halves — O(n log n) always, O(n) extra space, <strong>stable</strong>. <strong>Quick sort:</strong> pick a pivot, partition around it, sort each side — O(n log n) average, O(n²) worst, O(log n) space, <strong>not stable</strong>. Python\'s built-in <code>sorted()</code> uses Timsort — a hybrid O(n log n), stable.`
      }
    ],
    tryItCode: `def bubble_sort(arr):
    arr = arr[:]
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid   = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

data = [64, 34, 25, 12, 22, 11, 90]
print("Original:", data)
print("Bubble:  ", bubble_sort(data))
print("Merge:   ", merge_sort(data))
print("Built-in:", sorted(data))

# Stability demo
records = [("Alice", 88), ("Bob", 88), ("Cass", 72)]
by_score = sorted(records, key=lambda r: r[1])
print("Stable sort keeps Alice before Bob:", by_score)
`,
    connectsTo: 'Big-O — you can now justify every sort\'s cost from first principles.'
  },

  // putting it all together
  {
    id: 'putting-together',
    title: 'Putting It All Together',
    analogy: 'OOP gives you the <strong>structure</strong> (objects that hold data and behaviour). Recursion gives you the <strong>traversal</strong> (going deeper into nested structures). Big-O tells you the <strong>cost</strong> (how efficient that traversal is). These three pillars support everything coming next.',
    concepts: [
      {
        title: 'Why these three connect to what\'s next',
        body: `A <strong>Stack</strong> is an OOP class with push/pop methods — O(1) both. A <strong>Queue</strong> is the same idea, different order. A <strong>Linked List</strong> is a class where each node holds a reference to the next node — traversal is recursive (or iterative O(n)). A <strong>Tree</strong> is a linked list that branches — traversal is almost always recursive, and Big-O tells you whether you\'re O(n) or O(log n) depending on the shape.`
      },
      {
        title: 'The pattern you\'ll see again and again',
        body: `1. <strong>Model it</strong> with a class (OOP). 2. <strong>Traverse/process it</strong> with recursion or a loop. 3. <strong>Measure the cost</strong> with Big-O. This pattern repeats for every data structure in the next phase. If you can write a clean class, think recursively, and reason about complexity, you\'re ready.`
      }
    ],
    tryItCode: `# All three pillars in one small example

class StudySession:
    """OOP: an object that holds data and behaviour."""

    def __init__(self, topic, items):
        self.topic = topic
        self.items = items

    def count(self):                       # O(1)
        return len(self.items)

    def find(self, target, index=0):       # Recursion: O(n) time
        """Recursively search for target. Returns index or -1."""
        if index >= len(self.items):       # base case: not found
            return -1
        if self.items[index] == target:    # base case: found
            return index
        return self.find(target, index + 1)  # recursive case

    def __str__(self):                     # Dunder
        return f"StudySession({self.topic!r}, {self.count()} items)"


session = StudySession("Python Review", ["OOP", "Recursion", "Big-O", "Sorting"])
print(session)                             # __str__

idx = session.find("Big-O")
print(f"Found 'Big-O' at index {idx}")    # recursive search

idx = session.find("Trees")
print(f"Found 'Trees' at index {idx}")    # -1, not in list yet

# Big-O: session.find() is O(n) — one step per item in the worst case
# A binary search tree's find() would be O(log n) — you'll build one next week
`,
    connectsTo: 'Stacks & Queues (next week) — you now have every prerequisite.'
  }
  
];
