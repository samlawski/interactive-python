# 4.4 Vector Addition (lists, functions, for loops)

## Task

Please write a function `vector_add(v1, v2)` that takes as input two vectors `v1` and `v2` and returns their sum.

The two vectors are represented as lists of integers. The function does not prescribe these vectors to have a specific length but you can assume they both have the same length.

Remember: vector addition of two vectors creates a third vector whose components are the sum of the components of the two added vectors.

## Examples

> `vector_add([1, 2], [6, 5])` → `[7, 7]`<br>
> `vector_add([3, 4, 5], [4, 3, 2])` → `[7, 7, 7]`

<details>
<summary>💡 Hints</summary>

- The function `len(l)` returns the length of a list. Depending on your implementation you may or may not need this.
- You can assume that `v1` and `v2` are always lists of numbers and have the same length. There is no need to check types or handle exceptions.
- Your task is to **return** the sum, not to print it.

</details>
