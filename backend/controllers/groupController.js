const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create a group
// @route   /api/groups
// @access  Private
const createGroup = catchAsyncErrors(async (req, res) => {
    const { group_name } = req.body

    // Validation - Check for empty input
    if (!group_name) {
        return res.status(400).send({
            success: false,
            message: 'Please enter a group name'
        })
    }

    // Validation - Regex to validate user input
    const group_nameRegexp = /^[a-z]{2,}$/   // only alphabets, no numbers, no special chars

    if (!group_name.match(group_nameRegexp)) {
        res.status(400).send({
            success: false,
            message: "Please use only alphabets, with a minimum of 2 characters"
        })
    }

    let sql = `insert into groupz (group_name) values ('${group_name}')`

    new_group = { group_name }

    db.query(sql, (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: 'Group created successfully',
                data: new_group,
            })
            console.log(new_group)
        }
    })
})

module.exports = {
    createGroup
}