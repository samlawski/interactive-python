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

# Test 1: 1 + 3 + 3 = 7
try:
    output = run_code("1\n3\n3\n")
    check("7" in output, "1 + 3 + 3 → output contains '7'")
except RuntimeError as e:
    print(f"  ❌ Test with 1, 3, 3: {e}")
    failed += 1
    total += 1

# Test 2: 10 + 20 + 30 = 60
try:
    output = run_code("10\n20\n30\n")
    check("60" in output, "10 + 20 + 30 → output contains '60'")
except RuntimeError as e:
    print(f"  ❌ Test with 10, 20, 30: {e}")
    failed += 1
    total += 1

# Test 3: 0 + 0 + 0 = 0
try:
    output = run_code("0\n0\n0\n")
    check("0" in output, "0 + 0 + 0 → output contains '0'")
except RuntimeError as e:
    print(f"  ❌ Test with 0, 0, 0: {e}")
    failed += 1
    total += 1

# Test 4: -5 + 10 + 3 = 8
try:
    output = run_code("-5\n10\n3\n")
    check("8" in output, "-5 + 10 + 3 → output contains '8'")
except RuntimeError as e:
    print(f"  ❌ Test with -5, 10, 3: {e}")
    failed += 1
    total += 1

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
