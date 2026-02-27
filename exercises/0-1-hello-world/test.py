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

# Test 1: The prompt should ask "What is your name?"
try:
    output = run_code("Alice\n")
    check("What is your name?" in output, 'The prompt asks "What is your name?"')
except RuntimeError as e:
    print(f"  ❌ Running with input 'Alice': {e}")
    failed += 1
    total += 1

# Test 2: It should greet and count letters for "Alice"
try:
    output = run_code("Alice\n")
    check("Hello there!" in output, 'Output starts with "Hello there!"')
    check("Your name has 5 letters" in output, 'Reports that "Alice" has 5 letters')
except RuntimeError as e:
    print(f"  ❌ Running with input 'Alice': {e}")
    failed += 1
    total += 1

# Test 3: It should count letters for "Bo"
try:
    output = run_code("Bo\n")
    check("Your name has 2 letters" in output, 'Reports that "Bo" has 2 letters')
except RuntimeError as e:
    print(f"  ❌ Running with input 'Bo': {e}")
    failed += 1
    total += 1

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
