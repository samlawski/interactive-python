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
    result = output.strip()

    check(
        result == "Guybrush Threepwood",
        f"Output is 'Guybrush Threepwood' (got: '{result}')"
    )

    check(
        not result.startswith(" ") and not result.startswith("\t"),
        "No whitespace at the beginning"
    )

    check(
        not result.endswith(" ") and not result.endswith("\t"),
        "No whitespace at the end"
    )

    check(
        result[0] == "G",
        "First name starts with a capital letter"
    )

    words = result.split()
    check(
        len(words) == 2 and words[1][0] == "T",
        "Last name starts with a capital letter"
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
