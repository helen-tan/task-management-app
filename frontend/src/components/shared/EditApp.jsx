import { useState, useEffect } from "react"
import Modal from 'react-modal'

function EditApp(props) {
    // Edit App form inputs
    const [editAppNameInput, setEditAppNameInput] = useState("")
    const [editAppStartdateInput, setEditAppStartdateInput] = useState("")
    const [editAppEnddateInput, setEditAppEnddateInput] = useState("")
    const [editAppRnumInput, setEditAppRnumInput] = useState("")
    const [editAppDescriptionInput, setEditAppDescriptionInput] = useState("")
    const [editAppPermitCreate, setEditAppPermitCreate] = useState("")
    const [editAppPermitOpen, setEditAppPermitOpen] = useState("")
    const [editAppPermitTodolist, setEditAppPermitTodolist] = useState("")
    const [editAppPermitDoing, setEditAppPermitDoing] = useState("")
    const [editAppPermitDone, setEditAppPermitDone] = useState("")

    useEffect(() => {
        // Fetch the data of 1 application
    }, [])

    const handleAppEdit = () => {
        console.log('edit')
    }

    return (
        <Modal
            scrollable={true}
            isOpen={props.editAppModalIsOpen}
            onRequestClose={props.closeEditAppModal}
            style={props.customStyles}
            contentLabel="Create New Application"
        >
            <div className="flex justify-between mb-5">
                <h2 className="font-bold text-xl">Edit Application</h2>
                <button onClick={props.closeEditAppModal}><strong>X</strong></button>
            </div>

            <form onSubmit={handleAppEdit}>
                <div className="form-group">
                    {/*App Name input */}
                    <label htmlFor="edit-app-name" className="font-semibold">Application Name:</label>
                    <input
                        className="form-control"
                        onChange={(e) => setEditAppNameInput(e.target.value)}
                        type="text"
                        placeholder="Enter a new app name here"
                        value={editAppNameInput}
                        id="edit-app-name"
                    />

                    {/*Start & End Date input */}
                    <div className="flex flex-col md:flex-row justify-between gap-1">
                        <div className="w-full">
                            <label htmlFor="edit-app-startdate" className="font-semibold">Start Date:</label>
                            <input
                                onChange={(e) => setEditAppStartdateInput(e.target.value)}
                                type="date"
                                value={editAppStartdateInput}
                                id="edit-app-startdate"
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="edit-app-enddate" className="font-semibold">End Date:</label>
                            <input
                                onChange={(e) => setEditAppEnddateInput(e.target.value)}
                                type="date"
                                value={editAppEnddateInput}
                                id="edit-app-enddate"
                            />
                        </div>
                    </div>

                    {/*R_number input */}
                    <label htmlFor="edit-app-rnum" className="font-semibold">R Number:</label>
                    <input
                        className="form-control"
                        onChange={(e) => setEditAppRnumInput(e.target.value)}
                        type="number"
                        placeholder="Enter a number to identify your app"
                        value={editAppRnumInput}
                        id="edit-app-rnum"
                    />

                    {/*Description input */}
                    <label htmlFor="edit-app-description" className="font-semibold">Description:</label>
                    <textarea
                        id="edit-app-description"
                        cols="30"
                        rows="5"
                        placeholder="Say a few words about the application..."
                        value={editAppDescriptionInput}
                        onChange={(e) => setEditAppDescriptionInput(e.target.value)}
                    ></textarea>


                    <div className="font-bold text-base mb-5">Groups permitted to:</div>

                    {/*App_permit_create */}
                    <label htmlFor="edit-app-permitcreate" className="font-semibold">Create Tasks (App_permit_Create):</label>
                    <select id="edit-app-permitcreate" value={editAppPermitCreate} onChange={(e) => setEditAppPermitCreate(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_open */}
                    <label htmlFor="edit-app-permitopen" className="font-semibold">Shift Tasks to To-do (App_permit_Open):</label>
                    <select id="edit-app-permitopen" value={editAppPermitOpen} onChange={(e) => setEditAppPermitOpen(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_toDoList */}
                    <label htmlFor="edit-app-permittodolist" className="font-semibold">Shift Tasks to Doing (App_permit_toDoList):</label>
                    <select id="edit-app-permittodolist" value={editAppPermitTodolist} onChange={(e) => setEditAppPermitTodolist(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_Doing */}
                    <label htmlFor="edit-app-permitdoing" className="font-semibold">Shift Tasks to Done (App_permit_Doing):</label>
                    <select id="edit-app-permitdoing" value={editAppPermitDoing} onChange={(e) => setEditAppPermitDoing(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>

                    {/*App_permit_Done */}
                    <label htmlFor="edit-app-permitdone" className="font-semibold">Close Tasks (App_permit_Done):</label>
                    <select id="edit-app-permitdone" value={editAppPermitDone} onChange={(e) => setEditAppPermitDone(e.target.value)}>
                        <option value="" disabled>Choose a group...</option>
                        {props.groupOptions.map((groupOption) => (
                            <option key={groupOption.group_name}>{groupOption.group_name}</option>
                        ))}
                    </select>
                </div>

                <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
            </form>

        </Modal>
    )
}

export default EditApp