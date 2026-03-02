# 2.9 Leap Year (input, coercion, if)

## Task

Please write a program that asks the user for a **year** and prints whether it is a **leap year** or not.

The rules for leap years are:

1. A year is a leap year if it is **divisible by 4**
2. **Exception**: years divisible by 100 are **not** leap years
3. **Exception to the exception**: years divisible by 400 **are** leap years

Print exactly `"X is a leap year"` or `"X is not a leap year"` where `X` is the year.

## Examples

- Input: `2024` → Output: `"2024 is a leap year"` (divisible by 4)
- Input: `1900` → Output: `"1900 is not a leap year"` (divisible by 100 but not 400)
- Input: `2000` → Output: `"2000 is a leap year"` (divisible by 400)
- Input: `2023` → Output: `"2023 is not a leap year"` (not divisible by 4)

<details>
<summary>💡 Hints</summary>

- Use the modulo operator `%` to check divisibility — `x % 4 == 0` means `x` is divisible by 4
- Think carefully about the **order** of your `if`/`elif`/`else` checks — the order matters!
- Remember to convert the input to an integer with `int()`

</details>
