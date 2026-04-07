### Application Code ###

def sayHello(name):
    return "Hello" + name + "!"

### Automated Test Code ###

# 1️⃣ Arrange
name = "World"
# 2️⃣ Act
result = sayHello(name)
# 3️⃣ Assert
expected_result = "Hello World!"

if result == expected_result:
  print("Test passed")
else:
  print(f"Test failed. Expected result: {expected_result}. Received result:", result)