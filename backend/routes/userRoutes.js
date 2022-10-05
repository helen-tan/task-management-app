const express = require('express')
const router = express.Router()
const { createUser, loginUser, getAllUsers } = require('../controllers/userController')

// @desc    Create a user (Register a user)
// @route   /api/users
// @access  Public
router.post('/', createUser)

// @desc    Login
// @route   /api/users/login
// @access  Public
router.get('/login', loginUser)

// @desc    Get all users
// @route   /api/users
// @access  Public
router.get('/', getAllUsers)

module.exports = router