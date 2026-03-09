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
    read_ten = ns.get('read_ten')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    read_ten = None

# Check function exists
if read_ten is None:
    check(False, "Function 'read_ten' is defined")
else:
    check(callable(read_ten), "Function 'read_ten' is defined")

# Test read_ten
if read_ten:
    # Test 1: 10 valid numbers
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("1.0\n2.0\n3.0\n4.0\n5.0\n6.0\n7.0\n8.0\n9.0\n10.0\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = read_ten()
        sys.stdin = _stdin
        sys.stdout = _stdout
        expected = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]
        check(result == expected, f"10 valid inputs returns correct list (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2: returns exactly 10 numbers
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("5.5\n" * 10)
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = read_ten()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(len(result) == 10, f"Returns exactly 10 numbers (got: {len(result)})")
        check(all(x == 5.5 for x in result), f"All values are 5.5 (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: handles invalid input then valid input
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("BLA\n1.0\n2.0\n3.0\n4.0\n5.0\n6.0\n7.0\n8.0\n9.0\n10.0\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = read_ten()
        sys.stdin = _stdin
        sys.stdout = _stdout
        expected = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0]
        check(result == expected, f"Handles invalid input gracefully (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: returns floats
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n")
        _stdout = sys.stdout
        sys.stdout = io.StringIO()
        result = read_ten()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(all(isinstance(x, float) for x in result), f"All returned values are floats")
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
