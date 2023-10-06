import React from 'react';
import { Link } from 'react-router-dom';
import config from '../../../config.json';
import video_play_icon from './../../../assets/icons/video_play_icon.svg';

const ServiceView = (props) => {
    return(
        <div className="prod_dtl_slider">
            <div className="pds_main ep_vdo_box">
                <Link to="#" className="vdo_ply_btn"><img src={video_play_icon} alt="video play icon" /></Link>
                <img src={config.apiURI + props.featuredImg} className="img-fluid" alt="" />
            </div>
        </div>
    );
}

export default ServiceView;