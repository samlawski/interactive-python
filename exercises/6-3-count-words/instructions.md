# 6.3 Count Words (while, input)

## Task

Write a program that asks the user to input multiple strings until they enter `"end"`. Please:

- Read each string as a separate input statement
- Stop if the user says `"end"`. Capitalization should not matter here — `"END"` or `"End"` should also work.
- Count the word `"end"` as well
- Print the number of words at the end

## Example

This is how the program could look:

```
Please enter a word? Hello
Please enter a word? I
Please enter a word? am
Please enter a word? Frank
Please enter a word? end
You entered 5 words.
```

<details>
<summary>💡 Hints</summary>

- Although the task is called "count words" you do not need to be concerned that one string may contain multiple words. Don't overengineer :-)
- Use `.lower()` to compare the input case-insensitively
- Use a while loop and a counter variable

</details>

## Advanced

Count words instead of strings. If the user inputs a string such as `"Hello world"` it should count as two words.
