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

try:
    output = run_code()
    lines = output.strip().splitlines()

    # Expect: "a is now: 3" and "b is now: 7"
    check(len(lines) >= 2, f"Output has at least 2 lines (found {len(lines)})")

    a_line = lines[0] if len(lines) > 0 else ""
    b_line = lines[1] if len(lines) > 1 else ""

    check(
        "3" in a_line and "a" in a_line.lower(),
        f"First line shows a = 3 (got: '{a_line}')"
    )

    check(
        "7" in b_line and "b" in b_line.lower(),
        f"Second line shows b = 7 (got: '{b_line}')"
    )

    # Make sure they didn't just hardcode the values
    with open('/home/pyodide/solution.py') as f:
        code = f.read()
    check(
        "a = 3" not in code.replace(" ", "") or "temp" in code or "a,b=b,a" in code.replace(" ", "") or "a, b = b, a" in code,
        "Values are swapped using a variable trick, not hardcoded"
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
