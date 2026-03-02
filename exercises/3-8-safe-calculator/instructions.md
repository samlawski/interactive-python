# 3.8 Safe Calculator (functions, error handling)

## Task

Please define a function `safe_calculate(a, b, operator)` that takes two numbers (as strings) and an operator (also a string: `"+"`, `"-"`, `"*"`, or `"/"`) and returns the result of the calculation as a float.

Your function should handle the following errors:

- If `a` or `b` cannot be converted to a float, return the string `"Invalid number"`
- If the operator is not one of `+`, `-`, `*`, `/`, return the string `"Invalid operator"`
- If the user tries to divide by zero, return the string `"Division by zero"`

If everything is valid, return the result as a float.

## Examples

> `safe_calculate("10", "5", "+")` → `15.0`<br>
> `safe_calculate("10", "3", "-")` → `7.0`<br>
> `safe_calculate("4", "2.5", "*")` → `10.0`<br>
> `safe_calculate("10", "4", "/")` → `2.5`<br>
> `safe_calculate("hello", "5", "+")` → `"Invalid number"`<br>
> `safe_calculate("10", "0", "/")` → `"Division by zero"`<br>
> `safe_calculate("10", "5", "^")` → `"Invalid operator"`

<details>
<summary>💡 Hints</summary>

- Use `try`/`except` with `ValueError` to catch invalid number conversions
- Use `try`/`except` with `ZeroDivisionError` to catch division by zero
- Check the operator with `if`/`elif` statements
- Convert both `a` and `b` to `float` before calculating

</details>
