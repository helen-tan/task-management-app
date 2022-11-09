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
    res.status(200).send({ message: 'Welcome to the Task Management API' })
})
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/tasks', taskRoutes)


// Error Handler middleware
app.use(errorHandler)

// NODEMAILER
const nodemailer = require("nodemailer")

// Create transporter object - contains the sender's info/ credentials for our server
const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
})

// Verify SMTP connection
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// mailOptions object
const mailOptions = {
    from: '"Task Management System" <smtp.mailtrap.io>', // sender address
    to: "test@gmail.com", // list of receivers
    subject: "Task Done Notification", // Subject line
    text: "Message sent with Nodemailer", // plain text body
    html: "<b>Hi there</b><br>A new task has been promoted to Done<br/>", // html body
}

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});




app.listen(PORT, () => console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV}`))