// Python module: from "what is a program?" to reading a PyTorch model.
// Part 1 (absolute basics) lives in python-basics.js; part 2 is below.
import { py, XP } from '../helpers.js'
import basics from './python-basics.js'

const more = [
  // ───────────────────────── 10. COMPREHENSIONS ─────────────────────────
  {
    id: 'py-comprehensions',
    title: 'List comprehensions: loops in one line',
    minutes: 7,
    learn: [
      {
        title: 'A shortcut for building lists',
        blocks: [
          'Very often, you loop over a list to build a **new** list. For example, doubling every number:',
          { tryit: py`nums = [1, 2, 3, 4]
doubled = []
for n in nums:
    doubled.append(n * 2)
print(doubled)`, note: 'The long way: 4 lines.' },
          'Python has a shortcut called a **list comprehension** that does the same thing in one line:',
          { tryit: py`nums = [1, 2, 3, 4]
doubled = [n * 2 for n in nums]
print(doubled)`, note: 'The short way: 1 line, same answer!' },
        ],
      },
      {
        title: 'Reading a comprehension',
        blocks: [
          { code: '[ n * 2   for n in nums ]\n  ↑what      ↑where from' },
          { steps: ['Read the middle first: `for n in nums`: "take each n from nums".', 'Then the front: `n * 2`: "what to put in the new list".', 'The square brackets mean "make a list of all of them".'] },
          { analogy: 'It is like a cookie machine: cookies (n) come in on a belt (nums), get stamped (n * 2), and drop into a new box ([ ]).', emoji: '🍪' },
          { quick: { q: 'What is `[x + 1 for x in [10, 20]]`?', options: ['[10, 20]', '[11, 21]', '[1, 1]', '31'], answer: 1, explain: 'Each x gets +1: 10 → 11, 20 → 21.' } },
        ],
      },
      {
        title: 'Adding a filter with if',
        blocks: [
          'You can keep only some items by adding `if` at the end:',
          { tryit: py`nums = [1, 2, 3, 4, 5, 6]
evens = [n for n in nums if n % 2 == 0]
print(evens)`, note: 'Only the even numbers get in.' },
          { tryit: py`words = ["cat", "elephant", "dog", "hippopotamus"]
long_words = [w for w in words if len(w) > 3]
print(long_words)`, note: 'Only words longer than 3 letters.' },
        ],
      },
      {
        title: 'Counting backwards with range',
        blocks: [
          '`range` can take a third number, the **step**. A step of `-1` counts backwards:',
          { tryit: py`print(list(range(4, -1, -1)))`, note: 'From 4 down to 0 (it stops before -1).' },
          'That lets us walk a list from the end to the start, using indexes:',
          { tryit: py`xs = ["a", "b", "c"]
backwards = [xs[i] for i in range(len(xs) - 1, -1, -1)]
print(backwards)`, note: 'Index 2, then 1, then 0.' },
          { tip: 'AI connection: data scientists write comprehensions all day, like `[clean(text) for text in dataset]`.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['`[expression for item in list]` builds a new list.', 'Add `if condition` at the end to filter.', '`range(start, stop, -1)` counts backwards.'] },
          { words: [['comprehension', 'a one-line way to build a list from a loop'], ['filter', 'keep only the items that pass a test'], ['step', 'how much range jumps each time']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-reverse',
        title: 'Reverse with a comprehension',
        xp: XP.code,
        task: 'Write `reverse_list(xs)` using a **list comprehension**, and `squares_of_evens(nums)` that gives the squares of only the even numbers.',
        steps: ['In `reverse_list`, use `[xs[i] for i in range(len(xs) - 1, -1, -1)]`.', 'In `squares_of_evens`, use `[n * n for n in nums if n % 2 == 0]`.', 'Don\'t use `.reverse()` or `[::-1]`: practice the comprehension!'],
        starter: py`
def reverse_list(xs):
    # Use a list comprehension to return xs reversed.
    return xs


def squares_of_evens(nums):
    # [2, 3, 4] -> [4, 16]
    pass


print(reverse_list([1, 2, 3]))        # [3, 2, 1]
print(squares_of_evens([1, 2, 3, 4]))  # [4, 16]
`,
        solution: py`
def reverse_list(xs):
    return [xs[i] for i in range(len(xs) - 1, -1, -1)]


def squares_of_evens(nums):
    return [n * n for n in nums if n % 2 == 0]


print(reverse_list([1, 2, 3]))        # [3, 2, 1]
print(squares_of_evens([1, 2, 3, 4]))  # [4, 16]
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
        hints: ['Indexes that count backwards: `range(len(xs) - 1, -1, -1)`.', 'Use each index to grab an item: `[xs[i] for i in ...]`.', 'For the evens: `[n * n for n in nums if n % 2 == 0]`.'],
      },
    ],
  },

  // ───────────────────────── 11. FUNCTION TRICKS ─────────────────────────
  {
    id: 'py-functions',
    title: 'Function tricks: defaults, *args, **kwargs & lambda',
    minutes: 8,
    learn: [
      {
        title: 'Default values',
        blocks: [
          'You can give a parameter a **default**, a value it uses if you don\'t pass one.',
          { tryit: py`def order(drink, size="medium"):
    print("One", size, drink)

order("juice")
order("milk", "large")`, note: 'The first call uses the default size.' },
          { analogy: 'Like a pizza shop: if you don\'t say a size, you get medium. If you say "large", you get large.', emoji: '🍕' },
        ],
      },
      {
        title: '*args: any number of inputs',
        blocks: [
          'What if you don\'t know how many inputs there will be? Put a `*` before the name. Python collects all of them into a **tuple**.',
          { tryit: py`def add_all(*args):
    print("I got:", args)
    return sum(args)

print(add_all(1, 2))
print(add_all(5, 10, 15, 20))`, note: 'Two inputs or four, both work.' },
          { tip: 'The name `args` is just a habit. The `*` is what does the magic.' },
        ],
      },
      {
        title: '**kwargs: named inputs',
        blocks: [
          'Two stars `**` collect **named** inputs (like `lr=0.01`) into a **dict**.',
          { tryit: py`def settings(**kwargs):
    print(kwargs)

settings(color="blue", volume=7)`, note: 'The names become keys.' },
          'This is super useful for settings that have defaults you might want to change:',
          { tryit: py`def make_config(**kwargs):
    config = {"lr": 0.001, "epochs": 10}
    config.update(kwargs)
    return config

print(make_config())
print(make_config(lr=0.05))
print(make_config(dropout=0.1))`, note: '`.update` copies kwargs into config: changes old keys, adds new ones.' },
          { quick: { q: 'Inside `def f(**kwargs)`, calling `f(a=1, b=2)` makes kwargs equal to…', options: ['(1, 2)', '[1, 2]', '{"a": 1, "b": 2}', '3'], answer: 2, explain: 'Two stars → a dict of name: value pairs.' } },
        ],
      },
      {
        title: 'lambda: a tiny one-line function',
        blocks: [
          'For very small functions, Python has a shortcut called `lambda`:',
          { code: 'def triple(x):\n    return x * 3\n\n# is the same as:\ntriple = lambda x: x * 3' },
          { steps: ['`lambda` means "a tiny function".', 'Before the colon: the inputs (`x`).', 'After the colon: what it returns (`x * 3`), no `return` word needed.'] },
          { tryit: py`triple = lambda x: x * 3
print(triple(4))
print(sorted(["banana", "kiwi", "apple"], key=lambda w: len(w)))`, note: 'The second line sorts words by length using a lambda.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['Defaults: `def f(size="medium")`.', '`*args` collects extra inputs into a tuple.', '`**kwargs` collects named inputs into a dict.', '`lambda x: x * 2` is a tiny function.'] },
          { tip: 'AI connection: training code passes settings like `train(model, lr=0.001, epochs=5)`. That\'s **kwargs at work.' },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-kwargs',
        title: 'Settings builder',
        xp: XP.code,
        task: 'Finish three small things: a config builder with `**kwargs`, a `total(*args)` function, and a `square` lambda.',
        steps: ['In `make_config`, add `config.update(kwargs)` so named inputs change the defaults.', 'In `total`, return `sum(args)`.', 'Replace `None` with `lambda x: x * x`.'],
        starter: py`
def make_config(**kwargs):
    config = {"lr": 0.001, "epochs": 10, "batch_size": 32}
    # Let kwargs change or add to the defaults.

    return config


def total(*args):
    # Return the sum of all the inputs (0 if there are none).
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
          { name: 'kwargs change defaults', fail: 'lr=0.01 should replace the default lr', code: py`
_r = make_config(lr=0.01)
assert _r["lr"] == 0.01 and _r["epochs"] == 10, f"got {_r!r}"
` },
          { name: 'kwargs can add new keys', code: py`
_r = make_config(dropout=0.1)
assert _r.get("dropout") == 0.1, f"got {_r!r}"
` },
          { name: 'total adds any number of inputs', code: py`
assert total(1, 2, 3) == 6, f"total(1, 2, 3) gave {total(1, 2, 3)!r}"
assert total() == 0, f"total() gave {total()!r}"
` },
          { name: 'square is a lambda', fail: 'Write square = lambda x: ...', code: py`
assert callable(square) and square.__name__ == "<lambda>"
assert square(4) == 16, f"square(4) gave {square(4)!r}"
` },
        ],
        hints: ['Inside the function, `kwargs` is just a dict. `config.update(kwargs)` copies it in.', '`args` is a tuple: `return sum(args)`.', '`square = lambda x: x * x`'],
      },
    ],
  },

  // ───────────────────────── 12. CLASSES ─────────────────────────
  {
    id: 'py-objects',
    title: 'Classes & objects: cookie cutters',
    minutes: 9,
    learn: [
      {
        title: 'Things that have data AND actions',
        blocks: [
          'Think about a pet in a video game. It has **data** (name, hunger level) and **actions** (eat, speak). A **class** bundles both together.',
          { analogy: 'A class is a cookie cutter. Each cookie you cut out is an **object**. All cookies have the same shape, but you can decorate each one differently (different names, different colours).', emoji: '🍪' },
          { words: [['class', 'the blueprint / cookie cutter'], ['object', 'one thing made from a class (one cookie)'], ['attribute', 'a piece of data stored on an object, like name'], ['method', 'a function that belongs to a class, like speak()']] },
        ],
      },
      {
        title: 'Your first class',
        blocks: [
          { code: 'class Pet:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        print(self.name + " says hi!")' },
          { steps: ['`class Pet:` starts the blueprint (class names start with a Capital letter).', '`__init__` is the **setup** function. It runs automatically when a new pet is made.', '`self` means "this particular pet".', '`self.name = name` stores the name ON this pet.', '`speak` is a method, an action the pet can do.'] },
        ],
      },
      {
        title: 'Making objects',
        blocks: [
          { tryit: py`class Pet:
    def __init__(self, name):
        self.name = name

    def speak(self):
        print(self.name + " says hi!")

dog = Pet("Rex")
cat = Pet("Luna")
dog.speak()
cat.speak()
print(cat.name)`, note: 'One cutter, two cookies. Make a third pet!' },
          'Writing `Pet("Rex")` runs `__init__` with name = "Rex". Then `dog.speak()` runs the method, with `self` being the dog.',
          { quick: { q: 'In `dog = Pet("Rex")`, what is `dog.name`?', options: ['"Pet"', '"Rex"', 'self', 'Error'], answer: 1, explain: '__init__ stored "Rex" as self.name on that object.' } },
        ],
      },
      {
        title: 'Objects can change',
        blocks: [
          'Methods can change an object\'s data:',
          { tryit: py`class Pet:
    def __init__(self, name):
        self.name = name
        self.hunger = 5

    def eat(self):
        self.hunger = self.hunger - 1
        print(self.name, "ate. Hunger is now", self.hunger)

rex = Pet("Rex")
rex.eat()
rex.eat()`, note: 'Each eat() lowers hunger by 1.' },
          { warn: 'Forgetting `self.` is a very common mistake. Inside a method, use `self.hunger`, not just `hunger`.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['A **class** is a blueprint; an **object** is one thing made from it.', '`__init__` sets up a new object; store data with `self.something = ...`.', 'Methods are functions inside the class; they get `self` first.', 'Make an object with `Pet("Rex")`; call methods with `rex.eat()`.'] },
          { tip: 'Every AI model in PyTorch is a class. Next lesson shows exactly how!' },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-pet-lab',
        title: 'Build a robot',
        xp: XP.code,
        task: 'Finish the `Robot` class: it remembers its name and battery level, can `charge()`, and can `greet()`.',
        steps: ['In `__init__`, store `name` in `self.name` and set `self.battery = 50`.', 'In `charge`, add 10 to `self.battery`.', 'In `greet`, **return** the text `"Beep! I am " + self.name`.'],
        starter: py`
class Robot:
    def __init__(self, name):
        # store the name, and start the battery at 50
        pass

    def charge(self):
        # add 10 to the battery
        pass

    def greet(self):
        # return "Beep! I am <name>"
        pass


r = Robot("Bolt")
r.charge()
print(r.battery)   # 60
print(r.greet())   # Beep! I am Bolt
`,
        solution: py`
class Robot:
    def __init__(self, name):
        self.name = name
        self.battery = 50

    def charge(self):
        self.battery = self.battery + 10

    def greet(self):
        return "Beep! I am " + self.name


r = Robot("Bolt")
r.charge()
print(r.battery)   # 60
print(r.greet())   # Beep! I am Bolt
`,
        tests: [
          { name: 'remembers its name', fail: 'Set self.name in __init__', code: py`
assert getattr(Robot("Zap"), "name", None) == "Zap"
` },
          { name: 'battery starts at 50', fail: 'Set self.battery = 50 in __init__', code: py`
assert getattr(Robot("Zap"), "battery", None) == 50
` },
          { name: 'charge adds 10', code: py`
_r = Robot("Zap")
_r.charge(); _r.charge()
assert _r.battery == 70, f"after two charges battery is {_r.battery!r}"
` },
          { name: 'greet returns the right text', code: py`
_g = Robot("Zap").greet()
assert _g == "Beep! I am Zap", f"got {_g!r}"
` },
        ],
        hints: ['Data goes on `self`: `self.name = name`.', '`self.battery = self.battery + 10` inside charge.', 'greet: `return "Beep! I am " + self.name`.'],
      },
    ],
  },

  // ───────────────────────── 13. INHERITANCE / nn.Module ─────────────────────────
  {
    id: 'py-classes',
    title: 'Inheritance & AI layers (hello, nn.Module)',
    minutes: 8,
    learn: [
      {
        title: 'Inheritance: copying a blueprint',
        blocks: [
          'Sometimes you want a new class that is *almost* like an old one, with a few extras. **Inheritance** lets a class get everything from a **parent** class.',
          { tryit: py`class Animal:
    def __init__(self, name):
        self.name = name
    def describe(self):
        print("I am", self.name)

class Dog(Animal):
    def speak(self):
        print("Woof!")

d = Dog("Rex")
d.describe()
d.speak()`, note: 'Dog never wrote describe(): it inherited it from Animal!' },
          { analogy: 'You inherit things from your family, like eye colour. A child class inherits methods from its parent class, and can add its own.', emoji: '👨‍👧' },
        ],
      },
      {
        title: 'The magic method __call__',
        blocks: [
          'A method named `__call__` lets you use an object **like a function**, with brackets.',
          { tryit: py`class Doubler:
    def __call__(self, x):
        return x * 2

d = Doubler()
print(d(5))`, note: 'd(5) secretly runs d.__call__(5).' },
        ],
      },
      {
        title: 'How AI models are built',
        blocks: [
          'In **PyTorch** (the most popular AI library), every model is a class that inherits from `nn.Module`. Here is a tiny version of the idea:',
          { tryit: py`class Module:
    def __call__(self, x):
        return self.forward(x)

class AddTen(Module):
    def forward(self, x):
        return x + 10

layer = AddTen()
print(layer(5))`, note: 'layer(5) → __call__ → forward(5) → 15.' },
          { steps: ['`Module` is the parent. Its `__call__` runs `forward`.', 'Each AI **layer** inherits from Module and writes its own `forward`, the math it does.', 'You use the layer like a function: `layer(x)`.'] },
          { words: [['layer', 'one step of math in an AI model'], ['forward', 'the method that does a layer\'s math'], ['PyTorch', 'a popular Python library for building AI']] },
        ],
      },
      {
        title: 'A real layer: weight and bias',
        blocks: [
          'The simplest AI layer is **Linear**: it multiplies the input by a **weight** and adds a **bias**: `weight * x + bias`.',
          { table: { head: ['x', 'weight', 'bias', 'weight * x + bias'], rows: [['3', '2', '1', '7'], ['4', '0.5', '-1', '1'], ['0', '5', '2', '2']] } },
          'AI "learning" is just finding good numbers for weight and bias. That is what you will do in the calculus module!',
          { quick: { q: 'A Linear layer has weight 3 and bias 2. What is layer(4)?', options: ['9', '14', '12', '7'], answer: 1, explain: '3 × 4 + 2 = 14.' } },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['`class Child(Parent):` inherits everything from Parent.', '`__call__` lets you call an object like a function.', 'PyTorch layers inherit from `nn.Module` and write `forward`.', 'A Linear layer computes `weight * x + bias`.'] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-linear',
        title: 'Your first AI layer',
        xp: XP.code,
        task: 'Finish `Linear(Module)`: `__init__` stores `weight` and `bias`, and `forward(x)` returns `weight * x + bias`.',
        steps: ['In `__init__`, write `self.weight = weight` and `self.bias = bias`.', 'In `forward`, return `self.weight * x + self.bias`.', 'Run it. `layer(3)` should print 7.'],
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
        hints: ['Anything you want to keep must go on `self`.', '`self.weight = weight` and `self.bias = bias`.', 'In forward: `return self.weight * x + self.bias`.'],
      },
    ],
  },

  // ───────────────────────── 14. FILES & JSON ─────────────────────────
  {
    id: 'py-files',
    title: 'Files, JSON & virtual environments',
    minutes: 8,
    learn: [
      {
        title: 'Why save to files?',
        blocks: [
          'When a program ends, all its variables disappear. To keep things, like settings or a high score, we save them in a **file**.',
          { analogy: 'Variables are like writing on a whiteboard, wiped clean at the end of the day. A file is like writing in a notebook you keep.', emoji: '📓' },
        ],
      },
      {
        title: 'Writing and reading a file',
        blocks: [
          { tryit: py`with open("note.txt", "w") as f:
    f.write("Remember to practice Python!")

with open("note.txt") as f:
    print(f.read())`, note: 'Files here live in a safe sandbox inside your browser tab.' },
          { steps: ['`open("note.txt", "w")` opens a file for **w**riting (it creates it if needed).', '`with ... as f:` gives the open file the name `f`, and closes it automatically when the indented part ends.', '`f.write(...)` writes text. `f.read()` reads it all back.'] },
          { warn: 'Opening with `"w"` wipes the file first! Use `"a"` to **a**dd to the end instead.' },
        ],
      },
      {
        title: 'JSON: saving dicts and lists',
        blocks: [
          'Files store text. But what about a dict? We use **JSON**, a standard text format that looks almost exactly like Python dicts and lists.',
          { tryit: py`import json

player = {"name": "Ava", "level": 3, "items": ["sword", "map"]}
text = json.dumps(player)
print(text)
print(type(text))`, note: 'dumps = "dump to string".' },
          { table: { head: ['Function', 'Does'], rows: [['`json.dump(obj, f)`', 'write obj into a file'], ['`json.load(f)`', 'read a file back into a dict/list'], ['`json.dumps(obj)`', 'turn obj into JSON text'], ['`json.loads(text)`', 'turn JSON text into obj']] } },
          { tip: '`import json` loads Python\'s built-in JSON toolbox. `import` is how you bring in extra tools.' },
        ],
      },
      {
        title: 'Save and load a whole dict',
        blocks: [
          { tryit: py`import json

with open("save.json", "w") as f:
    json.dump({"score": 120, "level": 4}, f)

with open("save.json") as f:
    game = json.load(f)

print(game["score"])`, note: 'A save-game system in 6 lines!' },
          { quick: { q: 'Which function reads JSON from an open file?', options: ['json.dump', 'json.load', 'json.dumps', 'print'], answer: 1, explain: 'load reads from a file; dump writes to it.' } },
        ],
      },
      {
        title: 'Packages, pip & virtual environments',
        blocks: [
          'People share Python tools called **packages** (like NumPy for math). You install them with a program called **pip**: `pip install numpy`.',
          'But different projects may need different versions. So each project gets its own **virtual environment**, a private box of packages.',
          { analogy: 'A virtual environment is like a separate pencil case for each school subject. Your art pencils don\'t get mixed up with your math pencils.', emoji: '✏️' },
          { code: 'python -m venv .venv          # make the private box\nsource .venv/bin/activate      # step inside it (Mac/Linux)\npip install numpy              # install into it\npip freeze > requirements.txt  # write down what you installed' },
          'Someone else can then rebuild your exact setup with `pip install -r requirements.txt`.',
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['`with open(path, "w") as f:` writes; `with open(path) as f:` reads.', 'JSON saves dicts and lists as text: `json.dump` / `json.load`.', '`pip install` adds packages; a **venv** keeps each project\'s packages separate.', '`requirements.txt` lists packages so others can copy your setup.'] },
          { words: [['file', 'saved data that lasts after the program ends'], ['JSON', 'a text format for dicts and lists'], ['package', 'a shared bundle of Python tools'], ['pip', 'the installer for packages'], ['venv', 'a private set of packages for one project']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-json',
        title: 'Save & load a game',
        xp: XP.code,
        task: 'Write `save_config(path, config)` to save a dict as JSON, and `load_config(path)` to read it back.',
        steps: ['In save_config: `with open(path, "w") as f:` then `json.dump(config, f)`.', 'In load_config: `with open(path) as f:` then `return json.load(f)`.'],
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
          { name: 'load_config reads it back', fail: 'Remember to return json.load(f)', code: py`
_p = "/tmp/fl_cfg_test2.json"
save_config(_p, {"model": "tiny-gpt", "layers": 4})
_r = load_config(_p)
assert _r == {"model": "tiny-gpt", "layers": 4}, f"got {_r!r}"
` },
        ],
        hints: ['Open in write mode: `with open(path, "w") as f:`', '`json.dump(config, f)` writes it.', 'load_config: `with open(path) as f:` then `return json.load(f)`.'],
      },
      {
        type: 'quiz',
        id: 'py-venv-quiz',
        title: 'Quick quiz: packages & venv',
        xp: XP.quiz,
        questions: [
          { q: 'Why give each project its own virtual environment?', options: ['It makes Python faster', "So each project's packages don't get mixed up", 'It is needed for JSON', 'It backs up your code'], answer: 1, explain: 'Like separate pencil cases: each project keeps its own packages and versions.' },
          { q: 'A friend wants the exact packages you used. What do you share?', options: ['Your .venv folder', 'A requirements.txt file', 'Your computer', 'Nothing'], answer: 1, explain: 'They run `pip install -r requirements.txt` to copy your setup.' },
          { q: 'What does `json.load(f)` do?', options: ['Writes a dict to a file', 'Reads JSON from a file into a dict/list', 'Deletes the file', 'Prints the file'], answer: 1, explain: 'load = read in; dump = write out.' },
        ],
      },
    ],
  },

  // ───────────────────────── 15. F-STRINGS & ERRORS ─────────────────────────
  {
    id: 'py-errors',
    title: 'f-strings & handling errors',
    minutes: 8,
    learn: [
      {
        title: 'f-strings: fill-in-the-blank text',
        blocks: [
          'Gluing text with `+` and `str()` gets messy. An **f-string** is easier: put `f` before the quotes and put variables in `{ }`.',
          { tryit: py`name = "Ava"
score = 42
print(f"{name} scored {score} points!")`, note: 'Much tidier than "Ava" + " scored " + str(42)…' },
          { analogy: 'An f-string is like a form with blanks: "___ scored ___ points". Python fills in the blanks for you.', emoji: '📝' },
        ],
      },
      {
        title: 'Rounding inside f-strings',
        blocks: [
          'Add `:.2f` inside the braces to show exactly 2 decimal places:',
          { tryit: py`loss = 0.123456
print(f"loss: {loss:.2f}")
print(f"loss: {loss:.4f}")`, note: 'Try :.1f too.' },
          { tip: 'AI connection: training programs print lines like `epoch 3 | loss: 0.25 | accuracy: 91.40%` using f-strings.' },
        ],
      },
      {
        title: 'When things go wrong',
        blocks: [
          'Some code can fail even when it is written correctly, for example, turning the word "banana" into a number:',
          { tryit: py`x = float("banana")`, note: 'This crashes with a ValueError.', expectError: true },
          'A crash stops the whole program. Imagine an AI training for 10 hours and crashing because of one weird line of data! 😱',
        ],
      },
      {
        title: 'try / except: a safety net',
        blocks: [
          { tryit: py`text = "banana"
try:
    x = float(text)
    print("It's a number:", x)
except ValueError:
    print("That's not a number, but I didn't crash!")`, note: 'Change text to "3.5".' },
          { steps: ['Python **tries** the code in the `try` part.', 'If a `ValueError` happens, it jumps to `except ValueError:` instead of crashing.', 'If nothing goes wrong, the `except` part is skipped.'] },
          { analogy: 'Like a safety net under a trapeze artist: if they fall, the net catches them and the show goes on.', emoji: '🎪' },
          { quick: { q: 'If the try part works fine, does the except part run?', options: ['Yes, always', 'No, it is skipped'], answer: 1, explain: 'except only runs when that error actually happens.' } },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['f-strings: `f"Hi {name}"` fills in values.', '`{value:.2f}` shows 2 decimals.', '`try:` risky code, `except SomeError:` what to do instead of crashing.'] },
          { words: [['f-string', 'text with {blanks} filled in automatically'], ['exception', 'an error that happens while running'], ['ValueError', 'right type, bad value, like float("banana")']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-safe-parse',
        title: 'Parse safely, report nicely',
        xp: XP.code,
        task: 'Make `safe_parse(text)` return a float, or `None` if the text isn\'t a number. Make `report(name, value)` return text like `"loss: 0.25"` (2 decimals) using an f-string.',
        steps: ['Wrap `return float(text)` in `try:`.', 'Add `except ValueError:` that returns `None`.', 'In report, return `f"{name}: {value:.2f}"`.'],
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
          { name: 'parses a real number', code: py`
assert safe_parse("3.5") == 3.5
` },
          { name: 'returns None for non-numbers', fail: 'Wrap float(text) in try/except ValueError', code: py`
_r = safe_parse("banana")
assert _r is None, f"expected None, got {_r!r}"
` },
          { name: 'returns None for empty text', code: py`
assert safe_parse("") is None
` },
          { name: 'report shows 2 decimals', code: py`
_r = report("loss", 0.2512)
assert _r == "loss: 0.25", f"expected 'loss: 0.25', got {_r!r}"
_r = report("acc", 1)
assert _r == "acc: 1.00", f"expected 'acc: 1.00', got {_r!r}"
` },
        ],
        hints: ['Indent `return float(text)` under a new `try:` line.', 'Then `except ValueError:` and (indented) `return None`.', 'report: `return f"{name}: {value:.2f}"`'],
      },
    ],
  },

  // ───────────────────────── 16. CHECKPOINT ─────────────────────────
  {
    id: 'py-checkpoint',
    title: 'Checkpoint: read a real AI model',
    minutes: 10,
    checkpoint: true,
    learn: [
      {
        title: 'Look how far you\'ve come!',
        blocks: [
          'You started with `print("Hello")`. Now you know variables, types, if/else, loops, functions, lists, dicts, sets, tuples, comprehensions, classes, inheritance, files and errors. 🏆',
          { big: 'Time to read real AI code, and understand it.' },
        ],
      },
      {
        title: 'A real PyTorch model',
        blocks: [
          'Here is what a tiny real AI model looks like in PyTorch:',
          { code: 'import torch.nn as nn\n\nclass TinyNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc = nn.Linear(4, 2)\n        self.act = nn.ReLU()\n\n    def forward(self, x):\n        return self.act(self.fc(x))\n\nnet = TinyNet()\nout = net(x)' },
          { table: { head: ['Line', 'What it means (you know all of this!)'], rows: [['`import torch.nn as nn`', 'bring in PyTorch\'s layer toolbox, nicknamed nn'], ['`class TinyNet(nn.Module):`', 'a class that inherits from nn.Module'], ['`super().__init__()`', 'run the parent\'s setup first'], ['`self.fc = nn.Linear(4, 2)`', 'store a Linear layer: 4 numbers in → 2 out'], ['`self.act = nn.ReLU()`', 'store another layer (it turns negatives into 0)'], ['`def forward(self, x):`', 'the math: first fc, then act'], ['`net(x)`', '__call__ runs forward(x)']] } },
        ],
      },
      {
        title: 'One new thing: super()',
        blocks: [
          '`super()` means "my parent class". `super().__init__()` runs the parent\'s setup, so PyTorch can keep track of the layers.',
          { tryit: py`class Parent:
    def __init__(self):
        print("Parent setup done")

class Child(Parent):
    def __init__(self):
        super().__init__()
        print("Child setup done")

Child()`, note: 'The parent\'s setup runs first.' },
          { tip: 'You\'re ready for the checkpoint: a quiz about this model, then you\'ll build your own `Sequential`, a container that runs layers one after another, just like PyTorch\'s.' },
        ],
      },
    ],
    activities: [
      {
        type: 'quiz',
        id: 'py-checkpoint-quiz',
        title: 'What does each line do?',
        xp: XP.quiz,
        questions: [
          { q: 'What does `class TinyNet(nn.Module):` mean?', code: 'import torch.nn as nn\n\nclass TinyNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc = nn.Linear(4, 2)\n        self.act = nn.ReLU()\n\n    def forward(self, x):\n        return self.act(self.fc(x))\n\nnet = TinyNet()\nout = net(x)', options: ['TinyNet is a function that returns nn.Module', "TinyNet inherits from nn.Module, so it gets all of Module's behaviour", 'TinyNet replaces nn.Module everywhere', 'It imports TinyNet from PyTorch'], answer: 1, explain: 'Brackets in a class line name the parent class. TinyNet *is a* Module.' },
          { q: 'Why call `super().__init__()` first?', options: ['To delete the parent class', "It's just decoration", "It runs nn.Module's own setup so PyTorch can track the layers", 'It calls forward()'], answer: 2, explain: 'Skip it and PyTorch complains, its bookkeeping was never set up.' },
          { q: 'What does `self.fc = nn.Linear(4, 2)` do?', options: ['Runs the layer on 4 and 2', 'Makes a layer (4 inputs → 2 outputs) and stores it on the object', 'Makes a list of 4 and 2', 'Sets the learning rate'], answer: 1, explain: 'It builds the layer once, in __init__, and keeps it as an attribute.' },
          { q: 'What happens on `out = net(x)`?', options: ["nn.Module's __call__ runs forward(x)", '__init__ runs again', 'An error, because objects can\'t be called', 'x is saved to a file'], answer: 0, explain: 'Calling the object goes through __call__, which calls forward.' },
          { q: 'In `forward`, which layer runs first?', options: ['ReLU, then Linear', 'Linear (fc), then ReLU (act)', 'Both at once', 'Neither'], answer: 1, explain: 'Read inside-out: self.fc(x) first, then self.act(...) on the result.' },
        ],
      },
      {
        type: 'code',
        id: 'py-sequential',
        title: 'Build nn.Sequential',
        xp: XP.code,
        task: 'Make `Sequential(*layers)`: it stores the layers, and `forward` passes `x` through each layer in order.',
        steps: ['In `__init__`, store the layers: `self.layers = layers`.', 'In `forward`, loop over `self.layers`.', 'Each time: `x = layer(x)`. After the loop, return `x`.'],
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
        hints: ['`layers` arrives as a tuple (that\'s *args!). Keep it: `self.layers = layers`.', 'In forward: `for layer in self.layers:`', 'Inside the loop `x = layer(x)`, then after the loop `return x`.'],
      },
    ],
  },
]

export default {
  id: 'python',
  title: 'Python',
  emoji: '🐍',
  tagline: 'From your very first line of code to reading a real AI model.',
  badge: { id: 'mod-python', name: 'Pythonista', emoji: '🐍' },
  lessons: [...basics, ...more],
}
