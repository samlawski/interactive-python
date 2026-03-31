import sys
import io

def run_code(input_data=""):
    _stdin, _stdout = sys.stdin, sys.stdout
    sys.stdin = io.StringIO(input_data)
    sys.stdout = captured = io.StringIO()
    try:
        with open('/home/pyodide/solution.py') as f:
            exec(compile(f.read(), 'solution.py', 'exec'), {'__name__': '__main__'})
    except Exception as e:
        sys.stdin, sys.stdout = _stdin, _stdout
        raise RuntimeError(f"Your code raised an error: {type(e).__name__}: {e}")
    finally:
        sys.stdin, sys.stdout = _stdin, _stdout
    return captured.getvalue()

passed = 0
failed = 0
total = 0

def check(condition, message):
    global passed, failed, total
    total += 1
    if condition:
        passed += 1
        print(f"  ✅ {message}")
    else:
        failed += 1
        print(f"  ❌ {message}")

print("Running tests...\n")

# Load student code
try:
    with open('/home/pyodide/solution.py') as f:
        code = f.read()
    ns = {'input': lambda *args: '1', 'print': lambda *args, **kwargs: None}
    exec(compile(code, 'solution.py', 'exec'), ns)
    bubble_sort = ns.get('bubble_sort')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    bubble_sort = None

# Check function exists
if bubble_sort is None:
    check(False, "Function 'bubble_sort' is defined")
else:
    check(callable(bubble_sort), "Function 'bubble_sort' is defined")

# Check no use of .sort() or sorted()
try:
    with open('/home/pyodide/solution.py') as f:
        source = f.read()
    import re
    # Strip comments so that hints in comments don't trigger false positives
    code_only = re.sub(r'#.*', '', source)
    uses_builtin = bool(re.search(r'\bsorted\s*\(', code_only)) or bool(re.search(r'\.sort\s*\(', code_only))
    check(not uses_builtin, "Solution does not use built-in sort() or sorted()")
except Exception:
    pass

# Test bubble_sort
if bubble_sort:
    test_cases = [
        ([1, 12, 3], [1, 3, 12]),
        ([23, 151, 6], [6, 23, 151]),
        ([5, 4, 3, 2, 1], [1, 2, 3, 4, 5]),
        ([1], [1]),
        ([1, 2, 3], [1, 2, 3]),
        ([3, 1, 4, 1, 5, 9, 2, 6], [1, 1, 2, 3, 4, 5, 6, 9]),
        ([-3, -1, -2], [-3, -2, -1]),
    ]

    for inputs, expected in test_cases:
        try:
            result = bubble_sort(inputs[:])  # pass a copy
            check(result == expected, f"bubble_sort({inputs}) == {expected} (got: {result})")
        except Exception as e:
            check(False, f"bubble_sort({inputs}) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
