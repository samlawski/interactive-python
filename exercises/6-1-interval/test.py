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
    get_interval = ns.get('get_interval')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    get_interval = None

# Check function exists
if get_interval is None:
    check(False, "Function 'get_interval' is defined")
else:
    check(callable(get_interval), "Function 'get_interval' is defined")

# Test get_interval
if get_interval:
    # Test 1: 2 to 4
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("2\n4\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = list(get_interval())
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == [2, 3, 4], f"get_interval(2, 4) == [2, 3, 4] (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2: 1 to 1
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("1\n1\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = list(get_interval())
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == [1], f"get_interval(1, 1) == [1] (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: 5 to 10
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("5\n10\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = list(get_interval())
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == [5, 6, 7, 8, 9, 10], f"get_interval(5, 10) == [5, 6, 7, 8, 9, 10] (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: 0 to 3
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("0\n3\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = list(get_interval())
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == [0, 1, 2, 3], f"get_interval(0, 3) == [0, 1, 2, 3] (got: {result})")
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
