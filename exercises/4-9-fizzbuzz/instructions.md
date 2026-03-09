# 4.9 FizzBuzz (for loops, lists, functions)

## Task

Please write a function `fizzbuzz(n)` that takes an integer `n` and returns a list of strings for each number from 1 to `n` (inclusive) following these rules:

- If the number is divisible by 3, use `"Fizz"`
- If the number is divisible by 5, use `"Buzz"`
- If the number is divisible by both 3 and 5, use `"FizzBuzz"`
- Otherwise, use the number as a string (e.g. `"1"`, `"2"`)

## Examples

> `fizzbuzz(5)` → `["1", "2", "Fizz", "4", "Buzz"]`<br>
> `fizzbuzz(15)` → `["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]`

<details>
<summary>💡 Hints</summary>

- Use a for loop with `range(1, n + 1)` to iterate from 1 to n
- Check divisibility by both 3 and 5 **first**, then by 3 alone, then by 5 alone
- A number is divisible by another if the remainder is zero: `number % 3 == 0`
- Build up a list and return it

</details>
