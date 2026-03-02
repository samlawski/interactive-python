# 3.5 Zero Division (error handling)

## Task

Write a program that asks the user to input two integers `a` and `b` (in this order) and divides `a` by `b` using **integer division** (`//`).

Please catch all errors and print their type.

## Examples

- When `4` and `2` are entered, the program should print `2`
- When either of the numbers is not a valid integer, the program should print `"ValueError"`
- If the second number is zero, the program should print `"ZeroDivisionError"`

<details>
<summary>💡 Hints</summary>

- You can solve this task with one `try` block and two `except` blocks
- Use `except ValueError:` to catch invalid integer conversions
- Use `except ZeroDivisionError:` to catch division by zero
- Remember to use integer division `//`, not regular division `/`

</details>
