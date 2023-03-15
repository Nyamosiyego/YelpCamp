const express = require('express');
const app = express();
const session = require('express-session');
const sessionOptions = { secret: 'secret for signing session id', saveUninitialized: false, resave: false  }

app.use(session(sessionOptions));

app.get('/viewcount', (req, res) => {
    if (req.session.page_views) {
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
    
});

app.get('/register', (req, res) => {
    const { username = 'Anonymous' } = req.query
    req.session.username = username
    res.redirect('/greet')
})

app.get('/greet', (req, res) => {
    const { username } = req.session
    res.send(`Welcome back, ${username}`)
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
    }
);