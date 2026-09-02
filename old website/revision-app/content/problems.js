window.PROBLEMS = [
  {
    id: 'p1',
    title: 'Gradebook Builder',
    tags: ['Functions', 'Lists', 'Dictionaries'],
    difficulty: 'easy',
    statement: 'You are building a gradebook tool for a teacher.\nThe gradebook is a dictionary mapping student names to their score (0-100).\n\nImplement four functions:\n  add_grade(gradebook, student, score)  -- add or update a student\'s score\n  get_average(gradebook)                -- return the class average; 0 if empty\n  top_student(gradebook)                -- return the name of the top scorer\n  grade_letter(score)                   -- return \'A\' (>=90), \'B\' (>=75), \'C\' (>=60), \'F\' otherwise\n\nThen print a full class report using all four functions.',
    hint: 'For get_average: use sum() and len() on the dict values.\nFor top_student: try max(gradebook, key=gradebook.get) or loop and track the best.\ngrade_letter is a chain of if/elif -- write the highest boundary first.',
    starterCode: '# Gradebook Builder\n\ndef add_grade(gradebook, student, score):\n    """Add or update a student\'s score in the gradebook dict."""\n    pass\n\ndef get_average(gradebook):\n    """Return the class average. Return 0 if gradebook is empty."""\n    pass\n\ndef top_student(gradebook):\n    """Return the name of the student with the highest score."""\n    pass\n\ndef grade_letter(score):\n    """Return \'A\' (>=90), \'B\' (>=75), \'C\' (>=60), or \'F\' otherwise."""\n    pass\n\n\n# --- Test your code ---\ngradebook = {}\nadd_grade(gradebook, "Alice", 88)\nadd_grade(gradebook, "Bob", 95)\nadd_grade(gradebook, "Cass", 72)\nadd_grade(gradebook, "Dave", 45)\nadd_grade(gradebook, "Alice", 91)   # update Alice\'s score\n\nprint("Gradebook:", gradebook)\nprint(f"Average: {get_average(gradebook):.1f}")\nprint(f"Top student: {top_student(gradebook)}")\nprint()\nprint("--- Report ---")\nfor name, score in gradebook.items():\n    print(f"{name}: {score}  ({grade_letter(score)})")\n'
  },

  {
    id: 'p2',
    title: 'CSV Data Processor',
    tags: ['File I/O', 'Error Handling', 'Dictionaries'],
    difficulty: 'medium',
    statement: 'You have student records as a CSV string (pretend it came from a file).\nSome rows are broken -- missing values, non-numeric scores, or scores outside 0-100.\n\nImplement:\n  parse_csv(csv_text)      -- parse and return a list of valid student dicts.\n                             Each dict: {"name": str, "score": float, "subject": str}\n                             Skip invalid rows and print a warning for each.\n  subject_averages(students) -- return {subject: average_score} for all subjects.\n\nA valid row has a non-empty name, numeric score 0-100, and a subject.',
    hint: 'Use csv_text.strip().split("\\n") to get rows, then split each on ",".\nWrap the score conversion in try/except ValueError.\nCheck 0 <= score <= 100 after converting.\nFor subject_averages: group scores by subject in a dict, then compute averages.',
    starterCode: '# CSV Data Processor\n\ncsv_data = """name,score,subject\nAlice,88,Math\nBob,not_a_number,Science\nCass,95,Math\nDave,,History\nEve,72,Science\nFrank,101,Math\nGrace,61,History\n"""\n\ndef parse_csv(csv_text):\n    """Parse CSV and return a list of valid student dicts. Skip the header."""\n    students = []\n    rows = csv_text.strip().split("\\n")\n    # rows[0] is the header -- skip it\n    for row in rows[1:]:\n        pass  # your code here\n    return students\n\n\ndef subject_averages(students):\n    """Return {subject: average_score} for all valid students."""\n    pass\n\n\n# --- Run it ---\nstudents = parse_csv(csv_data)\nprint(f"\\nValid students loaded: {len(students)}")\nprint()\nif students:\n    averages = subject_averages(students)\n    print("Subject averages:")\n    for subject, avg in sorted(averages.items()):\n        print(f"  {subject}: {avg:.1f}")\n'
  },

  {
    id: 'p3',
    title: 'Text Cleaner & Analyser',
    tags: ['Strings', 'Comprehensions', 'Lambda'],
    difficulty: 'easy',
    statement: 'You have a messy list of student names. Clean and process it using comprehensions and lambdas -- no explicit for-loops for the main tasks.\n\nTask 1: Clean the names -- strip whitespace, apply title case, remove empty strings.\n  Use a list comprehension.\n\nTask 2: Sort cleaned names by last name, then first name.\n  Use sorted() with a lambda key.\n\nTask 3: Build a dict mapping first name -> full name.\n  Only include names with at least two words. Use a dict comprehension.\n\nTask 4 (bonus): Count names per first-letter of last name.',
    hint: 'Task 1: [name.strip().title() for name in raw_names if name.strip()]\nTask 2: sorted(names, key=lambda n: (n.split()[-1], n.split()[0]))\nTask 3: {n.split()[0]: n for n in clean_names if len(n.split()) >= 2}\nTask 4: loop through names with a last name, use dict.get(initial, 0) + 1',
    starterCode: '# Text Cleaner & Analyser\n\nraw_names = [\n    "  ALICE SMITH  ",\n    "bob jones",\n    "  Carol White ",\n    "DAVE BROWN",\n    "eve green  ",\n    "",\n    "  Frank   ",       # only one word -- no last name\n    "grace HALL",\n    "  henry KING  ",\n]\n\n# Task 1: Clean (strip + title case + skip empty)\nclean_names = []  # replace with a list comprehension\n\n# Task 2: Sort by last name, then first name (use lambda)\nsorted_names = []  # replace with sorted() + lambda\n\n# Task 3: {first_name: full_name} -- only names with first + last\nname_dict = {}  # replace with dict comprehension\n\n# Task 4 (bonus): {initial: count}\ninitials = {}\n\nprint("Clean:  ", clean_names)\nprint("Sorted: ", sorted_names)\nprint("Dict:   ", name_dict)\nprint("Initials:", initials)\n'
  },

  {
    id: 'p4',
    title: 'Library System — Classes from Scratch',
    tags: ['OOP', 'Classes'],
    difficulty: 'medium',
    statement: 'Build a small library management system from scratch.\nNo starter method bodies -- read the docstrings and implement.\n\nclass Book:\n  Attributes: title, author, pages (must be > 0), is_available (default True)\n  Methods: borrow()      -- mark unavailable; raise ValueError if already borrowed\n           return_book() -- mark available\n           __str__       -- "Title by Author (N pages) -- Available/Borrowed"\n\nclass Library:\n  Methods: add_book(book)          -- add a Book to the collection\n           find_by_author(author)  -- list of books by that author (case-insensitive)\n           available_books()       -- list of available books\n           borrow_book(title)      -- find by title and borrow; raise ValueError if not found\n           summary()               -- print total and available count',
    hint: 'Book.__init__: raise ValueError if pages <= 0.\nborrow(): check self.is_available first, then set to False.\nLibrary: store books in self._books = [].\nfind_by_author: compare author.lower() against book.author.lower().\nborrow_book: loop through books, find matching title, call book.borrow().',
    starterCode: '# Library System -- OOP from Scratch\n\nclass Book:\n    """\n    Represents a book.\n    pages must be > 0 (raise ValueError if not).\n    is_available starts as True.\n    """\n    pass\n\n\nclass Library:\n    """\n    A collection of Book objects.\n    Store them in: self._books = []\n    """\n    pass\n\n\n# --- Test your code ---\ntry:\n    bad = Book("Ghost", "Author", -5)  # should raise ValueError\nexcept ValueError as e:\n    print(f"Caught: {e}")\n\nlib = Library()\nlib.add_book(Book("Dune", "Frank Herbert", 412))\nlib.add_book(Book("Foundation", "Isaac Asimov", 244))\nlib.add_book(Book("I, Robot", "Isaac Asimov", 320))\nlib.add_book(Book("Neuromancer", "William Gibson", 271))\n\nlib.summary()\nprint()\nasimov = lib.find_by_author("isaac asimov")\nprint("Asimov books:")\nfor b in asimov:\n    print(" ", b)\n\nprint()\nlib.borrow_book("Dune")\nlib.summary()\n\ntry:\n    lib.borrow_book("Dune")  # already borrowed\nexcept ValueError as e:\n    print(f"Caught: {e}")\n'
  },

  {
    id: 'p5',
    title: 'Extended Library — Inheritance & Dunders',
    tags: ['OOP', 'Inheritance', 'Dunders'],
    difficulty: 'medium',
    statement: 'Extend your Library system with an EBook subclass and add dunders.\n\n1. Paste your Book and Library classes from Problem 4.\n\n2. Create EBook(Book):\n   Extra attribute: file_size_mb (float)\n   pages is optional (default None)\n   property download_size: returns "X.X MB"\n   __len__: returns file_size_mb rounded to int\n   __repr__: EBook(\'title\', \'author\', file_size_mb=X.X)\n   Override __str__: "Title by Author [eBook, X.X MB]"\n\n3. Add to Book:\n   __repr__: Book(\'title\', \'author\', pages)\n   __eq__: same title and author (case-insensitive) = equal books',
    hint: 'EBook.__init__: call super().__init__(title, author, pages or 1) and store file_size_mb.\ndownload_size property: f"{self.file_size_mb:.1f} MB"\n__len__ returns int(round(self.file_size_mb))\n__eq__ in Book: compare self.title.lower() == other.title.lower() etc.',
    starterCode: '# Extended Library -- Inheritance & Dunders\n# Paste your Book and Library classes here, then add the extensions.\n\nclass Book:\n    pass   # paste + extend with __repr__ and __eq__\n\n\nclass Library:\n    pass   # paste as-is\n\n\nclass EBook(Book):\n    """\n    Electronic book. Inherits from Book.\n    file_size_mb: float\n    pages: optional (default None)\n    """\n    pass\n\n\n# --- Test your code ---\nb1 = Book("Dune", "Frank Herbert", 412)\nb2 = Book("dune", "frank herbert", 412)   # same book, different case\ne1 = EBook("Python Crash Course", "Eric Matthes", file_size_mb=4.2)\ne2 = EBook("Clean Code", "Robert Martin", file_size_mb=8.7, pages=431)\n\nprint(b1)\nprint(repr(b1))\nprint(f"b1 == b2: {b1 == b2}")   # True\nprint()\nprint(e1)\nprint(repr(e1))\nprint(f"Size: {e1.download_size}")\nprint(f"len(e1): {len(e1)}")\n\nlib = Library()\nlib.add_book(b1)\nlib.add_book(e1)\nlib.summary()\n'
  },

  {
    id: 'p6',
    title: 'Recursive List Flattener',
    tags: ['Recursion'],
    difficulty: 'medium',
    statement: 'Write a recursive function that flattens a nested list of any depth.\n\nflatten([1, [2, [3, 4]], 5])        -> [1, 2, 3, 4, 5]\nflatten([1, [2, 3], [4, [5, [6]]]])  -> [1, 2, 3, 4, 5, 6]\nflatten([[[[1]]], 2, [3]])           -> [1, 2, 3]\nflatten([])                          -> []\nflatten([1, 2, 3])                   -> [1, 2, 3]\n\nThink: for each element in the list, if it\'s a list itself -- recurse.\nIf it\'s not a list -- it\'s a base case, just add it to your result.',
    hint: 'Loop over the input. For each item:\n  if isinstance(item, list): result.extend(flatten(item))\n  else: result.append(item)\n\nThe base case is implicit -- when an item is not a list, you stop recursing.\nAn empty list [] means the loop body never runs -- result stays [].',
    starterCode: '# Recursive List Flattener\n\ndef flatten(nested):\n    """\n    Recursively flatten a nested list of any depth.\n    Returns a new flat list.\n    """\n    pass\n\n\n# --- Test your code ---\ntests = [\n    [1, [2, [3, 4]], 5],\n    [1, [2, 3], [4, [5, [6]]]],\n    [[[[1]]], 2, [3]],\n    [],\n    [1, 2, 3],\n    ["a", ["b", ["c", "d"]], "e"],\n]\n\nfor t in tests:\n    result = flatten(t)\n    print(f"Input:  {t}")\n    print(f"Output: {result}")\n    print()\n'
  },

  {
    id: 'p7',
    title: 'Binary Search Tree — Recursion + OOP',
    tags: ['Recursion', 'OOP'],
    difficulty: 'medium-hard',
    statement: 'Build a Binary Search Tree (BST) with recursive methods.\n\nBST rule: values smaller than current node go LEFT, larger go RIGHT.\n\nImplement BSTNode:\n  insert(val)  -- recursively insert a new value (ignore duplicates)\n  contains(val)-- recursively check if val exists -> bool\n  inorder()    -- recursively return all values in sorted order\n\nThis is a preview of the pattern you\'ll use in Week 17+.',
    hint: 'insert: if val < self.value, go left. If self.left is None, create BSTNode there. Else self.left.insert(val). Mirror for right.\ncontains: if val == self.value return True. Check left/right recursively. If no child to follow, return False.\ninorder: return (self.left.inorder() if self.left else []) + [self.value] + (self.right.inorder() if self.right else [])',
    starterCode: '# Binary Search Tree -- Recursion + OOP\n\nclass BSTNode:\n    """A node in a Binary Search Tree."""\n\n    def __init__(self, value):\n        self.value = value\n        self.left  = None\n        self.right = None\n\n    def insert(self, val):\n        """Recursively insert val. Ignore if val already exists."""\n        pass\n\n    def contains(self, val):\n        """Recursively check if val is in this subtree. Returns bool."""\n        pass\n\n    def inorder(self):\n        """Recursively return all values in sorted order."""\n        pass\n\n\n# --- Test your code ---\nroot = BSTNode(50)\nfor v in [30, 70, 20, 40, 60, 80, 35, 45]:\n    root.insert(v)\n\nsorted_vals = root.inorder()\nprint("Inorder (sorted):", sorted_vals)\nprint("Is sorted?", sorted_vals == sorted(sorted_vals))\n\nprint("\\nContains checks:")\nfor test_val in [20, 45, 55, 80, 100]:\n    print(f"  {test_val}: {root.contains(test_val)}")\n\nroot.insert(50)  # duplicate -- silently ignored\nprint("\\nAfter inserting duplicate 50:", root.inorder())\n'
  },

  {
    id: 'p8',
    title: 'Big-O Detective',
    tags: ['Big-O'],
    difficulty: 'medium',
    statement: 'Analyse the three code snippets below and write your Big-O reasoning as print statements.\n\nNo single "correct output" format -- your mentor will verify your reasoning live.\n\nFor each snippet identify:\n  - Worst-case time complexity (with justification)\n  - Best-case if different\n  - Space complexity\n\nSnippet A: removes duplicates using a list as the "seen" tracker\nSnippet B: counts how many times you can halve n before reaching 1\nSnippet C: a triple-nested loop over an n x n matrix',
    hint: 'Snippet A: "item not in result" searches the list -- that\'s O(n). Outer loop is O(n). Total: O(n^2) worst case.\nSnippet B: you halve n each step. How many times can you halve n? That\'s log2(n) -> O(log n).\nSnippet C: three nested loops each 0..n -> O(n^3).',
    starterCode: '# Big-O Detective\n\n# --- Snippet A: de-duplicate ---\ndef snippet_a(data):\n    result = []\n    for item in data:\n        if item not in result:  # <- what does "in" cost on a list?\n            result.append(item)\n    return result\n\n# --- Snippet B: halving counter ---\ndef snippet_b(n):\n    count = 0\n    while n > 1:\n        n = n // 2\n        count += 1\n    return count\n\n# --- Snippet C: triple loop ---\ndef snippet_c(matrix):\n    n = len(matrix)\n    total = 0\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                total += matrix[i][j] * matrix[j][k]\n    return total\n\n\n# ============================================================\n# Your Analysis\n# ============================================================\nprint("=== Big-O Analysis ===")\nprint()\nprint("Snippet A:")\nprint("  Worst-case time: O(?)  -- because ...")\nprint("  Space:           O(?)")\nprint()\nprint("Snippet B:")\nprint("  Time: O(?)  -- because ...")\nprint()\nprint("Snippet C:")\nprint("  Time: O(?)  -- because ...")\nprint()\n\n# --- Verification ---\nsample = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]\nprint("--- Verification ---")\nprint("Snippet A:", snippet_a(sample))\nprint("Snippet B(64):", snippet_b(64), "(expect 6)")\nmatrix = [[1, 2], [3, 4]]\nprint("Snippet C:", snippet_c(matrix))\n'
  },

  {
    id: 'p9',
    title: 'Implement Insertion Sort + Justify Big-O',
    tags: ['Sorting', 'Big-O'],
    difficulty: 'medium',
    statement: 'Implement insertion sort from scratch, then explain its complexity in the docstring.\n\nHow it works (think of sorting playing cards in your hand):\n  - Go through the array left to right. Each new item is your "key".\n  - Slide the key left, past any items larger than it, until it\'s in the right spot.\n  - Repeat until the whole array is sorted.\n\nAfter implementing, fill in the docstring:\n  - Worst-case time, average-case, best-case (with justification)\n  - Space complexity\n  - When would you prefer insertion sort over merge sort?',
    hint: 'Outer loop: i from 1 to len(arr)-1.\nkey = arr[i]\nInner: j from i-1 down to 0, while arr[j] > key: arr[j+1] = arr[j], j -= 1\nAfter inner loop: arr[j+1] = key\nBest case: already sorted -- inner loop never runs -> O(n).',
    starterCode: '# Insertion Sort + Big-O Justification\n\ndef insertion_sort(arr):\n    """\n    Sort arr using insertion sort. Returns a new sorted list.\n\n    Time complexity:\n      Worst case:   O(?)  -- when input is ...\n      Average case: O(?)\n      Best case:    O(?)  -- when input is ...\n    Space complexity: O(?)\n\n    When to prefer over merge sort:\n      ...\n    """\n    arr = arr[:]   # work on a copy\n    # Your implementation here\n    return arr\n\n\ndef is_sorted(arr):\n    return all(arr[i] <= arr[i + 1] for i in range(len(arr) - 1))\n\n\n# --- Tests ---\ntest_cases = [\n    ([64, 34, 25, 12, 22, 11, 90], "random"),\n    ([1, 2, 3, 4, 5],              "already sorted (best case!)"),\n    ([5, 4, 3, 2, 1],              "reverse sorted (worst case!)"),\n    ([3],                          "single element"),\n    ([],                           "empty"),\n    ([2, 2, 2, 1],                 "with duplicates"),\n]\n\nall_pass = True\nfor arr, label in test_cases:\n    result = insertion_sort(arr)\n    ok = is_sorted(result) if result else True\n    all_pass = all_pass and ok\n    status = "PASS" if ok else "FAIL"\n    print(f"[{status}] {label}")\n    print(f"       Input:  {arr}")\n    print(f"       Output: {result}")\n\nprint()\nprint("All tests passed!" if all_pass else "Some tests FAILED.")\n'
  },

  {
    id: 'p10',
    title: 'Student Records Capstone',
    tags: ['OOP', 'File I/O', 'Sorting', 'Error Handling'],
    difficulty: 'medium-hard',
    statement: 'This is the capstone problem -- it deliberately feels like a small real program.\n\nYou have student records as CSV text. Build a full pipeline:\n\n1. class Student -- attributes: name, score (float), subject, email.\n   Properties: grade_letter, first_name\n   Dunders: __str__, __repr__, __lt__ (compare by score for sorting)\n\n2. load_students(csv_text) -- parse the CSV, return a list of Student objects.\n   Skip invalid rows (no warnings needed).\n\n3. report(students) -- print a full report:\n   - All students sorted by score (highest first) with grade letter\n   - Class average and highest/lowest scores\n   - Subject breakdown: average score per subject (alphabetical)',
    hint: 'Student.__lt__ enables sorted() to work on Student objects directly.\ngrade_letter: @property returning "A"/"B"/"C"/"F".\nfirst_name: self.name.split()[0]\nload_students: skip header, split rows on ",", wrap in try/except.\nSubject averages: build {subject: [scores]}, then compute mean per subject.',
    starterCode: '# Student Records Capstone\n\nCSV_DATA = """name,score,subject,email\nAlice Smith,88,Math,alice@school.edu\nBob Jones,72,Science,bob@school.edu\nCass White,95,Math,cass@school.edu\nDave Brown,61,History,dave@school.edu\nEve Green,84,Science,eve@school.edu\nFrank Black,53,Math,frank@school.edu\nGrace Hall,91,History,grace@school.edu\nHenry King,78,Science,henry@school.edu\n"""\n\n\nclass Student:\n    """\n    One student record.\n    Attributes: name, score (float), subject, email\n    Properties: grade_letter, first_name\n    Dunders: __str__, __repr__, __lt__ (compare by score)\n    """\n    pass\n\n\ndef load_students(csv_text):\n    """Parse CSV_DATA, return list of Student objects. Skip header + invalid rows."""\n    pass\n\n\ndef report(students):\n    """\n    Print:\n    1. All students sorted by score descending (with grade letter)\n    2. Class stats: average, highest, lowest\n    3. Subject averages (alphabetical)\n    """\n    pass\n\n\n# --- Run it ---\nstudents = load_students(CSV_DATA)\nprint(f"Loaded {len(students)} students.\\n")\nreport(students)\n'
  }
];
