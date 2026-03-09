# 4.7 Matrix Addition (lists, functions, for loops)

## Task

Please write a function `matrix_add(m1, m2)` that takes as input two matrices `m1` and `m2` and returns their sum.

Matrices are represented as two-dimensional lists of integers. For example, a matrix could be represented as `[[1, 2], [3, 4]]` where the outer index represents the row and the inner one the column.

The function does not prescribe these matrices to have specific dimensions. You can assume they are well-formed and both have the same dimensions.

Remember: matrix addition of two matrices creates a third matrix whose components are the sum of the components of the two added matrices.

## Examples

> `matrix_add([[1, 2], [3, 4]], [[5, 6], [7, 8]])` → `[[6, 8], [10, 12]]`

This is because: `[[1+5, 2+6], [3+7, 4+8]]` = `[[6, 8], [10, 12]]`

<details>
<summary>💡 Hints</summary>

- This task is similar to task 4.4 but will require an extension to matrices.
- You can assume that `m1` and `m2` are always lists of lists of numbers and have the same dimensions.
- Your task is to **return** the sum, not to print it.
- You will likely need nested for loops — one for rows and one for columns.

</details>
