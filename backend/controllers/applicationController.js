const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create an application
// @route   /api/applications
// @access  Private
const createApplication = catchAsyncErrors(async(req, res) => {
    const {
        app_acronym,
        app_description,
        app_rnumber,
        app_startdate,
        app_enddate,
        app_permit_create,
        app_permit_open,
        app_permit_todolist,
        app_permit_doing,
        app_permit_done
    } = req.body

    // Validation: Regex to validate user input
    const app_acronymRegexp = /^[a-zA-Z0-9]$/          // only alphanumeric, no special chars, no spaces

    if (!app_acronym.match(app_acronymRegexp)) {
        return res.status(200).send({
            success: false,
            message: 'Please give a valid app acronym (only letters & numbers. No spaces)'
        })
    }

    new_application = {
        app_acronym,
        app_description,
        app_rnumber,
        app_startdate,
        app_enddate,
        app_permit_create,
        app_permit_open,
        app_permit_todolist,
        app_permit_doing,
        app_permit_done
    }

    db.query(`insert into applications (
        app_acronym, 
        app_description, 
        app_rnumber, 
        app_startdate, 
        app_enddate, 
        app_permit_create, 
        app_permit_open, 
        app_permit_todolist, 
        app_permit_doing, 
        app_permit_done
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        app_acronym,
        app_description,
        app_rnumber,
        app_startdate,
        app_enddate,
        app_permit_create,
        app_permit_open,
        app_permit_todolist,
        app_permit_doing,
        app_permit_done
    ], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: 'Application created successfully',
                data: new_application,
            })
            console.log(new_application)
        }
    })
})

// @desc    Update application
// @route   /api/applications/:app_acronym/updateApplication
// @access  Private
const updateApplication = catchAsyncErrors((req,res) => {
    res.send("Hello from updateApplication")
})

module.exports = {
    createApplication,
    updateApplication
}