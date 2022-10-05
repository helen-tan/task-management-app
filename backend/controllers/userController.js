const db = require('../config/database')

// @desc    Create a user (Register a user)
// @route   /api/users
// @access  Public
const createUser = (req, res) => {
    const { username, email, password } = req.body

    // validation
    if (!username || !email || !password) {
        res.status(400)
        throw new Error('Please include all fields')
    }

    res.status(201).json({
        success: true,
        message: 'Create new user route'
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
            if(username === results[0].username && password === results[0].password) {
                console.log(results);
                res.status(200).send({
                    message: 'Login successful',
                    data: results
                });
            } else if (!username || !password) {
                res.status(400).send({
                    message: 'Please enter your login credentials',
                });
            } else {
                res.status(400).send({
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
    res.status(200).json({
        success: true,
        message: 'This route will display all users'
    })
}

module.exports = {
    createUser,
    loginUser,
    getAllUsers
}