const db = require('../config/database')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// @desc    Create a task
// @route   /api//tasks/:app_acronym
// @access  Private
const createTask = catchAsyncErrors(async (req, res) => {
    // Upon creation, user (project lead) cannot/don't need to provide: 
    // task_id, task_app_acronym
    // task_plan Can't be assigned yet. Only user of group in app_permit_create can. Default to be ""
    // task_notes - to be seen in view, and added to when task is first created
    // task_state - open by default
    // task_owner - by deafult the user who created
    const {
        task_name,
        task_description
    } = req.body

    // Get app_acronym (app identifier) of app of interest (from the params)
    const task_app_acronym = req.params.app_acronym

    // Get existing task_ids of tasks in the app
    let tasksArr = await getAppTaskIds(task_app_acronym) //  [ { task_id: 'NewTestApp_57' }, { task_id: 'NewTestApp_58' } ]
    //console.log(tasksArr)

    let taskIdRnumArr = []
    tasksArr.forEach((task) => {
        taskIdRnumArr.push(parseInt(task.task_id.split("_")[1]))
    })
    //console.log(taskIdRnumArr)

    let r_num
    if (taskIdRnumArr.length < 1) {
        // Get r_number of app with helper method
        r_num = await getRnumber(task_app_acronym)
        // console.log(r_num)
    } else {
        r_num = Math.max(...taskIdRnumArr) + 1 // Increment the Rnumber based on the largest exisitng one
    }

    // Construct task_id: <app_acronym>_<app_rnumber>
    let task_id = `${task_app_acronym}_${r_num}`;

    // task_creator is the loggedInUser (from unique username in jwt token authMiddleware)
    const loggedInUser = req.username

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let hours = today.getHours()
    let mins = today.getMinutes()
    let seconds = today.getSeconds()

    today = yyyy + '-' + mm + '-' + dd;

    // Validation: Regex to validate user input
    const task_nameRegexp = /^(?! )[A-Za-z0-9._\s]{2,20}(?<! )$/          // only alphanumeric, dots, underscores, spaces in between, no leading & trailing spaces, min 2 mx 20 chars

    if (!task_name.match(task_nameRegexp)) {
        return res.status(200).send({
            success: false,
            message: 'Please give a valid task name'
        })
    }

    let task_notes = `${loggedInUser} has created the task: ${task_name} [${today} ${hours}:${mins}:${seconds}]`
    let task_plan = "" // At task creation, there will be no plan
    let task_state = "open"
    let task_creator = loggedInUser
    let task_owner = loggedInUser
    let task_createdate = today

    let new_task = {
        task_id,
        task_name,
        task_description,
        task_notes,
        task_plan,
        task_app_acronym,
        task_state,
        task_creator,
        task_owner,
        task_createdate
    }

    db.query(`insert into tasks (
        task_id,
        task_name,
        task_description,
        task_notes,
        task_plan,
        task_app_acronym,
        task_state,
        task_creator,
        task_owner,
        task_createdate
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
        task_id,
        task_name,
        task_description,
        task_notes,
        task_plan,
        task_app_acronym,
        task_state,
        task_creator,
        task_owner,
        task_createdate
    ], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: 'Task created successfully',
                data: new_task,
            })
            console.log(new_task)
        }
    })
})

// Helper method to return R_number of application
const getRnumber = (app_acronym) => {
    return new Promise((resolve, reject) => {
        db.query('select app_rnumber from applications where app_acronym = ?', [app_acronym], (err, results) => {
            if (err) {
                reject(false)
            } else {
                try {
                    resolve(results[0].app_rnumber)
                } catch (err) {
                    reject(false)
                }
            }
        })
    })
}

// Helper method to return the task_ids of an application
const getAppTaskIds = (app_acronym) => {
    return new Promise((resolve, reject) => {
        db.query('select task_id from tasks where task_app_acronym = ?', [app_acronym], (err, results) => {
            if (err) {
                reject(false)
            } else {
                try {
                    resolve(results)
                } catch (err) {
                    reject(false)
                }
            }
        })
    })
}


// @desc    Get all tasks specific to an application
// @route   /api/tasks/:app_acronym
// @access  Private
const getAllTasksByApp = catchAsyncErrors(async (req, res) => {
    // Get app_acronym (app identifier) of app of interest (from the params)
    const task_app_acronym = req.params.app_acronym

    db.query(`select * from tasks where task_app_acronym = ?`, [task_app_acronym], (err, results) => {
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

// @desc    Get task specific to an application, by task_id
// @route   /api/tasks/:task_app_acronym/:task_id
// @access  Private
const getOneTask = catchAsyncErrors(async (req, res) => {
    // Get app_acronym (app identifier) of app of interest (from the params)
    const task_app_acronym = req.params.task_app_acronym
    // Get task_id (task identifier) of task (from the params)
    const task_id = req.params.task_id

    db.query(`select * from tasks 
        where task_app_acronym = ?
        and task_id = ?`
        , [task_app_acronym, task_id], (err, results) => {
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

// @desc    Promote Task's State (identified by unique task_id) - Also updates the task_owner to the logged in user
// @route   /api/tasks/:task_id/promoteState
// @access  Private
const promoteTaskState = catchAsyncErrors(async (req, res) => {
    // Get task_id (task identifier) of task (from the params)
    const task_id = req.params.task_id

    // task_owner must be changed to the last user to interact with the task
    // which is the loggedInUser (from unique username in jwt token authMiddleware) who updated the task state 
    const loggedInUser = req.username
    const task_owner = loggedInUser

    // User inputs
    //const { task_state } = req.body

    // Get existing task_notes of the task to append the new_note to the string of task_notes
    const response1 = await getAppTaskNotes(task_id)
    const existing_notes = response1[0].task_notes

    // Get current state of task
    const response2 = await getAppTaskState(task_id)
    const current_state = response2[0].task_state

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let hours = today.getHours()
    let mins = today.getMinutes()
    let seconds = today.getSeconds()

    today = yyyy + '-' + mm + '-' + dd;

    // Determine updated state + Construct string for new note
    let new_state = "" 
    let new_note = ""
    if (current_state === "open") {
        new_state = "todo"
        new_note = `, ${loggedInUser} has promoted the task from "Open" to "Todo" [${today} ${hours}:${mins}:${seconds}]`
    } else if (current_state === "todo") {
        new_state = "doing"
        new_note = `, ${loggedInUser} has promoted the task from "Todo" to "Doing" [${today} ${hours}:${mins}:${seconds}]`
    } else if (current_state === "doing") {
        new_state = "done"
        new_note = `, ${loggedInUser} has promoted the task from "Doing" to "Done" [${today} ${hours}:${mins}:${seconds}]`
    } else if (current_state === "done") {
        new_state = "closed"
        new_note = `, ${loggedInUser} has promoted the task from "Done" to "Closed" [${today} ${hours}:${mins}:${seconds}]`
    }

    // Append new string to current notes
    const updated_task_notes = existing_notes + new_note

    db.query(`UPDATE tasks 
        SET task_state = ?, task_owner = ?, task_notes = ?
        WHERE task_id = ?`, [new_state, task_owner, updated_task_notes, task_id], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: `The task of task_id "${task_id}" was promoted to "${new_state}"`,
                data: {
                    task_id: task_id,
                    task_state: new_state,
                    task_owner: task_owner,
                    task_notes: updated_task_notes
                },
            })
        }
    })
})

// @desc    Demote Task's State (identified by unique task_id) - Also updates the task_owner to the logged in user
// @route   /api/tasks/:task_id/promoteState
// @access  Private
const demoteTaskState = catchAsyncErrors(async (req, res) => {
    // Get task_id (task identifier) of task (from the params)
    const task_id = req.params.task_id

    // task_owner must be changed to the last user to interact with the task
    // which is the loggedInUser (from unique username in jwt token authMiddleware) who updated the task state 
    const loggedInUser = req.username
    const task_owner = loggedInUser

    // User inputs
    //const { task_state } = req.body

    // Get existing task_notes of the task to append the new_note to the string of task_notes
    const response1 = await getAppTaskNotes(task_id)
    const existing_notes = response1[0].task_notes

    // Get current state of task
    const response2 = await getAppTaskState(task_id)
    const current_state = response2[0].task_state

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let hours = today.getHours()
    let mins = today.getMinutes()
    let seconds = today.getSeconds()

    today = yyyy + '-' + mm + '-' + dd;

    // Determine updated state + Construct string for new note
    let new_state = "" 
    let new_note = ""
    if (current_state === "closed") {
        new_state = "done"
        new_note = `, ${loggedInUser} has demoted the task from "Closed" to "Done" [${today} ${hours}:${mins}:${seconds}]`
    } else if (current_state === "done") {
        new_state = "doing"
        new_note = `, ${loggedInUser} has demoted the task from "Done" to "Doing" [${today} ${hours}:${mins}:${seconds}]`
    } else if (current_state === "doing") {
        new_state = "todo"
        new_note = `, ${loggedInUser} has demoted the task from "Doing" to "Todo" [${today} ${hours}:${mins}:${seconds}]`
    } else if (current_state === "todo") {
        new_state = "open"
        new_note = `, ${loggedInUser} has demoted the task from "Todo" to "Open" [${today} ${hours}:${mins}:${seconds}]`
    }

    // Append new string to current notes
    const updated_task_notes = existing_notes + new_note

    db.query(`UPDATE tasks 
        SET task_state = ?, task_owner = ?, task_notes = ?
        WHERE task_id = ?`, [new_state, task_owner, updated_task_notes, task_id], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: `The task of task_id "${task_id}" was demoted to "${new_state}"`,
                data: {
                    task_id: task_id,
                    task_state: new_state,
                    task_owner: task_owner,
                    task_notes: updated_task_notes
                },
            })
        }
    })
})

// @desc    Update Task's Notes (identified by unique task_id) - Also updates the task_owner to the logged in user
// @route   /api/tasks/:task_id/updateNotes
// @access  Private
const updateTaskNotes = catchAsyncErrors(async (req, res) => {
    // Get task_id (task identifier) of task (from the params)
    const task_id = req.params.task_id

    // task_owner must be changed to the last user to interact with the task
    // which is the loggedInUser (from unique username in jwt token authMiddleware) who updated the task state 
    const loggedInUser = req.username
    const task_owner = loggedInUser

    // User inputs
    const { new_note_input } = req.body

    // Get existing task_notes of the task and append the new_note to the string of task_notes
    const response = await getAppTaskNotes(task_id)
    const existing_notes = response[0].task_notes

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let hours = today.getHours()
    let mins = today.getMinutes()
    let seconds = today.getSeconds()

    today = yyyy + '-' + mm + '-' + dd;

    // Construct string for new note
    const new_note = `, ${loggedInUser}: ${new_note_input} [${today} ${hours}:${mins}:${seconds}]`
    // Append new string to current notes
    const updated_task_notes = existing_notes + new_note

    db.query(`UPDATE tasks 
        SET task_notes = ?, task_owner = ?
        WHERE task_id = ?`, [updated_task_notes, task_owner, task_id], (err, results) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.code
            })
        } else {
            res.status(201).send({
                success: true,
                message: `Note successfully added`,
                data: {
                    task_id: task_id,
                    task_notes: updated_task_notes,
                    task_owner: task_owner
                }
            })
        }
    })
})

// Helper method to return the task_notes of a task of an App
const getAppTaskNotes = (task_id) => {
    return new Promise((resolve, reject) => {
        db.query('select task_notes from tasks where task_id = ?', [task_id], (err, results) => {
            if (err) {
                reject(false)
            } else {
                try {
                    resolve(results)
                } catch (err) {
                    reject(false)
                }
            }
        })
    })
}

// Helper method to return the task_state of a task of an App
const getAppTaskState = (task_id) => {
    return new Promise((resolve, reject) => {
        db.query('select task_state from tasks where task_id = ?', [task_id], (err, results) => {
            if (err) {
                reject(false)
            } else {
                try {
                    resolve(results)
                } catch (err) {
                    reject(false)
                }
            }
        })
    })
}



module.exports = {
    createTask,
    getAllTasksByApp,
    getOneTask,
    promoteTaskState,
    demoteTaskState,
    updateTaskNotes
}