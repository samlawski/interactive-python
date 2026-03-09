# 5.5 Rename Student (lists, dictionaries, functions, for loop)

## Task

Please define a function `rename(students, old_name, new_name)` for renaming students. The function should have the following input parameters:

- `students`: a list of students. Each student is a dictionary of the following format: `{"f_name": "Bla", "l_name": "Blub"}`
- `old_name`: the old last name that should be renamed
- `new_name`: the new last name

The function should rename **all** students whose `l_name` matches the `old_name` to `new_name`.

The dictionaries should be modified **in place**.

## Examples

Given the following list of students:

```python
students = [
    {"f_name": "Manuel", "l_name": "Dolderer"},
    {"f_name": "Jonathan", "l_name": "Rüth"},
    {"f_name": "Thomas", "l_name": "Bachem"},
]
```

If we call `rename(students, "Rüth", "Meier")`, the list should look like this:

```python
students = [
    {"f_name": "Manuel", "l_name": "Dolderer"},
    {"f_name": "Jonathan", "l_name": "Meier"},
    {"f_name": "Thomas", "l_name": "Bachem"},
]
```

<details>
<summary>💡 Hints</summary>

- This task will require a for loop iterating over the list.
- Please remember to change **all** occurrences, not just the first one.
- You can modify dictionary values directly: `student["l_name"] = new_name`

</details>
