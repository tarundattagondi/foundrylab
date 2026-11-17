// FoundryLab curriculum — every module, lesson, lab and quiz lives here.
//
// Shape:
//   module   { id, title, emoji, tagline, badge: { id, name, emoji }, lessons: [...] }
//   lesson   { id, title, minutes, theory: [block], activities: [activity], checkpoint? }
//   block    'paragraph with `code` and **bold**' | { code } | { tip }
//   activity one of:
//     { type: 'code', id, title, task, starter, solution, tests: [{ name, code, fail }], hints: [], xp, numpy? }
//     { type: 'quiz', id, title, questions: [{ q, code?, options, answer, explain }], xp }
//     { type: 'git',  id, title, intro, setup, steps: [{ prompt, hint, check(state, cmd) }], xp }
//     { type: 'viz',  id, title, component, xp }   // component name from components/viz
//
// Hidden tests are Python run in the same namespace as the learner's code.
// `__source__` holds their raw code and `__stdout__` holds what they printed.

// Tagged template for Python: keeps backslashes, trims the leading newline.
const py = (strings, ...vals) => String.raw(strings, ...vals).replace(/^\n/, '').replace(/\s+$/, '') + '\n'

export const XP = { code: 50, quiz: 40, git: 40, viz: 15, daily: 25 }

// ───────────────────────────────── MODULE 1 — PYTHON ─────────────────────────────────

