const express = require('express')
const router = express.Router()
const { createApplication } = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createApplication)

module.exports = router