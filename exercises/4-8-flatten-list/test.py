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
    ns = {}
    exec(compile(code, 'solution.py', 'exec'), ns)
    flatten = ns.get('flatten')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    flatten = None

# Check function exists
if flatten is None:
    check(False, "Function 'flatten' is defined")
else:
    check(callable(flatten), "Function 'flatten' is defined")

# Test flatten
if flatten:
    test_cases = [
        ([[1, 2], [3, 4], [5, 6]], [1, 2, 3, 4, 5, 6]),
        ([["a", "b"], ["c"]], ["a", "b", "c"]),
        ([[1], [2], [3]], [1, 2, 3]),
        ([[1, 2, 3]], [1, 2, 3]),
        ([[], [1, 2], []], [1, 2]),
        ([[10, 20], [30, 40], [50, 60], [70, 80]], [10, 20, 30, 40, 50, 60, 70, 80]),
    ]

    for inputs, expected in test_cases:
        try:
            result = flatten(inputs)
            check(result == expected, f"flatten({inputs}) == {expected} (got: {result})")
        except Exception as e:
            check(False, f"flatten({inputs}) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
