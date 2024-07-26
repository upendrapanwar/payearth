import React, { Component } from 'react';
import Header from '../../../components/user/common/Header';
import { Link } from "react-router-dom";
import PageTitle from '../../../components/user/common/PageTitle';
import Sidebar from '../../../components/user/common/Sidebar';
import Footer from '../../../components/common/Footer';
import ListingHead from '../../../components/user/common/ListingHead';
import ProductCard from '../../../components/common/ProductCard';
import { NotFound } from '../../../components/common/NotFound';
import SpinnerLoader from '../../../components/common/SpinnerLoader';
import config from '../../../config.json';
import axios from 'axios';
import store from '../../../store/index';
import { setProducts, setReqBody, setTotalProducts, setMaxPrice } from '../../../store/reducers/product-reducer';
import { setLoading } from '../../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import readUrl from '../../../helpers/read-product-listing-url';
import { getBrands, getColors } from '../../../helpers/product-listing';
import GoToTop from '../../../helpers/GoToTop';
import ReactSlider from 'react-slider';


class ServiceListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqBody: JSON.parse(JSON.stringify({ ...store.getState().product.reqBody })),
            products: [],
            loading: false,
            maxPrice: 0,
            servicesCategory: '',
            categoryId: this.getQueryParam('cat'),
            services: '',
            selectedCategories: [],
            currentPage: 1,
            itemsPerPage: 4,
            range: [0, 100],
            filteredData: []
        }
    }
    getQueryParam(param) {
        const queryParams = new URLSearchParams(this.props.location.search);
        return queryParams.get(param);
    }

    componentDidMount() {
        this.getCategory();
        this.getServices();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.location.search !== prevProps.location.search) {
            const newCategoryId = this.getQueryParam('cat');
            this.setState({ categoryId: newCategoryId }, () => {
                this.getServices();
                // this.handleCatSelect(newCategoryId);
            });
        }
        if (prevState.services !== this.state.services || prevState.range !== this.state.range) {
            this.filterData();
        }
    }

    // componentDidUpdate(prevState) {
    //     if (prevState.services !== this.state.services || prevState.range !== this.state.range) {
    //         this.filterData();
    //     }
    // }

    getCategory = async () => {
        try {
            const url = 'front/getServiceCategory';
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });
            this.setState({ servicesCategory: response.data.data });
        } catch (error) {
            console.log("error", error);
        }
    }

    getServices = async () => {
        const categoryId = this.getQueryParam('cat');
        try {
            const response = await axios.get(`front/getServicesByCategory/${categoryId}`, {
                params: { categories: this.state.selectedCategories.join(',') },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            });
            this.setState({ services: response.data.data })
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    handleCatSelect = (categoryId) => {
        this.setState((prevState) => {
            const selectedCategories = prevState.selectedCategories.includes(categoryId)
                ? prevState.selectedCategories.filter((id) => id !== categoryId)
                : [...prevState.selectedCategories, categoryId];
            return { selectedCategories };
        }, this.getServices);
    }

    handleServiceData = (data) => {
        // console.log("header selected data :", data)
        this.setState({ services: data, selectedCategories: [], categoryId: '', range: [0, 100], filteredData: [] });
    }
    // range
    filterData() {
        const [minRange, maxRange] = this.state.range;
        const filteredData = this.state.services.filter(item => item.charges >= minRange && item.charges <= maxRange);
        console.log("filteredData", filteredData)
        this.setState({ filteredData: filteredData });
    }

    handleRangeChange = (value) => {
        this.setState({ range: value });
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    nextPage = () => {
        const { filteredData, services } = this.state;
        const data = filteredData.length === 0 ? services : filteredData;
        const totalPages = Math.ceil(data.length / 4);
        // console.log("totalPages : >", totalPages)
        if (this.state.currentPage < totalPages) {
            this.setState((prevState) => ({ currentPage: prevState.currentPage + 1 }));
        }
    };

    prevPage = () => {
        if (this.state.currentPage > 1) {
            this.setState((prevState) => ({ currentPage: prevState.currentPage - 1 }));
        }
    };

    render() {
        const { loading } = store.getState().global;
        const { servicesCategory, services, categoryId, currentPage, itemsPerPage, filteredData } = this.state;
        const data = filteredData.length === 0 ? services : filteredData;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentServiceData = data.slice(
            indexOfFirstItem,
            indexOfLastItem
        );


        console.log("currentServiceData", currentServiceData)
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header pageName="service-listing" sendServiceData={this.handleServiceData} />
                <PageTitle title='Service Listing' />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="side_bar">
                                    <div className="filters">
                                        {/* {servicesCategory.length > 0 ?
                                            <ul className="filter_list">
                                                <li>
                                                    <h3>Categories</h3>
                                                </li>
                                                {servicesCategory.map((category, index) => {
                                                    if (category.value !== '') {
                                                        return <li key={category.id}>
                                                            <div className="form-check d-flex">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={category.id}
                                                                    value={category.id}
                                                                    checked={categoryId === category.id ? true : this.state.selectedCategories.includes(category.id)}   
                                                                    onChange={() => this.handleCatSelect(category.id)}
                                                                />
                                                                <label className="form-check-label" htmlFor={category.id}>{category.categoryName}</label>
                                                            </div>
                                                        </li>
                                                    } else {
                                                        return '';
                                                    }
                                                })}
                                            </ul> : ''
                                        } */}

                                        <ul className="filter_list">
                                            <li>
                                                <h3>Price</h3>
                                            </li>
                                            <li className="mb-5">
                                                <ReactSlider
                                                    className="horizontal-slider"
                                                    thumbClassName="thumb"
                                                    trackClassName="track"
                                                    value={this.state.range}
                                                    min={0}
                                                    max={100}
                                                    onChange={this.handleRangeChange}
                                                // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                                />
                                                <br />
                                                <span>Min: {this.state.range[0]}</span>
                                                <span>Max: {this.state.range[1]}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col">
                                        {/* <ListingHead title="Products" count={products.length} /> */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="cards_wrapper">
                                            <div className='prod_card'>
                                                {currentServiceData.length > 0 ? (
                                                    currentServiceData.map((item, index) =>
                                                        <div className="img_wrapper" key={index}>
                                                            <div className="btns_wrapper">
                                                                <div className="share_option shadow">

                                                                    {/* <span
                                                                    onClick={() =>
                                                                        inWishList ? removeToWishlist(data.id) : addToWishlist(data.id)
                                                                    }
                                                                >
                                                                    <img
                                                                        src={inWishList ? redHeartIcon : heartIconBordered}
                                                                        alt="heart-icon"
                                                                        title={`${inWishList ? "Remove" : "Add"} to wishlist`}
                                                                    />
                                                                </span> */}
                                                                </div>
                                                            </div>
                                                            <Link
                                                                to={`/service-detail/${item._id}`}
                                                            >
                                                                <img src={item.featuredImage} className="img-fluid" alt="..." />
                                                            </Link>
                                                            <p>{item.charges}</p>
                                                        </div>
                                                    )
                                                ) : "No Services Found"}
                                            </div>


                                            {/* {services.length > 0 ? (
                                                services.map((service) => (
                                                    <Link
                                                        key={service._id}
                                                        className="card"
                                                        to={`/service-detail/${service._id}`}
                                                    >
                                                        <div className="serviceListing-Image">
                                                            <img src={service.featuredImage} alt={service.name} />
                                                        </div>
                                                        <div className="serviceListing-content text-center">
                                                            <h3 className="m-auto">{service.name}</h3>
                                                            <div
                                                                className="service-desc m-auto p-2"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: service.description,
                                                                }}
                                                            ></div>
                                                            <div className="text-center">
                                                                <button
                                                                    type="button"
                                                                    className="btn custom_btn btn_yellow"
                                                                >
                                                                    View More
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )))
                                                : ""} */}

                                            <div className="cart-pagination">
                                                {data.length > 4 && (
                                                    <ul className="pagination-wrapper">
                                                        <li>
                                                            <button onClick={this.prevPage}>Prev</button>
                                                        </li>
                                                        {Array(Math.ceil(data.length / 4))
                                                            .fill()
                                                            .map((_, index) => (
                                                                <li key={index}>
                                                                    <button
                                                                        onClick={() => this.handlePageChange(index + 1)}
                                                                        className={this.state.currentPage === index + 1 ? "active" : ""}
                                                                    >
                                                                        {index + 1}
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        <li>
                                                            <button onClick={this.nextPage}>Next</button>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
                <GoToTop />
            </React.Fragment>
        );
    }
}

export default ServiceListing;