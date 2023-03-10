const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/relationships', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo Connection Open!')
    })
    .catch(err => {
        console.log('Mongo Connection Error!')
        console.log(err)
    })

const  productSchema = new Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    }
})    
const farmSchema = new Schema({
    name: String,
    city: String,
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }]
})


const Product = mongoose.model('Product', productSchema)
const Farm = mongoose.model('Farm', farmSchema)

// Product.insertMany([
//     {name: 'Goddess Melon', price: 4.99, season: 'Summer'},
//     {name: 'Sugar Baby Watermelon', price: 4.99, season: 'Summer'},
//     {name: 'Asparagus', price: 3.99, season: 'Spring'},
//     {name: 'Organic Goddess Melon', price: 5.99, season: 'Summer'},
//     {name: 'Organic Mini Seedless Watermelon', price: 6.99, season: 'Summer'},
//     {name: 'Organic Asparagus', price: 5.99, season: 'Spring'},
//     {name: 'Mini Seedless Watermelon', price: 3.99, season: 'Summer'},
//     {name: 'Organic Strawberry', price: 5.99, season: 'Spring'},
//     {name: 'Strawberry', price: 4.99, season: 'Spring'},
//     {name: 'Organic Lemon', price: 1.99, season: 'Spring'},
//     {name: 'Lemon', price: 0.99, season: 'Spring'},
//     {name: 'Blueberry', price: 6.99, season: 'Summer'},
//     {name: 'Organic Blueberry', price: 7.99, season: 'Summer'},
//     {name: 'Blackberry', price: 6.99, season: 'Summer'},
//     {name: 'Organic Blackberry', price: 7.99, season: 'Summer'},
//     {name: 'Raspberry', price: 6.99, season: 'Summer'},
//     {name: 'Organic Raspberry', price: 7.99, season: 'Summer'}
// ])


// const makeFarm = async () => {
//     const farm = new Farm({name: 'Full Belly Farms', city: 'Guinda, CA'})
//     const melon = await Product.findOne({name: 'Goddess Melon'})
//     farm.products.push(melon)
//     await farm.save()
//     console.log(farm)
// }
// makeFarm()

const addProduct = async () => {
    const farm = await Farm.findOne({name: 'Full Belly Farms'})
    const watermelon = await Product.findOne({name: 'Sugar Baby Watermelon'})
    farm.products.push(watermelon)
    await farm.save()
    console.log(farm)
}

Farm.findOne({name: 'Full Belly Farms'})
    .populate('products')
    .then(f => console.log(f))
