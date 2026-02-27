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

expected = ["True", "False", "False", "False", "True", "True"]
labels = [
    "10 > 5 → True",
    "3 == 4 → False",
    "7 != 7 → False",
    '"hello" == "Hello" → False',
    "100 >= 100 → True",
    "2 + 3 == 5 → True",
]

try:
    output = run_code()
    lines = [l.strip() for l in output.strip().splitlines() if l.strip()]

    check(len(lines) >= 6, f"Output has at least 6 lines (found {len(lines)})")

    for i, (exp, label) in enumerate(zip(expected, labels)):
        if i < len(lines):
            check(lines[i] == exp, label)
        else:
            check(False, f"{label} (line missing)")
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
