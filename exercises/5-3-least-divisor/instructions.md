# 5.3 Least Divisor (functions, loops)

## Task

Please define a function `least_divisor(nr)` that takes one integer parameter `nr` and returns its least divisor.

The least divisor of a number `nr` is defined as the smallest number bigger than one such that `nr` is divisible by this number.

## Examples

> `least_divisor(28)` → `2`<br>
> `least_divisor(9)` → `3`<br>
> `least_divisor(5)` → `5`

<details>
<summary>💡 Hints</summary>

- This task will require a loop that counts up from 2 to find the least divisor.
- The `return` statement ends a function, no matter what. This means, if it is placed within a loop, the loop won't finish.
- A number `a` is divisible by `b` if `a % b == 0`

</details>
