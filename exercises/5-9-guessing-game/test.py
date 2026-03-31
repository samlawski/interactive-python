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
    guessing_game = ns.get('guessing_game')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    guessing_game = None

# Check function exists
if guessing_game is None:
    check(False, "Function 'guessing_game' is defined")
else:
    check(callable(guessing_game), "Function 'guessing_game' is defined")

# Test guessing_game
if guessing_game:
    # Test 1: correct on first guess
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("7\n")
        _stdout = sys.stdout
        sys.stdout = captured = io.StringIO()
        result = guessing_game(7)
        output = captured.getvalue()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 1, f"Correct first guess → returns 1 (got: {result})")
        check("Correct" in output, f"Prints 'Correct!' on correct guess")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2: too low, then correct
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("3\n7\n")
        _stdout = sys.stdout
        sys.stdout = captured = io.StringIO()
        result = guessing_game(7)
        output = captured.getvalue()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 2, f"Low then correct → returns 2 (got: {result})")
        check("low" in output.lower(), f"Prints 'Too low!' for low guess")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: too high, then correct
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("10\n7\n")
        _stdout = sys.stdout
        sys.stdout = captured = io.StringIO()
        result = guessing_game(7)
        output = captured.getvalue()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 2, f"High then correct → returns 2 (got: {result})")
        check("high" in output.lower(), f"Prints 'Too high!' for high guess")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: multiple attempts
    try:
        _stdin = sys.stdin
        sys.stdin = io.StringIO("1\n2\n3\n4\n5\n")
        _stdout = sys.stdout
        sys.stdout = captured = io.StringIO()
        result = guessing_game(5)
        output = captured.getvalue()
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(result == 5, f"5 attempts → returns 5 (got: {result})")
    except Exception as e:
        sys.stdin = _stdin
        sys.stdout = _stdout
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
