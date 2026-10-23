---
title: 5. Server-Side Rendering
icon: 🗄️
---

[← Back to Overview](se19/)

**5.1 Render HTML templates on the server**

> **🎯 Learning Outcome:** Use a templating language and dynamic data from lists (arrays) or objects (dictionaries) to generate (aka render) HTML views.


After you've learned how to send **requests,** it's time to learn about **responses**. Usually, whenever a client sends a request to the backend, the backend runs some code and then dynamically generates a response. Think of a search engine like [ecosia.org](https://www.ecosia.org/), for example. The page that renders the search results shows different text depending on which search term a user has entered into the search field.

To achieve that, the backend most likely uses some s**erver rendering**. More specifically, it likely uses a **templating language**. Templating languages are languages that you can **insert into HTML**. They are usually tied to a library or code that converts the template to regular, static HTML before it's returned to the client.

If that sounds confusing, put some search terms into [ecosia.org](https://www.ecosia.org/). Then, compare the two pages you saw and think about what has to be different on the backend of each page.

Then, go through the tutorials below. They help you internalize how templating languages work and what they are helpful for.

---

**JavaScript Resources:**

- 📁 [Express Tutorials: HTML Response, Control flow](https://codecookies.xyz/express-tutorial/v1) **(lessons 7-9)**

**Python Resources:**

- 📁 [Flask Tutorials: Templating, Static Files](https://codecookies.xyz/flask-tutorial/v1) **(lessons 3-4)**

> 🚨 At this point, the Flask tutorials are in a different order than the learning resources. But don't worry. To make it easier to follow along, do the Blueprints and Unit Testing lessons now. It's technically content from the section on Scalable & Quality Code. But it's more important to follow the tutorial order here.

---

**5.X Help! My code is broken!**

HTML and CSS are languages that render visual content. They aren't programming languages that are interpreted and executed to run any programming logic. As a result, if you make a mistake in HTML and CSS, you don't see an error message anywhere. Instead, you must ensure that what you see on the screen isn't broken.

To make things even more confusing, sometimes web browsers (like Chrome) are graceful about mistakes and automatically try to understand what you could have meant and try to render something meaningful. Other web browsers (like Firefox) do this less often and let your layout more frequently "just break."

As you start working with proper **programming languages** like Python, things work differently. Python code needs to be **interpreted** before it can be executed. So there is another piece of software (named "Python") running that will compile your Python code into something the computer can understand on the fly (also known as "**just in time"**).

Those compilers usually include some extra code for **error logging**. That means, as opposed to HTML and CSS (where you don't get errors), if you have an error in your code, the compiler will print out an error message for you. Different programming languages have different qualities of error messages. Different programming languages are also more or less strict about various errors. Sometimes they let the entire application crash. Sometimes they try to run as much of the code as possible while displaying an error message.

JavaScript tends to be looser about errors. While (compared to that) Python is often a lot stricter about errors.

All that being said: **Errors are a good thing!** It might not feel like that at the moment. But error messages are programmed by developers of the programming languages to help you identify where there is an issue in your code. They can, however, look quite intimidating because they often come in the format of a giant wall of text. The key is to try and identify the most meaningful part and then use that to search for a solution. The article below might give you some tips on how to debug errors.

---

**Resources:**

- 📃 [How to Google your errors](https://dev.to/swyx/how-to-google-your-errors-2l6o)

---

---

[← Back to Overview](se19/)
