const express = require('express')
const router = express.Router()
const { createUser, loginUser, getAllUsers, getUser, updateUser, authUser } = require('../controllers/userController')
const { protect, authorizeUser } = require('../middleware/authMiddleware')


router.get('/authuser', protect, authUser)
router.post('/', protect, authorizeUser("admin"), createUser)
router.post('/login', loginUser)
router.get('/', protect, getAllUsers)
router.get('/:username', protect, getUser)
router.put('/:username', protect, updateUser)

module.exports = router