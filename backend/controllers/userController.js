const db = require('../config/database')
const bcrypt = require('bcryptjs') // for hashing passswords
const jwt = require('jsonwebtoken')

// @desc    Create a user (Register a user)
// @route   /api/users
// @access  Public
const createUser = async (req, res) => {
    const { username, email, password, groupz } = req.body

    // validation
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }

    // TODO: Find if user aldy exists

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let insert_sql = 
    `insert into users (username, email, password, is_active, groupz)
    values ('${username}', '${email}', '${hashedPassword}', true, '${groupz}')`

    const new_user = {
        username: username,
        email: email,
        password: hashedPassword,
        groupz: groupz
    }

    db.query(insert_sql, (err, results) => {
        if (err) {
            res.status(400)
            throw new Error('Unable to create user')
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
}

// @desc    Login
// @route   /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const {username, password} = req.body // get username & pw from body of sent req

    // query database for the user with these login credentials
    let sql = `select * from users where username='${username}'`

    db.query(sql, async (err, results) => {
        console.log(results)
        if (err) {
            res.status(400)
            throw new Error('An error occured')
        } else {
            if (results.length > 0) {
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
}

// JWT: Generate Token
const generateToken = (username) => {
    return jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// @desc    Get all users
// @route   /api/users
// @access  Public
const getAllUsers = (req, res) => {
    let sql = 'select * from users'

    db.query(sql, (err, results) => {
        if (err) {
            res.status(400)
            throw new Error('Could not get all users')
        } else {
            res.status(200).send({
                success: true,
                count: results.length,
                data: results
            })
        }

    })
}

module.exports = {
    createUser,
    loginUser,
    getAllUsers
}