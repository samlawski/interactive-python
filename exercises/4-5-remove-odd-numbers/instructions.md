# 4.5 Remove Odd Numbers (lists, functions, for loops)

## Task

Please write a function `remove_odd_nrs(l)` that takes as input a list of integers and removes all odd numbers from it.

The list should be modified **in place** — meaning you change the original list rather than creating a new one.

## Examples

> `remove_odd_nrs([1, 2, 3, 4])` → list becomes `[2, 4]`<br>
> `remove_odd_nrs([3, 4, 5, 8, 2, 5])` → list becomes `[4, 8, 2]`

<details>
<summary>💡 Hints</summary>

- The intention of this task is to modify the list you get handed over. You don't need to use a return statement here.
- Changing a list while iterating over it is dangerous. Can you imagine why? Can you find a way to avoid that?
- One approach: iterate over a **copy** of the list and remove items from the original.
- A number is odd if `number % 2 != 0`

</details>
