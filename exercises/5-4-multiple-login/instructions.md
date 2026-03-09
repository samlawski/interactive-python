# 5.4 Multiple Login Attempts (functions, while, dictionaries)

## Task

Please define a function `login()` that implements a login mechanism with unlimited attempts.

The function should:

- Ask the user to input username and password via the command line and check them against known accounts.
- If the login is incorrect, the function should ask again.
- Ask an unlimited number of times until the login is correct.
- Return the number of login attempts.

Your system has the following user accounts:

| Username | Password |
| --- | --- |
| Frank | Test1234 |
| Peter | asdznasdq9e2n |
| Manuel | Code4Ever |
| Tom | Code4Ever |
| Jonathan | IamJo |

## Examples

If the user logs in correctly on the first try, the function should return `1`.

If the user logs in incorrectly the first time, then correctly the second time, the function should return `2`.

<details>
<summary>💡 Hints</summary>

- It is probably a good idea to keep usernames and passwords in a dictionary. This way you can avoid long if statements.
- Remember, you can use the function `.get()` to access a dictionary with a key while avoiding an exception if that key is not in the dictionary.
- Use a `while` loop that keeps running until the login is correct.

</details>
