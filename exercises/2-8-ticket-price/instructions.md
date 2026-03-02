# 2.8 Ticket Price (input, coercion, if)

## Task

Please write a program for a cinema ticket machine.

The program should ask the user for their **age** and print the ticket price according to these rules:

| Age           | Price   |
|---------------|---------|
| Under 6       | Free    |
| 6 to 17       | 5€      |
| 18 to 64      | 10€     |
| 65 and older  | 7€      |

Print the result in the exact format: `"Ticket price: X"` where `X` is `"Free"`, `"5€"`, `"10€"`, or `"7€"`.

## Examples

- If the user inputs `"4"`, the program should print `"Ticket price: Free"`.
- If the user inputs `"15"`, the program should print `"Ticket price: 5€"`.
- If the user inputs `"30"`, the program should print `"Ticket price: 10€"`.
- If the user inputs `"70"`, the program should print `"Ticket price: 7€"`.

<details>
<summary>💡 Hints</summary>

- Remember to convert the input to an integer with `int()` before comparing
- Use `if`, `elif`, and `else` to check the different age ranges
- Pay attention to the boundary values (6, 17, 18, 64, 65)

</details>
