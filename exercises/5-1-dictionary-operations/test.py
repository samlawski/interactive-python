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

# Load student code
try:
    with open('/home/pyodide/solution.py') as f:
        code = f.read()
    ns = {'input': lambda *args: '1', 'print': lambda *args, **kwargs: None}
    exec(compile(code, 'solution.py', 'exec'), ns)
    my_dict = ns.get('my_dict')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    my_dict = None

expected = {
    "name": "Frank",
    "workplace": {
        "name": "CODE",
        "address": {
            "Street": "Lohmühlenstraße",
            "nr": "65",
            "zip": "12435",
            "city": "Berlin"
        },
    },
    "hobbies": ["gaming", "programming", "reading", "teaching"]
}

if my_dict is None:
    check(False, "Variable 'my_dict' exists")
else:
    check(isinstance(my_dict, dict), "my_dict is a dictionary")
    check(my_dict.get("name") == "Frank", f"Name is 'Frank' (got: '{my_dict.get('name')}')")
    check(my_dict.get("workplace", {}).get("address", {}).get("zip") == "12435",
          f"Zip code is '12435' (got: '{my_dict.get('workplace', {}).get('address', {}).get('zip')}')")
    hobbies = my_dict.get("hobbies", [])
    check("teaching" in hobbies, f"'teaching' is in hobbies (got: {hobbies})")
    check(hobbies == ["gaming", "programming", "reading", "teaching"],
          f"Hobbies list is correct (got: {hobbies})")
    check(my_dict == expected, f"Complete dictionary matches expected result")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
