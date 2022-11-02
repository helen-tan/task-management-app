import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import Axios from "axios"
import Modal from 'react-modal'
import { BsPlusLg } from "react-icons/bs"
import { SliderPicker } from 'react-color'

function SideMenu(props) {
    const [plans, setPlans] = useState([])
    const [createPlanModalIsOpen, setCreatePlanModalIsOpen] = useState(false)
    const [newPlanCount, setNewPlanCount] = useState(0)

     // Create Plan form inputs
    const [createPlanNameInput, setCreatePlanNameInput] = useState("")
    const [createPlanStartdateInput, setCreatePlanStartdateInput] = useState("")
    const [createPlanEnddateInput, setCreatePlanEnddateInput] = useState("")
    const [createPlanColorInput, setCreatePlanColorInput] = useState("")

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    const fetchAllPlans = async () => {
        try {
            const response = await Axios.get(`http://localhost:5000/api/plans/${props.app_acronym}`,  config)
            if (response.data) {
                setPlans(response.data.data)
                console.log(response.data.data)
            }
        } catch (err) {
            console.log("There was a problem")
        }
    }

    useEffect(() => {
        // Fetch all existing plans of an application
        fetchAllPlans()
    }, [])

    // Modal: Create New Application
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

    return (
        <div className="bg-customBlack text-white w-2/12 p-4">
            {/* Create Task button */}
            <button className="btn bg-emerald-500 btn-sm hover:bg-emerald-700 text-white gap-2">
                <BsPlusLg /> New Task
            </button>

            {/* Select Plans */}
            <div className="text-start mt-5 mb-2">Select Plan:</div>
            <div className="bg-zinc-100 p-3 rounded">
                <h3 className="text-black">There are no plans yet.</h3>
            </div>

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
        </div>
    )
}

export default SideMenu