const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3001;
const CONTENT_PATH = path.join(__dirname, '../content.json');

const USERNAME = 'admin';
const PASSWORD = 'kurtulan123098';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

function isAuthenticated(req, res, next) {
    if (req.session && req.session.authenticated) {
        return next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        req.session.authenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

app.get('/content', isAuthenticated, (req, res) => {
    fs.readFile(CONTENT_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read content' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/content', isAuthenticated, (req, res) => {
    fs.writeFile(CONTENT_PATH, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save content' });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Admin panel server running at http://localhost:${PORT}`);
}); 