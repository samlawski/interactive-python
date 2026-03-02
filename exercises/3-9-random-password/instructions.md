# 3.9 Random Password (functions, modules)

## Task

Please define a function `generate_password(length)` that generates a random password of the given length.

The password should contain only lowercase letters (`a`–`z`). Use the `random` module to pick random letters.

The function should also validate the input:

- If `length` is not a positive integer (i.e., less than 1), return the string `"Invalid length"`

Then write a small program that asks the user for a password length and prints the generated password. Handle the case where the user enters something that is not a valid integer by printing `"Invalid input"`.

## Examples

> `generate_password(5)` → `"kbmqz"` (random, 5 characters)<br>
> `generate_password(10)` → `"abxjklqwer"` (random, 10 characters)<br>
> `generate_password(0)` → `"Invalid length"`<br>
> `generate_password(-3)` → `"Invalid length"`

<details>
<summary>💡 Hints</summary>

- Import the `random` module at the top of your file
- `random.choice("abcdefghijklmnopqrstuvwxyz")` picks a random letter
- You can also use `string.ascii_lowercase` from the `string` module instead of typing all letters
- Build the password by starting with an empty string and adding one random letter at a time using recursion or string concatenation
- Use `try`/`except` to handle invalid user input in the main program

</details>
