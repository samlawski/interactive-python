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

# Load student code into a namespace
try:
    with open('/home/pyodide/solution.py') as f:
        code = f.read()
    ns = {}
    exec(compile(code, 'solution.py', 'exec'), ns)
    succ = ns.get('succ')
    pred = ns.get('pred')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    succ = None
    pred = None

# Check that functions exist
if succ is None:
    check(False, "Function 'succ' is defined")
else:
    check(callable(succ), "Function 'succ' is defined")

if pred is None:
    check(False, "Function 'pred' is defined")
else:
    check(callable(pred), "Function 'pred' is defined")

# Test succ
if succ:
    try:
        check(succ(1) == 2, f"succ(1) == 2 (got: {succ(1)})")
    except Exception as e:
        check(False, f"succ(1) raised {type(e).__name__}: {e}")

    try:
        check(succ(6) == 7, f"succ(6) == 7 (got: {succ(6)})")
    except Exception as e:
        check(False, f"succ(6) raised {type(e).__name__}: {e}")

    try:
        check(succ(33) == 34, f"succ(33) == 34 (got: {succ(33)})")
    except Exception as e:
        check(False, f"succ(33) raised {type(e).__name__}: {e}")

    try:
        check(succ(0) == 1, f"succ(0) == 1 (got: {succ(0)})")
    except Exception as e:
        check(False, f"succ(0) raised {type(e).__name__}: {e}")

    try:
        check(succ(-5) == -4, f"succ(-5) == -4 (got: {succ(-5)})")
    except Exception as e:
        check(False, f"succ(-5) raised {type(e).__name__}: {e}")

# Test pred
if pred:
    try:
        check(pred(2) == 1, f"pred(2) == 1 (got: {pred(2)})")
    except Exception as e:
        check(False, f"pred(2) raised {type(e).__name__}: {e}")

    try:
        check(pred(8) == 7, f"pred(8) == 7 (got: {pred(8)})")
    except Exception as e:
        check(False, f"pred(8) raised {type(e).__name__}: {e}")

    try:
        check(pred(33) == 32, f"pred(33) == 32 (got: {pred(33)})")
    except Exception as e:
        check(False, f"pred(33) raised {type(e).__name__}: {e}")

    try:
        check(pred(0) == -1, f"pred(0) == -1 (got: {pred(0)})")
    except Exception as e:
        check(False, f"pred(0) raised {type(e).__name__}: {e}")

    try:
        check(pred(-3) == -4, f"pred(-3) == -4 (got: {pred(-3)})")
    except Exception as e:
        check(False, f"pred(-3) raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
