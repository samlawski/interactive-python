# 5.9 Number Guessing Game (while, functions)

## Task

Please write a function `guessing_game(secret)` that implements a number guessing game.

The function should:

- Take a `secret` number as parameter
- Ask the user to guess a number via the command line
- If the guess is too high, print `"Too high!"`
- If the guess is too low, print `"Too low!"`
- If the guess is correct, print `"Correct!"` and return the number of attempts
- Keep asking until the user guesses correctly

## Examples

If the secret number is `7` and the user guesses `3`, `9`, `7`:
- After `3`: prints `"Too low!"`
- After `9`: prints `"Too high!"`
- After `7`: prints `"Correct!"` and returns `3`

<details>
<summary>💡 Hints</summary>

- Use a `while` loop that keeps running until the guess matches the secret
- Use `int(input())` to read the user's guess
- Keep a counter variable that increments with each guess
- Use `if`/`elif`/`else` to check if the guess is too high, too low, or correct

</details>
