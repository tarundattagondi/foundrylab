import { py, XP } from '../helpers.js'

export default {
  id: 'linalg',
  title: 'Linear Algebra',
  emoji: '📐',
  tagline: 'Vectors, matrices and shapes, the language of every neural net.',
  badge: { id: 'mod-linalg', name: 'Matrix Mage', emoji: '📐' },
  lessons: [
    // ───────────────────────────── 1. Coordinates ─────────────────────────────
    {
      id: 'la-grid',
      title: 'Numbers on a grid',
      minutes: 6,
      learn: [
        {
          title: 'Where is the treasure?',
          blocks: [
            { big: 'Two numbers can tell you exactly where something is.' },
            { analogy: 'Imagine a pirate treasure map with a grid on it. The map says: "Walk 3 squares across, then 2 squares up. Dig here!" Those two numbers, 3 and 2, are all you need to find the gold.', emoji: '🏴‍☠️' },
            'Mathematicians do the same thing. They draw a grid and use two numbers to point at any spot on it. Here is that grid. Try it!',
            { visual: 'coordGrid', start: [3, 2] },
          ],
        },
        {
          title: 'Across first, then up',
          blocks: [
            'The grid has two lines that cross in the middle:',
            { list: ['The **x-axis** goes left ↔ right (across).', 'The **y-axis** goes down ↕ up.', 'Where they cross is called the **origin**. It is the spot (0, 0), the starting point.'] },
            'We always write the across number first, then the up number: `(x, y)`.',
            { table: { head: ['Point', 'Means'], rows: [['(3, 2)', 'go 3 across, 2 up'], ['(0, 4)', "don't go across at all, go 4 up"], ['(5, 0)', 'go 5 across, stay on the floor']] } },
            { tip: 'A trick to remember the order: you walk *along the hallway* before you go *up the stairs*. x before y!' },
          ],
        },
        {
          title: 'Going backwards: negative numbers',
          blocks: [
            'What if the treasure is to the **left** of the start, or **below** it? We use negative numbers.',
            { list: ['x is negative → go **left**.', 'y is negative → go **down**.'] },
            { table: { head: ['Point', 'Means'], rows: [['(-2, 1)', '2 to the left, 1 up'], ['(4, -3)', '4 to the right, 3 down'], ['(-1, -1)', '1 left, 1 down']] } },
            { quick: { q: 'Where is the point `(-3, 2)`?', options: ['3 right, 2 up', '3 left, 2 up', '3 left, 2 down', '2 left, 3 up'], answer: 1, explain: 'The first number is x (across). It is negative, so we go left. The second number is y = 2, so we go up.' } },
            'Now check your answer on a real grid. Drag the treasure to the ❌:',
            { visual: 'coordGrid', start: [2, -1], target: [-3, 2], emoji: '🏴‍☠️', title: 'Negative numbers on the map' },
          ],
        },
        {
          title: 'Points in Python',
          blocks: [
            'In Python we can keep a point as a **list** of two numbers: the first is x, the second is y.',
            { boxes: ['3', '2'], labels: ['x', 'y'], caption: 'treasure' },
            { tryit: py`
treasure = [3, 2]
print("Go across:", treasure[0])
print("Go up:", treasure[1])
`, note: 'Press Run. Then change the numbers to hide the treasure somewhere else!' },
            'Want to see exactly what Python does, line by line? Press **Start** and then **Next**:',
            { trace: py`
treasure = [3, 2]
x = treasure[0]
y = treasure[1]
print("Go across:", x)
print("Go up:", y)
`, title: 'How Python reads the treasure list', notes: { 1: 'Python makes a list with two numbers inside and puts it in a box called `treasure`.', 2: '`treasure[0]` means "the number at position 0", which is the FIRST number: 3. That is the across number.', 3: '`treasure[1]` is the number at position 1, the SECOND number: 2. That is the up number.', 4: '`print` shows the words in quotes, then whatever is inside the box `x`.' } },
          ],
        },
        {
          title: 'Moving a point',
          blocks: [
            'To move a point, we **add** to x and y. Moving 1 to the right and 2 up from (3, 2) lands on (4, 4).',
            { steps: ['Start at x = 3, y = 2.', 'Move right 1: new x = 3 + 1 = **4**.', 'Move up 2: new y = 2 + 2 = **4**.', 'New spot: **(4, 4)**.'] },
            { tryit: py`
x, y = 3, 2
dx, dy = 1, 2      # how far to move across and up
new_point = [x + dx, y + dy]
print(new_point)
`, note: 'Try dx = -5. Where do you end up?' },
            { trace: py`
x, y = 3, 2
dx, dy = 1, 2
new_x = x + dx
new_y = y + dy
new_point = [new_x, new_y]
print(new_point)
`, title: 'Moving a point, one line at a time', notes: { 1: 'One line, two boxes: `x` gets 3 and `y` gets 2. That is where we start.', 2: 'How far to move: 1 across (`dx`) and 2 up (`dy`).', 3: 'Python looks inside the boxes: 3 + 1 = 4. The new across number is 4.', 4: 'Same for up: 2 + 2 = 4.', 5: 'Put both new numbers into a list: the new point.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['grid', 'squared paper with lines going across and up'], ['x-axis', 'the line that goes left and right'], ['y-axis', 'the line that goes up and down'], ['origin', 'the starting spot (0, 0) where the axes cross'], ['coordinates', 'the two numbers (x, y) that say where a point is']] },
            { big: 'Two numbers = one spot. Across first, then up.' },
            { tip: '**How AI uses this:** AI turns things like words and pictures into lists of numbers, so it can put them on a (very big) grid. Things that mean similar stuff end up close together on the map!' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-move',
          title: 'Move the pirate',
          xp: XP.code,
          task: 'Write `move(point, dx, dy)` that returns where the pirate ends up after walking `dx` across and `dy` up.',
          steps: ['`point` is a list like `[3, 2]`. `point[0]` is x and `point[1]` is y.', 'Add `dx` to x and `dy` to y.', 'Return the new spot as a list: `[new_x, new_y]`.'],
          starter: py`
def move(point, dx, dy):
    # point[0] is x (across), point[1] is y (up)
    # Return a NEW list: [x + dx, y + dy]
    return point


print(move([3, 2], 1, 2))  # should print [4, 4]
`,
          solution: py`
def move(point, dx, dy):
    return [point[0] + dx, point[1] + dy]


print(move([3, 2], 1, 2))  # should print [4, 4]
`,
          tests: [
            { name: 'moves right and up', fail: 'From [3, 2], moving 1 across and 2 up should give [4, 4]', code: py`
_r = move([3, 2], 1, 2)
assert list(_r) == [4, 4], f"got {_r!r}"
` },
            { name: 'moves left and down with negative numbers', code: py`
_r = move([0, 0], -2, -3)
assert list(_r) == [-2, -3], f"got {_r!r}"
` },
            { name: 'staying still keeps the same spot', code: py`
_r = move([5, 7], 0, 0)
assert list(_r) == [5, 7], f"got {_r!r}"
` },
          ],
          hints: ['x lives in `point[0]` and y lives in `point[1]`.', 'The new x is `point[0] + dx`. The new y is `point[1] + dy`.', '`return [point[0] + dx, point[1] + dy]`'],
        },
      ],
    },

    // ───────────────────────────── 2. Vectors ─────────────────────────────
    {
      id: 'la-arrows',
      title: 'Vectors: arrows made of numbers',
      minutes: 7,
      learn: [
        {
          title: 'An arrow tells you how to walk',
          blocks: [
            { big: 'A vector is an arrow. It has a direction and a length.' },
            { analogy: 'Your friend gives you directions: "From where you are, walk 3 steps east and 2 steps north." They didn\'t tell you WHERE you are, just how to move. That set of directions is a vector.', emoji: '🧭' },
            'We draw a vector as an arrow. The arrow points the way you walk, and its length shows how far.',
            { visual: 'vectorArrow', start: [3, 2] },
          ],
        },
        {
          title: 'A vector is just a list of numbers',
          blocks: [
            'The directions "3 east, 2 north" can be written as two numbers: **[3, 2]**. That list *is* the vector!',
            { boxes: ['3', '2'], labels: ['east', 'north'], caption: 'v' },
            'Each number in a vector is called a **component** (or an **entry**). This vector has 2 components.',
            { quick: { q: 'Which vector means "walk 4 east and 1 south"?', options: ['[4, 1]', '[1, 4]', '[4, -1]', '[-4, 1]'], answer: 2, explain: 'East is the first number (+4). South is the opposite of north, so the second number is negative: -1.' } },
          ],
        },
        {
          title: 'Point vs vector: what is the difference?',
          blocks: [
            'A **point** is a place: "the treasure is at (3, 2)".',
            'A **vector** is a move: "walk 3 across and 2 up".',
            'If you start at the origin (0, 0) and follow the vector [3, 2], you land on the point (3, 2). So we often draw vectors starting at the origin.',
            { tip: 'You can use the same vector from anywhere. "Walk 3 east" works from your house or from school!' },
          ],
        },
        {
          title: 'Vectors can be longer than 2',
          blocks: [
            'A video game needs 3 numbers: across, up, and forward. That is a vector with **3** components: `[2, 5, 1]`.',
            'Nothing stops us from using more! A vector describing a pizza could be:',
            { boxes: ['8', '2', '1', '0'], labels: ['cheese', 'mushroom', 'olive', 'pineapple'], caption: 'pizza' },
            'We can\'t draw 4 directions on paper, but the computer doesn\'t care. It just keeps a list of numbers.',
            { tryit: py`
pizza = [8, 2, 1, 0]
print("This vector has", len(pizza), "components")
print("Cheese amount:", pizza[0])
`, note: 'Add a fifth topping to the list and run it again.' },
          ],
        },
        {
          title: 'The opposite arrow',
          blocks: [
            'To walk *back* the way you came, flip the sign of every number. The opposite of [3, 2] is [-3, -2].',
            { steps: ['Start with [3, 2].', 'Flip 3 → -3.', 'Flip 2 → -2.', 'The opposite arrow is **[-3, -2]**: same length, pointing the other way.'] },
            { visual: 'vectorArrow', start: [3, 2], showOpposite: true },
            { tryit: py`
v = [3, 2]
opposite = [-x for x in v]
print(opposite)
`, note: 'Try a vector with a negative number in it, like [4, -1].' },
            'Here is the same idea written as a plain loop, so you can watch every number get flipped:',
            { trace: py`
v = [3, 2]
opposite = []
for x in v:
    opposite.append(-x)
print(opposite)
`, title: 'Flipping an arrow, one number at a time', notes: { 2: 'Start with an empty list. We will fill it up.', 3: 'The loop takes the numbers of `v` one at a time: first 3, then 2.', 4: '`-x` flips the sign (3 becomes -3), and `append` adds it to the end of `opposite`.', 5: 'Every number was flipped, so this is the opposite arrow.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['vector', 'an arrow, written as a list of numbers'], ['component', 'one of the numbers inside a vector'], ['dimension', 'how many numbers a vector has (2, 3, or even 768!)']] },
            { big: 'Vector = arrow = list of numbers.' },
            { tip: '**How AI uses this:** an AI turns every word into a vector with hundreds of numbers, called an *embedding*. "cat" might be `[0.2, -1.3, 0.8, ...]`. Now the computer can do math with words!' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-arrow-lab',
          title: 'Make and flip arrows',
          xp: XP.code,
          task: 'Write `make_vector(east, north)` that returns a list, and `opposite(v)` that returns the arrow pointing the other way.',
          steps: ['In `make_vector`, return a list with `east` first and `north` second.', 'In `opposite`, make a new list where every number has its sign flipped (multiply by -1).', 'Make `opposite` work for vectors of ANY length. Use a loop or a list comprehension.'],
          starter: py`
def make_vector(east, north):
    # Return [east, north]
    pass


def opposite(v):
    # Return a new list with every number flipped: [3, 2] -> [-3, -2]
    pass


print(make_vector(3, 2))   # [3, 2]
print(opposite([3, 2]))    # [-3, -2]
`,
          solution: py`
def make_vector(east, north):
    return [east, north]


def opposite(v):
    return [-x for x in v]


print(make_vector(3, 2))   # [3, 2]
print(opposite([3, 2]))    # [-3, -2]
`,
          tests: [
            { name: 'make_vector puts east first', code: py`
_r = make_vector(3, 2)
assert _r == [3, 2], f"expected [3, 2], got {_r!r}"
` },
            { name: 'opposite flips every sign', fail: 'Multiply each number by -1', code: py`
_r = opposite([3, 2])
assert list(_r) == [-3, -2], f"got {_r!r}"
` },
            { name: 'opposite works for longer vectors too', code: py`
_r = opposite([1, -4, 0, 7])
assert list(_r) == [-1, 4, 0, -7], f"got {_r!r}"
` },
          ],
          hints: ['`make_vector` is one line: `return [east, north]`.', 'For `opposite`, you need a new list where each `x` becomes `-x`.', 'A list comprehension does it: `return [-x for x in v]`.'],
        },
      ],
    },

    // ───────────────────────────── 3. NumPy ─────────────────────────────
    {
      id: 'la-numpy',
      title: 'Meet NumPy, your math helper',
      minutes: 6,
      learn: [
        {
          title: 'What is a library?',
          blocks: [
            { big: 'A library is a box of tools that someone else already built.' },
            { analogy: 'You could build a bike from scratch, cutting metal and making tyres... or you could borrow one! A library lets you borrow code that clever people already wrote and tested.', emoji: '📚' },
            '**NumPy** (say "NUM-pie") is the most famous Python library for doing math with lots of numbers at once. Almost every AI program uses it.',
          ],
        },
        {
          title: 'Bringing NumPy in',
          blocks: [
            'To use a library, we **import** it at the top of our code:',
            { code: 'import numpy as np' },
            'The `as np` part gives it a short nickname. Instead of typing `numpy` every time, we just type `np`.',
            'Now we can make a NumPy **array**, NumPy\'s super-powered version of a list:',
            { tryit: py`
import numpy as np

v = np.array([3, 2])
print(v)
print(type(v))
`, note: 'Press Run. See how it prints without commas? That is how you spot a NumPy array.' },
          ],
        },
        {
          title: 'Lists glue, arrays add',
          blocks: [
            'Here is the big surprise. Watch what `+` does to normal Python lists:',
            { tryit: py`
a = [1, 2, 3]
b = [10, 20, 30]
print(a + b)
`, note: 'The lists got glued together end to end!' },
            'That is not math. Now try the same with NumPy arrays:',
            { tryit: py`
import numpy as np

a = np.array([1, 2, 3])
b = np.array([10, 20, 30])
print(a + b)
`, note: 'Now each pair of numbers got added: 1+10, 2+20, 3+30.' },
            { big: 'Lists + lists = glue. Arrays + arrays = add!' },
            { visual: 'glueVsAdd', a: [1, 2, 3], b: [10, 20, 30] },
          ],
        },
        {
          title: 'Math on everything at once',
          blocks: [
            'With an array, one line of math changes **every** number. No loop needed!',
            'Without NumPy, you would have to write a loop and visit every number yourself. Watch how much work that is:',
            { trace: py`
prices = [2, 5, 10]
doubled = []
for p in prices:
    doubled.append(p * 2)
print(doubled)
`, title: 'The loop NumPy does for you', notes: { 3: 'Visit each price, one at a time.', 4: 'Double this price and add it to the end of the new list.', 5: 'With NumPy, all of this is just `prices * 2`!' } },
            { tryit: py`
import numpy as np

prices = np.array([2, 5, 10])
print(prices * 2)     # double every price
print(prices + 1)     # add 1 to every price
print(prices.sum())   # add them all up
`, note: 'Try `prices / 2` or `prices - 1`.' },
            { quick: { q: 'If `a = np.array([1, 2])` and `b = np.array([3, 4])`, what is `a + b`?', options: ['[1, 2, 3, 4]', '[4, 6]', '[3, 8]', '10'], answer: 1, explain: 'NumPy adds matching positions: 1+3 = 4 and 2+4 = 6.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['library', 'code someone else wrote that you can borrow'], ['import', 'the word that brings a library into your program'], ['NumPy', 'a library for fast math with many numbers'], ['array', "NumPy's list: it does real math with `+`, `*` and friends"]] },
            { big: '`import numpy as np`, then `np.array([...])`.' },
            { tip: '**How AI uses this:** a neural network does millions of additions and multiplications. NumPy (and tools built like it, such as PyTorch) does them all at once, super fast.' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-numpy-lab',
          title: 'Your first arrays',
          xp: XP.code,
          numpy: true,
          task: 'Turn two lists into NumPy arrays and add them together.',
          steps: ['Make `a` a NumPy array of `[1, 2, 3]`.', 'Make `b` a NumPy array of `[10, 20, 30]`.', 'Set `total` to `a + b` and print it. It should show `[11 22 33]`.'],
          starter: py`
import numpy as np

a = None      # make this np.array([1, 2, 3])
b = None      # make this np.array([10, 20, 30])
total = None  # add a and b

print(total)
`,
          solution: py`
import numpy as np

a = np.array([1, 2, 3])
b = np.array([10, 20, 30])
total = a + b

print(total)
`,
          tests: [
            { name: 'a and b are NumPy arrays', fail: 'Use np.array([...])', code: py`
import numpy as _np
assert isinstance(a, _np.ndarray) and isinstance(b, _np.ndarray)
` },
            { name: 'total is [11, 22, 33]', fail: 'Did you add the arrays (not glue lists)?', code: py`
import numpy as _np
assert total is not None and _np.array_equal(total, [11, 22, 33]), f"got {total!r}"
` },
          ],
          hints: ['Remember the import line is already there: `np` is NumPy.', '`a = np.array([1, 2, 3])` and the same idea for `b`.', '`total = a + b`'],
        },
      ],
    },

    // ───────────────────────────── 4. Add & scale ─────────────────────────────
    {
      id: 'la-vectors',
      title: 'Adding & stretching vectors',
      minutes: 6,
      learn: [
        {
          title: 'Adding = walking one after another',
          blocks: [
            { big: 'Adding two vectors means: do the first walk, then the second walk.' },
            { analogy: 'You walk [3, 1] (3 east, 1 north) to the shop. Then you walk [1, 2] to the park. Where are you compared to home? Just add the matching numbers: [3+1, 1+2] = [4, 3].', emoji: '🚶' },
            { visual: 'vectorAdd', a: [3, 1], b: [1, 2] },
          ],
        },
        {
          title: 'Adding, slowly by hand',
          blocks: [
            'Let\'s add `[2, 5, -1]` and `[4, -2, 3]`. Match up the positions:',
            { steps: ['First numbers: 2 + 4 = **6**.', 'Second numbers: 5 + (-2) = **3**.', 'Third numbers: -1 + 3 = **2**.', 'Answer: **[6, 3, 2]**.'] },
            { warn: 'You can only add vectors that have the **same number of components**. [1, 2] + [1, 2, 3] makes no sense: which number would the 3 pair up with?' },
            { tryit: py`
import numpy as np

a = np.array([2, 5, -1])
b = np.array([4, -2, 3])
print(a + b)
`, note: 'Check: does the computer agree with our hand answer?' },
            'And here is the "by hand" recipe written as code, so you can see each position being added:',
            { trace: py`
a = [2, 5, -1]
b = [4, -2, 3]
total = []
for i in range(3):
    total.append(a[i] + b[i])
print(total)
`, title: 'Adding two vectors, position by position', notes: { 3: 'An empty list that will hold the answer.', 4: '`i` is the position number: first 0, then 1, then 2.', 5: 'Take the number at position `i` from BOTH lists, add them, and put the answer at the end of `total`.', 6: 'All three positions are done: [6, 3, 2].' } },
          ],
        },
        {
          title: 'Scaling = stretching or shrinking',
          blocks: [
            'Multiplying a vector by a single number is called **scaling**. The number is called a **scalar**.',
            { list: ['× 2 → the arrow becomes twice as long.', '× 0.5 → half as long.', '× -1 → same length, pointing backwards.'] },
            { steps: ['Start with [3, 1].', 'Multiply each number by 2.', '3 × 2 = 6 and 1 × 2 = 2.', 'Answer: **[6, 2]**: same direction, twice as far.'] },
            { visual: 'vectorScale', v: [3, 1], k: 2 },
            { tryit: py`
import numpy as np

v = np.array([3, 1])
print(2 * v)
print(0.5 * v)
print(-1 * v)
`, note: 'Try multiplying by 10, or by 0. What happens with 0?' },
          ],
        },
        {
          title: 'Putting it together',
          blocks: [
            'We can add and scale in one go. Brackets work just like in normal math: do the inside first.',
            { code: '2 * ([1, 2] + [3, 4])\n= 2 * [4, 6]\n= [8, 12]' },
            { quick: { q: 'What is `3 * [1, -2]`?', options: ['[3, -2]', '[4, 1]', '[3, -6]', '[1, -6]'], answer: 2, explain: 'Multiply every number by 3: 1×3 = 3 and -2×3 = -6.' } },
            { trace: py`
a = [1, 2]
b = [3, 4]
inside = [a[0] + b[0], a[1] + b[1]]
answer = [2 * inside[0], 2 * inside[1]]
print(answer)
`, title: 'How 2 * ([1, 2] + [3, 4]) is worked out', notes: { 3: 'The brackets go first: add the matching numbers. 1 + 3 = 4 and 2 + 4 = 6.', 4: 'Now scale: multiply each number of the inside answer by 2. 4 × 2 = 8 and 6 × 2 = 12.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['vector addition', 'add the matching numbers of two vectors'], ['scalar', 'a single plain number (not a list)'], ['scaling', 'multiplying every number in a vector by a scalar']] },
            { big: 'Add = walk one, then the other. Scale = stretch.' },
            { tip: '**How AI uses this:** a famous trick: take the vector for "king", subtract "man", add "woman"... and you land close to "queen"! Adding vectors can mix meanings.' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-vec',
          title: 'Add & scale with NumPy',
          xp: XP.code,
          numpy: true,
          task: 'Write `add_and_scale(a, b, k)`: add vectors `a` and `b`, then stretch the result by `k`.',
          steps: ['Turn the lists `a` and `b` into NumPy arrays with `np.array(...)`.', 'Add them together.', 'Multiply the result by `k` and return it.'],
          starter: py`
import numpy as np


def add_and_scale(a, b, k):
    # 1. turn a and b into NumPy arrays
    # 2. add them
    # 3. multiply by k and return the answer
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
            { name: 'returns a NumPy array', fail: 'Use np.array(...) so the result is a NumPy array', code: py`
import numpy as _np
assert isinstance(add_and_scale([1, 2], [3, 4], 2), _np.ndarray)
` },
            { name: 'adds, then scales', fail: '([1,2] + [3,4]) times 2 should be [8, 12]', code: py`
import numpy as _np
_r = add_and_scale([1, 2], [3, 4], 2)
assert _np.allclose(_r, [8, 12]), f"got {_r!r}"
` },
            { name: 'works for any length', code: py`
import numpy as _np
_r = add_and_scale([1, 0, -1], [1, 1, 1], 0.5)
assert _np.allclose(_r, [1, 0.5, 0]), f"got {_r!r}"
` },
          ],
          hints: ['Plain lists glue together with `+`. Arrays add properly.', '`np.array(a) + np.array(b)` gives you the sum vector.', '`return k * (np.array(a) + np.array(b))`'],
        },
      ],
    },

    // ───────────────────────────── 5. Length ─────────────────────────────
    {
      id: 'la-length',
      title: 'How long is an arrow?',
      minutes: 7,
      learn: [
        {
          title: 'The shortcut across the park',
          blocks: [
            { big: 'The length of a vector is how far you really end up from the start.' },
            { analogy: 'You walk 3 blocks east and 4 blocks north. But a bird flies straight from your start to your end in a diagonal line. How far did the bird fly? That straight-line distance is the vector\'s **length**.', emoji: '🐦' },
            'The bird\'s path is shorter than your 3 + 4 = 7 blocks, because it cuts the corner.',
            { visual: 'vectorLength', v: [3, 4], goal: 5 },
          ],
        },
        {
          title: 'The right-angle triangle trick',
          blocks: [
            'Your walk makes a triangle: one side across, one side up, and the bird\'s diagonal. Because across and up meet at a square corner, a very old rule called **Pythagoras\' theorem** works:',
            { big: 'length² = across² + up²' },
            '"²" means "times itself" (squared). So 3² = 3 × 3 = 9.',
            { steps: ['Across = 3, so 3² = **9**.', 'Up = 4, so 4² = **16**.', 'Add them: 9 + 16 = **25**.', 'Now undo the squaring with a **square root**: √25 = **5**.', 'The bird flew **5** blocks.'] },
            { tip: 'A square root asks: "what number times itself makes this?" 5 × 5 = 25, so √25 = 5.' },
          ],
        },
        {
          title: 'Square roots in Python',
          blocks: [
            'Python has a `math` library with `sqrt` (square root) inside it.',
            { tryit: py`
import math

across = 3
up = 4
length = math.sqrt(across ** 2 + up ** 2)
print(length)
`, note: '`**` means "to the power of", so `3 ** 2` is 3². Try across = 6 and up = 8.' },
            { trace: py`
import math

across = 3
up = 4
squares = across ** 2 + up ** 2
length = math.sqrt(squares)
print(length)
`, title: 'The bird\'s flight, worked out by Python', notes: { 1: 'Bring in the `math` toolbox, which has `sqrt` (square root) inside.', 5: '`across ** 2` is 3 × 3 = 9 and `up ** 2` is 4 × 4 = 16. Added together: 25.', 6: 'The square root asks "what times itself is 25?" The answer is 5.' } },
          ],
        },
        {
          title: 'More than two numbers',
          blocks: [
            'The same trick works for longer vectors: square every number, add them all up, then take the square root.',
            { steps: ['Vector: [1, 2, 2].', 'Squares: 1, 4, 4.', 'Sum: 1 + 4 + 4 = 9.', '√9 = **3**.'] },
            'NumPy has a ready-made tool for this called `np.linalg.norm` ("norm" is a fancy word for length):',
            { tryit: py`
import numpy as np

v = np.array([1, 2, 2])
print(np.linalg.norm(v))
`, note: 'Try [3, 4]. You should get 5 again!' },
            { quick: { q: 'What is the length of `[0, 7]`?', options: ['0', '7', '49', '14'], answer: 1, explain: '0² + 7² = 49, and √49 = 7. Makes sense. It\'s just 7 straight up!' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['length (or norm)', 'how long the arrow is, in a straight line'], ['squared (²)', 'a number times itself'], ['square root (√)', 'the number that, times itself, gives you back the original']] },
            { big: 'Square each number, add them up, square-root the total.' },
            { tip: '**How AI uses this:** AI often makes all its word-vectors the same length (length 1) so that only their *direction* matters. You\'ll see why in the cosine similarity lesson!' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-length-lab',
          title: 'Measure an arrow',
          xp: XP.code,
          task: 'Write `length(v)` that returns how long the vector `v` is, without NumPy!',
          steps: ['Start a running total at 0.', 'Loop over each number in `v` and add its square (`x ** 2`) to the total.', 'Return `math.sqrt(total)`.'],
          starter: py`
import math


def length(v):
    total = 0
    # loop over the numbers in v and add each one squared to total

    # return the square root of total
    return total


print(length([3, 4]))  # 5.0
`,
          solution: py`
import math


def length(v):
    total = 0
    for x in v:
        total += x ** 2
    return math.sqrt(total)


print(length([3, 4]))  # 5.0
`,
          tests: [
            { name: '[3, 4] has length 5', fail: 'Square, add, then square-root', code: py`
_r = length([3, 4])
assert abs(_r - 5) < 1e-9, f"got {_r!r}"
` },
            { name: 'works with 3 numbers', code: py`
_r = length([1, 2, 2])
assert abs(_r - 3) < 1e-9, f"expected 3, got {_r!r}"
` },
            { name: 'negative numbers still give a positive length', fail: 'Squaring makes negatives positive', code: py`
_r = length([-6, -8])
assert abs(_r - 10) < 1e-9, f"expected 10, got {_r!r}"
` },
          ],
          hints: ['Inside the loop: `total += x ** 2`.', 'After the loop, you have the sum of squares. You still need the square root!', '`return math.sqrt(total)`'],
        },
      ],
    },

    // ───────────────────────────── 6. Dot product ─────────────────────────────
    {
      id: 'la-dot',
      title: 'Dot product: do two arrows agree?',
      minutes: 8,
      learn: [
        {
          title: 'A number that measures teamwork',
          blocks: [
            { big: 'The dot product tells you how much two arrows point the same way.' },
            { analogy: 'Two kids are pulling a wagon with ropes. If they both pull in the same direction, the wagon zooms. If they pull sideways to each other, they don\'t help each other at all. If they pull in opposite directions, they fight! The dot product is a score for how well they work together.', emoji: '🛒' },
          ],
        },
        {
          title: 'How to calculate it',
          blocks: [
            'Multiply the matching numbers, then add up all the results.',
            { visual: 'dotSteps', a: [1, 2], b: [3, 4] },
            'So a · b = **11**. (The dot "·" is how we write it.)',
            { warn: 'The answer is ONE number, not a vector. That\'s what makes the dot product special.' },
          ],
        },
        {
          title: 'What the answer means',
          blocks: [
            { table: { head: ['Dot product', 'The arrows are…', 'Wagon kids'], rows: [['big and positive', 'pointing the same way', 'pulling together 🎉'], ['zero', 'at a right angle (perpendicular)', 'not helping each other 🤷'], ['negative', 'pointing opposite ways', 'fighting! 😠']] } },
            { steps: ['[1, 0] · [0, 1] = 1×0 + 0×1 = **0**. One points right, one points up, a right angle!', '[1, 2] · [-1, -2] = -1 + -4 = **-5**. Opposite directions → negative.'] },
            { quick: { q: 'What is `[2, 3] · [4, -1]`?', options: ['5', '11', '[8, -3]', '-5'], answer: 0, explain: '2×4 = 8, and 3×(-1) = -3. Add them: 8 + (-3) = 5. Positive, so they mostly agree.' } },
            'Here is how a computer works out that quiz answer. Watch the numbers jump into the function and the answer come back out:',
            { trace: py`
def dot(a, b):
    total = 0
    for x, y in zip(a, b):
        total = total + x * y
    return total

answer = dot([2, 3], [4, -1])
print(answer)
`, title: 'How the quiz answer is worked out', notes: { 1: 'This only TEACHES Python the recipe called `dot`. Nothing is calculated yet.', 7: 'Here we USE the recipe. The two lists go into the function as `a` and `b`.', 3: '`zip` hands us one matching pair at a time: first (2, 4), then (3, -1).', 4: 'Multiply the pair and add it onto the running total.', 5: 'All pairs are done, so the function hands the total back.' } },
            { visual: 'dotSteps', a: [2, 3], b: [4, -1] },
          ],
        },
        {
          title: 'By hand in Python',
          blocks: [
            'We can write the recipe with a loop. `zip` walks through two lists side by side, handing us matching pairs.',
            { tryit: py`
a = [1, 2]
b = [3, 4]

total = 0
for x, y in zip(a, b):
    print(x, "times", y, "=", x * y)
    total += x * y

print("dot product:", total)
`, note: 'Change the vectors. Can you make the answer 0?' },
            { trace: py`
a = [1, 2]
b = [3, 4]

total = 0
for x, y in zip(a, b):
    total = total + x * y

print("dot product:", total)
`, title: 'The dot product loop, slowly', notes: { 4: 'Start the score at 0.', 5: '`zip(a, b)` pairs up the lists: first `x` = 1 and `y` = 3, then `x` = 2 and `y` = 4.', 6: 'Multiply the pair, then add it to the total. Round 1: 0 + 3 = 3. Round 2: 3 + 8 = 11.' } },
          ],
        },
        {
          title: 'The NumPy shortcut',
          blocks: [
            'NumPy does the whole recipe for us with `np.dot`:',
            { tryit: py`
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(np.dot(a, b))
`, note: 'Check by hand: 1×4 + 2×5 + 3×6 = ?' },
            { tip: 'Play with the arrows in the playground below the lesson. Watch the number change as you drag!' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['dot product', 'multiply matching numbers, then add them all up'], ['perpendicular', 'at a right angle, like the corner of a square'], ['aligned', 'pointing the same way']] },
            { big: 'Multiply pairs, add them up. Big = agree, 0 = unrelated, negative = disagree.' },
            { tip: '**How AI uses this:** chatbots use dot products to decide which words in a sentence should "pay attention" to each other. It is called *attention*, and it uses dot products millions of times!' },
          ],
        },
      ],
      activities: [
        { type: 'viz', id: 'viz-dot', title: 'Dot product playground', component: 'DotProductViz', xp: XP.viz },
        {
          type: 'code',
          id: 'la-dot-lab',
          title: 'Dot product two ways',
          xp: XP.code,
          numpy: true,
          task: 'Write `dot(a, b)` using `np.dot`, and `dot_by_hand(a, b)` using a loop, no NumPy.',
          steps: ['In `dot`, just return `np.dot(a, b)`.', 'In `dot_by_hand`, loop through the pairs with `zip(a, b)`.', 'Multiply each pair and add it to `total`. Return `total`.'],
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
            { name: 'by-hand version', fail: 'Loop with zip and add up x * y', code: py`
_r = dot_by_hand([1, 2, 3], [4, 5, 6])
assert _r == 32, f"expected 32, got {_r!r}"
` },
            { name: 'perpendicular arrows give 0', code: py`
assert dot([1, 0], [0, 1]) == 0 and dot_by_hand([1, 0], [0, 1]) == 0
` },
            { name: 'opposite arrows give a negative', code: py`
assert dot_by_hand([1, 2], [-1, -2]) == -5
` },
          ],
          hints: ['`np.dot(a, b)` does all the work for the first one.', 'For the by-hand one, `for x, y in zip(a, b):` gives you matching pairs.', 'Inside the loop: `total += x * y`.'],
        },
      ],
    },

    // ───────────────────────────── 7. Matrices ─────────────────────────────
    {
      id: 'la-matrices',
      title: 'Matrices: tables of numbers',
      minutes: 7,
      learn: [
        {
          title: 'A grid of numbers',
          blocks: [
            { big: 'A matrix is a table of numbers, arranged in rows and columns.' },
            { analogy: 'Think of a chocolate box: the chocolates sit in neat rows and columns. Or a class register: one row per student, one column per day of the week. That kind of table is a matrix.', emoji: '🍫' },
            { visual: 'matrixGrid', rows: [[1, 0, 1], [1, 1, 1]], name: 'register', rowNames: ['Ana', 'Ben'], colNames: ['Mon', 'Tue', 'Wed'] },
            'This little attendance table is a matrix with 2 rows and 3 columns. (1 means "was at school", 0 means "was not".)',
          ],
        },
        {
          title: 'Rows and columns',
          blocks: [
            { list: ['**Rows** go across ➡️ (like rows of seats in a cinema).', '**Columns** go down ⬇️ (like the columns holding up a building).'] },
            'Here is a matrix called M:',
            { visual: 'matrixGrid', rows: [[1, 2, 3], [4, 5, 6]], name: 'M' },
            'Row 0 is `[1, 2, 3]`. Column 2 is `[3, 6]`.',
            { tip: 'You can think of a matrix as a stack of vectors: each row is a vector!' },
          ],
        },
        {
          title: 'The shape of a matrix',
          blocks: [
            'We describe a matrix by its **shape**: (number of rows, number of columns). **Rows always come first.**',
            { table: { head: ['Matrix', 'Shape'], rows: [['2 rows, 3 columns', '(2, 3)'], ['3 rows, 2 columns', '(3, 2)'], ['1 row, 4 columns', '(1, 4)']] } },
            { quick: { q: 'A matrix has 4 rows and 2 columns. What is its shape?', options: ['(2, 4)', '(4, 2)', '(8,)', '(4, 4)'], answer: 1, explain: 'Rows first, then columns: (4, 2).' } },
            { warn: '(2, 3) and (3, 2) are DIFFERENT shapes. Order matters!' },
          ],
        },
        {
          title: 'Matrices in NumPy',
          blocks: [
            'In Python, a matrix is a **list of lists**, one inner list per row. NumPy turns it into a 2D array:',
            { tryit: py`
import numpy as np

M = np.array([[1, 2, 3],
              [4, 5, 6]])
print(M)
print("shape:", M.shape)
`, note: 'Add a third row like [7, 8, 9]. What is the shape now?' },
          ],
        },
        {
          title: 'Grabbing numbers out',
          blocks: [
            'Use `M[row, column]` to grab one number. Counting starts at 0!',
            { tryit: py`
import numpy as np

M = np.array([[1, 2, 3],
              [4, 5, 6]])
print(M[0, 2])    # row 0, column 2
print(M[1])       # the whole of row 1
print(M[:, 0])    # the whole of column 0
`, note: 'How would you grab the 5?' },
            { visual: 'matrixGrid', rows: [[1, 2, 3], [4, 5, 6]], name: 'M', ask: [1, 1] },
            { trace: py`
M = [[1, 2, 3],
     [4, 5, 6]]
row = M[1]
number = row[0]
print(number)
`, title: 'Grabbing one number, step by step', notes: { 1: 'A matrix is a list of rows. Row 0 is [1, 2, 3] and row 1 is [4, 5, 6].', 3: '`M[1]` grabs row 1: the whole inner list [4, 5, 6].', 4: '`[0]` then grabs the first number of that row: 4. That is the same as `M[1, 0]` in NumPy.' } },
            { quick: { q: 'In the matrix above, what is `M[1, 0]`?', options: ['2', '4', '1', '5'], answer: 1, explain: 'Row 1 is [4, 5, 6]. Column 0 of that row is 4.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['matrix', 'a table of numbers in rows and columns (plural: matrices)'], ['row', 'a line of numbers going across'], ['column', 'a line of numbers going down'], ['shape', '(rows, columns): how big the matrix is']] },
            { big: 'Matrix = table. Shape = (rows, columns). Rows first!' },
            { tip: '**How AI uses this:** a neural network\'s "brain" is stored as matrices full of numbers called *weights*. Learning means slowly changing those numbers.' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-matrix-lab',
          title: 'Build a matrix',
          xp: XP.code,
          numpy: true,
          task: 'Make a 2-row, 3-column matrix and find its shape.',
          steps: ['Make `M` a NumPy array with rows `[1, 2, 3]` and `[4, 5, 6]`.', 'Set `rows, cols = M.shape`.', 'Set `middle` to the number in row 1, column 1 (it should be 5).'],
          starter: py`
import numpy as np

M = None          # make a 2D NumPy array: rows [1, 2, 3] and [4, 5, 6]
rows, cols = None, None   # use M.shape
middle = None     # the number at row 1, column 1

print(M)
print(rows, cols, middle)
`,
          solution: py`
import numpy as np

M = np.array([[1, 2, 3], [4, 5, 6]])
rows, cols = M.shape
middle = M[1, 1]

print(M)
print(rows, cols, middle)
`,
          tests: [
            { name: 'M is the right matrix', fail: 'Use np.array([[1, 2, 3], [4, 5, 6]])', code: py`
import numpy as _np
assert isinstance(M, _np.ndarray) and _np.array_equal(M, [[1, 2, 3], [4, 5, 6]]), f"got {M!r}"
` },
            { name: 'rows = 2 and cols = 3', fail: 'rows, cols = M.shape', code: py`
assert (rows, cols) == (2, 3), f"got rows={rows!r}, cols={cols!r}"
` },
            { name: 'middle is 5', fail: 'M[1, 1]: remember counting starts at 0', code: py`
assert middle == 5, f"got {middle!r}"
` },
          ],
          hints: ['A matrix is a list of lists: `[[1, 2, 3], [4, 5, 6]]` wrapped in `np.array(...)`.', '`M.shape` gives two numbers at once, so `rows, cols = M.shape` catches both.', 'Row 1, column 1 is `M[1, 1]`.'],
        },
      ],
    },

    // ───────────────────────────── 8. Matrix multiplication ─────────────────────────────
    {
      id: 'la-matmul',
      title: 'Multiplying matrices, step by step',
      minutes: 10,
      learn: [
        {
          title: 'Lots of dot products at once',
          blocks: [
            { big: 'Matrix multiplication is just many dot products, neatly organised.' },
            { analogy: 'At a sweet shop, a table lists how many of each sweet two kids bought. Another list gives each sweet\'s price. To find what each kid spends, you multiply their row of amounts by the prices and add up: a dot product for each kid! Matrix multiplication does all the kids at once.', emoji: '🍬' },
          ],
        },
        {
          title: 'The sweet shop, by hand',
          blocks: [
            'Amounts bought (A): rows are kids, columns are sweets (lolly, choc).',
            'Prices (B): one column, one row per sweet. Lolly costs 5, choc costs 10.',
            { visual: 'matmulSteps', A: [[2, 1], [0, 3]], B: [[5], [10]], nameA: 'amounts', nameB: 'prices', rowNames: ['Ana', 'Ben'], midNames: ['lolly', 'choc'], colNames: ['coins'], story: 'Each kid\'s row of amounts meets the column of prices.' },
            { steps: ['Ana\'s row [2, 1] · prices [5, 10] = 2×5 + 1×10 = **20**.', 'Ben\'s row [0, 3] · prices [5, 10] = 0×5 + 3×10 = **30**.', 'The answer is a column: **[[20], [30]]**, Ana spends 20, Ben spends 30.'] },
          ],
        },
        {
          title: 'The rule: row × column',
          blocks: [
            'Each answer box = (a **row** of the first matrix) · (a **column** of the second matrix).',
            { list: ['The answer in **row i, column j** uses row i of A and column j of B.', 'In Python, we multiply matrices with the `@` symbol.'] },
            { tryit: py`
import numpy as np

A = np.array([[2, 1],
              [0, 3]])     # amounts
B = np.array([[5],
              [10]])       # prices
print(A @ B)
`, note: 'Make choc cost 20 instead of 10. What does each kid spend now?' },
            'Here is what `@` does behind the scenes for the sweet shop, written as a loop:',
            { trace: py`
A = [[2, 1],
     [0, 3]]
prices = [5, 10]
answer = []
for row in A:
    spent = row[0] * prices[0] + row[1] * prices[1]
    answer.append(spent)
print(answer)
`, title: 'Row times column, by hand', notes: { 5: 'Take one kid\'s row at a time: first Ana [2, 1], then Ben [0, 3].', 6: 'A dot product: lollies × lolly price + chocs × choc price.', 7: 'Write that kid\'s total into the answer.' } },
          ],
        },
        {
          title: 'When shapes fit together',
          blocks: [
            'For a row·column dot product to work, the row and column must be the **same length**. That gives us the shape rule:',
            { big: '(m, n) @ (n, p) → (m, p)' },
            { analogy: 'Think of LEGO bricks: the inside numbers must match to click together, like the studs on one brick matching the holes on the next. Once they click, the two outside numbers tell you the shape of the result.', emoji: '🧱' },
            { table: { head: ['Multiply', 'Inside numbers', 'Result'], rows: [['(2, **3**) @ (**3**, 4)', '3 = 3 ✅', '(2, 4)'], ['(2, **2**) @ (**2**, 1)', '2 = 2 ✅', '(2, 1)'], ['(2, **3**) @ (**2**, 3)', '3 ≠ 2 ❌', 'error!']] } },
            { trace: py`
def result_shape(a, b):
    if a[1] != b[0]:
        return "error!"
    return (a[0], b[1])

print(result_shape((2, 3), (3, 4)))
print(result_shape((2, 3), (2, 3)))
`, title: 'The shape rule as a tiny function', notes: { 2: 'Compare the INSIDE numbers: the second number of the first shape and the first number of the second shape.', 3: 'They don\'t match, so the matrices can\'t be multiplied.', 4: 'They match, so the answer keeps the OUTSIDE numbers.', 6: 'Shapes (2, 3) and (3, 4): the inside 3s match.', 7: 'Shapes (2, 3) and (2, 3): inside numbers 3 and 2 are different!' } },
          ],
        },
        {
          title: 'What happens when shapes don\'t fit',
          blocks: [
            'If the inside numbers don\'t match, Python stops with an error. This is the most common bug in all of AI code!',
            { tryit: py`
import numpy as np

A = np.ones((2, 3))
B = np.ones((2, 3))
print(A @ B)
`, note: 'This one is SUPPOSED to break. Read the error, then change B to np.ones((3, 2)).', expectError: true },
            { visual: 'matmulSteps', A: [[1, 1, 1], [1, 1, 1]], B: [[1, 1, 1], [1, 1, 1]] },
            { quick: { q: 'What shape is `(4, 5) @ (5, 2)`?', options: ['(4, 2)', '(5, 5)', '(4, 5)', 'error'], answer: 0, explain: 'The inside 5s match and cancel. The outside numbers 4 and 2 make the result (4, 2).' } },
          ],
        },
        {
          title: 'A bigger example',
          blocks: [
            'Let\'s check a (2, 3) @ (3, 2) by the computer and see the shape:',
            { tryit: py`
import numpy as np

A = np.array([[1, 2, 3],
              [4, 5, 6]])        # shape (2, 3)
B = np.array([[1, 0],
              [0, 1],
              [1, 1]])           # shape (3, 2)
C = A @ B
print(C)
print("shape:", C.shape)
`, note: 'Check the top-left by hand: row [1,2,3] · column [1,0,1] = 1 + 0 + 3 = 4.' },
            { visual: 'matmulSteps', A: [[1, 2, 3], [4, 5, 6]], B: [[1, 0], [0, 1], [1, 1]] },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['matrix multiplication', 'every row of the first matrix dotted with every column of the second'], ['@', 'the Python symbol for matrix multiplication'], ['inner dimensions', 'the two middle numbers of the shapes. They must match']] },
            { big: 'Row · column for every box. Inside numbers match, outside numbers survive.' },
            { tip: '**How AI uses this:** every layer of a neural network is a matrix multiplication: input @ weights. Big AIs do trillions of these every second!' },
          ],
        },
      ],
      activities: [
        { type: 'viz', id: 'viz-matrix', title: 'Shape-matching playground', component: 'MatrixShapeViz', xp: XP.viz },
        {
          type: 'code',
          id: 'la-matmul-lab',
          title: 'Multiply and print the shape',
          xp: XP.code,
          numpy: true,
          task: 'Multiply `A` and `B` with `@`, save the answer as `C`, and print `C.shape`.',
          steps: ['Set `C = A @ B`.', 'Print `C.shape`: it should show `(2, 4)`.'],
          starter: py`
import numpy as np

A = np.ones((2, 3))   # a (2, 3) matrix full of 1s
B = np.ones((3, 4))   # a (3, 4) matrix full of 1s

# 1. Multiply A and B with the @ symbol
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
          hints: ['In NumPy, `@` means matrix multiplication.', '`C = A @ B`', 'Every array has a `.shape`: `print(C.shape)`.'],
        },
        {
          type: 'code',
          id: 'la-shapes',
          title: 'Shape detective',
          xp: XP.code,
          task: 'Write `matmul_shape(a, b)`: given two shapes, return the result shape, or `None` if they can\'t multiply.',
          steps: ['The shapes are pairs like `(2, 3)`. `a[1]` is the inside number of a; `b[0]` is the inside number of b.', 'If the inside numbers are different, return `None`.', 'Otherwise return the outside numbers: `(a[0], b[1])`.'],
          starter: py`
def matmul_shape(a, b):
    # a and b are shapes like (2, 3) and (3, 4).
    # If they can't multiply, return None.
    # Otherwise return the result shape.
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
            { name: 'shapes that fit', code: py`
_r = matmul_shape((2, 3), (3, 4))
assert _r == (2, 4), f"expected (2, 4), got {_r!r}"
` },
            { name: "shapes that don't fit give None", fail: 'Check if a[1] equals b[0]', code: py`
_r = matmul_shape((2, 3), (2, 3))
assert _r is None, f"expected None, got {_r!r}"
` },
            { name: 'a real AI-sized example', code: py`
_r = matmul_shape((1, 768), (768, 3072))
assert _r == (1, 3072), f"got {_r!r}"
` },
          ],
          hints: ['Compare the inside numbers: `a[1]` and `b[0]`.', '`if a[1] != b[0]: return None`', 'Otherwise: `return (a[0], b[1])`.'],
        },
      ],
    },

    // ───────────────────────────── 9. Transpose / identity / inverse ─────────────────────────────
    {
      id: 'la-ops',
      title: 'Flip, do-nothing & undo matrices',
      minutes: 9,
      learn: [
        {
          title: 'Transpose: flip it over',
          blocks: [
            { big: 'Transposing a matrix turns its rows into columns.' },
            { analogy: 'Imagine a table drawn on see-through paper. Flip it over along the diagonal line from the top-left corner. What was a row is now a column!', emoji: '🔄' },
            { visual: 'transposeFlip', M: [[1, 2, 3], [4, 5, 6]] },
            'A has shape (2, 3). Its transpose `A.T` has shape (3, 2), the numbers swap.',
          ],
        },
        {
          title: 'Transpose in Python',
          blocks: [
            'In NumPy, just add `.T` after the matrix:',
            { tryit: py`
import numpy as np

A = np.array([[1, 2, 3],
              [4, 5, 6]])
print(A.T)
print(A.shape, "->", A.T.shape)
`, note: 'What do you think A.T.T gives? Try it!' },
            { trace: py`
A = [[1, 2, 3],
     [4, 5, 6]]
AT = []
for col in range(3):
    new_row = [A[0][col], A[1][col]]
    AT.append(new_row)
print(AT)
`, title: 'Flipping by hand: columns become rows', notes: { 4: 'Go through the columns of A: column 0, then 1, then 2.', 5: 'Collect that column from top to bottom: the number from row 0, then the number from row 1.', 6: 'That column becomes a new ROW of the answer.' } },
            { tip: 'Transpose is how you fix "shapes don\'t fit" problems. If (2, 3) @ (2, 3) fails, (2, 3) @ (3, 2), using the transpose, works!' },
          ],
        },
        {
          title: 'The identity: the "do nothing" matrix',
          blocks: [
            'In normal math, multiplying by 1 changes nothing: 7 × 1 = 7. Matrices have their own "1" called the **identity matrix**, written **I**.',
            'It has 1s down the diagonal and 0s everywhere else:',
            { table: { head: ['I', ''], rows: [['1', '0'], ['0', '1']] } },
            { tryit: py`
import numpy as np

I = np.eye(2)        # eye sounds like "I"!
A = np.array([[3, 7],
              [2, 5]])
print(I)
print(A @ I)
`, note: 'A @ I comes out exactly the same as A.' },
            { visual: 'matmulSteps', A: [[3, 7], [2, 5]], B: [[1, 0], [0, 1]], nameB: 'I', story: 'Watch each answer box: it always comes out the same as the matching box of A. I changes nothing!' },
          ],
        },
        {
          title: 'The inverse: the "undo" matrix',
          blocks: [
            'In normal math, × 4 can be undone by × ¼. A matrix can sometimes be undone too, by its **inverse**. A matrix times its inverse gives the identity, like nothing happened.',
            { analogy: 'Tying your shoelaces and then untying them. The inverse is the "untie" move: do one, then the other, and you\'re back where you started.', emoji: '👟' },
            { tryit: py`
import numpy as np

A = np.array([[2, 1],
              [1, 1]])
A_inv = np.linalg.inv(A)
print(A_inv)
print(A @ A_inv)
`, note: 'A @ A_inv gives the identity matrix (1s on the diagonal).' },
            { warn: 'Not every matrix has an inverse, some moves can\'t be undone, like squashing a drawing flat.' },
          ],
        },
        {
          title: '* versus @',
          blocks: [
            'This catches everybody out at first! NumPy has two kinds of multiply:',
            { table: { head: ['Symbol', 'What it does'], rows: [['`A * B`', 'multiplies matching boxes (**element-wise**). Shapes must be the same.'], ['`A @ B`', '**matrix multiplication**: rows · columns.']] } },
            { tryit: py`
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print("A * B =")
print(A * B)
print("A @ B =")
print(A @ B)
`, note: 'Top-left: 1×5 = 5 for *, but 1×5 + 2×7 = 19 for @.' },
            { trace: py`
A = [[1, 2], [3, 4]]
B = [[5, 6], [7, 8]]
star = A[0][0] * B[0][0]
at = A[0][0] * B[0][0] + A[0][1] * B[1][0]
print("top-left with *:", star)
print("top-left with @:", at)
`, title: 'Why * and @ give different top-left numbers', notes: { 3: '`*` just multiplies the two boxes in the same spot: 1 × 5 = 5.', 4: '`@` uses the whole of row 0 of A and column 0 of B: 1×5 + 2×7 = 19.' } },
            { quick: { q: 'You want to multiply each box of A with the matching box of B. Which do you use?', options: ['A @ B', 'A * B', 'A.T', 'np.eye(A)'], answer: 1, explain: '`*` multiplies matching boxes. `@` does row-times-column.' } },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['transpose (.T)', 'flip rows into columns'], ['identity (I)', 'the "do nothing" matrix, made with np.eye'], ['inverse', 'the "undo" matrix: A @ inverse = I'], ['element-wise', 'box-by-box, matching positions']] },
            { big: '.T flips, I does nothing, inverse undoes. * is box-by-box, @ is rows·columns.' },
            { tip: '**How AI uses this:** the attention trick in chatbots uses `Q @ K.T`, a transpose to make the shapes fit! You\'ll do it yourself in the checkpoint.' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'la-ops-lab',
          title: 'The matrix toolbox',
          xp: XP.code,
          numpy: true,
          task: 'Fill in each variable using NumPy.',
          steps: ['`elementwise`: multiply A and B box-by-box with `*`.', '`matrix_product`: multiply A and B with `@`.', '`A_T`: the transpose of A.', '`I`: a 2×2 identity matrix with `np.eye(2)`.', '`A_inv`: the inverse of A with `np.linalg.inv(A)`.'],
          starter: py`
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

elementwise = None      # A times B, box by box
matrix_product = None   # A @ B
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
            { name: 'element-wise product', fail: 'Use * for box-by-box', code: py`
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
assert A_inv is not None and _np.allclose(A @ A_inv, _np.eye(2)), "A @ A_inv should be the identity"
` },
          ],
          hints: ['`*` is box-by-box, `@` is matrix multiplication.', 'Transpose is `A.T`. Identity is `np.eye(2)`.', 'The inverse is `np.linalg.inv(A)`.'],
        },
      ],
    },

    // ───────────────────────────── 10. Cosine similarity ─────────────────────────────
    {
      id: 'la-cosine',
      title: 'Cosine similarity: how AI compares meanings',
      minutes: 9,
      learn: [
        {
          title: 'Words as arrows',
          blocks: [
            { big: 'AI turns every word into an arrow. Words with similar meanings point in similar directions.' },
            { analogy: 'Imagine a giant room where every word is an arrow sticking out from the middle. "cat" and "kitten" point almost the same way. "cat" and "spreadsheet" point in very different directions. To compare two words, the AI just looks at the angle between their arrows!', emoji: '🐱' },
            'These word-arrows are called **embeddings**.',
            { visual: 'embeddingMap' },
          ],
        },
        {
          title: 'Why not just use the dot product?',
          blocks: [
            'The dot product measures agreement, but it also grows when arrows are **longer**. That\'s a problem: a long arrow isn\'t "more meaningful", it\'s just longer.',
            { steps: ['[1, 1] · [1, 1] = 2.', '[10, 10] · [10, 10] = 200.', 'Same direction both times, but very different scores!'] },
            { visual: 'vectorScale', v: [1, 1], k: 3 },
            'Stretching an arrow does not change where it points. Cosine similarity ignores the length, so it gives the same score for every k above 0.',
            'We want a score that only cares about **direction**. Here comes cosine similarity!',
          ],
        },
        {
          title: 'The recipe',
          blocks: [
            'Take the dot product, then divide by both lengths. This "cancels out" the length.',
            { big: 'cosine similarity = (a · b) ÷ (length of a × length of b)' },
            { steps: ['a = [3, 4], b = [6, 8].', 'Dot product: 3×6 + 4×8 = 18 + 32 = **50**.', 'Length of a: √(9 + 16) = **5**. Length of b: √(36 + 64) = **10**.', 'Divide: 50 ÷ (5 × 10) = 50 ÷ 50 = **1**.', 'Score 1: b is just a longer copy of a. Same direction!'] },
            { trace: py`
import math

a = [3, 4]
b = [6, 8]
dot = a[0] * b[0] + a[1] * b[1]
len_a = math.sqrt(a[0] ** 2 + a[1] ** 2)
len_b = math.sqrt(b[0] ** 2 + b[1] ** 2)
score = dot / (len_a * len_b)
print(score)
`, title: 'The cosine recipe, step by step', notes: { 5: 'Step 1, the dot product: 3×6 + 4×8 = 50.', 6: 'Step 2, the length of a: √(9 + 16) = 5.', 7: 'Step 3, the length of b: √(36 + 64) = 10.', 8: 'Step 4, divide by both lengths: 50 ÷ (5 × 10) = 1. Same direction!' } },
          ],
        },
        {
          title: 'What the score means',
          blocks: [
            'Cosine similarity is always between -1 and 1:',
            { table: { head: ['Score', 'Meaning', 'Example'], rows: [['1', 'same direction', 'cat & kitten'], ['0', 'unrelated (right angle)', 'cat & spreadsheet'], ['-1', 'opposite direction', 'up & down']] } },
            { quick: { q: 'Two embeddings have a cosine similarity of 0.98. What does that suggest?', options: ['The words mean very different things', 'The words have very similar meanings', 'One word is longer', 'There is a bug'], answer: 1, explain: '0.98 is very close to 1, so the arrows point almost the same way, similar meaning.' } },
          ],
        },
        {
          title: 'In Python',
          blocks: [
            { tryit: py`
import numpy as np

a = np.array([3, 4])
b = np.array([6, 8])

dot = np.dot(a, b)
lengths = np.linalg.norm(a) * np.linalg.norm(b)
print("cosine similarity:", dot / lengths)
`, note: 'Change b to [-3, -4]. Then to [4, -3]. What scores do you get?' },
            { tryit: py`
import numpy as np

def cos_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

cat    = np.array([0.9, 0.8, 0.1])
kitten = np.array([0.8, 0.9, 0.2])
car    = np.array([0.1, -0.2, 0.9])
print("cat vs kitten:", round(cos_sim(cat, kitten), 2))
print("cat vs car:   ", round(cos_sim(cat, car), 2))
`, note: 'These are pretend mini-embeddings. Real ones have hundreds of numbers!' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { words: [['embedding', 'a vector (arrow) that represents a word, picture or sentence'], ['cosine similarity', 'dot product ÷ both lengths: a score from -1 to 1 for "same direction?"']] },
            { big: 'Same direction = similar meaning. Length doesn\'t matter.' },
            { tip: '**How AI uses this:** when you search for "funny cat videos", a search engine turns your words into an embedding and finds videos whose embeddings have the highest cosine similarity. Chatbots that "look things up" do exactly this too!' },
          ],
        },
      ],
      activities: [
        { type: 'viz', id: 'viz-cosine', title: 'Similarity playground', component: 'VectorSimilarityViz', xp: XP.viz },
        {
          type: 'code',
          id: 'la-cosine-lab',
          title: 'Build cosine similarity',
          xp: XP.code,
          numpy: true,
          task: 'Write `cosine_similarity(a, b)` that returns how similar two arrows\' directions are.',
          steps: ['Work out the dot product with `np.dot(a, b)`.', 'Work out both lengths with `np.linalg.norm(...)`.', 'Return the dot product divided by (length of a × length of b), as a `float`.'],
          starter: py`
import numpy as np


def cosine_similarity(a, b):
    # 1. dot product of a and b
    # 2. length of a, length of b
    # 3. return dot / (length_a * length_b)
    pass


print(cosine_similarity([1, 0], [1, 1]))  # about 0.707
`,
          solution: py`
import numpy as np


def cosine_similarity(a, b):
    a, b = np.array(a, dtype=float), np.array(b, dtype=float)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


print(cosine_similarity([1, 0], [1, 1]))  # about 0.707
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
            { name: 'right angle → 0', code: py`
_r = cosine_similarity([1, 0], [0, 5])
assert _r is not None and abs(_r) < 1e-6, f"got {_r!r}"
` },
            { name: '45° apart → about 0.707', fail: 'Divide by BOTH lengths multiplied together', code: py`
_r = cosine_similarity([1, 0], [1, 1])
assert _r is not None and abs(_r - 0.70710678) < 1e-4, f"got {_r!r}"
` },
          ],
          hints: ['The top of the fraction is `np.dot(a, b)`.', 'A length is `np.linalg.norm(a)`.', '`return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))`'],
        },
      ],
    },

    // ───────────────────────────── 11. Checkpoint ─────────────────────────────
    {
      id: 'la-checkpoint',
      title: 'Checkpoint: shape master',
      minutes: 8,
      checkpoint: true,
      learn: [
        {
          title: 'Look how far you came!',
          blocks: [
            { big: 'You started with a treasure map. Now you can do the math inside AI. 🎉' },
            'Let\'s do a quick warm-up of everything before the final test.',
            { table: { head: ['Idea', 'In one line'], rows: [['vector', 'a list of numbers / an arrow'], ['dot product', 'multiply pairs and add: do they agree?'], ['matrix', 'a table of numbers with a (rows, cols) shape'], ['A @ B', 'rows · columns; inside numbers must match'], ['.T', 'flip rows and columns'], ['cosine similarity', 'compare directions, ignore length']] } },
          ],
        },
        {
          title: 'Shape rule warm-up',
          blocks: [
            { big: '(m, n) @ (n, p) → (m, p)' },
            { quick: { q: '`(3, 4) @ (4, 1)` gives what shape?', options: ['(3, 1)', '(4, 4)', '(3, 4)', 'error'], answer: 0, explain: 'Inside 4s match. Outside: 3 and 1.' } },
            { tryit: py`
import numpy as np

A = np.ones((3, 4))
B = np.ones((4, 1))
print((A @ B).shape)
`, note: 'Change the shapes and predict the answer BEFORE you press Run.' },
            { trace: py`
def result_shape(a, b):
    if a[1] != b[0]:
        return "error"
    return (a[0], b[1])

print(result_shape((3, 4), (4, 1)))
print(result_shape((5, 2), (5, 2)))
`, title: 'Both warm-up questions, checked by code', notes: { 2: 'Do the inside numbers differ?', 4: 'They match, so keep the outside numbers.', 6: 'First question: (3, 4) @ (4, 1).', 7: 'Second question: (5, 2) @ (5, 2). Inside numbers 2 and 5.' } },
            { quick: { q: '`(5, 2) @ (5, 2)` …', options: ['(5, 5)', '(2, 2)', 'error: inside numbers 2 and 5 differ', '(5, 2)'], answer: 2, explain: 'The inside numbers are 2 and 5. They don\'t match! Transpose one to fix it.' } },
          ],
        },
        {
          title: 'Sneak peek: attention scores',
          blocks: [
            'Chatbots compare every word with every other word using dot products. If the words are stored as rows of a matrix Q (questions) and K (keys), all the scores at once are:',
            { big: 'scores = Q @ K.T' },
            { visual: 'matmulSteps', A: [[1, 0], [0, 1]], B: [[1, 1, 0], [0, 1, 1]], nameA: 'Q', nameB: 'K.T', story: 'Each box is one word from Q compared (dot product) with one word from K.' },
            'Why `.T`? Q has shape (n, d) and K has shape (m, d). The inside numbers d and m don\'t match... but K.T has shape (d, m). Now (n, d) @ (d, m) → (n, m): one score for every pair!',
            { tryit: py`
import numpy as np

Q = np.array([[1, 0], [0, 1]])          # 2 words, 2 numbers each
K = np.array([[1, 0], [1, 1], [0, 1]])  # 3 words, 2 numbers each
scores = Q @ K.T
print(scores)
print("shape:", scores.shape)
`, note: 'Each box is one word (row of Q) dotted with another word (row of K).' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            { big: 'Ready? Two challenges: a shapes quiz and building attention scores.' },
            { tip: 'Stuck in the lab? Check the shapes first. Writing them down on paper is what real AI engineers do too!' },
          ],
        },
      ],
      activities: [
        {
          type: 'quiz',
          id: 'la-checkpoint-quiz',
          title: 'Can these multiply?',
          xp: XP.quiz,
          questions: [
            { q: 'What is the shape of `(2, 3) @ (3, 4)`?', options: ['(3, 3)', '(2, 4)', '(4, 2)', "Can't multiply"], answer: 1, explain: 'Inner 3s match and cancel; outer 2 and 4 remain.' },
            { q: 'What is the shape of `(3, 2) @ (3, 2)`?', options: ['(3, 2)', '(2, 2)', '(3, 3)', "Can't multiply"], answer: 3, explain: 'Inner numbers are 2 and 3: no match. You would need to transpose one: (3,2) @ (2,3) → (3,3).' },
            { q: 'A word embedding `(1, 768)` goes through weights `(768, 3072)`. Output?', options: ['(768, 768)', '(1, 3072)', '(3072, 1)', "Can't multiply"], answer: 1, explain: 'Inside 768s match. That is literally a layer inside GPT-2!' },
            { q: 'A batch `(32, 10)` @ weights `(10, 1)` gives…', options: ['(32, 1)', '(10, 10)', '(32, 10)', "Can't multiply"], answer: 0, explain: 'One answer for each of the 32 examples.' },
            { q: 'If `A` has shape `(5, 3)`, what is `A.T.shape`?', options: ['(5, 3)', '(3, 5)', '(15,)', '(3, 3)'], answer: 1, explain: 'Transpose swaps rows and columns.' },
          ],
        },
        {
          type: 'code',
          id: 'la-scores',
          title: 'Attention scores',
          xp: XP.code,
          numpy: true,
          task: 'Write `scores(Q, K)` that returns every row of Q dotted with every row of K, a matrix of shape `(n, m)`.',
          steps: ['Q has shape (n, d) and K has shape (m, d). `Q @ K` won\'t fit!', 'Flip K with `.T` so it has shape (d, m).', 'Return `Q @ K.T`.'],
          starter: py`
import numpy as np


def scores(Q, K):
    # Q: (n, d), K: (m, d). Return an (n, m) matrix of dot products.
    # Hint: shapes must fit for @ ...
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
            { name: 'output shape is (n, m)', fail: 'Use Q @ K.T', code: py`
import numpy as _np
_r = scores(_np.ones((3, 4)), _np.ones((5, 4)))
assert _r is not None and _r.shape == (3, 5), f"got {None if _r is None else _r.shape}"
` },
            { name: 'each box is a query·key dot product', code: py`
import numpy as _np
_Q = _np.array([[1.0, 0.0], [0.0, 2.0]])
_K = _np.array([[3.0, 4.0], [1.0, 1.0], [0.0, -1.0]])
_r = scores(_Q, _K)
assert _np.allclose(_r, [[3, 1, 0], [8, 2, -2]]), f"got {_r!r}"
` },
          ],
          hints: ['`Q @ K` fails: (n, d) @ (m, d): the inside numbers are d and m.', 'Transpose K so it becomes (d, m).', '`return Q @ K.T`'],
        },
      ],
    },
  ],
}
