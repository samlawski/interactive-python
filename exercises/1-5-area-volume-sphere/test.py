import sys
import io
import math

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

pi = math.pi

# Test with radius = 5
# Area  = 4 * pi * 25 = 314.159...
# Volume = 4/3 * pi * 125 = 523.598...
try:
    output = run_code("5\n")
    check("314" in output, "r=5 → output contains '314' (area ≈ 314.16)")
    check("523" in output, "r=5 → output contains '523' (volume ≈ 523.60)")
except RuntimeError as e:
    print(f"  ❌ Test with r=5: {e}")
    failed += 2
    total += 2

# Test with radius = 1
# Area  = 4 * pi ≈ 12.566
# Volume = 4/3 * pi ≈ 4.189
try:
    output = run_code("1\n")
    check("12" in output, "r=1 → output contains '12' (area ≈ 12.57)")
    check("4.1" in output or "4.19" in output or "4.18" in output,
          "r=1 → output contains volume ≈ 4.19")
except RuntimeError as e:
    print(f"  ❌ Test with r=1: {e}")
    failed += 2
    total += 2

# Test with radius = 10
# Area  = 4 * pi * 100 = 1256.637...
# Volume = 4/3 * pi * 1000 = 4188.790...
try:
    output = run_code("10\n")
    check("1256" in output, "r=10 → output contains '1256' (area ≈ 1256.64)")
    check("4188" in output, "r=10 → output contains '4188' (volume ≈ 4188.79)")
except RuntimeError as e:
    print(f"  ❌ Test with r=10: {e}")
    failed += 2
    total += 2

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
