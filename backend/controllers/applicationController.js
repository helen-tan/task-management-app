const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create an application
// @route   /api/applications
// @access  Private
const createApplication = catchAsyncErrors(async(req, res) => {
 res.send("Hello from the createApplication route!")
})

module.exports = {
    createApplication
}