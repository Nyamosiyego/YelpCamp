const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/relationships', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo Connection Open!')
    })
    .catch(err => {
        console.log('Mongo Connection Error!')
        console.log(err)
    })

const userSchema = new mongoose.Schema({
    first: String,
    last: String,
    addresses: [
        {
            _id: { _id: false }, 
            street: String,
            city: String,
            state: String,
            country: String
        }    
    ]
})

const User = mongoose.model('User', userSchema)

const makeUser = async () => {
    const u = new User({
        first: 'Harry',
        last: 'Potter'
    })
    u.addresses.push({
        street: '123 Sesame St',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })
}

const addAddress = async (id) => {
    const user = await User.findById(id)
    user.addresses.push({
        street: '24 Jump St',
        city: 'New York',
        state: 'NY',
        country: 'USA'
    })
    const res = await user.save()
    console.log(res)
}
addAddress('640af47f1d98128a6ea42e44')
