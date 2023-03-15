const express = require('express')
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js')
const { reviewSchema } = require('./schemas.js')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const Review = require('./models/review')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate)

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})