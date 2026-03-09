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

# Test height = 3
try:
    output = run_code("3\n")
    lines = [l for l in output.strip().splitlines() if l.strip().startswith("#") or l.strip() == ""]
    hash_lines = [l.strip() for l in output.strip().splitlines() if "#" in l]
    check(len(hash_lines) == 3, f"Height 3: prints 3 lines of '#' (got {len(hash_lines)})")
    if len(hash_lines) >= 3:
        check(hash_lines[0] == "#", f"Height 3, line 1: '#' (got: '{hash_lines[0]}')")
        check(hash_lines[1] == "##", f"Height 3, line 2: '##' (got: '{hash_lines[1]}')")
        check(hash_lines[2] == "###", f"Height 3, line 3: '###' (got: '{hash_lines[2]}')")
except RuntimeError as e:
    check(False, f"Height 3: {e}")

# Test height = 5
try:
    output = run_code("5\n")
    hash_lines = [l.strip() for l in output.strip().splitlines() if "#" in l]
    check(len(hash_lines) == 5, f"Height 5: prints 5 lines of '#' (got {len(hash_lines)})")
    if len(hash_lines) >= 5:
        check(hash_lines[3] == "####", f"Height 5, line 4: '####' (got: '{hash_lines[3]}')")
        check(hash_lines[4] == "#####", f"Height 5, line 5: '#####' (got: '{hash_lines[4]}')")
except RuntimeError as e:
    check(False, f"Height 5: {e}")

# Test height = 1
try:
    output = run_code("1\n")
    hash_lines = [l.strip() for l in output.strip().splitlines() if "#" in l]
    check(len(hash_lines) == 1, f"Height 1: prints 1 line of '#' (got {len(hash_lines)})")
    if len(hash_lines) >= 1:
        check(hash_lines[0] == "#", f"Height 1, line 1: '#' (got: '{hash_lines[0]}')")
except RuntimeError as e:
    check(False, f"Height 1: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
