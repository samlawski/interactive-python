# 5.1 Dictionary Operations (dictionaries)

## Task

The goal of this task is to practice dictionary operations. A dictionary `my_dict` is already defined. Please use dictionary operations to modify it the following way:

- Change the name to `"Frank"` (capitalize the first letter)
- Add a hobby `"teaching"` to the end of the hobbies list
- Change the zip code of CODE to `"12435"` (this should be a string, not a number)

Please do **not** just overwrite `my_dict` with the desired output.

## Example

After modifying, the dictionary should look like this:

```python
{
    "name": "Frank",
    "workplace": {
        "name": "CODE",
        "address": {
            "Street": "Lohmühlenstraße",
            "nr": "65",
            "zip": "12435",
            "city": "Berlin"
        },
    },
    "hobbies": ["gaming", "programming", "reading", "teaching"]
}
```

<details>
<summary>💡 Hints</summary>

- Please modify `my_dict` directly and don't just overwrite it with the desired end result.
- Access nested dictionary values with chained bracket notation: `my_dict["key1"]["key2"]`
- Use `.append()` to add an item to the end of a list

</details>
