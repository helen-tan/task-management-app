const express = require('express')
const router = express.Router()
const { createApplication, getAllApplications, getApplication, updateApplication, updateAppRnum } = require('../controllers/applicationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createApplication)
router.get('/', protect, getAllApplications)
router.get('/:app_acronym', protect, getApplication)
router.put('/:app_acronym/updateApplication', protect, updateApplication)
router.put('/:app_acronym/updateAppRnum', protect, updateAppRnum)

module.exports = router