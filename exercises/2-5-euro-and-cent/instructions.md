# 2.5 Euro and Cent (input, numbers, coercion)

## Task

Please write a program that separates the euro and cent value from a floating point number representing a price.

The price should be entered by the user via the command line as a floating point number.

Your task is to separate the euro and cent values from this price, represent them as integers, and print them to the command line. Please print them in the following form: `"X€ Yct"` where `X` is the number of euros and `Y` is the number of cents.

If the cent value is not a whole number, please round to the nearest whole cent.

## Examples

> Input: `12.34`
> Output: `12€ 34ct`

> Input: `5.6789`
> Output: `5€ 68ct`

<details>
<summary>💡 Hints</summary>

- This task will require you to be a bit creative with number operations. The behaviour of the integer coercion function `int()` may be particularly useful.
- The function `round()` is helpful to round a floating point number to the nearest integer.
- The tests on this task are very sensitive and require the printed format to be **exactly** as stated above. An added whitespace may already break the test.
- You don't need to concern yourself with error handling — if the user inputs `"Bla"` instead of a floating point number then the program may crash and that is OK for now.

</details>
