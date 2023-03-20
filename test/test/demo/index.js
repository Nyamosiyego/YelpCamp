const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const port = 3000;
const session = require('express-session');

mongoose.set("strictQuery", true);
mongoose.connect('mongodb://localhost:27017/authDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo Connection Open!");
    })
    .catch(err => {
        console.log("Mongo Connection Error!");
        console.log(err);
    });

app.use(express.urlencoded({ extended: true }));
app.use(session({secret: 'notagoodsecret'}));
app.set('view engine', 'ejs');
app.set('views', 'views');

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

app.get('/', (req, res) => {
    res.send(req.body);
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password)
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    }
    else {
        res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
