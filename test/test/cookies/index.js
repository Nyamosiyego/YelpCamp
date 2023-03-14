const express = require('express');
const port = 3000;
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser('thisismysecret'));

app.get('/greet', (req, res) => {
    const { name = 'No-name' } = req.cookies;
    res.send(`'This is great!' - ${name}`);
});

app.get('/setname', (req, res) => {
    res.cookie('name', 'John');
    res.cookie('age', 30);
    res.send('Cookie set');
});

app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'grape', { signed: true });
    res.send('Signed Cookie set');
});

app.get('/verifyfruit', (req, res) => {
    console.log(req.cookies)
    console.log(req.signedCookies);
    res.send(req.signedCookies);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);