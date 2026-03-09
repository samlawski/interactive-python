# 6.7 Student Grades (dictionaries, lists, functions, for loops)

## Task

Please write a function `average_grades(students)` that takes a list of student dictionaries and returns a new dictionary mapping each student's name to their average grade.

Each student dictionary has the following format:

```python
{"name": "Alice", "grades": [1.0, 2.3, 1.7]}
```

The function should return a dictionary like:

```python
{"Alice": 1.6666666666666667}
```

## Examples

> `average_grades([{"name": "Alice", "grades": [1.0, 2.0, 3.0]}])` → `{"Alice": 2.0}`<br>
> `average_grades([{"name": "Alice", "grades": [1.0, 2.0]}, {"name": "Bob", "grades": [3.0, 4.0]}])` → `{"Alice": 1.5, "Bob": 3.5}`

<details>
<summary>💡 Hints</summary>

- Use a for loop to iterate over the list of students
- For each student, calculate the average by summing the grades and dividing by the number of grades
- Build up a result dictionary and return it

</details>
