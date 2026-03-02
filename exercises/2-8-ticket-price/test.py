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

# Test 1: age 4 → Free
try:
    output = run_code("4\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: Free",
        f"Age 4 → 'Ticket price: Free' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 2: age 0 → Free
try:
    output = run_code("0\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: Free",
        f"Age 0 → 'Ticket price: Free' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 3: age 6 → 5€ (boundary)
try:
    output = run_code("6\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: 5€",
        f"Age 6 → 'Ticket price: 5€' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 4: age 15 → 5€
try:
    output = run_code("15\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: 5€",
        f"Age 15 → 'Ticket price: 5€' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 5: age 17 → 5€ (boundary)
try:
    output = run_code("17\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: 5€",
        f"Age 17 → 'Ticket price: 5€' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 6: age 18 → 10€ (boundary)
try:
    output = run_code("18\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: 10€",
        f"Age 18 → 'Ticket price: 10€' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 7: age 30 → 10€
try:
    output = run_code("30\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: 10€",
        f"Age 30 → 'Ticket price: 10€' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 8: age 65 → 7€ (boundary)
try:
    output = run_code("65\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: 7€",
        f"Age 65 → 'Ticket price: 7€' (got: '{result}')"
    )
except RuntimeError as e:
    print(f"  ❌ {e}")
    failed += 1
    total += 1

# Test 9: age 80 → 7€
try:
    output = run_code("80\n")
    result = output.strip().splitlines()[-1].strip()
    check(
        result == "Ticket price: 7€",
        f"Age 80 → 'Ticket price: 7€' (got: '{result}')"
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
