const express = require('express')
const router = express.Router()
const { createUser, loginUser, getAllUsers, getUser } = require('../controllers/userController')
const { protect, authorizeUser } = require('../middleware/authMiddleware')


router.post('/', protect, authorizeUser("admin"), createUser)
router.post('/login', loginUser)
router.get('/', protect, getAllUsers)
router.get('/me', protect, getUser)

module.exports = router