const python = {
  id: 'python',
  title: 'Python',
  emoji: '🐍',
  tagline: 'The working subset of Python every GenAI codebase uses.',
  badge: { id: 'mod-python', name: 'Pythonista', emoji: '🐍' },
  lessons: [
    {
      id: 'py-collections',
      title: 'Lists, dicts, sets & tuples',
      minutes: 5,
      theory: [
        'Four containers do almost all the work in ML code:',
        '**list** `[1, 2, 3]` — ordered, changeable. Batches of examples. **dict** `{"lr": 0.01}` — key → value. Configs, vocabularies. **set** `{"a", "b"}` — unique items only. **tuple** `(32, 768)` — ordered but frozen. Tensor shapes are tuples!',
        { code: 'vocab = {"cat": 0, "dog": 1}\nvocab["cat"]        # 0\nset(["a", "a", "b"])  # {"a", "b"}\nshape = (32, 768)' },
        { tip: 'A tokenizer vocabulary is literally a dict from token strings to integer ids.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'py-vocab',
          title: 'Build a vocabulary',
          xp: XP.code,
          task: 'Write `build_vocab(words, ids)` that returns a dict mapping each word to its id, and `count_unique(tokens)` that returns how many *different* tokens appear.',
          starter: py`
def build_vocab(words, ids):
    # Return a dict mapping each word to its id.
    # build_vocab(["cat", "dog"], [0, 1]) -> {"cat": 0, "dog": 1}
    pass


def count_unique(tokens):
    # Return how many DIFFERENT tokens are in the list.
    pass


print(build_vocab(["cat", "dog"], [0, 1]))
print(count_unique(["the", "cat", "the", "hat"]))
`,
          solution: py`
def build_vocab(words, ids):
    return dict(zip(words, ids))


def count_unique(tokens):
    return len(set(tokens))


print(build_vocab(["cat", "dog"], [0, 1]))
print(count_unique(["the", "cat", "the", "hat"]))
`,
          tests: [
            { name: 'build_vocab maps words to ids', fail: 'Each word should point to the id at the same position', code: py`
_r = build_vocab(["cat", "dog"], [0, 1])
assert _r == {"cat": 0, "dog": 1}, f"got {_r!r}"
` },
            { name: 'build_vocab handles empty input', code: py`
_r = build_vocab([], [])
assert _r == {}, f"expected {{}}, got {_r!r}"
` },
            { name: 'count_unique counts distinct tokens', fail: '"the" appears twice but only counts once', code: py`
_r = count_unique(["the", "cat", "the", "hat"])
assert _r == 3, f"expected 3, got {_r!r}"
` },
          ],
          hints: [
            'A dict is built from (key, value) pairs. Which built-in pairs two lists up item by item?',
            '`zip(words, ids)` yields `("cat", 0), ("dog", 1)` — and `dict(...)` turns pairs into a dict.',
            'A `set` drops duplicates automatically. Wrap the tokens in `set(...)` and take its `len(...)`.',
          ],
        },
      ],
    },
    {
      id: 'py-loops',
      title: 'Loops & conditionals',
      minutes: 4,
      theory: [
        '`for` walks over every item; `if / elif / else` picks a branch. Together they turn model outputs into decisions.',
        { code: 'for p in [0.9, 0.2]:\n    if p >= 0.5:\n        print("positive")\n    else:\n        print("negative")' },
        { tip: 'A classifier outputs probabilities. A threshold turns them into labels.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'py-labels',
          title: 'Probabilities → labels',
          xp: XP.code,
          task: 'Complete `to_labels(probs, threshold=0.5)`: loop over `probs` and build a list with `1` where `p >= threshold`, else `0`.',
          starter: py`
def to_labels(probs, threshold=0.5):
    labels = []
    # Loop over probs. Append 1 if p >= threshold, otherwise append 0.

    return labels


print(to_labels([0.9, 0.2, 0.5]))  # [1, 0, 1]
`,
          solution: py`
def to_labels(probs, threshold=0.5):
    labels = []
    for p in probs:
        if p >= threshold:
            labels.append(1)
        else:
            labels.append(0)
    return labels


print(to_labels([0.9, 0.2, 0.5]))  # [1, 0, 1]
`,
          tests: [
            { name: 'labels with the default threshold', code: py`
_r = to_labels([0.9, 0.2, 0.5])
assert _r == [1, 0, 1], f"expected [1, 0, 1], got {_r!r}"
` },
            { name: 'respects a custom threshold', fail: 'Use the threshold argument, not a hard-coded 0.5', code: py`
_r = to_labels([0.6, 0.7], threshold=0.65)
assert _r == [0, 1], f"expected [0, 1], got {_r!r}"
` },
            { name: 'empty input gives an empty list', code: py`
assert to_labels([]) == []
` },
          ],
          hints: [
            'Start with `for p in probs:` and indent the body underneath.',
            'Inside the loop, `if p >= threshold:` then `labels.append(1)`, otherwise append `0`.',
            'Make sure you compare against `threshold`, not the number 0.5, so custom thresholds work.',
          ],
        },
      ],
    },
    {
      id: 'py-comprehensions',
      title: 'Comprehensions',
      minutes: 4,
      theory: [
        'A comprehension builds a list in one line: `[expression for item in iterable if condition]`.',
        { code: 'squares = [x * x for x in range(5)]       # [0, 1, 4, 9, 16]\nevens   = [x for x in range(10) if x % 2 == 0]' },
        { tip: 'You will see these everywhere in data-loading code: `[tokenize(t) for t in texts]`.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'py-reverse',
          title: 'Reverse with a comprehension',
          xp: XP.code,
          task: 'Write `reverse_list(xs)` using a **list comprehension** (no `.reverse()` or `[::-1]`), and `squares_of_evens(nums)` that returns the squares of only the even numbers.',
          starter: py`
def reverse_list(xs):
    # Use a list comprehension to return xs reversed.
    # Tip: indexes run from len(xs) - 1 down to 0.
    return xs


def squares_of_evens(nums):
    # [2, 3, 4] -> [4, 16]
    pass


print(reverse_list([1, 2, 3]))
print(squares_of_evens([1, 2, 3, 4]))
`,
          solution: py`
def reverse_list(xs):
    return [xs[i] for i in range(len(xs) - 1, -1, -1)]


def squares_of_evens(nums):
    return [n * n for n in nums if n % 2 == 0]


print(reverse_list([1, 2, 3]))
print(squares_of_evens([1, 2, 3, 4]))
`,
          tests: [
            { name: 'reverses a list', code: py`
_r = reverse_list([1, 2, 3])
assert _r == [3, 2, 1], f"expected [3, 2, 1], got {_r!r}"
` },
            { name: 'leaves the original list alone', fail: 'Build a new list instead of changing xs', code: py`
_x = [4, 5, 6]
reverse_list(_x)
assert _x == [4, 5, 6], f"the input became {_x!r}"
` },
            { name: 'reverse_list uses a list comprehension', fail: 'Try the shape [ ... for i in range(...) ]', code: py`
import ast as _ast
_tree = _ast.parse(__source__)
_fn = [n for n in _ast.walk(_tree) if isinstance(n, _ast.FunctionDef) and n.name == "reverse_list"][0]
assert any(isinstance(n, _ast.ListComp) for n in _ast.walk(_fn))
` },
            { name: 'squares only the even numbers', code: py`
_r = squares_of_evens([1, 2, 3, 4])
assert _r == [4, 16], f"expected [4, 16], got {_r!r}"
` },
          ],
          hints: [
            'You need indexes that count backwards. `range(start, stop, step)` can take a negative step.',
            '`range(len(xs) - 1, -1, -1)` gives the last index down to 0. Use each index to grab `xs[i]`.',
            'For the evens: `[n * n for n in nums if n % 2 == 0]` — the `if` goes at the end.',
          ],
        },
      ],
    },
    {
      id: 'py-functions',
      title: 'Functions, *args, **kwargs & lambda',
      minutes: 6,
      theory: [
        '`*args` collects extra positional arguments into a tuple. `**kwargs` collects extra keyword arguments into a dict. Training scripts use `**kwargs` to pass hyperparameters around.',
        { code: 'def f(*args, **kwargs):\n    print(args, kwargs)\n\nf(1, 2, lr=0.1)   # (1, 2) {"lr": 0.1}\n\ndouble = lambda x: x * 2' },
        { tip: '`{**defaults, **overrides}` merges two dicts — later keys win.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'py-kwargs',
          title: 'Config builder',
          xp: XP.code,
          task: 'Make `make_config(**kwargs)` return the defaults with any keyword arguments overriding them. Write `total(*args)` that sums any number of arguments, and set `square` to a lambda.',
          starter: py`
def make_config(**kwargs):
    config = {"lr": 0.001, "epochs": 10, "batch_size": 32}
    # Let kwargs override (or add to) the defaults.

    return config


def total(*args):
    # Return the sum of all arguments (0 if there are none).
    pass


square = None  # replace with a lambda that squares its input


print(make_config(lr=0.01))
print(total(1, 2, 3))
`,
          solution: py`
def make_config(**kwargs):
    config = {"lr": 0.001, "epochs": 10, "batch_size": 32}
    config.update(kwargs)
    return config


def total(*args):
    return sum(args)


square = lambda x: x * x


print(make_config(lr=0.01))
print(total(1, 2, 3))
`,
          tests: [
            { name: 'defaults with no arguments', code: py`
_r = make_config()
assert _r == {"lr": 0.001, "epochs": 10, "batch_size": 32}, f"got {_r!r}"
` },
            { name: 'kwargs override defaults', fail: 'lr=0.01 should replace the default lr', code: py`
_r = make_config(lr=0.01)
assert _r["lr"] == 0.01 and _r["epochs"] == 10, f"got {_r!r}"
` },
            { name: 'kwargs can add new keys', code: py`
_r = make_config(dropout=0.1)
assert _r.get("dropout") == 0.1, f"got {_r!r}"
` },
            { name: 'total sums any number of args', code: py`
assert total(1, 2, 3) == 6, f"total(1, 2, 3) gave {total(1, 2, 3)!r}"
assert total() == 0, f"total() gave {total()!r}"
` },
            { name: 'square is a lambda', fail: 'Write square = lambda x: ...', code: py`
assert callable(square) and square.__name__ == "<lambda>"
assert square(4) == 16, f"square(4) gave {square(4)!r}"
` },
          ],
          hints: [
            'Inside the function, `kwargs` is just a dict. How do you copy one dict\'s keys into another?',
            '`config.update(kwargs)` overwrites matching keys and adds new ones. `args` is a tuple — `sum()` loves tuples.',
            '`square = lambda x: x * x`',
          ],
        },
      ],
    },
    {
      id: 'py-classes',
      title: 'Classes & inheritance (hello, nn.Module)',
      minutes: 6,
      theory: [
        'Every PyTorch model is a **class** that inherits from `nn.Module`. `__init__` sets up the layers and parameters; `forward` does the math. Calling `model(x)` secretly calls `forward(x)` through `__call__`.',
        { code: 'class Module:\n    def __call__(self, x):\n        return self.forward(x)\n\nclass Double(Module):\n    def forward(self, x):\n        return x * 2\n\nDouble()(5)   # 10' },
        { tip: '`self.weight = weight` stores a value on the object so `forward` can use it later.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'py-linear',
          title: 'Your first layer',
          xp: XP.code,
          task: 'Finish `Linear(Module)`: `__init__` should store `weight` and `bias` on `self`, and `forward(x)` returns `weight * x + bias`.',
          starter: py`
class Module:
    """A tiny stand-in for torch.nn.Module."""
    def __call__(self, x):
        return self.forward(x)


class Linear(Module):
    def __init__(self, weight, bias):
        # Save weight and bias on self
        pass

    def forward(self, x):
        # Return weight * x + bias
        pass


layer = Linear(2, 1)
print(layer(3))  # 7
`,
          solution: py`
class Module:
    """A tiny stand-in for torch.nn.Module."""
    def __call__(self, x):
        return self.forward(x)


class Linear(Module):
    def __init__(self, weight, bias):
        self.weight = weight
        self.bias = bias

    def forward(self, x):
        return self.weight * x + self.bias


layer = Linear(2, 1)
print(layer(3))  # 7
`,
          tests: [
            { name: 'stores weight and bias', fail: 'Set self.weight and self.bias in __init__', code: py`
_l = Linear(2, 1)
assert getattr(_l, "weight", None) == 2 and getattr(_l, "bias", None) == 1
` },
            { name: 'forward computes weight * x + bias', code: py`
_r = Linear(0.5, -1).forward(4)
assert _r == 1.0, f"expected 1.0, got {_r!r}"
` },
            { name: 'calling the layer runs forward', code: py`
_r = Linear(2, 1)(3)
assert _r == 7, f"expected 7, got {_r!r}"
` },
            { name: 'Linear inherits from Module', code: py`
assert issubclass(Linear, Module)
` },
          ],
          hints: [
            'Inside `__init__`, anything you want to keep must be attached to `self`.',
            '`self.weight = weight` and `self.bias = bias`.',
            'In `forward`, read them back: `return self.weight * x + self.bias`.',
          ],
        },
      ],
    },
    {
      id: 'py-files',
      title: 'Files, JSON & virtual environments',
      minutes: 6,
      theory: [
        'Configs and datasets are often JSON. `json.dump(obj, f)` writes, `json.load(f)` reads. Use `with open(...)` so the file closes itself.',
        { code: 'import json\nwith open("cfg.json", "w") as f:\n    json.dump({"layers": 4}, f)\nwith open("cfg.json") as f:\n    cfg = json.load(f)' },
        '**Virtual environments** keep each project\'s packages separate: `python -m venv .venv`, then activate it and `pip install numpy`. Save versions with `pip freeze > requirements.txt` so others can `pip install -r requirements.txt`.',
        { tip: 'In FoundryLab, files live in a sandbox inside your browser tab — write away!' },
      ],
      activities: [
        {
          type: 'code',
          id: 'py-json',
          title: 'Save & load a config',
          xp: XP.code,
          task: 'Write `save_config(path, config)` to write a dict to a JSON file, and `load_config(path)` to read it back.',
          starter: py`
import json


def save_config(path, config):
    # Write the config dict to path as JSON.
    pass


def load_config(path):
    # Read the JSON file at path and return the dict.
    pass


save_config("config.json", {"model": "tiny-gpt", "layers": 4})
print(load_config("config.json"))
`,
          solution: py`
import json


def save_config(path, config):
    with open(path, "w") as f:
        json.dump(config, f)


def load_config(path):
    with open(path) as f:
        return json.load(f)


save_config("config.json", {"model": "tiny-gpt", "layers": 4})
print(load_config("config.json"))
`,
          tests: [
            { name: 'save_config creates a JSON file', fail: "save_config didn't write a file", code: py`
import os as _os, json as _json
_p = "/tmp/fl_cfg_test.json"
if _os.path.exists(_p):
    _os.remove(_p)
save_config(_p, {"a": 1})
assert _os.path.exists(_p)
with open(_p) as _f:
    assert _json.loads(_f.read()) == {"a": 1}, "the file isn't valid JSON for that dict"
` },
            { name: 'load_config reads it back', code: py`
_p = "/tmp/fl_cfg_test2.json"
save_config(_p, {"model": "tiny-gpt", "layers": 4})
_r = load_config(_p)
assert _r == {"model": "tiny-gpt", "layers": 4}, f"got {_r!r}"
` },
          ],
          hints: [
            'Open the file in write mode: `with open(path, "w") as f:`',
            '`json.dump(config, f)` writes; in `load_config` open normally and `return json.load(f)`.',
            'Make sure `load_config` actually `return`s the result — a missing return gives `None`.',
          ],
        },
        {
          type: 'quiz',
          id: 'py-venv-quiz',
          title: 'Quick check: venv & pip',
          xp: XP.quiz,
          questions: [
            {
              q: 'Why create a virtual environment for each project?',
              options: [
                'It makes Python run faster',
                "So each project's packages and versions don't clash with other projects",
                'It is required to use JSON',
                'It backs up your code to the cloud',
              ],
              answer: 1,
              explain: 'A venv is an isolated folder of packages. Project A can use NumPy 1.x while project B uses 2.x.',
            },
            {
              q: 'A teammate wants the exact packages you used. What do you share?',
              options: ['Your .venv folder', 'A requirements.txt from pip freeze', 'Your Python installer', 'Nothing — pip guesses'],
              answer: 1,
              explain: '`pip freeze > requirements.txt` lists versions; they run `pip install -r requirements.txt`. Never commit the .venv folder itself.',
            },
          ],
        },
      ],
    },
    {
      id: 'py-errors',
      title: 'f-strings & try/except',
      minutes: 5,
      theory: [
        'f-strings drop values into text: `f"loss: {loss:.2f}"` formats to 2 decimals.',
        '`try / except` catches errors so one bad input doesn\'t crash a whole training run.',
        { code: 'try:\n    x = float("banana")\nexcept ValueError:\n    x = None' },
        { tip: 'Catch the specific error you expect (like ValueError), not everything.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'py-safe-parse',
          title: 'Parse safely, report nicely',
          xp: XP.code,
          task: 'Make `safe_parse(text)` return a float, or `None` if the text isn\'t a number. Make `report(name, value)` return e.g. `"loss: 0.25"` (2 decimals) using an f-string.',
          starter: py`
def safe_parse(text):
    # Turn text into a float. If that fails, return None instead of crashing.
    return float(text)


def report(name, value):
    # report("loss", 0.2512) -> "loss: 0.25"
    pass


print(safe_parse("3.5"))
print(report("loss", 0.2512))
`,
          solution: py`
def safe_parse(text):
    try:
        return float(text)
    except ValueError:
        return None


def report(name, value):
    return f"{name}: {value:.2f}"


print(safe_parse("3.5"))
print(report("loss", 0.2512))
`,
          tests: [
            { name: 'parses a valid number', code: py`
assert safe_parse("3.5") == 3.5
` },
            { name: 'returns None for non-numbers', fail: 'Wrap float(text) in try/except ValueError', code: py`
_r = safe_parse("banana")
assert _r is None, f"expected None, got {_r!r}"
` },
            { name: 'returns None for empty text', code: py`
assert safe_parse("") is None
` },
            { name: 'report formats with 2 decimals', code: py`
_r = report("loss", 0.2512)
assert _r == "loss: 0.25", f"expected 'loss: 0.25', got {_r!r}"
_r = report("acc", 1)
assert _r == "acc: 1.00", f"expected 'acc: 1.00', got {_r!r}"
` },
          ],
          hints: [
            'Put the risky line inside `try:` and handle the failure in `except ValueError:`.',
            'In the except block, `return None`.',
            'For report: `return f"{name}: {value:.2f}"` — `:.2f` means 2 decimal places.',
          ],
        },
      ],
    },
    {
      id: 'py-checkpoint',
      title: 'Checkpoint: read a PyTorch model',
      minutes: 8,
      checkpoint: true,
      theory: [
        "Time to prove it! Real-world test: can you read a PyTorch-style model class and know what every line does? Then build a mini `Sequential` container yourself.",
      ],
      activities: [
        {
          type: 'quiz',
          id: 'py-checkpoint-quiz',
          title: 'What does each line do?',
          xp: XP.quiz,
          questions: [
            {
              q: 'What does `class TinyNet(nn.Module):` mean?',
              code: 'import torch.nn as nn\n\nclass TinyNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc = nn.Linear(4, 2)\n        self.act = nn.ReLU()\n\n    def forward(self, x):\n        return self.act(self.fc(x))\n\nnet = TinyNet()\nout = net(x)',
              options: [
                'TinyNet is a function that returns nn.Module',
                'TinyNet inherits from nn.Module, so it gets all of Module\'s behaviour',
                'TinyNet replaces nn.Module everywhere',
                'It imports TinyNet from PyTorch',
              ],
              answer: 1,
              explain: 'Parentheses in a class line name the parent class. TinyNet *is a* Module.',
            },
            {
              q: 'Why call `super().__init__()` first?',
              options: [
                'To delete the parent class',
                "It's optional decoration",
                "It runs nn.Module's own setup so PyTorch can track layers and parameters",
                'It calls forward()',
              ],
              answer: 2,
              explain: 'Skip it and PyTorch complains when you assign layers — the bookkeeping was never set up.',
            },
            {
              q: 'What does `self.fc = nn.Linear(4, 2)` do?',
              options: [
                'Runs the layer on 4 and 2',
                'Creates a layer mapping 4 input features to 2 outputs and stores it on the object',
                'Creates a 4×2 list',
                'Sets the learning rate',
              ],
              answer: 1,
              explain: 'It builds the layer (with its weights) once, in __init__, and keeps it as an attribute.',
            },
            {
              q: 'What actually happens on `out = net(x)`?',
              options: [
                "nn.Module's __call__ runs forward(x)",
                '__init__ runs again',
                'Python raises an error — objects are not callable',
                'x is saved to disk',
              ],
              answer: 0,
              explain: 'Calling the object goes through __call__, which calls forward (plus some hooks).',
            },
            {
              q: 'In `forward`, what order are the operations applied?',
              options: ['ReLU, then Linear', 'Linear, then ReLU', 'Both at the same time', 'Neither — forward is never called'],
              answer: 1,
              explain: 'Read inside-out: self.fc(x) first, then self.act(...) on the result.',
            },
          ],
        },
        {
          type: 'code',
          id: 'py-sequential',
          title: 'Build nn.Sequential',
          xp: XP.code,
          task: 'Implement `Sequential(*layers)`: store the layers, and in `forward` pass `x` through each layer in order.',
          starter: py`
class Module:
    def __call__(self, x):
        return self.forward(x)


class Double(Module):
    def forward(self, x):
        return x * 2


class AddOne(Module):
    def forward(self, x):
        return x + 1


class Sequential(Module):
    def __init__(self, *layers):
        # Store the layers
        pass

    def forward(self, x):
        # Pass x through every layer, in order, and return the result
        pass


model = Sequential(Double(), AddOne())
print(model(3))  # 7
`,
          solution: py`
class Module:
    def __call__(self, x):
        return self.forward(x)


class Double(Module):
    def forward(self, x):
        return x * 2


class AddOne(Module):
    def forward(self, x):
        return x + 1


class Sequential(Module):
    def __init__(self, *layers):
        self.layers = layers

    def forward(self, x):
        for layer in self.layers:
            x = layer(x)
        return x


model = Sequential(Double(), AddOne())
print(model(3))  # 7
`,
          tests: [
            { name: 'runs layers in order', code: py`
_r = Sequential(Double(), AddOne())(3)
assert _r == 7, f"expected 7, got {_r!r}"
` },
            { name: 'order matters', fail: 'AddOne then Double on 3 should be 8', code: py`
_r = Sequential(AddOne(), Double())(3)
assert _r == 8, f"expected 8, got {_r!r}"
` },
            { name: 'an empty Sequential returns x unchanged', code: py`
_r = Sequential()(5)
assert _r == 5, f"expected 5, got {_r!r}"
` },
            { name: 'is a Module', code: py`
assert isinstance(Sequential(), Module)
` },
          ],
          hints: [
            '`layers` arrives as a tuple. Keep it with `self.layers = layers`.',
            'In forward, loop: `for layer in self.layers:` and feed the output back into x.',
            '`x = layer(x)` inside the loop, then `return x` after it.',
          ],
        },
      ],
    },
  ],
}

