const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Dogs');
})
router.get('/:id', (req, res) => {
    res.send('Dog ID');
})

module.exports = router;