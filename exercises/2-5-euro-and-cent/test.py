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

# Test 1: 12.34 → 12€ 34ct
try:
    output = run_code("12.34\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("12€ 34ct"),
        f"12.34 → '12€ 34ct' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: 5.6789 → 5€ 68ct
try:
    output = run_code("5.6789\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("5€ 68ct"),
        f"5.6789 → '5€ 68ct' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: 0.99 → 0€ 99ct
try:
    output = run_code("0.99\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("0€ 99ct"),
        f"0.99 → '0€ 99ct' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: 100.00 → 100€ 0ct
try:
    output = run_code("100.00\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("100€ 0ct"),
        f"100.00 → '100€ 0ct' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: 3.005 → 3€ 0ct (rounds to 0 cents since 0.5 rounds to 0 in banker's rounding, but round(0.5)=0)
try:
    output = run_code("7.555\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("7€ 56ct"),
        f"7.555 → '7€ 56ct' (got: '{result}')"
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
