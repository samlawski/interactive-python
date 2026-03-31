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
    matrix_add = ns.get('matrix_add')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    matrix_add = None

# Check function exists
if matrix_add is None:
    check(False, "Function 'matrix_add' is defined")
else:
    check(callable(matrix_add), "Function 'matrix_add' is defined")

# Test matrix_add
if matrix_add:
    # Test 1
    try:
        result = matrix_add([[1, 2], [3, 4]], [[5, 6], [7, 8]])
        expected = [[6, 8], [10, 12]]
        check(result == expected, f"matrix_add([[1,2],[3,4]], [[5,6],[7,8]]) == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2
    try:
        result = matrix_add([[1, 2], [3, 4]], [[6, 5], [4, 3]])
        expected = [[7, 7], [7, 7]]
        check(result == expected, f"matrix_add([[1,2],[3,4]], [[6,5],[4,3]]) == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: 3x3 matrix
    try:
        result = matrix_add([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[9, 8, 7], [6, 5, 4], [3, 2, 1]])
        expected = [[10, 10, 10], [10, 10, 10], [10, 10, 10]]
        check(result == expected, f"3x3 matrix addition works (got: {result})")
    except Exception as e:
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: 1x1 matrix
    try:
        result = matrix_add([[5]], [[3]])
        expected = [[8]]
        check(result == expected, f"matrix_add([[5]], [[3]]) == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

    # Test 5: zeros
    try:
        result = matrix_add([[0, 0], [0, 0]], [[1, 2], [3, 4]])
        expected = [[1, 2], [3, 4]]
        check(result == expected, f"Adding zero matrix works (got: {result})")
    except Exception as e:
        check(False, f"Test 5 raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
