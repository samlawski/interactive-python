# 6.1 Interval (functions, lists)

## Task

Please define a function `get_interval()` that:

- Asks the user to input two integers `a` and `b` via the command line
- Returns a list of numbers from `a` to `b` (including `a` and `b`)

## Examples

If the user inputs `2` and `4`, the function should return `[2, 3, 4]`.

<details>
<summary>💡 Hints</summary>

- You can assume that the inputed numbers are integers and that the first number is smaller than the second number.
- The `range()` function can be very helpful here — but remember that `range(a, b)` does **not** include `b`.
- Use `list()` to convert a range to a list.

</details>

## Advanced

If you want a more challenging task, then please include error handling such that the user is asked to re-enter a number if it is not an integer — or if the second number is smaller than the first one.
