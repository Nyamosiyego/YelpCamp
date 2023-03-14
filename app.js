const express = require('express')
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { CampgroundSchema } = require('./schemas.js')
const { reviewSchema } = require('./schemas.js')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
const Review = require('./models/review')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
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
app.engine('ejs', ejsMate)

const validateCampground = (req, res, next) => {
    const { error } = CampgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next()
    }
}

app.get('/', (req, res) => {
    res.render('campgrounds/home')
})
app.get('/campgrounds', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
    const { error } = CampgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`) 
}))

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews')
    res.render('campgrounds/show', { campground })
}))
app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))
app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { runValidators: true, new: true })
    res.redirect(`/campgrounds/${campground._id}`)
}))
app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

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