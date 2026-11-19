import { py, XP } from '../helpers.js'

// ───────────────────────────────── MODULE 4, CALCULUS ─────────────────────────────────
// Written for a curious 10–12 year-old who knows a little Python but has never seen calculus.

export default {
  id: 'calculus',
  title: 'Calculus',
  emoji: '⛰️',
  tagline: 'Slopes, gradients and the chain rule, how models learn.',
  badge: { id: 'mod-calculus', name: 'Gradient Guru', emoji: '⛰️' },
  lessons: [
    // ─── 1. Functions ────────────────────────────────────────────────────────
    {
      id: 'calc-functions',
      title: 'Functions are machines',
      minutes: 8,
      learn: [
        {
          title: 'Welcome to calculus! 👋',
          blocks: [
            { big: 'Calculus sounds scary. It is not. It is the math of **change**.' },
            'How fast is a car going right now? How steep is this hill? If I turn this knob a tiny bit, does my answer get better or worse? Those are all calculus questions.',
            'And here is the exciting part: **this is exactly how AI learns.** Every time a model like ChatGPT gets smarter during training, calculus is doing the work behind the scenes.',
            'We will start from zero. No scary symbols until we have built them up together, one small step at a time.',
            { tip: 'Take your time. If a page feels tricky, read it twice and play with the "Try it" boxes. That is how real scientists learn too.' },
          ],
        },
        {
          title: 'A function is a machine',
          blocks: [
            { analogy: 'Imagine a juice machine. You drop an apple **in**, the machine follows its **rule** (squeeze!), and apple juice comes **out**. Same apple in, same juice out, every single time.', emoji: '🧃' },
            'In math, a **function** is a machine just like that. You give it a number (the **input**), it follows a rule, and it gives you back a number (the **output**). Try one:',
            { visual: 'functionMachine', rule: 'x * 2 + 1', show: '2 × x + 1', label: 'double it, then add 1' },
            { steps: ['Pick a rule, for example: "double the number, then add 1".', 'Put in **3**. Double it: 3 × 2 = 6. Add 1: 6 + 1 = **7**.', 'Put in **10**. Double it: 20. Add 1: **21**.', 'Same input always gives the same output. Put in 3 again and you get 7 again!'] },
            { words: [['function', 'a machine that turns an input number into an output number using a rule'], ['input', 'the number you put in'], ['output', 'the number that comes out']] },
          ],
        },
        {
          title: 'Writing it down: f(x)',
          blocks: [
            'Mathematicians are lazy (in a good way!). Instead of saying "the machine that doubles and adds 1", they give the machine a short name, usually **f**.',
            'The input gets a name too, usually **x**. So we write:',
            { code: 'f(x) = 2x + 1' },
            'Read it out loud as: "f of x equals two x plus one". It means: *take x, double it, add 1*.',
            { table: { head: ['input x', 'rule', 'output f(x)'], rows: [['0', '2 × 0 + 1', '1'], ['1', '2 × 1 + 1', '3'], ['3', '2 × 3 + 1', '7'], ['10', '2 × 10 + 1', '21']] } },
            { tip: '`f(3)` just means "put 3 into the machine f". So f(3) = 7.' },
            { quick: { q: 'If `f(x) = 2x + 1`, what is `f(5)`?', options: ['7', '10', '11', '25'], answer: 2, explain: 'Double 5 to get 10, then add 1. That gives 11.' } },
          ],
        },
        {
          title: 'Functions in Python',
          blocks: [
            'Good news: you already know how to build function machines! In Python we use `def`.',
            { code: 'def f(x):\n    return 2 * x + 1' },
            { list: ['`def f(x):` means "here is a machine called f, and its input is called x".', '`return` means "this is what comes out".', 'In Python we must write `2 * x` with a star. `2x` would confuse Python.'] },
            { tryit: py`
def f(x):
    return 2 * x + 1

print(f(0))
print(f(3))
print(f(10))
`, note: 'Press Run. Then change the rule to 3 * x + 1 and run again!' },
            'Now let us slow Python right down and watch where each input goes:',
            { trace: py`
def f(x):
    return 2 * x + 1

a = f(3)
b = f(10)
print(a, b)
`, title: 'Watch the input 3 travel into the machine f and come back out as 7.', notes: {
              1: 'Python reads the recipe for the machine `f`. It does NOT run it yet.',
              2: 'This is the rule inside the machine: double x, then add 1.',
              4: 'Put 3 into the machine. Python jumps up to `f` with x = 3, works out 2 × 3 + 1, and brings back 7.',
              5: 'Same machine, new input. This time x = 10, so the answer is 21.',
              6: 'Show both answers on the screen.',
            } },
          ],
        },
        {
          title: 'Lots of different machines',
          blocks: [
            'There are many, many function machines. Here are a few famous ones:',
            { table: { head: ['Name', 'Rule', 'f(2) is…'], rows: [['add three', 'f(x) = x + 3', '5'], ['squaring', 'f(x) = x²  (x times x)', '4'], ['cubing', 'f(x) = x³  (x times x times x)', '8'], ['constant', 'f(x) = 5  (ignores x!)', '5']] } },
            'The little ² means "squared": multiply the number by itself. So 4² = 4 × 4 = 16. In Python we write it as `x ** 2`.',
            { visual: 'functionMachine', rule: 'x ** 2', show: 'x²', name: 'square', label: 'multiply x by itself', min: -5, max: 5, start: 4 },
            { tryit: py`
def square(x):
    return x ** 2

for x in [1, 2, 3, 4, 5]:
    print(x, "squared is", square(x))
`, note: 'See how the outputs grow faster and faster?' },
            { quick: { q: 'What is `3²` (three squared)?', options: ['6', '9', '5', '33'], answer: 1, explain: '3 squared means 3 × 3, which is 9.' } },
          ],
        },
        {
          title: 'Why AI cares about functions',
          blocks: [
            { big: 'An AI model is just a giant function machine.' },
            'You put in a picture, and out comes "cat" or "dog". You put in a sentence, and out comes the next word. Inside, it follows a rule built from lots of numbers.',
            { analogy: 'Think of a radio with thousands of little knobs. The knobs decide what sound comes out. Training an AI means turning the knobs until the music sounds right.', emoji: '📻' },
            'Those knobs are called **parameters** (or weights). Calculus is the tool that tells us *which way to turn each knob*. That is what this whole module builds up to!',
            { words: [['parameter', 'a knob (a number) inside a function that we are allowed to change'], ['model', 'a big function machine that an AI uses']] },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['A **function** is a machine: input → rule → output.', 'We write it like `f(x) = 2x + 1` and read it "f of x".', 'In Python: `def f(x): return 2 * x + 1`.', '`x ** 2` means x squared (x times x).', 'An AI model is a huge function with knobs called **parameters**.'] },
            'Now build two little machines of your own in the practice below. You can do this! 💪',
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-machine',
          title: 'Build two function machines',
          xp: XP.code,
          task: 'Finish the two machines: `f(x)` doubles x and adds 1, and `g(x)` squares x.',
          steps: ['Inside `f`, replace `pass` with `return 2 * x + 1`.', 'Inside `g`, replace `pass` with a line that returns x times x.', 'Press **Run**. You should see 7 and 16.', 'Press **Check**.'],
          starter: py`
# A function is a machine: x goes in, an answer comes out.

def f(x):
    # Rule: double x, then add 1.
    pass


def g(x):
    # Rule: multiply x by itself (x squared).
    pass


print(f(3))  # should print 7
print(g(4))  # should print 16
`,
          solution: py`
def f(x):
    return 2 * x + 1


def g(x):
    return x * x


print(f(3))  # should print 7
print(g(4))  # should print 16
`,
          tests: [
            { name: 'f(3) is 7', fail: 'f should double x and add 1', code: py`
_r = f(3)
assert _r == 7, f"f(3) gave {_r!r}, expected 7"
` },
            { name: 'f works for 0 and negative numbers', code: py`
assert f(0) == 1, f"f(0) gave {f(0)!r}, expected 1"
assert f(-2) == -3, f"f(-2) gave {f(-2)!r}, expected -3"
` },
            { name: 'g(4) is 16', fail: 'g should multiply x by itself', code: py`
_r = g(4)
assert _r == 16, f"g(4) gave {_r!r}, expected 16"
` },
            { name: 'g of a negative number is positive', fail: '-3 times -3 is 9', code: py`
_r = g(-3)
assert _r == 9, f"g(-3) gave {_r!r}, expected 9"
` },
          ],
          hints: [
            'Each machine needs a `return` line. That is what comes out of the machine.',
            'For f: `return 2 * x + 1`. Remember the star for multiplying!',
            'For g: `return x * x` (or `return x ** 2`).',
          ],
        },
      ],
    },

    // ─── 2. Graphs ───────────────────────────────────────────────────────────
    {
      id: 'calc-graphs',
      title: 'Graphs: drawing a function',
      minutes: 8,
      learn: [
        {
          title: 'A picture of a machine',
          blocks: [
            { big: 'A graph is a picture that shows every input and output at once.' },
            'Instead of testing the machine one number at a time, we can draw ALL its answers. Then we can *see* how it behaves: does it go up? Down? Does it curve?',
            { analogy: 'A graph is like a growth chart on your bedroom wall. Each mark shows your age (across) and your height (up). Connect the marks and you can see how you grew.', emoji: '📏' },
          ],
        },
        {
          title: 'The grid: across and up',
          blocks: [
            'A graph lives on a grid with two lines:',
            { list: ['The **x-axis** goes left ↔ right. It shows the **input**.', 'The **y-axis** goes down ↕ up. It shows the **output**.', 'Where they cross is the **origin**, the point (0, 0).'] },
            'A **point** is written as (x, y). The point (3, 7) means: walk 3 steps right, then 7 steps up, and put a dot there.',
            { visual: 'pointWalk', target: [3, 7] },
            { words: [['x-axis', 'the left-right line; it shows the input'], ['y-axis', 'the up-down line; it shows the output'], ['point (x, y)', 'a dot: go x across, then y up']] },
            { quick: { q: 'To draw the point (2, 5), you go…', options: ['5 right, 2 up', '2 right, 5 up', '2 left, 5 down', '7 right'], answer: 1, explain: 'The first number is across (x), the second number is up (y).' } },
          ],
        },
        {
          title: 'From a table to a picture',
          blocks: [
            'Let us draw `f(x) = 2x + 1`. We make a table of inputs and outputs, turn each column into a dot, and connect the dots. Press **Next** to watch it happen:',
            { visual: 'plotBuilder', rule: '2 * x + 1', show: '2x + 1', xs: [0, 1, 2, 3] },
            'The dots line up into a perfectly **straight line** going uphill!',
            { tryit: py`
def f(x):
    return 2 * x + 1

for x in [0, 1, 2, 3]:
    print("point:", (x, f(x)))
`, note: 'These are the dots we would draw.' },
            { trace: py`
def f(x):
    return 2 * x + 1

points = []
for x in [0, 1, 2]:
    y = f(x)
    points.append((x, y))
print(points)
`, title: 'Watch Python build the list of dots, one input at a time.', notes: {
              4: 'An empty list. The dots will go in here.',
              5: 'The loop hands us one input at a time: first 0, then 1, then 2.',
              6: 'Put x into the machine f. Python jumps into f and brings back the output.',
              7: 'Glue x and y together into a dot `(x, y)` and add it to the list.',
              8: 'All the dots, ready to draw!',
            } },
          ],
        },
        {
          title: 'Lines and curves',
          blocks: [
            'Some machines make straight lines. Others make **curves**.',
            'Look at the squaring machine `f(x) = x²`. Press **Next** to plot its dots:',
            { visual: 'plotBuilder', rule: 'x ** 2', show: 'x²', xs: [-3, -2, -1, 0, 1, 2, 3], xmin: -4, xmax: 4, ymin: -1, ymax: 10, unit: 30 },
            'High on both sides, lowest in the middle at 0. It looks like a smile or a valley: **U**. Mathematicians call this shape a *parabola*.',
            { tryit: py`
def f(x):
    return x ** 2

# A sideways picture: more stars = bigger output
for x in range(-3, 4):
    print(str(x).rjust(3), "*" * f(x))
`, note: 'Tilt your head to the right. See the valley shape?' },
          ],
        },
        {
          title: 'Why valleys matter for AI',
          blocks: [
            { big: 'The bottom of a valley is the best place to be.' },
            'Later we will make a function that measures *how wrong* an AI is. Big number = very wrong. Small number = nearly right.',
            'If we draw that "wrongness" as a graph, it often looks like a valley. **Training an AI means walking down to the bottom of the valley**, where the mistakes are smallest.',
            { analogy: 'Like a marble rolling around a bowl. It always ends up at the bottom. We want our AI to roll to the bottom too.', emoji: '🥣' },
            { quick: { q: 'For `f(x) = x²`, which input gives the lowest output?', options: ['x = -3', 'x = 0', 'x = 3', 'x = 100'], answer: 1, explain: '0 squared is 0, the smallest possible. Every other number squared is bigger.' } },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['A **graph** is a picture of a function.', 'x goes across (input), y goes up (output).', 'Make a table → turn it into points → connect the dots.', '`2x + 1` makes a straight line. `x²` makes a U-shaped valley.', 'AI training = rolling down to the bottom of a valley.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-table',
          title: 'Make a table of points',
          xp: XP.code,
          task: 'Write `make_table(func, xs)` that returns a list of `(x, func(x))` pairs, the points you would draw on a graph.',
          steps: ['Start with an empty list (already done for you: `table = []`).', 'Loop: `for x in xs:`', 'Inside the loop, add the pair: `table.append((x, func(x)))`.', 'After the loop, `return table` (already there).'],
          starter: py`
def f(x):
    return x * x


def make_table(func, xs):
    # For each x in xs, add the pair (x, func(x)) to the table.
    table = []
    # your loop goes here

    return table


print(make_table(f, [0, 1, 2, 3]))  # [(0, 0), (1, 1), (2, 4), (3, 9)]
`,
          solution: py`
def f(x):
    return x * x


def make_table(func, xs):
    table = []
    for x in xs:
        table.append((x, func(x)))
    return table


print(make_table(f, [0, 1, 2, 3]))  # [(0, 0), (1, 1), (2, 4), (3, 9)]
`,
          tests: [
            { name: 'table for x squared', code: py`
_r = make_table(f, [0, 1, 2, 3])
assert _r == [(0, 0), (1, 1), (2, 4), (3, 9)], f"got {_r!r}"
` },
            { name: 'works with any machine', fail: 'Use func(x), not f(x), inside make_table', code: py`
_r = make_table(lambda x: 2 * x + 1, [-1, 0, 1])
assert _r == [(-1, -1), (0, 1), (1, 3)], f"got {_r!r}"
` },
            { name: 'pairs are in the same order as xs', code: py`
_r = make_table(f, [3, 1])
assert _r == [(3, 9), (1, 1)], f"got {_r!r}"
` },
          ],
          hints: [
            'You need a `for` loop that visits every x in `xs`.',
            'A pair in Python is written with brackets: `(x, func(x))`.',
            'Inside the loop: `table.append((x, func(x)))`. Notice the double brackets!',
          ],
        },
      ],
    },

    // ─── 3. Slope of a straight line ─────────────────────────────────────────
    {
      id: 'calc-slope',
      title: 'Slope: how steep is it?',
      minutes: 8,
      learn: [
        {
          title: 'Steepness',
          blocks: [
            { analogy: 'Think of skateboard ramps. A gentle ramp is easy to roll up. A super steep ramp is scary! A flat floor is not a ramp at all.', emoji: '🛹' },
            'In math, the word for steepness is **slope**. It is just a number that tells you how steep a line is.',
            { list: ['Big slope → very steep.', 'Small slope → gentle.', 'Slope of 0 → perfectly flat.'] },
            { words: [['slope', 'a number that says how steep a line is']] },
          ],
        },
        {
          title: 'Rise over run',
          blocks: [
            { big: 'Slope = how much you go **up**, divided by how much you go **across**.' },
            'The going-up part is called the **rise**. The going-across part is called the **run**. So:',
            { code: 'slope = rise / run' },
            { steps: ['Imagine a staircase. Each step goes 2 across and 1 up.', 'Rise = 1, run = 2.', 'Slope = 1 ÷ 2 = **0.5**. A gentle staircase.', 'Another staircase goes 1 across and 3 up. Slope = 3 ÷ 1 = **3**. Much steeper!'] },
            { visual: 'slopeLine', a: [1, 1], b: [3, 2] },
            { words: [['rise', 'how much you go up (or down)'], ['run', 'how much you go across']] },
          ],
        },
        {
          title: 'Slope from two points',
          blocks: [
            'If you know two points on a line, you can find its slope.',
            'Take two points from our old friend `f(x) = 2x + 1`: **(1, 3)** and **(3, 7)**.',
            { steps: ['Rise: how much did y change? 7 − 3 = **4**.', 'Run: how much did x change? 3 − 1 = **2**.', 'Slope = rise ÷ run = 4 ÷ 2 = **2**.'] },
            'So the line goes up 2 for every 1 step across. Look back at the rule `2x + 1`. There is the 2! The number in front of x *is* the slope.',
            { code: 'slope = (y2 - y1) / (x2 - x1)' },
            { tryit: py`
x1, y1 = 1, 3
x2, y2 = 3, 7

rise = y2 - y1
run = x2 - x1
print("rise:", rise, " run:", run, " slope:", rise / run)
`, note: 'Try the points (0, 1) and (2, 5). Same slope?' },
            { trace: py`
def slope(x1, y1, x2, y2):
    rise = y2 - y1
    run = x2 - x1
    return rise / run

s = slope(1, 3, 3, 7)
print("slope is", s)
`, title: 'Follow the two points into the slope function.', notes: {
              6: 'We hand the function two points: (1, 3) and (3, 7). Python jumps into `slope` with x1 = 1, y1 = 3, x2 = 3, y2 = 7.',
              2: 'Rise: how much did y go up? 7 − 3 = 4.',
              3: 'Run: how much did x go across? 3 − 1 = 2.',
              4: 'Divide rise by run: 4 ÷ 2 = 2.0, and send it back.',
              7: 'The answer 2.0 came back and was stored in `s`.',
            } },
          ],
        },
        {
          title: 'Uphill, downhill, flat',
          blocks: [
            'Slopes can be positive, negative or zero. Read the line from left to right like a sentence:',
            { table: { head: ['Slope', 'What the line does', 'Example'], rows: [['positive (like 2)', 'goes **uphill** ↗', 'f(x) = 2x'], ['negative (like -2)', 'goes **downhill** ↘', 'f(x) = -2x'], ['zero', 'perfectly **flat** →', 'f(x) = 5']] } },
            { tryit: py`
def slope(x1, y1, x2, y2):
    return (y2 - y1) / (x2 - x1)

print("uphill:", slope(0, 0, 1, 2))
print("downhill:", slope(0, 4, 2, 0))
print("flat:", slope(0, 5, 3, 5))
`, note: 'Make up your own two points and see which kind of slope you get.' },
            { visual: 'slopeLine', a: [1, 2], b: [4, 5], goal: -2 },
            { quick: { q: 'A line goes from (0, 6) to (3, 0). Is its slope…', options: ['positive (uphill)', 'negative (downhill)', 'zero (flat)'], answer: 1, explain: 'y went DOWN from 6 to 0 while x went right. Rise = -6, run = 3, slope = -2. Downhill!' } },
          ],
        },
        {
          title: 'Why slope matters for AI',
          blocks: [
            'Remember the valley of mistakes? Imagine standing somewhere on it.',
            { list: ['If the ground slopes **downhill to the right**, take a step right.', 'If it slopes **downhill to the left**, take a step left.', 'If it is **flat**, you might already be at the bottom!'] },
            { big: 'The slope tells the AI which way to step. That is the whole secret.' },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['**Slope** = steepness = rise ÷ run.', 'From two points: `(y2 - y1) / (x2 - x1)`.', 'Positive = uphill, negative = downhill, zero = flat.', 'In `f(x) = 2x + 1`, the slope is the 2 in front of x.', 'Slope tells us which way is downhill, super useful for AI.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-slope-lab',
          title: 'Slope calculator',
          xp: XP.code,
          task: 'Write `slope(x1, y1, x2, y2)` that returns rise ÷ run for the line through two points.',
          steps: ['Work out `rise = y2 - y1`.', 'Work out `run = x2 - x1`.', 'Return `rise / run`.'],
          starter: py`
def slope(x1, y1, x2, y2):
    # rise = how much y changes  (y2 - y1)
    # run  = how much x changes  (x2 - x1)
    # slope = rise / run
    pass


print(slope(0, 0, 2, 4))  # should print 2.0
`,
          solution: py`
def slope(x1, y1, x2, y2):
    rise = y2 - y1
    run = x2 - x1
    return rise / run


print(slope(0, 0, 2, 4))  # should print 2.0
`,
          tests: [
            { name: 'uphill line', code: py`
_r = slope(0, 0, 2, 4)
assert _r == 2, f"expected 2, got {_r!r}"
` },
            { name: 'downhill line', fail: 'When y goes down, the slope is negative', code: py`
_r = slope(1, 5, 3, 1)
assert _r == -2, f"expected -2, got {_r!r}"
` },
            { name: 'flat line', code: py`
_r = slope(0, 3, 5, 3)
assert _r == 0, f"expected 0, got {_r!r}"
` },
            { name: 'rise goes on top', fail: 'Divide the y change by the x change, not the other way round', code: py`
_r = slope(0, 0, 4, 1)
assert _r == 0.25, f"expected 0.25, got {_r!r}"
` },
          ],
          hints: [
            'Rise is the change in y. Run is the change in x.',
            '`rise = y2 - y1` and `run = x2 - x1`.',
            'Finally: `return rise / run`.',
          ],
        },
      ],
    },

    // ─── 4. Derivatives ──────────────────────────────────────────────────────
    {
      id: 'calc-derivative',
      title: 'Derivatives: the slope of a curve',
      minutes: 10,
      learn: [
        {
          title: 'Curves keep changing',
          blocks: [
            'A straight line has the same slope everywhere. Easy!',
            'But a curve like the valley `x²` is different. Near the bottom it is almost flat. Up the sides it gets steeper and steeper.',
            { big: 'So on a curve, the slope depends on **where you are standing**.' },
            { analogy: 'Walking over a round hill: at the start you climb steeply, at the very top it feels flat, then you walk steeply downhill. The steepness changes with every step.', emoji: '⛰️' },
          ],
        },
        {
          title: 'Zoom in, zoom in, zoom in…',
          blocks: [
            'Here is a magic trick. Take any smooth curve and zoom in on one spot. Zoom more. And more.',
            'Eventually that tiny piece of curve looks like a **straight line**!',
            { analogy: 'The Earth is round, but when you stand in a field it looks flat. You are "zoomed in" so much that the curve looks straight.', emoji: '🌍' },
            'And we already know how to find the slope of a straight line. So: zoom in on a curve, then use rise ÷ run on that tiny straight piece. Try it on the valley `x²`:',
            { visual: 'tangentZoom', rule: 'x ** 2', show: 'x²', d: '2 * x', dShow: '2x', x0: 1 },
          ],
        },
        {
          title: 'The derivative',
          blocks: [
            'The slope of a curve at one exact spot has a special name: the **derivative**.',
            { words: [['derivative', 'the slope of a curve at one exact point, how fast the output changes when you nudge the input']] },
            { analogy: 'A car speedometer! Your position changes over time. The speedometer tells you how fast it is changing *right now*. That "right now" speed is a derivative.', emoji: '🚗' },
            "We write the derivative of f with a little dash: **f′(x)**. Read it as \"f prime of x\".",
            { quick: { q: 'A derivative tells you…', options: ['the biggest output', 'the slope at one exact spot', 'the input that gives zero', 'how many points are on the graph'], answer: 1, explain: 'A derivative is the steepness (slope) right at one point on the curve.' } },
          ],
        },
        {
          title: 'Finding it with a tiny nudge',
          blocks: [
            'Computers can find a derivative with a simple trick: **nudge** the input a tiny bit and see how much the output moves.',
            'Let us find the slope of `f(x) = x²` at x = 3.',
            { steps: ['Pick a tiny nudge, h = 0.001.', 'f(3) = 9.', 'f(3.001) = 9.006001.', 'Rise = 9.006001 − 9 = 0.006001. Run = 0.001.', 'Slope ≈ 0.006001 ÷ 0.001 ≈ **6.001**. Very close to **6**!'] },
            { tryit: py`
def f(x):
    return x ** 2

x = 3
h = 0.001
slope = (f(x + h) - f(x)) / h
print("slope at x = 3 is about", slope)
`, note: 'Make h even smaller (0.000001). Does the answer get closer to 6?' },
            { trace: py`
def f(x):
    return x ** 2

x = 3
h = 0.001
rise = f(x + h) - f(x)
slope = rise / h
print(round(slope, 3))
`, title: 'Watch the nudge: Python calls the machine f twice.', notes: {
              4: 'The spot where we want the slope.',
              5: 'Our tiny nudge.',
              6: 'This line needs f TWICE. First f(3.001), then f(3). Watch Python jump into f for each one, then subtract.',
              7: 'Rise ÷ run. The run is the nudge h.',
              8: 'About 6. That is the slope of x² at x = 3!',
            } },
          ],
        },
        {
          title: 'An even better nudge',
          blocks: [
            'A clever improvement: nudge a tiny bit to the **right** AND a tiny bit to the **left**, and measure between them. This is more accurate.',
            { code: "f′(x) ≈ (f(x + h) - f(x - h)) / (2h)" },
            'Why 2h? Because the distance from (x − h) to (x + h) is two nudges wide. That is the "run".',
            { tryit: py`
def f(x):
    return x ** 2

def derivative(func, x, h=0.00001):
    return (func(x + h) - func(x - h)) / (2 * h)

for x in [0, 1, 2, 3]:
    print("slope of x squared at", x, "is", round(derivative(f, x), 4))
`, note: 'Notice a pattern? The slope is always 2 times x!' },
            { trace: py`
def f(x):
    return x ** 2

def derivative(func, x, h=0.001):
    right = func(x + h)
    left = func(x - h)
    return (right - left) / (2 * h)

answer = derivative(f, 3)
print(round(answer, 3))
`, title: 'Follow derivative(f, 3) all the way to the answer.', notes: {
              9: 'We hand the machine `f` itself to `derivative`, plus x = 3. Python jumps into `derivative`.',
              5: 'A tiny step to the RIGHT of 3: Python jumps into f(3.001).',
              6: 'A tiny step to the LEFT of 3: Python jumps into f(2.999).',
              7: 'Rise (right − left) divided by run (two nudges wide). Send the answer back.',
              10: 'The slope at x = 3 is 6.',
            } },
          ],
        },
        {
          title: 'Why this matters for AI',
          blocks: [
            { big: 'The derivative tells an AI: "if you turn this knob a tiny bit, how much does your mistake change?"' },
            { list: ['Derivative is **positive** → turning the knob up makes things worse. Turn it down!', 'Derivative is **negative** → turning it up makes things better. Turn it up!', 'Derivative is **zero** → you are at a flat spot, maybe the best one.'] },
            { quick: { q: 'At the very bottom of the valley `x²` (x = 0), the derivative is…', options: ['very big', '0 (flat)', 'negative', 'impossible to know'], answer: 1, explain: 'The bottom of a valley is flat, so its slope is 0.' } },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['On a curve, the slope changes from spot to spot.', 'Zoom in close and any smooth curve looks straight.', 'The **derivative** f′(x) is the slope at one exact spot.', 'Computers estimate it by nudging: `(f(x + h) - f(x - h)) / (2 * h)`.', 'For `x²` the derivative is `2x`.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-deriv',
          title: 'Numerical derivative',
          xp: XP.code,
          task: 'Write `derivative(func, x, h=1e-5)` that estimates the slope of any function at x using the left-and-right nudge.',
          steps: ['Find the output a tiny bit to the right: `func(x + h)`.', 'Find the output a tiny bit to the left: `func(x - h)`.', 'Subtract them, then divide by `2 * h`.', 'Return that number.'],
          starter: py`
def f(x):
    return x ** 2 + 3 * x


def derivative(func, x, h=1e-5):
    # Nudge right: func(x + h)
    # Nudge left:  func(x - h)
    # Slope = (right - left) / (2 * h)
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
assert _r is not None and abs(_r - 7) < 1e-3, f"got {_r!r}, expected about 7"
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

    // ─── 5. Derivative rules ─────────────────────────────────────────────────
    {
      id: 'calc-rules',
      title: 'Handy derivative shortcuts',
      minutes: 9,
      learn: [
        {
          title: 'Shortcuts save time',
          blocks: [
            'Nudging works for any function, but mathematicians found **shortcuts** for common ones. Like knowing your times tables instead of counting on your fingers.',
            'We will learn four. For each one, we will *check it* with the nudge trick so you know it is not magic.',
            { words: [['rule', 'a shortcut for finding a derivative without nudging']] },
          ],
        },
        {
          title: 'Rule 1: flat things have slope 0',
          blocks: [
            'The function `f(x) = 5` ignores x and always gives 5. Its graph is a flat line.',
            { big: 'A constant never changes, so its derivative is **0**.' },
            { analogy: 'A parked car. Its position never changes, so its speed is 0.', emoji: '🅿️' },
            { tryit: py`
def f(x):
    return 5

def derivative(func, x, h=0.00001):
    return (func(x + h) - func(x - h)) / (2 * h)

print(derivative(f, 1), derivative(f, 100))
`, note: 'Zero everywhere!' },
          ],
        },
        {
          title: 'Rule 2: straight lines',
          blocks: [
            'For a straight line like `f(x) = 3x`, the slope is the number in front of x. It is the same everywhere.',
            { table: { head: ['Function', 'Derivative'], rows: [['3x', '3'], ['-2x', '-2'], ['x', '1'], ['7x + 4', '7  (the +4 is a constant → 0)']] } },
            { quick: { q: 'What is the derivative of `f(x) = 10x`?', options: ['x', '10', '0', '10x'], answer: 1, explain: 'A straight line 10x goes up 10 for every 1 across. Its slope is always 10.' } },
          ],
        },
        {
          title: 'Rule 3: the power rule',
          blocks: [
            'Remember: the slope of `x²` came out as `2x`. Here is the pattern for any power:',
            { big: 'Bring the power down in front, then take 1 away from the power.' },
            { code: 'x²  →  2x¹ = 2x\nx³  →  3x²\nx⁴  →  4x³' },
            { steps: ['Start with x³. The power is 3.', 'Bring the 3 down in front: 3 · x', 'Take 1 off the power: 3 − 1 = 2.', 'Result: **3x²**. At x = 2 that is 3 × 4 = **12**.'] },
            { visual: 'powerRule', start: 1 },
            { tryit: py`
def derivative(func, x, h=0.00001):
    return (func(x + h) - func(x - h)) / (2 * h)

x = 2
print("nudge says:", round(derivative(lambda t: t ** 3, x), 4))
print("power rule says:", 3 * x ** 2)
`, note: 'Both agree! Try t ** 4 and the rule 4 * x ** 3.' },
            { trace: py`
def rule(x):
    return 3 * x ** 2

def nudge(x, h=0.0001):
    return ((x + h) ** 3 - (x - h) ** 3) / (2 * h)

x = 2
print("rule says:", rule(x))
print("nudge says:", round(nudge(x), 3))
`, title: 'Two ways to get the slope of x³ at x = 2. Do they agree?', notes: {
              1: 'The shortcut for x³: bring the 3 down, take 1 off the power, giving 3x².',
              4: 'The nudge trick, written just for x³.',
              8: 'Jump into `rule` with x = 2: 3 × 2² = 3 × 4 = 12.',
              9: 'Jump into `nudge` with x = 2. It comes back as about 12 too!',
            } },
          ],
        },
        {
          title: 'Rule 4: add the pieces',
          blocks: [
            'If a function is made of pieces added together, find the slope of each piece and **add them up**.',
            { steps: ['f(x) = x² + 3x + 5', 'Slope of x² is 2x.', 'Slope of 3x is 3.', 'Slope of 5 is 0.', 'Total: f′(x) = **2x + 3**. At x = 2: 2 × 2 + 3 = **7**.'] },
            { visual: 'powerRule', start: 4 },
            { tryit: py`
def f(x):
    return x ** 2 + 3 * x + 5

def derivative(func, x, h=0.00001):
    return (func(x + h) - func(x - h)) / (2 * h)

for x in [0, 1, 2]:
    print("x =", x, " nudge:", round(derivative(f, x), 4), " rule 2x + 3:", 2 * x + 3)
`, note: 'The shortcut and the nudge match every time.' },
            { quick: { q: 'What is the derivative of `x² + 4x`?', options: ['2x + 4', 'x + 4', '2x', '4x²'], answer: 0, explain: 'x² gives 2x, 4x gives 4. Add them: 2x + 4.' } },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { table: { head: ['Function', 'Derivative', 'Why'], rows: [['5 (constant)', '0', 'never changes'], ['3x', '3', 'straight line'], ['xⁿ', 'n · xⁿ⁻¹', 'power rule'], ['a + b', "a′ + b′", 'add the pieces']] } },
            'You can always double-check a rule with the nudge trick. AI libraries like PyTorch use rules like these (millions of times a second!) to find derivatives exactly.',
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-rules-lab',
          title: 'Use the shortcuts',
          xp: XP.code,
          task: 'Write `power_rule(n, x)` (the slope of xⁿ at x) and `slope_of_my_curve(x)` for the curve `f(x) = x² + 3x + 5`.',
          steps: ['In `power_rule`, return `n * x ** (n - 1)`.', 'For `slope_of_my_curve`, add up the pieces: x² gives `2 * x`, 3x gives `3`, 5 gives `0`.', 'Return `2 * x + 3`.', 'Run, then Check.'],
          starter: py`
def power_rule(n, x):
    # The slope of x**n is: n times x to the power (n - 1)
    pass


def slope_of_my_curve(x):
    # My curve is f(x) = x**2 + 3*x + 5
    # Pieces: x**2 -> 2*x,   3*x -> 3,   5 -> 0.  Add them up!
    pass


print(power_rule(3, 2))       # 12
print(slope_of_my_curve(2))   # 7
`,
          solution: py`
def power_rule(n, x):
    return n * x ** (n - 1)


def slope_of_my_curve(x):
    return 2 * x + 3


print(power_rule(3, 2))       # 12
print(slope_of_my_curve(2))   # 7
`,
          tests: [
            { name: 'power rule for x squared', code: py`
_r = power_rule(2, 3)
assert _r == 6, f"slope of x**2 at 3 should be 6, got {_r!r}"
` },
            { name: 'power rule for x cubed', fail: 'Bring the power down, then lower the power by 1', code: py`
_r = power_rule(3, 2)
assert _r == 12, f"slope of x**3 at 2 should be 12, got {_r!r}"
` },
            { name: 'slope of my curve', code: py`
assert slope_of_my_curve(0) == 3, f"at 0 expected 3, got {slope_of_my_curve(0)!r}"
assert slope_of_my_curve(2) == 7, f"at 2 expected 7, got {slope_of_my_curve(2)!r}"
` },
            { name: 'matches the nudge trick', code: py`
_f = lambda t: t ** 2 + 3 * t + 5
_num = (_f(1.5 + 1e-5) - _f(1.5 - 1e-5)) / 2e-5
_r = slope_of_my_curve(1.5)
assert _r is not None and abs(_r - _num) < 1e-4, f"got {_r!r}, nudging says {_num:.3f}"
` },
          ],
          hints: [
            'Power rule in words: bring the power n down in front, and the new power is n − 1.',
            'In Python: `return n * x ** (n - 1)`.',
            'For the curve: `return 2 * x + 3`.',
          ],
        },
      ],
    },

    // ─── 6. Chain rule ───────────────────────────────────────────────────────
    {
      id: 'calc-chain',
      title: 'Chain rule = backprop',
      minutes: 10,
      learn: [
        {
          title: 'Machines inside machines',
          blocks: [
            'What happens if you plug one machine into another? The output of the first becomes the input of the second.',
            { steps: ['Machine g: multiply by 3. Put in 2 → out comes 6.', 'Machine f: square it. Put in 6 → out comes 36.', 'Together: 2 → **g** → 6 → **f** → 36.'] },
            'We write this as `f(g(x))`: "f of g of x". Read it inside-out: g happens first.',
            { tryit: py`
def g(x):
    return 3 * x

def f(z):
    return z ** 2

x = 2
z = g(x)
y = f(z)
print("x =", x, "-> z =", z, "-> y =", y)
`, note: 'Try x = 1 and x = 5.' },
            { trace: py`
def g(x):
    return 3 * x

def f(z):
    return z ** 2

y = f(g(2))
print(y)
`, title: 'f(g(2)): watch which machine runs first.', notes: {
              7: 'Read it inside-out! Python must finish g(2) first, then hands that answer to f.',
              2: 'Machine g: 3 × 2 = 6.',
              5: 'Machine f gets the 6 from g: 6² = 36.',
              8: 'The chain turned 2 into 36.',
            } },
          ],
        },
        {
          title: 'Gears that turn gears',
          blocks: [
            { analogy: 'Three gears in a row. Turn gear A once and gear B turns 3 times. Each turn of gear B makes gear C turn 2 times. So one turn of A makes C turn 3 × 2 = **6** times.', emoji: '⚙️' },
            { big: 'To find how much the end changes, **multiply** how much each step changes.' },
            'That is the **chain rule**. It is the most important idea in all of AI training.',
            { words: [['chain rule', 'to get the slope through a chain of machines, multiply the slopes of each step']] },
          ],
        },
        {
          title: 'The chain rule with numbers',
          blocks: [
            'Let us use our chain: `z = 3x`, then `y = z²`. How fast does y change when x changes? Let us find it at x = 2.',
            { steps: ['Forward: z = 3 × 2 = 6, and y = 6² = 36.', 'Slope of step 1 (z = 3x): **3**.', 'Slope of step 2 (y = z²): 2z = 2 × 6 = **12**.', 'Multiply them: 3 × 12 = **36**.', 'So nudging x a tiny bit makes y change about 36 times as much!'] },
            { visual: 'chainGears', x0: 2 },
            { tryit: py`
def chain(x):
    return (3 * x) ** 2

h = 0.00001
nudge = (chain(2 + h) - chain(2 - h)) / (2 * h)
print("nudge says:", round(nudge, 3))
print("chain rule says:", 3 * (2 * 6))
`, note: 'Both say 36. The chain rule works!' },
            { quick: { q: 'Step 1 has slope 4 and step 2 has slope 5. What is the slope of the whole chain?', options: ['9', '20', '1', '45'], answer: 1, explain: 'Chain rule: multiply the slopes. 4 × 5 = 20.' } },
          ],
        },
        {
          title: 'Backprop: going backward',
          blocks: [
            'A neural network is a very long chain of machines (called **layers**). The input goes forward through every layer to make a prediction. That is the **forward pass**.',
            'Then to learn, the AI asks: "How much did *each* knob cause my mistake?" It starts at the end and works **backward**, multiplying slopes as it goes. That is **backpropagation** (backprop for short).',
            { analogy: 'Like dominoes falling in reverse. The last domino tells the one before it, which tells the one before that… each passing the message back.', emoji: '🁫' },
            { words: [['forward pass', 'running the input through all the layers to get an answer'], ['backpropagation', 'going backward through the layers, using the chain rule, to find each knob\'s slope'], ['layer', 'one machine in the chain of a neural network']] },
          ],
        },
        {
          title: 'Why backward?',
          blocks: [
            'To find the slope for an early step, you need the slope of everything *after* it (remember: multiply along the chain).',
            'So it is easiest to start at the end, where we already know the mistake, and carry the multiplied slope backward one step at a time.',
            { tryit: py`
# Chain: z = w * x, then y = z ** 2.   The knob is w.
x, w = 2, 3
z = w * x          # forward step 1
y = z ** 2         # forward step 2

dy_dz = 2 * z      # backward: slope of step 2 first
dz_dw = x          # then slope of step 1 (w * x, changing w)
dy_dw = dy_dz * dz_dw
print("y =", y, " slope for knob w =", dy_dw)
`, note: 'Change w to 1. How does the slope change?' },
            { trace: py`
def forward(x, w):
    z = w * x
    y = z ** 2
    return z, y

def backward(x, z):
    dy_dz = 2 * z
    dz_dw = x
    return dy_dz * dz_dw

z, y = forward(2, 3)
slope_w = backward(2, z)
print("y =", y, " slope for w =", slope_w)
`, title: 'Forward pass, then backward pass, one line at a time.', notes: {
              11: 'FORWARD: push x = 2 through the chain using the knob w = 3.',
              2: 'Step 1 of the chain: z = 3 × 2 = 6.',
              3: 'Step 2 of the chain: y = 6² = 36.',
              12: 'BACKWARD: now start from the end and work back to the knob w.',
              7: 'Slope of the LAST step first: y = z² has slope 2z = 12.',
              8: 'Then the step before it: z = w × x has slope x = 2 (for the knob w).',
              9: 'Chain rule: multiply them. 12 × 2 = 24.',
              13: 'Turning knob w a tiny bit changes y about 24 times as much.',
            } },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['Machines can be chained: `f(g(x))`.', '**Chain rule**: multiply the slope of each step.', 'Forward pass = compute the answer. Backward pass = compute the slopes.', '**Backprop** goes backward because each slope needs the ones after it.', 'This is exactly how neural networks learn!'] },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-chain-lab',
          title: 'Backprop by hand',
          xp: XP.code,
          task: 'For `z = w * x` and `y = z ** 2`, fill in the backward pass to get how fast y changes when you turn the knob w.',
          steps: ['`dy_dz` is the slope of `z ** 2` with respect to z: that is `2 * z`.', '`dz_dw` is the slope of `w * x` when you change w: that is just `x`.', 'Chain rule: `dy_dw = dy_dz * dz_dw`.'],
          starter: py`
def forward_backward(x, w):
    # Forward pass
    z = w * x
    y = z ** 2

    # Backward pass (chain rule)
    dy_dz = None   # slope of z**2 with respect to z
    dz_dw = None   # slope of w*x with respect to w
    dy_dw = None   # multiply them together

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
            { name: 'slope for the knob w', fail: 'dy/dw = (2z) * x', code: py`
_y, _g = forward_backward(2, 3)
assert _g == 24, f"expected 24, got {_g!r}"
` },
            { name: 'matches a nudge check', code: py`
_x, _w, _h = 1.5, -0.7, 1e-6
_num = ((_w + _h) * _x) ** 2 - ((_w - _h) * _x) ** 2
_num /= 2 * _h
_y, _g = forward_backward(_x, _w)
assert _g is not None and abs(_g - _num) < 1e-4, f"got {_g!r}, nudging says {_num:.4f}"
` },
          ],
          hints: [
            'The slope of z² (with respect to z) is 2z, the power rule!',
            'The slope of w·x when you change w is just x.',
            'Chain rule: `dy_dw = dy_dz * dz_dw`.',
          ],
        },
      ],
    },

    // ─── 7. Loss ─────────────────────────────────────────────────────────────
    {
      id: 'calc-loss',
      title: 'Loss: how wrong am I?',
      minutes: 8,
      learn: [
        {
          title: 'Guess and check',
          blocks: [
            'An AI makes a guess called a **prediction**. Then we compare it to the right answer, called the **target**.',
            { analogy: 'Throwing darts. The bullseye is the target. Where your dart lands is your prediction. The distance between them is how wrong you were.', emoji: '🎯' },
            { words: [['prediction', 'the answer the AI guesses'], ['target', 'the correct answer'], ['error', 'prediction minus target: how far off the guess was']] },
          ],
        },
        {
          title: 'Measuring the miss',
          blocks: [
            'The simplest way: subtract. **error = prediction − target**.',
            { table: { head: ['prediction', 'target', 'error'], rows: [['5', '3', '2  (too high)'], ['1', '3', '-2  (too low)'], ['3', '3', '0  (perfect!)']] } },
            'Problem: missing by +2 and missing by −2 are equally bad. But if we add +2 and −2 we get 0, which looks perfect. Oops!',
          ],
        },
        {
          title: 'Square it!',
          blocks: [
            { big: 'Squaring the error makes every miss positive. And big misses count extra.' },
            { table: { head: ['error', 'squared error'], rows: [['2', '4'], ['-2', '4'], ['0', '0'], ['10', '100  (ouch!)']] } },
            'This is called the **squared error**. It is never negative, and it is 0 only when the guess is perfect.',
            { tryit: py`
def squared_error(prediction, target):
    return (prediction - target) ** 2

print(squared_error(5, 3))
print(squared_error(1, 3))
print(squared_error(3, 3))
`, note: 'Try a prediction of 13 with a target of 3.' },
          ],
        },
        {
          title: 'The average miss: MSE',
          blocks: [
            'An AI makes many predictions. To get one score, we take the **average** of all the squared errors. This is called the **mean squared error**, or **MSE**.',
            { steps: ['Predictions: [2, 4]. Targets: [3, 4].', 'Squared errors: (2 − 3)² = 1, and (4 − 4)² = 0.', 'Average: (1 + 0) ÷ 2 = **0.5**.'] },
            { words: [['loss', 'one number that says how wrong the AI is overall, smaller is better'], ['mean', 'the average: add them up, divide by how many'], ['MSE', 'mean squared error, a very common loss']] },
            { tryit: py`
preds = [2, 4, 7]
targets = [3, 4, 5]

total = 0
for p, t in zip(preds, targets):
    total += (p - t) ** 2
print("MSE =", total / len(preds))
`, note: 'Change preds to exactly match targets. What is the MSE now?' },
            { trace: py`
preds = [2, 4]
targets = [3, 4]
total = 0
for p, t in zip(preds, targets):
    error = p - t
    total = total + error ** 2
mse = total / len(preds)
print("MSE =", mse)
`, title: 'Watch each guess get scored, then averaged.', notes: {
              4: 'zip pairs each guess with its right answer: first (2, 3), then (4, 4).',
              5: 'How far off was this guess?',
              6: 'Square the miss (so it is never negative) and add it to the running total.',
              7: 'Divide by how many guesses there were: the average.',
            } },
          ],
        },
        {
          title: 'Loss is the valley',
          blocks: [
            'Here is where everything connects! Say the AI has one knob, w, and predicts `w * x`. Try different w values and draw the loss:',
            { tryit: py`
xs = [1, 2, 3]
ys = [2, 4, 6]   # the right answer is y = 2 * x

for w in [0, 1, 2, 3, 4]:
    loss = sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)
    print("w =", w, " loss =", round(loss, 2), " ", "#" * int(loss))
`, note: 'Look at the shape of the # bars. A valley!' },
            'The loss is lowest at w = 2, the perfect knob setting. **Training = finding the bottom of the loss valley.** And the derivative tells us which way is downhill. See it for yourself:',
            { visual: 'lossPlayground', points: [[1, 2], [2, 4], [3, 6]], w0: 0.5 },
            { quick: { q: 'Which loss is better?', options: ['0.1', '25', 'They are equally good', 'Bigger is always better'], answer: 0, explain: 'Loss measures wrongness, so smaller is better. 0.1 is much closer to perfect.' } },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['**Error** = prediction − target.', '**Squared error** = error², always positive.', '**MSE** = the average of the squared errors.', 'A **loss** is one number for "how wrong". Smaller = better.', 'Plotting loss against a knob makes a valley. Training rolls to the bottom.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-loss-lab',
          title: 'Score the mistakes',
          xp: XP.code,
          task: 'Write `squared_error(prediction, target)` and `mse(predictions, targets)`.',
          steps: ['In `squared_error`, return `(prediction - target) ** 2`.', 'In `mse`, add up the squared error for each pair (use `zip`).', 'Divide the total by how many there are, `len(predictions)`, and return it.'],
          starter: py`
def squared_error(prediction, target):
    # How far off? Subtract, then square it.
    pass


def mse(predictions, targets):
    # Mean squared error: the AVERAGE of the squared errors.
    total = 0
    # loop over pairs with zip(predictions, targets) and add up squared errors

    pass


print(squared_error(5, 3))      # 4
print(mse([2, 4], [3, 4]))      # 0.5
`,
          solution: py`
def squared_error(prediction, target):
    return (prediction - target) ** 2


def mse(predictions, targets):
    total = 0
    for p, t in zip(predictions, targets):
        total += squared_error(p, t)
    return total / len(predictions)


print(squared_error(5, 3))      # 4
print(mse([2, 4], [3, 4]))      # 0.5
`,
          tests: [
            { name: 'squared error of a miss', code: py`
_r = squared_error(5, 3)
assert _r == 4, f"expected 4, got {_r!r}"
` },
            { name: 'missing low is never negative', fail: 'Square the difference so it is always positive', code: py`
_r = squared_error(3, 5)
assert _r == 4, f"expected 4, got {_r!r}"
` },
            { name: 'MSE averages the squared errors', code: py`
_r = mse([2, 4], [3, 4])
assert _r == 0.5, f"expected 0.5, got {_r!r}"
` },
            { name: 'perfect guesses give 0 loss', code: py`
_r = mse([1, 2, 3], [1, 2, 3])
assert _r == 0, f"expected 0, got {_r!r}"
` },
          ],
          hints: [
            'For squared_error: subtract target from prediction, then `** 2`.',
            'In mse: `for p, t in zip(predictions, targets):` then `total += squared_error(p, t)`.',
            'After the loop: `return total / len(predictions)`.',
          ],
        },
      ],
    },

    // ─── 8. Gradients ────────────────────────────────────────────────────────
    {
      id: 'calc-gradients',
      title: 'Partial derivatives & gradients',
      minutes: 9,
      learn: [
        {
          title: 'More than one knob',
          blocks: [
            'Real AIs do not have one knob. They have millions! Let us start with just two: **w** and **b**.',
            { analogy: 'A big hill on a map. You can walk east-west OR north-south. The ground might slope steeply one way and gently the other way.', emoji: '🗺️' },
            'So now we need a slope for *each* direction. One for w, and one for b.',
          ],
        },
        {
          title: 'Partial derivatives: freeze the others',
          blocks: [
            'A **partial derivative** asks: "If I wiggle ONLY this one knob, and keep every other knob frozen still, how fast does the output change?"',
            { words: [['partial derivative', 'the slope when you change just one input and freeze all the others']] },
            'Example loss: `L(w, b) = (w - 2)² + (b + 1)²`.',
            { steps: ['Freeze b. Only (w − 2)² changes when w moves. Its slope is **2(w − 2)**.', 'Freeze w. Only (b + 1)² changes when b moves. Its slope is **2(b + 1)**.', 'At w = 0, b = 0: the w-slope is 2(0 − 2) = **-4**, the b-slope is 2(0 + 1) = **2**.'] },
          ],
        },
        {
          title: 'Check it with nudges',
          blocks: [
            'We can nudge one knob at a time to check:',
            { tryit: py`
def L(w, b):
    return (w - 2) ** 2 + (b + 1) ** 2

h = 0.00001
w, b = 0, 0
slope_w = (L(w + h, b) - L(w - h, b)) / (2 * h)   # only w moves
slope_b = (L(w, b + h) - L(w, b - h)) / (2 * h)   # only b moves
print("slope for w:", round(slope_w, 3))
print("slope for b:", round(slope_b, 3))
`, note: 'Try w = 2, b = -1. What happens?' },
          ],
        },
        {
          title: 'The gradient: an arrow uphill',
          blocks: [
            'Put all the partial derivatives together in a list. That list is called the **gradient**.',
            { code: 'gradient = (slope for w, slope for b) = (-4, 2)' },
            { big: 'The gradient points in the direction that goes uphill fastest.' },
            'So if we want to go **downhill** (smaller loss), we step the *opposite* way of the gradient.',
            { visual: 'gradientHill', start: [0, 0], center: [2, -1] },
            { words: [['gradient', 'the list of all the partial derivatives; an arrow pointing uphill']] },
            { quick: { q: 'To make the loss smaller, you should step…', options: ['in the direction of the gradient', 'opposite to the gradient', 'randomly', 'not at all'], answer: 1, explain: 'The gradient points uphill. Go the opposite way to go downhill.' } },
          ],
        },
        {
          title: 'At the bottom, it is flat',
          blocks: [
            'Where is our loss `(w - 2)² + (b + 1)²` smallest? At w = 2 and b = -1, where both brackets are 0.',
            'There, the gradient is **(0, 0)**. Flat in every direction. That is how we know we found the bottom.',
            { tryit: py`
def gradient(w, b):
    return (2 * (w - 2), 2 * (b + 1))

for w, b in [(0, 0), (1, 0), (2, -1)]:
    print("at", (w, b), "gradient is", gradient(w, b))
`, note: 'The gradient shrinks as we get closer to (2, -1).' },
            { trace: py`
def gradient(w, b):
    slope_w = 2 * (w - 2)
    slope_b = 2 * (b + 1)
    return (slope_w, slope_b)

g = gradient(0, 0)
print("uphill arrow:", g)
downhill = (-g[0], -g[1])
print("downhill arrow:", downhill)
`, title: 'From two knobs to an arrow: follow gradient(0, 0).', notes: {
              6: 'Start with both knobs at 0. Python jumps into `gradient` with w = 0 and b = 0.',
              2: 'Freeze b, wiggle only w: slope 2 × (0 − 2) = −4.',
              3: 'Freeze w, wiggle only b: slope 2 × (0 + 1) = 2.',
              4: 'Put both slopes together. That pair is the gradient.',
              8: 'Flip both signs to get the downhill direction.',
            } },
            { quick: { q: 'If the gradient is (0, 0), you are probably…', options: ['at a flat bottom', 'on a very steep slope', 'lost', 'at the start'], answer: 0, explain: 'Zero slope in every direction means flat ground, usually the bottom of the valley.' } },
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['AIs have many knobs, so we need a slope for each one.', 'A **partial derivative** = wiggle one knob, freeze the rest.', 'The **gradient** = all the partial derivatives together.', 'The gradient points uphill. Step the other way to go downhill.', 'At the bottom, the gradient is all zeros.'] },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'calc-grad-lab',
          title: 'Compute a gradient',
          xp: XP.code,
          task: 'Return the gradient of `loss(w, b)` as a pair `(slope for w, slope for b)`.',
          steps: ['The slope for w is `2 * (w - 2)`.', 'The slope for b is `2 * (b + 1)`.', 'Return them together as a pair: `(slope_w, slope_b)`.'],
          starter: py`
def loss(w, b):
    return (w - 2) ** 2 + (b + 1) ** 2


def gradient(w, b):
    # Return (slope for w, slope for b)
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
            { name: 'zero at the bottom', fail: 'At w=2, b=-1 the loss is smallest, so both slopes are 0', code: py`
_r = gradient(2, -1)
assert _r is not None and tuple(_r) == (0, 0), f"got {_r!r}"
` },
            { name: 'another point', code: py`
_r = gradient(5, 1)
assert _r is not None and tuple(_r) == (6, 4), f"got {_r!r}"
` },
          ],
          hints: [
            'Treat b as frozen when finding the slope for w (and the other way round).',
            'Slope of (w − 2)² is 2(w − 2). The b part does not change when w moves.',
            '`return (2 * (w - 2), 2 * (b + 1))`',
          ],
        },
      ],
    },

    // ─── 9. Gradient descent ─────────────────────────────────────────────────
    {
      id: 'calc-gd',
      title: 'Gradient descent & learning rate',
      minutes: 10,
      learn: [
        {
          title: 'Lost on a foggy mountain',
          blocks: [
            { analogy: 'You are on a mountain in thick fog. You cannot see the valley. But you CAN feel the ground under your feet. So you feel which way slopes down, take a step that way, and repeat. Eventually you reach the bottom.', emoji: '🌫️' },
            'That is **gradient descent**: feel the slope (the gradient), step downhill, repeat. It is how almost every AI is trained.',
            { words: [['gradient descent', 'a way to find the bottom of a valley by stepping downhill again and again'], ['descent', 'going down']] },
          ],
        },
        {
          title: 'The update rule',
          blocks: [
            'Every step uses one simple rule:',
            { code: 'new x = x - learning_rate * slope' },
            { list: ['If the slope is positive (uphill to the right), we subtract → x moves left, downhill. ✓', 'If the slope is negative (uphill to the left), subtracting a negative adds → x moves right, downhill. ✓', 'Either way, we go downhill. Clever!'] },
            { words: [['learning rate', 'how big each step is (a small number like 0.1)']] },
          ],
        },
        {
          title: 'Let us take some steps',
          blocks: [
            'Valley: `f(x) = (x - 3)²`. The bottom is at x = 3. Its slope is `2(x - 3)`. Start at x = 0 with learning rate 0.1.',
            { steps: ['x = 0. Slope = 2(0 − 3) = -6. New x = 0 − 0.1 × (-6) = **0.6**.', 'x = 0.6. Slope = 2(0.6 − 3) = -4.8. New x = 0.6 + 0.48 = **1.08**.', 'x = 1.08. Slope = -3.84. New x = **1.464**.', 'Getting closer to 3 every step! And the steps get smaller as the ground flattens.'] },
            { tryit: py`
def slope(x):
    return 2 * (x - 3)

x = 0
lr = 0.1
for step in range(10):
    x = x - lr * slope(x)
    print("step", step + 1, " x =", round(x, 3))
`, note: 'Change the loop to range(50). Does x reach 3?' },
            { visual: 'descentSteps', target: 3, start: 0, lr0: 0.1 },
            'Now watch Python do three steps (we use a learning rate of 0.25 so the numbers stay neat):',
            { trace: py`
def slope(x):
    return 2 * (x - 3)

x = 0
lr = 0.25
for step in range(3):
    s = slope(x)
    x = x - lr * s
print("after 3 steps, x =", x)
`, title: 'Three steps of gradient descent, line by line.', notes: {
              4: 'We start on the left side of the valley, at x = 0.',
              5: 'The learning rate: how big each step is.',
              7: 'Feel the ground: jump into `slope` to find out how steep it is right here.',
              8: 'Step the opposite way of the slope. A negative slope makes x go UP (to the right), toward 3.',
              9: 'Each step got us closer to the bottom at 3.',
            } },
          ],
        },
        {
          title: 'Too small, too big, just right',
          blocks: [
            'The learning rate matters a LOT. Think of Goldilocks:',
            { table: { head: ['Learning rate', 'What happens'], rows: [['too small (0.001)', '🐌 tiny baby steps. It works, but takes forever.'], ['just right (0.1 to 0.5)', '😊 smooth roll to the bottom.'], ['too big (1.1)', '💥 every step jumps over the valley and lands even higher. It flies away!']] } },
            { tryit: py`
def slope(x):
    return 2 * (x - 3)

for lr in [0.01, 0.3, 1.1]:
    x = 0
    for step in range(10):
        x = x - lr * slope(x)
    print("learning rate", lr, "-> after 10 steps x =", round(x, 2))
`, note: 'The bottom is 3. Which learning rate got there?' },
            { quick: { q: 'Your AI\'s loss keeps getting BIGGER every step. What should you try?', options: ['A bigger learning rate', 'A smaller learning rate', 'Stop training forever', 'Delete the data'], answer: 1, explain: 'Growing loss usually means the steps are too big and keep overshooting. Make them smaller.' } },
          ],
        },
        {
          title: 'Play with it!',
          blocks: [
            'Below this lesson there is a playground. A ball sits on a valley. You choose the learning rate and press **Step** to watch it roll.',
            { list: ['Try a tiny learning rate. Count how many steps it takes.', 'Try one near 0.5. Wow, fast!', 'Try one bigger than 1. Watch it fly off! 💥'] },
            'Then you will write gradient descent in Python yourself.',
          ],
        },
        {
          title: 'Recap 🎒',
          blocks: [
            { list: ['**Gradient descent**: feel the slope, step downhill, repeat.', 'Rule: `x = x - learning_rate * slope`.', 'The **learning rate** is the step size.', 'Too small = slow. Too big = overshoots and flies away.', 'This loop, run millions of times on millions of knobs, is how AI learns!'] },
          ],
        },
      ],
      activities: [
        { type: 'viz', id: 'viz-gd', title: 'Roll the ball downhill', component: 'GradientDescentViz', xp: XP.viz },
        {
          type: 'code',
          id: 'calc-gd-lab',
          title: 'One step at a time',
          xp: XP.code,
          task: 'Write `gd_step(x, lr)` that takes one step downhill on `f(x) = (x - 3)²`, and `run_gd(x0, lr, steps)` that takes many steps.',
          steps: ['In `gd_step`, return `x - lr * grad(x)`.', 'In `run_gd`, start with `x = x0`.', 'Loop `steps` times, each time doing `x = gd_step(x, lr)`.', 'After the loop, return x.'],
          starter: py`
def grad(x):
    # slope of f(x) = (x - 3) ** 2
    return 2 * (x - 3)


def gd_step(x, lr):
    # Move x against the slope:  x - lr * slope
    pass


def run_gd(x0, lr, steps):
    # Start at x0, take 'steps' steps with gd_step, return the final x.
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
            { name: 'reaches the bottom', code: py`
_r = run_gd(0.0, 0.1, 100)
assert _r is not None and abs(_r - 3) < 1e-3, f"got {_r!r}, expected about 3"
` },
            { name: 'too-big learning rate overshoots', fail: 'With lr=1.1 every step should jump further away', code: py`
_r = run_gd(0.0, 1.1, 20)
assert _r is not None and abs(_r - 3) > 10, f"got {_r!r}"
` },
          ],
          hints: [
            'The slope points uphill. To go down, subtract it (times the learning rate).',
            '`return x - lr * grad(x)`',
            'In run_gd: `x = x0`, then `for _ in range(steps): x = gd_step(x, lr)`, then `return x`.',
          ],
        },
      ],
    },

    // ─── 10. Checkpoint ──────────────────────────────────────────────────────
    {
      id: 'calc-checkpoint',
      title: 'Checkpoint: train a one-knob model',
      minutes: 10,
      checkpoint: true,
      learn: [
        {
          title: 'Look how far you came! 🏔️',
          blocks: [
            'You started with "what is a function?" and now you know the ideas that power every AI. Let us line them up:',
            { steps: ['A **model** is a function with knobs.', 'A **loss** measures how wrong it is.', 'The **derivative / gradient** says which way is uphill for each knob.', 'The **chain rule** (backprop) finds those slopes through many layers.', '**Gradient descent** steps every knob downhill, again and again.'] },
            { big: 'Put those together and you get: training!' },
          ],
        },
        {
          title: 'The training loop',
          blocks: [
            'Our model has ONE knob, w. It predicts `w * x`. The data follows `y = 2x`, so the perfect knob is w = 2. But the model starts at w = 0 and does not know that!',
            { steps: ['Predict: for every x, guess `w * x`.', 'Measure the slope of the MSE loss for w: the average of `2 * (w * x - y) * x`.', 'Step: `w = w - lr * slope`.', 'Repeat many times.'] },
            'Where does `2 * (w * x - y) * x` come from? The chain rule! The squared error `(w·x − y)²` gives `2(w·x − y)`, times the slope of `w·x` for w, which is `x`.',
            'Here is the valley the training loop is rolling down. The loop does automatically what you do with the slider:',
            { visual: 'lossPlayground', points: [[1, 2], [2, 4]], w0: 0 },
            { trace: py`
xs = [1, 2]
ys = [2, 4]
w = 0.0
lr = 0.1
for step in range(2):
    slope = 0
    for x, y in zip(xs, ys):
        slope = slope + 2 * (w * x - y) * x
    slope = slope / len(xs)
    w = w - lr * slope
print("w is now", w)
`, title: 'Two rounds of training, watched up close.', notes: {
              3: 'The knob starts at 0. The model knows nothing yet!',
              5: 'One round of training per loop.',
              6: 'Start adding up the slope from zero.',
              8: 'For each data point: how much does this point want w to change? (The chain rule formula.)',
              9: 'Average the slopes from all the points.',
              10: 'Gradient descent: step w downhill. Watch it jump from 0 to 1.0, then to 1.5, heading for 2.',
            } },
          ],
        },
        {
          title: 'Watch it learn',
          blocks: [
            { tryit: py`
xs = [1, 2, 3]
ys = [2, 4, 6]
w = 0.0
lr = 0.05

for step in range(20):
    slope = sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)
    w = w - lr * slope
    if step % 4 == 0:
        print("step", step, " w =", round(w, 3))
print("final w =", round(w, 3))
`, note: 'w starts at 0 and climbs toward 2. The model learned the rule by itself!' },
            'That is it. That is machine learning. Real models just have billions of knobs instead of one. 🤯',
          ],
        },
        {
          title: 'Recap & your challenge 🎒',
          blocks: [
            { list: ['Model = function with knobs.', 'Loss = how wrong.', 'Gradient = which way is uphill.', 'Backprop = chain rule, going backward.', 'Gradient descent = step downhill, repeat.'] },
            'Now: answer a few questions, then write the training loop yourself. You have got this! 🚀',
          ],
        },
      ],
      activities: [
        {
          type: 'quiz',
          id: 'calc-checkpoint-quiz',
          title: 'Big-picture check',
          xp: XP.quiz,
          questions: [
            {
              q: 'What does a derivative tell you?',
              options: ['The biggest output of a function', 'How steep the function is at one spot (the slope)', 'The input that makes the output zero', 'How many knobs a model has'],
              answer: 1,
              explain: 'A derivative is the slope at one exact point, how fast the output changes when you nudge the input.',
            },
            {
              q: 'If `y = f(g(x))`, how do you find how fast y changes with x?',
              options: ["Add the two slopes", "Multiply the two slopes (the chain rule)", 'Only use the slope of f', 'Divide the slopes'],
              answer: 1,
              explain: 'Like gears: multiply how much each step changes.',
            },
            {
              q: 'Why does backpropagation start at the loss and go backward?',
              options: [
                'Because computers read bottom-up',
                "Each step's slope needs the slopes of the steps after it, so you start at the end",
                'To delete the early layers',
                'Going forward is not allowed',
              ],
              answer: 1,
              explain: 'The chain rule multiplies along the chain, so the later slopes must be known first.',
            },
            {
              q: 'Your loss is jumping around and getting bigger. Most likely fix?',
              options: ['Raise the learning rate', 'Lower the learning rate', 'Remove the loss', 'Add more print statements'],
              answer: 1,
              explain: 'Growing loss is the classic sign of steps that are too big.',
            },
            {
              q: 'At the bottom of the loss valley, the gradient is…',
              options: ['Very large', 'Zero (flat)', 'Always negative', 'Undefined'],
              answer: 1,
              explain: 'Flat ground means no direction is downhill.',
            },
          ],
        },
        {
          type: 'code',
          id: 'calc-train',
          title: 'Train y = w·x',
          xp: XP.code,
          task: 'Fill in the training loop so the model learns the knob `w` by itself. For data from `y = 2x`, it should learn `w ≈ 2`.',
          steps: [
            'Inside the loop, compute the slope: the average of `2 * (w * x - y) * x` over all the (x, y) pairs.',
            'Tip: `sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)`.',
            'Then step downhill: `w = w - lr * grad`.',
            'Run it. You should see about 2.0.',
          ],
          starter: py`
def train(xs, ys, lr=0.01, steps=200):
    w = 0.0
    for _ in range(steps):
        # slope of the loss for w = average of 2 * (w*x - y) * x
        grad = 0.0
        # compute grad here, then update w

    return w


print(train([1, 2, 3], [2, 4, 6]))  # about 2.0
`,
          solution: py`
def train(xs, ys, lr=0.01, steps=200):
    w = 0.0
    for _ in range(steps):
        grad = sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)
        w = w - lr * grad
    return w


print(train([1, 2, 3], [2, 4, 6]))  # about 2.0
`,
          tests: [
            { name: 'learns w ≈ 2', code: py`
_r = train([1, 2, 3], [2, 4, 6])
assert abs(_r - 2) < 0.01, f"got w = {_r!r}, expected about 2"
` },
            { name: 'learns a different slope', fail: 'Make sure you use xs and ys, not hard-coded numbers', code: py`
_r = train([1, 2, 3, 4], [-1.5, -3, -4.5, -6])
assert abs(_r + 1.5) < 0.01, f"expected about -1.5, got {_r!r}"
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
