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

# Test 1: Hello, I, am, Frank, end → 5
try:
    output = run_code("Hello\nI\nam\nFrank\nend\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("5" in last_line, f"Input Hello,I,am,Frank,end → prints 5 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 1: {e}")

# Test 2: just "end" → 1
try:
    output = run_code("end\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("1" in last_line, f"Input 'end' only → prints 1 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 2: {e}")

# Test 3: case insensitive — "END"
try:
    output = run_code("hello\nworld\nEND\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("3" in last_line, f"Input hello,world,END → prints 3 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 3: {e}")

# Test 4: mixed case "End"
try:
    output = run_code("one\ntwo\nEnd\n")
    last_line = output.strip().splitlines()[-1].strip()
    check("3" in last_line, f"Input one,two,End → prints 3 (got: '{last_line}')")
except RuntimeError as e:
    check(False, f"Test 4: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
