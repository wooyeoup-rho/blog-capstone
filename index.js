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
    posts = result.rows;
    return posts;
}

app.get("/", async (req, res) => {
    await getPosts();

    res.render("index.ejs", {post: posts[currentPost]});
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

    res.redirect("/");
})

app.post("/user/create", async (req, res) => {
    console.log("Create");
    res.redirect("/");
});

app.post("/user/change", async (req, res) => {
    console.log("Change");
    res.redirect("/");
});

app.post("/user/delete", async (req, res) => {
    console.log("Delete");
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});