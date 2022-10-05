const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 5000

// Route imports
const userRoutes = require('./routes/userRoutes')

const app = express()

// Routes
app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to the Task Management API'})
})

app.use('/api/users', userRoutes)

app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}`))