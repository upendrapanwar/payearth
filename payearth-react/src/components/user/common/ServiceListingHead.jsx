import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../store/reducers/global-reducer';
import { setServiceReqBody, setServices, setTotalServices } from '../../../store/reducers/service-reducer';
import config from '../../../config.json';
import axios from 'axios';
import Select from 'react-select';

const ServiceListingHead = (props) => {
    const dispatch = useDispatch();
    const serviceReqBody = useSelector(state => state.service.reqBody);
    const [defaultSelectedOption, setdefaultSelectedOption] = useState({label: 'Popularity', value: 'popular'});
    const sortingOptions = [
        {label: 'Popularity', value: 'popular'},
        {label: "What's New", value: 'new'},
        {label: 'Low-High', value: 'price_asc'},
        {label: 'High-Low', value: 'price_desc'}
    ];

    const handleChange = selectedOption => {
        let reqBody = {...serviceReqBody};
        let sortObj = {sort_type: '', sort_val: ''};

        if (selectedOption.value === 'popular') {
            sortObj.sort_type = 'popular';
            sortObj.sort_val = '';
        } else if(selectedOption.value === 'new') {
            sortObj.sort_type = 'new';
            sortObj.sort_val = '';
        } else if(selectedOption.value === 'price_asc') {
            sortObj.sort_type = 'price';
            sortObj.sort_val = 'asc';
        } else if(selectedOption.value === 'price_desc') {
            sortObj.sort_type = 'price';
            sortObj.sort_val = 'desc';
        }

        reqBody.sorting = sortObj;
        setdefaultSelectedOption(selectedOption);
        getServices(reqBody);
        dispatch(setServiceReqBody({reqBody}));
    }

    const getServices = (param) => {
        let servicesData = [];

        dispatch(setLoading({loading: true}));
        axios.post('front/service/listing', param).then((response) => {
            if (response.data.status) {
                let res = response.data.data.services;
                let ids = [];
                res.forEach(service => {
                    servicesData.push({
                        id: service.id,
                        image: config.apiURI + service.featuredImage,
                        name: service.name,
                        price: service.price,
                        avgRating: service.avgRating,
                        videoCount: service.videoCount,
                        isService: service.isService,
                        quantity: service.quantity
                    });
                    ids.push(service.id);
                });
                dispatch(setServices({services: servicesData}));
                dispatch(setTotalServices({totalServices: response.data.data.totalServices}));

            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                dispatch(setServices({services: servicesData}));
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    return(
        <div className="pl_head">
            <div className="pro_search_count">{props.count} {props.title}</div>
            <div className="pro_sorting">
                <Select
                    className="sort_select"
                    options={sortingOptions}
                    value={defaultSelectedOption}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default ServiceListingHead;