// ───────────────────────────────── MODULE 2 — GIT ─────────────────────────────────
// GitSim state: { initialized, files: {name: 'untracked'|'modified'|'staged'|'committed'},
//   branch, branches: {name: [commitMsg]}, remote, pushed, pulled, merging, conflict, ignore: [] }

const git = {
  id: 'git',
  title: 'Git & GitHub',
  emoji: '🌿',
  tagline: 'Save, branch, share, and collaborate — without fear.',
  badge: { id: 'mod-git', name: 'Version Wizard', emoji: '🌿' },
  lessons: [
    {
      id: 'git-basics',
      title: 'Snapshots: init, add, commit',
      minutes: 5,
      theory: [
        'Git takes **snapshots** of your project. The flow is always: edit files → **stage** the ones you want (`git add`) → **commit** a snapshot with a message (`git commit -m "..."`).',
        { code: 'git init                 # start tracking this folder\ngit status               # what changed?\ngit add train.py         # stage it\ngit commit -m "Add training loop"\ngit log --oneline        # history' },
        { tip: 'The staging area lets you choose exactly what goes into each commit.' },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-first-commit',
          title: 'Your first commit',
          xp: XP.git,
          intro: 'You have a folder with train.py in it. Let\'s put it under version control.',
          setup: { initialized: false, files: { 'train.py': 'untracked' } },
          steps: [
            { prompt: 'Turn this folder into a git repository.', hint: 'git init', check: (s) => s.initialized },
            { prompt: 'Ask git what it sees.', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) },
            { prompt: 'Stage train.py for the next commit.', hint: 'git add train.py   (or git add .)', check: (s) => s.files['train.py'] === 'staged' },
            { prompt: 'Commit it with a message.', hint: 'git commit -m "Add training script"', check: (s) => (s.branches.main || []).length >= 1 },
            { prompt: 'Look at your history.', hint: 'git log   (or git log --oneline)', check: (s, cmd) => /^git log/.test(cmd) },
          ],
        },
      ],
    },
    {
      id: 'git-branches',
      title: 'Branches: try ideas safely',
      minutes: 5,
      theory: [
        'A **branch** is a parallel line of work. Experiment on a branch; if it works, **merge** it back into `main`. If not, nothing on main was harmed.',
        { code: 'git checkout -b experiment   # create + switch (or: git switch -c experiment)\n# ...work and commit...\ngit checkout main\ngit merge experiment' },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-branching',
          title: 'Branch, commit, merge',
          xp: XP.git,
          intro: 'Your repo has one commit on main. Try a new idea on a branch.',
          setup: { initialized: true, files: { 'model.py': 'committed' }, branches: { main: ['Initial model'] } },
          steps: [
            { prompt: 'Create a branch called experiment and switch to it.', hint: 'git checkout -b experiment   (or git switch -c experiment)', check: (s) => s.branch === 'experiment' },
            { prompt: 'Create a new file called notes.md.', hint: 'touch notes.md', check: (s) => 'notes.md' in s.files },
            { prompt: 'Stage and commit notes.md on this branch.', hint: 'git add notes.md, then git commit -m "Add notes"', check: (s) => (s.branches.experiment || []).length > (s.branches.main || []).length },
            { prompt: 'Switch back to main.', hint: 'git checkout main   (or git switch main)', check: (s) => s.branch === 'main' },
            { prompt: 'Merge experiment into main.', hint: 'git merge experiment', check: (s) => (s.branches.main || []).length >= 2 },
          ],
        },
      ],
    },
    {
      id: 'git-remotes',
      title: 'Remotes: clone, push, pull',
      minutes: 5,
      theory: [
        'GitHub hosts a **remote** copy of your repo. `git clone` downloads it, `git push` uploads your commits, `git pull` downloads everyone else\'s.',
        { code: 'git clone https://github.com/you/tiny-gpt.git\ngit push origin main\ngit pull' },
        { tip: 'Pull before you start working each day — fewer surprises later.' },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-remote-flow',
          title: 'Clone, push, pull',
          xp: XP.git,
          intro: 'A project lives on GitHub at https://github.com/foundrylab/tiny-gpt.git. Let\'s work on it.',
          setup: { initialized: false, files: {} },
          steps: [
            { prompt: 'Clone the repository.', hint: 'git clone https://github.com/foundrylab/tiny-gpt.git', check: (s) => s.initialized && !!s.remote },
            { prompt: 'Create a file called data.py.', hint: 'touch data.py', check: (s) => 'data.py' in s.files },
            { prompt: 'Stage and commit it.', hint: 'git add data.py, then git commit -m "Add data loader"', check: (s) => s.files['data.py'] === 'committed' },
            { prompt: 'Upload your commit to GitHub.', hint: 'git push   (or git push origin main)', check: (s) => s.pushed },
            { prompt: 'A teammate just pushed a fix. Download it.', hint: 'git pull', check: (s) => s.pulled },
          ],
        },
      ],
    },
    {
      id: 'git-conflicts',
      title: "Merge conflicts (don't panic)",
      minutes: 6,
      theory: [
        'A **conflict** happens when two branches change the same lines. Git marks the spot and asks you to choose:',
        { code: '<<<<<<< HEAD\nlr = 0.01\n=======\nlr = 0.001\n>>>>>>> fix-lr' },
        'Edit the file to keep what you want, delete the markers, then `git add` the file and `git commit` to finish the merge.',
        { tip: 'Conflicts are normal. They mean git is being careful, not that you broke something.' },
      ],
      activities: [
        {
          type: 'git',
          id: 'git-conflict',
          title: 'Resolve a conflict',
          xp: XP.git,
          intro: 'main and fix-lr both changed config.py. Merge them and resolve the conflict.',
          setup: {
            initialized: true,
            files: { 'config.py': 'committed' },
            branches: { main: ['Initial config', 'Set lr to 0.01'], 'fix-lr': ['Initial config', 'Set lr to 0.001'] },
            conflictWith: 'fix-lr',
            conflictFile: 'config.py',
          },
          steps: [
            { prompt: 'Merge the fix-lr branch into main.', hint: 'git merge fix-lr', check: (s) => s.merging },
            { prompt: 'Look inside the conflicted file.', hint: 'cat config.py', check: (s, cmd) => /^cat\s+config\.py/.test(cmd) },
            { prompt: 'Open it in your editor and fix it (we\'ll keep lr = 0.001 for you).', hint: 'code config.py   (nano or vim work too)', check: (s) => s.merging && !s.conflict },
            { prompt: 'Mark it resolved by staging it.', hint: 'git add config.py', check: (s) => s.files['config.py'] === 'staged' },
            { prompt: 'Finish the merge with a commit.', hint: 'git commit -m "Merge fix-lr"   (plain git commit works too)', check: (s) => !s.merging && s.files['config.py'] === 'committed' },
          ],
        },
      ],
    },
    {
      id: 'git-ignore',
      title: '.gitignore & README',
      minutes: 5,
      theory: [
        '`.gitignore` lists files git should pretend don\'t exist: virtual environments, big datasets, secrets, model checkpoints.',
        { code: '# .gitignore\n.venv/\n*.pt\n.env\ndata/' },
        'Every repo deserves a `README.md` in **Markdown**: `# Title`, `- bullet`, `**bold**`, and code fences with three backticks. GitHub renders it on the repo\'s front page.',
      ],
      activities: [
        {
          type: 'git',
          id: 'git-gitignore',
          title: 'Ignore the junk',
          xp: XP.git,
          intro: 'Your project has a .venv folder and a secrets file that must never be committed.',
          setup: { initialized: true, files: { 'train.py': 'untracked', '.venv/': 'untracked', '.env': 'untracked' }, branches: { main: [] } },
          steps: [
            { prompt: 'See what git wants to track.', hint: 'git status', check: (s, cmd) => /^git status/.test(cmd) },
            { prompt: 'Add .venv/ to a .gitignore file.', hint: 'echo ".venv/" >> .gitignore', check: (s) => s.ignore.includes('.venv/') },
            { prompt: 'Also ignore .env (your secrets).', hint: 'echo ".env" >> .gitignore', check: (s) => s.ignore.includes('.env') },
            { prompt: 'Stage everything that is left.', hint: 'git add .', check: (s) => s.files['train.py'] === 'staged' && s.files['.gitignore'] === 'staged' },
            { prompt: 'Commit — your secrets stay safe.', hint: 'git commit -m "Add train.py and .gitignore"', check: (s) => s.files['train.py'] === 'committed' },
          ],
        },
        {
          type: 'quiz',
          id: 'git-ignore-quiz',
          title: 'Quick check: .gitignore & README',
          xp: XP.quiz,
          questions: [
            {
              q: 'What is a .gitignore file for?',
              options: [
                'Deleting files you do not need',
                'Telling git which files and folders to never track (like .venv/ or secrets)',
                'Hiding files from your own computer',
                'Ignoring merge conflicts',
              ],
              answer: 1,
              explain: 'Ignored files stay on your disk; git just never stages or commits them.',
            },
            {
              q: 'You accidentally put an API key in .env. Which line keeps it out of git?',
              options: ['.env', 'API_KEY', 'secret', 'ignore .env'],
              answer: 0,
              explain: 'Each line is a filename or pattern. Add `.env` and git will skip it.',
            },
            {
              q: 'In README.md, how do you make a top-level heading?',
              options: ['<h1>Title', '# Title', '== Title ==', '**Title**'],
              answer: 1,
              explain: 'One `#` is a level-1 heading, `##` is level 2, and so on.',
            },
          ],
        },
      ],
    },
    {
      id: 'git-checkpoint',
      title: 'Checkpoint: fork, PR & issues',
      minutes: 5,
      checkpoint: true,
      theory: [
        'Open source runs on three ideas. **Fork**: your own copy of someone\'s repo on GitHub. **Pull Request (PR)**: "please merge my branch" — with review and discussion. **Issue**: a bug report or feature request.',
        'The typical contribution: fork → clone your fork → branch → commit → push → open a PR.',
      ],
      activities: [
        {
          type: 'quiz',
          id: 'git-checkpoint-quiz',
          title: 'Can you contribute to a real repo?',
          xp: XP.quiz,
          questions: [
            {
              q: "You want to fix a typo in a popular repo you don't have write access to. First step?",
              options: ['git push directly to their main', 'Fork the repo to your account', 'Open an issue titled "fixed"', 'Email the maintainer a zip'],
              answer: 1,
              explain: 'A fork gives you a copy you *can* push to. Then you open a PR back to the original.',
            },
            {
              q: 'What is a Pull Request?',
              options: [
                'A command that downloads changes',
                'A request for the maintainers to review and merge your branch',
                'A way to delete a branch',
                'A type of merge conflict',
              ],
              answer: 1,
              explain: '`git pull` downloads; a Pull Request is GitHub\'s review-and-merge workflow.',
            },
            {
              q: 'You found a bug but have no time to fix it. What do you open?',
              options: ['A fork', 'A PR', 'An issue', 'A new branch'],
              answer: 2,
              explain: 'Issues track bugs and ideas so someone can pick them up.',
            },
            {
              q: 'Which command creates a branch AND switches to it?',
              options: ['git branch -d fix', 'git checkout -b fix', 'git merge fix', 'git commit -b fix'],
              answer: 1,
              explain: '`git checkout -b fix` (or `git switch -c fix`).',
            },
            {
              q: 'Which belongs in .gitignore for a Python ML project?',
              options: ['train.py', 'README.md', '.venv/', 'requirements.txt'],
              answer: 2,
              explain: 'Share requirements.txt, never the venv itself — it is big and machine-specific.',
            },
          ],
        },
      ],
    },
  ],
}

