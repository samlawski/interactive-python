---
title: 0. Before you get started
icon: 👋
---

[← Back to Overview](se19/)

**Welcome** to the learning resources for **Web Technologies Basics**!

On this page, you'll find a comprehensive overview of everything you need about web development.

> **💡 Important:** This is a lot of content! The goal is not (yet) for you to become an expert in everything. Instead, we will cover a lot of ground in very little time. Expect to go through some of the concepts briefly and only understand some. While it may feel frustrating at times, it's ok! Focus on gaining a general understanding of how everything works together. Once you've gone through all the content, you can take your time to go deeper on some of those subjects, such as backend, frontend, or databases.

**📚 How to use the learning resources**

These learning resources are meant to help you **frame your learning**, know what to learn, and how you may learn in a project-based approach.

This is not a complete list of everything you could learn about the subject. See these learning resources **as a starting point** to learn more about a subject. At the core of your learning should **always be a project**!

Each section below has specific instructions for using a project to learn the material. **Take those instructions seriously!** It is very tempting to "follow a tutorial" or ask an LLM like ChatGPT to complete the task. **But you'll only learn by practicing and applying concepts in projects.**

If you are pressed for time, **your priority should always be on being able to complete a given learning outcome rather than on completing a tutorial or learning resource.** Keep that in mind!

Also, remember there are many different resources for the same content. There are so many that it can get overwhelming. This page makes a suggestion for which resources to use. You can always use more and different ones, though!

> 💡 **How to use LLMs (like ChatGPT or GitHub Copilot)?** LLMs (Large Langauge Models) are incredibly powerful tools for software development and the learning process. You can use them to explain complex topics in simpler terms or help when you're stuck solving an issue in your code. Be careful, though. They only respond based on information they're trained with. That information can be highly biased or simply wrong. When it comes to your project, practice makes perfect. That's true for most professions and also programming. You learn by practicing concepts you have learned and applying them repeatedly.

**🎯 Qualification Objectives: What you will learn**

- Determine when and how to utilize web technologies as a software solution
- Create simple websites with responsive layouts **(i.e., accessible HTML and CSS)**
- Differentiate between the role of the web client and web server
- Create dynamic web backend applications **(e.g., including dynamic routing)**
- Apply both client-side and server-side rendering for dynamically changing content **(i.e., server-side templating languages and client-side JavaScript)**
- Handle long-lived state and dynamically changing data on the backend **(i.e., databases, ORMs/ODMs)**
- Deploy and securely run dynamic web backends in a web server environment

Beyond that, you'll get an introductory overview of clean code, testing, and documentation.

**📌 Prerequisites: What you already know**

This is a beginner module. Therefore, it’s suitable to be taken in the first core semester.

Nonetheless, you should have a **good understanding of general programming concepts**. If you’re still new to programming, you should at least learn the basics of programming in parallel to going through these learning resources.

Some important programming concepts are **variables, simple and complex data types, functions, conditions, loops, classes, objects, and methods**.

Additionally, you should feel comfortable using the **command line** and **git** as the version control system.

You can use the learning resources on the following page to learn about the above concepts:

