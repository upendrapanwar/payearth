import React, { Component } from 'react';
import GoToTop from './../../helpers/GoToTop';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import ServiceSidebar from './../../components/user/common/ServiceSidebar';
import Footer from './../../components/common/Footer';
import ServiceListingHead from './../../components/user/common/ServiceListingHead';
import ProductCard from './../../components/common/ProductCard';
import NotFound from './../../components/common/NotFound';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import config from './../../config.json';
import axios from 'axios';
import store from '../../store/index';
import { setServices, setServiceReqBody, setTotalServices, setServiceMaxPrice, setEpisodes } from '../../store/reducers/service-reducer';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import readUrl from '../../helpers/read-product-listing-url';

class ServiceListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqBody: JSON.parse(JSON.stringify({...store.getState().service.reqBody})),
            services: [],
            loading: false,
            maxPrice: 0,
            episodes:[5,10,15,20],
            ratings:[4,3,2,1]
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let reqBody = {...this.state.reqBody};
        reqBody = readUrl(dispatch, reqBody, window.location, setServiceReqBody, 'service-listing');

        this.setState(
            {reqBody},
            () => this.getServices('didMount')
        );
    }

    getServices = (param) => {
        const { dispatch } = this.props;
        let reqBody = JSON.parse(JSON.stringify({...store.getState().service.reqBody}));
        let servicesData = [];

        if (param === 'didMount') {
            reqBody = this.state.reqBody;
        } else if(param === 'viewMore') {
            reqBody.count.limit = reqBody.count.limit + 9;
        }

        dispatch(setLoading({loading: true}));
        axios.post('front/service/listing', reqBody).then((response) => {
            if (response.data.status) {
                let res = response.data.data.services;
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
                });
            }
            this.setState({services: servicesData});
            dispatch(setServiceReqBody({reqBody}));
            dispatch(setServices({services: servicesData}));
            dispatch(setTotalServices({totalServices: response.data.data.totalServices}));
            dispatch(setEpisodes({episodes: response.data.data.episodeChunks}));
            this.setState({maxPrice: response.data.data.maxPrice, maxVideoCount: response.data.data.maxVideoCount, episodes: response.data.data.episodeChunks});
            dispatch(setServiceMaxPrice({maxPrice: response.data.data.maxPrice}));

            if (param === 'didMount' || param === 'viewMore') {
                //getEpisodes(dispatch);
               // getRatings(dispatch);
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

    render() {
        const { services, totalServices, categories } = store.getState().service;
        const { loading } = store.getState().global;

        return (
            <React.Fragment>
                { loading === true ? <SpinnerLoader /> : '' }
                <Header pageName="service-listing" reqBody={this.state.reqBody} />
                <PageTitle title={store.getState().catSearch.selectedCategory.label} />

                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <ServiceSidebar pageName="service-listing" categories={categories} maxPrice={this.state.maxPrice} />
                            </div>
                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col">
                                        <ServiceListingHead title="Services" count={services.length} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        { services.length === 0 ? <NotFound msg="Service not found." /> : '' }
                                        <div className="cards_wrapper">
                                            {
                                                services.map((service, index) => {
                                                    return <ProductCard data={service} key={index} />
                                                })
                                            }
                                        </div>
                                    </div>
                                    {
                                        services.length !== 0 && services.length < totalServices ?
                                        <div className="col-md-12 more_pord_load_btn">
                                            <button type="button" onClick={() => this.getServices('viewMore')} className="view_more">View More</button>
                                        </div> : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
                <GoToTop/>
            </React.Fragment>
        );
    }
}

export default connect(setServices) (ServiceListing);