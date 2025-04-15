const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const morgan = require('morgan');

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage for posts
let posts = [
    { id: 1, title: "Post 1", body: "This is the first post.", tags: ["new", "old"] },
    { id: 2, title: "Post 2", body: "This is the second post.", tags: ["new", "archived"] },
    { id: 3, title: "Post 3", body: "This is the third post.", tags: ["old", "archived"] },
    { id: 4, title: "Post 4", body: "This is the fourth post.", tags: ["new"] },
    { id: 5, title: "Post 5", body: "This is the fifth post.", tags: ["old"] },
    { id: 6, title: "Post 6", body: "This is the sixth post.", tags: ["archived"] },
    { id: 7, title: "Post 7", body: "This is the seventh post.", tags: ["new", "old"] },
    { id: 8, title: "Post 8", body: "This is the eighth post.", tags: ["new", "archived"] },
    { id: 9, title: "Post 9", body: "This is the ninth post.", tags: ["old", "archived"] },
    { id: 10, title: "Post 10", body: "This is the tenth post.", tags: ["new", "old", "archived"] }
];

// Routes
app.get('/', (req, res) => {
    const { tags, clear } = req.query;
    let template = 'index';
    if (clear) {
        template = 'partials/posts';
    }
    if (tags) {
        let filteredPosts = [...posts];
        const selectedTags = Array.isArray(tags) ? tags : [tags]; // Ensure tags is an array
        filteredPosts = posts.filter(post => 
            selectedTags.every(tag => post.tags.includes(tag))
        );

        filteredPostsSortDesc = filteredPosts.sort((a, b) => new Date(b.id) - new Date(a.id));

        return res.render('partials/posts', { posts: filteredPostsSortDesc });
    }

    // Render the full index page if no filtering
    res.render(template, { posts });
});

app.post('/posts', (req, res) => {
    const { title, body, tags } = req.body;
    posts.push({ title, body, tags });
    res.render('partials/post', { post: { title, body, tags } });
});

app.post('/posts/delete/:index', (req, res) => {
    const index = req.params.index;
    posts.splice(index, 1);
    res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});