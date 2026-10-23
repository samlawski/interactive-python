---
title: 8. Security & Deployment
icon: 🚀
---

[← Back to Overview](se19/)

**8.1 ELI5: The most common security risks**

> **🎯 Learning Outcome:** Write and explain some of the most common security risks and how to prevent them.

As soon as you provide a web server to the internet, you become a potential target of attacks. Especially if you offer a website that allows users to input any data into a database, you have to start thinking about security.

When users can put a personal message in a contact form or enter an email address and password, **you** start to handle sensitive data. And **you are responsible** for what happens with it. Much like when I write a letter and send it with the mail to someone, the post office is responsible for making sure that no one opens and reads my letter on the way. Users trust you with their data as soon as they interact with your website. So it's your responsibility to protect that data and your users.

Luckily, many people have thought about web security before us, and many topics aren't as big of a problem if you follow the established standards. Check out the video below to understand some of the most common security risks in web applications.

For the purposes of **Web Technologies Basics**, you don't need to get into the depth of web security. It's enough to know about some of the basic types of attacks to watch out for.

You have already applied a few security practices throughout the tutorial. For example, you have already implemented some essential security measures by using models and validating and sanitizing incoming data. Use this as an opportunity to go back to your code and those exercises and ensure you have proper data validation and models set up.

Then, review the resources below and think about how that might apply to your application.

---

**Resources:**

- 📺 [7 Security Risks and Hacking Stories for Web Developers](https://www.youtube.com/watch?v=4YOpILi9Oxs&ab_channel=Fireship)
- 📃 [MDN: Web Security](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Website_security?authuser=0)

---

**8.2 Deploy a full-stack web application**

> **🎯 Learning Outcome:** Deploy your web application (including a functioning database) to a web server.

Finally, it's time to upload your application to a server and make it publicly available online.

It's a good idea only to deploy an application when you have taken care of the most important security risks. That's why the deployment exercise comes only now.

**Deployment is consistently one of the most underestimated aspects of the development process**. Most beginning developers expect the coding to be central and deployment to be super simple and smooth. But in reality, deployment can be quite complex and time-consuming. That's not because it's a complex topic. But it's because things often don't work as you expect or want them to work. Deployment can mean hours of debugging and figuring out why the code on your computer doesn't run on the server.

And as frustrating as it might be, **this is a vital and relevant part of learning to be a developer**. This problem is common to backend development. As a developer, you usually write code on your own computer. But eventually, the application that you're writing needs to run on a different computer. If you build an iOS app, you must ensure it runs on various versions of iPhones. If you have to account for many different kinds of devices and hardware. Similar to Desktop applications, games, or web frontends. The step of making your code work without any issues on a system that isn't exactly the same as the system of the developer is always very complex. That's why so many applications or games have issues developers never expected.

When deploying web backends, you usually only need to optimize your application for a single different system. So there might be issues. But as soon as you've solved them, your application runs.

The other good news is that many server providers put a lot of effort into simplifying the deployment process as much as possible. Nonetheless, don't get discouraged when you run into problems. That's very common. When you do, remember what you've learned about debugging, and if nothing helps: Ask for help!

The first link below is a Notion page with an overview of various kinds of hosting. Technically you can deploy your application anywhere you like. There are a few ones that are easier to use than others, and there are free options available.

A relatively new, free option is [render.com](https://render.com/). But you also have the possibility to get free credit for Google App Engine: [☁️ Google Cloud Credits for CODE students](https://www.notion.so/Cloud-Credits-for-Projects-633622b1ff5f4116bd01778b247246d1?pvs=21). Which hosting provider you use is up to you. Either way, be prepared to read through the documentation of the specific hosting provider and look for tutorials and articles online if you get stuck.

---

**Resources:**

- [🌤 Web Frontend & Backend Deployment](https://www.notion.so/Web-Frontend-Backend-Deployment-6352df45c89c40539a41c01447e889cd?pvs=21)

**JavaScript Resources:**

- 📃 [Express Tutorial: Deployment](https://codecookies.xyz/express-tutorial/v1/deployment)

**Python Resources:**

- 📃 [Flask Tutorial: Server & Deployment](https://codecookies.xyz/flask-tutorial/v1/server-and-deployment/)

---

**8.3 Restrict access with authentication**

> **🎯 Learning Outcome:** Use authentication & authorization to protect certain parts of your application.

Another way to secure your backend is to use authentication. Authentication and authorization are already more complex, and you can pass Foundations without implementing them in your code. However, you do have to understand the concept and know how it would be implemented.

Read the two articles linked below to get a very solid understanding of the concepts of both authentication and authorization. And because practically applying a concept is always the best way to learn, you can use the tutorials below to learn how to implement an authentication system with your application.

---

**Resources:**

- 📃 [Authentication vs Authorization](https://medium.datadriveninvestor.com/authentication-vs-authorization-716fea914d55)
- 📃 [All you need to know about Authentication is here](https://medium.com/swlh/all-you-need-to-know-about-authentication-is-here-25c8d8135cd6)

**JavaScript Resources:**

- 📃 [FullStackOpen: User Administration](https://fullstackopen.com/en/part4/user_administration)
- 📃 [FullStackOpen: Token authentication](https://fullstackopen.com/en/part4/token_authentication)

**Python Resources:**

- 📃 [Flask Tutorial: Session-Based Authentication](https://codecookies.xyz/flask-tutorial/v1/session-authentication/)

---

---

[← Back to Overview](se19/)
