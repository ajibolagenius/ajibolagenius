import React from 'react'

function Loader() {
    return (
        <div className="loader-container">
            <div className="counter" id="counter">0%</div>
            <div className="bar">
                <div className="bar2"></div>
            </div>
        </div>
    )
}

export default Loader
