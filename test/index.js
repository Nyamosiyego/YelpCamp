const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000
const AppError = require('./AppError')

// app.use(morgan('tiny'))

// app.use((req, res, next) => {
//     console.log('I run for all routes')
//     return next()
//     })

app.use((req, res, next) => {
    req.requestTime = Date.now()
    console.log(req.method, req.path)
    return next()
    })

app.use('/dog', (req, res, next) => {
    console.log('I run only for /dog routes')
    return next()
    })    
const verifyPassword = (req, res, next) => {
    const { password } = req.query
    if (password === 'chickennugget') {
        return next()
    }
    throw new AppError('Password required', 401)
    // res.send('Sorry you need a password!')
//     throw new Error('Password required')
 }

app.get('/secret', verifyPassword, (req, res, next) => {
    res.send('Ola')
    return next()
})    

app.get('/', (req, res) => {
    console.log(`Request Date: ${req.requestTime}`)
    res.send('Hello World!')
    })

app.get('/error', (req, res) => {
    chicken.fly()
    })    

app.get('/dog', (req, res) => {
    res.send('Woof!')
    })

app.get('/admin', (req, res) => {
    throw new AppError('You are not an admin', 403)
})    

app.use((req, res) => {
    res.status(404).send('Not found')
})    

// app.use((err, req, res, next) => {
//     console.log('***********')
//     console.log('*****ERROR******')
//     console.log('*****************')
//     console.log('***********')
//     console.log(err)
//     next(err)
// })

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err
    res.status(status).send(message)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })