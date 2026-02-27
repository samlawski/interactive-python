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

expected_lines = [
    "We don't need no education",
    "We don't need no thought control",
    "No dark sarcasm in the classroom",
    "Teacher, leave them kids alone",
]

try:
    output = run_code()
    lines = output.strip().splitlines()

    check(len(lines) >= 4, f"Output has at least 4 lines (found {len(lines)})")

    for i, expected in enumerate(expected_lines):
        if i < len(lines):
            check(
                lines[i].strip() == expected,
                f"Line {i + 1}: '{expected}'"
            )
        else:
            check(False, f"Line {i + 1}: '{expected}' (missing)")
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
