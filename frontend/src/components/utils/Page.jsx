import React, { useEffect } from 'react'

function Page(props) {
    useEffect(() => {
        // Update title of page
        document.title = `${props.title} | TMS System`
        // Scroll to top of the page
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="pb-36 mt-14">{props.children}</div>
    )
}

export default Page