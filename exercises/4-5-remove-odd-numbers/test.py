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
    remove_odd_nrs = ns.get('remove_odd_nrs')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    remove_odd_nrs = None

# Check function exists
if remove_odd_nrs is None:
    check(False, "Function 'remove_odd_nrs' is defined")
else:
    check(callable(remove_odd_nrs), "Function 'remove_odd_nrs' is defined")

# Test remove_odd_nrs
if remove_odd_nrs:
    # Test 1
    try:
        list1 = [1, 2, 3, 4]
        remove_odd_nrs(list1)
        check(list1 == [2, 4], f"[1, 2, 3, 4] → [2, 4] (got: {list1})")
    except Exception as e:
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2
    try:
        list2 = [3, 4, 5, 8, 2, 5]
        remove_odd_nrs(list2)
        check(list2 == [4, 8, 2], f"[3, 4, 5, 8, 2, 5] → [4, 8, 2] (got: {list2})")
    except Exception as e:
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3
    try:
        list3 = [77, 76, 84, 92, 27]
        remove_odd_nrs(list3)
        check(list3 == [76, 84, 92], f"[77, 76, 84, 92, 27] → [76, 84, 92] (got: {list3})")
    except Exception as e:
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: all odd
    try:
        list4 = [1, 3, 5]
        remove_odd_nrs(list4)
        check(list4 == [], f"[1, 3, 5] → [] (got: {list4})")
    except Exception as e:
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

    # Test 5: all even
    try:
        list5 = [2, 4, 6]
        remove_odd_nrs(list5)
        check(list5 == [2, 4, 6], f"[2, 4, 6] → [2, 4, 6] (got: {list5})")
    except Exception as e:
        check(False, f"Test 5 raised {type(e).__name__}: {e}")

    # Test 6: verify in-place modification
    try:
        list6 = [1, 2, 3]
        original_id = id(list6)
        remove_odd_nrs(list6)
        check(id(list6) == original_id, "List is modified in place (same object)")
    except Exception as e:
        check(False, f"In-place test raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
