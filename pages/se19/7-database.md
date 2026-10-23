---
title: 7. Databases & CRUD
icon: 💾
---

[← Back to Overview](se19/)

**7.1 Define a database schema**

> **🎯 Learning Outcome:** Consider the following scenario and then write a description of how you'd set up the database tables to realize this structure: (You may have to think about it for a bit. Feel free to draw sketches on paper to help you visualize the structure.)
> 
> - As a bank customer, I'd like to have an app that allows me to log in and view a list of all my bank accounts.
> - I'd like to see a list of (incoming and outgoing) transactions for each account, their amount, date, and purpose.
> - Bonus: I'd like some of my bank accounts shared with my partner. My partner should have their own separate customer login into the app.

So far, you've mostly been writing **stateless** application code. Code usually works in the way that when you execute the code file (e.g., a **.py**-file), the code gets executed top to bottom, and then the application stops. The next time you rerun the code, it should do the same. The code usually doesn't *remember* anything from the previous time it has been executed. For example, variables are all reset, and every time you rerun the code file, it is as if the variables have never been set before. That's how code usually works when you execute it in a **.py**-file.

A web backend technically works the same way. The main difference is that it uses infinite loops to keep running and not stop. But think of the routes of your backend application, for example. Whenever a client (e.g., a web browser) sends a request to your backend, the route code is executed and then stops. Every time a new request comes in, that route code's result is the same. For example, it does not *remember* how many different clients have accessed the route.

In most web applications, however, you want to not only execute some code but also want to store some **data**. So often, you want your backend to be **stateful**. That means you want your backend to *remember* some data for longer than just a single execution of code. Think of a social network. Users want to put some status messages and images on the server so that others can look at them, too. So it's not enough to let users upload some data. You also need to store it on the server to allow other users to see the first user has uploaded data.

There are lots of places you could store data on the server. Whenever you put some information in a variable, you store it in the computer's working memory the script is running on. That's a temporary memory but not a reliable data store. For example, as soon as the computer restarts, that data is gone.

Alternatively, you could store data in files. There are valid use cases for storing data in files. And in desktop applications, this has been a very common approach. Just consider music files, image files, Word documents, or even save game files. These are all examples of where applications store **state** in a file. This file is shareable; anyone with the file can open or edit it.

Since this lesson is about databases, you probably have already guessed that databases are another way to store data. There are different kinds of databases. Various databases store data in different ways.

Usually, however, a database is a particular piece running in addition to your regular application code, and it's optimized to store and retrieve large amounts of data quickly. Changing and reading files is usually quite slow (from a computer processing perspective). That's why databases are more commonly used in web applications to store and interact with data.

Depending on your programming language, different database types have become the most popular within their community. **Relational databases** and specifically MySQL, are most widely used among PHP developers. **Postgres** (another relational database) is popular among Python and Ruby developers. **MongoDB** (a **NoSQL document-based database**) is very popular among JavaScript developers. There are many other databases, and using any database in any programming language is expected. Every database has its strengths and weaknesses. As a beginner, starting with the most popular one for learning is a good idea, and then switching to a different one later - if necessary.

If you're using Python, I suggest learning about **relational databases** and starting with **SQLite** (a very simple file-based relational database). Later you'll have to move on to **Postgres** because SQLite doesn't work with many hosting providers.

