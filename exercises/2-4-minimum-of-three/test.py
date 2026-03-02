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

# Test 1: 1, 3, 6 → The minimum is 1
try:
    output = run_code("1\n3\n6\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "The minimum is 1",
        f"1, 3, 6 → 'The minimum is 1' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: 13, 7, 1213 → The minimum is 7
try:
    output = run_code("13\n7\n1213\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "The minimum is 7",
        f"13, 7, 1213 → 'The minimum is 7' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: 5, 5, 5 → The minimum is 5
try:
    output = run_code("5\n5\n5\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "The minimum is 5",
        f"5, 5, 5 → 'The minimum is 5' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: 100, 2, 50 → The minimum is 2
try:
    output = run_code("100\n2\n50\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "The minimum is 2",
        f"100, 2, 50 → 'The minimum is 2' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: -3, -1, -7 → The minimum is -7
try:
    output = run_code("-3\n-1\n-7\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "The minimum is -7",
        f"-3, -1, -7 → 'The minimum is -7' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Check that min() is not used
try:
    with open('/home/pyodide/solution.py') as f:
        code = f.read()
    check(
        "min(" not in code,
        "Solution does not use the built-in min() function"
    )
except Exception:
    pass

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
