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

# Test 1: 1, 2, 3 → "1 < 2 < 3"
try:
    output = run_code("1\n2\n3\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("1 < 2 < 3"),
        f"1, 2, 3 → '1 < 2 < 3' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: 120, 30, 5 → "5 < 30 < 120"
try:
    output = run_code("120\n30\n5\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("5 < 30 < 120"),
        f"120, 30, 5 → '5 < 30 < 120' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: 7, 3, 5 → "3 < 5 < 7"
try:
    output = run_code("7\n3\n5\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("3 < 5 < 7"),
        f"7, 3, 5 → '3 < 5 < 7' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: 10, 10, 10 → "10 < 10 < 10"
try:
    output = run_code("10\n10\n10\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("10 < 10 < 10"),
        f"10, 10, 10 → '10 < 10 < 10' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: -5, 0, -10 → "-10 < -5 < 0"
try:
    output = run_code("-5\n0\n-10\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("-10 < -5 < 0"),
        f"-5, 0, -10 → '-10 < -5 < 0' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Check that sort/sorted is not used
try:
    with open('/home/pyodide/solution.py') as f:
        code = f.read()
    check(
        "sort(" not in code and "sorted(" not in code and ".sort()" not in code,
        "Solution does not use sort() or sorted()"
    )
except Exception:
    pass

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
