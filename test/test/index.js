const express = require('express');
const app = express();
const port = 3000;
const shelterRoutes = require('./routes/shelter');
const dogRoutes = require('./routes/dogs');

app.use('/shelters', shelterRoutes);
app.use('/dogs', dogRoutes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});