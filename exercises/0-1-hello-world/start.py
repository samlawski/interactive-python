print("Hello there!")
print("I can count the letters in your name.")

name = input("What is you name?\n")

for count, letter in enumerate(name):
  print(f"{letter}.")

  if count == 0:
    print(f"So that's {count + 1} letter so far.")
  else:
    print(f"So that's {count + 1} letters so far.")

print(f"Your name has {len(name)} letters in it.")


