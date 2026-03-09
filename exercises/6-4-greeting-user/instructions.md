# 6.4 Greeting the User (functions, conditionals)

## Task

Please define a function `greet_user(age)` that fulfills the following requirements:

- If the user is `>= 18` the function should return `"Hello Sir/Madam"`
- If the user is `< 18` and `>= 6` the function should return `"Hello lil one!"`
- If the user is younger than `6` the function should return `"Hey! You're too young to write!"`

## Examples

> `greet_user(77)` → `"Hello Sir/Madam"`<br>
> `greet_user(7)` → `"Hello lil one!"`<br>
> `greet_user(5)` → `"Hey! You're too young to write!"`

<details>
<summary>💡 Hints</summary>

- The task is to **return** the value, not to print it.
- Use `if`, `elif`, and `else` to check the age ranges.

</details>

## Advanced

Add another parameter to the function:

- The parameter should be called `dog_years` and have a default value of `False`
- If `dog_years` is `True`, the function should convert the age to dog years first.
- Let's not make things too easy. Please use [this page](https://www.brookfarmveterinarycenter.com/post/human-years-vs-dog-years-calculate-your-pets-age-today) to find out how to calculate dog years from human years.
