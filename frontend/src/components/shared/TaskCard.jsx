function TaskCard(props) {
    return (
        <div className="card-shadow rounded bg-white mx-auto mt-2 w-11/12 p-2">
            <div className="flex flex-col items-start p-1 mb-2">
                <div className="small-text text-gray-500 mb-1">{props.task.task_id}</div>
                <div className="text-xs font-bold mb-1">{props.task.task_name}</div>
                <div className="small-text text-gray-500">Owner: {props.task.task_owner}</div>
            </div>
            <div className="bg-gray-700 h-px mb-2"></div>
            <div className="flex flex-col md:flex-row justify-end gap-2 p-1">
                <button className="btn btn-outline text-xs btn-xs">
                    View
                </button>
                <button className="btn btn-black text-xs btn-xs">
                    Edit
                </button>
            </div>
        </div>
    )
}

export default TaskCard