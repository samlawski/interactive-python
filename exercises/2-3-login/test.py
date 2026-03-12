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

# Test 1: Frank with correct password
try:
    output = run_code("Frank\nTest1234\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("Login Succeeded"),
        f"Frank + Test1234 → 'Login Succeeded' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: Peter with correct password
try:
    output = run_code("Peter\nasdznasdq9e2n\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("Login Succeeded"),
        f"Peter + asdznasdq9e2n → 'Login Succeeded' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: Frank with wrong password
try:
    output = run_code("Frank\nTest12345\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("Login Failed"),
        f"Frank + Test12345 → 'Login Failed' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: Peter with Frank's password
try:
    output = run_code("Peter\nTest1234\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("Login Failed"),
        f"Peter + Test1234 → 'Login Failed' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: Unknown user
try:
    output = run_code("Alice\npassword\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result.endswith("Login Failed"),
        f"Alice + password → 'Login Failed' (got: '{result}')"
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
