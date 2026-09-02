window.TOPICS = [
  {
    id: 'python-basics',
    title: 'Python Basics',
    analogy: 'A variable is a labelled box: the label is the name, what\'s inside is the value. You can swap what\'s inside any time — just assign a new value. Python figures out the type for you.',
    concepts: [
      {
        title: 'Variables & Types',
        body: 'Python has four core types: <code>int</code> (whole numbers), <code>float</code> (decimals), <code>str</code> (text), <code>bool</code> (<code>True</code>/<code>False</code>). Use <code>type(x)</code> to check. Use <code>int()</code>, <code>str()</code>, <code>float()</code> to convert between them.'
      },
      {
        title: 'f-strings &amp; Input',
        body: '<code>f"Hello {name}"</code> — put any expression inside <code>{}</code> and Python inserts the value. <code>input("prompt")</code> always returns a <strong>string</strong> — remember to convert with <code>int()</code> if you need a number.'
      }
    ],
    tryItCode: 'name = "Aisha"\nage = 17\nscore = 92.5\nis_passing = True\n\nprint(f"Student: {name}")\nprint(f"Age: {age}, Score: {score}")\nprint(f"Passing: {is_passing}")\nprint(f"Type of score: {type(score)}")\n\n# Type conversion\nraw = "85"\ngrade = int(raw) + 5\nprint(f"Updated grade: {grade}")\n',
    connectsTo: 'Every topic — variables are the building blocks of all Python programs.'
  },

  {
    id: 'conditionals-loops',
    title: 'Conditionals & Loops',
    analogy: 'A conditional is a fork in the road — Python reads the sign (your condition) and picks a path. A loop is a revolving door — keep going until a condition says stop.',
    concepts: [
      {
        title: 'if / elif / else',
        body: 'Python checks conditions top to bottom and runs the <strong>first</strong> branch that is <code>True</code>. If nothing matches, <code>else</code> runs. Indentation is the syntax — no curly braces.'
      },
      {
        title: 'for / while / break / continue',
        body: '<code>for item in collection</code> — loop over items one by one. <code>while condition</code> — keep going while something is true. <code>break</code> exits the loop early. <code>continue</code> skips to the next iteration.'
      }
    ],
    tryItCode: 'scores = [72, 45, 90, 55, 88, 33, 95]\n\nfor score in scores:\n    if score >= 90:\n        grade = "A"\n    elif score >= 70:\n        grade = "B"\n    elif score >= 55:\n        grade = "C"\n    else:\n        grade = "F"\n    print(f"{score} -> {grade}")\n\n# while loop\ncount = 0\nwhile count < 3:\n    print(f"Loop #{count + 1}")\n    count += 1\n',
    connectsTo: 'Functions — control flow lives inside functions.'
  },

  {
    id: 'functions-lists',
    title: 'Functions & Lists',
    analogy: 'A function is a recipe: written once, used many times with different ingredients. A list is a numbered shelf: items in order, grabbed by position (starting at 0).',
    concepts: [
      {
        title: 'def / return vs print',
        body: '<code>return</code> sends a value <em>back</em> to whoever called the function — you can use it. <code>print</code> just shows text on screen — the value is lost. Functions that only <code>print</code> return <code>None</code> silently.',
        type: 'warning',
        badge: '&#9888;&#65039; Common mistake'
      },
      {
        title: 'Mutable default arguments',
        body: '<strong>Never</strong> use a mutable object (list, dict) as a default argument. <code>def f(items=[])</code> — that list is created <em>once</em> and reused across every call. The fix: use <code>None</code> as the default and create the list inside the function.',
        type: 'warning',
        badge: '&#9888;&#65039; Classic trap'
      }
    ],
    tryItCode: '# return vs print — spot the difference\ndef add_correct(a, b):\n    return a + b        # sends the result back\n\ndef add_wrong(a, b):\n    print(a + b)        # shows it but returns None\n\nresult = add_correct(3, 4)\nprint(f"Correct: {result + 1}")   # works\n\nwrong = add_wrong(3, 4)\n# print(wrong + 1)   # would crash — wrong is None\n\n# Mutable default trap\ndef add_score(score, history=[]):   # DANGER\n    history.append(score)\n    return history\n\nprint(add_score(85))   # [85]\nprint(add_score(90))   # [85, 90] -- bug! list was not reset\n\n# The fix\ndef add_score_safe(score, history=None):\n    if history is None:\n        history = []\n    history.append(score)\n    return history\n\nprint(add_score_safe(85))\nprint(add_score_safe(90))\n',
    connectsTo: 'Dictionaries — functions organise code; dicts store structured data.'
  },

  {
    id: 'dictionaries',
    title: 'Dictionaries',
    analogy: 'A dictionary is a phone book: you look up by name (the key) and instantly get the number (the value). Far faster than checking every entry one by one — and keys must be unique, just like names in a phone book.',
    concepts: [
      {
        title: 'Key-value pairs &amp; .get()',
        body: '<code>d["key"]</code> raises a <code>KeyError</code> if the key doesn\'t exist. <code>d.get("key", default)</code> returns the default instead — much safer when you\'re unsure if a key is there.'
      },
      {
        title: 'Looping with .items()',
        body: '<code>for key, value in d.items()</code> unpacks both at once. <code>d.keys()</code> and <code>d.values()</code> give you just one side. Use <code>"key" in d</code> to check membership — it only checks keys, not values.'
      }
    ],
    tryItCode: 'gradebook = {\n    "Alice": 88,\n    "Bob": 95,\n    "Cass": 72,\n    "Dave": 45\n}\n\nprint(gradebook["Alice"])                   # fine\nprint(gradebook.get("Eve", "Not found"))    # safe fallback\n\ngradebook["Eve"] = 81\ngradebook["Alice"] = 91   # update existing\n\nfor name, score in gradebook.items():\n    status = "Pass" if score >= 60 else "Fail"\n    print(f"{name}: {score} -- {status}")\n\nprint("Bob" in gradebook)\nprint(len(gradebook))\n',
    connectsTo: 'File I/O — CSV data is commonly loaded into dictionaries.'
  },

  {
    id: 'file-io',
    title: 'File I/O',
    analogy: 'Opening a file with <code>with open(...)</code> is like borrowing a library book with a guaranteed return policy: Python closes the file automatically when the <code>with</code> block ends — even if something goes wrong inside.',
    concepts: [
      {
        title: 'open() / with / modes',
        body: '<code>"r"</code> = read, <code>"w"</code> = write (overwrites), <code>"a"</code> = append. Always use <code>with open(path, mode) as f</code> — the <code>with</code> statement handles closing for you. <code>f.read()</code> gets everything; loop over <code>f</code> line by line.'
      },
      {
        title: 'FileNotFoundError &amp; CSV basics',
        body: 'Wrap file opens in <code>try/except FileNotFoundError</code> to handle missing files gracefully. CSV files are just text with commas — <code>line.split(",")</code> parses each row, or use <code>import csv</code> for robustness.'
      }
    ],
    tryItCode: '# Write a file\nwith open("notes.txt", "w") as f:\n    f.write("Line 1: Hello\\n")\n    f.write("Line 2: Python\\n")\n    f.write("Line 3: World\\n")\n\n# Read it back\nwith open("notes.txt", "r") as f:\n    for line in f:\n        print(line.strip())\n\n# Handle missing file\ntry:\n    with open("missing.txt") as f:\n        data = f.read()\nexcept FileNotFoundError:\n    print("File not found -- check the filename!")\n\n# Simple CSV parsing\ncsv_text = "Alice,88\\nBob,95\\nCass,72"\nfor row in csv_text.split("\\n"):\n    parts = row.split(",")\n    print(f"Name: {parts[0]}, Score: {parts[1]}")\n',
    connectsTo: 'Error Handling — file operations are where errors happen most often.'
  },

  {
    id: 'strings-errors',
    title: 'Strings & Error Handling',
    analogy: 'A <code>try/except</code> block is a seatbelt: you hope you never need it, but when something crashes Python catches you and keeps the program running. Without it, one bad value stops everything.',
    concepts: [
      {
        title: 'String methods &amp; slicing',
        body: 'Key methods: <code>.strip()</code>, <code>.upper()</code>, <code>.lower()</code>, <code>.split(sep)</code>, <code>.join(list)</code>, <code>.replace(old, new)</code>, <code>.startswith()</code>, <code>.find()</code>. Slicing: <code>s[start:stop:step]</code> — negative indices count from the end.'
      },
      {
        title: 'try / except / common exceptions',
        body: 'Common exceptions: <code>ValueError</code>, <code>ZeroDivisionError</code>, <code>KeyError</code>, <code>IndexError</code>, <code>TypeError</code>, <code>FileNotFoundError</code>. Always catch specific types — not bare <code>except:</code> which hides bugs.'
      }
    ],
    tryItCode: 'sentence = "  Hello, World!  "\nprint(sentence.strip())\nprint(sentence.upper().strip())\nprint(sentence.strip().split(", "))\nprint(sentence[2:7])          # slicing\nprint(sentence[::-1].strip()) # reverse\n\ndef safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Can\'t divide by zero!"\n    except TypeError:\n        return "Numbers only please!"\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))\nprint(safe_divide(10, "x"))\n\ndef to_int(value):\n    try:\n        return int(value)\n    except ValueError:\n        return None\n\nprint(to_int("42"))\nprint(to_int("hello"))\n',
    connectsTo: 'OOP — classes often validate data with try/except inside methods.'
  },

  {
    id: 'comprehensions-lambda',
    title: 'Comprehensions & Lambda',
    analogy: 'A list comprehension is like ordering at a restaurant in one line: "Give me [what I want] from [the menu] if [it meets my criteria]." A lambda is a mini-function with no name — a quick action you use once.',
    concepts: [
      {
        title: 'List &amp; dict comprehensions',
        body: '<code>[expr for item in iterable if condition]</code> — the <code>if</code> part is optional. Dict comprehension: <code>{key_expr: val_expr for item in iterable}</code>. Much cleaner than a loop + <code>.append()</code> for building lists from scratch.'
      },
      {
        title: 'lambda + sort key',
        body: '<code>lambda x: expression</code> — an anonymous function. Most common use: <code>sorted(items, key=lambda x: x.something)</code>. Can only be one expression, not a full function body.'
      }
    ],
    tryItCode: 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\nevens   = [n for n in numbers if n % 2 == 0]\nsquares = [n ** 2 for n in numbers]\nprint("Evens:  ", evens)\nprint("Squares:", squares)\n\nwords = ["apple", "cat", "elephant", "dog"]\nword_lengths = {word: len(word) for word in words}\nprint("Lengths:", word_lengths)\n\nstudents = [("Alice", 88), ("Bob", 95), ("Cass", 72), ("Dave", 61)]\nby_score  = sorted(students, key=lambda s: s[1], reverse=True)\nby_name   = sorted(students, key=lambda s: s[0])\nprint("By score:", by_score)\nprint("By name: ", by_name)\n',
    connectsTo: 'OOP — comprehensions make class methods cleaner and shorter.'
  },

  {
    id: 'oop-classes',
    title: 'OOP — Classes & Objects',
    analogy: 'A class is a blueprint: it describes what a type of thing looks like and what it can do. An object is something built from that blueprint. One blueprint, unlimited objects — each with their own data.',
    concepts: [
      {
        title: 'class / __init__ / self',
        body: '<code>__init__</code> runs automatically when you create an object. <code>self</code> is always the first parameter of instance methods — it refers to <em>this specific object</em>. Never forget <code>self</code> in the definition, but never pass it yourself when calling.'
      },
      {
        title: 'Instance vs class methods',
        body: 'Instance methods take <code>self</code> — they read/change the object\'s data. Class methods take <code>cls</code> with <code>@classmethod</code> — they work on the class itself. Static methods take neither — utility functions that live in the class namespace.'
      }
    ],
    tryItCode: 'class Student:\n    school = "Coding Academy"   # class variable (shared)\n\n    def __init__(self, name, grade):\n        self.name  = name       # instance variable\n        self.grade = grade\n\n    def is_passing(self):\n        return self.grade >= 60\n\n    def describe(self):\n        status = "passing" if self.is_passing() else "failing"\n        return f"{self.name} ({self.grade}) -- {status}"\n\n    @classmethod\n    def from_string(cls, data):\n        name, grade = data.split(",")\n        return cls(name.strip(), int(grade.strip()))\n\ns1 = Student("Alice", 88)\ns2 = Student("Bob", 45)\ns3 = Student.from_string("Cass, 72")\n\nprint(s1.describe())\nprint(s2.describe())\nprint(s3.describe())\nprint(f"School: {Student.school}")\n',
    connectsTo: 'Inheritance — classes extend other classes. Recursion — recursive methods can live inside a class.'
  },

  {
    id: 'oop-inheritance',
    title: 'OOP — Encapsulation, Inheritance & Dunders',
    analogy: 'Inheritance is like a child learning the family trade: they get all the parent\'s skills automatically, then add their own twist. The parent class doesn\'t change — the child just extends it.',
    concepts: [
      {
        title: '_protected / @property / encapsulation',
        body: 'A single underscore <code>_attr</code> means "please don\'t touch this directly." Use <code>@property</code> to expose a computed value as if it were an attribute — callers read <code>obj.name</code> but you control what runs behind it. This is encapsulation.'
      },
      {
        title: 'super() / __str__ / __len__ / __repr__',
        body: '<code>super().__init__(...)</code> calls the parent\'s <code>__init__</code> — always call this when overriding. Dunders: <code>__str__</code> = what <code>print(obj)</code> shows, <code>__repr__</code> = developer view, <code>__len__</code> = what <code>len(obj)</code> returns.'
      }
    ],
    tryItCode: 'class Animal:\n    def __init__(self, name):\n        self.name = name\n        self._sounds = []     # protected\n\n    def speak(self):\n        return "..."\n\n    def __str__(self):\n        return f"Animal: {self.name}"\n\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)   # call parent __init__\n        self.breed = breed\n\n    def speak(self):\n        return "Woof!"\n\n    @property\n    def profile(self):\n        return f"{self.name} ({self.breed})"\n\n    def __str__(self):\n        return f"Dog: {self.profile}"\n\n    def __repr__(self):\n        return f"Dog({self.name!r}, {self.breed!r})"\n\n    def __len__(self):\n        return len(self.name)\n\n\nd = Dog("Buddy", "Labrador")\nprint(d)\nprint(repr(d))\nprint(d.speak())\nprint(d.profile)\nprint(len(d))\nprint(isinstance(d, Animal))\n',
    connectsTo: 'Recursion — recursive methods work inside inherited classes. Trees & Linked Lists (coming up) — nodes are objects with references to other objects.'
  },

  {
    id: 'recursion',
    title: 'Recursion',
    analogy: 'Recursion is like Russian nesting dolls: you open each doll to find a smaller one inside, until you reach the tiny one at the centre — that\'s the base case. Without a base case, the dolls go on forever (stack overflow).',
    concepts: [
      {
        title: 'Base case + recursive case',
        body: 'Every recursive function needs: (1) a <strong>base case</strong> — the condition where you stop and return a direct answer; (2) a <strong>recursive case</strong> — where you call yourself with a smaller version of the problem. If you can\'t see how the problem gets smaller, the recursion is broken.'
      },
      {
        title: 'Call stack depth',
        body: 'Each recursive call adds a frame to the call stack. Python\'s default limit is 1000 frames. Deep recursion on large inputs can cause a <code>RecursionError</code>. For large-scale work, iterative solutions are more efficient.'
      }
    ],
    tryItCode: 'def factorial(n):\n    if n <= 1:                     # base case\n        return 1\n    return n * factorial(n - 1)   # recursive case\n\ndef reverse_string(s):\n    if len(s) <= 1:                # base case\n        return s\n    return reverse_string(s[1:]) + s[0]\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(factorial(5))        # 120\nprint(factorial(0))        # 1\nprint(reverse_string("hello"))  # olleh\nprint([fibonacci(i) for i in range(8)])\n\ndef count_down(n):\n    if n == 0:\n        print("Blast off!")\n        return\n    print(f"  {n}...")\n    count_down(n - 1)\n\ncount_down(4)\n',
    connectsTo: 'Trees, Linked Lists (coming up next phase) — almost every tree traversal algorithm is recursive.'
  },

  {
    id: 'big-o',
    title: 'Big-O Notation',
    analogy: 'Big-O measures how many steps an algorithm needs as the input grows. Think of a phone book: O(1) means you know the exact page. O(n) means checking every page. O(log n) means halving the book each time — you find any name in ~17 flips, even with 100,000 entries.',
    concepts: [
      {
        title: 'The complexity classes',
        body: '<strong>O(1)</strong> — constant (dict lookup). <strong>O(log n)</strong> — logarithmic, halving each step (binary search). <strong>O(n)</strong> — linear, one step per item. <strong>O(n log n)</strong> — log-linear (merge sort). <strong>O(n²)</strong> — quadratic, nested loops (bubble sort).'
      },
      {
        title: 'The 4 analysis rules',
        body: '1. Drop constants: O(2n) → O(n). 2. Drop lower terms: O(n² + n) → O(n²). 3. Different inputs = different variables: O(a + b). 4. Space complexity counts memory — a function that copies the input is O(n) space even if it only loops once.'
      }
    ],
    tryItCode: '# O(1) -- constant\nphonebook = {"Alice": 1234, "Bob": 5678}\ndef lookup(book, name):\n    return book.get(name, "Not found")   # one step!\n\n# O(n) -- linear\ndef find_max(nums):\n    best = nums[0]\n    for n in nums:      # n steps\n        if n > best: best = n\n    return best\n\n# O(n^2) -- quadratic\ndef has_duplicate(nums):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False\n\n# O(log n) -- logarithmic\ndef binary_search(arr, target):\n    lo, hi, steps = 0, len(arr) - 1, 0\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        steps += 1\n        if arr[mid] == target: return target, steps\n        elif arr[mid] < target: lo = mid + 1\n        else: hi = mid - 1\n    return None, steps\n\ndata = list(range(1000))\nprint(lookup(phonebook, "Alice"))\nprint(find_max([3, 1, 4, 1, 5, 9, 2, 6]))\nprint(has_duplicate([1, 2, 3, 4, 5, 1]))\nval, steps = binary_search(data, 731)\nprint(f"Found {val} in {steps} steps (out of 1000 items!)")\n',
    connectsTo: 'Sorting — every sort\'s cost maps to a complexity class. Data Structures (next phase) — you\'ll analyse trees and linked lists the same way.'
  },

  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    analogy: 'Sorting algorithms are different strategies for tidying a messy bookshelf. Bubble sort swaps neighbours one by one — slow and exhausting. Merge sort splits the shelf in half, sorts each half, then merges — far faster for large shelves.',
    concepts: [
      {
        title: 'O(n²) sorts: Bubble, Selection, Insertion',
        body: '<strong>Bubble:</strong> compare neighbours, swap if wrong order — O(n²) worst/avg. <strong>Selection:</strong> find the minimum, place it at front — O(n²) always. <strong>Insertion:</strong> like sorting playing cards — O(n²) worst, O(n) best (already sorted!). All three are in-place, O(1) space.'
      },
      {
        title: 'O(n log n) sorts: Merge, Quick',
        body: '<strong>Merge sort:</strong> divide in half recursively, merge sorted halves — O(n log n) always, O(n) space, <strong>stable</strong>. <strong>Quick sort:</strong> pick a pivot, partition — O(n log n) average, O(n²) worst, <strong>not stable</strong>. Python\'s built-in <code>sorted()</code> uses Timsort — O(n log n), stable.'
      }
    ],
    tryItCode: 'def bubble_sort(arr):\n    arr = arr[:]\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid   = len(arr) // 2\n    left  = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    return result + left[i:] + right[j:]\n\ndata = [64, 34, 25, 12, 22, 11, 90]\nprint("Original:", data)\nprint("Bubble:  ", bubble_sort(data))\nprint("Merge:   ", merge_sort(data))\nprint("Built-in:", sorted(data))\n',
    connectsTo: 'Big-O — you can now justify every sort\'s cost from first principles.'
  },

  {
    id: 'putting-together',
    title: 'Putting It All Together',
    analogy: 'OOP gives you the <strong>structure</strong> (objects that hold data and behaviour). Recursion gives you the <strong>traversal</strong> (going deeper into nested structures). Big-O tells you the <strong>cost</strong> (how efficient that traversal is). These three pillars support everything coming next.',
    concepts: [
      {
        title: 'Why these three connect to what\'s next',
        body: 'A <strong>Stack</strong> is an OOP class with push/pop methods — O(1) both. A <strong>Linked List</strong> is a class where each node holds a reference to the next — traversal is O(n). A <strong>Tree</strong> branches — traversal is almost always recursive, and Big-O tells you whether you\'re O(n) or O(log n) depending on shape.'
      },
      {
        title: 'The pattern you\'ll see again and again',
        body: '1. <strong>Model it</strong> with a class (OOP). 2. <strong>Traverse it</strong> with recursion or a loop. 3. <strong>Measure the cost</strong> with Big-O. This pattern repeats for every data structure in the next phase. If you can write a clean class, think recursively, and reason about complexity, you\'re ready.'
      }
    ],
    tryItCode: 'class StudySession:\n    """OOP: an object that holds data and behaviour."""\n\n    def __init__(self, topic, items):\n        self.topic = topic\n        self.items = items\n\n    def count(self):                       # O(1)\n        return len(self.items)\n\n    def find(self, target, index=0):       # Recursion: O(n) time\n        if index >= len(self.items):       # base case: not found\n            return -1\n        if self.items[index] == target:    # base case: found\n            return index\n        return self.find(target, index + 1)\n\n    def __str__(self):\n        return f"StudySession({self.topic!r}, {self.count()} items)"\n\n\nsession = StudySession("Python Review", ["OOP", "Recursion", "Big-O", "Sorting"])\nprint(session)                             # __str__\n\nidx = session.find("Big-O")\nprint(f"Found \'Big-O\' at index {idx}")\n\nidx = session.find("Trees")\nprint(f"Found \'Trees\' at index {idx}")    # -1, not in list yet\n',
    connectsTo: 'Stacks & Queues (next week) — you now have every prerequisite.'
  }
];
