const db = require('../config/database')
const bcrypt = require('bcryptjs') // for hashing passswords

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
                data: new_user
            })
            console.log(new_user)
        }
    })
}

// @desc    Login
// @route   /api/users/login
// @access  Public
const loginUser = (req, res) => {
    const {username, password} = req.body // get username & pw from body of sent req

    // query database for the user with these login credentials
    let sql = `select * from users where username='${username}' && password='${password}'`

    db.query(sql, (err, results) => {
        if (err) {
            res.status(400)
            throw new Error('Incorrect username or password')
        } else {
            if (username === results[0].username && password === results[0].password) {
                console.log(results);
                res.status(200).send({
                    success: true,
                    message: 'Login successful',
                    data: results
                });
            } else if (!username || !password) {
                res.status(400).send({
                    success: false,
                    message: 'Please enter your login credentials',
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Invalid username or password',
                });
            }
        }
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