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
    rename = ns.get('rename')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    rename = None

# Check function exists
if rename is None:
    check(False, "Function 'rename' is defined")
else:
    check(callable(rename), "Function 'rename' is defined")

# Test rename
if rename:
    # Test 1: rename one student
    try:
        students1 = [
            {"f_name": "Manuel", "l_name": "Dolderer"},
            {"f_name": "Jonathan", "l_name": "Rüth"},
            {"f_name": "Thomas", "l_name": "Bachem"},
        ]
        expected1 = [
            {"f_name": "Manuel", "l_name": "Dolderer"},
            {"f_name": "Jonathan", "l_name": "Meier"},
            {"f_name": "Thomas", "l_name": "Bachem"},
        ]
        rename(students1, "Rüth", "Meier")
        check(students1 == expected1, f"Rename 'Rüth' → 'Meier' (got: {students1})")
    except Exception as e:
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2: rename all students (multiple matches)
    try:
        students2 = [
            {"f_name": "Manuel", "l_name": "Dolderer"},
            {"f_name": "Jonathan", "l_name": "Dolderer"},
            {"f_name": "Thomas", "l_name": "Dolderer"},
        ]
        expected2 = [
            {"f_name": "Manuel", "l_name": "Zimmer"},
            {"f_name": "Jonathan", "l_name": "Zimmer"},
            {"f_name": "Thomas", "l_name": "Zimmer"},
        ]
        rename(students2, "Dolderer", "Zimmer")
        check(students2 == expected2, f"Rename all 'Dolderer' → 'Zimmer' (got: {students2})")
    except Exception as e:
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: no match — list unchanged
    try:
        students3 = [
            {"f_name": "Alice", "l_name": "Smith"},
            {"f_name": "Bob", "l_name": "Jones"},
        ]
        expected3 = [
            {"f_name": "Alice", "l_name": "Smith"},
            {"f_name": "Bob", "l_name": "Jones"},
        ]
        rename(students3, "Doe", "Brown")
        check(students3 == expected3, f"No match: list unchanged (got: {students3})")
    except Exception as e:
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: in-place modification
    try:
        students4 = [{"f_name": "Test", "l_name": "Old"}]
        original_id = id(students4[0])
        rename(students4, "Old", "New")
        check(id(students4[0]) == original_id, "Dictionaries are modified in place (same object)")
        check(students4[0]["l_name"] == "New", f"Name changed to 'New' (got: '{students4[0]['l_name']}')")
    except Exception as e:
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
