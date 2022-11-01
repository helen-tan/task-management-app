import { useState, useEffect } from "react"
import Axios from "axios"
import { BsPlusLg } from "react-icons/bs"

function SideMenu() {
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
            <button className="btn bg-emerald-500 btn-sm hover:bg-emerald-700 text-white mt-4 gap-2">
                <BsPlusLg /> New Plan
            </button>
        </div>
    )
}

export default SideMenu