- [🐢 SE_01 Software Development Basics (Learning Resources)](https://www.notion.so/codeuniversitywiki/SE_01-Software-Development-Basics-Learning-Resources-fe13019db14942279136e09a400c54e8)

---

## 🛠 Learning Project

At the core of your learning process should be a project. At CODE, working on projects is the best way to learn.

**🤨 Picking a suitable project**

As a beginner, it's unclear which kinds of projects are more or less suitable for learning. At the same time, it's best to build something you're curious or excited about.

Go through the list of suggested projects on this page: [🚀 project ideas](https://www.notion.so/Project-Ideas-Web-Basics-6e6af7a2f46e490c8b9aa783fd17b2a4?pvs=21)

You can either pick one of those projects or develop an idea that roughly matches similar features.

Please be aware: You'll only have time to build a small version of your thoughts. That's ok. You can always return to the project later to improve it.

**🎨 Project Design & Scope**

You cannot build software if you don't know what to build. Once you have a rough idea, you need to come up with the specifics of what your project will look like in the end. This will help you to know where to start and how to structure your work. 

Even if you don't consider yourself a designer, you can use some basic design concepts to help you get started with your project. 

1. Create **user flows** of the core interaction of your application. (e.g., a user logs in, sees a dashboard of all the open todo-list items, and then creates a new item) 
2. Create **wireframes** (simple, not-pretty sketches) of the different pages/screens the user will see going through those flows. (e.g., login page, dashboard page, page to create a new task)

Following those two main steps will help you visualize what you want to build. Check out this video for a short introduction to how to do those two things.

[📺 Quick introduction to designing UIs](https://youtu.be/wIuVvCuiJhU?si=nZ_6Yn4zphqhtgN-)

Once you know what things look like, you can split your work into chunks and work on only part of it one page at a time. For example, you can start by building a layout for a dashboard using fake data and no real backend yet. Then, once you learn about backend development, you can connect it to a backend. Once you learn about databases, you can use real data to be displayed on the page. 

**🕰 Project timeline suggestion**

The project phase at CODE has 11 weeks until the hand-in deadline. The learning resources below are structured to fit that time frame. Be prepared to review some resources and features faster than you had hoped. Your goal should be to apply the basics.

Each section has a specific task and outcome to help you know what to work on. If you go through one section per week, you have enough time, in the end, to go back, catch up on things you didn't understand enough, and polish your project before the hand-in.

Roughly, you can plan your project in the following five packages. For each package, you’ll find a few example tasks of what to work on within that package:

1. **Build a static site with HTML and responsive CSS** (weeks 1 + 2)
    - A landing page (examples for inspiration: [blinkist](https://www.blinkist.com/), [basecamp](https://basecamp.com/))
    - Other static pages like an “about” page or a “legal” page.
2. **Create a web backend with dynamic routing** (weeks 2 + 3)
    - The barebone structure of a backend application with a framework
    - Definition of the various routes (URLs) needed for the application (and all its endpoints)
    - Initial static (HTML- & CSS-only) pages with static fake data (as there is no integration with a database or backend yet)
    - Forms to input data that is not yet stored in the backend (e.g., contact form)
3. **Store data in a database and render its content on pages dynamically** (weeks 4, 5, 6)
    - Schema and models for the various data sets of your application
    - Pages for all the different routes previously defined
    - Integration between forms and database
    - Dynamic rendering of content from the database on various pages
4. **Deploy the website** (week 7)
    - Upload the website to a web server
    - Use a production-ready database that works on a web server
    - Security Validation
    - Authentication system
5. **Polish for clean code and best practices** (week 8)
    - Unit tests to make the code more robust
    - Refactoring of the code base to make the code more maintainable

> 💡 In previous semesters, the hardest part of the course starts with databases, dynamic rendering, and deployment. Don't underestimate those parts! Expect to spend a significant time in the middle of the semester practicing and reading up on such topics.

---

## 🎁 Other Useful Resources

Beyond the general learning resources, the following links might be useful in daily work.

- [GitHub Student Starter Pack](https://education.github.com/pack): A collection of discounts and promotions specifically for students.
- [MDN](https://developer.mozilla.org/en-US/): The number one resource for web development. It includes a reference on everything you need to know about HTML, CSS, and JavaScript, interesting articles, and entire courses and tutorials.
- [DevDocs.io](https://devdocs.io/): A reference database for many web languages with a quick search feature to find any function or feature name you might be looking for
- [w3schools](https://www.w3schools.com/): Another great source of references and tutorials on all things web.
- [caniuse.com](https://caniuse.com/): A simple platform to check browser support on modern HTML, CSS, and JavaScript features.
- [Python Cheatsheet (by Codecademy)](https://www.codecademy.com/learn/learn-python-3/modules/learn-python3-hello-world/cheatsheet): A cheat sheet to give you an overview of all the most important Python language features at a glance.
- https://www.pythoncheatsheet.org/: Another more comprehensive Python cheat sheet
- [Semantic HTML cheatsheet](https://learn-the-web.algonquindesign.ca/topics/html-semantics-cheat-sheet/): A quick overview of all the different semantic HTML tags and when/how to use them.
- https://squoosh.app/: A great tool to quickly and visually compress and resize images.

**Alternative (complete) Courses**

- [free] https://exercism.org/: A platform to learn a variety of different programming languages for free
- [free] https://learn.shayhowe.com/: A beginner-friendly course on both HTML and CSS
- [free] https://www.c0d3.com/curriculum provides a combination of reading material and challenging exercises. It starts all the way at the beginning. So it’s suitable for anyone completely new to JavaScript. But they advance very quickly. So also intermediate students will be able to learn something.

---

---

[← Back to Overview](se19/)
