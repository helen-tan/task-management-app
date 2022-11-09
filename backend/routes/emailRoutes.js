const express = require('express')
const router = express.Router()
const { sendEmail } = require('../controllers/emailController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, sendEmail)

module.exports = router