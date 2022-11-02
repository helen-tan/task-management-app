const express = require('express')
const router = express.Router()
const { createPlan, getAllPlans } = require('../controllers/plansController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createPlan)
router.get('/', protect, getAllPlans)

module.exports = router