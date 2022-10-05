const express = require('express')
const router = express.Router()

// @desc    Get all users
// @route   /api/users
// @access  Public
router.get('/', (req, res) => {
    // To be in controller in future
    res.status(200).json({
        success: true,
        requestMethod: req.requestMethod,
        message: 'This route will display all users'
    })
})

module.exports = router