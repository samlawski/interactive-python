# OS_01 Exam

Welcome!

You have 60 minutes to complete the exam and submit the assessment form before the time runs out.

For this assessment only need to have this page open.

- 👉 For the duration of the exam **turn off your WiFi**.
- 👉 Close all other tabs/windows and programs. Generative AI, chats, or other tools are **not permitted**.
- 👉 Some questions come with a code editor. You may only use it for that question. 
- 👉 Raise your hand to ask any questions!

**When you're done**:

- Please click "Download My Answers" to download your work and enter your CODE email address.
- ✋ Raise your hand to indicate that you're done. 
- Now you may turn on your WiFi again. 
- Please **upload the downloaded file on Fuxam** as assessment submission for OS_01.

_(👀 Please be aware that leaving this page or turning on the WiFi will show up in the logs.)_

Good luck, have fun!

---

## Please explain the difference between the "print" statement and  the "return" statement. (5 points)

Please describe when they should be used.

---

## Tuples in Python are immutable. What does this mean? (5 points)

Please describe what immutability means and what one may want to use an immutable data structure for. 

---

## What will be printed in the command line after the following program is executed? (5 points)

```python
a = "n"
a = a + "a"
a = 7 * a

b = "bat".title()
c = "man".title()

print(a, b + c)
```

---

## What value does d have after execution the following program? (5 points)

```python
a = 8
b = 6
a -= 1
c = a *b
b = 5
c = str(c // 6)
d = float(c + c + c)
```

---

## What will be printed in the command line after the following program is executed? (5 points)

It is probably a good idea to simulate the control flow of the code in your head and keep track of variables and errors to find out which print statements are called in which order.

```python
def semi_smart_function(value):
  try:
    return 7 / value
  except ZeroDivisionError:
    print("Bad user! Don't divide by zero!")

try:
  x = semi_smart_function(0)
  print("x is", x)
  print(x * 100)
  print("good bye")
except Exception:
  print("oops :)")
```

---

## Please define a function "divide_by_non_zero(x,y)" (10 points)

The function should divide x by y and return the result. If y is zero it should return the string "Nope" instead.

[[PYTHON-EDITOR]]

---

## Please define a function "add_email(students)" (10 points)

The function should get a list of students as input (you can assume the format of the example below). It should add a key-value pair representing their email to each student. The key should be "email", the value should be `<first_name>.<family_name>@code.berlin`

For this task, there is already a dictionary to get you started:


[[PYTHON-EDITOR]]
```python
students = [
  {"first_name": "Frank", "family_name": "Trollmann"},
  {"first_name": "Fabio", "family_name": "Fracassi"}
]

# Your code ...


```
[[/PYTHON-EDITOR]]

---

## Please write a program that asks the user "Are we there yet?" until they answer "Yes". (10 points)

"Asking" means printing the question to the command line. The answer should be received via the input statement.

[[PYTHON-EDITOR]]