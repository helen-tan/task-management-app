const express = require('express')
const router = express.Router()
const { createUser, loginUser, getAllUsers, getUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')


router.post('/', createUser)
router.get('/login', loginUser)
router.get('/', getAllUsers)
router.get('/me', protect, getUser)



module.exports = router