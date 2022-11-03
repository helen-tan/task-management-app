import { useState, useEffect } from "react"
import Axios from "axios"
import { MdArrowLeft, MdArrowRight } from "react-icons/md" 

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

    useEffect(() => {
        // Get plan_color from plans, based on the task's task_plan
        if (props.task.task_plan !== "") {
            getPlanColor()
        }
    }, [])

    return (
        <div className="card-shadow rounded bg-white mx-auto mt-2 w-11/12 p-2" style={{
            borderLeft: `5px solid ${planColor}`
        }}>
            <div className="flex flex-col items-center md:flex-row justify-between gap-2 p-1">
                <div className="small-text text-gray-500">{props.task.task_id}</div>
                <div className="flex text-2xl">
                    <MdArrowLeft />
                    <MdArrowRight />
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