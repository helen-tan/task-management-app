const express = require('express')
const router = express.Router()
const { createGroup, checkGroup, getAllGroups } = require('../controllers/groupController')
const { protect, authorizeUser } = require('../middleware/authMiddleware')

router.post('/', protect, authorizeUser('admin'), createGroup)
router.get('/', protect, getAllGroups)
router.post('/checkGroup', protect, checkGroup)

module.exports = router