import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from './../../../config.json';

const ProductView = (props) => {
    const [featuredImg, setFeaturedImg] = useState('');
    const [thumbnails, setThumbnails] = useState([]);

    useEffect(() => {
        setFeaturedImg(props.featuredImg);
        setThumbnails(props.thumbnails);
    }, [props.featuredImg, props.thumbnails]);

    const handleThumb = (imgUrl) => {
        setFeaturedImg(imgUrl);
    }

    return(
        <div className="prod_dtl_slider">
            <div className="pds_list">
                {thumbnails.length ? thumbnails.map((value, index) => {
                    return <div className={`pds_list_item ${value === featuredImg ? 'active' : ''}`} key={index} onClick={() => handleThumb(value)}>
                                <Link to="#"><img className="img-fluid" src={config.apiURI + value} alt={`Thumb-${index + 1}`} /></Link>
                            </div>
                }) : ''}
            </div>
            <div className="pds_main"><img src={config.apiURI + featuredImg} className="img-fluid" alt="s1_big" /></div>
        </div>
    )
}

export default ProductView;