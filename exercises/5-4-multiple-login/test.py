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
    login = ns.get('login')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    login = None

# Check function exists
if login is None:
    check(False, "Function 'login' is defined")
else:
    check(callable(login), "Function 'login' is defined")

# Test login
if login:
    # Test 1: correct on first try (Frank / Test1234)
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("Frank\nTest1234\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = login()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 1, f"Correct first try → returns 1 (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2: wrong once, then correct (Manuel / Code4Ever)
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("wrong\nwrong\nManuel\nCode4Ever\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = login()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 2, f"Wrong once then correct → returns 2 (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: Tom / Code4Ever on first try
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("Tom\nCode4Ever\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = login()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 1, f"Tom/Code4Ever first try → returns 1 (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: wrong password for valid user, then correct
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("Frank\nwrongpass\nFrank\nTest1234\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = login()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 2, f"Wrong password then correct → returns 2 (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
