const express = require('express')
const router = express.Router()
const { createGroup, checkGroup } = require('../controllers/groupController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createGroup)
router.post('/checkGroup', protect, checkGroup)

module.exports = router