const express = require('express')
const connectDB = require('./config/db')

const app = express()


// connect db
connectDB()

// init middlewares
// allow access req.body in json format
app.use(express.json({ extended: false }))

// routes
app.get('/', (req, res) => res.send('api running..'))
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/post'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})