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
    average_grades = ns.get('average_grades')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    average_grades = None

# Check function exists
if average_grades is None:
    check(False, "Function 'average_grades' is defined")
else:
    check(callable(average_grades), "Function 'average_grades' is defined")

# Test average_grades
if average_grades:
    # Test 1: single student
    try:
        result = average_grades([{"name": "Alice", "grades": [1.0, 2.0, 3.0]}])
        expected = {"Alice": 2.0}
        check(result == expected, f"Single student: Alice avg 2.0 (got: {result})")
    except Exception as e:
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2: two students
    try:
        result = average_grades([
            {"name": "Alice", "grades": [1.0, 2.0]},
            {"name": "Bob", "grades": [3.0, 4.0]}
        ])
        expected = {"Alice": 1.5, "Bob": 3.5}
        check(result == expected, f"Two students: Alice 1.5, Bob 3.5 (got: {result})")
    except Exception as e:
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: single grade
    try:
        result = average_grades([{"name": "Charlie", "grades": [5.0]}])
        expected = {"Charlie": 5.0}
        check(result == expected, f"Single grade: Charlie 5.0 (got: {result})")
    except Exception as e:
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: multiple students
    try:
        result = average_grades([
            {"name": "Alice", "grades": [1.0, 1.0, 1.0]},
            {"name": "Bob", "grades": [2.0, 3.0]},
            {"name": "Charlie", "grades": [4.0, 4.0, 4.0, 4.0]}
        ])
        expected = {"Alice": 1.0, "Bob": 2.5, "Charlie": 4.0}
        check(result == expected, f"Three students correct (got: {result})")
    except Exception as e:
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

    # Test 5: returns a dictionary
    try:
        result = average_grades([{"name": "Test", "grades": [1.0]}])
        check(isinstance(result, dict), f"Returns a dictionary (got: {type(result).__name__})")
    except Exception as e:
        check(False, f"Test 5 raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
