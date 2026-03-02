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
    is_prime = ns.get('is_prime')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    is_prime = None

# Check function exists
if is_prime is None:
    check(False, "Function 'is_prime' is defined")
else:
    check(callable(is_prime), "Function 'is_prime' is defined")

# Check no loops are used
try:
    with open('/home/pyodide/solution.py') as f:
        source = f.read()
    has_loop = "for " in source or "while " in source
    check(not has_loop, "Solution does not use loops (uses recursion instead)")
except Exception:
    pass

# Test is_prime
if is_prime:
    test_cases = [
        (2, True),
        (3, True),
        (4, False),
        (5, True),
        (6, False),
        (7, True),
        (8, False),
        (9, False),
        (10, False),
        (11, True),
        (13, True),
        (15, False),
        (17, True),
        (1, False),
        (0, False),
        (29, True),
    ]

    for nr, expected in test_cases:
        try:
            result = is_prime(nr)
            check(result == expected, f"is_prime({nr}) == {expected} (got: {result})")
        except Exception as e:
            check(False, f"is_prime({nr}) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
