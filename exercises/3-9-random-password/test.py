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

# Load student code
try:
    with open('/home/pyodide/solution.py') as f:
        code = f.read()
    ns = {'input': lambda *args: '1', 'print': lambda *args, **kwargs: None}
    exec(compile(code, 'solution.py', 'exec'), ns)
    generate_password = ns.get('generate_password')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    generate_password = None

# Check function exists
if generate_password is None:
    check(False, "Function 'generate_password' is defined")
else:
    check(callable(generate_password), "Function 'generate_password' is defined")

if generate_password:
    # Test correct length
    try:
        result = generate_password(5)
        check(isinstance(result, str) and len(result) == 5, f"generate_password(5) returns a string of length 5 (got: '{result}')")
    except Exception as e:
        check(False, f"generate_password(5) raised {type(e).__name__}: {e}")

    # Test all lowercase
    try:
        result = generate_password(10)
        check(
            isinstance(result, str) and len(result) == 10 and result.isalpha() and result.islower(),
            f"generate_password(10) returns 10 lowercase letters (got: '{result}')"
        )
    except Exception as e:
        check(False, f"generate_password(10) raised {type(e).__name__}: {e}")

    # Test length 1
    try:
        result = generate_password(1)
        check(
            isinstance(result, str) and len(result) == 1 and result.islower(),
            f"generate_password(1) returns 1 lowercase letter (got: '{result}')"
        )
    except Exception as e:
        check(False, f"generate_password(1) raised {type(e).__name__}: {e}")

    # Test invalid length 0
    try:
        result = generate_password(0)
        check(result == "Invalid length", f"generate_password(0) == 'Invalid length' (got: {result})")
    except Exception as e:
        check(False, f"generate_password(0) raised {type(e).__name__}: {e}")

    # Test invalid negative length
    try:
        result = generate_password(-3)
        check(result == "Invalid length", f"generate_password(-3) == 'Invalid length' (got: {result})")
    except Exception as e:
        check(False, f"generate_password(-3) raised {type(e).__name__}: {e}")

    # Test randomness: two calls with length 20 should (almost certainly) produce different results
    try:
        r1 = generate_password(20)
        r2 = generate_password(20)
        check(r1 != r2, f"Two calls to generate_password(20) produce different results")
    except Exception as e:
        check(False, f"generate_password(20) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
