---
title: 9. Scalable & Quality Code
icon: 💎
---

[← Back to Overview](se19/)

**9.1 Refactor code to apply design patterns**

> **🎯 Learning Outcome:** Structure your code into separate files and folders in a way that makes sense and is easy to find.

Over time, The amount of code in your project grows quite a bit. This is true for any language - HTML, CSS, or Python. And no matter what kind of code you write, the more of it you write, the harder it'll be to maintain and keep track of things. That's why it's **extremely important to maintain clear formatting for your code**. What does this mean? That means to, for example, use line breaks, indentations, and comments in your code to **structure** your code visually. This isn't important. But it is. Many bugs have been caused because the code wasn't clean enough, and developers didn't notice which parts of the code belonged together. So using proper indentations and separating code with empty lines is way more helpful than just for visual appeal. The first link, below, is an article that explains more of those concepts in detail. Make sure to learn about those principles. Your future self and other developers will thank you for it!

Next, let's talk about code design patterns. In Express or Flask, you can put most of your code into a single file. This can be very practical, very extremely small applications. But most applications usually grow to a specific size very quickly that a single file is not an excellent way to organize your code. If you have to scroll through hundreds of lines of code whenever you want to make it, any changes will get annoying and tedious quickly. It will also make onboarding new developers on your team extremely difficult. It's very hard to reason about the code and explain where everything is.

That's why organizing code into multiple files and folders has become good practice. But how do you know which folders and files to use? This question doesn't have a simple answer. This is exactly the point of the role of a "software architect," or often also the role of a CTO. Those people's job is to think about code on a larger scale and develop an excellent way to keep it easily maintainable.

Fortunately, the software engineering profession has been around for a few decades, and many problems engineers face have already been solved. There are common patterns and ways to organize your code. It requires thinking about it more conceptually and asking yourself, "What is this code doing?"

A standard concept developers agreed to be helpful is the "**separation of concerns**." The idea is to write code so that a function or file is only responsible for one thing. For example, imagine a banking application. Let's say you have some code that grabs a bunch of transactions from the bank account database and then automatically organizes that into categories before it displays it on an HTML page. There are multiple functions already in that description. You'll have some code to get the records from the database. You have some code that organizes the list into categories. And finally, you have code that puts all those records into your HTML. Instead of doing all those steps in a single function, you'd organize that into multiple functions - probably even multiple files.

Based on those concepts, people also came up with **design patterns**. These common ways to organize your code files are based on these functionalities. For example, grabbing information from the database is a common task. So people created "model" classes representing data from a database as code.

Don't worry if this was all a little fast. Use the articles below to learn about these concepts. (And don't worry, they are all relatively short.) Once you have read those articles, apply the concepts in your Flask application. To do that, follow the Flask tutorial (last link below).

Ultimately, you should have a general idea of why things need to be organized, how they should be organized, and how to do it in Flask.

---

**Resources:**