// ───────────────────────────────── MODULE 3 — LINEAR ALGEBRA ─────────────────────────────────

const linalg = {
  id: 'linalg',
  title: 'Linear Algebra',
  emoji: '📐',
  tagline: 'Vectors, matrices and shapes — the language of every neural net.',
  badge: { id: 'mod-linalg', name: 'Matrix Mage', emoji: '📐' },
  lessons: [
    {
      id: 'la-vectors',
      title: 'Vectors: add & scale',
      minutes: 4,
      theory: [
        'A **vector** is a list of numbers — a point or an arrow. In GenAI, every token becomes a vector (an *embedding*). NumPy does math on whole vectors at once.',
        { code: 'import numpy as np\na = np.array([1, 2])\nb = np.array([3, 4])\na + b      # array([4, 6])\n2 * a      # array([2, 4])' },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-vec',
          title: 'Add & scale with NumPy',
          xp: XP.code,
          numpy: true,
          task: 'Write `add_and_scale(a, b, k)`: convert lists `a` and `b` to NumPy arrays, add them, multiply by `k`, and return the array.',
          starter: py`
import numpy as np


def add_and_scale(a, b, k):
    # Turn a and b into NumPy arrays, add them, multiply by k.
    pass


print(add_and_scale([1, 2], [3, 4], 2))  # [ 8 12]
`,
          solution: py`
import numpy as np


def add_and_scale(a, b, k):
    return k * (np.array(a) + np.array(b))


print(add_and_scale([1, 2], [3, 4], 2))  # [ 8 12]
`,
          tests: [
            { name: 'returns a NumPy array', fail: 'Use np.array(...) so the result is an ndarray', code: py`
import numpy as _np
assert isinstance(add_and_scale([1, 2], [3, 4], 2), _np.ndarray)
` },
            { name: 'adds then scales', code: py`
import numpy as _np
_r = add_and_scale([1, 2], [3, 4], 2)
assert _np.allclose(_r, [8, 12]), f"expected [8, 12], got {_r!r}"
` },
            { name: 'works for any length', code: py`
import numpy as _np
_r = add_and_scale([1, 0, -1], [1, 1, 1], 0.5)
assert _np.allclose(_r, [1, 0.5, 0]), f"got {_r!r}"
` },
          ],
          hints: [
            'Python lists + lists *concatenate*. NumPy arrays + arrays add element by element.',
            '`np.array(a) + np.array(b)` gives the sum vector.',
            'Multiply the whole thing by k: `return k * (np.array(a) + np.array(b))`.',
          ],
        },
      ],
    },
    {
      id: 'la-dot',
      title: 'Dot product = alignment',
      minutes: 5,
      theory: [
        'The **dot product** multiplies matching entries and adds them up: `[1,2]·[3,4] = 1·3 + 2·4 = 11`.',
        'Big positive → arrows point the same way. Zero → perpendicular (unrelated). Negative → opposite. Attention in transformers is built on dot products between query and key vectors.',
        { tip: 'Drag the arrows below and watch the number change.' },
      ],
      activities: [
        { type: 'viz', id: 'viz-dot', title: 'Dot product playground', component: 'DotProductViz', xp: XP.viz },
        {
          type: 'code',
          id: 'la-dot-lab',
          title: 'Dot product two ways',
          xp: XP.code,
          numpy: true,
          task: 'Write `dot(a, b)` using `np.dot`, and `dot_by_hand(a, b)` with a plain loop or `zip` — no NumPy.',
          starter: py`
import numpy as np


def dot(a, b):
    # Use np.dot
    pass


def dot_by_hand(a, b):
    # Multiply matching pairs and add them up, without NumPy.
    total = 0
    return total


print(dot([1, 2, 3], [4, 5, 6]))          # 32
print(dot_by_hand([1, 2, 3], [4, 5, 6]))  # 32
`,
          solution: py`
import numpy as np


def dot(a, b):
    return np.dot(a, b)


def dot_by_hand(a, b):
    total = 0
    for x, y in zip(a, b):
        total += x * y
    return total


print(dot([1, 2, 3], [4, 5, 6]))          # 32
print(dot_by_hand([1, 2, 3], [4, 5, 6]))  # 32
`,
          tests: [
            { name: 'np.dot version', code: py`
_r = dot([1, 2, 3], [4, 5, 6])
assert _r == 32, f"expected 32, got {_r!r}"
` },
            { name: 'by-hand version', code: py`
_r = dot_by_hand([1, 2, 3], [4, 5, 6])
assert _r == 32, f"expected 32, got {_r!r}"
` },
            { name: 'perpendicular vectors give 0', code: py`
assert dot([1, 0], [0, 1]) == 0 and dot_by_hand([1, 0], [0, 1]) == 0
` },
            { name: 'opposite vectors give a negative', code: py`
assert dot_by_hand([1, 2], [-1, -2]) == -5
` },
          ],
          hints: [
            '`np.dot(a, b)` does it all for the first one.',
            'For the by-hand version, `zip(a, b)` gives you matching pairs `(x, y)`.',
            'Inside the loop: `total += x * y`.',
          ],
        },
      ],
    },
    {
      id: 'la-matmul',
      title: 'Matrix multiplication & shapes',
      minutes: 6,
      theory: [
        'Matrix multiply `A @ B` only works when the **inner** dimensions match: `(m, n) @ (n, p) → (m, p)`. The inner `n`s cancel; the outer ones survive.',
        { code: '(2, 3) @ (3, 4) → (2, 4)   ✅\n(2, 3) @ (2, 3) → error    ❌' },
        { tip: 'Most PyTorch bugs are shape bugs. Tracking shapes in your head is a superpower.' },
      ],
      activities: [
        { type: 'viz', id: 'viz-matrix', title: 'Shape-matching playground', component: 'MatrixShapeViz', xp: XP.viz },
        {
          type: 'code',
          id: 'la-matmul-lab',
          title: 'Multiply and print the shape',
          xp: XP.code,
          numpy: true,
          task: 'Multiply `A` and `B` with `@`, store it in `C`, and `print` `C.shape`.',
          starter: py`
import numpy as np

A = np.ones((2, 3))
B = np.ones((3, 4))

# 1. Multiply A and B with the @ operator
C = None

# 2. Print C's shape
`,
          solution: py`
import numpy as np

A = np.ones((2, 3))
B = np.ones((3, 4))

C = A @ B
print(C.shape)
`,
          tests: [
            { name: 'C is a NumPy array', code: py`
import numpy as _np
assert isinstance(C, _np.ndarray), f"C is {type(C).__name__}"
` },
            { name: 'C has shape (2, 4)', code: py`
assert C.shape == (2, 4), f"got {C.shape}"
` },
            { name: 'values are right (each is 3.0)', fail: 'Use @ (matrix multiply), not *', code: py`
import numpy as _np
assert _np.allclose(C, 3.0)
` },
            { name: 'you printed the shape', fail: 'print(C.shape)', code: py`
assert "(2, 4)" in __stdout__, f"output was {__stdout__!r}"
` },
          ],
          hints: [
            'In NumPy, `@` is matrix multiplication.',
            '`C = A @ B`',
            'Every array has a `.shape` attribute: `print(C.shape)`.',
          ],
        },
        {
          type: 'code',
          id: 'la-shapes',
          title: 'Shape tracker',
          xp: XP.code,
          task: 'Write `matmul_shape(a, b)` that takes two shape tuples and returns the output shape of `a @ b`, or `None` if they can\'t multiply.',
          starter: py`
def matmul_shape(a, b):
    # a and b are tuples like (2, 3) and (3, 4).
    # Return the output shape, or None if they can't multiply.
    pass


print(matmul_shape((2, 3), (3, 4)))  # (2, 4)
print(matmul_shape((2, 3), (2, 3)))  # None
`,
          solution: py`
def matmul_shape(a, b):
    if a[1] != b[0]:
        return None
    return (a[0], b[1])


print(matmul_shape((2, 3), (3, 4)))  # (2, 4)
print(matmul_shape((2, 3), (2, 3)))  # None
`,
          tests: [
            { name: 'valid shapes', code: py`
_r = matmul_shape((2, 3), (3, 4))
assert _r == (2, 4), f"expected (2, 4), got {_r!r}"
` },
            { name: 'mismatched shapes give None', code: py`
_r = matmul_shape((2, 3), (2, 3))
assert _r is None, f"expected None, got {_r!r}"
` },
            { name: 'a transformer-sized example', code: py`
_r = matmul_shape((1, 768), (768, 3072))
assert _r == (1, 3072), f"got {_r!r}"
` },
          ],
          hints: [
            'Compare the inner dimensions: `a[1]` and `b[0]`.',
            'If they differ, `return None`.',
            'Otherwise the outer dimensions survive: `return (a[0], b[1])`.',
          ],
        },
      ],
    },
    {
      id: 'la-ops',
      title: 'Transpose, identity, inverse & element-wise',
      minutes: 6,
      theory: [
        '`A.T` (**transpose**) flips rows and columns: `(2, 3) → (3, 2)`. `np.eye(n)` is the **identity** — the matrix version of 1. `np.linalg.inv(A)` gives the **inverse**, so `A @ inv(A) = I`.',
        '`A * B` multiplies **element by element** (same shapes). `A @ B` is **matrix multiplication**. Mixing them up is a classic bug.',
        { code: 'A * B   # element-wise\nA @ B   # matrix product' },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-ops-lab',
          title: 'The matrix toolbox',
          xp: XP.code,
          numpy: true,
          task: 'Fill in each variable using NumPy.',
          starter: py`
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

elementwise = None      # A times B, element by element
matrix_product = None   # A matrix-multiplied by B
A_T = None              # transpose of A
I = None                # 2x2 identity matrix
A_inv = None            # inverse of A

print(elementwise)
print(matrix_product)
`,
          solution: py`
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

elementwise = A * B
matrix_product = A @ B
A_T = A.T
I = np.eye(2)
A_inv = np.linalg.inv(A)

print(elementwise)
print(matrix_product)
`,
          tests: [
            { name: 'element-wise product', code: py`
import numpy as _np
assert elementwise is not None and _np.array_equal(elementwise, [[5, 12], [21, 32]]), f"got {elementwise!r}"
` },
            { name: 'matrix product', fail: 'Use @ for matrix multiplication', code: py`
import numpy as _np
assert matrix_product is not None and _np.array_equal(matrix_product, [[19, 22], [43, 50]]), f"got {matrix_product!r}"
` },
            { name: 'transpose', code: py`
import numpy as _np
assert A_T is not None and _np.array_equal(A_T, [[1, 3], [2, 4]]), f"got {A_T!r}"
` },
            { name: 'identity', code: py`
import numpy as _np
assert I is not None and _np.array_equal(I, [[1, 0], [0, 1]]), f"got {I!r}"
` },
            { name: 'A @ A_inv is the identity', code: py`
import numpy as _np
assert A_inv is not None and _np.allclose(A @ A_inv, _np.eye(2)), f"A @ A_inv = {None if A_inv is None else A @ A_inv!r}"
` },
          ],
          hints: [
            '`*` is element-wise, `@` is matrix multiply.',
            'Transpose is an attribute: `A.T`. Identity: `np.eye(2)`.',
            'Inverse lives in the linear-algebra submodule: `np.linalg.inv(A)`.',
          ],
        },
      ],
    },
    {
      id: 'la-cosine',
      title: 'Cosine similarity: how embeddings measure meaning',
      minutes: 6,
      theory: [
        'Words with similar meaning get embedding vectors that point in similar **directions**. **Cosine similarity** measures just the angle, ignoring length:',
        { code: 'cos(a, b) = (a · b) / (|a| × |b|)\n# 1 = same direction, 0 = unrelated, -1 = opposite' },
        { tip: 'Semantic search, RAG and recommendation systems all rank results by cosine similarity.' },
      ],
      activities: [
        { type: 'viz', id: 'viz-cosine', title: 'Similarity playground', component: 'VectorSimilarityViz', xp: XP.viz },
        {
          type: 'code',
          id: 'la-cosine-lab',
          title: 'Implement cosine similarity',
          xp: XP.code,
          numpy: true,
          task: 'Write `cosine_similarity(a, b)` using `np.dot` and `np.linalg.norm`. Return a float.',
          starter: py`
import numpy as np


def cosine_similarity(a, b):
    # dot(a, b) / (length of a * length of b)
    pass


print(cosine_similarity([1, 0], [1, 1]))  # ~0.707
`,
          solution: py`
import numpy as np


def cosine_similarity(a, b):
    a, b = np.array(a, dtype=float), np.array(b, dtype=float)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


print(cosine_similarity([1, 0], [1, 1]))  # ~0.707
`,
          tests: [
            { name: 'same direction → 1', code: py`
_r = cosine_similarity([1, 2], [2, 4])
assert _r is not None and abs(_r - 1) < 1e-6, f"got {_r!r}"
` },
            { name: 'opposite → -1', code: py`
_r = cosine_similarity([1, 2], [-1, -2])
assert _r is not None and abs(_r + 1) < 1e-6, f"got {_r!r}"
` },
            { name: 'perpendicular → 0', code: py`
_r = cosine_similarity([1, 0], [0, 5])
assert _r is not None and abs(_r) < 1e-6, f"got {_r!r}"
` },
            { name: '45° apart → ~0.707', fail: 'Divide by BOTH lengths', code: py`
_r = cosine_similarity([1, 0], [1, 1])
assert _r is not None and abs(_r - 0.70710678) < 1e-4, f"got {_r!r}"
` },
          ],
          hints: [
            'The top of the fraction is `np.dot(a, b)`.',
            'The length of a vector is `np.linalg.norm(a)`.',
            '`return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))`',
          ],
        },
      ],
    },
    {
      id: 'la-checkpoint',
      title: 'Checkpoint: shapes under pressure',
      minutes: 7,
      checkpoint: true,
      theory: ['Real test: given two shapes, can you say instantly whether they multiply and what comes out? Then compute attention-style scores.'],
      activities: [
        {
          type: 'quiz',
          id: 'la-checkpoint-quiz',
          title: 'Can these multiply?',
          xp: XP.quiz,
          questions: [
            { q: 'What is the shape of `(2, 3) @ (3, 4)`?', options: ['(3, 3)', '(2, 4)', '(4, 2)', "Can't multiply"], answer: 1, explain: 'Inner 3s match and cancel; outer 2 and 4 remain.' },
            { q: 'What is the shape of `(3, 2) @ (3, 2)`?', options: ['(3, 2)', '(2, 2)', '(3, 3)', "Can't multiply"], answer: 3, explain: 'Inner dims are 2 and 3 — no match. You would need to transpose one: (3,2) @ (2,3) → (3,3).' },
            { q: 'A token embedding `(1, 768)` goes through a weight `(768, 3072)`. Output?', options: ['(768, 768)', '(1, 3072)', '(3072, 1)', "Can't multiply"], answer: 1, explain: 'That is literally the first layer of a GPT-2 MLP block.' },
            { q: 'A batch `(32, 10)` @ weights `(10, 1)` gives…', options: ['(32, 1)', '(10, 10)', '(32, 10)', "Can't multiply"], answer: 0, explain: 'One prediction per example in the batch.' },
            { q: 'If `A` has shape `(5, 3)`, what is `A.T.shape`?', options: ['(5, 3)', '(3, 5)', '(15,)', '(3, 3)'], answer: 1, explain: 'Transpose swaps the two dimensions.' },
          ],
        },
        {
          type: 'code',
          id: 'la-scores',
          title: 'Attention scores',
          xp: XP.code,
          numpy: true,
          task: 'Queries `Q` have shape `(n, d)` and keys `K` have shape `(m, d)`. Write `scores(Q, K)` returning every query·key dot product — shape `(n, m)`.',
          starter: py`
import numpy as np


def scores(Q, K):
    # Q: (n, d), K: (m, d). Return an (n, m) matrix of dot products.
    # Hint: shapes must line up for @ ...
    pass


Q = np.random.rand(3, 4)
K = np.random.rand(5, 4)
print(scores(Q, K).shape)  # (3, 5)
`,
          solution: py`
import numpy as np


def scores(Q, K):
    return Q @ K.T


Q = np.random.rand(3, 4)
K = np.random.rand(5, 4)
print(scores(Q, K).shape)  # (3, 5)
`,
          tests: [
            { name: 'output shape is (n, m)', code: py`
import numpy as _np
_r = scores(_np.ones((3, 4)), _np.ones((5, 4)))
assert _r is not None and _r.shape == (3, 5), f"got {None if _r is None else _r.shape}"
` },
            { name: 'entries are query·key dot products', code: py`
import numpy as _np
_Q = _np.array([[1.0, 0.0], [0.0, 2.0]])
_K = _np.array([[3.0, 4.0], [1.0, 1.0], [0.0, -1.0]])
_r = scores(_Q, _K)
assert _np.allclose(_r, [[3, 1, 0], [8, 2, -2]]), f"got {_r!r}"
` },
          ],
          hints: [
            '`Q @ K` fails: (n, d) @ (m, d) — the inner dims are d and m.',
            'Transpose K so it becomes (d, m).',
            '`return Q @ K.T`',
          ],
        },
      ],
    },
  ],
}

