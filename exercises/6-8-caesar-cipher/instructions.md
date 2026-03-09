# 6.8 Caesar Cipher (strings, functions, for loops)

## Task

Please write two functions:

- `encrypt(text, shift)` — takes a string `text` and an integer `shift`, and returns the text encrypted using a Caesar cipher.
- `decrypt(text, shift)` — takes an encrypted string `text` and the same `shift`, and returns the original text.

A Caesar cipher shifts each letter in the text by a fixed number of positions in the alphabet. Non-letter characters (spaces, punctuation, numbers) should remain unchanged.

The functions should preserve the case of each letter (uppercase stays uppercase, lowercase stays lowercase).

## Examples

> `encrypt("Hello", 3)` → `"Khoor"`<br>
> `encrypt("abc", 1)` → `"bcd"`<br>
> `encrypt("xyz", 3)` → `"abc"`<br>
> `decrypt("Khoor", 3)` → `"Hello"`

<details>
<summary>💡 Hints</summary>

- Use `ord()` to get the ASCII code of a character and `chr()` to convert back
- The ASCII code of `"a"` is 97, `"z"` is 122, `"A"` is 65, `"Z"` is 90
- Use the modulo operator `%` to wrap around the alphabet
- You can check if a character is a letter with `.isalpha()`
- Decryption is just encryption with a negative shift

</details>
