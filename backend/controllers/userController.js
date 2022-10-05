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
    res.status(200).json({
        success: true,
        message: 'Login route'
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