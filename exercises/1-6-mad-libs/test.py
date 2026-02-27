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

# Test 1: penguin / 42 / pizza
try:
    output = run_code("penguin\n42\npizza\n")
    check("penguin" in output, "Output contains the animal 'penguin'")
    check("42" in output, "Output contains the number '42'")
    check("pizza" in output, "Output contains the food 'pizza'")
    check("park" in output.lower(), "Output contains 'park'")
except RuntimeError as e:
    print(f"  ❌ Test 1: {e}")
    failed += 4
    total += 4

# Test 2: different input — dragon / 7 / spaghetti
try:
    output = run_code("dragon\n7\nspaghetti\n")
    check(
        "dragon" in output and "7" in output and "spaghetti" in output,
        "Works with different input (dragon / 7 / spaghetti)"
    )
except RuntimeError as e:
    print(f"  ❌ Test 2: {e}")
    failed += 1
    total += 1

# Test 3: check exact format
try:
    output = run_code("cat\n3\ntacos\n")
    expected = "Today I saw 3 cat(s) eating tacos at the park!"
    check(
        expected in output,
        f"Output matches expected format: '{expected}'"
    )
except RuntimeError as e:
    print(f"  ❌ Test 3: {e}")
    failed += 1
    total += 1

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