// ───────────────────────────────── MODULE 4 — CALCULUS ─────────────────────────────────

const calculus = {
  id: 'calculus',
  title: 'Calculus',
  emoji: '⛰️',
  tagline: 'Slopes, gradients and the chain rule — how models learn.',
  badge: { id: 'mod-calculus', name: 'Gradient Guru', emoji: '⛰️' },
  lessons: [
    {
      id: 'calc-derivative',
      title: 'Derivatives = slope',
      minutes: 5,
      theory: [
        'A **derivative** tells you how fast a function changes at a point — the slope of the curve there. You can estimate it numerically by nudging `x` a tiny bit:',
        { code: "f'(x) ≈ (f(x + h) - f(x - h)) / (2h)     # h tiny, like 1e-5" },
        { tip: 'Frameworks compute exact derivatives automatically (autograd), but this trick is how you sanity-check them.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-deriv',
          title: 'Numerical derivative',
          xp: XP.code,
          task: 'Implement `derivative(func, x, h=1e-5)` using the central-difference formula above.',
          starter: py`
def f(x):
    return x ** 2 + 3 * x


def derivative(func, x, h=1e-5):
    # (func(x + h) - func(x - h)) / (2 * h)
    pass


print(derivative(f, 2))  # close to 7
`,
          solution: py`
def f(x):
    return x ** 2 + 3 * x


def derivative(func, x, h=1e-5):
    return (func(x + h) - func(x - h)) / (2 * h)


print(derivative(f, 2))  # close to 7
`,
          tests: [
            { name: "f'(2) ≈ 7", code: py`
_r = derivative(f, 2)
assert _r is not None and abs(_r - 7) < 1e-3, f"got {_r!r}"
` },
            { name: 'works for any function', fail: 'Use func, not f, inside derivative', code: py`
_r = derivative(lambda x: x ** 3, 2)
assert _r is not None and abs(_r - 12) < 1e-3, f"x**3 at 2 should be ~12, got {_r!r}"
` },
            { name: "sin'(0) ≈ 1", code: py`
import math as _m
_r = derivative(_m.sin, 0)
assert _r is not None and abs(_r - 1) < 1e-4, f"got {_r!r}"
` },
          ],
          hints: [
            'Call `func` at two nearby points: `x + h` and `x - h`.',
            'Take their difference, then divide by the distance between them, `2 * h`.',
            '`return (func(x + h) - func(x - h)) / (2 * h)`',
          ],
        },
      ],
    },
    {
      id: 'calc-chain',
      title: 'Chain rule = backprop',
      minutes: 6,
      theory: [
        'A neural net is functions inside functions. The **chain rule** says the derivative of a chain is the product of each link\'s derivative:',
        { code: 'y = f(g(x))\ndy/dx = f\'(g(x)) · g\'(x)' },
        '**Backpropagation** is just the chain rule run from the output backward: each layer multiplies the gradient coming in by its own local derivative and passes it on.',
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-chain-lab',
          title: 'Backprop by hand',
          xp: XP.code,
          task: 'For `z = w * x` and `y = z ** 2`, fill in the backward pass to get `dy/dw`.',
          starter: py`
def forward_backward(x, w):
    # Forward pass
    z = w * x
    y = z ** 2

    # Backward pass (chain rule)
    dy_dz = None   # derivative of z**2 with respect to z
    dz_dw = None   # derivative of w*x with respect to w
    dy_dw = None   # chain them together

    return y, dy_dw


print(forward_backward(2, 3))  # (36, 24)
`,
          solution: py`
def forward_backward(x, w):
    z = w * x
    y = z ** 2

    dy_dz = 2 * z
    dz_dw = x
    dy_dw = dy_dz * dz_dw

    return y, dy_dw


print(forward_backward(2, 3))  # (36, 24)
`,
          tests: [
            { name: 'forward value', code: py`
_y, _g = forward_backward(2, 3)
assert _y == 36, f"y should be 36, got {_y!r}"
` },
            { name: 'gradient dy/dw', fail: 'dy/dw = (2z) * x', code: py`
_y, _g = forward_backward(2, 3)
assert _g == 24, f"expected 24, got {_g!r}"
` },
            { name: 'matches a numerical check', code: py`
_x, _w, _h = 1.5, -0.7, 1e-6
_num = ((_w + _h) * _x) ** 2 - ((_w - _h) * _x) ** 2
_num /= 2 * _h
_y, _g = forward_backward(_x, _w)
assert _g is not None and abs(_g - _num) < 1e-4, f"got {_g!r}, numerical says {_num:.4f}"
` },
          ],
          hints: [
            'The derivative of z² with respect to z is 2z.',
            'The derivative of w·x with respect to w is just x.',
            'Chain rule: `dy_dw = dy_dz * dz_dw`.',
          ],
        },
      ],
    },
    {
      id: 'calc-gradients',
      title: 'Partial derivatives & gradients',
      minutes: 5,
      theory: [
        'Real models have millions of parameters. A **partial derivative** asks: "how does the loss change if I nudge just this one parameter?" Stack all of them and you get the **gradient** — an arrow pointing uphill.',
        { code: 'L(w, b) = (w - 2)² + (b + 1)²\n∂L/∂w = 2(w - 2)\n∂L/∂b = 2(b + 1)' },
        { tip: 'At the minimum, every partial derivative is zero — the ground is flat.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-grad-lab',
          title: 'Compute a gradient',
          xp: XP.code,
          task: 'Return the gradient of `loss(w, b)` as a tuple `(dL/dw, dL/db)`.',
          starter: py`
def loss(w, b):
    return (w - 2) ** 2 + (b + 1) ** 2


def gradient(w, b):
    # Return (dL/dw, dL/db)
    pass


print(gradient(0, 0))  # (-4, 2)
`,
          solution: py`
def loss(w, b):
    return (w - 2) ** 2 + (b + 1) ** 2


def gradient(w, b):
    return (2 * (w - 2), 2 * (b + 1))


print(gradient(0, 0))  # (-4, 2)
`,
          tests: [
            { name: 'gradient at (0, 0)', code: py`
_r = gradient(0, 0)
assert _r is not None and tuple(_r) == (-4, 2), f"expected (-4, 2), got {_r!r}"
` },
            { name: 'zero at the minimum', fail: 'At w=2, b=-1 the loss is smallest', code: py`
_r = gradient(2, -1)
assert _r is not None and tuple(_r) == (0, 0), f"got {_r!r}"
` },
            { name: 'another point', code: py`
_r = gradient(5, 1)
assert _r is not None and tuple(_r) == (6, 4), f"got {_r!r}"
` },
          ],
          hints: [
            'Treat b as a constant when differentiating with respect to w (and vice versa).',
            'd/dw of (w - 2)² is 2(w - 2). The b-term does not depend on w, so it vanishes.',
            '`return (2 * (w - 2), 2 * (b + 1))`',
          ],
        },
      ],
    },
    {
      id: 'calc-gd',
      title: 'Gradient descent & learning rate',
      minutes: 6,
      theory: [
        'To minimise a loss, step **against** the gradient: `x = x - lr * grad(x)`. The **learning rate** `lr` is your step size.',
        'Too small → painfully slow. Too big → you overshoot the valley and bounce out. Play with it below!',
      ],
      activities: [
        { type: 'viz', id: 'viz-gd', title: 'Roll the ball downhill', component: 'GradientDescentViz', xp: XP.viz },
        {
          type: 'code',
          id: 'calc-gd-lab',
          title: 'One step at a time',
          xp: XP.code,
          task: 'Implement `gd_step(x, lr)` (one step of gradient descent on `f(x) = (x - 3)²`) and `run_gd(x0, lr, steps)` that applies it repeatedly.',
          starter: py`
def grad(x):
    # derivative of f(x) = (x - 3) ** 2
    return 2 * (x - 3)


def gd_step(x, lr):
    # Move x against the gradient, scaled by lr.
    pass


def run_gd(x0, lr, steps):
    # Apply gd_step 'steps' times starting from x0. Return the final x.
    pass


print(run_gd(0.0, 0.1, 50))  # close to 3
`,
          solution: py`
def grad(x):
    return 2 * (x - 3)


def gd_step(x, lr):
    return x - lr * grad(x)


def run_gd(x0, lr, steps):
    x = x0
    for _ in range(steps):
        x = gd_step(x, lr)
    return x


print(run_gd(0.0, 0.1, 50))  # close to 3
`,
          tests: [
            { name: 'one step from 0 with lr=0.1', fail: 'x - lr * grad(x)', code: py`
_r = gd_step(0.0, 0.1)
assert _r is not None and abs(_r - 0.6) < 1e-9, f"expected 0.6, got {_r!r}"
` },
            { name: 'converges to the minimum', code: py`
_r = run_gd(0.0, 0.1, 100)
assert _r is not None and abs(_r - 3) < 1e-3, f"got {_r!r}"
` },
            { name: 'too-big learning rate overshoots', fail: 'With lr=1.1 every step should overshoot further', code: py`
_r = run_gd(0.0, 1.1, 20)
assert _r is not None and abs(_r - 3) > 10, f"got {_r!r}"
` },
          ],
          hints: [
            'Gradient points uphill. To go down, subtract it.',
            '`return x - lr * grad(x)`',
            'In run_gd: start `x = x0`, loop `steps` times with `x = gd_step(x, lr)`, then return x.',
          ],
        },
      ],
    },
    {
      id: 'calc-checkpoint',
      title: 'Checkpoint: train a one-weight model',
      minutes: 8,
      checkpoint: true,
      theory: ['Real test: explain why backprop flows backward, then train a tiny model with gradient descent from scratch.'],
      activities: [
        {
          type: 'quiz',
          id: 'calc-checkpoint-quiz',
          title: 'Why does the signal flow backward?',
          xp: XP.quiz,
          questions: [
            {
              q: 'Why does backpropagation start at the loss and move backward?',
              options: [
                "Because computers read code bottom-up",
                'The chain rule builds each gradient from the one after it — so you need the later layers\' gradients first',
                'To save memory by deleting early layers',
                'Forward passes are not allowed to compute gradients',
              ],
              answer: 1,
              explain: 'dL/d(layer1) = dL/d(layer2) · d(layer2)/d(layer1). You need the downstream gradient before you can compute the upstream one.',
            },
            {
              q: 'If `y = f(g(x))`, what is `dy/dx`?',
              options: ["f'(x) + g'(x)", "f'(g(x)) · g'(x)", "f(g'(x))", "f'(x) / g'(x)"],
              answer: 1,
              explain: 'Multiply the local derivatives along the chain.',
            },
            {
              q: 'Your loss is jumping around and getting bigger. Most likely fix?',
              options: ['Raise the learning rate', 'Lower the learning rate', 'Remove the loss', 'Add more print statements'],
              answer: 1,
              explain: 'Diverging loss is the classic sign of steps that are too large.',
            },
            {
              q: 'At a minimum of the loss, the gradient is…',
              options: ['Very large', 'Zero (flat)', 'Always negative', 'Undefined'],
              answer: 1,
              explain: 'Flat ground means no direction is downhill.',
            },
          ],
        },
        {
          type: 'code',
          id: 'calc-train',
          title: 'Fit y = w·x',
          xp: XP.code,
          task: 'Fill in the training loop: compute the gradient of the mean squared error with respect to `w`, then update `w`. It should learn `w ≈ 2` for `y = 2x`.',
          starter: py`
def train(xs, ys, lr=0.01, steps=200):
    w = 0.0
    for _ in range(steps):
        # loss = mean of (w*x - y)**2
        # dL/dw = mean of 2 * (w*x - y) * x
        grad = 0.0
        # compute grad here, then update w

    return w


print(train([1, 2, 3], [2, 4, 6]))  # ~2.0
`,
          solution: py`
def train(xs, ys, lr=0.01, steps=200):
    w = 0.0
    for _ in range(steps):
        grad = sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)
        w = w - lr * grad
    return w


print(train([1, 2, 3], [2, 4, 6]))  # ~2.0
`,
          tests: [
            { name: 'learns w ≈ 2', code: py`
_r = train([1, 2, 3], [2, 4, 6])
assert abs(_r - 2) < 0.01, f"got w = {_r!r}"
` },
            { name: 'learns a different slope', fail: 'Make sure you use xs and ys, not hard-coded numbers', code: py`
_r = train([1, 2, 3, 4], [-1.5, -3, -4.5, -6])
assert abs(_r + 1.5) < 0.01, f"expected ~-1.5, got {_r!r}"
` },
          ],
          hints: [
            'Loop over pairs with `zip(xs, ys)` and add up `2 * (w * x - y) * x`, then divide by `len(xs)`.',
            'After computing grad, update: `w = w - lr * grad`.',
            '`grad = sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)` then `w = w - lr * grad`.',
          ],
        },
      ],
    },
  ],
}

