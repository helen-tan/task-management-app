const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create a plan
// @route   /api/plans
// @access  Private
const createPlan = catchAsyncErrors(async (req, res) => {
    let {
        plan_mvp_name,
        plan_startdate,
        plan_enddate,
        plan_app_acronym,
        plan_color
    } = req.body

    // plan_color to be white (#FFF) if there is no input from the user
    if (plan_color === "") plan_color = '#FFF'

    // Validation: Regex to validate user input
    const plan_mvp_nameRegexp = /^[a-zA-Z0-9_.]{2,20}$/          // only alphanumeric, dots, underscores, no spaces, min 2 mx 20 chars
    const plan_app_acronymRegexp = /^[a-zA-Z0-9]{2,20}$/         // only alphanumeric, no special chars, no spaces, min 2 max 20 chars

    if (!plan_app_acronym.match(plan_app_acronymRegexp)) {
        return res.status(200).send({
            success: false,
            message: 'Please give a valid application name (only letters & numbers. No spaces)'
        })
    }
    if (!plan_mvp_nameRegexp.test(plan_mvp_name)) {
        return res.status(200).send({
            success: false,
            message: 'The plan name must be between 2-20 characters and contain only letters, numbers, dots (.), underscores(_).'
        })
    }

    let new_plan = {
        plan_mvp_name,
        plan_startdate,
        plan_enddate,
        plan_app_acronym,
        plan_color
    }

    db.query(`insert into plans (
        plan_mvp_name,
        plan_startdate,
        plan_enddate,
        plan_app_acronym,
        plan_color
    ) values (?, ?, ?, ?, ?)`, [
        plan_mvp_name,
        plan_startdate,
        plan_enddate,
        plan_app_acronym,
        plan_color
    ], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: 'Plan created successfully',
                data: new_plan,
            })
            console.log(new_plan)
        }
    })
})

// @desc    Get all plans (by their app - plan_app_acronym)
// @route   /api/plans/:app_acronym
// @access  Private
const getAllPlansByApp = catchAsyncErrors(async (req, res) => {
    // Get app_acronym (app identifier) of app of interest (from the params)
    const plan_app_acronym = req.params.app_acronym

    db.query(`select * from plans where plan_app_acronym = ?`, [plan_app_acronym], (err, results) => {
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

// @desc    Get plan color by plan_mvp_name (task_plan in tasks table) & plan_app_acronym
// @route   /api/plans/planColor/:plan_app_acronym/:plan_mvp_name
// @access  Private
const getPlanColorByAppAndPlan = catchAsyncErrors(async (req, res) => {
    // Get app_acronym (app identifier) of app of interest (from the params)
    const plan_app_acronym = req.params.plan_app_acronym
    const plan_mvp_name = req.params.plan_mvp_name

    db.query(`select plan_color from plans 
        where plan_app_acronym = ?
        and plan_mvp_name = ?`
        , [plan_app_acronym, plan_mvp_name]
        , (err, results) => {
            if (err) {
                res.status(400).send({
                    success: false,
                    message: err.code
                })
            } else {
                res.status(200).send({
                    success: true,
                    data: results
                })
            }
        })
})

module.exports = {
    createPlan,
    getAllPlansByApp,
    getPlanColorByAppAndPlan
}