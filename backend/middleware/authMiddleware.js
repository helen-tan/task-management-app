const jwt = require('jsonwebtoken')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const db = require('../config/database')

const protect = catchAsyncErrors(async (req, res, next) => {
    let token

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get username (unique identifier) from token/ Set req.username to username and controller will see it
            // console.log(decoded) //E.g. { username: 'admin', iat: 1665043915, exp: 1667635915 }
            req.username = decoded.username
        }

    } catch (err) {
        // No such token
        console.log(error)
        return res.status(401).send({
            message: 'Not authorized'
        })

    }

    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     try {
    //         // Get token from header
    //         token = req.headers.authorization.split(' ')[1]

    //         // Verify token
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //         // Get username (unique identifier) from token/ Set req.username to username and controller will see it
    //         // console.log(decoded) //E.g. { username: 'admin', iat: 1665043915, exp: 1667635915 }
    //         req.username = decoded.username

    //     } catch (error) {
    //         // No such token
    //         console.log(error)
    //         res.status(401).send({
    //             message: 'Not authorized'
    //         })
    //     }
    // }

    // No Token
    if (!token) {
        return res.status(401).send({
            message: 'Login first to access this resource.'
        })
    }

    next()
})

// Handling user roles
const authorizeUser = (groupname) => {
    return catchAsyncErrors(async (req, res, next) => {
        const username = req.username // If user is logged in, then req would have req.username
        console.log(`Logged In user is ${username}`)

        // Check if user's groups contain 'admin'
        let isAdmin = await checkGroup(username, groupname)
        //console.log(`isAdmin is ${isAdmin}`)

        if (!isAdmin) {
            return res.status(403).send({
                message: 'Not authorized to access this resource'
            })
        }
        next()
    })
}

const checkGroup = (username, groupname) => {
    return new Promise((resolve, reject) => {
        db.query('select * from users where username = ?', [username], (err, results) => {
            if (err) {
                reject(false)
            } else {
                try {
                    let user_groups = results[0].groupz
                    // check if the array contains groupname
                    if (user_groups.includes(groupname)) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                } catch (err) {
                    reject(false)
                }
            }
        })
    })
}





// ANOTHER METHOD
/*
const authorizeUser2 = (groupname) => {
    return (req, res, next) => {
        const username = req.username // If user is logged in, then req would have req.username
        //console.log(username)
        // Check if user's groups contain 'admin'
        let isAdmin = checkGroup(username, groupname) // checkGroup not getting anything!!!!!!!!!!
        console.log(`In authorizeUser ${isAdmin}`)
        if(!isAdmin) {
            return res.status(403).send({
                message: 'Not authorized to access this resource'
            }) 
        } 
        next()
    }
}

const checkGroup2 = (username, groupname) => {

    catchAsyncErrors(async (req, res) => {
        // get user from the db using unique username, and get his/her groups
        console.log(username)
        let user_groups // E.g. ['dev', 'qa']
        let inGroup = false
    
        db.query('select * from users where username = ?', [username], (err, results) => {
            if (err) {
                return res.status(400).send({
                    success: false,
                    message: err.code
                })
            } else {
                user_groups = results[0].groupz
                // check if the array contains groupname
                inGroup = user_groups.includes(groupname)
                console.log(`In checkGroup1 ${inGroup}`)
            }
        })
        // Send the response
        console.log(`In checkGroup2 ${inGroup}`)
        return inGroup ? true : false
    })
}
*/


module.exports = {
    protect,
    authorizeUser,
    checkGroup
}
