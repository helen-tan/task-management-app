const express = require('express')
const router = express.Router()
const { createPlan } = require('../controllers/plansController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createPlan)

module.exports = router