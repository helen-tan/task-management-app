import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import Axios from "axios"
import Modal from 'react-modal'
import { BsPlusLg } from "react-icons/bs"
import { SliderPicker } from 'react-color'

function SideMenu(props) {
    const [plans, setPlans] = useState([])
    const [newPlanCount, setNewPlanCount] = useState(0)
    const [loading, setLoading] = useState(true)

    // Modal states
    const [createPlanModalIsOpen, setCreatePlanModalIsOpen] = useState(false)
    const [viewPlanModalIsOpen, setViewPlanModalIsOpen] = useState(false)
    const [planToView, setPlanToView] = useState({})
    const [createTaskModalIsOpen, setCreateTaskModalIsOpen] = useState(false)

    // Create Plan form inputs
    const [createPlanNameInput, setCreatePlanNameInput] = useState("")
    const [createPlanStartdateInput, setCreatePlanStartdateInput] = useState("")
    const [createPlanEnddateInput, setCreatePlanEnddateInput] = useState("")
    const [createPlanColorInput, setCreatePlanColorInput] = useState("")

    // Create Task form inputs
    const [createTaskNameInput, setCreateTaskNameInput] = useState("")
    const [createTaskDescriptionInput, setCreateTaskDescriptionInput] = useState("")

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    const fetchAllPlans = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/plans/${props.app_acronym}`, config)
            if (response.data) {
                setPlans(response.data.data)
                setLoading(false)
                //console.log(response.data.data)
            }
        } catch (err) {
            console.log("There was a problem")
        }
    }

    useEffect(() => {
        // Fetch all existing plans of an application
        fetchAllPlans()
    }, [newPlanCount])

    // Modal: Create New Plan
    Modal.setAppElement('#root');

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            // height: '90vh',
            borderRadius: ".5em",
            overflowY: "auto",
        },
        overlay: {
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.5)",
            //overflowY: "auto"
        }
    };

    const openCreatePlanModal = () => setCreatePlanModalIsOpen(true)
    const closeCreatePlanModal = () => setCreatePlanModalIsOpen(false)

    const handlePlanCreateSubmit = async (e) => {
        e.preventDefault()

        const new_plan = {
            plan_mvp_name: createPlanNameInput,
            plan_startdate: createPlanStartdateInput,
            plan_enddate: createPlanEnddateInput,
            plan_app_acronym: props.app_acronym,
            plan_color: createPlanColorInput
        }

        // Send post request to create new plan
        try {
            const response = await Axios.post(`http://localhost:5000/api/plans`, new_plan, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    // clear user input
                    setCreatePlanNameInput("")
                    setCreatePlanStartdateInput("")
                    setCreatePlanEnddateInput("")
                    setCreatePlanColorInput("")

                    // increment count state (to induce re render of Plan list to include new Plan instantly)
                    setNewPlanCount(prevState => prevState + 1)
                    //console.log(new_plan)
                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
            if (err.response.data.message === "ER_DUP_ENTRY") {
                toast.warning("This plan name already exists")
            } else {
                toast.error("There was a problem")
            }
        }
    }

    // Modal: View Plan
    const openViewPlanModal = (plan) => {
        setViewPlanModalIsOpen(true)
        setPlanToView(plan)
        console.log(plan)
    }

    const closeViewPlanModal = () => {
        setViewPlanModalIsOpen(false)
        setPlanToView({})
    }

    // Modal: Create Task
    const openCreateTaskModal = (plan) => setCreateTaskModalIsOpen(true)
    const closeCreateTaskModal = (plan) => setCreateTaskModalIsOpen(false)

    const handleTaskCreateSubmit = async (e) => {
        e.preventDefault()

        const new_task = {
            task_name: createTaskNameInput,
            task_description: createTaskDescriptionInput,
        }

        // Send post request to create new task
        try {
            const response = await Axios.post(`http://localhost:5000/api/tasks/${props.app_acronym}`, new_task, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
                    // clear user input
                    setCreateTaskNameInput("")
                    setCreateTaskDescriptionInput("")

                    // increment count state (to induce re render of Plan list to include new Plan instantly)
                    //setNewPlanCount(prevState => prevState + 1)
                    //console.log(new_plan)
                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="bg-customBlack text-white w-1/5 p-4">
            {/* Create Task button */}
            <button onClick={openCreateTaskModal} className="btn bg-emerald-500 btn-sm hover:bg-emerald-700 text-white gap-2">
                <BsPlusLg /> New Task
            </button>

            {/* Select Plans */}
            <div className="text-start mt-5 mb-2">Plans</div>

            {loading ?
                <div>Loading...</div>
                :
                <div className="bg-zinc-100 p-3 rounded">
                    {(plans === []) ?
                        <h3 className="text-black">There are no plans yet.</h3>
                        :
                        plans.map((plan) => (
                            <div key={plan.plan_mvp_name} className="flex flex-col justify-between items-center md:flex-col lg:flex-row text-black bg-white rounded p-4 text-start mb-2" style={{
                                borderLeft: `10px solid ${plan.plan_color}`
                            }}>
                                <p className="text-xs font-semibold p-1">{plan.plan_mvp_name}</p>
                                <div className="mt-4 lg:mt-0 ">
                                    <button onClick={() => openViewPlanModal(plan)} className="btn btn-outline text-xs btn-sm">
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }


            {/* Create Plan button */}
            <button onClick={openCreatePlanModal} className="btn bg-emerald-500 btn-sm hover:bg-emerald-700 text-white mt-4 gap-2">
                <BsPlusLg /> New Plan
            </button>

            {/* Create Plan Modal */}
            <Modal
                scrollable={true}
                isOpen={createPlanModalIsOpen}
                onRequestClose={closeCreatePlanModal}
                style={customStyles}
                contentLabel="Create New Plan"
            >
                <div className="flex justify-between mb-5">
                    <h2 className="font-bold text-xl">Create new Plan</h2>
                    <button onClick={closeCreatePlanModal}><strong>X</strong></button>
                </div>

                <form onSubmit={handlePlanCreateSubmit}>
                    <div className="form-group">
                        <label htmlFor="create-plan-name" className="font-semibold">Plan Name:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCreatePlanNameInput(e.target.value)}
                            type="text"
                            placeholder="Enter a new plan name here"
                            value={createPlanNameInput}
                            id="create-plan-name"
                            required
                        />

                        {/*Start & End Date input */}
                        <div className="flex flex-col md:flex-row justify-between gap-1">
                            <div className="w-full">
                                <label htmlFor="create-plan-startdate" className="font-semibold">Start Date:</label>
                                <input
                                    onChange={(e) => setCreatePlanStartdateInput(e.target.value)}
                                    type="date"
                                    value={createPlanStartdateInput}
                                    id="create-plan-startdate"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="create-plan-enddate" className="font-semibold">End Date:</label>
                                <input
                                    onChange={(e) => setCreatePlanEnddateInput(e.target.value)}
                                    type="date"
                                    value={createPlanEnddateInput}
                                    id="create-plan-enddate"
                                    required
                                />
                            </div>
                        </div>

                        <label htmlFor="create-plan-color" className="font-semibold">Plan Color:</label>
                        <SliderPicker
                            color={createPlanColorInput}
                            onChange={(data) => setCreatePlanColorInput(data.hex)}
                            className="mb-10"
                        />
                    </div>

                    <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
                </form>
            </Modal>

            {/* View Plan Modal */}
            <Modal
                scrollable={true}
                isOpen={viewPlanModalIsOpen}
                onRequestClose={closeViewPlanModal}
                style={customStyles}
                contentLabel="View a plan"
            >
                <div>
                    <div className="flex justify-between mb-5">
                        <h2 className="font-bold text-xl">Plan: <span className="font-medium ml-2">{planToView.plan_mvp_name}</span></h2>
                        <button onClick={closeViewPlanModal}><strong>X</strong></button>
                    </div>

                    <div className="flex gap-5 mb-4">
                        <p className="font-semibold text-stone-500 ">Start Date</p>
                        <p>{planToView.plan_startdate}</p>
                    </div>

                    <div className="flex gap-5 mb-4">
                        <p className="font-semibold text-stone-500 ">End Date</p>
                        <p>{planToView.plan_enddate}</p>
                    </div>

                    <div className="flex gap-5 mb-4">
                        <p className="font-semibold text-stone-500 ">Color</p>
                        <div style={{
                            width: '100px',
                            height: '25px',
                            backgroundColor: `${planToView.plan_color}`,
                            border: `1px solid black`
                        }}></div>
                        <p>{planToView.plan_color}</p>
                    </div>
                </div>

            </Modal>

            {/* Create Task Modal */}
            <Modal
                scrollable={true}
                isOpen={createTaskModalIsOpen}
                onRequestClose={closeCreateTaskModal}
                style={customStyles}
                contentLabel="Create New Task"
            >
                <div className="flex justify-between mb-5">
                    <h2 className="font-bold text-xl">Create new Task</h2>
                    <button onClick={closeCreateTaskModal}><strong>X</strong></button>
                </div>

                <form onSubmit={handleTaskCreateSubmit}>
                    <div className="form-group">
                        <label htmlFor="create-task-name" className="font-semibold">Task Name:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCreateTaskNameInput(e.target.value)}
                            type="text"
                            placeholder="Enter a task name here"
                            value={createTaskNameInput}
                            id="create-task-name"
                            required
                        />

                        <label htmlFor="create-task-description" className="font-semibold">Description:</label>
                        <textarea
                            id="create-task-description"
                            cols="30"
                            rows="5"
                            placeholder="Describe the task as detailed as you can"
                            value={createTaskDescriptionInput}
                            onChange={(e) => setCreateTaskDescriptionInput(e.target.value)}
                        ></textarea>

                        <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
                    </div>
                </form>

            </Modal>
        </div>
    )
}

export default SideMenu