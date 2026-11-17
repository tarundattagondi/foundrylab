// Python module, part 1: absolute basics (no experience needed).
import { py, XP } from '../helpers.js'

export default [
  // ───────────────────────── 1. HELLO ─────────────────────────
  {
    id: 'py-hello',
    title: 'Hello, computer! Your first program',
    minutes: 6,
    learn: [
      {
        title: 'What is a program?',
        blocks: [
          { big: 'A program is a list of instructions for a computer.' },
          'Computers are super fast, but they are not smart on their own. They do *exactly* what you tell them — nothing more, nothing less.',
          { analogy: 'A program is like a recipe. A recipe says: "1. Crack 2 eggs. 2. Stir. 3. Cook for 3 minutes." The cook follows the steps in order. The computer is the cook, and you write the recipe!', emoji: '🍳' },
          'Writing these instructions is called **programming** or **coding**. People who do it are called **programmers**. Today, that includes you. 🎉',
        ],
      },
      {
        title: 'What is Python?',
        blocks: [
          'Computers only understand 0s and 1s. That is very hard for humans to write. So people invented **programming languages** — special languages that are easy for humans *and* can be translated for the computer.',
          '**Python** is one of the most popular programming languages in the world. It is famous for being easy to read — it looks a lot like English.',
          { tip: 'Almost every AI tool you have heard of — ChatGPT, image generators, self-driving car software — was built using Python. That is why we start here!' },
          { words: [['program', 'a list of instructions for a computer'], ['code', 'the instructions you write'], ['Python', 'a programming language that is easy to read']] },
        ],
      },
      {
        title: 'Your first instruction: print',
        blocks: [
          'The very first thing every programmer learns is how to make the computer *say* something. In Python we use `print`.',
          { code: 'print("Hello, world!")' },
          { steps: ['`print` is the name of the instruction. It means "show this on the screen".', 'The round brackets `( )` hold what you want to show.', 'The quote marks `" "` go around the words, so Python knows they are text.'] },
          { tryit: py`print("Hello, world!")`, note: 'Press Run and watch the computer talk!' },
        ],
      },
      {
        title: 'Make it say anything',
        blocks: [
          'You can put any words inside the quotes. Try changing the message below to your own name!',
          { tryit: py`print("My name is Sam")
print("I am learning Python!")`, note: 'Change "Sam" to your name, then press Run.' },
          'Notice: we used **two** print lines, and the computer showed **two** lines. Python runs your code **from top to bottom**, one line at a time — just like reading a book.',
          { quick: { q: 'What will `print("pizza")` show on the screen?', options: ['print("pizza")', 'pizza', '"pizza"', 'Nothing'], answer: 1, explain: 'print shows just the text inside the quotes — the quotes themselves are not shown.' } },
        ],
      },
      {
        title: 'Text vs numbers',
        blocks: [
          'Text in quotes is called a **string** (think: a string of letters, like beads on a string 📿).',
          'Numbers do **not** need quotes. And Python can do math with them!',
          { tryit: py`print(2 + 3)
print("2 + 3")`, note: 'Spot the difference between the two lines!' },
          'The first line does the math and shows `5`. The second line has quotes, so Python treats it as text and shows it exactly as written.',
          { quick: { q: 'What does `print(10 - 4)` show?', options: ['10 - 4', '6', '"6"', '104'], answer: 1, explain: 'No quotes means Python does the math: 10 − 4 = 6.' } },
        ],
      },
      {
        title: 'Mistakes are totally normal',
        blocks: [
          'If you make a typo, Python shows an **error message**. That is not the computer being angry — it is the computer asking for help!',
          { tryit: py`print("Hello"`, note: 'This one has a mistake on purpose. Run it and read the message.', expectError: true },
          'The error says something is wrong with the brackets. Every `(` needs a matching `)`. Try fixing it by adding `)` at the end, then run again!',
          { tip: 'Every programmer — even experts with 20 years of experience — sees errors every single day. Reading them carefully is a superpower.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['A **program** is a recipe of instructions for a computer.', '**Python** is an easy-to-read programming language used for AI.', '`print(...)` shows things on the screen.', 'Text goes inside quotes: `"hello"`. Numbers don\'t need quotes.', 'Python runs code from top to bottom.', 'Errors are normal — read them, fix, try again.'] },
          { big: 'You are officially a programmer now. 🎉' },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-hello-lab',
        title: 'Say hello!',
        xp: XP.code,
        task: 'Make the computer print two lines: `Hello, world!` and then `I am learning Python!`',
        steps: ['On the first line, write `print("Hello, world!")`', 'On the second line, print `I am learning Python!` the same way.', 'Press **Run** to see it, then **Check**.'],
        starter: py`
# Write your two print lines below this line.
`,
        solution: py`
print("Hello, world!")
print("I am learning Python!")
`,
        tests: [
          { name: 'prints "Hello, world!"', fail: 'Check the spelling, the comma and the !', code: py`
assert "Hello, world!" in __stdout__, f"the screen showed {__stdout__!r}"
` },
          { name: 'prints "I am learning Python!"', code: py`
assert "I am learning Python!" in __stdout__, f"the screen showed {__stdout__!r}"
` },
          { name: 'prints them in order', fail: 'Hello first, then the second line', code: py`
assert __stdout__.find("Hello, world!") < __stdout__.find("I am learning Python!")
` },
        ],
        hints: ['Lines that start with `#` are notes for humans — Python ignores them. Write your code under it.', 'Each line looks like `print("some words")` — don\'t forget the quotes and brackets.', 'Line 1: `print("Hello, world!")` · Line 2: `print("I am learning Python!")`'],
      },
    ],
  },

  // ───────────────────────── 2. VARIABLES ─────────────────────────
  {
    id: 'py-variables',
    title: 'Variables: labeled boxes',
    minutes: 7,
    learn: [
      {
        title: 'Computers need to remember things',
        blocks: [
          'Imagine a game. It needs to remember your score, your name, and how many lives you have left. How does a program remember things?',
          { big: 'With variables!' },
          { analogy: 'A variable is like a box with a label on it. You write "score" on the label and put the number 10 inside. Later, you can open the box called "score" and find 10.', emoji: '📦' },
        ],
      },
      {
        title: 'Making a variable',
        blocks: [
          { code: 'score = 10' },
          { steps: ['`score` is the label on the box (the variable\'s **name**).', '`=` means "put this into the box". It does NOT mean "equals" like in math class!', '`10` is what goes inside (the **value**).'] },
          { boxes: ['10'], caption: 'score' },
          'Now whenever you write `score`, Python opens the box and uses what is inside.',
          { tryit: py`score = 10
print(score)`, note: 'Notice: no quotes around score — we want the box, not the word.' },
        ],
      },
      {
        title: 'Boxes can hold text too',
        blocks: [
          { tryit: py`name = "Maya"
lives = 3
print(name)
print(lives)`, note: 'Change Maya to your name and run it.' },
          { warn: 'Careful with quotes! `print(name)` shows what is in the box (Maya). `print("name")` shows the word *name* itself.' },
          { quick: { q: 'After `pet = "cat"`, what does `print(pet)` show?', options: ['pet', 'cat', '"cat"', 'Error'], answer: 1, explain: 'pet is the box; inside is the text cat.' } },
        ],
      },
      {
        title: 'Changing what is in the box',
        blocks: [
          'You can put something new in a box any time. The old value is thrown away.',
          { tryit: py`score = 10
print(score)
score = 25
print(score)`, note: 'The box changes from 10 to 25.' },
          'You can even use the box\'s *own* value to make the new one. This is how games add points:',
          { tryit: py`score = 10
score = score + 5
print(score)`, note: 'Read it as: "new score = old score plus 5".' },
          { steps: ['Python looks at the right side first: `score + 5` → `10 + 5` → `15`.', 'Then it puts `15` into the box `score`.'] },
        ],
      },
      {
        title: 'Math with Python',
        blocks: [
          'Python is a great calculator. Here are the math symbols:',
          { table: { head: ['Symbol', 'Meaning', 'Example', 'Answer'], rows: [['`+`', 'add', '`7 + 2`', '9'], ['`-`', 'subtract', '`7 - 2`', '5'], ['`*`', 'multiply', '`7 * 2`', '14'], ['`/`', 'divide', '`7 / 2`', '3.5'], ['`**`', 'power', '`2 ** 3`', '8  (2×2×2)'], ['`//`', 'divide, no remainder', '`7 // 2`', '3'], ['`%`', 'remainder', '`7 % 2`', '1']] } },
          { tryit: py`apples = 12
friends = 4
each = apples / friends
print(each)`, note: '12 apples shared by 4 friends. Try other numbers!' },
        ],
      },
      {
        title: 'Good names for boxes',
        blocks: [
          'Variable names follow a few rules:',
          { list: ['Use letters, numbers and underscores `_` — like `high_score` or `player2`.', 'No spaces! Write `high_score`, not `high score`.', 'Can\'t start with a number: `2player` is not allowed.', 'Capitals matter: `Score` and `score` are two different boxes.'] },
          { tip: 'Pick names that explain what is inside. `minutes_left` is much clearer than `x`.' },
          { quick: { q: 'Which is a valid variable name?', options: ['my score', '1st_place', 'total_points', 'cost$'], answer: 2, explain: 'total_points uses only letters and underscores, and doesn\'t start with a number.' } },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['A **variable** is a labeled box that stores a value.', '`=` means "put into the box", not "equals".', 'Use the name without quotes to get what is inside.', 'You can change a variable: `score = score + 5`.', 'Python can do math: `+ - * / ** // %`.'] },
          { words: [['variable', 'a named box that stores a value'], ['value', 'the thing stored inside (like 10 or "Maya")'], ['assign', 'putting a value into a variable with `=`']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-vars-lab',
        title: 'Your game character',
        xp: XP.code,
        task: 'Create variables for a game character, do a little math, and print the results.',
        steps: ['Make a variable `name` and put your character\'s name in it (in quotes).', 'Make a variable `age` and put a number in it (no quotes).', 'Make `next_year` equal to `age + 1`.', 'Print `name` and `next_year`.'],
        starter: py`
# 1. name = ...
# 2. age = ...
# 3. next_year = ...
# 4. print them
`,
        solution: py`
name = "Robo"
age = 11
next_year = age + 1
print(name)
print(next_year)
`,
        tests: [
          { name: 'name holds some text', fail: 'Make `name` and put text in quotes inside it', code: py`
assert isinstance(globals().get("name"), str) and len(name) > 0
` },
          { name: 'age holds a number', fail: 'Put a number with no quotes into `age`', code: py`
assert isinstance(globals().get("age"), (int, float)) and not isinstance(age, bool)
` },
          { name: 'next_year is age + 1', code: py`
assert globals().get("next_year") == age + 1, f"next_year is {globals().get('next_year')!r} but age + 1 is {age + 1}"
` },
          { name: 'you printed the name and next_year', fail: 'Use print(name) and print(next_year)', code: py`
assert str(name) in __stdout__ and str(next_year) in __stdout__
` },
        ],
        hints: ['Text needs quotes: `name = "Robo"`. Numbers don\'t: `age = 11`.', 'Use the box to make a new box: `next_year = age + 1`.', 'Finish with `print(name)` and `print(next_year)` — no quotes, because you want what is inside the boxes.'],
      },
    ],
  },

  // ───────────────────────── 3. TYPES ─────────────────────────
  {
    id: 'py-types',
    title: 'Kinds of data: numbers, text & True/False',
    minutes: 6,
    learn: [
      {
        title: 'Not all data is the same',
        blocks: [
          'Python stores different **kinds** of information in different ways. These kinds are called **types**.',
          { table: { head: ['Type', 'What it is', 'Examples'], rows: [['`int`', 'whole number (integer)', '`3`, `-7`, `1000`'], ['`float`', 'number with a decimal point', '`3.14`, `0.5`, `-2.0`'], ['`str`', 'text (string)', '`"hi"`, `"42"`, `""`'], ['`bool`', 'yes/no answer (boolean)', '`True`, `False`']] } },
          { analogy: 'Types are like different containers in a kitchen: an egg carton holds eggs, a jug holds juice. You wouldn\'t pour juice into an egg carton!', emoji: '🥚' },
        ],
      },
      {
        title: 'Ask Python: what type is this?',
        blocks: [
          'The `type(...)` instruction tells you what type something is.',
          { tryit: py`print(type(42))
print(type(3.5))
print(type("hello"))
print(type(True))`, note: 'Run it and match each answer to the table.' },
          { quick: { q: 'What type is `"7"` (with quotes)?', options: ['int', 'float', 'str', 'bool'], answer: 2, explain: 'The quotes make it text — a string — even though it looks like a number.' } },
        ],
      },
      {
        title: '"5" is not the same as 5',
        blocks: [
          'This surprises everyone at first:',
          { tryit: py`print(5 + 5)
print("5" + "5")`, note: 'Same-looking numbers, very different answers!' },
          'Numbers **add**. Strings **stick together** (this is called *joining* or *concatenating*). So `"5" + "5"` is `"55"`, like sticking two stickers side by side.',
          { tryit: py`first = "Super"
second = "hero"
print(first + second)`, note: 'Strings glued together.' },
        ],
      },
      {
        title: 'Changing types',
        blocks: [
          'Sometimes you have a number stuck inside text — for example, when someone types their age into a website. You can convert it:',
          { table: { head: ['Instruction', 'Turns into', 'Example'], rows: [['`int("12")`', 'a whole number', '`12`'], ['`float("2.5")`', 'a decimal number', '`2.5`'], ['`str(99)`', 'text', '`"99"`']] } },
          { tryit: py`typed = "12"
age = int(typed)
print(age + 1)`, note: 'Without int(...), the + 1 would cause an error.' },
          { tryit: py`points = 50
message = "You scored " + str(points) + " points!"
print(message)`, note: 'To glue a number into text, turn it into a string first.' },
        ],
      },
      {
        title: 'True and False',
        blocks: [
          'A **bool** has only two possible values: `True` or `False` (with capital letters!). They answer yes/no questions.',
          { tryit: py`print(10 > 3)
print(2 > 8)
is_raining = False
print(is_raining)`, note: 'Python answers comparison questions with True or False.' },
          'We will use True and False a lot in the next lesson, when programs make decisions.',
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['**int** = whole numbers, **float** = decimals, **str** = text, **bool** = True/False.', '`type(x)` tells you the type.', 'Numbers add; strings glue together.', 'Convert with `int()`, `float()`, `str()`.'] },
          { words: [['type', 'the kind of data (int, float, str, bool)'], ['string', 'text inside quotes'], ['boolean', 'a True or False value'], ['convert', 'change a value from one type to another']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-types-lab',
        title: 'Fix the score message',
        xp: XP.code,
        task: 'A game gave you your score as text. Turn it into a number, double it, and build a message.',
        steps: ['Make `number` by converting `text_score` into an int.', 'Make `doubled` equal to `number * 2`.', 'Make `message` equal to `"Score: "` joined with `doubled` (turned into text).', 'Print `message`.'],
        starter: py`
text_score = "21"

number = None      # turn text_score into an int
doubled = None     # number times 2
message = None     # "Score: " + doubled (as text)

print(message)
`,
        solution: py`
text_score = "21"

number = int(text_score)
doubled = number * 2
message = "Score: " + str(doubled)

print(message)
`,
        tests: [
          { name: 'number is the int 21', fail: 'Use int(text_score)', code: py`
assert number == 21 and isinstance(number, int), f"number is {number!r}"
` },
          { name: 'doubled is 42', code: py`
assert doubled == 42, f"doubled is {doubled!r}"
` },
          { name: 'message is "Score: 42"', fail: 'Glue "Score: " and str(doubled) with +', code: py`
assert message == "Score: 42", f"message is {message!r}"
` },
          { name: 'you printed it', code: py`
assert "Score: 42" in __stdout__
` },
        ],
        hints: ['`int("21")` gives the number 21.', '`doubled = number * 2`. To join a number to text, wrap it: `str(doubled)`.', '`message = "Score: " + str(doubled)` — watch the space after the colon.'],
      },
    ],
  },

  // ───────────────────────── 4. IF / ELSE ─────────────────────────
  {
    id: 'py-if',
    title: 'Making decisions: if & else',
    minutes: 7,
    learn: [
      {
        title: 'Programs that choose',
        blocks: [
          'So far, Python ran every line. But real programs make **choices**: "If the player has 0 lives, show Game Over."',
          { analogy: 'It is like a choose-your-own-adventure book: "If you open the door, go to page 12. Otherwise, go to page 30."', emoji: '🚪' },
        ],
      },
      {
        title: 'Asking questions: comparisons',
        blocks: [
          'Before making a choice, you ask a yes/no question. Python answers with `True` or `False`.',
          { table: { head: ['Symbol', 'Question', 'Example', 'Answer'], rows: [['`==`', 'is equal to?', '`5 == 5`', 'True'], ['`!=`', 'is NOT equal to?', '`5 != 3`', 'True'], ['`>`', 'bigger than?', '`2 > 9`', 'False'], ['`<`', 'smaller than?', '`2 < 9`', 'True'], ['`>=`', 'bigger or equal?', '`7 >= 7`', 'True'], ['`<=`', 'smaller or equal?', '`8 <= 7`', 'False']] } },
          { warn: 'One `=` puts a value in a box. Two `==` asks "are these equal?". Mixing them up is the most common beginner mistake.' },
          { tryit: py`age = 12
print(age == 12)
print(age > 18)`, note: 'Change age and run it again.' },
        ],
      },
      {
        title: 'if: do this only when…',
        blocks: [
          { code: 'temperature = 30\nif temperature > 25:\n    print("It is hot! Wear shorts.")' },
          { steps: ['Start with `if`, then the question, then a colon `:`.', 'The next line is pushed in by 4 spaces. This is called **indenting**.', 'Indented lines only run when the answer is `True`.'] },
          { tryit: py`temperature = 30
if temperature > 25:
    print("It is hot! Wear shorts.")
print("Have a nice day!")`, note: 'Change 30 to 10. Which line disappears?' },
          'The last line is NOT indented, so it always runs.',
        ],
      },
      {
        title: 'else: otherwise…',
        blocks: [
          '`else` means "if the answer was False, do this instead".',
          { tryit: py`lives = 0
if lives > 0:
    print("Keep playing!")
else:
    print("Game over!")`, note: 'Try lives = 3.' },
          'And `elif` (short for "else if") lets you check more questions in a row. Python checks them top to bottom and runs only the **first** one that is True.',
          { tryit: py`score = 85
if score >= 90:
    print("Gold medal!")
elif score >= 70:
    print("Silver medal!")
else:
    print("Keep practicing!")`, note: 'Try 95, 75 and 40.' },
        ],
      },
      {
        title: 'and, or, not',
        blocks: [
          'You can combine questions:',
          { table: { head: ['Word', 'Meaning', 'Example'], rows: [['`and`', 'both must be True', '`age > 10 and age < 13`'], ['`or`', 'at least one True', '`day == "Sat" or day == "Sun"`'], ['`not`', 'flips True ↔ False', '`not is_raining`']] } },
          { tryit: py`day = "Sat"
if day == "Sat" or day == "Sun":
    print("Weekend! 🎉")
else:
    print("School day.")`, note: 'Try day = "Mon".' },
          { quick: { q: 'With `x = 5`, is `x > 1 and x < 3` True or False?', options: ['True', 'False'], answer: 1, explain: '5 > 1 is True, but 5 < 3 is False. `and` needs both to be True.' } },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['Comparisons (`== != > < >= <=`) give True or False.', '`if` runs indented code only when the question is True.', '`elif` checks another question; `else` catches everything left.', 'Combine with `and`, `or`, `not`.', 'Don\'t forget the colon `:` and the 4-space indent!'] },
          { words: [['condition', 'a yes/no question like `score > 10`'], ['indent', 'spaces at the start of a line, showing it belongs to the if'], ['elif', '"else if" — another question to check']] },
          { tip: 'AI connection: a spam filter decides "if this email looks like spam, move it to the spam folder". Decisions are everywhere!' },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-if-lab',
        title: 'Medal machine',
        xp: XP.code,
        task: 'Finish `medal(score)` so it **returns** "gold", "silver", "bronze" or "none" depending on the score.',
        steps: ['If score is 90 or more → return `"gold"`.', 'Else if score is 70 or more → return `"silver"`.', 'Else if score is 50 or more → return `"bronze"`.', 'Otherwise → return `"none"`.'],
        starter: py`
def medal(score):
    # Use if / elif / else. Each branch should "return" a word.
    if score >= 90:
        return "gold"
    # add the other checks here

    return "none"


print(medal(95))  # gold
print(medal(75))  # silver
print(medal(55))  # bronze
print(medal(10))  # none
`,
        solution: py`
def medal(score):
    if score >= 90:
        return "gold"
    elif score >= 70:
        return "silver"
    elif score >= 50:
        return "bronze"
    else:
        return "none"


print(medal(95))  # gold
print(medal(75))  # silver
print(medal(55))  # bronze
print(medal(10))  # none
`,
        tests: [
          { name: '95 gets gold', code: py`
assert medal(95) == "gold", f"got {medal(95)!r}"
` },
          { name: '75 gets silver', fail: 'Add elif score >= 70', code: py`
assert medal(75) == "silver", f"got {medal(75)!r}"
` },
          { name: '55 gets bronze', fail: 'Add elif score >= 50', code: py`
assert medal(55) == "bronze", f"got {medal(55)!r}"
` },
          { name: 'exactly 70 is silver (the edge!)', fail: 'Use >= not >', code: py`
assert medal(70) == "silver" and medal(90) == "gold" and medal(50) == "bronze"
` },
          { name: '10 gets none', code: py`
assert medal(10) == "none", f"got {medal(10)!r}"
` },
        ],
        hints: ['You don\'t need to understand `def` and `return` fully yet — the next lessons explain them. Just add more `elif` checks.', 'Copy the gold pattern: `elif score >= 70:` then (indented) `return "silver"`.', 'Add `elif score >= 50:` → `return "bronze"`. The final `return "none"` handles the rest.'],
      },
    ],
  },

  // ───────────────────────── 5. LOOPS ─────────────────────────
  {
    id: 'py-loops',
    title: 'Loops: doing things again and again',
    minutes: 8,
    learn: [
      {
        title: 'Computers love repeating',
        blocks: [
          'Imagine writing "I will not talk in class" 100 times. Boring! A computer can do it in a blink — with a **loop**.',
          { big: 'A loop repeats code for you.' },
          { analogy: 'A loop is like a washing machine\'s spin cycle: it does the same thing over and over until it is done.', emoji: '🔁' },
        ],
      },
      {
        title: 'for loops with range',
        blocks: [
          { tryit: py`for i in range(5):
    print("Hello!")`, note: 'Five hellos with just two lines. Try 10!' },
          { steps: ['`range(5)` makes the numbers 0, 1, 2, 3, 4 (five numbers — it starts at 0!).', '`for i in` means: take each number one at a time and call it `i`.', 'The indented line runs once for each number.'] },
          { tryit: py`for i in range(5):
    print("Lap number", i)`, note: 'See how i changes each time round.' },
          { tip: '`range(1, 6)` gives 1, 2, 3, 4, 5 — it stops *before* the second number.' },
        ],
      },
      {
        title: 'Looping over a list of things',
        blocks: [
          'Loops also walk through a list of items (we will learn lists properly soon — for now, it is items in square brackets).',
          { tryit: py`for fruit in ["apple", "banana", "cherry"]:
    print("I like", fruit)`, note: 'Add another fruit to the list!' },
          { quick: { q: 'How many times does `for i in range(3):` repeat?', options: ['2', '3', '4', 'Forever'], answer: 1, explain: 'range(3) is 0, 1, 2 — three numbers, so three times.' } },
        ],
      },
      {
        title: 'Adding things up',
        blocks: [
          'A super common trick: start a box at 0, and add to it each time round the loop.',
          { tryit: py`total = 0
for n in [5, 10, 20]:
    total = total + n
    print("added", n, "→ total is now", total)
print("Final total:", total)`, note: 'Watch total grow step by step.' },
          { table: { head: ['Round', 'n', 'total after'], rows: [['start', '-', '0'], ['1', '5', '5'], ['2', '10', '15'], ['3', '20', '35']] } },
          { tip: 'AI connection: when an AI model trains, it loops over thousands of examples, adding up how many it got wrong.' },
        ],
      },
      {
        title: 'Loops with decisions inside',
        blocks: [
          'You can put an `if` inside a loop. Notice the double indent!',
          { tryit: py`for n in range(1, 11):
    if n % 2 == 0:
        print(n, "is even")`, note: '`n % 2 == 0` means "no remainder when divided by 2".' },
        ],
      },
      {
        title: 'while loops (and a warning!)',
        blocks: [
          'A `while` loop keeps going **as long as** a question is True.',
          { tryit: py`countdown = 5
while countdown > 0:
    print(countdown)
    countdown = countdown - 1
print("Blast off! 🚀")`, note: 'A rocket countdown.' },
          { warn: 'If the question never becomes False, the loop runs forever! That is an **infinite loop**. If that happens here, FoundryLab stops it after 8 seconds — no harm done.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['`for i in range(n):` repeats n times (i goes 0 to n−1).', '`for item in [...]:` visits each item.', 'Add things up with a total that starts at 0.', '`while` repeats while a condition is True — make sure it ends!'] },
          { words: [['loop', 'code that repeats'], ['range', 'a list of counting numbers, starting from 0'], ['infinite loop', 'a loop that never stops (oops!)']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-sum-lab',
        title: 'Add up 1 to n',
        xp: XP.code,
        task: 'Finish `add_up_to(n)` so it adds every number from 1 up to n. For example, `add_up_to(4)` is 1 + 2 + 3 + 4 = 10.',
        steps: ['Start `total` at 0 (already done for you).', 'Loop over `range(1, n + 1)` so you get 1, 2, … n.', 'Each time, add the number to `total`.', 'After the loop, `return total`.'],
        starter: py`
def add_up_to(n):
    total = 0
    # loop from 1 to n and add each number to total

    return total


print(add_up_to(4))  # 10
`,
        solution: py`
def add_up_to(n):
    total = 0
    for i in range(1, n + 1):
        total = total + i
    return total


print(add_up_to(4))  # 10
`,
        tests: [
          { name: 'add_up_to(4) is 10', code: py`
assert add_up_to(4) == 10, f"got {add_up_to(4)!r}"
` },
          { name: 'add_up_to(1) is 1', fail: 'range(1, n + 1) includes n', code: py`
assert add_up_to(1) == 1, f"got {add_up_to(1)!r}"
` },
          { name: 'add_up_to(100) is 5050', code: py`
assert add_up_to(100) == 5050, f"got {add_up_to(100)!r}"
` },
        ],
        hints: ['`range(1, n + 1)` gives 1, 2, …, n (it stops before n + 1).', 'Inside the loop (indented!): `total = total + i`.', 'for i in range(1, n + 1):\n    total = total + i'],
      },
      {
        type: 'code',
        id: 'py-labels',
        title: 'Robot sorting: yes or no?',
        xp: XP.code,
        task: 'An AI gives a list of "how sure am I" numbers between 0 and 1. Turn each one into a label: `1` (yes) if it is at least the threshold, otherwise `0` (no).',
        steps: ['Loop over each `p` in `probs`.', 'If `p >= threshold`, append `1` to `labels`.', 'Otherwise, append `0`.', 'Return `labels` (already written).'],
        starter: py`
def to_labels(probs, threshold=0.5):
    labels = []
    # Loop over probs. Use labels.append(1) or labels.append(0).

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
          { name: 'respects a custom threshold', fail: 'Compare with threshold, not the number 0.5', code: py`
_r = to_labels([0.6, 0.7], threshold=0.65)
assert _r == [0, 1], f"expected [0, 1], got {_r!r}"
` },
          { name: 'empty input gives an empty list', code: py`
assert to_labels([]) == []
` },
        ],
        hints: ['`labels.append(1)` adds a 1 to the end of the list.', 'Inside `for p in probs:` put `if p >= threshold:` … `else:` …', 'for p in probs:\n    if p >= threshold:\n        labels.append(1)\n    else:\n        labels.append(0)'],
      },
    ],
  },

  // ───────────────────────── 6. FUNCTIONS ─────────────────────────
  {
    id: 'py-def',
    title: 'Functions: make your own commands',
    minutes: 8,
    learn: [
      {
        title: 'You already used functions!',
        blocks: [
          '`print(...)`, `type(...)`, `int(...)` and `range(...)` are all **functions**: named commands that do a job.',
          { big: 'Now you will build your own.' },
          { analogy: 'A function is like a toaster. You put bread in (the **input**), it does its job, and toast pops out (the **output**). You don\'t need to know how it works inside — you just use it!', emoji: '🍞' },
        ],
      },
      {
        title: 'Defining a function',
        blocks: [
          { code: 'def say_hi():\n    print("Hi there!")\n    print("Welcome!")' },
          { steps: ['`def` means "define" — "I\'m teaching Python a new command".', '`say_hi` is the name you choose.', '`()` and `:` finish the first line.', 'The indented lines are the **body** — what the function does.'] },
          'Defining a function does NOT run it. It is like writing a recipe card. To use it, you **call** it by writing its name with brackets:',
          { tryit: py`def say_hi():
    print("Hi there!")
    print("Welcome!")

say_hi()
say_hi()`, note: 'Called twice → runs twice.' },
        ],
      },
      {
        title: 'Inputs: parameters',
        blocks: [
          'Most functions take inputs. You list them inside the brackets. These are called **parameters**.',
          { tryit: py`def greet(name):
    print("Hello, " + name + "!")

greet("Ava")
greet("Leo")`, note: 'Same function, different inputs.' },
          'When you call `greet("Ava")`, Python puts `"Ava"` into the box `name` for that run.',
          { tryit: py`def area(width, height):
    print(width * height)

area(3, 4)
area(10, 2)`, note: 'Two inputs, separated by a comma.' },
        ],
      },
      {
        title: 'Outputs: return',
        blocks: [
          '`print` just *shows* something. `return` *hands back* an answer so you can use it later — like the toast popping out.',
          { tryit: py`def double(x):
    return x * 2

answer = double(5)
print(answer)
print(double(answer))`, note: 'We saved the answer in a box, then used it again!' },
          { table: { head: ['', 'print', 'return'], rows: [['What it does', 'shows on screen', 'gives back a value'], ['Can you use the result later?', 'No', 'Yes!'], ['After it…', 'function keeps going', 'function stops right away']] } },
          { quick: { q: 'Which function lets you do `x = f(3) + 1`?', options: ['one that uses print', 'one that uses return'], answer: 1, explain: 'Only return hands a value back. A print-only function gives back nothing (called None).' } },
        ],
      },
      {
        title: 'Why functions are awesome',
        blocks: [
          { list: ['**Reuse**: write once, use a thousand times.', '**Names**: `calculate_score()` explains itself.', '**Fix once**: if there\'s a bug, you fix it in one place.'] },
          { tip: 'AI connection: in AI code, almost everything is a function — `train()`, `predict()`, `tokenize()`. Big programs are built from many small functions.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['`def name(inputs):` defines a function; the indented body is what it does.', 'Call it with `name(...)`.', 'Parameters are the inputs.', '`return` hands back an answer you can store and reuse.'] },
          { words: [['function', 'a named, reusable block of code'], ['call', 'run a function by writing its name with ()'], ['parameter', 'an input box of a function'], ['return', 'send an answer back out of a function']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-def-lab',
        title: 'Build your own toolbox',
        xp: XP.code,
        task: 'Write two small functions: `double(x)` returns x times 2, and `greet(name)` returns the text `"Hello, NAME!"`.',
        steps: ['In `double`, replace `pass` with `return x * 2`.', 'In `greet`, return `"Hello, "` + name + `"!"`.', 'Make sure you **return**, not print!'],
        starter: py`
def double(x):
    pass


def greet(name):
    pass


print(double(7))      # 14
print(greet("Ava"))   # Hello, Ava!
`,
        solution: py`
def double(x):
    return x * 2


def greet(name):
    return "Hello, " + name + "!"


print(double(7))      # 14
print(greet("Ava"))   # Hello, Ava!
`,
        tests: [
          { name: 'double(7) returns 14', fail: 'Use return, not print', code: py`
assert double(7) == 14, f"double(7) gave {double(7)!r}"
` },
          { name: 'double works for other numbers', code: py`
assert double(0) == 0 and double(-3) == -6
` },
          { name: 'greet("Ava") returns "Hello, Ava!"', fail: 'Watch the comma, the space and the !', code: py`
assert greet("Ava") == "Hello, Ava!", f"got {greet('Ava')!r}"
` },
          { name: 'greet works for any name', code: py`
assert greet("Leo") == "Hello, Leo!"
` },
        ],
        hints: ['`pass` means "do nothing yet". Delete it and write your own line.', '`return x * 2` for double.', '`return "Hello, " + name + "!"` for greet.'],
      },
    ],
  },

  // ───────────────────────── 7. LISTS ─────────────────────────
  {
    id: 'py-lists',
    title: 'Lists: a row of boxes',
    minutes: 8,
    learn: [
      {
        title: 'One box, many things',
        blocks: [
          'A variable holds one thing. But what if you want to store the scores of your whole class? You use a **list**.',
          { code: 'scores = [90, 72, 85, 64]' },
          { boxes: ['90', '72', '85', '64'], caption: 'scores' },
          { analogy: 'A list is like a train: each carriage holds one thing, and the carriages stay in order.', emoji: '🚂' },
          'Lists use **square brackets** `[ ]` with commas between items.',
        ],
      },
      {
        title: 'Counting starts at 0!',
        blocks: [
          'Each item has a position number called an **index**. Python starts counting at **0**, not 1.',
          { boxes: ['"red"', '"green"', '"blue"'], labels: ['0', '1', '2'], caption: 'colors', labelName: 'index (position)' },
          { tryit: py`colors = ["red", "green", "blue"]
print(colors[0])
print(colors[2])`, note: 'colors[0] is the first item.' },
          'Negative numbers count from the end: `colors[-1]` is the **last** item.',
          { tryit: py`colors = ["red", "green", "blue"]
print(colors[-1])`, note: 'Handy when you don\'t know how long the list is.' },
          { quick: { q: 'In `pets = ["cat", "dog", "fish"]`, what is `pets[1]`?', options: ['"cat"', '"dog"', '"fish"', 'Error'], answer: 1, explain: 'Index 0 is cat, index 1 is dog.' } },
        ],
      },
      {
        title: 'Changing a list',
        blocks: [
          { table: { head: ['Code', 'What it does'], rows: [['`len(xs)`', 'how many items'], ['`xs.append(7)`', 'add 7 to the end'], ['`xs[0] = 99`', 'replace the first item'], ['`xs.remove(7)`', 'remove the first 7'], ['`7 in xs`', 'True if 7 is in the list']] } },
          { tryit: py`backpack = ["book", "pencil"]
backpack.append("apple")
print(backpack)
print(len(backpack))
print("pencil" in backpack)`, note: 'Add more things to the backpack.' },
        ],
      },
      {
        title: 'Slices: taking a piece',
        blocks: [
          '`xs[start:stop]` gives a smaller list, from `start` up to (but not including) `stop`.',
          { tryit: py`letters = ["a", "b", "c", "d", "e"]
print(letters[1:3])
print(letters[:2])
print(letters[2:])`, note: 'Leave a side empty to mean "from the start" or "to the end".' },
          { boxes: ['"a"', '"b"', '"c"', '"d"', '"e"'], labels: ['0', '1', '2', '3', '4'] },
        ],
      },
      {
        title: 'Lists + loops = best friends',
        blocks: [
          { tryit: py`scores = [90, 72, 85, 64]
total = 0
for s in scores:
    total = total + s
average = total / len(scores)
print("Average:", average)`, note: 'The class average!' },
          'Python also has built-in helpers: `sum(xs)`, `max(xs)`, `min(xs)`, `sorted(xs)`.',
          { tryit: py`scores = [90, 72, 85, 64]
print(sum(scores), max(scores), min(scores))
print(sorted(scores))`, note: 'Shortcuts!' },
          { tip: 'AI connection: a sentence going into ChatGPT is turned into a list of numbers. Lists are everywhere in AI.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['A list holds many items in order: `[1, 2, 3]`.', 'Index starts at 0; `-1` is the last item.', '`append`, `len`, `in`, slices `[a:b]`.', 'Loop over lists with `for item in xs:`.'] },
          { words: [['list', 'an ordered collection in square brackets'], ['index', 'the position number of an item (starts at 0)'], ['append', 'add to the end of a list'], ['slice', 'a piece of a list, like `xs[1:3]`']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-lists-lab',
        title: 'Backpack manager',
        xp: XP.code,
        task: 'Write three tiny list functions.',
        steps: ['`first_item(xs)` returns the first item (index 0).', '`last_item(xs)` returns the last item (index -1).', '`add_item(xs, item)` appends item to xs and returns xs.'],
        starter: py`
def first_item(xs):
    pass


def last_item(xs):
    pass


def add_item(xs, item):
    # append item to xs, then return xs
    pass


bag = ["book", "pencil", "apple"]
print(first_item(bag))   # book
print(last_item(bag))    # apple
print(add_item(bag, "ruler"))
`,
        solution: py`
def first_item(xs):
    return xs[0]


def last_item(xs):
    return xs[-1]


def add_item(xs, item):
    xs.append(item)
    return xs


bag = ["book", "pencil", "apple"]
print(first_item(bag))   # book
print(last_item(bag))    # apple
print(add_item(bag, "ruler"))
`,
        tests: [
          { name: 'first_item', fail: 'Indexes start at 0', code: py`
assert first_item(["x", "y", "z"]) == "x", f"got {first_item(['x', 'y', 'z'])!r}"
` },
          { name: 'last_item', fail: 'Index -1 is the last item', code: py`
assert last_item(["x", "y", "z"]) == "z", f"got {last_item(['x', 'y', 'z'])!r}"
` },
          { name: 'add_item adds to the end', code: py`
_r = add_item([1, 2], 3)
assert _r == [1, 2, 3], f"got {_r!r}"
` },
        ],
        hints: ['Square brackets with a number get an item: `xs[0]`.', 'Last item: `xs[-1]`. Adding: `xs.append(item)`.', 'add_item needs two lines: `xs.append(item)` then `return xs`.'],
      },
    ],
  },

  // ───────────────────────── 8. DICTIONARIES ─────────────────────────
  {
    id: 'py-dicts',
    title: 'Dictionaries: look things up by name',
    minutes: 8,
    learn: [
      {
        title: 'Like a real dictionary',
        blocks: [
          'In a real dictionary you look up a **word** and find its **meaning**. Python dictionaries (called **dicts**) work the same way: you look up a **key** and find its **value**.',
          { code: 'ages = {"Ava": 11, "Leo": 12, "Mia": 10}' },
          { table: { head: ['key', 'value'], rows: [['"Ava"', '11'], ['"Leo"', '12'], ['"Mia"', '10']] } },
          { analogy: 'A dict is like a wall of school lockers. Each locker has a name tag (the key) and something inside (the value).', emoji: '🔐' },
          'Dicts use **curly brackets** `{ }`, and each pair is written `key: value`.',
        ],
      },
      {
        title: 'Looking things up',
        blocks: [
          { tryit: py`ages = {"Ava": 11, "Leo": 12, "Mia": 10}
print(ages["Leo"])`, note: 'Use the key in square brackets.' },
          'If the key isn\'t there, you get a `KeyError`. A safer way is `.get(key, backup)`, which gives the backup value instead of crashing:',
          { tryit: py`ages = {"Ava": 11, "Leo": 12}
print(ages.get("Zoe", "unknown"))`, note: 'Zoe isn\'t in the dict — no crash!' },
          { quick: { q: 'With `prices = {"apple": 2, "pear": 3}`, what is `prices["pear"]`?', options: ['"pear"', '2', '3', 'Error'], answer: 2, explain: 'Look up the key "pear" → its value is 3.' } },
        ],
      },
      {
        title: 'Adding and changing',
        blocks: [
          'To add a new pair or change an old one, just assign to the key:',
          { tryit: py`ages = {"Ava": 11}
ages["Leo"] = 12     # add a new key
ages["Ava"] = 12     # change an existing one
print(ages)
print(len(ages))`, note: 'Ava had a birthday 🎂' },
          { tip: 'Keys are unique — each locker name appears only once. Setting the same key again replaces the value.' },
        ],
      },
      {
        title: 'Looping through a dict',
        blocks: [
          '`.items()` gives you each key and value together:',
          { tryit: py`stock = {"apples": 5, "bananas": 0, "cherries": 12}
for fruit, count in stock.items():
    if count == 0:
        print(fruit, "- sold out!")
    else:
        print(fruit, "-", count, "left")`, note: 'A tiny shop inventory.' },
        ],
      },
      {
        title: 'Counting with a dict',
        blocks: [
          'A classic trick: count how many times each word appears.',
          { tryit: py`words = ["cat", "dog", "cat", "bird", "cat"]
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts)`, note: 'Each word starts at 0, then goes up by 1.' },
          { steps: ['First "cat": counts.get("cat", 0) is 0 → store 1.', '"dog": 0 → store 1.', 'Second "cat": get gives 1 → store 2… and so on.'] },
          { tip: 'AI connection: chatbots turn words into numbers using a dict called a **vocabulary**, like `{"cat": 0, "dog": 1, …}`.' },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['A dict maps keys to values: `{"key": value}`.', 'Look up with `d[key]`, or safely with `d.get(key, backup)`.', 'Add or change with `d[key] = value`.', 'Loop with `for k, v in d.items():`.'] },
          { words: [['dict', 'a collection of key → value pairs'], ['key', 'the name you look things up by'], ['value', 'what is stored for that key']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-dict-lab',
        title: 'Word counter',
        xp: XP.code,
        task: 'Write `count_words(words)` that returns a dict saying how many times each word appears, and `price_of(prices, item)` that returns the price, or 0 if the item isn\'t in the shop.',
        steps: ['In `count_words`, loop over the words.', 'For each word, do `counts[w] = counts.get(w, 0) + 1`.', 'In `price_of`, use `.get(item, 0)`.'],
        starter: py`
def count_words(words):
    counts = {}
    # loop over words and count them

    return counts


def price_of(prices, item):
    # return the price, or 0 if item isn't there
    pass


print(count_words(["cat", "dog", "cat"]))   # {'cat': 2, 'dog': 1}
print(price_of({"apple": 2}, "pear"))        # 0
`,
        solution: py`
def count_words(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts


def price_of(prices, item):
    return prices.get(item, 0)


print(count_words(["cat", "dog", "cat"]))   # {'cat': 2, 'dog': 1}
print(price_of({"apple": 2}, "pear"))        # 0
`,
        tests: [
          { name: 'counts words', code: py`
_r = count_words(["cat", "dog", "cat"])
assert _r == {"cat": 2, "dog": 1}, f"got {_r!r}"
` },
          { name: 'empty list → empty dict', code: py`
assert count_words([]) == {}
` },
          { name: 'price_of finds a price', code: py`
assert price_of({"apple": 2, "pear": 3}, "pear") == 3
` },
          { name: 'price_of gives 0 for missing items', fail: 'Use prices.get(item, 0)', code: py`
assert price_of({"apple": 2}, "kiwi") == 0
` },
        ],
        hints: ['Inside count_words: `for w in words:` then add to the count.', '`counts[w] = counts.get(w, 0) + 1` — .get gives 0 the first time.', 'price_of is one line: `return prices.get(item, 0)`.'],
      },
    ],
  },

  // ───────────────────────── 9. SETS, TUPLES, ZIP ─────────────────────────
  {
    id: 'py-collections',
    title: 'Sets, tuples & zip',
    minutes: 7,
    learn: [
      {
        title: 'Sets: no repeats allowed',
        blocks: [
          'A **set** is a bag where every item appears only once. Duplicates vanish automatically!',
          { tryit: py`stickers = {"star", "heart", "star", "moon", "heart"}
print(stickers)
print(len(stickers))`, note: 'Five stickers went in, but only three different ones.' },
          'You can turn a list into a set to find the unique items:',
          { tryit: py`words = ["the", "cat", "the", "hat"]
print(set(words))
print(len(set(words)))`, note: 'How many DIFFERENT words?' },
          { analogy: 'A set is like a sticker collection book with one slot per sticker design. Got a second copy? It doesn\'t get a new slot.', emoji: '⭐' },
        ],
      },
      {
        title: 'Tuples: lists you can\'t change',
        blocks: [
          'A **tuple** looks like a list, but uses round brackets `( )` and is **frozen** — you can\'t change it after making it.',
          { tryit: py`point = (3, 4)
print(point[0])
print(point[1])`, note: 'Indexing works just like lists.' },
          { tryit: py`point = (3, 4)
point[0] = 10`, note: 'Trying to change a tuple causes an error — on purpose.', expectError: true },
          { tip: 'AI connection: the **shape** of AI data is a tuple, like `(32, 768)` — "32 rows, 768 columns". Shapes shouldn\'t change by accident, so tuples are perfect.' },
        ],
      },
      {
        title: 'zip: pairing two lists',
        blocks: [
          '`zip` walks through two lists side by side, making pairs — like a zipper joining two sides of a jacket. 🧥',
          { tryit: py`names = ["Ava", "Leo", "Mia"]
ages = [11, 12, 10]
for name, age in zip(names, ages):
    print(name, "is", age)`, note: 'First with first, second with second…' },
          'And `dict(zip(...))` turns two lists into a dictionary in one step:',
          { tryit: py`words = ["cat", "dog", "bird"]
ids = [0, 1, 2]
vocab = dict(zip(words, ids))
print(vocab)`, note: 'You just built an AI vocabulary!' },
        ],
      },
      {
        title: 'Which container when?',
        blocks: [
          { table: { head: ['Container', 'Brackets', 'Ordered?', 'Changeable?', 'Duplicates?', 'Use it for'], rows: [['list', '`[ ]`', 'yes', 'yes', 'yes', 'a batch of examples'], ['tuple', '`( )`', 'yes', 'no', 'yes', 'shapes, fixed pairs'], ['dict', '`{k: v}`', 'yes', 'yes', 'keys unique', 'look-ups, settings'], ['set', '`{ }`', 'no', 'yes', 'no', 'unique items']] } },
          { quick: { q: 'You want to store the unique words in a book. Which container?', options: ['list', 'tuple', 'set', 'dict'], answer: 2, explain: 'A set automatically keeps only one copy of each word.' } },
        ],
      },
      {
        title: 'Recap',
        blocks: [
          { list: ['**set**: unique items only — `set(xs)` removes duplicates.', '**tuple**: a frozen list, `(32, 768)` — great for shapes.', '**zip**: pairs up two lists; `dict(zip(a, b))` makes a dict.'] },
          { words: [['set', 'a collection with no duplicates'], ['tuple', 'an ordered collection that can\'t be changed'], ['zip', 'pairs items from two lists']] },
        ],
      },
    ],
    activities: [
      {
        type: 'code',
        id: 'py-vocab',
        title: 'Build a vocabulary',
        xp: XP.code,
        task: 'Write `build_vocab(words, ids)` that returns a dict linking each word to its id, and `count_unique(tokens)` that returns how many *different* tokens there are.',
        steps: ['In `build_vocab`, use `dict(zip(words, ids))`.', 'In `count_unique`, turn the list into a set and take its `len`.'],
        starter: py`
def build_vocab(words, ids):
    # build_vocab(["cat", "dog"], [0, 1]) -> {"cat": 0, "dog": 1}
    pass


def count_unique(tokens):
    # count_unique(["the", "cat", "the"]) -> 2
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
        hints: ['zip pairs the two lists; dict turns pairs into a dictionary.', '`return dict(zip(words, ids))`', '`return len(set(tokens))`'],
      },
    ],
  },
]
