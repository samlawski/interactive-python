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
    greet_user = ns.get('greet_user')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    greet_user = None

# Check function exists
if greet_user is None:
    check(False, "Function 'greet_user' is defined")
else:
    check(callable(greet_user), "Function 'greet_user' is defined")

# Test greet_user
if greet_user:
    test_cases = [
        (77, "Hello Sir/Madam"),
        (18, "Hello Sir/Madam"),
        (9, "Hello lil one!"),
        (7, "Hello lil one!"),
        (6, "Hello lil one!"),
        (5, "Hey! You're too young to write!"),
        (0, "Hey! You're too young to write!"),
        (25, "Hello Sir/Madam"),
        (17, "Hello lil one!"),
    ]

    for age, expected in test_cases:
        try:
            result = greet_user(age)
            check(result == expected, f"greet_user({age}) == '{expected}' (got: '{result}')")
        except Exception as e:
            check(False, f"greet_user({age}) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
