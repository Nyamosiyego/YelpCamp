const express = require('express');
const router = express.Router();

router.get('/topsecret', (req, res) => {
    res.send('Top Secret');
})


module.exports = route