# 2.1 Hello Harry (input)

## Task

Please write a program that asks the user for their first and last name and prints their full name.

The full name should be formatted well, meaning:

- Any additional white space — except the one in between first and last name — should be removed
- The first letter of each name should be in title case

## Example

If the user inputs `"Harald   "` and `" tÖpFer"`, your program should print `"Harald Töpfer"`.

<details>
<summary>💡 Hints</summary>

- Use `input()` to ask the user for each name
- The `.strip()` method removes whitespace from both ends of a string
- The `.title()` method capitalises the first letter of each word and lowercases the rest
- You can combine (concatenate) strings with `+`

</details>
