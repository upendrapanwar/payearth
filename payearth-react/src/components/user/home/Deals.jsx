import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import config from './../../../config.json';
import axios from 'axios';
import { toast } from 'react-toastify';

const Deals = () => {
    const [data, setData] = useState([]);
    toast.configure();

    useEffect(() => {
        axios.get('front/product/today-deals').then(response => {
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
        <section className="deals_sec">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        { data && data.length ? <SectionTitle title="Deals Of the day" viewMore={true} route={'#'} /> : '' }
                        <div className="cards_wrapper">
                            { data && data.length ?
                                data.map((value, index) => {
                                    return <div key={index}>
                                                <Link to="#" className="d-inline-block"><img src={config.apiURI + value.bannerImage} alt="..." className="img-fluid" /></Link>
                                            </div>
                                }) : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Deals;