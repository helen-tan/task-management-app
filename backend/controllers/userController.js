const db = require('../config/database')
const bcrypt = require('bcryptjs') // for hashing passswords
const jwt = require('jsonwebtoken')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create a user (Register a user)
// @route   /api/users
// @access  Private
const createUser = catchAsyncErrors(async (req, res) => {
    const { username, email, password, groupz } = req.body

    // validation - check for empty inputs
    if (!username || !email || !password) {
        // res.status(400)
        // throw new Error('Please include all fields')
        return res.status(400).send({
            success: false,
            message: 'Please include all fields'
        })
    }

    // Regex to validate user input
    const usernameRegexp = /^[a-zA-Z0-9]{5,}$/                             // only alphanumeric no special chars, min 5 chars 
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/    // Valid email string 
    const passwordRegexp = /^[a-zA-Z0-9\W|_]{8,10}$/                       // alphanumeric with special chars, 8-10 chars

    if (!username.match(usernameRegexp) || !email.match(emailRegexp) || !password.match(passwordRegexp)) {
        return res.status(400).send({
            success: false,
            message: 'Please give a valid username, email or password input'
        })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const new_user = {
        username: username,
        email: email,
        password: hashedPassword,
        groupz: groupz
    }

    db.query('insert into users (username, email, password, is_active, groupz) values (?, ?, ?, true, ?)', [
        username,
        email,
        hashedPassword,
        groupz
    ], (err, results) => {
        if (err) {
            // res.status(400)
            // throw new Error('Unable to create user')
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: 'User created successfully',
                data: new_user,
                token: generateToken(username)
            })
            console.log(new_user)
        }
    })
})

// @desc    Login
// @route   /api/users/login
// @access  Public
const loginUser = catchAsyncErrors(async (req, res) => {
    const { username, password } = req.body // get username & pw from body of sent req

    // query database for the user with these login credentials
    db.query('select * from users where username = ? ', [username], async (err, results) => {
        console.log(results)
        if (err) {
            res.status(400)
            throw new Error('An error occured')
        } else {
            if (results.length > 0) {
                // Validation - Check that the is_active property is true first, otherwise prevent login
                if (!results[0].is_active) {
                    return res.status(403).send({
                        success: false,
                        message: 'Account is inactive. Please contact your administrator'
                    })
                }
                // If user is active, begin authenticating
                const comparison = await bcrypt.compare(password, results[0].password)

                if (comparison) {
                    res.status(200).send({
                        success: true,
                        message: 'Login successful',
                        data: results,
                        token: generateToken(username)
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        message: 'Username and password do not match'
                    })
                }
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Username does not exist'
                })
            }
        }
    })
})

// JWT: Generate Token
const generateToken = (username) => {
    return jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// @desc    Get all users
// @route   /api/users
// @access  Private
const getAllUsers = (req, res) => {
    let sql = 'select * from users'

    db.query(sql, (err, results) => {
        if (err) {
            //res.status(400)
            //throw new Error('Could not get all users')
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(200).send({
                success: true,
                count: results.length,
                data: results
            })
        }

    })
}

// @desc    Get current logged-in user data
// @route   /api/user/me
// @access  Private
const getUser = catchAsyncErrors(async (req, res) => {
    // req.username was set from authMiddleware
    db.query('select * from users where username = ?', [req.username], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(200).send({
                success: true,
                data: results
            })
        }
    })
})

// @desc    Update user
// @route   /api/user/:username
// @access  Private
const updateUser = catchAsyncErrors(async (req, res) => {
    // Get logged in user (from unique username in jwt token)
    const loggedInUser = req.username
    // Get user whose info is to be changed (from the params)
    const username = req.params.username
  
    // User who can update is the admin and the user themselves - if not admin or the owner, restrict access
    if (loggedInUser !== 'admin' && (loggedInUser !== username)) {
        return res.status(401).send({
            success: false,
            message: 'You are not authorized to access this'
        })
    }
    // TODO: Handle empty or inputs that don't need updating

    // User inputs
    let { email, password, is_active, groupz } = req.body
    
    // Validation - Regex to validate user input
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/    // Valid email string 
    const passwordRegexp = /^[a-zA-Z0-9\W|_]{8,10}$/                       // alphanumeric with special chars, 8-10 chars
    const is_activeRegexp = /^([Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee])$/    // must be 'true' or 'false'


    if (!emailRegexp.test(email) || !passwordRegexp.test(password) || !is_activeRegexp.test(is_active)) {
        return res.status(400).send({
            success: false,
            message: 'Please give a valid email, password or account status input'
        })
    }

    // Change is_active from num to string
    is_active = (is_active === "true") ? "1" : "0"

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let updated_user = {
        username: username,
        email : email,
        password: hashedPassword,
        is_active : is_active,
        groupz: groupz
    }

    // update user
    db.query('update users set email = ?, password = ?, is_active = ?, groupz = ? where username = ?', [
        email, 
        hashedPassword,
        is_active,
        groupz,
        username
    ], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(200).send({
                success: true,
                message: 'User updated successfully',
                data: updated_user,
            })
        }
    })
    
})

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    updateUser
}