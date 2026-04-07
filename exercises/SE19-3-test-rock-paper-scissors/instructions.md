# Test 3: Rock Paper Scissors

In this exercise, you find the basis for a simple rock-paper-scissors game. 

**Your task** is to write a test **only** for the `compare_choices()` function. However, the task is going to be a bit harder than before because the existing application is not **clean**. That means, it's hard to test. But try for yourself and try to identify what the problem is you're running into. 

Start simple by testing something like: _"If the player's choice is 'rock' and the compuer's choice is 'paper' the message should show that the computer has won."_

Can you see the problem you run into when trying to test for that? 

How can you fix that by making changes to the **application code**? 

<details>
<summary>💡 Hint 1</summary>

The problem is that you don't know which random computer choice is going to be generated. 

That's because **concerns aren't seperated enough** in this code. 

The code already has a nice separation of `get_player_choice()`. Can you use that as an example and come up with a way to use the same approach to get the computer choice and separate it from the `compare_choices()` code? 

</details>

Once you've fixed the code and managed to make the application code itself testable it's time to finish writing the tests. 

In this case, you'll need to work with another important concept in testing: **"mocking"**.

**Mocking** means to setup fake data that normally comes from an external source. An external source could be user `input`, an API, or randomly generated data. In all these cases, you want to **mock fake data** because, for example, in the case of a user input, you don't want to have the user input anything when running **automated tests**. That sort of defeats the purpose. 

So **arrange** your fake data without relying on `input` or `random` functions. 

<details>
<summary>💡 Hint 2</summary>

- 1️⃣ Arrange: Instead of running `get_player_choice()` you can just assign a variable to a fake player choice without running the function at all. That's all you need for the test of `compare_choice()`. Similarly, you want to fake the random computer choice. 
- 2️⃣ Act: Execute the `compare_choice()` function with the fake data and store the result in a variable.
- 3️⃣ Assert: Given the fake data from the first step, what output do you expect? Compare that output with the actual output of the function and see if they match.

</details>
