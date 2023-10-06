import React from 'react';

const SpinnerLoader = (props) => {
    return(
        <div className="spinner_loader">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
}

export default SpinnerLoader;