- 📃 [The junior developer’s guide to writing super clean and readable code](https://www.freecodecamp.org/news/the-junior-developers-guide-to-writing-super-clean-and-readable-code-cd2568e08aae/?authuser=0)
- 📃 [Separation of Concerns](https://medium.com/machine-words/separation-of-concerns-1d735b703a60)
- 📃 [Model-View-Controller (MVC) Explained – With Legos](https://realpython.com/the-model-view-controller-mvc-paradigm-summarized-with-legos/)
- 📃 [MVC and its alternatives](https://herbertograca.com/2017/08/17/mvc-and-its-variants)

**JavaScript Resources:**

- 📃 [Express Tutorial: Express Folder Structure](https://codecookies.xyz/express-tutorial/v1/folder-structure)

**Python Resources:**

- 📃 [Flask Tutorial: Folder Structures & Blueprints](https://codecookies.xyz/flask-tutorial/v1/folder-structure-and-blueprints)

> 🚨 At this point, the Flask tutorials are in a different order than the learning resources. The tutorial covers folder structures and tests much earlier to teach you clean code principles from the beginning. If you've completed that tutorial already, that's great! Just read the other articles to understand more about what you did. If you didn't follow the tutorial yet, you likely ran into some problems by now. Ensure you catch up on the complete tutorial and refactor your code accordingly.

---

**9.2 Write Unit Tests**

> **🎯 Learning Outcome:** Add unit tests to your backend code to catch bugs early and validate that the code is doing what it should.

In the previous section, we looked at one aspect of making code maintainable long-term. Another aspect is the concept of automated tests.

A test is a piece of code that evaluates **another** piece of code to see if it does what it's supposed to do. For example, think of a Python function that does some math:

```python
def add_numbers(a, b):
    return a + b
```

A **unit test** to see if the code above really works could look like this:

```python
def test_add_numbers(a, b):
    result = add_numbers(4, 2)
    assert result == 6
```

The second function executes the first function and stores the result in a variable called "result.” The keyword "assert" is a specific keyword from the testing library **Pytest**. It executes a test to see if the code that comes right after (in this case, "result == 6") evaluates to "True.”

JavaScript tests function the same way. Just the syntax is different.

You may wonder what the point of this might be. The example above is quite simple. But the idea of automated software tests is to have an additional safety layer to ensure your code doesn't break later. Because in larger applications, you'll likely have many different and more complex functions. And sometimes, you'll change one part of the code and need to realize the effect your change may have had on other parts of your code. Having tests gives you confidence that as long as the tests **pass** (which means they don't fail), you know that all your application's core functionality still works. But the test will warn you if you make a change that accidentally breaks something you didn't think of.

This becomes increasingly important when you work in teams or on a project over a long time. You'll likely forget significant parts of your code eventually. Or if you work in a team, not everyone knows about all parts of the application code. So having tests makes the code more robust and allows other team members (or your future self) to make changes without worrying about breaking something someone else worked on in a different part of the application.

For all these reasons, testing has become a good and common practice. And it's a good idea to get into the habit of creating tests while you work on a feature. The tutorial you've been following introduces tests now relatively early. That's on purpose. Many other tutorials often include tests a lot later. But it's a good idea to learn about tests earlier to get into the habit of using them.

Go through the article below to learn about the different kinds of tests you could be writing. Then, go through the tutorial to learn how to write the most basic kinds of tests in your Flask application: the unit test.

---

**Resources:**

- 📃 [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html?authuser=0)

**JavaScript Resources:**

- 📃 [FullStackOpen: Testing the backend](https://fullstackopen.com/en/part4/testing_the_backend)

**Python Resources:**

- 📃 [Flask Tutorial: Unit Testing](https://codecookies.xyz/flask-tutorial/v1/unit-testing)

> 🚨 At this point, the Flask tutorials are in a different order than the learning resources. The unit tests tutorial comes much earlier because it's a good idea to get into understanding tests early. Make sure to catch up if you haven't at this point.

---

**9.3 Create a project readme file**

> **🎯 Learning Outcome:** Document your project using a basic readme file with the most critical information about the code.

Every software should have a piece of documentation. The most basic version of that is a README file. This is a text file that programmers usually create and put in the project folder (at the root level).

The purpose of the readme file is to provide anyone looking at the code with the most relevant background information they need. It's not as thorough as proper documentation. But usually, it fulfills some documentation purposes. And within the context of Foundations, creating a readme file is all you need for documentation.

Nowadays, readme files are usually written in a format called Markdown. It's a lot like (but much simpler than) HTML. If you're not familiar with Markdown, check out the video below. If you know Markdown well already, you can skip it.

This exercise's central part is to review the article on creating a good readme file. Afterward, add (or update) a readme file in your project to contain the most important key aspects listed in the article.

---

**Resources:**

- 📺 [What is Markdown?](https://www.youtube.com/watch?v=f49LJV1i-_w&ab_channel=Codecademy)
- 📃 [How to Write a Good README File for Your GitHub Project](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/?authuser=0)

---

---

[← Back to Overview](se19/)
