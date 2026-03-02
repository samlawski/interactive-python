# 3.2 String Functions (functions)

## Task

Please define the following functions:

- `is_all_caps` takes one string parameter and returns `True` if the string contains only upper-case letters, and `False` otherwise.
- `is_lower_case` takes one string parameter and returns `True` if the string contains only lower-case letters, and `False` otherwise.
- `equals_ignore_case` takes two string parameters and returns `True` if they are equal when ignoring upper/lower-case differences, and `False` otherwise.

## Examples

> `is_all_caps("Seven")` → `False`<br>
> `is_all_caps("SEVEN")` → `True`

> `is_lower_case("Seven")` → `False`<br>
> `is_lower_case("seven")` → `True`

> `equals_ignore_case("Seven", "seven")` → `True`<br>
> `equals_ignore_case("seven", "eight")` → `False`

<details>
<summary>💡 Hints</summary>

- The string methods `.upper()` and `.lower()` will be helpful for this task
- `"HELLO".isupper()` also exists, but try solving it by comparing the string with its `.upper()` or `.lower()` version
- For `equals_ignore_case`, convert both strings to the same case before comparing

</details>
