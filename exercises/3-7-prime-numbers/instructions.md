# 3.7 Prime Numbers (functions, recursion)

## Task

Please define a function `is_prime(nr)` that takes an integer parameter. The function should return `True` if `nr` is a prime number and `False` if it isn't.

A prime number is a natural number that is only divisible by itself and 1.

Please define this function **using recursion**. Recursion is when a function calls itself. Please don't use loops, even if you know about them already.

## Examples

> `is_prime(2)` → `True`<br>
> `is_prime(3)` → `True`<br>
> `is_prime(4)` → `False`<br>
> `is_prime(5)` → `True`<br>
> `is_prime(6)` → `False`

<details>
<summary>💡 Hints</summary>

- This task is hard for a beginner. Don't worry if you can't figure it out.
- Please do **not** use loops for this task. The goal is to practice recursion.
- One way to implement this: define a helper function `has_divisor(nr, divisor)` that checks whether `nr` is divisible by any number between 2 and `divisor`. This function can call itself, decrementing `divisor` until it reaches 1.
- A number is divisible by another if the remainder is zero: `nr % divisor == 0`
- Numbers less than 2 are not prime.

</details>
