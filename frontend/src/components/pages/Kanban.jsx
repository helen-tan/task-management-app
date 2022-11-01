import { useState, useEffect } from "react"
import SideMenu from "../shared/SideMenu"

function Kanban() {
  return (
    <div className="flex justify-between h-screen">
        <div className="bg-customBlack text-white w-2/12">
            SideBar
        </div>
        <div className="grow bg-slate-200">
            <div className="bg-white p-10 text-start">
                <p className="font-bold text-xl mb-5">Kanban Board Title</p>
            </div>
            <div className="bg-slate-200">
                Columns
            </div>
        </div>
    </div>
  )
}

export default Kanban