const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const cors = require('cors')
const PORT = process.env.PORT || 5000

// Route imports
const userRoutes = require('./routes/userRoutes')
const groupRoutes = require('./routes/groupRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const planRoutes = require('./routes/planRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

// Middlewares
app.use(express.json()) // allow to send raw json
app.use(express.urlencoded({ extended: false })) // accept urlencoded form
app.use(cors({ origin: "http://localhost:3000" }))

// Routes
app.get('/', (req, res) => {
    res.status(200).send({message: 'Welcome to the Task Management API'})
})
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/tasks', taskRoutes)


// Error Handler middleware
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}`))