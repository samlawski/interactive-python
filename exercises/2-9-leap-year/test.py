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

# Test 1: 2024 → leap year (divisible by 4)
try:
    output = run_code("2024\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("2024 is a leap year"),
        f"2024 → '2024 is a leap year' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: 2023 → not a leap year
try:
    output = run_code("2023\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("2023 is not a leap year"),
        f"2023 → '2023 is not a leap year' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: 1900 → not a leap year (divisible by 100, not 400)
try:
    output = run_code("1900\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("1900 is not a leap year"),
        f"1900 → '1900 is not a leap year' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: 2000 → leap year (divisible by 400)
try:
    output = run_code("2000\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("2000 is a leap year"),
        f"2000 → '2000 is a leap year' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: 1600 → leap year (divisible by 400)
try:
    output = run_code("1600\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("1600 is a leap year"),
        f"1600 → '1600 is a leap year' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 6: 2100 → not a leap year (divisible by 100, not 400)
try:
    output = run_code("2100\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("2100 is not a leap year"),
        f"2100 → '2100 is not a leap year' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
