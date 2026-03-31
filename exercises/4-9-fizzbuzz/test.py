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
    fizzbuzz = ns.get('fizzbuzz')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    fizzbuzz = None

# Check function exists
if fizzbuzz is None:
    check(False, "Function 'fizzbuzz' is defined")
else:
    check(callable(fizzbuzz), "Function 'fizzbuzz' is defined")

# Test fizzbuzz
if fizzbuzz:
    # Test 1: n=5
    try:
        result = fizzbuzz(5)
        expected = ["1", "2", "Fizz", "4", "Buzz"]
        check(result == expected, f"fizzbuzz(5) == {expected} (got: {result})")
    except Exception as e:
        check(False, f"fizzbuzz(5) raised {type(e).__name__}: {e}")

    # Test 2: n=15
    try:
        result = fizzbuzz(15)
        expected = ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
        check(result == expected, f"fizzbuzz(15) == {expected} (got: {result})")
    except Exception as e:
        check(False, f"fizzbuzz(15) raised {type(e).__name__}: {e}")

    # Test 3: n=1
    try:
        result = fizzbuzz(1)
        expected = ["1"]
        check(result == expected, f"fizzbuzz(1) == {expected} (got: {result})")
    except Exception as e:
        check(False, f"fizzbuzz(1) raised {type(e).__name__}: {e}")

    # Test 4: n=3
    try:
        result = fizzbuzz(3)
        expected = ["1", "2", "Fizz"]
        check(result == expected, f"fizzbuzz(3) == {expected} (got: {result})")
    except Exception as e:
        check(False, f"fizzbuzz(3) raised {type(e).__name__}: {e}")

    # Test 5: Check that 15 is FizzBuzz not just Fizz or Buzz
    try:
        result = fizzbuzz(15)
        check(result[14] == "FizzBuzz", f"Element at position 15 is 'FizzBuzz' (got: '{result[14]}')")
    except Exception as e:
        check(False, f"FizzBuzz check raised {type(e).__name__}: {e}")

    # Test 6: Check that elements are strings
    try:
        result = fizzbuzz(3)
        all_strings = all(isinstance(x, str) for x in result)
        check(all_strings, "All elements are strings")
    except Exception as e:
        check(False, f"String check raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
