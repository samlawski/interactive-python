# 3.4 Number Conversion (error handling)

## Task

Write a program that asks the user for two inputs: an **integer** and a **float** (in this order) and prints their product.

This program should handle input-related errors the following way:

- If the first number is not a valid integer, print `"Not an Integer"`
- If the second number is not a valid float, print `"Not a Float"`
- If an error occurs, the respective number should have the default value `0`

## Examples

- When `2` and `5.0` are entered, the program should print `10.0`
- When `hello` and `5.0` are entered, the program should print `"Not an Integer"` and then `0.0` (since the default value 0 is used)
- When `1` and `hello` are entered, the program should print `"Not a Float"` and then `0.0` (since the default value 0 is used)

<details>
<summary>💡 Hints</summary>

- This task requires you to write two `try`/`except` blocks — one for each conversion
- Use `int()` to convert the first input and `float()` to convert the second
- If the conversion fails, catch the `ValueError` and print the appropriate message
- Remember to set the default value to `0` when an error occurs

</details>
