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
    count_a = ns.get('count_a')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    count_a = None

# Check function exists
if count_a is None:
    check(False, "Function 'count_a' is defined")
else:
    check(callable(count_a), "Function 'count_a' is defined")

# Test count_a
if count_a:
    test_cases = [
        ("Alfalfa", 3),
        ("Abigaile", 2),
        ("AbrakadabrA", 5),
        ("hello", 0),
        ("AAAA", 4),
        ("banana", 3),
        ("", 0),
    ]

    for text, expected in test_cases:
        try:
            result = count_a(text)
            check(result == expected, f"count_a('{text}') == {expected} (got: {result})")
        except Exception as e:
            check(False, f"count_a('{text}') raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
