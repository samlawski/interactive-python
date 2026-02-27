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

# Test 1: base=10, height=5 → area=25.0
try:
    output = run_code("10\n5\n")
    check("25" in output, "base=10, height=5 → output contains '25' (area = 25)")
except RuntimeError as e:
    print(f"  ❌ Test with base=10, height=5: {e}")
    failed += 1
    total += 1

# Test 2: base=7, height=4 → area=14.0
try:
    output = run_code("7\n4\n")
    check("14" in output, "base=7, height=4 → output contains '14' (area = 14)")
except RuntimeError as e:
    print(f"  ❌ Test with base=7, height=4: {e}")
    failed += 1
    total += 1

# Test 3: base=3, height=3 → area=4.5
try:
    output = run_code("3\n3\n")
    check("4.5" in output, "base=3, height=3 → output contains '4.5' (area = 4.5)")
except RuntimeError as e:
    print(f"  ❌ Test with base=3, height=3: {e}")
    failed += 1
    total += 1

# Test 4: base=100, height=1 → area=50
try:
    output = run_code("100\n1\n")
    check("50" in output, "base=100, height=1 → output contains '50' (area = 50)")
except RuntimeError as e:
    print(f"  ❌ Test with base=100, height=1: {e}")
    failed += 1
    total += 1

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
