const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create a group
// @route   /api/groups
// @access  Private
const createGroup = catchAsyncErrors(async (req, res) => {
    const { group_name } = req.body

    // Validation - Check for empty input
    if (group_name.length < 1) {
        return res.status(200).send({
            success: false,
            message: 'Please enter a group name'
        })
    }

    // Validation - Regex to validate user input
    const group_nameRegexp = /^[a-zA-Z_]{2,}$/   // only alphabets, no numbers, no special chars, underscores ok

    if (!group_name.match(group_nameRegexp)) {
        return res.status(200).send({
            success: false,
            message: "Group names can only have alphabets with no spaces, with a minimum of 2 characters"
        })
    }

    new_group = { group_name }

    db.query('insert into groupz (group_name) values (?)', [group_name], (err, results) => {
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

// @desc    Check if user is in a group
// @route   /api/groups/checkGroup
// @access  Private
const checkGroup = catchAsyncErrors(async (req, res) => {
    const { username, group_name } = req.body

    // get user from the db using unique username, and get his/her groups
    let user_groups // E.g. ['dev', 'qa']
    let inGroup = false

    db.query('select * from users where username = ?', [username], (err, results) => {
        if (err) {
            return res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            user_groups = results[0].groupz
            // check if the array contains group_name
            inGroup = user_groups.includes(group_name)

            // Send the response
            if (inGroup) {
                return res.status(200).send({
                    success: true,
                    inGroup: true,
                    message: `This user '${username}' is in the group '${group_name}'`
                })
            } else {
                return res.status(200).send({
                    success: true,
                    inGroup: false,
                    message: `This user '${username}' is NOT in the group '${group_name}'`
                })
            }
        }
    })
})


// @desc    Get all groups
// @route   /api/groups
// @access  Private
const getAllGroups = catchAsyncErrors(async (req, res) => {
    let sql = 'select * from groupz'

    db.query(sql, (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(200).send({
                success: true,
                count: results.length,
                data: results
            })
        }

    })
})

// @desc    Check if user is in a group
// @route   /api/groups/:username
// @access  Private
const getUserGroups = catchAsyncErrors(async (req, res) => {
    // Get username from the params
    const username = req.params.username

    db.query(`select groupz from users where username = ?`, [username], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(200).send({
                success: true,
                count: results.length,
                data: results
            })
        }
    })
})

module.exports = {
    createGroup,
    checkGroup,
    getAllGroups,
    getUserGroups
}