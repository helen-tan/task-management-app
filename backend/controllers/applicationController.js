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
    const app_acronymRegexp = /^[a-zA-Z0-9]{2,20}$/             // only alphanumeric, no special chars, no spaces, min 2 max 20 chars
    const app_rnumberRegexp = /^([1-9][0-9]{0,3}|10000)$/  // Min 0, Max 10,000, no decimals, no negatives

    if (!app_acronym.match(app_acronymRegexp)) {
        return res.status(200).send({
            success: false,
            message: 'Please give a valid app acronym (only letters & numbers. No spaces)'
        })
    }

    if(!app_rnumber.match(app_rnumberRegexp)) {
        return res.status(200).send({
            success: false,
            message: 'R number must be a number between 0 - 10,000'
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

// @desc    Get all applications
// @route   /api/applications
// @access  Private
const getAllApplications= catchAsyncErrors((req, res) => {
    let sql = 'select * from applications'

    db.query(sql, (err, results) => {
        if (err) {
            //res.status(400)
            //throw new Error('Could not get all users')
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

// @desc    Update application
// @route   /api/applications/:app_acronym/updateApplication
// @access  Private
const updateApplication = catchAsyncErrors((req,res) => {
    // Get app_acronym (app identifier) to be edited (from the params)
    const app_acronym = req.params.app_acronym
    console.log(app_acronym)
    // User inputs. Note: app_acronym, app_rnumber cannot be changed
    const {
        app_description,
        app_startdate,
        app_enddate,
        app_permit_create,
        app_permit_open,
        app_permit_todolist,
        app_permit_doing,
        app_permit_done
    } = req.body

    // If empty fields were sent
    if (app_description.length < 1 && app_startdate.length < 1 && app_enddate.length < 1 && app_permit_create.length < 1 && 
        app_permit_open.length < 1 && app_permit_todolist.length < 1 && app_permit_doing.length < 1 && app_permit_done.length < 1) {
        console.log("In empty fields were sent")
        return res.status(200).send({
            success: false,
            message: 'No changes were detected'
        })
    }

    updated_app = {
        app_acronym,
        app_description,
        app_startdate,
        app_enddate,
        app_permit_create,
        app_permit_open,
        app_permit_todolist,
        app_permit_doing,
        app_permit_done
    }
    
    db.query(`UPDATE applications 
        SET app_description = ?, app_startdate = ?, app_enddate = ?, app_permit_create = ?, 
        app_permit_open = ?, app_permit_todolist = ?, app_permit_doing = ?, app_permit_done = ?
        WHERE app_acronym = ?`, [
        app_description,
        app_startdate,
        app_enddate,
        app_permit_create,
        app_permit_open,
        app_permit_todolist,
        app_permit_doing,
        app_permit_done,
        app_acronym
    ], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: 'Application updated successfully',
                data: updated_app,
            })
            console.log(updated_app)
        }
    })
})

module.exports = {
    createApplication,
    getAllApplications,
    updateApplication
}