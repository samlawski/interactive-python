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
    encrypt = ns.get('encrypt')
    decrypt = ns.get('decrypt')
except Exception as e:
    print(f"  ❌ Could not load your code: {type(e).__name__}: {e}")
    failed += 1
    total += 1
    encrypt = None
    decrypt = None

# Check functions exist
if encrypt is None:
    check(False, "Function 'encrypt' is defined")
else:
    check(callable(encrypt), "Function 'encrypt' is defined")

if decrypt is None:
    check(False, "Function 'decrypt' is defined")
else:
    check(callable(decrypt), "Function 'decrypt' is defined")

# Test encrypt
if encrypt:
    encrypt_tests = [
        ("Hello", 3, "Khoor"),
        ("abc", 1, "bcd"),
        ("xyz", 3, "abc"),
        ("Hello World!", 5, "Mjqqt Btwqi!"),
        ("ABC", 26, "ABC"),
    ]

    for text, shift, expected in encrypt_tests:
        try:
            result = encrypt(text, shift)
            check(result == expected, f"encrypt('{text}', {shift}) == '{expected}' (got: '{result}')")
        except Exception as e:
            check(False, f"encrypt('{text}', {shift}) raised {type(e).__name__}: {e}")

# Test decrypt
if decrypt:
    decrypt_tests = [
        ("Khoor", 3, "Hello"),
        ("bcd", 1, "abc"),
        ("abc", 3, "xyz"),
        ("Mjqqt Btwqi!", 5, "Hello World!"),
    ]

    for text, shift, expected in decrypt_tests:
        try:
            result = decrypt(text, shift)
            check(result == expected, f"decrypt('{text}', {shift}) == '{expected}' (got: '{result}')")
        except Exception as e:
            check(False, f"decrypt('{text}', {shift}) raised {type(e).__name__}: {e}")

# Test roundtrip
if encrypt and decrypt:
    try:
        original = "The quick brown fox jumps over the lazy dog!"
        encrypted = encrypt(original, 13)
        decrypted = decrypt(encrypted, 13)
        check(decrypted == original, f"Encrypt then decrypt returns original text")
    except Exception as e:
        check(False, f"Roundtrip test raised {type(e).__name__}: {e}")

print(f"\n{'=' * 40}")
if failed == 0:
    print(f"🎉 All {total} tests passed!")
else:
    print(f"Result: {passed}/{total} tests passed, {failed} failed.")
    print("Keep trying! You can do it! 💪")
