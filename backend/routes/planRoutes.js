const express = require('express')
const router = express.Router()
const { createPlan, getAllPlansByApp, getPlanColorByAppAndPlan } = require('../controllers/planController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createPlan)
router.get('/:app_acronym', protect, getAllPlansByApp)
router.get('/planColor/:plan_app_acronym/:plan_mvp_name', protect, getPlanColorByAppAndPlan)

module.exports = router