# 1.7 Swap Variables

## Task

Two variables `a` and `b` have been given values. Your job is to **swap** them so that `a` holds the value that was in `b`, and `b` holds the value that was in `a`.

The starter code prints `a` and `b` at the end — **don't change the print statements or the initial assignments**.

## Example

Before:
```
a = 7
b = 3
```

After your code runs:
```
a is now: 3
b is now: 7
```

<details>
<summary>💡 Hints</summary>

- You can use a **temporary variable** to hold one of the values while you swap
- Think of it like swapping the contents of two cups — you need a third empty cup!

</details>

<details>
<summary>💡 Still stuck?</summary>

```python
temp = a
a = b
b = temp
```

Or, in Python, you can also do: `a, b = b, a` (but try the long way first to understand the concept!)

</details>
