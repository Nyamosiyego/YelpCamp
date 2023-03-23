const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground')
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 350; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64197aebc8ad88b974d5d886',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:  [
               {
                 url: 'https://res.cloudinary.com/dwh98o938/image/upload/v1679476330/YelpCamp/nature-mountains.jpg',
                 filename: 'YelpCamp/nature-mountains',
               },
                {
                  url: 'https://res.cloudinary.com/dwh98o938/image/upload/v1679479689/YelpCamp/gsiewbr50lmnywxdssxt.jpg',
                  filename: 'YelpCamp/gsiewbr50lmnywxdssxt',
                },
                {
                  url: 'https://res.cloudinary.com/dwh98o938/image/upload/v1679479690/YelpCamp/mtisgm0gzbjt0l0f6m2h.jpg',
                  filename: 'YelpCamp/mtisgm0gzbjt0l0f6m2h',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
