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
    list_sum = ns.get('list_sum')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    list_sum = None

# Check function exists
if list_sum is None:
    check(False, "Function 'list_sum' is defined")
else:
    check(callable(list_sum), "Function 'list_sum' is defined")

# Check no use of sum()
try:
    with open('/home/pyodide/solution.py') as f:
        source = f.read()
    import re
    # Strip comments so that hints in comments don't trigger false positives
    code_only = re.sub(r'#.*', '', source)
    uses_sum = bool(re.search(r'\bsum\s*\(', code_only))
    check(not uses_sum, "Solution does not use the built-in sum() function")
except Exception:
    pass

# Test list_sum
if list_sum:
    test_cases = [
        ([1, 2, 4], 7),
        ([7, 70, 0.7], 77.7),
        ([1, 2, 3, 4, 5, 6], 21),
        ([0], 0),
        ([100, -50, -50], 0),
        ([-1, -2, -3], -6),
        ([1.5, 2.5, 3.0], 7.0),
    ]

    for inputs, expected in test_cases:
        try:
            result = list_sum(inputs)
            check(result == expected, f"list_sum({inputs}) == {expected} (got: {result})")
        except Exception as e:
            check(False, f"list_sum({inputs}) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
