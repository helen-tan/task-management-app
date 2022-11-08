import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import SideMenu from "../shared/SideMenu"
import BackLink from "../utils/BackLink"
import Axios from "axios"
import Spinner from "../utils/Spinner"
import TaskCard from "../shared/TaskCard"

function Kanban() {
    const [loggedInUser, setLoggedInUser] = useState("")
    const [loadingAppData, setLoadingAppData] = useState(true)
    const [loadingTasksData, setLoadingTasksData] = useState(true)
    const [taskUpdateCount, setTaskUpdateCount] = useState(0)
    const [newTaskCount, setNewTaskCount] = useState(0)
    const [app, setApp] = useState({})
    const [plans, setPlans] = useState([])
    const [tasks, setTasks] = useState([])
    const { app_acronym, app_rnumber, app_startdate, app_enddate } = app // Destructure some values returned and stored in 'app'

    const params = useParams()
    const navigate = useNavigate()

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }
    // Send request to get identity of logged in user
    async function authenticate() {
        try {
            const response = await Axios.get(`http://localhost:5000/api/users/authuser`, config)
            if (response.data) {
                setLoggedInUser(response.data.loggedInUser)

                console.log(response.data)
            }
        } catch (err) {
            console.log("There was a problem")
            console.log(err)
            navigate('/dashboard')
        }
    }

    const fetchAppData = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/applications/${params.app_acronym}`, config)
            if (response.data) {
                // console.log(response.data)
                // console.log(response.data.data[0])
                setApp(response.data.data[0])
                setLoadingAppData(false)
            }

        } catch (err) {
            console.log("There was a problem")
        }
    }

    const fetchTasks = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/tasks/${params.app_acronym}`, config)
            if (response.data) {
                console.log(response.data.data)
                setTasks(response.data.data)
                setLoadingTasksData(false)
            }

        } catch (err) {
            console.log("There was a problem")
        }
    }

    useEffect(() => {
        authenticate()
        // Fetch application details (to display app name & use selected details - r_number)
        // Fetch all tasks associated with the application
        fetchAppData()
        fetchTasks()
    }, [taskUpdateCount, newTaskCount])

    if (loadingAppData && loadingTasksData) {
        return <Spinner />
    } else {
        return (
            <div className="flex justify-between h-screen">
                <SideMenu
                    app_acronym={app_acronym}
                    setNewTaskCount={setNewTaskCount}
                    plans={plans}
                    setPlans={setPlans}
                />

                <div className="grow columns-bg">
                    {/* Kanban board header */}
                    <div className="flex justify-between items-center bg-white pl-10 pr-40 pt-8 pb-4 text-start">
                        <div>
                            <BackLink url='/dashboard' />
                            <h1 className="font-bold text-xl mb-2 mt-6">{app_acronym}</h1>
                            <div className="text-sm mb-4"><span className="font-medium">R Number - </span>{app_rnumber}</div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="text-sm"><span className="font-semibold">Start Date: </span>{app_startdate.split("T")[0]}</div>
                            <div className="text-sm"><span className="font-semibold">End Date: </span>{app_enddate.split("T")[0]}</div>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-5 grid-flow-col px-5 pt-5 gap-2">
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Open</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Todo</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Doing</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Done</div>
                        <div className="border border-slate-300 rounded text-start pl-5 py-1 font-semibold">Closed</div>
                    </div>

                    <div className="grid grid-cols-5 grid-flow-col px-5 pt-2 gap-2 h-80">
                        {/* Open */}
                        <div className="border border-slate-300 rounded overflow-y-auto">
                            {tasks.map((task) => {
                                if (task.task_state === "open") {
                                    return <TaskCard
                                        key={task.task_id}
                                        task={task}
                                        taskUpdateCount={taskUpdateCount}
                                        setTaskUpdateCount={setTaskUpdateCount}
                                        loggedInUser={loggedInUser}
                                        plans={plans} />
                                }
                            })}
                        </div>

                        {/* Todo */}
                        <div className="border border-slate-300 rounded overflow-y-auto">
                            {tasks.map((task) => {
                                if (task.task_state === "todo") {
                                    return <TaskCard
                                        key={task.task_id}
                                        task={task}
                                        taskUpdateCount={taskUpdateCount}
                                        setTaskUpdateCount={setTaskUpdateCount}
                                        loggedInUser={loggedInUser} 
                                        plans={plans}/>
                                }
                            })}
                        </div>

                        {/* Doing */}
                        <div className="border border-slate-300 rounded overflow-y-auto">
                            {tasks.map((task) => {
                                if (task.task_state === "doing") {
                                    return <TaskCard
                                        key={task.task_id}
                                        task={task}
                                        taskUpdateCount={taskUpdateCount}
                                        setTaskUpdateCount={setTaskUpdateCount}
                                        loggedInUser={loggedInUser} />
                                }
                            })}
                        </div>

                        {/* Done */}
                        <div className="border border-slate-300 rounded overflow-y-auto">
                            {tasks.map((task) => {
                                if (task.task_state === "done") {
                                    return <TaskCard
                                        key={task.task_id}
                                        task={task}
                                        taskUpdateCount={taskUpdateCount}
                                        setTaskUpdateCount={setTaskUpdateCount}
                                        loggedInUser={loggedInUser} 
                                        plans={plans}/>
                                }
                            })}
                        </div>

                        {/* Closed */}
                        <div className="border border-slate-300 rounded overflow-y-auto">
                            {tasks.map((task) => {
                                if (task.task_state === "closed") {
                                    return <TaskCard
                                        key={task.task_id}
                                        task={task}
                                        taskUpdateCount={taskUpdateCount}
                                        setTaskUpdateCount={setTaskUpdateCount}
                                        loggedInUser={loggedInUser} 
                                        plans={plans}/>
                                }
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Kanban