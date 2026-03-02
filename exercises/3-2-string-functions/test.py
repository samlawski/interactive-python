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
    ns = {}
    exec(compile(code, 'solution.py', 'exec'), ns)
    is_all_caps = ns.get('is_all_caps')
    is_lower_case = ns.get('is_lower_case')
    equals_ignore_case = ns.get('equals_ignore_case')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    is_all_caps = None
    is_lower_case = None
    equals_ignore_case = None

# Check functions exist
if is_all_caps is None:
    check(False, "Function 'is_all_caps' is defined")
else:
    check(callable(is_all_caps), "Function 'is_all_caps' is defined")

if is_lower_case is None:
    check(False, "Function 'is_lower_case' is defined")
else:
    check(callable(is_lower_case), "Function 'is_lower_case' is defined")

if equals_ignore_case is None:
    check(False, "Function 'equals_ignore_case' is defined")
else:
    check(callable(equals_ignore_case), "Function 'equals_ignore_case' is defined")

# Test is_all_caps
if is_all_caps:
    try:
        check(is_all_caps("SEVEN") == True, f"is_all_caps('SEVEN') == True (got: {is_all_caps('SEVEN')})")
    except Exception as e:
        check(False, f"is_all_caps('SEVEN') raised {type(e).__name__}: {e}")

    try:
        check(is_all_caps("Seven") == False, f"is_all_caps('Seven') == False (got: {is_all_caps('Seven')})")
    except Exception as e:
        check(False, f"is_all_caps('Seven') raised {type(e).__name__}: {e}")

    try:
        check(is_all_caps("hello") == False, f"is_all_caps('hello') == False (got: {is_all_caps('hello')})")
    except Exception as e:
        check(False, f"is_all_caps('hello') raised {type(e).__name__}: {e}")

    try:
        check(is_all_caps("ABC") == True, f"is_all_caps('ABC') == True (got: {is_all_caps('ABC')})")
    except Exception as e:
        check(False, f"is_all_caps('ABC') raised {type(e).__name__}: {e}")

# Test is_lower_case
if is_lower_case:
    try:
        check(is_lower_case("seven") == True, f"is_lower_case('seven') == True (got: {is_lower_case('seven')})")
    except Exception as e:
        check(False, f"is_lower_case('seven') raised {type(e).__name__}: {e}")

    try:
        check(is_lower_case("Seven") == False, f"is_lower_case('Seven') == False (got: {is_lower_case('Seven')})")
    except Exception as e:
        check(False, f"is_lower_case('Seven') raised {type(e).__name__}: {e}")

    try:
        check(is_lower_case("HELLO") == False, f"is_lower_case('HELLO') == False (got: {is_lower_case('HELLO')})")
    except Exception as e:
        check(False, f"is_lower_case('HELLO') raised {type(e).__name__}: {e}")

    try:
        check(is_lower_case("abc") == True, f"is_lower_case('abc') == True (got: {is_lower_case('abc')})")
    except Exception as e:
        check(False, f"is_lower_case('abc') raised {type(e).__name__}: {e}")

# Test equals_ignore_case
if equals_ignore_case:
    try:
        check(equals_ignore_case("Seven", "seven") == True, f"equals_ignore_case('Seven', 'seven') == True (got: {equals_ignore_case('Seven', 'seven')})")
    except Exception as e:
        check(False, f"equals_ignore_case('Seven', 'seven') raised {type(e).__name__}: {e}")

    try:
        check(equals_ignore_case("seven", "eight") == False, f"equals_ignore_case('seven', 'eight') == False (got: {equals_ignore_case('seven', 'eight')})")
    except Exception as e:
        check(False, f"equals_ignore_case('seven', 'eight') raised {type(e).__name__}: {e}")

    try:
        check(equals_ignore_case("HELLO", "hello") == True, f"equals_ignore_case('HELLO', 'hello') == True (got: {equals_ignore_case('HELLO', 'hello')})")
    except Exception as e:
        check(False, f"equals_ignore_case('HELLO', 'hello') raised {type(e).__name__}: {e}")

    try:
        check(equals_ignore_case("Python", "PYTHON") == True, f"equals_ignore_case('Python', 'PYTHON') == True (got: {equals_ignore_case('Python', 'PYTHON')})")
    except Exception as e:
        check(False, f"equals_ignore_case('Python', 'PYTHON') raised {type(e).__name__}: {e}")

    try:
        check(equals_ignore_case("abc", "xyz") == False, f"equals_ignore_case('abc', 'xyz') == False (got: {equals_ignore_case('abc', 'xyz')})")
    except Exception as e:
        check(False, f"equals_ignore_case('abc', 'xyz') raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
