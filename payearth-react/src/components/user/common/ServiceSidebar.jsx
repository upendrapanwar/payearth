import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setServiceReqBody, setServices, setTotalServices,  setServiceMaxPrice, setEpisodes } from '../../../store/reducers/service-reducer';
import { setLoading } from '../../../store/reducers/global-reducer';
import config from '../../../config.json';
import axios from 'axios';
import ServiceRangeTwoThumbs from './ServiceRangeTwoThumbs';

const ServiceSidebar = (props) => {
    const {categories, pageName} = props;
    const dispatch = useDispatch();
    const selectedCategory = useSelector(state => state.catSearch.selectedCategory);
    var serviceReqBody = useSelector(state => state.service.reqBody);
    var episodes = useSelector(state => state.service.episodes);
    var ratings = useSelector(state => state.service.ratings);

    const handleServiceCatCheckbox = (event) => {
        let reqBody = JSON.parse(JSON.stringify({...serviceReqBody}));

        if (selectedCategory.value === '') {
            let index = reqBody.category_filter.indexOf(event.target.value);

            if (event.target.checked) {
                reqBody.category_filter.push(event.target.value);
            } else {
                if (index >= 0) {
                    reqBody.category_filter.splice(index , 1);
                }
            }
        } else {
            let index = reqBody.sub_category_filter.indexOf(event.target.value);

            if (event.target.checked) {
                reqBody.sub_category_filter.push(event.target.value);
            } else {
                if (index >= 0) {
                    reqBody.sub_category_filter.splice(index , 1);
                }
            }
        }
        reqBody.price_filter = {min_val: '', max_val: ''};
        reqBody.episode_filter = [];
        reqBody.rating_filter = [];
        dispatch(setServiceReqBody({reqBody: reqBody}));
        serviceReqBody = reqBody;
        getServices(true);
    }

    const handleEpisodeCheckbox = (event) => {
        let reqBody = JSON.parse(JSON.stringify({...serviceReqBody}));
        let index = reqBody.episode_filter.indexOf(event.target.value);

        if (event.target.checked) {
            reqBody.episode_filter.push(event.target.value);
        } else {
            if (index >= 0) {
                reqBody.episode_filter.splice(index , 1);
            }
        }

        dispatch(setServiceReqBody({reqBody: reqBody}));
        serviceReqBody = reqBody;
        getServices(false);
    }

    const handleRatingCheckbox = event => {
        let reqBody = JSON.parse(JSON.stringify({...serviceReqBody}));
        let index = reqBody.rating_filter.indexOf(event.target.value);

        if (event.target.checked) {
            reqBody.rating_filter.push(event.target.value);
        } else {
            if (index >= 0) {
                reqBody.rating_filter.splice(index , 1);
            }
        }

        dispatch(setServiceReqBody({reqBody: reqBody}));
        serviceReqBody = reqBody;
        getServices(false);
    }

    const getServices = param => {
        let servicesData = [];
        dispatch(setLoading({loading: true}));
        if (param) {
            dispatch(setServiceMaxPrice({maxPrice: ''}));
        }
        axios.post('front/service/listing', serviceReqBody).then((response) => {
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
                        quantity: service.quantity,
                        cryptoPrices:service.cryptoPrices
                    });
                    ids.push(service.id);
                });
                dispatch(setServices({services: servicesData}));
                dispatch(setTotalServices({totalServices: response.data.data.totalServices}));
                dispatch(setEpisodes({episodes: response.data.data.episodeChunks}));

                if (param) {
                    dispatch(setServiceMaxPrice({maxPrice: response.data.data.maxPrice}));
                }
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
        <div className="side_bar">
            <div className="filters">
                {pageName === 'service-listing' && categories.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Categories</h3>
                        </li>
                        {categories.map((category, index) => {
                            if (category.value !== '') {
                                return  <li key={category.value}>
                                            <div className="form-check d-flex">
                                                <input className="form-check-input" type="checkbox" value={category.value} id={category.value} onChange={handleServiceCatCheckbox} />
                                                <label className="form-check-label" htmlFor={category.value}>{category.label}</label>
                                            </div>
                                        </li>
                            } else {
                                return '';
                            }
                        })}
                    </ul> : ''
                }

                <ul className="filter_list">
                    <li>
                        <h3>Price</h3>
                    </li>
                    <li className="mb-5"><ServiceRangeTwoThumbs currency="USD" currencySymbol="$" /></li>
                </ul>

                {pageName === 'service-listing' && episodes.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Number of Episodes</h3>
                        </li>
                        {episodes.map((episode, index) => {
                            return  <li key={index}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value={episode} id={episode} onChange={handleEpisodeCheckbox} />
                                            <label className="form-check-label" htmlFor={episode}>{episode}+</label>
                                        </div>
                                    </li>
                        })}
                    </ul> : ''
                }

                {pageName === 'service-listing' && ratings.length ?
                    <ul className="filter_list">
                        <li>
                            <h3>Ratings</h3>
                        </li>
                        {ratings.map((rating, index) => {
                            return  <li key={index}>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value={rating} id={rating} onChange={handleRatingCheckbox} />
                                            <label className="form-check-label" htmlFor={rating}>{rating} ★ &above</label>
                                        </div>
                                    </li>
                        })}
                    </ul> : ''
                }
            </div>
        </div>
    )
}

export default ServiceSidebar;