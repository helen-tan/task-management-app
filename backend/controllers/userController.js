const db = require('../config/database')
const bcrypt = require('bcryptjs') // for hashing passswords
const jwt = require('jsonwebtoken')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const { checkGroup } = require('../middleware/authMiddleware')

// @desc    Create a user (Register a user)
// @route   /api/users
// @access  Private
const createUser = catchAsyncErrors(async (req, res) => {
    let { username, email, password, groupz } = req.body

    let tempStr = groupz.toString() // convert groupz input from object to string
    console.log("Group string from req.body: " + tempStr)

    // Format group input from request from: dev,guests => ["dev", "guests"]
    let str_array = tempStr.split(",")
    let newString = ""

    console.log(`str_array is ${str_array}`)
    console.log(str_array)

    if (str_array.length === 1) {
        newString = `["${str_array}"]`
    } else {
        for (let i = 0; i < str_array.length; i++) {
            // Trim the excess whitespace
            if (i == 0) {
                // front of string - ["...",
                newString += "[\"" + str_array[i] + "\","
            } else if (i == (str_array.length - 1)) {
                // back of string - "..."]
                newString += "\"" + str_array[i] + "\"]"
            } else {
                // middle of string - ,"..."  ("...",)
                newString += "\"" + str_array[i] + "\","
            }
        }
    }

    console.log("check: " + newString)
    groupz = newString

    // validation - check for empty inputs
    if (!username || !email || !password) {
        // res.status(400)
        // throw new Error('Please include all fields')
        return res.status(200).send({
            success: false,
            message: 'Please include a username, email and password'
        })
    }

    // Regex to validate user input
    const usernameRegexp = /^[a-zA-Z0-9]{5,}$/                             // only alphanumeric no special chars, min 5 chars 
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/    // Valid email string 
    const passwordRegexp = /^[a-zA-Z0-9\W|_]{8,10}$/                       // alphanumeric with special chars, 8-10 chars

    if (!username.match(usernameRegexp) || !email.match(emailRegexp) || !password.match(passwordRegexp)) {
        return res.status(200).send({
            success: false,
            message: 'Please give a valid username, email or password input'
        })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // console.log("here")
    // console.log(groupz)

    const new_user = {
        username: username,
        email: email,
        password: hashedPassword,
        groupz: groupz
    }

    db.query("insert into users (username, email, password, is_active, groupz) values (?, ?, ?, true, ?)", [
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
                    return res.status(200).send({
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
                    res.status(200).send({
                        success: false,
                        message: 'Username and password do not match'
                    })
                }
            } else {
                res.status(200).send({
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
// @route   /api/user/:username
// @access  Private
const getUser = catchAsyncErrors(async (req, res) => {
    // req.username was set from authMiddleware
    // Get logged in user (from unique username in jwt token authMiddleware)
    const loggedInUser = req.username
    // Get user whose details are to be viewed (from the params)
    const username = req.params.username

    // Users who can view is the admin and the user themselves - if not admin or the owner, restrict access
    if (loggedInUser !== 'admin' && loggedInUser !== username) {
        return res.status(401).send({
            success: false,
            message: 'You are not authorized to access this'
        })
    }

    db.query('select * from users where username = ?', [username], (err, results) => {
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

// @desc    Update user (for admin only)
// @route   /api/user/:username/updateUser
// @access  Private
const updateUser = catchAsyncErrors(async (req, res) => {
    // Get logged in user (from unique username in jwt token)
    const loggedInUser = req.username
    // Get user whose info is to be changed (from the params)
    const username = req.params.username

    // User who can update is the admin and the user themselves - if not admin or the owner, restrict access 
    // To check admin, check if user is in "admin" group
    const isAdmin = await checkGroup(loggedInUser, 'admin')

    if (!isAdmin && loggedInUser !== username) {
        return res.status(401).send({
            success: false,
            message: 'You are not authorized to access this'
        })
    }
    // TODO?: Handle empty or inputs that don't need updating

    // User inputs
    let { email, password, is_active, groupz } = req.body

    let sql = ""
    let hashedPassword = ""

    // Validation - Regex to validate user input
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/    // Valid email string 
    const passwordRegexp = /^[a-zA-Z0-9\W|_]{8,10}$/                       // alphanumeric with special chars, 8-10 chars
    const is_activeRegexp = /^([Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee]|1|0)$/    // must be 'true' or 'false' or "1" or "0"

    console.log(`Email input is ${email}`)
    console.log(`Password input is ${password}`)
    console.log(`is_active input is ${is_active}`)
    console.log(`groupz input is ${groupz}`)
    console.log(`groupz input length is ${groupz.length}`)


    // if (!emailRegexp.test(email) || !passwordRegexp.test(password) || !is_activeRegexp.test(is_active)) {

    //     return res.status(200).send({
    //         success: false,
    //         message: 'Please give a valid email, password or account status input'
    //     })
    // }

    // Format group input from request from: dev,guests => ["dev", "guests"]
    let tempStr = groupz.toString() // convert groupz input from object to string
    console.log("Group string from req.body: " + tempStr)

    let str_array = tempStr.split(",")
    let newString = ""

    if (str_array.length === 1) {
        newString = `["${str_array}"]`
    } else {
        for (let i = 0; i < str_array.length; i++) {
            // Trim the excess whitespace
            if (i == 0) {
                // front of string - ["...",
                newString += "[\"" + str_array[i] + "\","
            } else if (i == (str_array.length - 1)) {
                // back of string - "..."]
                newString += "\"" + str_array[i] + "\"]"
            } else {
                // middle of string - ,"..."  ("...",)
                newString += "\"" + str_array[i] + "\","
            }
        }
    }

    // Change is_active from num to string
    is_active = (is_active === "true" || is_active === 1 || is_active === "1") ? "1" : "0"

    // console.log("password length:" + password.length)
    // console.log("email length:" + email.length)
    // console.log("is_active" + is_active)
    // console.log("is_active length:" + is_active.length)
    // console.log("groupz length:" + groupz.length)


    // 1. Password omitted
    if (email.length > 0 && password.length < 1 && is_active.length > 0 && groupz.length > 0) {
        console.log("No PW filled. Email, is_active, groupz filled")
        console.log(password.length)
        // email input validation
        if (!emailRegexp.test(email)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid email input'
            })
        } else {
            // convert groupz into string form accepted by db
            // console.log("check: " + newString)
            groupz = newString
            // console.log("length" + newString.length)
            // console.log("groupz" + groupz)

            sql = `update users set email = "${email}", is_active = "${is_active}", groupz = '${groupz}' where username = "${username}"`
        }

        // 2. Password & groups omitted
    } else if (email.length > 0 && password.length < 1 && is_active.length > 0 && groupz.length < 1) {
        console.log("No PW & groups filled. Email, is_active filled")
        // email input validation
        if (!emailRegexp.test(email)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid email input'
            })
        } else {
            sql = `update users set email = "${email}", is_active = "${is_active}" where username = "${username}"`
        }

        // 3. All fields filled
    } else if (email.length > 0 && password.length > 0 && is_active.length > 0 && groupz.length > 0) {
        console.log("All fields filled")
        console.log(password.length)
        // email & password input validation
        if (!emailRegexp.test(email)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid email input'
            })
        } else if (!passwordRegexp.test(password)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid password input, of 8-10 characters, containing only alphabets, numbers and special characters',
            })
        } else {
            // hash pw
            hashedPassword = await bcrypt.hash(password, salt)
            // convert groupz into string form accepted by db
            // console.log("check: " + newString)
            groupz = newString
            // console.log("length" + newString.length)
            // console.log("groupz" + groupz)
            // Change is_active from num to string
            is_active = (is_active === "true" || is_active === 1 || is_active === "1") ? "1" : "0"

            sql = `update users set email = "${email}", password = "${hashedPassword}", is_active = "${is_active}", groupz = '${groupz}' where username = "${username}"`
        }

    }

    let updated_user = {
        username: username,
        email: email,
        password: hashedPassword,
        is_active: is_active,
        groupz: groupz
    }

    // update user
    db.query(sql, (err, results) => {
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

// @desc    Update user (For normal user) - only email & pw
// @route   /api/user/:username/updateProfile
// @access  Private
const updateProfile = catchAsyncErrors(async (req, res) => {
    // Get logged in user (from unique username in jwt token)
    const loggedInUser = req.username
    // Get user whose info is to be changed (from the params)
    const username = req.params.username
    //console.log(`Logged in user is ${loggedInUser}`)
    //console.log(`User to be updated is ${username}`)

    let sql = ""
    let hashedPassword = ""
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/    // Valid email string 
    const passwordRegexp = /^[a-zA-Z0-9\W|_]{8,10}$/                       // alphanumeric with special chars, 8-10 chars

    // Salt for hashing password
    const salt = await bcrypt.genSalt(10)

    // User who can update is the only user themselves - if not owner, restrict access 
    if (loggedInUser !== username) {
        return res.status(401).send({
            success: false,
            message: 'You are not authorized to access this'
        })
    }
    // User inputs
    let { email, password } = req.body
    console.log(`email: ${email}`)
    console.log(`password: ${password}`)

    // If empty fields were sent
    if (email.length < 1 && password.length < 1) {
        console.log("In empty fields were sent")
        return res.status(200).send({
            success: false,
            message: 'No changes were detected'
        })
        // If only Email field filled
    } else if (email.length > 1 && password.length < 1) {
        console.log("In Only Email filled")
        // email input validation
        if (!emailRegexp.test(email)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid email input'
            })
        } else {
            sql = `update users set email = "${email}" where username = "${loggedInUser}"`
        }
        // If only Password field filled
    } else if (email.length < 1 && password.length > 1) {
        console.log("In Only password filled")
        // password input validation
        if (!passwordRegexp.test(password)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid password input, of 8-10 characters, containing only alphabets, numbers and special characters',
            })
        } else {
            // hash pw
            hashedPassword = await bcrypt.hash(password, salt)

            sql = `update users set password = "${hashedPassword}" where username = "${loggedInUser}"`
        }
        //Both Email & Password fields filled 
    } else {
        console.log("In All fields filled")
        // email & password input validation
        if (!emailRegexp.test(email)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid email input'
            })
        } else if (!passwordRegexp.test(password)) {
            return res.status(200).send({
                success: false,
                message: 'Please give a valid password input, of 8-10 characters, containing only alphabets, numbers and special characters',
            })
        } else {
            // hash pw
            hashedPassword = await bcrypt.hash(password, salt)

            sql = `update users set email = "${email}", password = "${hashedPassword}" where username = "${loggedInUser}"`
        }
    }

    let updated_user = {
        username: loggedInUser,
        email: email,
        password: hashedPassword,
    }

    // Update Profile
    db.query(sql, (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(200).send({
                success: true,
                message: 'Profile updated successfully',
                data: updated_user
            })
        }
    })
})

// @desc    Authenticate user (Returns if user is an admin & the loggedIn user)
// @route   /api/users/authuser
// @access  Private
const authUser = catchAsyncErrors(async (req, res) => {
    // Get logged in user (from unique username in jwt token)
    const loggedInUser = req.username
    // To check admin, check if user is in "admin" group
    const isAdmin = await checkGroup(loggedInUser, 'admin')
    //console.log(isAdmin)

    res.status(200).send({
        isAdmin: isAdmin,
        loggedInUser: loggedInUser
    })
})

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUser,
    updateUser,
    updateProfile,
    authUser
}