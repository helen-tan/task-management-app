const express = require('express')
const { getAllPlansByApp } = require('../controllers/planController')
const router = express.Router()
const { createTask, getAllTasksByApp, getOneTask, promoteTaskState, demoteTaskState, updateTaskNotes, updateTask } = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware')

router.post('/:app_acronym', protect, createTask)
router.get('/:app_acronym', protect, getAllTasksByApp)
router.get('/:task_app_acronym/:task_id', protect, getOneTask)
router.put('/:task_id/promoteState', protect, promoteTaskState)
router.put('/:task_id/demoteState', protect, demoteTaskState)
router.put('/:task_id/updateNotes', protect, updateTaskNotes)
router.put('/:task_id/updateTask', protect, updateTask)

module.exports = router