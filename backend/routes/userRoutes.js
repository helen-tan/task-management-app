const express = require('express')
const router = express.Router()
const { createUser, loginUser, getAllUsers, getUser, updateUser, updateProfile, authUser } = require('../controllers/userController')
const { protect, authorizeUser } = require('../middleware/authMiddleware')


router.get('/authuser', protect, authUser)
router.post('/', protect, authorizeUser("admin"), createUser)
router.post('/login', loginUser)
router.get('/', protect, getAllUsers)
router.get('/:username', protect, getUser)
router.put('/:username/updateUser', protect, updateUser)
router.put('/:username/updateProfile', protect, updateProfile)

module.exports = router