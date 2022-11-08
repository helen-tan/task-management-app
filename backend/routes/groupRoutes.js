const express = require('express')
const router = express.Router()
const { createGroup, checkGroup, getAllGroups, getUserGroups } = require('../controllers/groupController')
const { protect, authorizeUser } = require('../middleware/authMiddleware')

router.post('/', protect, authorizeUser('admin'), createGroup)
router.get('/', protect, getAllGroups)
router.post('/checkGroup', protect, checkGroup)
router.get('/:username', protect, getUserGroups)

module.exports = router