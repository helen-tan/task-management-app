const express = require('express')
const router = express.Router()
const { createApplication, updateApplication } = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createApplication)
router.put('/:app_acronym/updateApplication', protect, updateApplication)

module.exports = router