If you're using JavaScript, I suggest learning MongoDB. It's a **document-based database**. There was some [controversy](https://techcrunch.com/2019/01/09/aws-gives-open-source-the-middle-finger/) around how Mongo's licensing practices. Nonetheless, it remains a famous database, and its style inspired many others. So learning Mongo will set you up nicely for moving to alternatives if needed.

---

**JavaScript Resources:**

- 📺 [MongoDB in 100 seconds](https://www.youtube.com/watch?v=-bt_y4Loofg&ab_channel=Fireship)
- 📁 [MongoDB Documentation](https://www.mongodb.com/document-databases)
- 📺 [Complete MongoDB Tutorial (short Video Series)](https://www.youtube.com/playlist?list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA)

**Python Resources:**

- 📁 [FreeCodeCamp: All lessons with "relational database" in the title **(7 lessons)**](https://www.freecodecamp.org/learn/python-for-everybody/)

---

**7.2 Interact with a database from within your code**

> **🎯 Learning Outcome:** Use an ODM/ORM and create schemas to represent data from the database within your application code.

In the previous exercise, you learned about relational databases in general. But an obvious question is: **How do you interact with data in the database from my application code?**

There are two parts two this question:

The first question is how you interact with the database. As you have learned before, a database is a separate application that exists separate from your application code. Relational databases even have their own language (**SQL**) to read or write data in the database. NoSQL databases often have similar query languages. But don't worry. While knowing SQL is an excellent skill, you don't need to learn it immediately to proceed. Because most programming languages have libraries called **ORM**s (Object Relationship Models), or for NoSQL, it's called **ODM** (Object Document Model). Those libraries usually provide functions or classes that allow you to represent and work with data from the database by simply writing JavaScript/Python code. You'll learn more about how to do that specifically later. The first step in this exercise is to set up the ODM/ORM in the first place and use a concept called "**models"** to represent data from the database as code.

The second part of the question above relates to the database tables themselves. All relational databases and some NoSQL databases have something called a **schema**. A schema is a representation of all the tables and their columns that exist in the database. Before adding any data to a relational database, you must define the tables and their columns. So, for example, if you have a todo-list application, you first need to create a table for tasks with the columns ID, task name, due date, user_id, and is_completed (true/false). Additionally, you may have a table for users with the columns ID, name, email, and password (encrypted).

Those (empty) tables must be created before you can create task records (rows) in the database using the ORM.
Technically, you don't need to create those data structures in NoSQL databases. A big feature of NoSQL databases is that you can insert data in any way you like. It doesn't have to be consistent. But because consistency is helpful in most cases, ODM libraries for MongoDB do, in fact, let you set up **schemas,** and you should use them unless you have a good reason not to.

However, nobody expects you (as the developer) to know what the final data structure should look like at the beginning of the development process. Commonly, you have to add or change columns or tables later on. In NoSQL, that's very easy. You change the schema and only have to worry about data integrity and backward compatibility. For example, if your code relies on users to have a profile picture, but you decided to remove it in a later version of your code, you need to either update all old records or make sure your application code doesn't rely on something that isn't there on newer records.
Relational databases are more restrictive. To make changes to the data structure, you first need to change the columns in the tables. And for that reason, a common practice has been established called **migrations**. Migration files are scripts that keep track of all the changes made to the database schema over time. They define which tables or columns must be added, removed, or changed.

With the two lessons linked below, your goal is to connect a simple database with your application code and in the case of Python, generate your first tables using migrations.

---

**JavaScript Resources:**

- 📃 [Express Tutorial: MongoDB Database and ODM Setup](https://codecookies.xyz/express-tutorial/v1/mongodb-database-and-odm-setup)
- 📃 [Express Tutorial: Schema & Models with MongoDB](https://codecookies.xyz/express-tutorial/v1/schema-and-models-with-mongodb)

**Python Resources:**

- 📃 [Flask Tutorial: SQL Database Setup](https://codecookies.xyz/flask-tutorial/v1/sql-database-setup/?authuser=0)
- 📃 [Flask Tutorial: Model Relationships in SQL Databases](https://codecookies.xyz/flask-tutorial/v1/model-relationships-sql/?authuser=0)

---

**7.3 Create, Read, Update, and Delete data**

> **🎯 Learning Outcome:** This exercise aims to populate your database with some sample data and know how to interact with the data in the database. You'll learn to apply those CRUD skills more in the upcoming exercises!

Most web applications are based on **CRUD (Create, Read, Update, Delete)**. Most applications aim to provide a pretty and helpful interface for users to interact with data in a database easily. So those are also the most common methods you'll use when working with a database and an ORM.

Use the lesson below to learn how to implement your application's CRUD methods (from the ORM). While this is just a single exercise, this is quite the core concept. I strongly encourage you to practice this. The nice thing is that you can practice this by imagining a data structure and then trying to implement it with what you have learned so far.

---

**JavaScript Resources:**

- 📁 [Express Tutorials: 3 lessons labeled "CRUD"](https://codecookies.xyz/express-tutorial/v1) **(lessons 12-14)**

**Python Resources:**

- 📃 [Flask Tutorial: CRUD](https://codecookies.xyz/flask-tutorial/v1/crud)

> 🚨 At this point, the Flask tutorials are in a different order than the learning resources. If you have skipped the sections on pagination, HTML forms, request data, and validation above, now is a good time to do them - before moving on to the next lesson. The lesson on Building an API can be very useful but is not entirely necessary before moving on to the next lesson.

---

---

[← Back to Overview](se19/)
