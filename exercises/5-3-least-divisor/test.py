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
    least_divisor = ns.get('least_divisor')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    least_divisor = None

# Check function exists
if least_divisor is None:
    check(False, "Function 'least_divisor' is defined")
else:
    check(callable(least_divisor), "Function 'least_divisor' is defined")

# Test least_divisor
if least_divisor:
    test_cases = [
        (28, 2),
        (9, 3),
        (5, 5),
        (2, 2),
        (15, 3),
        (49, 7),
        (17, 17),
        (100, 2),
        (21, 3),
    ]

    for nr, expected in test_cases:
        try:
            result = least_divisor(nr)
            check(result == expected, f"least_divisor({nr}) == {expected} (got: {result})")
        except Exception as e:
            check(False, f"least_divisor({nr}) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
