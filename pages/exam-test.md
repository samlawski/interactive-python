---
title: SE_01 Exam
icon: 🐢
---

Welcome!

The goal of today's assessment is for you to demonstrate your ability to develop a basic and functioning piece of software. 

The outcome will be assessed by the **qualification objectives** as they are listed in the module description:
- Understand and use the basic features of programming languages
- Understand iterative development
- Debug and troubleshoot computer programs
- Apply basic version control _(💡Tip: Create git commits often!)_
- Use the command-line interface _(The outcome should be executable in the Terminal)_
- Use integrated development environments (IDE) _(e.g., VS Code)_

### Assessment Formalities

Below, you'll find an assignment and a list of tasks to complete it. Your goal is to complete each of the tasks and **push your progress** as git commits to a **git repository** (e.g., on GitHub or any platform you prefer). 

Once you're done, submit your git repository through the module's assessment form **on Fuxam**. (If it's a private repository don't forget to give read access to samuel.boguslawski@code.berlin.)

**⚠️ The repository must include:**
- Your working **code**
- A **README** file including a short description, relevant notes, and most importantly instructions on how to execute the program code (this may be, for example, a Python file, web page, or executable binary)
- A **git commit history** with more than a single commit documenting your work progress 

After submitting a task to a git platform, you may send a Slack message or raise your hand to check in with the assessor if you're on the right track or need any support moving forward.

You have a maximum of 240 minutes (4 hours) to complete the assessment. You may take short breaks (5-10 minutes) at any time. 

- **🛜 Important**: Before you get started to write code, turn off the WiFi!
- ✅ You may use any classic programming language to complete the task.
- ✅ Additional frameworks, libraries, or game engines are permitted. 
- 💡 But remember only code that is yours can be assessed!
- ✅ You **are permitted** to use offline documentation of your programming language of choice. (e.g., [Python's offlien documentation](https://docs.python.org/3/download.html), [HTML/CSS/JS offline documentation](https://devdocs.io/offline))
- ❌ You are **NOT allowed** to look up and copy solutions or partial solutions (e.g., on Stackoverflow)
- ❌ You are **NOT allowed** to use any generative AI tools (ChatGPT, Langdock, GitHub Copilot, ...)
- ❌ You are **NOT allowed** to ask people other than the assessor for help during the assessment
- ✅ However, you **may ask the assessor for help at any time!**

### 🏗️ Sample Assignment: Tic Tac Toe

Your goal is to build the classic game Tic-Tac-Toe! If you’re not familiar, you can review the rules here (link). For this assessment, the game is simplified to be played in the terminal, with the computer as your opponent.

Example (What the game could look like)

```
Welcome to Tic-Tac-Toe! Here is the board: 

a b c
1 _ _ _
2 _ _ _
3 _ _ _

Which cell do you choose? (Enter in the format 'a1')
> b2

Great! The computer chose a1.

a b c
1 o _ _
2 _ x _
3 _ _ _

Which cell do you choose? (Enter in the format 'a1')
> b1

a b c
1 o _ _
2 _ x _
3 _ _ _

Great! The computer chooses c1.

a b c
1 o x o
2 _ x _
3 _ _ _

Which cell do you choose? (Enter in the format 'a1')
> b3

You won!

a b c
1 o x o
2 _ x _
3 _ x _
```

The assignment is broken down into separate tasks. They are designed to help you complete only parts of the game step by step. It’s recommended you read through all the tasks first to get an idea of how the game is progressively built. Then, start on completing only one task at a time.

**Task 1) The first task is to create the game grid and let the player select a cell once. There is no computer opponent, yet, and there are no win conditions. Here is what you should implement first:**

- Display a welcome message to the user.
- Display an empty three-by-three grid with coordinates.
- Ask the player to enter a string with the coordinates.
- Validate that the user-entered string is a valid coordinate. If it isn’t ask the user to enter a valid coordinate.
- Create an updated version of the grid with the selected cell and display it to the user.

Hint: Instead of using coordinates like “a1”, or “b3", it might be simpler to only work with numbers like this:

```
Enter the coordinates as numbers like this: "21"

0 1 2
0 _ _ _
1 _ _ x
2 _ _ _
```

**Task 2) Next, let the user choose a cell more than once and evaluate for errors.**

- After the user has selected a cell, ask them to select another.
- Ensure that on every turn, the user input is validated again.
- If the user enters a coordinate that is already selected, display an error to the user and ask them to enter a different coordinate.
- Allow the player to exit the game any time - e.g., by entering the word ‘exit’.

**Task 3) Evaluate for win conditions. Check each win condition separately to make things a bit easier.**

- After every valid user input, check if three cells in a row are selected.
- After every valid user input, check if three cells in the same column are selected.
- After every valid user input, check if either of the two diagonals are entirely selected.
- If any of those three win conditions are true, end the game and display a victory message to the user.

**Task 4) As a bonus task, add a computer opponent to the game. (This is an extra task and if you’ve gotten this far you’re probably going to do fine. But for the fun of it or the extra practice I still recommend trying this last step as well)**

- After every valid user input, let the computer choose a coordinate at random.
- Ensure that coordinate isn’t already occupied.
- Return and display an updated grid to the user including the user’s and the computer’s choice.
- Check for victory conditions not only for the user but also for the user.
- If the computer meets the victory conditions display a losing message to the player.


**As you work, don't forget to create regular git commits. Don't worry if they include mistakes. That's perfectly fine. Also, don't forget to upload the git repository and all its commits after completing a task.** 

When you're finished, ensure you've tested everything and all your code is working, documented, and available online. 

Have fun! (And don't hesitate to ask if you're stuck for a while.)
