# 6.5 Reading Ten Numbers (functions, while, for, error handling)

## Task

Please write a function `read_ten()` that asks the user to input ten floating point numbers and returns a list of them.

- The ten numbers should be inputed separately
- Please handle input errors. If the user inputs something that is not a float, they should be asked to input again until they get it right.

## Example

Your program could look like this:

```
Number? 1.0
Number? 1.0
Number? BLA
Please only enter floating point numbers!
Number? 1.0
Number? 1.0
Number? 1.0
Number? 1.0
Number? 1.0
Number? 1.0
Number? 1.0
Number? 1.0
```

In this case your function would return `[1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]`

<details>
<summary>💡 Hints</summary>

- Inputing ten numbers can be accomplished with a for loop
- Asking again until the number is correctly formatted can be done with a while loop
- You will need to catch an exception with `try`/`except` for this to work

</details>

## Advanced

Please write a second function `stats_ten()`. The function should behave just like `read_ten`, but rather than the numbers, it should return a dictionary containing the `sum`, `max`, `min` and `average` of the ten numbers.
