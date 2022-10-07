const jwt = require('jsonwebtoken')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const db = require('../config/database')

const protect = catchAsyncErrors(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
            // Get username (unique identifier) from token/ Set req.username to username and controller will see it
            // console.log(decoded) //E.g. { username: 'admin', iat: 1665043915, exp: 1667635915 }
            req.username = decoded.username

        } catch (error) {
            // No such token
            console.log(error)
            res.status(401).send({
                message: 'Not authorized'
            })
        }
    }

    // No Token
    if (!token) {
        return res.status(401).send({
            message: 'Login first to access this resource.'
        })
    }

    next()
})

module.exports = { protect }