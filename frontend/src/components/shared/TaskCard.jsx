import { useState, useEffect } from "react"
import Axios from "axios"
import { MdArrowLeft, MdArrowRight } from "react-icons/md"
import Modal from 'react-modal'
import { toast } from "react-toastify"
import { BsPencilSquare } from "react-icons/bs"

function TaskCard(props) {
    const [planColor, setPlanColor] = useState("#FFF")
    const [viewTaskModalIsOpen, setViewTaskModalIsOpen] = useState(false)
    const [notesArr, setNotesArr] = useState([])
    const [newNoteCount, setNewNoteCount] = useState(0)

    // Add new notes input
    const [newNoteInput, setNewNoteInput] = useState("")

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
        // Store the comma-separated notes into an array (with no leading or trailing whitespaces)
        let arr = props.task.task_notes.split(",")
        arr.forEach((item, index) => {
            arr[index] = item.trim()
        })
        //console.log(arr)
        setNotesArr(arr)
    }, [newNoteCount])

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

        // Send post request to update task_notes
        try {
            const response = await Axios.put(`http://localhost:5000/api/tasks/${props.task.task_id}/updateNotes`, new_note, config)
            if (response) {
                console.log(response.data)
                if (response.data.success === true) {
                    toast.success(response.data.message)
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
                <button className="btn btn-black text-xs btn-xs">
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
                        {notesArr.map((note, index) => (
                            <div key={index} className="note-shadow bg-yellow-100 rounded p-3 mb-2">
                                {/* name of note creator */}
                                {note}
                            </div>
                        ))}
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
                            <BsPencilSquare/>
                            Add Note
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default TaskCard