import SideMenu from "../shared/SideMenu"

function Kanban() {
  return (
    <div className="flex justify-between h-screen">
        <div className="bg-customBlack text-white w-2/12">
            SideBar
        </div>
        <div className="grow">
            Kanban Board contents
        </div>
    </div>
  )
}

export default Kanban