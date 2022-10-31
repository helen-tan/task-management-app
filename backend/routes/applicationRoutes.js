const express = require('express')
const router = express.Router()
const { createApplication, getAllApplications, getApplication, updateApplication } = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createApplication)
router.get('/', protect, getAllApplications)
router.get('/:app_acronym', protect, getApplication)
router.put('/:app_acronym/updateApplication', protect, updateApplication)

module.exports = router