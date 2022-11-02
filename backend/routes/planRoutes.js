const express = require('express')
const router = express.Router()
const { createPlan, getAllPlansByApp } = require('../controllers/plansController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createPlan)
router.get('/:app_acronym', protect, getAllPlansByApp)

module.exports = router