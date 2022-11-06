const express = require('express')
const { getAllPlansByApp } = require('../controllers/planController')
const router = express.Router()
const { createTask, getAllTasksByApp, getOneTask, updateTaskState, updateTaskNotes, updateTaskStatePromoteNotes } = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware')

router.post('/:app_acronym', protect, createTask)
router.get('/:app_acronym', protect, getAllTasksByApp)
router.get('/:task_app_acronym/:task_id', protect, getOneTask)
router.put('/:task_id/updateState', protect, updateTaskState)
router.put('/:task_id/updateNotes', protect, updateTaskNotes)
router.put('/:task_id/updateStateNotes', protect, updateTaskStatePromoteNotes)

module.exports = router