// ───────────────────────────────── MODULE 5 — PROBABILITY ─────────────────────────────────

const probability = {
  id: 'probability',
  title: 'Probability & Stats',
  emoji: '🎲',
  tagline: 'Next-token prediction, sampling, temperature, and honest metrics.',
  badge: { id: 'mod-probability', name: 'Sampling Sorcerer', emoji: '🎲' },
  lessons: [
    {
      id: 'prob-conditional',
      title: 'Conditional probability = next-token prediction',
      minutes: 5,
      theory: [
        '`P(A | B)` means "the probability of A, **given** B happened". A language model computes exactly this: `P(next token | previous tokens)`.',
        { code: '"the" was followed by "cat" 3 times and "dog" 1 time\nP(cat | the) = 3 / 4 = 0.75\nP(dog | the) = 1 / 4 = 0.25' },
        { tip: 'A bigram model is the simplest LLM: count what follows each word, then divide.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-cond',
          title: 'A tiny bigram model',
          xp: XP.code,
          task: 'Write `next_token_probs(counts, prev)` returning a dict of `P(next | prev)` — each count divided by the total count for `prev`.',
          starter: py`
counts = {
    "the": {"cat": 3, "dog": 1},
    "cat": {"sat": 2, "ran": 2},
}


def next_token_probs(counts, prev):
    # Return {token: probability} for what follows prev.
    pass


print(next_token_probs(counts, "the"))  # {'cat': 0.75, 'dog': 0.25}
`,
          solution: py`
counts = {
    "the": {"cat": 3, "dog": 1},
    "cat": {"sat": 2, "ran": 2},
}


def next_token_probs(counts, prev):
    followers = counts[prev]
    total = sum(followers.values())
    return {tok: c / total for tok, c in followers.items()}


print(next_token_probs(counts, "the"))  # {'cat': 0.75, 'dog': 0.25}
`,
          tests: [
            { name: 'P(· | "the")', code: py`
_r = next_token_probs(counts, "the")
assert _r is not None and abs(_r["cat"] - 0.75) < 1e-9 and abs(_r["dog"] - 0.25) < 1e-9, f"got {_r!r}"
` },
            { name: 'probabilities sum to 1', code: py`
_r = next_token_probs({"a": {"x": 1, "y": 2, "z": 7}}, "a")
assert _r is not None and abs(sum(_r.values()) - 1) < 1e-9, f"got {_r!r}"
` },
            { name: 'uses the counts you pass in', fail: 'Read from the counts argument', code: py`
_r = next_token_probs({"hi": {"there": 9, "!": 1}}, "hi")
assert _r is not None and abs(_r["there"] - 0.9) < 1e-9, f"got {_r!r}"
` },
          ],
          hints: [
            '`counts[prev]` is a dict like `{"cat": 3, "dog": 1}`.',
            'Total = `sum(followers.values())`.',
            'A dict comprehension: `{tok: c / total for tok, c in followers.items()}`.',
          ],
        },
      ],
    },
    {
      id: 'prob-gaussian',
      title: 'Distributions & the Gaussian',
      minutes: 5,
      theory: [
        'A **distribution** says how likely each value is. The **normal (Gaussian)** distribution is the famous bell curve, set by a mean `μ` (centre) and standard deviation `σ` (width). Neural-net weights are usually initialised from one.',
        { code: 'pdf(x) = exp(-(x - μ)² / (2σ²)) / (σ · √(2π))' },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-gauss',
          title: 'The bell curve',
          xp: XP.code,
          task: 'Implement `gaussian_pdf(x, mu, sigma)` using the formula above (use the `math` module).',
          starter: py`
import math


def gaussian_pdf(x, mu, sigma):
    # exp(-(x - mu)**2 / (2 * sigma**2)) / (sigma * sqrt(2 * pi))
    pass


print(gaussian_pdf(0, 0, 1))  # ~0.3989
`,
          solution: py`
import math


def gaussian_pdf(x, mu, sigma):
    return math.exp(-(x - mu) ** 2 / (2 * sigma ** 2)) / (sigma * math.sqrt(2 * math.pi))


print(gaussian_pdf(0, 0, 1))  # ~0.3989
`,
          tests: [
            { name: 'peak of the standard normal', code: py`
_r = gaussian_pdf(0, 0, 1)
assert _r is not None and abs(_r - 0.398942) < 1e-5, f"got {_r!r}"
` },
            { name: 'symmetric around the mean', code: py`
assert abs(gaussian_pdf(1, 0, 1) - gaussian_pdf(-1, 0, 1)) < 1e-12
` },
            { name: 'wider sigma → lower peak', fail: 'Divide by sigma too', code: py`
_r = gaussian_pdf(5, 5, 2)
assert abs(_r - 0.199471) < 1e-5, f"got {_r!r}"
` },
          ],
          hints: [
            'You need `math.exp`, `math.sqrt` and `math.pi`.',
            'Numerator: `math.exp(-(x - mu) ** 2 / (2 * sigma ** 2))`.',
            'Denominator: `sigma * math.sqrt(2 * math.pi)`.',
          ],
        },
      ],
    },
    {
      id: 'prob-stats',
      title: 'Mean, variance & standard deviation',
      minutes: 4,
      theory: [
        '**Mean**: the average. **Variance**: the average squared distance from the mean. **Standard deviation**: the square root of variance — "typical distance from average", in the original units.',
        { code: 'np.mean(x), np.var(x), np.std(x)' },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-stats-lab',
          title: 'Describe a dataset',
          xp: XP.code,
          numpy: true,
          task: 'Write `describe(arr)` returning `(mean, variance, std)` using NumPy.',
          starter: py`
import numpy as np


def describe(arr):
    # Return (mean, variance, std)
    pass


print(describe([2, 4, 4, 4, 5, 5, 7, 9]))  # (5.0, 4.0, 2.0)
`,
          solution: py`
import numpy as np


def describe(arr):
    arr = np.array(arr)
    return (float(np.mean(arr)), float(np.var(arr)), float(np.std(arr)))


print(describe([2, 4, 4, 4, 5, 5, 7, 9]))  # (5.0, 4.0, 2.0)
`,
          tests: [
            { name: 'mean', code: py`
_r = describe([2, 4, 4, 4, 5, 5, 7, 9])
assert _r is not None and abs(_r[0] - 5) < 1e-9, f"got {_r!r}"
` },
            { name: 'variance', code: py`
_r = describe([2, 4, 4, 4, 5, 5, 7, 9])
assert abs(_r[1] - 4) < 1e-9, f"expected 4, got {_r[1]!r}"
` },
            { name: 'standard deviation', fail: 'std is the square root of variance', code: py`
_r = describe([2, 4, 4, 4, 5, 5, 7, 9])
assert abs(_r[2] - 2) < 1e-9, f"expected 2, got {_r[2]!r}"
` },
          ],
          hints: [
            'NumPy has a function for each: `np.mean`, `np.var`, `np.std`.',
            'Return them together as a tuple: `(a, b, c)`.',
            '`return (np.mean(arr), np.var(arr), np.std(arr))`',
          ],
        },
      ],
    },
    {
      id: 'prob-normalize',
      title: 'Normalization',
      minutes: 4,
      theory: [
        'Models train better when inputs share a scale. **Min-max** squashes values into `[0, 1]`; **z-score** (standardisation) centres them at 0 with std 1.',
        { code: 'min_max = (x - x.min()) / (x.max() - x.min())\nz       = (x - x.mean()) / x.std()' },
        { tip: 'LayerNorm in transformers is z-scoring, applied to every token vector.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-norm',
          title: 'Squash to 0–1',
          xp: XP.code,
          numpy: true,
          task: 'Write `min_max(x)` (scale to 0–1) and `z_score(x)` (mean 0, std 1). Both take a list and return a NumPy array.',
          starter: py`
import numpy as np


def min_max(x):
    pass


def z_score(x):
    pass


print(min_max([10, 20, 30]))  # [0.  0.5 1. ]
`,
          solution: py`
import numpy as np


def min_max(x):
    x = np.array(x, dtype=float)
    return (x - x.min()) / (x.max() - x.min())


def z_score(x):
    x = np.array(x, dtype=float)
    return (x - x.mean()) / x.std()


print(min_max([10, 20, 30]))  # [0.  0.5 1. ]
`,
          tests: [
            { name: 'min_max([10, 20, 30])', code: py`
import numpy as _np
_r = min_max([10, 20, 30])
assert _r is not None and _np.allclose(_r, [0, 0.5, 1]), f"got {_r!r}"
` },
            { name: 'min_max spans exactly 0 to 1', code: py`
_r = min_max([3, -2, 7, 1])
assert abs(min(_r)) < 1e-9 and abs(max(_r) - 1) < 1e-9, f"got {_r!r}"
` },
            { name: 'z_score has mean 0 and std 1', fail: 'Subtract the mean, divide by the std', code: py`
import numpy as _np
_r = z_score([1, 2, 3, 4, 10])
assert _r is not None and abs(_np.mean(_r)) < 1e-9 and abs(_np.std(_r) - 1) < 1e-9, f"got {_r!r}"
` },
          ],
          hints: [
            'Convert first: `x = np.array(x, dtype=float)`. Then `.min()`, `.max()`, `.mean()`, `.std()` are available.',
            'min_max: subtract the min, divide by the range (max − min).',
            'z_score: `(x - x.mean()) / x.std()`.',
          ],
        },
      ],
    },
    {
      id: 'prob-sampling',
      title: 'Sampling & temperature',
      minutes: 6,
      theory: [
        'An LLM outputs a score (**logit**) for every token. **Softmax** turns scores into probabilities, and then we **sample**. **Temperature** divides the logits first: low T → sharper, more predictable; high T → flatter, more creative.',
        { code: 'p = softmax(logits / T)\nnext = np.random.choice(tokens, p=p)' },
      ],
      activities: [
        { type: 'viz', id: 'viz-temp', title: 'Temperature playground', component: 'TemperatureViz', xp: XP.viz },
        {
          type: 'code',
          id: 'prob-sample',
          title: 'Softmax, temperature & sampling',
          xp: XP.code,
          numpy: true,
          task: 'Write `softmax_with_temperature(logits, T)` and `sample_tokens(tokens, probs, n)` (use `np.random.choice`, return a list of `n` tokens).',
          starter: py`
import numpy as np


def softmax_with_temperature(logits, T):
    # Divide logits by T, then softmax: exp(z) / sum(exp(z))
    pass


def sample_tokens(tokens, probs, n):
    # Draw n tokens according to probs with np.random.choice. Return a list.
    pass


p = softmax_with_temperature([2.0, 1.0, 0.1], T=1.0)
print(p)
print(sample_tokens(["cat", "dog", "fish"], p, 5))
`,
          solution: py`
import numpy as np


def softmax_with_temperature(logits, T):
    z = np.array(logits, dtype=float) / T
    z = z - z.max()  # numerical stability
    e = np.exp(z)
    return e / e.sum()


def sample_tokens(tokens, probs, n):
    return list(np.random.choice(tokens, size=n, p=probs))


p = softmax_with_temperature([2.0, 1.0, 0.1], T=1.0)
print(p)
print(sample_tokens(["cat", "dog", "fish"], p, 5))
`,
          tests: [
            { name: 'softmax sums to 1', code: py`
import numpy as _np
_r = softmax_with_temperature([2.0, 1.0, 0.1], 1.0)
assert _r is not None and abs(_np.sum(_r) - 1) < 1e-9, f"got {_r!r}"
` },
            { name: 'T=1 matches plain softmax', code: py`
import numpy as _np
_r = softmax_with_temperature([2.0, 1.0, 0.0], 1.0)
_e = _np.exp([2.0, 1.0, 0.0]); _e = _e / _e.sum()
assert _np.allclose(_r, _e), f"got {_r!r}"
` },
            { name: 'low temperature sharpens', fail: 'Divide the logits by T before the softmax', code: py`
import numpy as _np
assert _np.max(softmax_with_temperature([2.0, 1.0, 0.0], 0.5)) > _np.max(softmax_with_temperature([2.0, 1.0, 0.0], 1.0)) + 0.05
` },
            { name: 'sample_tokens returns n valid tokens', code: py`
_s = sample_tokens(["a", "b", "c"], [0.2, 0.3, 0.5], 20)
assert _s is not None and len(list(_s)) == 20, f"got {_s!r}"
assert all(t in ("a", "b", "c") for t in _s)
` },
            { name: 'samples follow the probabilities', fail: 'Pass probs as p= to np.random.choice', code: py`
_s = list(sample_tokens(["a", "b"], [0.8, 0.2], 4000))
_frac = _s.count("a") / len(_s)
assert abs(_frac - 0.8) < 0.05, f"'a' came up {_frac:.0%} of the time, expected ~80%"
` },
          ],
          hints: [
            'Turn logits into an array and divide by T: `z = np.array(logits) / T`.',
            'Softmax: `e = np.exp(z)` then `e / e.sum()`. (Subtracting `z.max()` first avoids overflow.)',
            '`np.random.choice(tokens, size=n, p=probs)` — wrap it in `list(...)`.',
          ],
        },
      ],
    },
    {
      id: 'prob-metrics',
      title: 'Accuracy, precision & recall (preview)',
      minutes: 5,
      theory: [
        '**Accuracy**: fraction correct. **Precision**: of everything I flagged positive, how much really was? **Recall**: of all the real positives, how many did I catch?',
        { code: 'precision = TP / (TP + FP)\nrecall    = TP / (TP + FN)' },
        { tip: 'A spam filter with 99% accuracy can still be useless if spam is only 1% of email. That is why we need precision and recall.' },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-metrics-lab',
          title: 'Grade a classifier',
          xp: XP.code,
          task: 'Write `metrics(y_true, y_pred)` returning `(accuracy, precision, recall)` for 0/1 labels. If there are no predicted (or actual) positives, return 0.0 for that metric instead of dividing by zero.',
          starter: py`
def metrics(y_true, y_pred):
    # Count TP, FP, FN, TN, then compute the three metrics.
    pass


print(metrics([1, 0, 1, 1, 0, 0], [1, 1, 0, 1, 1, 0]))  # (0.5, 0.5, 0.667)
`,
          solution: py`
def metrics(y_true, y_pred):
    pairs = list(zip(y_true, y_pred))
    tp = sum(1 for t, p in pairs if t == 1 and p == 1)
    fp = sum(1 for t, p in pairs if t == 0 and p == 1)
    fn = sum(1 for t, p in pairs if t == 1 and p == 0)
    correct = sum(1 for t, p in pairs if t == p)
    accuracy = correct / len(pairs)
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    return (accuracy, precision, recall)


print(metrics([1, 0, 1, 1, 0, 0], [1, 1, 0, 1, 1, 0]))  # (0.5, 0.5, 0.667)
`,
          tests: [
            { name: 'accuracy', code: py`
_r = metrics([1, 0, 1, 1, 0, 0], [1, 1, 0, 1, 1, 0])
assert _r is not None and abs(_r[0] - 0.5) < 1e-9, f"got {_r!r}"
` },
            { name: 'precision', fail: 'TP / (TP + FP)', code: py`
_r = metrics([1, 0, 1, 1, 0, 0], [1, 1, 0, 1, 1, 0])
assert abs(_r[1] - 0.5) < 1e-9, f"expected 0.5, got {_r[1]!r}"
` },
            { name: 'recall', fail: 'TP / (TP + FN)', code: py`
_r = metrics([1, 0, 1, 1, 0, 0], [1, 1, 0, 1, 1, 0])
assert abs(_r[2] - 2 / 3) < 1e-9, f"expected 0.667, got {_r[2]!r}"
` },
            { name: 'no predicted positives → precision 0', code: py`
_r = metrics([1, 0], [0, 0])
assert tuple(_r) == (0.5, 0.0, 0.0), f"got {_r!r}"
` },
          ],
          hints: [
            'Walk through `zip(y_true, y_pred)` and count the four cases.',
            'TP: true=1 & pred=1. FP: true=0 & pred=1. FN: true=1 & pred=0.',
            'Guard divisions: `tp / (tp + fp) if tp + fp else 0.0`.',
          ],
        },
      ],
    },
    {
      id: 'prob-checkpoint',
      title: 'Checkpoint: think like a sampler',
      minutes: 4,
      checkpoint: true,
      theory: ['Real test: can you explain what temperature does and why next-token prediction is conditional probability?'],
      activities: [
        {
          type: 'quiz',
          id: 'prob-checkpoint-quiz',
          title: 'Temperature & conditionals',
          xp: XP.quiz,
          questions: [
            {
              q: 'You lower temperature from 1.0 to 0.2. What happens to sampling?',
              options: [
                'Outputs become more random and creative',
                'The most likely tokens get even more likely — outputs become more predictable',
                'Nothing — temperature only affects speed',
                'The model forgets the prompt',
              ],
              answer: 1,
              explain: 'Dividing logits by a small T stretches the gaps, so softmax piles probability on the top tokens.',
            },
            {
              q: 'Why is next-token prediction a conditional probability?',
              options: [
                'Because it only works if the internet is on',
                'The model estimates P(next token | all previous tokens) — the context is the "given"',
                'Because tokens are independent of each other',
                'Because the probabilities always equal 0.5',
              ],
              answer: 1,
              explain: 'Change the context and the distribution over the next token changes.',
            },
            {
              q: 'Very high temperature (e.g. 5.0) makes the distribution…',
              options: ['Sharper', 'Flatter — closer to uniform', 'Negative', 'Sum to more than 1'],
              answer: 1,
              explain: 'Large T shrinks the logits toward each other, so every token looks similar.',
            },
            {
              q: 'A cancer screening model should rarely MISS a real case. Which metric matters most?',
              options: ['Precision', 'Recall', 'Accuracy', 'Temperature'],
              answer: 1,
              explain: 'Recall = how many real positives you caught. Missed cases are false negatives.',
            },
          ],
        },
      ],
    },
  ],
}

export const MODULES = [python, git, linalg, calculus, probability]

// ── Lookup helpers ─────────────────────────────────────────────────────────────

export const ALL_ACTIVITIES = MODULES.flatMap((m) =>
  m.lessons.flatMap((l) => l.activities.map((a) => ({ ...a, moduleId: m.id, lessonId: l.id }))),
)

export function findLesson(moduleId, lessonId) {
  const mod = MODULES.find((m) => m.id === moduleId)
  const lesson = mod && mod.lessons.find((l) => l.id === lessonId)
  return mod && lesson ? { mod, lesson } : null
}

export function findActivity(id) {
  return ALL_ACTIVITIES.find((a) => a.id === id)
}

export function moduleActivities(moduleId) {
  return ALL_ACTIVITIES.filter((a) => a.moduleId === moduleId)
}

export function lessonActivityIds(lesson) {
  return lesson.activities.map((a) => a.id)
}
