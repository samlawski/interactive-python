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

# Test 1: 1, 3, 2, 1, 0 → 7
try:
    output = run_code("1\n3\n2\n1\n0\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("7" in last_line, f"Input 1,3,2,1,0 → prints 7 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 1: {e}")

# Test 2: 1, 7, 9, 0 → 17
try:
    output = run_code("1\n7\n9\n0\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("17" in last_line, f"Input 1,7,9,0 → prints 17 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 2: {e}")

# Test 3: 0 → 0 (only zero entered)
try:
    output = run_code("0\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("0" in last_line, f"Input 0 → prints 0 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 3: {e}")

# Test 4: 10, 20, 30, 0 → 60
try:
    output = run_code("10\n20\n30\n0\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("60" in last_line, f"Input 10,20,30,0 → prints 60 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 4: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
