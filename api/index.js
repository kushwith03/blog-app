import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import methodOverride from "method-override";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

let blogs = [
  {
    id: uuidv4(),
    title: "First blog",
    content:
      "This is the first blog in my blog app. I am so excited to finally see it working! It’s a small step towards building something bigger, and I plan to keep adding new features and making the design even better as I learn more.",
    author: "kushwith",
    date: new Date().toLocaleString(),
  },
  {
    id: uuidv4(),
    title: "Exploring Node.js and Express",
    content:
      "Node.js with Express makes backend development so much faster. Developers can quickly set up routes, handle requests, and serve content.",
    author: "Dev Explorer",
    date: new Date().toLocaleString(),
  },
];

app.get("/blogs", (req, res) => {
  res.render("index", { blogs });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  const { title, content, author } = req.body;
  const id = uuidv4();
  const date = new Date().toLocaleString();
  blogs.push({ id, title, content, author, date });
  res.redirect("/blogs");
});

app.get("/blogs/:id", (req, res) => {
  const { id } = req.params;
  const blog = blogs.find((b) => {
    return id === b.id;
  });

  if (!blog) {
    return res.status(404).send("Blog not found");
  }

  res.render("show", { blog });
});

app.patch("/blogs/:id", (req, res) => {
  const { id } = req.params;
  const newContent = req.body.content;
  const blog = blogs.find((b) => {
    return id === b.id;
  });

  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  blog.content = newContent;
  res.redirect("/blogs");
});

app.get("/blogs/:id/edit", (req, res) => {
  const { id } = req.params;
  const blog = blogs.find((b) => {
    return id === b.id;
  });
  res.render("edit", { blog });
});

app.delete("/blogs/:id", (req, res) => {
  const { id } = req.params;
  blogs = blogs.filter((b) => b.id !== id);
  res.redirect("/blogs");
});

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}/blogs `);
});

// export default app;
