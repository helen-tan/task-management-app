import { useState, useEffect } from "react"
import Axios from "axios"
import Modal from 'react-modal'
import { BsPlusLg } from "react-icons/bs"

function SideMenu() {
    const [createPlanModalIsOpen, setCreatePlanModalIsOpen] = useState(false)

    useEffect(() => {
        // Todo: Fetch all existing plans of an application
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

    const handlePlanCreateSubmit = (e) => {
        e.preventDefault()
        console.log("Submit")
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
                            // onChange={(e) => setCreateAppNameInput(e.target.value)}
                            type="text"
                            placeholder="Enter a new plan name here"
                            //value={createAppNameInput}
                            id="create-plan-name"
                        />

                        {/*Start & End Date input */}
                        <div className="flex flex-col md:flex-row justify-between gap-1">
                            <div className="w-full">
                                <label htmlFor="create-plan-startdate" className="font-semibold">Start Date:</label>
                                <input
                                    //onChange={(e) => setCreateAppStartdateInput(e.target.value)}
                                    type="date"
                                    //value={createAppStartdateInput}
                                    id="create-plan-startdate"
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="create-plan-enddate" className="font-semibold">End Date:</label>
                                <input
                                    //onChange={(e) => setCreateAppEnddateInput(e.target.value)}
                                    type="date"
                                    //value={createAppEnddateInput}
                                    id="create-plan-enddate"
                                />
                            </div>
                        </div>
                    </div>


                    <button className="btn btn-sm btn-block mt-3" type="submit">Submit</button>
                </form>
            </Modal>
        </div>
    )
}

export default SideMenu