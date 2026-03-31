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
    my_list = ns.get('my_list')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    my_list = None

# Check that my_list exists
if my_list is None:
    check(False, "Variable 'my_list' exists")
else:
    check(isinstance(my_list, list), "my_list is a list")

    expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    check(my_list == expected, f"my_list == {expected} (got: {my_list})")

    check(len(my_list) == 10, f"my_list has 10 elements (got: {len(my_list)})")

    check("zwei" not in my_list, "'zwei' has been replaced")
    check("hello!" not in my_list, "'hello!' has been removed")
    check(2 in my_list, "Number 2 is in the list")
    check(7 in my_list and 8 in my_list and 9 in my_list and 10 in my_list, "Numbers 7-10 are in the list")

# Check that student didn't just overwrite the list
try:
    with open('/home/pyodide/solution.py') as f:
        source = f.read()
    # Check for direct assignment of the full list
    import re
    # Strip comments so that hints in comments don't trigger false positives
    code_only = re.sub(r'#.*', '', source)
    has_overwrite = bool(re.search(r'my_list\s*=\s*\[1\s*,\s*2\s*,\s*3\s*,\s*4\s*,\s*5\s*,\s*6\s*,\s*7\s*,\s*8\s*,\s*9\s*,\s*10\s*\]', code_only))
    check(not has_overwrite, "Solution uses list operations (not just overwriting)")
except Exception:
    pass

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
