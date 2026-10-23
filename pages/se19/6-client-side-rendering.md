---
title: 6. Client-Side Rendering
icon: 🖥️
---

[← Back to Overview](se19/)

**6.1 ELI5: Client-Side JavaScript code**

> **🎯 Learning Outcome:** Try adding some JavaScript to your website. After going through all those steps, try to answer the following questions below:
> 
> - Assuming you added some JavaScript code in your website's HTML and uploaded the whole code to the server. Now, when a client sends a request to the server for that HTML file, when exactly is the JavaScript code being executed?
> - You have some data in the database but want to dynamically do something with it (maybe some math) in your client-side JavaScript code. How could you give your client-side JavaScript code access to that data? *(There is no single right answer to this question. It requires a bit of thinking and exploring.)*

JavaScript is the last of the three programming languages that web browsers are built to interpret. HTML and CSS aren't programming languages. They don't contain any logical elements. Instead, their purpose is to format and style content. JavaScript, on the other hand, is a programming language like Python or many others. It's an **interpreted language**. That means to run JavaScript code, you need a different application that can compile JavaScript on the fly. Modern web browsers have a JavaScript interpreter built-in. That means JavaScript can be executed within a web browser.

If you've been following this course using JavaScript, you already used a different **JavaScript interpreter**: Node.js. Technically, under the hood, Node.js uses the same interpreter as the Chrome web browser: [called v8](https://v8.dev/). Node.js came much later than web browsers and was made specifically to run JavaScript on a computer without a web browser - because initially, JavaScript is a language built to run only within a client's web browser. If you're familiar with JavaScript already, this section will be faster for you. **But don't skip it.** Understanding the difference between JavaScript running on the client and the server can be extra confusing if you've been learning Node.js on the backend.

If you've been following the course using Python, the difference between the code running on the client and server side will be more obvious. They are different programming languages, after all. It can be intimidating to learn a new programming language already at this point. So if you've been using Python so far, don't worry about learning JavaScript in-depth.

The core to understand in this section is the difference between code rendered on the server instead of code rendered on the client.

If you only know Python so far, you'll find that JavaScript works very similarly. It just has a different **syntax**. That means you write the same thing a bit differently.

For example, in Python, you define a function like this:

```
def addition(a,b):
  return a + b
```

In JavaScript, that same function could look like this:

```
function addition(a,b){
	return a + b
}
```

That's what it means to have different syntax.

In this section, you'll learn **client-side** JavaScript and why you should learn it. After reviewing the first two videos, read through the four sections on [javascript.info](http://javascript.info/) from the "Introduction.” The sections should be:

- An Introduction to JavaScript
- Manuals and specifications
- Code editors
- Developer console

This will give you a good understanding of how JavaScript fits into your website.

If you've been following the Python course, take some time to also go through the Codecademy JavaScript course at this point.

---

**Resources:**

- 📺 [JavaScript in 100 Seconds](https://www.youtube.com/watch?v=DHjqpvDnNGE&ab_channel=Fireship)
- 📺 [The Weird History of JavaScript](https://www.youtube.com/watch?v=Sh6lK57Cuk4&ab_channel=Fireship)
- 📁 [JavaScript.info : An introduction](https://javascript.info/getting-started?authuser=0) **(4 articles)**

Optional content to go deeper:

- 📁 [Codecademy: Learn JavaScript](https://www.codecademy.com/learn/introduction-to-javascript?authuser=0)

---

**6.2 Alter HTML documents with JavaScript**

> **🎯 Learning Outcome:** Use Client-Side JavaScript to change parts of the HTML (DOM) as a reaction to the user doing something (like clicking, etc.) without sending a request to the server.

JavaScript's original purpose was to interact with the HTML & CSS of your website. At this point, you have heard about "**the DOM**" a few times. In this section, you'll get another introduction to what it is and how it works. Go through all sections of the first link starting with "1. Browser environment, specs" and all the way through "11. Coordinates".

Part of those sections is that you'll learn about **querySelector,** which is the basis for many DOM interactions. It's a way to select HTML elements from your JavaScript (like you did with CSS before).

The second link is just the **first page** of the "Introduction to Events.” Feel free to go through those other pages if you want to (or have extra time). But if you're struggling to keep up with the content, all you need to work through is that first-page "Introduction to browser events.”

---

**Resources:**

- 📁 [JavaScript.info: Document](https://javascript.info/document?authuser=0)
- 📃 [Introduction to browser events](https://javascript.info/introduction-browser-events?authuser=0)

---

---

[← Back to Overview](se19/)
