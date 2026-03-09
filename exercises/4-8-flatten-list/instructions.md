# 4.8 Flatten List (lists, functions, for loops)

## Task

Please write a function `flatten(nested_list)` that takes a two-dimensional list (a list of lists) and returns a single flat list containing all elements.

## Examples

> `flatten([[1, 2], [3, 4], [5, 6]])` → `[1, 2, 3, 4, 5, 6]`<br>
> `flatten([["a", "b"], ["c"]])` → `["a", "b", "c"]`<br>
> `flatten([[1], [2], [3]])` → `[1, 2, 3]`

<details>
<summary>💡 Hints</summary>

- You will need a for loop that iterates over the outer list, and for each inner list, adds its elements to a result list.
- You can use `.extend()` to add all elements of one list to another, or use a nested for loop.
- Your task is to **return** the flat list, not to print it.

</details>
