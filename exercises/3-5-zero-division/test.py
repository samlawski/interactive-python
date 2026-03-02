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

# Test 1: 4 and 2 → 2
try:
    output = run_code("4\n2\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "2",
        f"4 // 2 → '2' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: 10 and 3 → 3
try:
    output = run_code("10\n3\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "3",
        f"10 // 3 → '3' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: Division by zero → "ZeroDivisionError"
try:
    output = run_code("5\n0\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "ZeroDivisionError",
        f"5 // 0 → 'ZeroDivisionError' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: Invalid first input → "ValueError"
try:
    output = run_code("hello\n2\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "ValueError",
        f"'hello' // 2 → 'ValueError' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: Invalid second input → "ValueError"
try:
    output = run_code("4\nabc\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "ValueError",
        f"4 // 'abc' → 'ValueError' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 6: 7 and 1 → 7
try:
    output = run_code("7\n1\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "7",
        f"7 // 1 → '7' (got: '{result}')"
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
