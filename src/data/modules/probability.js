import { py, XP } from '../helpers.js'

export default {
  id: 'probability',
  title: 'Probability & Stats',
  emoji: '🎲',
  tagline: 'Chances, guesses and averages — the maths of how chatbots pick their next word.',
  badge: { id: 'mod-probability', name: 'Sampling Sorcerer', emoji: '🎲' },
  lessons: [
    // ─────────────────────────────── 1. WHAT IS PROBABILITY? ───────────────────────────────
    {
      id: 'prob-basics',
      title: 'What is probability?',
      minutes: 8,
      learn: [
        {
          title: 'How likely is it?',
          blocks: [
            { big: 'Probability is a number that tells us how likely something is to happen.' },
            'Every day you guess how likely things are. Will it rain? Will my friend be late? Will I get pizza for dinner?',
            'Probability turns those guesses into **numbers**, so we can compare them and do maths with them.',
            {
              analogy: 'A weather forecast that says "70% chance of rain" is a probability. It doesn\'t promise rain — it says rain is *pretty likely*, so maybe take an umbrella.',
              emoji: '🌦️',
            },
            { words: [['probability', 'a number that says how likely something is'], ['event', 'the thing we care about happening, like "it rains" or "I roll a 6"']] },
          ],
        },
        {
          title: 'The probability scale: 0 to 1',
          blocks: [
            'Probabilities always live between **0** and **1**.',
            {
              table: {
                head: ['Probability', 'What it means', 'Example'],
                rows: [
                  ['`0`', 'Impossible — it will never happen', 'Rolling a 7 on a normal dice'],
                  ['`0.25`', 'Unlikely', 'Picking a heart from a deck of cards'],
                  ['`0.5`', 'Even chance — 50/50', 'A coin landing on heads'],
                  ['`0.9`', 'Very likely', 'The sun is out on a summer afternoon'],
                  ['`1`', 'Certain — it will always happen', 'Tomorrow comes after today'],
                ],
              },
            },
            { tip: 'If you ever calculate a probability bigger than 1 or smaller than 0, something went wrong. Check your maths!' },
            {
              quick: {
                q: 'Which probability means "this will definitely happen"?',
                options: ['0', '0.5', '1', '100'],
                answer: 2,
                explain: '1 means certain. (100 is the *percentage* version — 100% — but the probability number itself is 1.)',
              },
            },
          ],
        },
        {
          title: 'Counting chances',
          blocks: [
            'When every result is equally likely, there\'s an easy recipe:',
            { big: 'probability = (ways to get what you want) ÷ (all the possible ways)' },
            { boxes: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'], labels: ['1', '2', '3', '4', '5', '6'], caption: 'a dice' },
            'What is the chance of rolling a **6**? Let\'s go slowly:',
            {
              steps: [
                'Count **all** the possible results: 1, 2, 3, 4, 5, 6. That\'s **6** results.',
                'Count the results we **want**: just the 6. That\'s **1** result.',
                'Divide: `1 ÷ 6 = 0.1666…` — about **0.17**.',
              ],
            },
            'What about rolling an **even** number? The good results are 2, 4 and 6 — that\'s 3 of them. So the chance is `3 ÷ 6 = 0.5`.',
            { tryit: py`
# The chance recipe: wanted / total
wanted = 1   # rolling a 6
total = 6    # six sides on a dice
print("Chance of a 6:", wanted / total)

wanted = 3   # rolling 2, 4 or 6
print("Chance of an even number:", wanted / total)
`, note: 'Press Run. Then change `wanted` to work out the chance of rolling 5 or 6.' },
            { words: [['outcome', 'one possible result, like "rolled a 4"']] },
          ],
        },
        {
          title: 'Fractions, decimals and percentages',
          blocks: [
            'The same probability can be written three ways. They all mean the same thing!',
            {
              table: {
                head: ['Fraction', 'Decimal', 'Percentage'],
                rows: [
                  ['1/2', '0.5', '50%'],
                  ['1/4', '0.25', '25%'],
                  ['3/4', '0.75', '75%'],
                  ['1/10', '0.1', '10%'],
                ],
              },
            },
            'To turn a decimal into a percentage, **multiply by 100**. To go back, **divide by 100**.',
            { tryit: py`
p = 3 / 4
print("as a decimal:", p)
print("as a percentage:", p * 100, "%")
`, note: 'Try `p = 1 / 8` and see what percentage it is.' },
            {
              quick: {
                q: 'A weather app says 0.3 chance of snow. What percentage is that?',
                options: ['3%', '30%', '0.3%', '300%'],
                answer: 1,
                explain: '0.3 × 100 = 30%.',
              },
            },
          ],
        },
        {
          title: 'Why do chatbots need this?',
          blocks: [
            'A chatbot like ChatGPT writes **one word at a time**. Before each word, it asks itself: *"how likely is each possible next word?"*',
            {
              table: {
                head: ['After "I love eating…"', 'Probability'],
                rows: [['pizza', '0.40'], ['ice cream', '0.30'], ['vegetables', '0.05'], ['…lots of other words', '0.25']],
              },
            },
            'Notice the probabilities add up to **1** — because the next word has to be *something*.',
            { tip: 'When all the possible outcomes are listed, their probabilities always add up to exactly 1 (or 100%).' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                'Probability = how likely something is, as a number from **0** (impossible) to **1** (certain).',
                'For equally likely outcomes: **wanted ÷ total**.',
                '0.5, 1/2 and 50% are the same thing.',
                'All the probabilities for every possible outcome add up to 1.',
                'Chatbots use probabilities to choose their next word.',
              ],
            },
            { big: 'Great start! Now let\'s write a tiny chance calculator. 🎲' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-chance',
          title: 'Your first chance calculator',
          xp: XP.code,
          task: 'Write two little functions: one that works out a probability, and one that turns it into a percentage.',
          steps: [
            'In `chance(wanted, total)`, return `wanted` divided by `total`.',
            'In `as_percent(p)`, return `p` multiplied by `100`.',
            'Press **Run** to see the dice examples, then **Check**.',
          ],
          starter: py`
def chance(wanted, total):
    # Return the probability: wanted divided by total.
    pass


def as_percent(p):
    # Turn a probability like 0.5 into a percentage like 50.
    pass


print(chance(1, 6))              # chance of rolling a 6 (about 0.1667)
print(as_percent(chance(3, 6)))  # chance of an even number, as a % (50.0)
`,
          solution: py`
def chance(wanted, total):
    return wanted / total


def as_percent(p):
    return p * 100


print(chance(1, 6))              # chance of rolling a 6 (about 0.1667)
print(as_percent(chance(3, 6)))  # chance of an even number, as a % (50.0)
`,
          tests: [
            { name: 'chance of an even number is 0.5', fail: 'Divide wanted by total', code: py`
_r = chance(3, 6)
assert _r == 0.5, f"chance(3, 6) gave {_r!r}"
` },
            { name: 'chance of rolling a 6', code: py`
_r = chance(1, 6)
assert _r is not None and abs(_r - 1 / 6) < 1e-9, f"chance(1, 6) gave {_r!r}"
` },
            { name: 'as_percent turns 0.25 into 25', fail: 'Multiply by 100', code: py`
_r = as_percent(0.25)
assert _r == 25, f"as_percent(0.25) gave {_r!r}"
` },
          ],
          hints: [
            'In Python, `/` means "divided by".',
            '`chance` is one line: `return wanted / total`.',
            '`as_percent` is one line too: `return p * 100`.',
          ],
        },
      ],
    },

    // ─────────────────────────────── 2. EXPERIMENTS ───────────────────────────────
    {
      id: 'prob-experiments',
      title: 'Experiments: flipping coins with Python',
      minutes: 8,
      learn: [
        {
          title: 'Guessing vs. testing',
          blocks: [
            'We said a coin has a 0.5 chance of heads. But if you flip a coin 10 times, do you always get exactly 5 heads?',
            { big: 'Nope! Real results wobble around the probability.' },
            'You might get 4 heads, or 7, or even 3. That\'s **randomness**.',
            {
              analogy: 'Think of a bag with the same number of red and blue sweets. Grab 4 without looking — sometimes you\'ll get 3 red and 1 blue. Unlucky? No, just random!',
              emoji: '🍬',
            },
            { words: [['experiment', 'trying something many times and writing down what happens'], ['random', 'you can\'t know the result for sure before it happens']] },
          ],
        },
        {
          title: 'Let the computer flip coins',
          blocks: [
            'Flipping a real coin 1,000 times would take forever. A computer can do it in a blink!',
            'Python has a `random` module. `random.choice(["H", "T"])` picks **H** (heads) or **T** (tails), each with a 50/50 chance.',
            { tryit: py`
import random

for i in range(10):
    print(random.choice(["H", "T"]))
`, note: 'Run it a few times. You get a different pattern each time!' },
            { tip: '`import random` is how we borrow Python\'s ready-made random tools.' },
          ],
        },
        {
          title: 'Counting what happened',
          blocks: [
            'To learn from an experiment, we **count** results. A list has a handy `.count()` method:',
            { boxes: ['"H"', '"T"', '"H"', '"H"', '"T"'], caption: 'flips' },
            '`flips.count("H")` gives **3**, because "H" appears 3 times.',
            'The **fraction** of heads is `3 ÷ 5 = 0.6`.',
            { tryit: py`
flips = ["H", "T", "H", "H", "T"]
heads = flips.count("H")
print("heads:", heads)
print("fraction of heads:", heads / len(flips))
`, note: 'Add more "H" or "T" to the list and run again.' },
            {
              quick: {
                q: 'flips = ["T", "T", "H", "T"]. What fraction are heads?',
                options: ['0.25', '0.5', '0.75', '1'],
                answer: 0,
                explain: '1 head out of 4 flips: 1 ÷ 4 = 0.25.',
              },
            },
          ],
        },
        {
          title: 'More flips → closer to the truth',
          blocks: [
            'Here\'s something magical. The **more** times you flip, the **closer** the fraction of heads gets to 0.5.',
            { tryit: py`
import random

for n in [10, 100, 1000, 100000]:
    flips = [random.choice(["H", "T"]) for i in range(n)]
    print(n, "flips -> fraction of heads:", flips.count("H") / n)
`, note: 'Look how the big experiments land really close to 0.5!' },
            'Mathematicians call this the **law of large numbers**. A few flips can be lucky or unlucky; lots of flips even out.',
            { words: [['law of large numbers', 'with lots and lots of tries, results get close to the true probability']] },
          ],
        },
        {
          title: 'How AI learns from counting',
          blocks: [
            'AI models learn in a similar way: they look at **huge** amounts of text and count what happens.',
            'If, in millions of sentences, "peanut butter and…" is followed by "jelly" most of the time, the model learns that "jelly" is very likely there.',
            { tip: 'Lots of examples = better guesses. That\'s why AI models read *so much* text.' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                'Real results are **random** — they wobble around the probability.',
                '`random.choice(...)` lets Python run experiments for us.',
                '`my_list.count(x)` counts how many times `x` appears.',
                'More tries → the fraction gets closer to the true probability.',
              ],
            },
            { big: 'Now you count some coin flips yourself! 🪙' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-flips',
          title: 'Count the heads',
          xp: XP.code,
          task: 'Given a list of coin flips like `["H", "T", "H"]`, count the heads and work out the fraction that are heads.',
          steps: [
            'In `count_heads(flips)`, return how many times `"H"` is in the list.',
            'In `fraction_heads(flips)`, return the number of heads divided by the total number of flips.',
            'Tip: `len(flips)` tells you how many flips there are.',
          ],
          starter: py`
def count_heads(flips):
    # Return how many "H" are in the list.
    pass


def fraction_heads(flips):
    # Return (number of heads) / (number of flips).
    pass


my_flips = ["H", "T", "H", "H", "T"]
print(count_heads(my_flips))     # 3
print(fraction_heads(my_flips))  # 0.6
`,
          solution: py`
def count_heads(flips):
    return flips.count("H")


def fraction_heads(flips):
    return count_heads(flips) / len(flips)


my_flips = ["H", "T", "H", "H", "T"]
print(count_heads(my_flips))     # 3
print(fraction_heads(my_flips))  # 0.6
`,
          tests: [
            { name: 'counts the heads', fail: 'Use flips.count("H")', code: py`
_r = count_heads(["H", "T", "H", "H", "T"])
assert _r == 3, f"expected 3, got {_r!r}"
` },
            { name: 'zero heads is fine', code: py`
_r = count_heads(["T", "T"])
assert _r == 0, f"expected 0, got {_r!r}"
` },
            { name: 'fraction of heads', fail: 'Divide the head count by len(flips)', code: py`
_r = fraction_heads(["H", "T", "H", "H", "T"])
assert _r is not None and abs(_r - 0.6) < 1e-9, f"expected 0.6, got {_r!r}"
` },
          ],
          hints: [
            'Lists can count things for you: `flips.count("H")`.',
            'For the fraction you need two numbers: heads, and the total `len(flips)`.',
            '`return count_heads(flips) / len(flips)`',
          ],
        },
      ],
    },

    // ─────────────────────────────── 3. CONDITIONAL PROBABILITY ───────────────────────────────
    {
      id: 'prob-given',
      title: 'Conditional probability: "given that…"',
      minutes: 9,
      learn: [
        {
          title: 'When you know something extra',
          blocks: [
            { big: 'Knowing a clue can change the chances.' },
            'What\'s the chance it rains today? Maybe 20%. But what if you look outside and see **dark grey clouds**? Now the chance feels much higher!',
            'That\'s **conditional probability**: the chance of something, **given that** we already know something else.',
            { analogy: 'A detective changes their guess about who did it every time they find a new clue. Clues change probabilities!', emoji: '🕵️' },
            { words: [['conditional probability', 'the chance of something happening, given that we already know something else is true'], ['given', 'means "if we already know that…"']] },
          ],
        },
        {
          title: 'The marble bag',
          blocks: [
            'Here\'s a bag of 10 marbles:',
            {
              table: {
                head: ['', 'Red 🔴', 'Blue 🔵', 'Total'],
                rows: [['Big', '3', '1', '4'], ['Small', '2', '4', '6'], ['Total', '5', '5', '10']],
              },
            },
            'Grab any marble without looking. Chance it\'s red? **5 red out of 10 → 0.5**.',
            'Now your friend says: *"The marble you grabbed is BIG."* What\'s the chance it\'s red **given** it\'s big?',
            {
              steps: [
                'Forget the small marbles — we know ours is big. There are only **4** big marbles.',
                'How many of those big marbles are red? **3**.',
                'So the chance is `3 ÷ 4 = 0.75`.',
              ],
            },
            { big: 'The clue "it\'s big" changed the chance from 0.5 to 0.75!' },
          ],
        },
        {
          title: 'How to write it',
          blocks: [
            'Mathematicians write conditional probability with a straight line `|`, which you read as **"given"**:',
            { code: 'P(red | big) = 0.75\n\nread it as: "the probability of red, given big"' },
            { table: { head: ['Symbol', 'Means'], rows: [['`P(…)`', 'the probability of …'], ['`|`', 'given that'], ['`P(red)`', 'chance of red with no clues'], ['`P(red | big)`', 'chance of red if we know it\'s big']] } },
            {
              quick: {
                q: 'Using the bag: what is P(blue | small)?',
                options: ['4/10', '4/6', '1/4', '5/10'],
                answer: 1,
                explain: 'There are 6 small marbles, and 4 of them are blue: 4/6 ≈ 0.67.',
              },
            },
          ],
        },
        {
          title: 'Let Python do the counting',
          blocks: [
            'We can store each marble as a little dictionary and let Python count for us:',
            { tryit: py`
marbles = [
    {"size": "big", "color": "red"},
    {"size": "big", "color": "red"},
    {"size": "big", "color": "red"},
    {"size": "big", "color": "blue"},
    {"size": "small", "color": "red"},
    {"size": "small", "color": "blue"},
]

# Step 1: keep only the big marbles
big = [m for m in marbles if m["size"] == "big"]
# Step 2: count how many of those are red
red_big = [m for m in big if m["color"] == "red"]

print("big marbles:", len(big))
print("big AND red:", len(red_big))
print("P(red | big) =", len(red_big) / len(big))
`, note: 'Try changing it to work out P(blue | big).' },
            { tip: 'The trick for "given" is always: **first shrink the group** to only what you know, **then count** inside that smaller group.' },
          ],
        },
        {
          title: 'Chatbots live on "given that…"',
          blocks: [
            'A chatbot never asks "what\'s a likely word?" on its own. It always asks:',
            { big: '"What\'s the likely next word, GIVEN the words so far?"' },
            {
              table: {
                head: ['Words so far', 'Likely next word'],
                rows: [['"Twinkle twinkle little…"', 'star ⭐'], ['"Happy…"', 'birthday 🎂'], ['"Once upon a…"', 'time 📖']],
              },
            },
            'The words so far are the **clue**. Change the clue and the probabilities change completely.',
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                'Conditional probability = the chance of something **given** a clue.',
                'Written `P(A | B)` — "probability of A given B".',
                'Method: shrink to the group you know about, then count inside it.',
                'Chatbots predict the next word *given* the words before it.',
              ],
            },
            { big: 'Detective time — let\'s code the marble bag! 🔍' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-given-lab',
          title: 'The marble detective',
          xp: XP.code,
          task: 'Write `chance_given(marbles, size, color)`: the chance a marble has that **color**, given that it has that **size**.',
          steps: [
            'Make a list of only the marbles whose `"size"` matches `size`.',
            'From that smaller list, count the marbles whose `"color"` matches `color`.',
            'Return (that count) ÷ (how many marbles had the right size).',
          ],
          starter: py`
bag = [
    {"size": "big", "color": "red"},
    {"size": "big", "color": "red"},
    {"size": "big", "color": "red"},
    {"size": "big", "color": "blue"},
    {"size": "small", "color": "red"},
    {"size": "small", "color": "red"},
    {"size": "small", "color": "blue"},
    {"size": "small", "color": "blue"},
    {"size": "small", "color": "blue"},
    {"size": "small", "color": "blue"},
]


def chance_given(marbles, size, color):
    # 1. Keep only marbles with the right size
    # 2. Count how many of THOSE have the right color
    # 3. Return count / number of right-size marbles
    pass


print(chance_given(bag, "big", "red"))     # 0.75
print(chance_given(bag, "small", "blue"))  # about 0.667
`,
          solution: py`
bag = [
    {"size": "big", "color": "red"},
    {"size": "big", "color": "red"},
    {"size": "big", "color": "red"},
    {"size": "big", "color": "blue"},
    {"size": "small", "color": "red"},
    {"size": "small", "color": "red"},
    {"size": "small", "color": "blue"},
    {"size": "small", "color": "blue"},
    {"size": "small", "color": "blue"},
    {"size": "small", "color": "blue"},
]


def chance_given(marbles, size, color):
    right_size = [m for m in marbles if m["size"] == size]
    matches = [m for m in right_size if m["color"] == color]
    return len(matches) / len(right_size)


print(chance_given(bag, "big", "red"))     # 0.75
print(chance_given(bag, "small", "blue"))  # about 0.667
`,
          tests: [
            { name: 'P(red | big) = 0.75', fail: 'Only count marbles inside the big group', code: py`
_r = chance_given(bag, "big", "red")
assert _r is not None and abs(_r - 0.75) < 1e-9, f"expected 0.75, got {_r!r}"
` },
            { name: 'P(blue | small) = 4/6', code: py`
_r = chance_given(bag, "small", "blue")
assert _r is not None and abs(_r - 4 / 6) < 1e-9, f"expected about 0.667, got {_r!r}"
` },
            { name: 'works on a different bag', fail: 'Use the marbles you are given, not the bag variable', code: py`
_b = [{"size": "big", "color": "red"}, {"size": "big", "color": "blue"}, {"size": "small", "color": "red"}]
_r = chance_given(_b, "big", "blue")
assert _r is not None and abs(_r - 0.5) < 1e-9, f"expected 0.5, got {_r!r}"
` },
          ],
          hints: [
            'Look back at the "Let Python do the counting" page — the try-it does almost exactly this!',
            'Step 1: `right_size = [m for m in marbles if m["size"] == size]`',
            'Step 2: `matches = [m for m in right_size if m["color"] == color]`, then `return len(matches) / len(right_size)`.',
          ],
        },
      ],
    },

    // ─────────────────────────────── 4. NEXT-TOKEN PREDICTION ───────────────────────────────
    {
      id: 'prob-conditional',
      title: 'Next-word prediction: how autocomplete works',
      minutes: 9,
      learn: [
        {
          title: 'Your phone is guessing!',
          blocks: [
            'When you type on a phone, it suggests the next word above the keyboard. Type "good" and it might suggest **morning**, **night** or **luck**.',
            { big: 'That\'s next-word prediction — the same basic idea behind chatbots.' },
            { analogy: 'Imagine a friend who has read every message you\'ve ever sent. When you type "see you", they shout "LATER!" because that\'s what usually comes next.', emoji: '📱' },
            { words: [['token', 'a small piece of text a model works with — often a word or part of a word'], ['prediction', 'a smart guess about what will happen next']] },
          ],
        },
        {
          title: 'Learning by counting pairs',
          blocks: [
            'The simplest predictor just **counts which word follows which**. Pairs of neighbouring words are called **bigrams** ("bi" means two).',
            'Suppose we read this tiny story:',
            { code: 'the cat sat. the cat ran. the cat sat. the dog sat.' },
            'Now count what came right after the word **"the"**:',
            { table: { head: ['After "the"', 'Count'], rows: [['cat', '3'], ['dog', '1'], ['Total', '4']] } },
            { words: [['bigram', 'a pair of words that appear next to each other, like "the cat"']] },
          ],
        },
        {
          title: 'From counts to probabilities',
          blocks: [
            'Turn counts into probabilities with the same old recipe: **count ÷ total**.',
            {
              steps: [
                '"the" was followed by something **4** times in total.',
                '"cat" came **3** of those times → `3 ÷ 4 = 0.75`.',
                '"dog" came **1** time → `1 ÷ 4 = 0.25`.',
                'Check: `0.75 + 0.25 = 1`. ✅',
              ],
            },
            { code: 'P(cat | the) = 0.75\nP(dog | the) = 0.25' },
            'See the `|`? Next-word prediction **is** conditional probability: the chance of the next word *given* the previous one.',
            {
              quick: {
                q: 'After "I", a story had "am" 6 times and "like" 2 times. What is P(am | I)?',
                options: ['6/2', '6/8', '2/8', '6/10'],
                answer: 1,
                explain: 'Total after "I" = 6 + 2 = 8. "am" was 6 of them: 6/8 = 0.75.',
              },
            },
          ],
        },
        {
          title: 'Counting with a dictionary',
          blocks: [
            'In Python, we can store the counts in a **dictionary inside a dictionary**:',
            { tryit: py`
counts = {
    "the": {"cat": 3, "dog": 1},
    "cat": {"sat": 2, "ran": 2},
}

followers = counts["the"]           # {"cat": 3, "dog": 1}
total = sum(followers.values())     # 3 + 1 = 4
for word in followers:
    print("P(", word, "| the ) =", followers[word] / total)
`, note: 'Change it to look at the word "cat" instead of "the".' },
            { tip: '`sum(d.values())` adds up all the numbers stored in a dictionary.' },
          ],
        },
        {
          title: 'Big models do this — but smarter',
          blocks: [
            'Real chatbots don\'t just look at **one** previous word. They look at the whole conversation so far — hundreds or thousands of words!',
            'And instead of a simple counting table, they use a giant neural network. But the goal is exactly the same:',
            { big: 'P(next word | everything before it)' },
            { tryit: py`
counts = {"once": {"upon": 9, "more": 1}, "upon": {"a": 10}, "a": {"time": 8, "dragon": 2}}

word = "once"
story = [word]
for step in range(3):
    followers = counts[word]
    word = max(followers, key=followers.get)   # pick the most common next word
    story.append(word)
print(" ".join(story))
`, note: 'A tiny story-writer! It always picks the most likely next word.' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                'Autocomplete and chatbots **predict the next word**.',
                'The simplest way: count which words follow which (**bigrams**).',
                'Probability of a next word = its count ÷ the total count.',
                'This is conditional probability: `P(next | previous)`.',
              ],
            },
            { big: 'Let\'s build a mini autocomplete brain! 🧠' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-cond',
          title: 'A tiny bigram model',
          xp: XP.code,
          task: 'Write `next_token_probs(counts, prev)` that returns a dictionary of `P(next | prev)` — each count divided by the total for `prev`.',
          steps: [
            'Get the inner dictionary for `prev`: `followers = counts[prev]`.',
            'Add up all its counts to get the `total`.',
            'Build and return a new dictionary where each word maps to `count / total`.',
          ],
          starter: py`
counts = {
    "the": {"cat": 3, "dog": 1},
    "cat": {"sat": 2, "ran": 2},
}


def next_token_probs(counts, prev):
    # 1. followers = counts[prev]
    # 2. total = add up all the numbers in followers
    # 3. return a dict: {word: count / total, ...}
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
    probs = {}
    for word in followers:
        probs[word] = followers[word] / total
    return probs


print(next_token_probs(counts, "the"))  # {'cat': 0.75, 'dog': 0.25}
`,
          tests: [
            { name: 'P(· | "the")', code: py`
_r = next_token_probs(counts, "the")
assert _r is not None and abs(_r["cat"] - 0.75) < 1e-9 and abs(_r["dog"] - 0.25) < 1e-9, f"got {_r!r}"
` },
            { name: 'probabilities add up to 1', fail: 'Divide every count by the same total', code: py`
_r = next_token_probs({"a": {"x": 1, "y": 2, "z": 7}}, "a")
assert _r is not None and abs(sum(_r.values()) - 1) < 1e-9, f"got {_r!r}"
` },
            { name: 'uses the counts you pass in', fail: 'Read from the counts argument', code: py`
_r = next_token_probs({"hi": {"there": 9, "!": 1}}, "hi")
assert _r is not None and abs(_r["there"] - 0.9) < 1e-9, f"got {_r!r}"
` },
          ],
          hints: [
            '`counts[prev]` is a dictionary like `{"cat": 3, "dog": 1}`.',
            'The total is `sum(followers.values())`.',
            'Make an empty dict `probs = {}`, then loop: `probs[word] = followers[word] / total`.',
          ],
        },
      ],
    },

    // ─────────────────────────────── 5. DISTRIBUTIONS & BELL CURVE ───────────────────────────────
    {
      id: 'prob-gaussian',
      title: 'Distributions & the bell curve',
      minutes: 9,
      learn: [
        {
          title: 'What is a distribution?',
          blocks: [
            { big: 'A distribution shows how likely EVERY possible result is — all at once.' },
            'For a fair dice, every number 1 to 6 has the same chance. Its distribution is flat:',
            { table: { head: ['Roll', '1', '2', '3', '4', '5', '6'], rows: [['Chance', '1/6', '1/6', '1/6', '1/6', '1/6', '1/6']] } },
            { analogy: 'A distribution is like a map of chances. Instead of "how likely is a 6?", it answers "how likely is *each* number?"', emoji: '🗺️' },
            { words: [['distribution', 'a list (or picture) of every possible result and how likely each one is']] },
          ],
        },
        {
          title: 'Histograms: pictures of results',
          blocks: [
            'A **histogram** is a bar chart that shows how often each result happened. Taller bar = happened more.',
            { tryit: py`
import random

rolls = [random.randint(1, 6) for i in range(600)]
for face in range(1, 7):
    n = rolls.count(face)
    print(face, "#" * (n // 5), n)
`, note: 'Each # is 5 rolls. The bars are all about the same height — a flat distribution!' },
            { words: [['histogram', 'a bar chart showing how often each result happened']] },
          ],
        },
        {
          title: 'Add two dice and something changes',
          blocks: [
            'Now roll **two** dice and add them up. The total can be 2 to 12. Are all totals equally likely?',
            'No! There\'s only **one** way to get 2 (1+1), but **six** ways to get 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1).',
            { tryit: py`
import random

totals = [random.randint(1, 6) + random.randint(1, 6) for i in range(3000)]
for t in range(2, 13):
    n = totals.count(t)
    print(str(t).rjust(2), "#" * (n // 20))
`, note: 'See the hill shape? The middle totals happen most!' },
            {
              quick: {
                q: 'With two dice, which total happens most often?',
                options: ['2', '7', '12', 'They\'re all the same'],
                answer: 1,
                explain: '7 has the most ways to be made (6 ways), so it comes up most.',
              },
            },
          ],
        },
        {
          title: 'The bell curve',
          blocks: [
            'When lots of little random things add together, you very often get a hill shaped like a **bell**. It\'s called the **normal distribution** or **Gaussian** (after a mathematician called Gauss).',
            'Heights of people, test scores, the size of apples — they all make bell curves. Most things are near the middle; very small or very big ones are rare.',
            'A bell curve is described by just **two numbers**:',
            { table: { head: ['Number', 'Symbol', 'What it controls'], rows: [['mean', '`μ` (mu)', 'where the middle (top of the bell) is'], ['standard deviation', '`σ` (sigma)', 'how wide and spread out the bell is']] } },
            { words: [['normal distribution', 'the famous bell-shaped curve; also called the Gaussian'], ['mean (μ)', 'the middle of the bell'], ['standard deviation (σ)', 'how spread out the bell is']] },
          ],
        },
        {
          title: 'The bell curve formula',
          blocks: [
            'There\'s a formula that gives the height of the bell at any point `x`. Don\'t worry — you don\'t need to memorise it, just copy it into code!',
            { code: 'height(x) = exp(-(x - μ)² / (2σ²)) / (σ · √(2π))' },
            {
              steps: [
                '`(x - μ)` = how far x is from the middle.',
                'Square it, divide by `2σ²` and make it negative.',
                '`exp(...)` makes a number that\'s biggest (1) right in the middle and shrinks away from it.',
                'Divide by `σ · √(2π)` so the whole curve has the right size.',
              ],
            },
            { tryit: py`
import math

def bell(x, mu, sigma):
    return math.exp(-(x - mu) ** 2 / (2 * sigma ** 2)) / (sigma * math.sqrt(2 * math.pi))

for x in range(-3, 4):
    h = bell(x, 0, 1)
    print(str(x).rjust(2), "#" * int(h * 60))
`, note: 'A sideways bell! Try sigma = 2 to see it get wider and flatter.' },
          ],
        },
        {
          title: 'Where AI uses the bell curve',
          blocks: [
            'When a neural network is born, its millions of numbers (called **weights**) start out as small random numbers picked from a bell curve. Then training slowly improves them.',
            { tip: 'Starting with bell-curve randomness means most weights are near 0, with just a few bigger ones — a nice gentle start.' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                'A **distribution** gives the chance of every possible result.',
                'A **histogram** is a bar chart of how often each result happened.',
                'Adding random things together makes a **bell curve** (normal / Gaussian).',
                'The bell is set by its **mean** (middle) and **standard deviation** (width).',
              ],
            },
            { big: 'Let\'s code the bell curve! 🔔' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-gauss',
          title: 'The bell curve',
          xp: XP.code,
          task: 'Implement `gaussian_pdf(x, mu, sigma)`: the height of the bell curve at `x`.',
          steps: [
            'Work out the top part: `math.exp(-(x - mu) ** 2 / (2 * sigma ** 2))`.',
            'Work out the bottom part: `sigma * math.sqrt(2 * math.pi)`.',
            'Return top divided by bottom.',
          ],
          starter: py`
import math


def gaussian_pdf(x, mu, sigma):
    # top    = math.exp(-(x - mu) ** 2 / (2 * sigma ** 2))
    # bottom = sigma * math.sqrt(2 * math.pi)
    # return top / bottom
    pass


print(gaussian_pdf(0, 0, 1))  # about 0.3989
`,
          solution: py`
import math


def gaussian_pdf(x, mu, sigma):
    top = math.exp(-(x - mu) ** 2 / (2 * sigma ** 2))
    bottom = sigma * math.sqrt(2 * math.pi)
    return top / bottom


print(gaussian_pdf(0, 0, 1))  # about 0.3989
`,
          tests: [
            { name: 'top of the standard bell', code: py`
_r = gaussian_pdf(0, 0, 1)
assert _r is not None and abs(_r - 0.398942) < 1e-5, f"expected about 0.3989, got {_r!r}"
` },
            { name: 'same height on both sides of the middle', code: py`
assert abs(gaussian_pdf(1, 0, 1) - gaussian_pdf(-1, 0, 1)) < 1e-12
` },
            { name: 'wider sigma → lower peak', fail: 'Remember to divide by sigma too', code: py`
_r = gaussian_pdf(5, 5, 2)
assert abs(_r - 0.199471) < 1e-5, f"expected about 0.1995, got {_r!r}"
` },
          ],
          hints: [
            'You need `math.exp`, `math.sqrt` and `math.pi`.',
            'Uncomment the steps in the starter: make `top` and `bottom` variables.',
            '`return top / bottom` — and check your brackets carefully!',
          ],
        },
      ],
    },

    // ─────────────────────────────── 6. MEAN, VARIANCE, STD ───────────────────────────────
    {
      id: 'prob-stats',
      title: 'Mean, variance & standard deviation',
      minutes: 10,
      learn: [
        {
          title: 'The mean: a fair share',
          blocks: [
            { big: 'The mean (or average) is what everyone would get if we shared equally.' },
            { analogy: 'Four friends have 2, 4, 6 and 8 sweets. If they put them all in a pile and shared fairly, how many would each get?', emoji: '🍭' },
            {
              steps: [
                'Add them all up: `2 + 4 + 6 + 8 = 20`.',
                'Count how many friends: **4**.',
                'Share: `20 ÷ 4 = 5`. The mean is **5**.',
              ],
            },
            { tryit: py`
sweets = [2, 4, 6, 8]
mean = sum(sweets) / len(sweets)
print("mean:", mean)
`, note: 'Add another friend with 10 sweets — what happens to the mean?' },
            { words: [['mean', 'the average: add everything up, then divide by how many there are']] },
          ],
        },
        {
          title: 'Same mean, different story',
          blocks: [
            'Two classes took a test. Both have a mean of **50**:',
            { table: { head: ['Class', 'Scores', 'Mean'], rows: [['A', '49, 50, 51, 50', '50'], ['B', '10, 90, 20, 80', '50']] } },
            'Class A all scored about the same. Class B is all over the place! The mean can\'t see the difference.',
            'We need a second number that measures **how spread out** the scores are.',
            {
              quick: {
                q: 'Which class has scores that are more spread out?',
                options: ['Class A', 'Class B', 'They are the same'],
                answer: 1,
                explain: 'Class B goes from 10 to 90 — very spread out. Class A stays close to 50.',
              },
            },
          ],
        },
        {
          title: 'Variance: how far from the middle?',
          blocks: [
            '**Variance** measures the spread. Here\'s the recipe, with the numbers 2, 4, 4, 4, 5, 5, 7, 9 (mean = 5):',
            {
              steps: [
                'Find how far each number is from the mean: `-3, -1, -1, -1, 0, 0, 2, 4`.',
                'Square each one (this makes them all positive): `9, 1, 1, 1, 0, 0, 4, 16`.',
                'Find the mean of those squares: `32 ÷ 8 = 4`. The variance is **4**.',
              ],
            },
            { tip: 'Why square? Because -3 and +3 are equally "far". Squaring stops the minus and plus distances cancelling out.' },
            { words: [['variance', 'the average of the squared distances from the mean — a measure of spread']] },
          ],
        },
        {
          title: 'Standard deviation: spread in normal units',
          blocks: [
            'Variance is in "squared" units, which is a bit weird (squared test points?). So we take the **square root** to get back to normal units.',
            { big: 'standard deviation = √variance' },
            'For our numbers: `√4 = 2`. So a "typical" number is about **2 away** from the mean of 5.',
            { tryit: py`
nums = [2, 4, 4, 4, 5, 5, 7, 9]
mean = sum(nums) / len(nums)
squares = [(x - mean) ** 2 for x in nums]
variance = sum(squares) / len(nums)
std = variance ** 0.5
print("mean:", mean, " variance:", variance, " std:", std)
`, note: 'Swap in Class B\'s scores [10, 90, 20, 80] and see the big std!' },
            { words: [['standard deviation (std)', 'the square root of the variance: the typical distance from the mean']] },
          ],
        },
        {
          title: 'NumPy does it in one line',
          blocks: [
            '**NumPy** is a Python library for working with lots of numbers fast. It has ready-made functions:',
            { table: { head: ['You want', 'NumPy'], rows: [['mean', '`np.mean(x)`'], ['variance', '`np.var(x)`'], ['standard deviation', '`np.std(x)`']] } },
            { tryit: py`
import numpy as np

scores = [2, 4, 4, 4, 5, 5, 7, 9]
print("mean:", np.mean(scores))
print("variance:", np.var(scores))
print("std:", np.std(scores))
`, note: 'Same answers as doing it by hand — but much less typing!' },
            { tip: 'AI models watch the mean and std of their numbers during training to check nothing is exploding or vanishing.' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                '**Mean** = add up, divide by how many. The "fair share".',
                '**Variance** = average squared distance from the mean.',
                '**Standard deviation** = √variance — a typical distance from the mean.',
                'NumPy: `np.mean`, `np.var`, `np.std`.',
              ],
            },
            { big: 'Two labs: one by hand, one with NumPy. You\'ve got this! 📊' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-mean-hand',
          title: 'Mean by hand',
          xp: XP.code,
          task: 'Write `average(nums)` without NumPy: add the numbers up and divide by how many there are.',
          steps: [
            'Use `sum(nums)` to add them all up.',
            'Use `len(nums)` to count them.',
            'Return the sum divided by the count.',
          ],
          starter: py`
def average(nums):
    # Add up all the numbers, then divide by how many there are.
    pass


print(average([2, 4, 6, 8]))  # 5.0
`,
          solution: py`
def average(nums):
    return sum(nums) / len(nums)


print(average([2, 4, 6, 8]))  # 5.0
`,
          tests: [
            { name: 'sweets example', code: py`
_r = average([2, 4, 6, 8])
assert _r == 5, f"expected 5, got {_r!r}"
` },
            { name: 'works with decimals', fail: 'Divide by len(nums), not a fixed number', code: py`
_r = average([1, 2])
assert _r == 1.5, f"expected 1.5, got {_r!r}"
` },
            { name: 'no NumPy needed', fail: 'Try it with sum() and len() only', code: py`
assert "numpy" not in __source__
` },
          ],
          hints: [
            '`sum([2, 4, 6, 8])` gives 20.',
            '`len([2, 4, 6, 8])` gives 4.',
            '`return sum(nums) / len(nums)`',
          ],
        },
        {
          type: 'code',
          id: 'prob-stats-lab',
          title: 'Describe a dataset with NumPy',
          xp: XP.code,
          numpy: true,
          task: 'Write `describe(arr)` that returns three numbers together: `(mean, variance, std)`, using NumPy.',
          steps: [
            'Work out `np.mean(arr)`, `np.var(arr)` and `np.std(arr)`.',
            'Return all three together in brackets, separated by commas: `(a, b, c)`.',
          ],
          starter: py`
import numpy as np


def describe(arr):
    # Return (mean, variance, std) using np.mean, np.var and np.std
    pass


print(describe([2, 4, 4, 4, 5, 5, 7, 9]))  # (5.0, 4.0, 2.0)
`,
          solution: py`
import numpy as np


def describe(arr):
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
            { name: 'standard deviation', fail: 'std is the square root of variance — np.std does it', code: py`
_r = describe([2, 4, 4, 4, 5, 5, 7, 9])
assert abs(_r[2] - 2) < 1e-9, f"expected 2, got {_r[2]!r}"
` },
          ],
          hints: [
            'NumPy has one function for each: `np.mean`, `np.var`, `np.std`.',
            'Return them together as a tuple: `return (a, b, c)`.',
            '`return (np.mean(arr), np.var(arr), np.std(arr))`',
          ],
        },
      ],
    },

    // ─────────────────────────────── 7. NORMALIZATION ───────────────────────────────
    {
      id: 'prob-normalize',
      title: 'Normalization: putting numbers on the same scale',
      minutes: 8,
      learn: [
        {
          title: 'Apples and watermelons',
          blocks: [
            'Imagine describing fruit with two numbers: **weight in grams** (like 150 or 5000) and **sweetness from 1 to 10**.',
            'The weight numbers are HUGE compared with sweetness. A computer might think weight is far more important, just because its numbers are bigger!',
            { big: 'Normalization squishes numbers so they all use the same scale.' },
            { analogy: 'It\'s like converting everyone\'s test score into "out of 100", even if one test was out of 20 and another out of 50. Now you can compare fairly.', emoji: '📏' },
            { words: [['normalization', 'changing numbers so they share the same scale, like 0 to 1'], ['scale', 'the range numbers usually live in']] },
          ],
        },
        {
          title: 'Min-max: squash into 0 to 1',
          blocks: [
            'The simplest trick is **min-max scaling**. The smallest number becomes 0, the biggest becomes 1, and everything else lands in between.',
            { code: 'new = (x - smallest) / (biggest - smallest)' },
            'Let\'s do `[10, 20, 30]` slowly:',
            {
              steps: [
                'Smallest = **10**, biggest = **30**, so the range is `30 - 10 = 20`.',
                '10 → `(10 - 10) / 20 = 0`',
                '20 → `(20 - 10) / 20 = 0.5`',
                '30 → `(30 - 10) / 20 = 1`',
              ],
            },
            { boxes: ['0', '0.5', '1'], labels: ['was 10', 'was 20', 'was 30'], caption: 'scaled' },
          ],
        },
        {
          title: 'Try min-max in Python',
          blocks: [
            { tryit: py`
heights = [120, 150, 135, 160]
low = min(heights)
high = max(heights)
scaled = [(h - low) / (high - low) for h in heights]
print(scaled)
`, note: 'The shortest becomes 0 and the tallest becomes 1.' },
            'NumPy can do the maths on a whole array at once — no loop needed:',
            { tryit: py`
import numpy as np

x = np.array([10.0, 20.0, 30.0])
print((x - x.min()) / (x.max() - x.min()))
`, note: 'Each number gets the same treatment automatically.' },
            {
              quick: {
                q: 'Min-max scale [0, 5, 10]. What does 5 become?',
                options: ['0', '0.5', '5', '1'],
                answer: 1,
                explain: '(5 - 0) / (10 - 0) = 0.5 — it\'s exactly in the middle.',
              },
            },
          ],
        },
        {
          title: 'Z-scores: centre at 0',
          blocks: [
            'Another popular trick is the **z-score** (also called *standardizing*). It uses the mean and standard deviation from the last lesson:',
            { code: 'z = (x - mean) / std' },
            'After this, the numbers have a mean of **0** and a standard deviation of **1**. A z-score says "how many standard deviations above or below average" a number is.',
            { tryit: py`
import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0, 10.0])
z = (x - x.mean()) / x.std()
print("z-scores:", z.round(2))
print("new mean:", round(z.mean(), 6), " new std:", round(z.std(), 6))
`, note: 'The 10 has a big z-score — it\'s far above average.' },
            { words: [['z-score', 'how many standard deviations a number is above (+) or below (−) the mean']] },
          ],
        },
        {
          title: 'Why AI loves normalization',
          blocks: [
            'Neural networks learn much better when their numbers are small and on similar scales. Huge numbers make learning wobbly.',
            'Chatbots use a step called **LayerNorm** inside every layer — it\'s z-scoring, applied to the list of numbers for each word, over and over.',
            { tip: 'Normalizing is like tidying up before you start working. Everything is easier when it\'s neat!' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                'Normalization puts numbers on the same scale so none "shouts" louder.',
                '**Min-max**: `(x - min) / (max - min)` → everything between 0 and 1.',
                '**Z-score**: `(x - mean) / std` → mean 0, std 1.',
                'Chatbots normalize inside every layer (LayerNorm).',
              ],
            },
            { big: 'Time to squash some numbers! 🗜️' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-norm',
          title: 'Squash to 0–1',
          xp: XP.code,
          numpy: true,
          task: 'Write `min_max(x)` (scale to 0–1) and `z_score(x)` (mean 0, std 1). Both get a list and return a NumPy array.',
          steps: [
            'Turn the list into an array first: `x = np.array(x, dtype=float)`.',
            'For `min_max`, return `(x - x.min()) / (x.max() - x.min())`.',
            'For `z_score`, return `(x - x.mean()) / x.std()`.',
          ],
          starter: py`
import numpy as np


def min_max(x):
    x = np.array(x, dtype=float)
    # return (x - smallest) / (biggest - smallest)
    pass


def z_score(x):
    x = np.array(x, dtype=float)
    # return (x - mean) / std
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
            { name: 'min_max([10, 20, 30]) → [0, 0.5, 1]', code: py`
import numpy as _np
_r = min_max([10, 20, 30])
assert _r is not None and _np.allclose(_r, [0, 0.5, 1]), f"got {_r!r}"
` },
            { name: 'min_max goes exactly from 0 to 1', code: py`
_r = min_max([3, -2, 7, 1])
assert _r is not None and abs(min(_r)) < 1e-9 and abs(max(_r) - 1) < 1e-9, f"got {_r!r}"
` },
            { name: 'z_score has mean 0 and std 1', fail: 'Subtract the mean, then divide by the std', code: py`
import numpy as _np
_r = z_score([1, 2, 3, 4, 10])
assert _r is not None and abs(_np.mean(_r)) < 1e-9 and abs(_np.std(_r) - 1) < 1e-9, f"got {_r!r}"
` },
          ],
          hints: [
            'Arrays have handy methods: `x.min()`, `x.max()`, `x.mean()`, `x.std()`.',
            'min_max: subtract the smallest, then divide by (biggest − smallest).',
            '`return (x - x.min()) / (x.max() - x.min())` and `return (x - x.mean()) / x.std()`.',
          ],
        },
      ],
    },

    // ─────────────────────────────── 8. SOFTMAX ───────────────────────────────
    {
      id: 'prob-softmax',
      title: 'Softmax: turning scores into probabilities',
      minutes: 9,
      learn: [
        {
          title: 'Scores are not probabilities (yet)',
          blocks: [
            'Inside a chatbot, each possible next word first gets a **score**. Bigger score = the model likes that word more.',
            { table: { head: ['Word', 'Score'], rows: [['mat', '3.0'], ['floor', '2.0'], ['moon', '-1.0']] } },
            'But scores can be negative and don\'t add up to 1, so they aren\'t probabilities. We need a way to convert them.',
            { big: 'Softmax turns any list of scores into probabilities that add up to 1.' },
            { words: [['score (logit)', 'a raw number showing how much the model likes an option; can be any size, even negative'], ['softmax', 'a recipe that turns scores into probabilities']] },
          ],
        },
        {
          title: 'Step 1: make everything positive',
          blocks: [
            'Probabilities can\'t be negative. Softmax uses a special function called **exp** (exponential). It turns **any** number into a positive number — and bigger numbers into *much* bigger numbers.',
            { table: { head: ['score', 'exp(score)'], rows: [['-1', '0.37'], ['0', '1'], ['1', '2.72'], ['2', '7.39'], ['3', '20.09']] } },
            { tryit: py`
import math

for score in [-1, 0, 1, 2, 3]:
    print(score, "->", round(math.exp(score), 2))
`, note: 'Every result is positive, and they grow fast!' },
            { analogy: 'exp is like a magnifying glass for "liking": a little extra score makes a much bigger number. The favourite gets an extra boost.', emoji: '🔍' },
          ],
        },
        {
          title: 'Step 2: share out to make 1',
          blocks: [
            'Now divide each positive number by the **total**, so they add up to 1 — exactly like turning counts into probabilities!',
            'Let\'s do scores `[3, 2, -1]` slowly:',
            {
              steps: [
                'exp each one: `20.09`, `7.39`, `0.37`.',
                'Add them up: `20.09 + 7.39 + 0.37 = 27.85`.',
                'Divide each by 27.85: `0.72`, `0.27`, `0.01`.',
                'Check: `0.72 + 0.27 + 0.01 = 1`. ✅',
              ],
            },
            'So "mat" gets a 72% chance, "floor" 27%, and "moon" only 1%.',
          ],
        },
        {
          title: 'Softmax in Python',
          blocks: [
            { tryit: py`
import math

scores = [3.0, 2.0, -1.0]
exps = [math.exp(s) for s in scores]
total = sum(exps)
probs = [e / total for e in exps]
print([round(p, 2) for p in probs])
print("adds up to:", sum(probs))
`, note: 'Change the scores. However you change them, the probabilities still add up to 1!' },
            {
              quick: {
                q: 'Scores are [5, 5]. What does softmax give?',
                options: ['[1, 1]', '[0.5, 0.5]', '[5, 5]', '[0, 1]'],
                answer: 1,
                explain: 'Equal scores give equal probabilities, and they must add up to 1: 0.5 each.',
              },
            },
            { tip: 'The biggest score always gets the biggest probability. Softmax never changes the order — it just converts to chances.' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                'Models give each option a **score** (logit) — any number.',
                'Softmax: **exp** every score (makes them positive), then **divide by the total** (makes them add to 1).',
                'Bigger score → bigger probability.',
                'Chatbots run softmax every time they pick a word.',
              ],
            },
            { big: 'Now write your own softmax! ✨' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-softmax-lab',
          title: 'Write softmax',
          xp: XP.code,
          task: 'Write `softmax(scores)` that turns a list of scores into a list of probabilities that add up to 1.',
          steps: [
            'Make a new list with `math.exp` of every score.',
            'Add that list up to get the `total`.',
            'Return a list where each exp value is divided by the total.',
          ],
          starter: py`
import math


def softmax(scores):
    # 1. exps = math.exp of every score
    # 2. total = sum of exps
    # 3. return each exp divided by total
    pass


print(softmax([3.0, 2.0, -1.0]))  # about [0.72, 0.27, 0.01]
`,
          solution: py`
import math


def softmax(scores):
    exps = [math.exp(s) for s in scores]
    total = sum(exps)
    return [e / total for e in exps]


print(softmax([3.0, 2.0, -1.0]))  # about [0.72, 0.27, 0.01]
`,
          tests: [
            { name: 'adds up to 1', fail: 'Divide every exp by the same total', code: py`
_r = softmax([3.0, 2.0, -1.0])
assert _r is not None and abs(sum(_r) - 1) < 1e-9, f"got {_r!r}"
` },
            { name: 'right values', code: py`
_r = softmax([3.0, 2.0, -1.0])
assert abs(_r[0] - 0.7214) < 1e-3 and abs(_r[2] - 0.0132) < 1e-3, f"got {_r!r}"
` },
            { name: 'equal scores → equal chances', code: py`
_r = softmax([5, 5])
assert abs(_r[0] - 0.5) < 1e-9 and abs(_r[1] - 0.5) < 1e-9, f"got {_r!r}"
` },
          ],
          hints: [
            'A list comprehension makes the exps: `[math.exp(s) for s in scores]`.',
            '`total = sum(exps)`',
            '`return [e / total for e in exps]`',
          ],
        },
      ],
    },

    // ─────────────────────────────── 9. SAMPLING & TEMPERATURE ───────────────────────────────
    {
      id: 'prob-sampling',
      title: 'Sampling & temperature',
      minutes: 10,
      learn: [
        {
          title: 'Picking a word: the spinner',
          blocks: [
            'Once a chatbot has probabilities for every next word, it has to actually **pick one**. Picking at random, using the probabilities, is called **sampling**.',
            { analogy: 'Picture a spinner wheel. "mat" gets a big 70% slice, "floor" a 25% slice, "moon" a tiny 5% slice. Spin it! Usually you land on "mat", but sometimes you get a surprise.', emoji: '🎡' },
            { words: [['sampling', 'picking a result at random, where likely results get picked more often']] },
          ],
        },
        {
          title: 'Sampling in Python',
          blocks: [
            'NumPy\'s `np.random.choice` is a spinner. Give it the options and their probabilities with `p=`:',
            { tryit: py`
import numpy as np

words = ["mat", "floor", "moon"]
probs = [0.70, 0.25, 0.05]
picks = np.random.choice(words, size=20, p=probs)
print(list(picks))
`, note: 'Run it a few times — mostly "mat", a few "floor", and a rare "moon".' },
            { tip: '`size=20` means "spin 20 times". The probabilities in `p` must add up to 1.' },
            {
              quick: {
                q: 'If you sample 1,000 times with probability 0.70 for "mat", about how many "mat"s will you get?',
                options: ['About 70', 'About 700', 'Exactly 1,000', 'About 250'],
                answer: 1,
                explain: '0.70 × 1,000 = 700. It won\'t be *exactly* 700 — randomness wobbles — but close.',
              },
            },
          ],
        },
        {
          title: 'Temperature: the creativity dial',
          blocks: [
            'Chatbots have a setting called **temperature**. It changes how bold the spinner is.',
            'Before softmax, every score is **divided by the temperature**:',
            { code: 'probabilities = softmax(scores / temperature)' },
            {
              table: {
                head: ['Temperature', 'What happens', 'Feels like'],
                rows: [
                  ['Low (like 0.2)', 'The favourite word gets almost all the probability', 'Careful, predictable, a bit boring'],
                  ['1', 'Normal — as the model learned it', 'Balanced'],
                  ['High (like 2)', 'All words get closer to equal chances', 'Creative, surprising, sometimes silly'],
                ],
              },
            },
            { words: [['temperature', 'a dial that makes sampling more predictable (low) or more random (high)']] },
          ],
        },
        {
          title: 'See it with numbers',
          blocks: [
            { tryit: py`
import numpy as np

def softmax_t(scores, T):
    z = np.array(scores) / T
    e = np.exp(z - z.max())
    return e / e.sum()

scores = [3.0, 2.0, 0.5]
for T in [0.2, 1.0, 3.0]:
    print("T =", T, "->", softmax_t(scores, T).round(2))
`, note: 'At T = 0.2 the first word takes almost everything. At T = 3 it\'s much more even.' },
            { tip: '`z - z.max()` is a safety trick: it stops `exp` making numbers too huge for the computer. It doesn\'t change the answer.' },
            'Below is a playground — drag the temperature slider and watch the bars change shape!',
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                '**Sampling** = spinning a spinner where each word\'s slice is its probability.',
                '`np.random.choice(words, size=n, p=probs)` does the spinning.',
                '**Temperature** divides the scores before softmax.',
                'Low temperature → predictable. High temperature → creative and random.',
              ],
            },
            { big: 'Play with the temperature dial, then code a sampler! 🌡️' },
          ],
        },
      ],
      activities: [
        { type: 'viz', id: 'viz-temp', title: 'Temperature playground', component: 'TemperatureViz', xp: XP.viz },
        {
          type: 'code',
          id: 'prob-sample',
          title: 'Softmax, temperature & sampling',
          xp: XP.code,
          numpy: true,
          task: 'Write `softmax_with_temperature(logits, T)` and `sample_tokens(tokens, probs, n)`.',
          steps: [
            'In `softmax_with_temperature`: divide the scores by `T` (make an array first).',
            'Subtract the biggest value (safety trick), take `np.exp`, then divide by the sum.',
            'In `sample_tokens`: use `np.random.choice(tokens, size=n, p=probs)` and wrap it in `list(...)`.',
          ],
          starter: py`
import numpy as np


def softmax_with_temperature(logits, T):
    z = np.array(logits, dtype=float) / T
    # Now: subtract z.max(), take np.exp, divide by the sum
    pass


def sample_tokens(tokens, probs, n):
    # Spin the spinner n times with np.random.choice. Return a list.
    pass


p = softmax_with_temperature([2.0, 1.0, 0.1], T=1.0)
print(p)
print(sample_tokens(["cat", "dog", "fish"], p, 5))
`,
          solution: py`
import numpy as np


def softmax_with_temperature(logits, T):
    z = np.array(logits, dtype=float) / T
    e = np.exp(z - z.max())
    return e / e.sum()


def sample_tokens(tokens, probs, n):
    return list(np.random.choice(tokens, size=n, p=probs))


p = softmax_with_temperature([2.0, 1.0, 0.1], T=1.0)
print(p)
print(sample_tokens(["cat", "dog", "fish"], p, 5))
`,
          tests: [
            { name: 'softmax adds up to 1', code: py`
import numpy as _np
_r = softmax_with_temperature([2.0, 1.0, 0.1], 1.0)
assert _r is not None and abs(_np.sum(_r) - 1) < 1e-9, f"got {_r!r}"
` },
            { name: 'T = 1 is normal softmax', code: py`
import numpy as _np
_r = softmax_with_temperature([2.0, 1.0, 0.0], 1.0)
_e = _np.exp([2.0, 1.0, 0.0]); _e = _e / _e.sum()
assert _np.allclose(_r, _e), f"got {_r!r}"
` },
            { name: 'low temperature sharpens', fail: 'Divide the scores by T before the softmax', code: py`
import numpy as _np
assert _np.max(softmax_with_temperature([2.0, 1.0, 0.0], 0.5)) > _np.max(softmax_with_temperature([2.0, 1.0, 0.0], 1.0)) + 0.05
` },
            { name: 'sample_tokens returns n real tokens', code: py`
_s = sample_tokens(["a", "b", "c"], [0.2, 0.3, 0.5], 20)
assert _s is not None and len(list(_s)) == 20, f"got {_s!r}"
assert all(t in ("a", "b", "c") for t in _s)
` },
            { name: 'samples follow the probabilities', fail: 'Pass the probabilities as p= to np.random.choice', code: py`
_s = list(sample_tokens(["a", "b"], [0.8, 0.2], 4000))
_frac = _s.count("a") / len(_s)
assert abs(_frac - 0.8) < 0.05, f"'a' came up {_frac:.0%} of the time, expected about 80%"
` },
          ],
          hints: [
            'The starter already divides by T. Next: `e = np.exp(z - z.max())`.',
            'Then `return e / e.sum()`.',
            'For sampling: `return list(np.random.choice(tokens, size=n, p=probs))`.',
          ],
        },
      ],
    },

    // ─────────────────────────────── 10. METRICS ───────────────────────────────
    {
      id: 'prob-metrics',
      title: 'Accuracy, precision & recall',
      minutes: 10,
      learn: [
        {
          title: 'How good is my model?',
          blocks: [
            'Imagine a robot that looks at photos and says **"cat!"** or **"not a cat"**. How do we grade it?',
            'The easiest grade is **accuracy**: how many answers were right, out of all answers.',
            { code: 'accuracy = right answers / all answers' },
            'If the robot got 8 out of 10 photos right, accuracy = `8 ÷ 10 = 0.8` (80%).',
            { words: [['model', 'a computer program that makes predictions'], ['accuracy', 'the fraction of predictions that were correct']] },
          ],
        },
        {
          title: 'The sneaky problem with accuracy',
          blocks: [
            'Suppose only **1** photo in 100 has a cat. A lazy robot that ALWAYS says "not a cat" is right 99 times out of 100.',
            { big: '99% accuracy… and it never found a single cat! 😹' },
            'Accuracy alone can be fooled. We need better questions.',
            {
              quick: {
                q: 'A spam filter never marks anything as spam. 2% of emails are spam. What is its accuracy?',
                options: ['2%', '50%', '98%', '0%'],
                answer: 2,
                explain: 'It\'s right on all the 98% normal emails — but useless at catching spam!',
              },
            },
          ],
        },
        {
          title: 'The four kinds of answer',
          blocks: [
            'Every answer falls into one of four boxes:',
            {
              table: {
                head: ['', 'Robot says "cat"', 'Robot says "not cat"'],
                rows: [
                  ['**Really a cat**', '✅ True Positive (TP)', '❌ False Negative (FN) — missed it'],
                  ['**Not a cat**', '❌ False Positive (FP) — false alarm', '✅ True Negative (TN)'],
                ],
              },
            },
            '"Positive" means the robot said **yes**. "True" or "False" says whether it was right.',
            { words: [['true positive', 'said yes, and it really was yes'], ['false positive', 'said yes, but it was really no (a false alarm)'], ['false negative', 'said no, but it was really yes (a miss)']] },
          ],
        },
        {
          title: 'Precision and recall',
          blocks: [
            '**Precision** asks: *"When the robot shouts cat, how often is it right?"*',
            { code: 'precision = TP / (TP + FP)' },
            '**Recall** asks: *"Of all the real cats, how many did the robot find?"*',
            { code: 'recall = TP / (TP + FN)' },
            { analogy: 'Fishing with a net: **precision** = how much of what you caught is actually fish (not boots). **Recall** = how many of the fish in the lake you caught.', emoji: '🎣' },
            { words: [['precision', 'of everything you said YES to, the fraction that was really yes'], ['recall', 'of all the real YES things, the fraction you found']] },
          ],
        },
        {
          title: 'A worked example',
          blocks: [
            'Six photos. `1` = cat, `0` = not cat.',
            { table: { head: ['Photo', '1', '2', '3', '4', '5', '6'], rows: [['Really', '1', '0', '1', '1', '0', '0'], ['Robot said', '1', '1', '0', '1', '1', '0']] } },
            {
              steps: [
                'TP (both 1): photos 1 and 4 → **2**.',
                'FP (robot 1, really 0): photos 2 and 5 → **2**.',
                'FN (robot 0, really 1): photo 3 → **1**.',
                'Right answers: photos 1, 4 and 6 → **3** of 6. Accuracy = **0.5**.',
                'Precision = `2 / (2 + 2) = 0.5`. Recall = `2 / (2 + 1) = 0.67`.',
              ],
            },
            { tryit: py`
really = [1, 0, 1, 1, 0, 0]
robot  = [1, 1, 0, 1, 1, 0]
tp = fp = fn = 0
for r, p in zip(really, robot):
    if r == 1 and p == 1: tp += 1
    if r == 0 and p == 1: fp += 1
    if r == 1 and p == 0: fn += 1
print("TP:", tp, "FP:", fp, "FN:", fn)
print("precision:", tp / (tp + fp), " recall:", round(tp / (tp + fn), 2))
`, note: '`zip` walks through both lists side by side.' },
          ],
        },
        {
          title: 'Recap',
          blocks: [
            {
              list: [
                '**Accuracy** = right ÷ all. Easy, but can be fooled.',
                '**Precision** = TP ÷ (TP + FP): when I say yes, am I right?',
                '**Recall** = TP ÷ (TP + FN): did I find all the yeses?',
                'If there are no yes-guesses at all, we say precision is 0 (to avoid dividing by zero).',
              ],
            },
            { big: 'Let\'s grade a robot! 🤖' },
          ],
        },
      ],
      activities: [
        {
          type: 'code',
          id: 'prob-metrics-lab',
          title: 'Grade a classifier',
          xp: XP.code,
          task: 'Write `metrics(y_true, y_pred)` that returns `(accuracy, precision, recall)` for lists of 0s and 1s.',
          steps: [
            'Walk through both lists together with `zip(y_true, y_pred)` and count TP, FP and FN — and how many were right.',
            'accuracy = right ÷ total.',
            'precision = TP ÷ (TP + FP), but use `0.0` if TP + FP is 0.',
            'recall = TP ÷ (TP + FN), but use `0.0` if TP + FN is 0.',
          ],
          starter: py`
def metrics(y_true, y_pred):
    tp = 0
    fp = 0
    fn = 0
    right = 0
    for t, p in zip(y_true, y_pred):
        # add 1 to the right counters here
        pass

    # work out accuracy, precision and recall, then return all three
    pass


print(metrics([1, 0, 1, 1, 0, 0], [1, 1, 0, 1, 1, 0]))  # (0.5, 0.5, 0.666...)
`,
          solution: py`
def metrics(y_true, y_pred):
    tp = 0
    fp = 0
    fn = 0
    right = 0
    for t, p in zip(y_true, y_pred):
        if t == 1 and p == 1:
            tp += 1
        if t == 0 and p == 1:
            fp += 1
        if t == 1 and p == 0:
            fn += 1
        if t == p:
            right += 1

    accuracy = right / len(y_true)
    precision = tp / (tp + fp) if tp + fp > 0 else 0.0
    recall = tp / (tp + fn) if tp + fn > 0 else 0.0
    return (accuracy, precision, recall)


print(metrics([1, 0, 1, 1, 0, 0], [1, 1, 0, 1, 1, 0]))  # (0.5, 0.5, 0.666...)
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
            { name: 'no "yes" guesses → precision 0 (no crash)', fail: 'Check for zero before dividing', code: py`
_r = metrics([1, 0], [0, 0])
assert tuple(_r) == (0.5, 0.0, 0.0), f"got {_r!r}"
` },
          ],
          hints: [
            'Inside the loop: `if t == 1 and p == 1: tp += 1` — and similar lines for fp, fn and right.',
            'accuracy is `right / len(y_true)`.',
            'Guard the division: `precision = tp / (tp + fp) if tp + fp > 0 else 0.0`.',
          ],
        },
      ],
    },

    // ─────────────────────────────── 11. CHECKPOINT ───────────────────────────────
    {
      id: 'prob-checkpoint',
      title: 'Checkpoint: think like a sampler',
      minutes: 6,
      checkpoint: true,
      learn: [
        {
          title: 'Look how far you\'ve come!',
          blocks: [
            { big: 'You started with coin flips. Now you understand how a chatbot picks its words. 🎉' },
            'Here\'s the whole journey in one picture:',
            {
              steps: [
                'Count what usually comes next → **probabilities** (conditional: given the words so far).',
                'A model gives each word a **score**.',
                '**Softmax** turns scores into probabilities.',
                '**Temperature** makes it careful or creative.',
                '**Sampling** spins the spinner to pick the word.',
                '**Accuracy, precision and recall** tell us how good a model is.',
              ],
            },
          ],
        },
        {
          title: 'Quick warm-up',
          blocks: [
            {
              quick: {
                q: 'What do all the probabilities for every possible next word add up to?',
                options: ['0', '1', '100', 'It depends'],
                answer: 1,
                explain: 'The next word has to be *something*, so all the chances together make 1.',
              },
            },
            {
              quick: {
                q: 'Which number tells you how spread out some data is?',
                options: ['The mean', 'The standard deviation', 'The temperature', 'The total'],
                answer: 1,
                explain: 'Standard deviation measures spread. The mean measures the middle.',
              },
            },
            { tip: 'Ready? The quiz below is the real checkpoint. Wrong answers just get a nudge — take your time!' },
          ],
        },
      ],
      activities: [
        {
          type: 'quiz',
          id: 'prob-checkpoint-quiz',
          title: 'Temperature, chances & conditionals',
          xp: XP.quiz,
          questions: [
            {
              q: 'You roll a normal dice. What is the probability of rolling a 1 or a 2?',
              options: ['1/6', '2/6', '1/2', '2'],
              answer: 1,
              explain: '2 wanted outcomes out of 6 possible: 2/6 (about 0.33).',
            },
            {
              q: 'You lower the temperature from 1.0 to 0.2. What happens?',
              options: [
                'Outputs become more random and creative',
                'The most likely words get even more likely — outputs become more predictable',
                'Nothing — temperature only changes speed',
                'The model forgets the question',
              ],
              answer: 1,
              explain: 'Dividing scores by a small temperature stretches the gaps, so softmax piles probability onto the favourite words.',
            },
            {
              q: 'Why is next-word prediction a conditional probability?',
              options: [
                'Because it only works when the internet is on',
                'The model works out P(next word | all the words before it) — the earlier words are the "given"',
                'Because every word is equally likely',
                'Because probabilities are always 0.5',
              ],
              answer: 1,
              explain: 'Change the words before, and the chances for the next word change too.',
            },
            {
              q: 'Very high temperature (like 5) makes the probabilities…',
              options: ['Sharper', 'Flatter — closer to all equal', 'Negative', 'Add up to more than 1'],
              answer: 1,
              explain: 'A big temperature shrinks all the scores toward each other, so every word looks similar.',
            },
            {
              q: 'Softmax turns the scores [2, 2, 2] into…',
              options: ['[2, 2, 2]', '[1/3, 1/3, 1/3]', '[1, 0, 0]', '[0, 0, 0]'],
              answer: 1,
              explain: 'Equal scores → equal probabilities, adding up to 1.',
            },
            {
              q: 'A medical test should almost never MISS someone who is ill. Which number matters most?',
              options: ['Precision', 'Recall', 'Accuracy', 'Temperature'],
              answer: 1,
              explain: 'Recall = how many of the real cases you found. A miss is a false negative, which lowers recall.',
            },
          ],
        },
      ],
    },
  ],
}
