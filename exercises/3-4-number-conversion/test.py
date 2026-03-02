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

# Test 1: Valid inputs 2 and 5.0 → 10.0
try:
    output = run_code("2\n5.0\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "10.0",
        f"2 and 5.0 → '10.0' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: Invalid integer "hello" and valid float 5.0 → prints "Not an Integer" and then 0.0
try:
    output = run_code("hello\n5.0\n")
    lines = output.strip().splitlines()
    has_not_int = any("Not an Integer" in l for l in lines)
    last_line = lines[-1].strip()
    check(
        has_not_int,
        f"'hello' as integer → prints 'Not an Integer' (got: '{output.strip()}')"
    )
    check(
        last_line == "0.0",
        f"Product with default 0 → '0.0' (got: '{last_line}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: Valid integer 1 and invalid float "hello" → prints "Not a Float" and then 0.0
try:
    output = run_code("1\nhello\n")
    lines = output.strip().splitlines()
    has_not_float = any("Not a Float" in l for l in lines)
    last_line = lines[-1].strip()
    check(
        has_not_float,
        f"'hello' as float → prints 'Not a Float' (got: '{output.strip()}')"
    )
    check(
        last_line == "0.0",
        f"Product with default 0 → '0.0' (got: '{last_line}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: Both invalid → prints "Not an Integer" and "Not a Float" and then 0.0
try:
    output = run_code("abc\nxyz\n")
    lines = output.strip().splitlines()
    has_not_int = any("Not an Integer" in l for l in lines)
    has_not_float = any("Not a Float" in l for l in lines)
    last_line = lines[-1].strip()
    check(
        has_not_int and has_not_float,
        f"Both invalid → prints both error messages (got: '{output.strip()}')"
    )
    check(
        last_line == "0.0",
        f"Product of two defaults → '0.0' (got: '{last_line}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: Valid inputs 3 and 2.5 → 7.5
try:
    output = run_code("3\n2.5\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "7.5",
        f"3 and 2.5 → '7.5' (got: '{result}')"
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
