---
title: 4. Backend Development & Routing
icon: 🔌
---

[← Back to Overview](se19/)

**4.1 ELI5: Client-Server Relationship**

> **🎯 Learning Outcome:** Try to process and answer the following questions: What is the difference between a server and a client? What is a common situation why/when I would need to run code on a backend?

This section is at the core of what you must learn from this module. Try to answer the question from the learning outcome above.

Use the resources below to get a more thorough understanding of the **client-server relationship**. Go through the short video and then the three articles on MDN with the following titles:

- Introduction to the server-side
- Client-Server overview
- Server-side web frameworks

Another short article summarizes some of the core concepts, again simpler.

And finally, watch the short video on what an API is. You'll come across the term regularly. And while you may not need to build an API right now, in some cases and projects, it might be useful to know how.

---

**Resources:**

- 📺 [How The Backend Works](https://www.youtube.com/watch?v=4r6WdaY3SOA&ab_channel=WebDevSimplified)
- 📁 [MDN: Introduction to the server side](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Introduction?authuser=0)**(3 articles)**
- 📃 [Back-End Web Architecture](https://www.codecademy.com/article/back-end-architecture)(short summary)
- 📺 [What is an API](https://www.youtube.com/watch?v=s7wmiS2mSXY&ab_channel=MuleSoftVideos)

Optional content to go deeper:

- 📃 [Flask Tutorial: Building an API](https://codecookies.xyz/flask-tutorial/v1/flask-to-build-an-api/) (come back to this when you have gone through the other Flask tutorials)

---

**4.2 Create RESTful routes**

> **🎯 Learning Outcome:** Create a web backend that returns different responses depending on the URL used to send the request. Use dynamic routing to use URL parameters to determine which specific content to render on a page.

It's time to get your hands dirty and build your application backend.

You've seen how to set up a server from scratch in previous exercises. That's fine to demonstrate how servers work. But once you build actual websites, you'll start running into very common tasks that would be quite tedious to implement from scratch manually. Examples are **routing** (handling different URL paths), working with **parameters**, and **rendering** HTML content. Those are just some examples of very common tasks in web development. That's why you'll learn to use a framework like Express or Flask.

One of the core aspects of frameworks is **routing**. A "route" is another word for a path of the URL (or link). For example, `wikipedia.org/wiki/banana` is a different route to `wikipedia.org/wiki/apple`. One is `/wiki/banana`, and the other is `/wiki/apple`.

When building a backend, **you** must write code determining what happens when the user enters `/wiki/banana` in the browser and when they enter `/wiki/apple`. On the backend, that's just code.

The most naive and basic implementation of code would be something like this:

```
if url.endsWith('/wiki/banana'):
	return htmlForPage('banana')
else if url.endsWith('/wiki/apple'):
	return htmlForPage('apple')
```

This is not actual code. That's **pseudo code**. That means it's fake code demonstrating how a sample code logic could work.

When a person types `wikipedia.org/wiki/banana` in the web browser, a request is sent to a server with the address `wikipedia.org`. On that server, some backend code like the pseudo code above will take a look at the end of the URL and check where to **route** the request.

Using the resources below, you will learn how to use a framework to create **routes** for your backend.

While you have complete freedom in how to name and design the routes of your backend, there are a few standards web developers have agreed upon. Since the web is entirely open, but the software needs to communicate with each other, you'll find many of these kinds of standards in web development. The very nature of the web is to connect various pieces of software with each other. Therefore, agreeing on a common language is crucial. One of those common standards is called **REST**. Start by reading two short articles about it before diving into building routes for your website.

---

**Resources:**

- 📁 [What is REST - A Simple Explanation for Beginners](https://medium.com/extend/what-is-rest-a-simple-explanation-for-beginners-part-1-introduction-b4a072f8740f)**(2 articles)**

**JavaScript Resources:**

- 📁 [Express Tutorials: Setup & Overview, Routing, Middleware, Static files](https://codecookies.xyz/express-tutorial/v1) **(lessons 1-5)**

**Python Resources:**

- 📃 [Python: The Virtual Environment](https://codecookies.xyz/python/v1/virtual-environment/?authuser=0)
- 📃 [Flask Tutorial: Overview and Setup](https://codecookies.xyz/flask-tutorial/v1/setup-and-overview/?authuser=0)
- 📃 [Flask Tutorial: Routing](https://codecookies.xyz/flask-tutorial/v1/routing)

---

**4.3 Pass data from the frontend to the backend (forms and more)**

> **🎯 Learning Outcome:** Send data from a website frontend to the backend using parameters in the URL, query strings, and data from HTML forms.

One way to send information to the backend is through the **URL** or the **route** (aka path). As you've learned before, you can use the parameters of a URL to write some logic in the backend and return different responses for different routes.

There are more ways to send data to the backend, though. Sometimes, you want to let users search for a word or sentence and need to send the search term to the backend. Or sometimes, you have a contact form, and users can enter a whole message to be sent via email or stored in a database.

Go to [ecosia.org](https://www.ecosia.org/), type something in the search bar at the top, and hit `Enter` on your keyboard. Now, take a look at the URL in the web browser. Can you find the search term that you entered? You should see that the URL was extended by some extra characters, and somewhere in there, you'll find a bit that shows `&q=` followed by the search term. That's a so-called query string. It's a way to attach data to the URL of a website.

Another typical pattern is to use HTML forms and form data to allow users to send data to the backend. Read the article "Your first form" on MDN (linked below) to get a first introduction to forms. I also recommend reading the other articles related to forms to get a more solid understanding.

After going through MDN, learn how to send data from the client side to the backend. For that, go through a tutorial on the framework of your choice.

---

**Resources:**

- 📁 [MDN: Your first form + **(9 more articles on forms)**](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form?authuser=0)

**JavaScript Resources:**

- 📃 [Express Tutorial: Query Strings & Form Data](https://codecookies.xyz/express-tutorial/v1/query-strings-and-form-data)

Optional content to go deeper:

- 📃 [Express Tutorial: Validation & Sanitization](https://codecookies.xyz/express-tutorial/v1/validation-and-sanitization)

**Python Resources:**

> 🚨 At this point, the Flask tutorials are in a different order than the learning resources. But don't worry. To follow the Flask resources, I recommend following the order of the tutorial. That means skipping this section for now and returning to it after completing the database lesson.

- 📃 [Flask Tutorial: Pagination, HTML Forms, Request Data](https://codecookies.xyz/flask-tutorial/v1) **(lessons 10-12)**

---

---

[← Back to Overview](se19/)
