# Blog Capstone

Capstone project for [The Complete 2024 Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/) by Angela Yu.

A blog web application that lets users look at, create, edit, and delete blog posts.



https://github.com/user-attachments/assets/7284fe8e-f56f-4a79-986c-a2b73f059bc8


# Further work

This project is mostly to showcase and cement what I've learned so far with node, express, pg, and the classic html-css-js things.

There are however several things I've noted that I could further elaborate on.

**1. Password for users**

>This point comes with several subpoints. In addition to adding and checking for the username/password instead of showing the entire list of users, I would also need to look in to password encryptions, and sanitizing the queries to protect against basic injections.

**2. Hosting project**

**3. Hiding db credentials**

>As is now, I have all the db credentials in full display in the index.js. So, if I ever do host it (probably not), I would have to look in to how they typically hide this from the code.
>>Perhaps a token?

**4. Back buttons in post creation and user selection/creation.**

**5. Easier way to show all posts.**

**6. Table of contents for posts? Or at least a quicker way to navigate through them.**

**7. Side buttons take up too much space.**

>Should have a smaller rectangle that'll register as the 'hitbox' for the left/right selections.

**8. Small-view of post text cuts off at characters. I should also check for vertical space.**

>In the video, 'An update 5' extended past where I wanted it since I added several new lines.
