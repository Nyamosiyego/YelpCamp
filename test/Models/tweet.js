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

const userSchema = new Schema({
    username: String,
    age: Number
})

const tweetSchema = new Schema({
    text: String,
    likes: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }   
})

const User = mongoose.model('User', userSchema)
const Tweet = mongoose.model('Tweet', tweetSchema)

// const makeTweets = async () => {
//     const user = new User ({
//         username: 'chickenfan99',
//         age: 61
//     })
//     await user.save()
//     const tweet = new Tweet({
//         text: 'lol that is so funny',
//         likes: 0
//     })
//     tweet.user = user
//     await tweet.save()
//     console.log(tweet)
// }
// makeTweets()

const findTweet = async () => {
    const t = await Tweet.find({}).populate('user', 'username')
    console.log(t)
}
findTweet()