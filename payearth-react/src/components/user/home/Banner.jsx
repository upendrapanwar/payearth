import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from './../../../config.json';
import axios from 'axios';
import { toast } from 'react-toastify';

const Banner = () => {
    const [data, setData] = useState([]);
    toast.configure();
    
    useEffect(() => {
    
        axios.get('front/banner-images/home').then(response => {
            if (response.data.status) {
                setData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        }).catch(error => {
            toast.error(error);
            console.log(error);
        });
    }, []);

    return(
        <section className="hero_sec position-relative">
            <div className="container-fluid px-5">
                <div className="row">
                    <div className="col-xs-12 col-md-8 pe-md-0">
                        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                {
                                    data.bannerImages && (data.bannerImages).length ?
                                    data.bannerImages.map((value, index) => {
                                        return <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to={index} className={index === 0 ? 'active' : ''} aria-current="true" aria-label={'Slide ' + (index + 1)} key={index}></button>
                                    }) : ''
                                }
                            </div>
                            <div className="carousel-inner">
                                {
                                    data.bannerImages && (data.bannerImages).length ?
                                    data.bannerImages.map((value, index) => {
                                        return <div className={`carousel-item ${index === 0 ? 'active' : '' }`} key={index}>
                                                    <Link to={value.url !== null ? value.url : '#'}><img src={config.apiURI + value.path} className="d-block w-100 img-fluid" alt={'Hero ' + (index + 1)} /></Link>
                                                </div>
                                    }) : ''
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4 ps-md-0 d-none d-sm-block">
                        {
                            data.singleImage ? <img src={config.apiURI + data.singleImage} alt="side-hero" className="img-fluid w-100" /> : ''
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Banner;