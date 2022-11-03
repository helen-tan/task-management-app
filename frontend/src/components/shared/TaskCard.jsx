import { useState, useEffect } from "react"
import Axios from "axios"
import { MdArrowLeft, MdArrowRight } from "react-icons/md" 
import { toast } from "react-toastify"

function TaskCard(props) {
    const [planColor, setPlanColor] = useState("#FFF")

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    const getPlanColor = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/plans/planColor/${props.task.task_app_acronym}/${props.task.task_plan}`, config)
            if (response.data) {
                // console.log(response.data.data[0].plan_color)
                setPlanColor(response.data.data[0].plan_color)
            }
        } catch (err) {
            console.log("There was a problem")
        }
    }

    const updateTaskState = async (updated_task_state) => {
        // Send put request to update a task's task_state
        try {
            const response = await Axios.put(`http://localhost:5000/api/tasks/${props.task.task_id}/updateState`, { task_state: updated_task_state }, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
                   
                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
            toast.error("There was a problem")
        }

    }

    useEffect(() => {
        // Get plan_color from plans, based on the task's task_plan
        if (props.task.task_plan !== "") {
            getPlanColor()
        }
    }, [])

    const promoteProgress = (task_state) => {
        // Check the current task_state
        // Change the task_state to the one after it
        // - if closed, don't do anything to the task_state - remain as "closed"
        if (task_state === "open") {
            updateTaskState("todo")
            props.setTaskUpdateCount(prevState => prevState + 1)
        } else if (task_state === "todo") {
            updateTaskState("doing")
            props.setTaskUpdateCount(prevState => prevState + 1)
        } else if (task_state === "doing") {
            updateTaskState("done")
            props.setTaskUpdateCount(prevState => prevState + 1)
        } else if (task_state === "done") {
            updateTaskState("closed")
            props.setTaskUpdateCount(prevState => prevState + 1)
        } else if (task_state === "closed") {
            toast.warning("The task is closed")
        }
    }

    const demoteProgress = (task_state) => {
        // Check the current task_state
        // - if open, don't do anything to the task_state
        // Change the task_state to the one before it
        if (task_state === "open") {
            toast.warning("This task cannot be demoted")
        } else if (task_state === "todo") {
            updateTaskState("open")
            props.setTaskUpdateCount(prevState => prevState + 1)
        } else if (task_state === "doing") {
            updateTaskState("todo")
            props.setTaskUpdateCount(prevState => prevState + 1)
        } else if (task_state === "done") {
            updateTaskState("doing")
            props.setTaskUpdateCount(prevState => prevState + 1)
        } else if (task_state === "closed") {
            updateTaskState("done")
            props.setTaskUpdateCount(prevState => prevState + 1)
        }

    }

    return (
        <div className="card-shadow rounded bg-white mx-auto mt-2 w-11/12 p-2" style={{
            borderLeft: `5px solid ${planColor}`
        }}>
            <div className="flex flex-col items-center md:flex-row justify-between gap-2 p-1">
                <div className="small-text text-gray-500">{props.task.task_id}</div>
                <div className="flex text-2xl">
                    {(props.task.task_state !== "open") && (
                        <button onClick={() => demoteProgress(props.task.task_state)}>
                            <MdArrowLeft />
                        </button>
                    )}
                    {(props.task.task_state !== "closed") && (
                        <button onClick={() => promoteProgress(props.task.task_state)}>
                            <MdArrowRight />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-start p-1 mb-2">
                <div className="text-xs font-bold mb-1">{props.task.task_name}</div>
                <div className="small-text text-gray-500">Owner: {props.task.task_owner}</div>
            </div>
            <div className="bg-gray-700 h-px mb-2"></div>
            <div className="flex flex-col md:flex-row justify-end gap-2 p-1">
                <button className="btn btn-outline text-xs btn-xs">
                    View
                </button>
                <button className="btn btn-black text-xs btn-xs">
                    Edit
                </button>
            </div>
        </div>
    )
}

export default TaskCard