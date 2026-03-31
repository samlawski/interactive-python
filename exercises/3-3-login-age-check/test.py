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
    age_check = ns.get('age_check')
    login = ns.get('login')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    age_check = None
    login = None

# Check functions exist
if age_check is None:
    check(False, "Function 'age_check' is defined")
else:
    check(callable(age_check), "Function 'age_check' is defined")

if login is None:
    check(False, "Function 'login' is defined")
else:
    check(callable(login), "Function 'login' is defined")

# Test age_check
if age_check:
    try:
        check(age_check(19) == True, f"age_check(19) == True (got: {age_check(19)})")
    except Exception as e:
        check(False, f"age_check(19) raised {type(e).__name__}: {e}")

    try:
        check(age_check(18) == True, f"age_check(18) == True (got: {age_check(18)})")
    except Exception as e:
        check(False, f"age_check(18) raised {type(e).__name__}: {e}")

    try:
        check(age_check(7) == False, f"age_check(7) == False (got: {age_check(7)})")
    except Exception as e:
        check(False, f"age_check(7) raised {type(e).__name__}: {e}")

    try:
        check(age_check(17) == False, f"age_check(17) == False (got: {age_check(17)})")
    except Exception as e:
        check(False, f"age_check(17) raised {type(e).__name__}: {e}")

# Test login
if login:
    try:
        check(login("Frank", "Test1234", 18) == True, f"login('Frank', 'Test1234', 18) == True (got: {login('Frank', 'Test1234', 18)})")
    except Exception as e:
        check(False, f"login('Frank', 'Test1234', 18) raised {type(e).__name__}: {e}")

    try:
        check(login("Frank", "Test1234", 16) == False, f"login('Frank', 'Test1234', 16) == False (got: {login('Frank', 'Test1234', 16)})")
    except Exception as e:
        check(False, f"login('Frank', 'Test1234', 16) raised {type(e).__name__}: {e}")

    try:
        check(login("Frank", "Test12345", 18) == False, f"login('Frank', 'Test12345', 18) == False (got: {login('Frank', 'Test12345', 18)})")
    except Exception as e:
        check(False, f"login('Frank', 'Test12345', 18) raised {type(e).__name__}: {e}")

    try:
        check(login("Peter", "asdznasdq9e2n", 20) == True, f"login('Peter', 'asdznasdq9e2n', 20) == True (got: {login('Peter', 'asdznasdq9e2n', 20)})")
    except Exception as e:
        check(False, f"login('Peter', 'asdznasdq9e2n', 20) raised {type(e).__name__}: {e}")

    try:
        check(login("Peter", "wrong", 20) == False, f"login('Peter', 'wrong', 20) == False (got: {login('Peter', 'wrong', 20)})")
    except Exception as e:
        check(False, f"login('Peter', 'wrong', 20) raised {type(e).__name__}: {e}")

    try:
        check(login("Alice", "password", 25) == False, f"login('Alice', 'password', 25) == False (got: {login('Alice', 'password', 25)})")
    except Exception as e:
        check(False, f"login('Alice', 'password', 25) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
