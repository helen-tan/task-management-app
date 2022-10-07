const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create a group
// @route   /api/groups
// @access  Private
const createGroup = catchAsyncErrors(async (req, res) => {
    res.status(200).send({
        success: true,
        message: 'This connects'
    })
})


module.exports = {
    createGroup
}