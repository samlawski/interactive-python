# 4.2 Pyramid (for loops)

## Task

Write a program that prints a pyramid to the command line. The pyramid should be built out of `#` characters.

The user should be able to input a number that defines the height of the pyramid.

## Examples

If the user inputs `3`, the following output should be printed:

```
#
##
###
```

If the user inputs `5`, the following output should be printed:

```
#
##
###
####
#####
```

<details>
<summary>💡 Hints</summary>

- You can solve this task with two for loops but you don't need to. Remember that you can multiply a string with a number: `"#" * 3` gives `"###"`
- Remember, the `range(a, b)` function gives you a list of numbers from `a` to `b-1`. This will be useful here.
- Use `input()` to ask the user for a number and convert it with `int()`

</details>
