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
    word_frequency = ns.get('word_frequency')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    word_frequency = None

# Check function exists
if word_frequency is None:
    check(False, "Function 'word_frequency' is defined")
else:
    check(callable(word_frequency), "Function 'word_frequency' is defined")

# Test word_frequency
if word_frequency:
    # Test 1
    try:
        result = word_frequency("hello world hello")
        expected = {"hello": 2, "world": 1}
        check(result == expected, f"word_frequency('hello world hello') == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2
    try:
        result = word_frequency("the cat sat on the mat")
        expected = {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}
        check(result == expected, f"word_frequency('the cat sat on the mat') == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: case insensitive
    try:
        result = word_frequency("Hello HELLO hello")
        expected = {"hello": 3}
        check(result == expected, f"word_frequency('Hello HELLO hello') == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: single word
    try:
        result = word_frequency("python")
        expected = {"python": 1}
        check(result == expected, f"word_frequency('python') == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

    # Test 5: all same words
    try:
        result = word_frequency("a a a a")
        expected = {"a": 4}
        check(result == expected, f"word_frequency('a a a a') == {expected} (got: {result})")
    except Exception as e:
        check(False, f"Test 5 raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
