const express = require('express')
const { getAllPlansByApp } = require('../controllers/planController')
const router = express.Router()
const { createTask, getAllTasksByApp } = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware')

router.post('/:app_acronym', protect, createTask)
router.get('/:app_acronym', protect, getAllPlansByApp)

module.exports = router