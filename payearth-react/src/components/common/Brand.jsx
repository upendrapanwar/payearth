import React from 'react';

const Brand = (props) => {
    return(
        <div className="brand">
            <img src={props.image} alt="reebok" className="img-fluid" />
        </div>
    )
}

export default Brand;