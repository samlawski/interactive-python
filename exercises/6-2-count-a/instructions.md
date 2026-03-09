# 6.2 Count A (strings, functions, for loops)

## Task

Write a function `count_a(str)` that receives a string `str` and returns the number of `"a"` characters in that string.

The function should **not** be case-sensitive — i.e., it should count both `"a"` and `"A"`.

## Examples

> `count_a("Alfalfa")` → `3`<br>
> `count_a("Abigaile")` → `2`<br>
> `count_a("AbrakadabrA")` → `5`

<details>
<summary>💡 Hints</summary>

- Remember that you can iterate over strings character by character with for loops!
- Use `.lower()` to convert a character to lowercase before comparing

</details>

## Advanced

Write a second function `count_aa(str)` that counts the occurrence of the string `"aa"` in `str`. The function should not be case-sensitive.
