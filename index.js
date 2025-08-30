import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



// Configure multer to store files in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Serve /uploads statically
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Enable EJS
app.set("view engine", "ejs");

// ✅ Posts should go above route definitions!
const posts = [
 {
  title: "Understanding EJS: Why I Use It Before React",
  category: "Frontend",
  date: "Aug 29, 2025",
  content: `Everyone is rushing to React, but I think there's still a powerful place for EJS in your workflow — especially if you're learning full-stack development.

In this post, I break down what EJS actually does, why it helps you grasp templating and dynamic rendering, and how it fits into the Node.js ecosystem. I show examples of how to pass variables, loop over data, and structure partials (like headers/footers). 

We’ll also talk about EJS’s sweet spot — small-to-mid sized apps, dashboards, and SSR prototypes — and why mastering it helped me debug React apps better later.`,
  image: "/images/ejs-templates.jpg",
  id: "post5",
  slug: "understanding-ejs",
  tags: ["ejs", "templating", "nodejs", "frontend"],
  author: "Lena Park",
  social: "@lenapark_dev",
  email: "lena@frontenddojo.dev"
},
{
  title: "Node.js Crash Course: Express Routing Without the Headache",
  category: "Backend",
  date: "Aug 28, 2025",
  content: `Routing in Express can feel confusing when you're new. Do you use app.get? What about req.params vs req.query? And where do you put your logic?

In this post, I simplify Express routing by comparing it to real-world paths — like walking through folders. You'll learn about dynamic routes (posts.slug), RESTful endpoints, middleware chaining, and how to split your routes into separate files.

Bonus: I include a complete mini Express app you can clone and learn from.`,
  image: "/images/express-routing.png",
  id: "post6",
  slug: "express-routing-crash-course",
  tags: ["nodejs", "express", "backend", "routing"],
  author: "Derek Lowe",
  social: "@derekthedev",
  email: "derek.lowe@nodemail.app"
},
{
  title: "JavaScript Closures Explained With Sandwiches 🥪",
  category: "JavaScript",
  date: "Aug 27, 2025",
  content: `Closures confused me more than any other JavaScript concept — until I compared them to sandwiches. Weird, I know.

In this tutorial, I walk you through what a closure is, when you use it (like in event handlers or async code), and why it matters for scope and memory.

You’ll build a closure-powered counter, see how to preserve state between function calls, and learn why this concept is critical for React hooks like useState. Plus, you’ll never look at sandwiches the same again.`,
  image: "/images/js-closures.png",
  id: "post7",
  slug: "javascript-closures-sandwich",
  tags: ["javascript", "closures", "concepts", "tutorial"],
  author: "Nicole Jiang",
  social: "@nicole.codes",
  email: "nicolejiang@learnjs.dev"
},
{
  title: "REST APIs for Dummies (And Why You're Not One)",
  category: "Backend",
  date: "Aug 30, 2025",
  content: `APIs aren't scary — they're just structured conversations between machines.

In this post, we build a simple REST API with Express and break down the five core HTTP methods (GET, POST, PUT, DELETE, PATCH) in real-world terms. You'll learn the difference between parameters and query strings, and how to test endpoints using Postman.

By the end, you'll be hitting routes like /api/posts/:id with swagger. Bonus: I show you how to write your own middleware to log every request.`,
  image: "/images/rest-api-guide.jpg",
  id: "post8",
  slug: "rest-apis-for-dummies",
  tags: ["nodejs", "api", "express", "backend", "http"],
  author: "Caleb Stone",
  social: "@calebbuilds",
  email: "caleb@devinmotion.net"
},
{
  title: "Async/Await in JavaScript: Stop Writing Callback Soup",
  category: "JavaScript",
  date: "Aug 30, 2025",
  content: `Ever nested 3 callbacks and had no idea what was going on? That's what we call callback hell.

This post walks you through how async and await changed the game for writing readable asynchronous code. You'll learn how promises work under the hood, and how to rewrite old-school XHR or fetch() logic with elegant async syntax.

Plus, I give you 3 common async bugs I made as a beginner — and how to avoid them.`,
  image: "/images/async-await-guide.jpg",
  id: "post9",
  slug: "async-await-guide",
  tags: ["javascript", "async", "promises", "frontend"],
  author: "Zahra Malik",
  social: "@zahra.codes",
  email: "zahra@frontendforge.dev"
},
{
  title: "CSS Grid: Why Your Layouts Still Look Broken",
  category: "Frontend",
  date: "Aug 30, 2025",
  content: `You write good HTML. Your CSS is valid. So why does your layout still break?

In this hands-on tutorial, I walk you through **CSS Grid** — the most powerful layout tool in CSS. We'll build a real dashboard layout with multiple columns, nested grids, and responsive design — all without relying on floats or Bootstrap classes.

You'll leave this post knowing how to use grid-template-areas, auto-fit, fr units, and media queries that *actually work*. Plus, I’ll show you how I use Firefox DevTools to debug any layout fast.`,
  image: "/images/css-grid-layout.jpg",
  id: "post10",
  slug: "css-grid-broken-layouts",
  tags: ["css", "grid", "frontend", "layout", "design"],
  author: "Jason Kwon",
  social: "@kwonverse",
  email: "jason@layoutmaster.dev"
}
];



// Hande new post creation
app.post("/create-post", upload.single("image"), (req, res) => {
  const { author, social, email, category, title, tags, content } = req.body;
  const image = req.file ? "/uploads/" + req.file.filename : "/images/default.jpg";

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-");

  const newPost = {
    id: posts.length + 1, // Auto-increment
    author,
    social,
    email,
    category,
    title,
    slug,
    tags: tags.split(",").map(tag => tag.trim()),
    content,
    image,
    date: new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
  };

  posts.push(newPost);
  res.render("partials/createPost.ejs", { success: true });
});




// Routes
app.get("/", (req, res) => {
  res.render("signIn.ejs");
});

app.get("/index", (req, res) => {
  res.render("index.ejs", { posts }); // ✅ Send posts to your EJS
});


app.get("/create", (req, res) => {
  res.render("partials/createPost.ejs", { success: false });
});


app.get("/posts/:slug", (req, res) => {
  const slug = req.params.slug;
  const post = posts.find(p => p.slug === slug);

  if (post) {
    res.render("partials/postDetail.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});


app.post("/rate-post", (req, res) => {
  const { postId, rating } = req.body;

  // Find post by ID
  const post = posts.find(p => p.id == postId);
  if (post) {
    if (!post.ratings) {
      post.ratings = [];
    }
    post.ratings.push(parseInt(rating));
  }

  // Redirect back to the same post
  const redirectSlug = post ? post.slug : "";
  res.redirect(`/posts/${redirectSlug}`);
});


app.get("/search", (req, res) => {
  const query = (req.query.q || "").toLowerCase(); // ✅ avoid crashing

  const matchedPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query) ||
    post.category.toLowerCase().includes(query) ||
    post.tags.some(tag => tag.toLowerCase().includes(query))
  );

  res.render("partials/searchPost.ejs", {
    posts: matchedPosts,
    query: req.query.q || "" // Pass raw query back to display
  });
});





app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
