# 1.6 Mad Libs (input, strings, print)

## Task

Build a tiny **Mad Libs** game! Ask the user for several words and then print a funny sentence using those words.

## Requirements

1. Ask for an **animal** with the prompt: `Enter an animal: `
2. Ask for a **number** with the prompt: `Enter a number: `
3. Ask for a **food** with the prompt: `Enter a food: `
4. Print this sentence (with the user's words filled in):

```
Today I saw NUMBER ANIMAL(s) eating FOOD at the park!
```

Replace `NUMBER`, `ANIMAL`, and `FOOD` with the values the user typed.

## Example

```
Enter an animal: penguin
Enter a number: 42
Enter a food: pizza
Today I saw 42 penguin(s) eating pizza at the park!
```

<details>
<summary>💡 Hints</summary>

- Use `input()` with the exact prompt text shown above
- You can combine strings with `+` or use f-strings: `f"Some {variable} text"`
- The number stays as a string — no need to convert it since you're just printing it

</details>
