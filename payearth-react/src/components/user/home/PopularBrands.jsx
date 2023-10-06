import React, { useState, useEffect } from 'react';
import Brand from './../../common/Brand';
import config from './../../../config.json';
import axios from 'axios';
import { toast } from 'react-toastify';

const PopularBrands = () => {
    const [brands, setBrands] = useState([]);
    toast.configure();

    useEffect(() => {
        axios.get('front/popular-brands').then(response => {
            if (response.data.status) {
                setBrands(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        }).catch(error => {
            toast.error(error);
            console.log(error);
        });
    }, []);

    return(
        <section className="popular_brands_sec">
            <div className="container-fluid px-5">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="main_wrapper">
                            <div className="container">
                                <div className="row">
                                    <div className="col-sm-12 p-0">
                                        <h4 className="h4 heading text-white">Popular Brands</h4>
                                        <div className="brands_wrapper">
                                            {
                                                brands && brands.length ? brands.map((brand, index) => {
                                                    return <Brand image={config.apiURI + brand.logoImage} key={index} />
                                                }) : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularBrands;