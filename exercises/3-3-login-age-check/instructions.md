# 3.3 Login and Age Check (functions)

## Task

Please define a function `age_check(age)`. The parameter `age` should be an integer. The function should return `True` if age is greater than or equal to 18, and `False` otherwise.

Now please define a function `login(username, password, age)`. The function should check `username` and `password` against known accounts and also check that the `age` is valid using the function `age_check`. The function `login` should return `True` only if the username and password match **and** the age passes the age check — and `False` in all other cases.

Your system has the following user accounts:

| User  | Password       |
|-------|----------------|
| Frank | Test1234       |
| Peter | asdznasdq9e2n  |

## Examples

> `age_check(19)` → `True`<br>
> `age_check(7)` → `False`

> `login("Frank", "Test1234", 18)` → `True`<br>
> `login("Frank", "Test1234", 16)` → `False`<br>
> `login("Frank", "Test12345", 18)` → `False`

<details>
<summary>💡 Hints</summary>

- Use `def` to define each function
- `age_check` just needs a simple comparison with `>=`
- Inside `login`, call `age_check(age)` to verify the age
- Use `and` to combine the username/password check with the age check
- Remember: both conditions must be `True` for the login to succeed

</details>
