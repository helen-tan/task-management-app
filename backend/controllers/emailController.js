const nodemailer = require("nodemailer")
const catchAsyncErrors = require('../middleware/catchAsyncErrors')


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

// @desc    Send an email
// @route   /api/sendEmail
// @access  Private
const sendEmail = catchAsyncErrors(async (req, res) => {
    // mailOptions object
    const mailOptions = {
        from: '"Task Management System" <smtp.mailtrap.io>', // sender address
        to: "test@gmail.com", // list of receivers
        subject: "Task Done Notification", // Subject line
        text: "Message sent with Nodemailer", // plain text body
        html: "<b>Hi there</b><br>A new task has been promoted to Done<br/>", // html body
    }

    try {
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        })
    
        res.status(200).send({
            success: true,
            message: "Email sent",
        })

    } catch (err) {
        res.status(400).send({
            success: false,
            message: "Something went wrong"
        })
    }
})

module.exports = {
    sendEmail
}