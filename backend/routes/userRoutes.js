const express = require('express')
const router = express.Router()

// @desc    Create a user (Register a user)
// @route   /api/users
// @access  Public
router.post('/', (req, res) => {
    // To be in controller in future
    res.status(201).json({
        success: true,
        message: 'Register route'
    })
})

// @desc    Login
// @route   /api/users/login
// @access  Public
router.get('/login', (req, res) => {
    // To be in controller in future
    res.status(200).json({
        success: true,
        message: 'Login route'
    })
})

// @desc    Get all users
// @route   /api/users
// @access  Public
router.get('/', (req, res) => {
    // To be in controller in future
    res.status(200).json({
        success: true,
        message: 'This route will display all users'
    })
})

module.exports = router