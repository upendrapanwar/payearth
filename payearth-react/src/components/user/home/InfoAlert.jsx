import React from 'react';
import { Link } from 'react-router-dom';

const InfoAlert = () => {
    return(
        <div className="offer_alert alert alert-danger alert-dismissible fade show mb-0 rounded-0" role="alert">
            <div className="text_wrapper">
                <span className="wow">Woww !!</span>
                <span className="short_des">We are the 1st Product who providing<br /> bunch of crypto coin for your Every purchase</span>
                <span className="dont_miss">Don’t<br /><i>Miss this</i></span>
                <Link to="#" className="btn custom_btn btn_yellow_bordered">Start to earn now</Link>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
}

export default InfoAlert;