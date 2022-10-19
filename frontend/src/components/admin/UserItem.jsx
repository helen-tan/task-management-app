import { BsPencilSquare } from "react-icons/bs"

function UserItem(props) {
    return (
        <tr className="text-sm">
            <td className="font-semibold">{props.index + 1}</td>
            <td className="font-semibold">{props.user.username}</td>
            <td>{props.user.email}</td>
            <td>
                {props.user.groupz.map((group) => (
                    group !== "" && (
                        <div className="badge badge-sm badge-ghost ml-1" key={group}> {group} </div>
                    )
                ))}
            </td>
            <td>
                {props.user.is_active === 1 ?
                    <div className="badge badge-success gap-2 text-white">
                        active
                    </div>
                    :
                    <div className="badge badge-error gap-2 text-white">
                        inactive
                    </div>}
            </td>
            <td></td>
            <td>
                <button onClick={e => props.handleEditClick(e, props.user)} className="btn btn-sm gap-2">
                    <BsPencilSquare /> Edit
                </button>
            </td>
        </tr>
    )
}

export default UserItem