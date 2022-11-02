const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create a task
// @route   /api/tasks
// @access  Private
const createTask = catchAsyncErrors(async(req, res) => {
    res.send("Hello from the create task route")
})


module.exports = {
    createTask
}