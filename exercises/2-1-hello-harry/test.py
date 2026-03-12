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

def get_last_printed_line(output):
    """Extract the last meaningful printed line, ignoring input() prompts."""
    lines = output.strip().splitlines()
    if not lines:
        return ""
    # input() prompts don't end with a newline, so they may merge with
    # the next print output on the same line. Take the last line and
    # strip everything before the last prompt (if any) by relying on
    # the fact that print() output is what we care about.
    last = lines[-1].strip()
    return last

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
    result = get_last_printed_line(output)
    check(
        result.endswith("Harald Töpfer"),
        f"'Harald   ' + ' tÖpFer' → 'Harald Töpfer' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: "  alice" and "WONDER  " → "Alice Wonder"
try:
    output = run_code("  alice\nWONDER  \n")
    result = get_last_printed_line(output)
    check(
        result.endswith("Alice Wonder"),
        f"'  alice' + 'WONDER  ' → 'Alice Wonder' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: "bob" and "smith" → "Bob Smith"
try:
    output = run_code("bob\nsmith\n")
    result = get_last_printed_line(output)
    check(
        result.endswith("Bob Smith"),
        f"'bob' + 'smith' → 'Bob Smith' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: "  JANE  " and "  DOE  " → "Jane Doe"
try:
    output = run_code("  JANE  \n  DOE  \n")
    result = get_last_printed_line(output)
    check(
        result.endswith("Jane Doe"),
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
