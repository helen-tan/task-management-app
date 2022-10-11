import React, { useEffect } from 'react'

function Page(props) {
    useEffect(() => {
        // Update title of page
        document.title = `${props.title} | TMS System`
        // Scroll to top of the page
        window.scrollTo(0, 0)
    }, [])

    return (
        <div>{props.children}</div>
    )
}

export default Page