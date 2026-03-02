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

# Test 1: "Harald   " and " tÖpFer" → "Harald Töpfer"
try:
    output = run_code("Harald   \n tÖpFer\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Harald Töpfer",
        f"'Harald   ' + ' tÖpFer' → 'Harald Töpfer' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: "  alice" and "WONDER  " → "Alice Wonder"
try:
    output = run_code("  alice\nWONDER  \n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Alice Wonder",
        f"'  alice' + 'WONDER  ' → 'Alice Wonder' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: "bob" and "smith" → "Bob Smith"
try:
    output = run_code("bob\nsmith\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Bob Smith",
        f"'bob' + 'smith' → 'Bob Smith' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: "  JANE  " and "  DOE  " → "Jane Doe"
try:
    output = run_code("  JANE  \n  DOE  \n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Jane Doe",
        f"'  JANE  ' + '  DOE  ' → 'Jane Doe' (got: '{result}')"
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
