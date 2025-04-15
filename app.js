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
    { id: 1, title: "Post 1", body: "This is the first post.", tag: "new" },
    { id: 2, title: "Post 2", body: "This is the second post.", tag: "new" },
    { id: 3, title: "Post 3", body: "This is the third post.", tag: "old" },
    { id: 4, title: "Post 4", body: "This is the fourth post.", tag: "new" },
    { id: 5, title: "Post 5", body: "This is the fifth post.", tag: "old" },
    { id: 6, title: "Post 6", body: "This is the sixth post.", tag: "archived" },
    { id: 7, title: "Post 7", body: "This is the seventh post.", tag: "new" },
    { id: 8, title: "Post 8", body: "This is the eighth post.", tag: "new" },
    { id: 9, title: "Post 9", body: "This is the ninth post.", tag: "old" },
    { id: 10, title: "Post 10", body: "This is the tenth post.", tag: "new" }
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
        const selectedTags = Array.isArray(tags) ? tags : [tags];
        filteredPosts = posts.filter(post => 
            selectedTags.some(tag => post.tag === tag)
        );

        filteredPostsSortDesc = filteredPosts.sort((a, b) => new Date(b.id) - new Date(a.id));

        return res.render('partials/posts', { posts: filteredPostsSortDesc });
    }

    const postsCopy = [...posts];
    postsSortDesc = postsCopy.sort((a, b) => new Date(b.id) - new Date(a.id));

    res.render(template, { posts: postsSortDesc });
});

app.post('/posts', (req, res) => {
    const { title, body, tag } = req.body;
    const newPost = { id: posts.length + 1, title, body, tag };
    posts.push(newPost);
    res.render('partials/post', { post: newPost });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});