import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "blog",
    password: "123456",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

let posts = [];
let currentPost = 0;
let currentUser = ""
let currentUserId = 1;

const result = await db.query(
    `SELECT 
        users.id AS user_id,
        users.name AS user_name,
        posts.id AS post_id,
        posts.post_title,
        posts.post_text,
        TO_CHAR(posts.created_at, 'DD-MM-YYYY') AS formatted_date
    FROM 
        users
    JOIN 
        posts
    ON 
        users.id = posts.user_id;`
);

posts = result.rows.map(post => {
    return {
        ...post,
        slug: generateSlug(post.post_title)
    };
});
currentUser = posts[0].user_name;

async function getPosts() {
    const result = await db.query(
        `SELECT 
            users.id AS user_id,
            users.name AS user_name,
            posts.id AS post_id,
            posts.post_title,
            posts.post_text,
            TO_CHAR(posts.created_at, 'DD-MM-YYYY') AS formatted_date
        FROM 
            users
        JOIN 
            posts
        ON 
            users.id = posts.user_id;`
    );
    
    posts = result.rows.map(post => {
        return {
            ...post,
            slug: generateSlug(post.post_title)
        };
    });

    return posts;
};

async function searchPost(req) {
    const search = req.body.search.toLowerCase();

    const result = await db.query(
       `SELECT 
            users.id AS user_id,
            users.name AS user_name,
            posts.id AS post_id,
            posts.post_title,
            posts.post_text,
            TO_CHAR(posts.created_at, 'DD-MM-YYYY') AS formatted_date
        FROM 
            users
        JOIN 
            posts
        ON 
            users.id = posts.user_id
        WHERE
            LOWER(users.name) LIKE '%' || $1 || '%'
            OR
            LOWER(post_title) LIKE '%' || $2 || '%';`,
        [search, search]
    );

    if (result.rows.length > 0) {
        posts = result.rows.map(post => {
            return {
                ...post,
                slug: generateSlug(post.post_title)
            };
        });

        currentPost = 0;
    }

    return posts;
};

async function getUsers() {
    const result = await db.query(
        `SELECT * FROM users`
    );

    return result.rows;
};

async function updateUserId() {
    const result = await db.query(
        `SELECT id FROM users WHERE name = $1`,
        [currentUser]
    );

    currentUserId = result.rows[0].id;
};

function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

app.get("/", async (req, res) => {
    await getPosts();
    res.render("index.ejs", { user: currentUser, post: posts[currentPost] });
});

app.get("/home", async (req, res) => {
    res.render("index.ejs", { user: currentUser, post: posts[currentPost] });
})

app.post("/search", async (req, res) => {
    await searchPost(req);

    res.redirect("/home");
});

app.post("/next", async (req, res) => {
    const direction = req.body.value;

    if (direction === "right") {
        currentPost = (currentPost + 1) % posts.length;
    } else if (direction === "left") {
        currentPost = (currentPost - 1 + posts.length) % posts.length;
    } else {
        console.log('Unknown value:', req.body);
    }

    res.redirect("/home");
});

// Users
app.get("/user", async (req, res) => {
    const userList = await getUsers();

    res.render("user.ejs", { users: userList });
});

app.post("/user/create", async (req, res) => {
    var username = req.body.user_name;

    if (username != '') {
        try {
            await db.query(
                `INSERT INTO users (name) VALUES ($1)`,
                [username]
            );

            currentUser = username;
            await updateUserId();
        } catch(err) {
            console.log(err);
        }
    }

    res.redirect("/home");
});

app.post("/user/select", async (req, res) => {
    var username = req.body.user_name;

    if (username != null) {
        currentUser = username;
        await updateUserId();
    }

    res.redirect("/home");
});

// Posts
app.get("/create", async (req, res) => {
    res.render("new.ejs", { author: currentUser });
});

app.post("/create", async (req, res) => {
    const title = req.body.post_title;
    const text = req.body.post_text;

    try {
        await db.query(
            `INSERT INTO
                posts (post_title, post_text, user_id)
            VALUES ($1, $2, $3);`,
            [title, text, currentUserId]
        );
    } catch (err) {
        console.log(err);
    }

    currentPost = posts.length;

    res.redirect("/");
});

app.get("/:slug", (req, res) => {
    const post = posts.find(post => post.slug === req.params.slug);
    if (post) {
      res.render("post.ejs", { post });
    } else {
      res.status(404).send('Post not found');
    }
});

app.get("/:slug/edit", async (req, res) => {
    res.render("new.ejs", { author: posts[currentPost].user_name, post: posts[currentPost] });
});

app.post("/:slug/edit", async (req, res) => {
    const newTitle = req.body.post_title;
    const newText = req.body.post_text;
    const postId = posts[currentPost].post_id;

    try {
        await db.query(
            `UPDATE
                posts
            SET
                post_title = $1,
                post_text = $2
            WHERE
                id = $3;`,
            [newTitle, newText, postId]
        );
    } catch (err) {
        console.log(err);
    }

    currentPost = (currentPost + 1) % posts.length;

    res.redirect("/");
});

app.post("/:slug/delete", async (req, res) => {
    const deleteId = posts[currentPost].post_id;

    try {
        await db.query(
            "DELETE FROM posts WHERE id = $1;",
            [deleteId]
        );
    } catch (err) {
        console.log(err);
    }

    currentPost = (currentPost) % (posts.length - 1);

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});