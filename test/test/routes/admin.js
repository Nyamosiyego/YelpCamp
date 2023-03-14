const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (req.query.isAdmin) {
        next();
    } else {
        res.send('You are not an admin');
    }   
});

router.get('/topsecret', (req, res) => {
    res.send('Top Secret');
})
router.get('/deleteall', (req, res) => {
    res.send('Delete All');
})

module.exports = router;