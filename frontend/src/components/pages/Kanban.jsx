import { useState, useEffect } from "react"
import SideMenu from "../shared/SideMenu"
import BackLink from "../utils/BackLink"

function Kanban() {
    return (
        <div className="flex justify-between h-screen">
            <div className="bg-customBlack text-white w-2/12">
                SideBar
            </div>

            <div className="grow bg-slate-200">
                <div className="bg-white px-10 pt-10 pb-4 text-start">
                    <BackLink url='/dashboard'/>
                    
                    <p className="font-bold text-xl mb-5 mt-7">Kanban Board Title</p>
                </div>

                {/* Columns */}
                <div className="bg-slate-200">
                    Columns
                </div>
            </div>
        </div>
    )
}

export default Kanban