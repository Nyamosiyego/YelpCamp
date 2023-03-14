const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Shelter');
})
router.get('/:id', (req, res) => {
    res.send('Shelter ID');
})

module.exports = router;