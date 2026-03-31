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
    add_item = ns.get('add_item')
    remove_item = ns.get('remove_item')
    get_total = ns.get('get_total')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    add_item = None
    remove_item = None
    get_total = None

# Check functions exist
if add_item is None:
    check(False, "Function 'add_item' is defined")
else:
    check(callable(add_item), "Function 'add_item' is defined")

if remove_item is None:
    check(False, "Function 'remove_item' is defined")
else:
    check(callable(remove_item), "Function 'remove_item' is defined")

if get_total is None:
    check(False, "Function 'get_total' is defined")
else:
    check(callable(get_total), "Function 'get_total' is defined")

# Test the functions together
if add_item and remove_item and get_total:
    # Test 1: add items and get total
    try:
        cart = {}
        add_item(cart, "Apple", 1.50)
        add_item(cart, "Bread", 2.00)
        add_item(cart, "Milk", 1.20)
        result = get_total(cart)
        check(abs(result - 4.70) < 0.001, f"Total after adding 3 items: 4.70 (got: {result})")
    except Exception as e:
        check(False, f"Test 1 raised {type(e).__name__}: {e}")

    # Test 2: remove item
    try:
        cart = {}
        add_item(cart, "Apple", 1.50)
        add_item(cart, "Bread", 2.00)
        remove_item(cart, "Bread")
        result = get_total(cart)
        check(abs(result - 1.50) < 0.001, f"Total after removing Bread: 1.50 (got: {result})")
    except Exception as e:
        check(False, f"Test 2 raised {type(e).__name__}: {e}")

    # Test 3: empty cart
    try:
        cart = {}
        result = get_total(cart)
        check(result == 0, f"Empty cart total: 0 (got: {result})")
    except Exception as e:
        check(False, f"Test 3 raised {type(e).__name__}: {e}")

    # Test 4: update price
    try:
        cart = {}
        add_item(cart, "Apple", 1.50)
        add_item(cart, "Apple", 2.00)
        result = get_total(cart)
        check(abs(result - 2.00) < 0.001, f"Updated price: total 2.00 (got: {result})")
    except Exception as e:
        check(False, f"Test 4 raised {type(e).__name__}: {e}")

    # Test 5: remove non-existent item (should not crash)
    try:
        cart = {}
        add_item(cart, "Apple", 1.50)
        remove_item(cart, "Banana")
        result = get_total(cart)
        check(abs(result - 1.50) < 0.001, f"Remove non-existent item: no crash, total 1.50 (got: {result})")
    except Exception as e:
        check(False, f"Test 5 raised {type(e).__name__}: {e}")

    # Test 6: cart is modified in place
    try:
        cart = {}
        add_item(cart, "Banana", 0.75)
        check("Banana" in cart, f"add_item modifies cart in place")
        check(cart["Banana"] == 0.75, f"cart['Banana'] == 0.75 (got: {cart.get('Banana')})")
    except Exception as e:
        check(False, f"Test 6 raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
