const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 5000

const app = express()

app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to the Task Management API'})
})

app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}`))