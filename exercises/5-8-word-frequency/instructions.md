# 5.8 Word Frequency (dictionaries, for loops, strings)

## Task

Please write a function `word_frequency(text)` that takes a string `text` and returns a dictionary where each key is a word (in lowercase) and each value is the number of times that word appears in the text.

## Examples

> `word_frequency("hello world hello")` → `{"hello": 2, "world": 1}`<br>
> `word_frequency("the cat sat on the mat")` → `{"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}`

<details>
<summary>💡 Hints</summary>

- Use `.split()` to break a string into a list of words
- Use `.lower()` to convert to lowercase before counting
- Check if a word is already in the dictionary before incrementing — or use `.get(word, 0)` to provide a default value

</details>
