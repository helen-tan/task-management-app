import { useState, useEffect, useRef } from "react"
import Axios from "axios"
import { MdArrowLeft, MdArrowRight } from "react-icons/md"
import Modal from 'react-modal'
import { toast } from "react-toastify"
import { BsPencilSquare } from "react-icons/bs"

function TaskCard(props) {
    const [planColor, setPlanColor] = useState("#FFF")
    const [originalNotes, setOriginalNotes] = useState([])
    const [newNotes, setNewNotes] = useState([])
    const bottomRef = useRef(null)

    const [newNoteCount, setNewNoteCount] = useState(0)
    const [editTaskCount, setEditTaskCount] = useState(0)

    // Modal states
    const [viewTaskModalIsOpen, setViewTaskModalIsOpen] = useState(false)
    const [editTaskModalIsOpen, setEditTaskModalIsOpen] = useState(false)

    // Add new notes input
    const [newNoteInput, setNewNoteInput] = useState("")

    // Edit Task form inputs
    const [editTaskDescriptionInput, setEditTaskDescriptionInput] = useState("")
    const [editTaskPlanInput, setEditTaskPlanInput] = useState("")

    // States to store new values on task edit, for instant display on update
    const [newTaskPlanColor, setNewTaskPlanColor] = useState("")
    const [newTaskPlanName, setNewTaskPlanName] = useState("")
    const [newTaskOwner, setNewTaskOwner] = useState("")

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

    const promoteTaskState = async () => {
        // Send put request to update a task's task_state
        try {
            const response = await Axios.put(`http://localhost:5000/api/tasks/${props.task.task_id}/promoteState`, {}, config)
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

    const demoteTaskState = async () => {
        // Send put request to update a task's task_state
        try {
            const response = await Axios.put(`http://localhost:5000/api/tasks/${props.task.task_id}/demoteState`, {}, config)
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
        //console.log(props.task.task_notes)
        // Store the newline-separated notes into an array (with no leading or trailing whitespaces)
        let arr = props.task.task_notes.split("\n")
        arr.forEach((item, index) => {
            arr[index] = item.trim()
        })
        //console.log(arr)
        setOriginalNotes(arr)

        // scroll to bottom every time newNoteCount change
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Set initial states for edit task form fields
        setEditTaskDescriptionInput(props.task.task_description)
        setEditTaskPlanInput(props.task.task_plan)
    }, [newNoteCount, editTaskCount])

    const promoteProgress = () => {
        promoteTaskState()
        props.setTaskUpdateCount(prevState => prevState + 1)
    }

    const demoteProgress = () => {
        demoteTaskState()
        props.setTaskUpdateCount(prevState => prevState + 1)
    }

    // Modal: View Task Details
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
            height: '90vh',
            borderRadius: ".5em",
            overflowY: "auto",
        },
        overlay: {
            zIndex: 1000,
            background: "rgba(0, 0, 0, 0.5)",
            //overflowY: "auto"
        }
    };

    const openViewTaskModal = () => setViewTaskModalIsOpen(true)
    const closeViewTaskModal = () => setViewTaskModalIsOpen(false)

    const handleNewNoteSubmit = async (e) => {
        e.preventDefault()

        const new_note = {
            new_note_input: newNoteInput,
        }

        // Send put request to update task_notes
        try {
            const response = await Axios.put(`http://localhost:5000/api/tasks/${props.task.task_id}/updateNotes`, new_note, config)
            if (response) {
                // console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)

                    const newNotes = response.data.data.task_notes
                    // Store the newline-separated notes into an array (with no leading or trailing whitespaces)
                    let arr = newNotes.split("\n")
                    arr.forEach((item, index) => {
                        arr[index] = item.trim()
                    })
                    setNewNotes(arr)
                    //console.log(arr)

                    // increment count state (to induce re render of Notes to include new note instantly)
                    setNewNoteCount(prevState => prevState + 1)

                    // clear user input
                    setNewNoteInput("")
                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    // Modal: Edit Task
    const openEditTaskModal = () => setEditTaskModalIsOpen(true)
    const closeEditTaskModal = () => setEditTaskModalIsOpen(false)

    const handleEditTaskSubmit = async (e) => {
        e.preventDefault()

        const editedFields = {
            task_plan: editTaskPlanInput,
            task_description: editTaskDescriptionInput
        }

        // Send put request to update task_notes
        try {
            const response = await Axios.put(`http://localhost:5000/api/tasks/${props.task.task_app_acronym}/${props.task.task_id}/updateTask`, editedFields, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)

                    const newNotes = response.data.data.task_notes
                    // Store the newline-separated notes into an array (with no leading or trailing whitespaces)
                    let arr = newNotes.split("\n")
                    arr.forEach((item, index) => {
                        arr[index] = item.trim()
                    })
                    //console.log(arr)
                    setNewNotes(arr)

                    setNewTaskPlanColor(response.data.data.task_color)
                    setNewTaskPlanName(response.data.data.task_plan)
                    setNewTaskOwner(response.data.data.task_owner)

                    // Set the form initial input values to the new values
                    setEditTaskPlanInput(response.data.data.task_plan)
                    setEditTaskDescriptionInput(response.data.data.task_description)

                    // increment count state (induce instant re-render in edit task modal)
                    setEditTaskCount(prevState => prevState + 1)
                    // increment count state (to induce re render of Notes to include new note instantly)
                    setNewNoteCount(prevState => prevState + 1)

                    // clear user input
                    setNewNoteInput("")
                } else {
                    toast.warning(response.data.message)
                }
            }
        } catch (err) {
            console.log(err)
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
            <div className="bg-slate-500 mb-2" style={{ height: "0.5px" }}></div>
            <div className="flex flex-col md:flex-row justify-end gap-2 p-1">
                <button onClick={() => openViewTaskModal()} className="btn btn-outline text-xs btn-xs">
                    View
                </button>
                <button onClick={() => openEditTaskModal()} className="btn btn-black text-xs btn-xs">
                    Edit
                </button>
            </div>

            {/* View Task Modal */}
            <Modal
                scrollable={true}
                isOpen={viewTaskModalIsOpen}
                onRequestClose={closeViewTaskModal}
                style={customStyles}
                contentLabel="View Task Details"
            >
                <div className="flex justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-2xl">{props.task.task_name}</h2>
                        <p className="text-sm text-gray-500">{props.task.task_id}</p>
                    </div>
                    <button onClick={closeViewTaskModal}><strong>X</strong></button>
                </div>

                <div className="flex w-8/12 justify-between mb-3">
                    <div className="font-semibold text-gray-400">Status </div>
                    <div className="border-solid border border-slate-500 rounded text-slate-500 px-1 ml-3">{props.task.task_state}</div>
                </div>

                <div className="flex w-8/12 justify-between mb-3">
                    <div className="font-semibold text-gray-400">Plan </div>
                    {(props.task.task_plan.length < 1) ?
                        <div className="border-solid border border-slate-500 rounded text-slate-500 px-1 ml-3">Not Assigned Yet</div>
                        :
                        <div className="px-1 ml-3" style={{
                            border: `2px solid ${planColor}`,
                            borderRadius: '5px',
                            backgroundColor: `${planColor}`
                        }}>
                            {props.task.task_plan}
                        </div>
                    }
                </div>

                <div className="flex w-8/12 justify-between mb-3">
                    <div className="font-semibold text-gray-400">Task Owner </div>
                    <p className="ml-3">{props.task.task_owner}</p>
                </div>


                <div className="flex w-8/12 justify-between mb-3">
                    <div className="font-semibold text-gray-400">Created by </div>
                    <p className="ml-3">{props.task.task_creator}</p>
                </div>

                <div className="flex w-8/12 justify-between mb-3">
                    <div className="font-semibold text-gray-400">Created On </div>
                    <div className="ml-3">{props.task.task_createdate.split("T")[0]}</div>
                </div>

                <div className="bg-slate-300 mb-5 mt-5" style={{ height: "0.5px" }}></div>

                <div className="flex flex-col mb-3">
                    <p className="font-bold mb-3">Description </p>
                    <div className="h-28" style={{ overflowY: 'scroll' }}>{props.task.task_description}</div>
                </div>

                <div className="bg-slate-300 mb-5 mt-5" style={{ height: "0.5px" }}></div>

                <div className="flex flex-col mb-3">
                    <p className="font-bold mb-3">Notes </p>
                    <div className="h-60 p-2" style={{ overflowY: 'scroll' }}>
                        {(newNoteCount === 0) ?
                            originalNotes.map((note, index) => (
                                <div key={index} className="note-shadow bg-yellow-100 rounded p-3 mb-2">
                                    {note}
                                </div>
                            ))
                            :
                            newNotes.map((note, index) => (
                                <div key={index} className="note-shadow bg-yellow-100 rounded p-3 mb-2">
                                    {note}
                                </div>
                            ))
                        }
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Form to add notes */}
                <form onSubmit={handleNewNoteSubmit}>
                    <div className="form-group">
                        {/* If want to use textarea, change ',' separator to \n newline character in task controller */}
                        {/* <textarea
                            id="task_notes"
                            cols="30"
                            rows="10"
                            value={(newNoteCount==0)?originalNotes:newNotes}
                            disabled
                            style={{ overflowY: 'scroll' }} 
                        >
                        </textarea> */}

                        <label htmlFor="update-task-notes" className="font-semibold">Add a note</label>
                        <textarea
                            id="update-task-notes"
                            cols="30"
                            rows="3"
                            placeholder="Say something..."
                            value={newNoteInput}
                            onChange={(e) => setNewNoteInput(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button className="btn btn-sm gap-2" type="submit">
                            <BsPencilSquare />
                            Add Note
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Task Modal */}
            <Modal
                scrollable={true}
                isOpen={editTaskModalIsOpen}
                onRequestClose={closeEditTaskModal}
                style={customStyles}
                contentLabel="Edit Task Details"
            >
                <div className="flex justify-between mb-5">
                    <div>
                        <h2 className="font-bold text-2xl">Edit Task - {props.task.task_name}</h2>
                        <p className="text-sm text-gray-500">{props.task.task_id}</p>
                    </div>
                    <button onClick={closeEditTaskModal}><strong>X</strong></button>
                </div>

                {/* Display current Task data */}
                <div className="mb-10">
                    <div className="flex w-8/12 justify-between mb-3">
                        <div className="font-semibold text-gray-400">Status </div>
                        <div className="border-solid border border-slate-500 rounded text-slate-500 px-1 ml-3">{props.task.task_state}</div>
                    </div>

                    <div className="flex w-8/12 justify-between mb-3">
                        <div className="font-semibold text-gray-400">Plan </div>
                        {(props.task.task_plan.length < 1) ?
                            <div className="border-solid border border-slate-500 rounded text-slate-500 px-1 ml-3">Not Assigned Yet</div>
                            :
                            (editTaskCount === 0) ?
                                <div className="px-1 ml-3" style={{
                                    border: `2px solid ${planColor}`,
                                    borderRadius: '5px',
                                    backgroundColor: `${planColor}`
                                }}>
                                    {props.task.task_plan}
                                </div>
                                :
                                <div className="px-1 ml-3" style={{
                                    border: `2px solid ${newTaskPlanColor}`,
                                    borderRadius: '5px',
                                    backgroundColor: `${newTaskPlanColor}`
                                }}>
                                    {/*Name of Plan */}
                                    {(editTaskCount === 0) ? props.task.task_plan : newTaskPlanName}
                                </div>
                        }
                    </div>

                    <div className="flex w-8/12 justify-between mb-3">
                        <div className="font-semibold text-gray-400">Task Owner </div>
                        <p className="ml-3">
                            {(editTaskCount === 0) ? props.task.task_owner : newTaskOwner }
                        </p>
                    </div>

                    <div className="flex w-8/12 justify-between mb-3">
                        <div className="font-semibold text-gray-400">Created by </div>
                        <p className="ml-3">{props.task.task_creator}</p>
                    </div>

                    <div className="flex w-8/12 justify-between mb-3">
                        <div className="font-semibold text-gray-400">Created On </div>
                        <div className="ml-3">{props.task.task_createdate.split("T")[0]}</div>
                    </div>
                </div>



                {/* Edit Task form - plan, description only */}
                <form onSubmit={handleEditTaskSubmit}>
                    <div className="form-group">
                        {/* Change Plan color input - Dropdown to show available plans*/}
                        <label htmlFor="edit-task-plan" className="font-semibold">Change Plan:</label>
                        <select id="edit-task-plan" value={editTaskPlanInput} onChange={(e) => setEditTaskPlanInput(e.target.value)}>
                            <option value="" disabled>Choose a plan...</option>
                            {props.plans.map((plan) => (
                                <option key={plan.plan_mvp_name} style={{
                                    backgroundColor: `${plan.plan_color}`
                                }}>
                                    {plan.plan_mvp_name}
                                </option>
                            ))}
                        </select>

                        {/*Task Description input */}
                        <label htmlFor="edit-task-description" className="font-semibold">Description:</label>
                        <textarea
                            id="edit-task-description"
                            cols="30"
                            rows="5"
                            placeholder="Say a few words about the task..."
                            value={editTaskDescriptionInput}
                            onChange={(e) => setEditTaskDescriptionInput(e.target.value)}
                        ></textarea>
                    </div>
                    <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
                </form>

                {/* Notes section */}

                <div className="bg-slate-300 mb-5 mt-5" style={{ height: "0.5px" }}></div>

                <div className="flex flex-col mb-3">
                    <p className="font-bold text-2xl mb-3">Notes </p>
                    <div className="h-60 p-2" style={{ overflowY: 'scroll' }}>
                        {(newNoteCount === 0) ?
                            originalNotes.map((note, index) => (
                                <div key={index} className="note-shadow bg-yellow-100 rounded p-3 mb-2">
                                    {note}
                                </div>
                            ))
                            :
                            newNotes.map((note, index) => (
                                <div key={index} className="note-shadow bg-yellow-100 rounded p-3 mb-2">
                                    {note}
                                </div>
                            ))
                        }
                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Form to add notes */}
                <form onSubmit={handleNewNoteSubmit}>
                    <div className="form-group">
                        <label htmlFor="update-task-notes" className="font-semibold">Add a note</label>
                        <textarea
                            id="update-task-notes"
                            cols="30"
                            rows="3"
                            placeholder="Say something..."
                            value={newNoteInput}
                            onChange={(e) => setNewNoteInput(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button className="btn btn-sm gap-2" type="submit">
                            <BsPencilSquare />
                            Add Note
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default TaskCard