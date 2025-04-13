const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const morgan = require('morgan'); // Import morgan

// Middleware
app.use(morgan('dev'));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage for posts
let posts = [];

// Routes
app.get('/', (req, res) => {
    const { tags, clear } = req.query;
    let template = 'index';
    if (clear) {
        template = 'partials/posts';
    }
    if (tags) {
        let filteredPosts = posts;
        const selectedTags = Array.isArray(tags) ? tags : [tags]; // Ensure tags is an array
        filteredPosts = posts.filter(post => 
            selectedTags.every(tag => post.tags.includes(tag))
        );

        // Render only the posts section if filtering
        return res.render('partials/posts', { posts: filteredPosts });
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