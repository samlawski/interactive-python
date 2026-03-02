# 2.3 Login (input, if)

## Task

Please write a log-in mechanism.

The program should ask the user to enter their user name and password. If the combination matches, it should print `"Login Succeeded"`. If it is not successful it should print `"Login Failed"`.

Your system has the following user accounts:

| User  | Password       |
|-------|----------------|
| Frank | Test1234       |
| Peter | asdznasdq9e2n  |

## Examples

- If the user inputs `"Frank"` and `"Test1234"` your program should print `"Login Succeeded"`.
- If the user inputs `"Frank"` and `"Test12345"` your program should print `"Login Failed"`.
- If the user inputs `"Peter"` and `"Test1234"` your program should print `"Login Failed"`.

<details>
<summary>💡 Hints</summary>

- The tests are looking for the exact strings `"Login Failed"` and `"Login Succeeded"`. Make sure to spell them correctly.
- Use `==` to compare strings
- You can combine conditions with `and` and `or`

</details>
