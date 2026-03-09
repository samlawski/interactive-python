# 4.1 List Operations (lists)

## Task

The goal of this task is to practice list operations. A list `my_list` is already defined. Please use list operations to modify this list in the following way:

- Change the element `"zwei"` to the number `2`
- Add a number `4` in between `3` and `5`
- Remove `"hello!"`
- Add numbers `7` to `10`

Please do **not** just overwrite `my_list` with the desired output.

## Example

After modifying, the list should look like this:

```
my_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

<details>
<summary>💡 Hints</summary>

- A nice overview of list operations can be found in the [Python documentation](https://docs.python.org/3/tutorial/datastructures.html)
- Use indexing to change an element: `my_list[i] = value`
- Use `.insert(index, value)` to insert at a specific position
- Use `.remove(value)` to remove an element by value
- Use `.extend()` or `+=` to add multiple elements at once

</details>
