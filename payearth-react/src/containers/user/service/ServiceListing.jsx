import React, { Component, useState } from "react";
import Header from "../../../components/user/common/Header";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/user/common/PageTitle";
import Sidebar from "../../../components/user/common/Sidebar";
import Footer from "../../../components/common/Footer";
import ListingHead from "../../../components/user/common/ListingHead";
import ProductCard from "../../../components/common/ProductCard";
import { NotFound } from "../../../components/common/NotFound";
import SpinnerLoader from "../../../components/common/SpinnerLoader";
import config from "../../../config.json";
import axios from "axios";
import store from "../../../store/index";
import {
  setProducts,
  setReqBody,
  setTotalProducts,
  setMaxPrice,
} from "../../../store/reducers/product-reducer";
import { setLoading } from "../../../store/reducers/global-reducer";
import { connect } from "react-redux";
import readUrl from "../../../helpers/read-product-listing-url";
import { getBrands, getColors } from "../../../helpers/product-listing";
import GoToTop from "../../../helpers/GoToTop";
import ReactSlider from "react-slider";

class ServiceListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reqBody: JSON.parse(
        JSON.stringify({ ...store.getState().product.reqBody })
      ),
      products: [],
      loading: false,
      maxPrice: 0,
      servicesCategory: "",
      categoryId: this.getQueryParam("cat"),
      services: "",
      selectedCategories: [],
      currentPage: 1,
      itemsPerPage: 4,
      range: [0, 100],
      filteredData: [],
    };
  }
  //const [averageRating, setAverageRating] = useState(0);

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
      const newCategoryId = this.getQueryParam("cat");
      this.setState({ categoryId: newCategoryId }, () => {
        this.getServices();
        // this.handleCatSelect(newCategoryId);
      });
    }
    if (
      prevState.services !== this.state.services ||
      prevState.range !== this.state.range
    ) {
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
      const url = "front/getServiceCategory";
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      });
      this.setState({ servicesCategory: response.data.data });
    } catch (error) {
      console.log("error", error);
    }
  };

  getServices = async () => {
    const categoryId = this.getQueryParam("cat");
    try {
      const response = await axios.get(
        `front/getServicesByCategory/${categoryId}`,
        {
          params: { categories: this.state.selectedCategories.join(",") },
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );
      this.setState({ services: response.data.data });
      // console.log("all service data------", response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  handleCatSelect = (categoryId) => {
    this.setState((prevState) => {
      const selectedCategories = prevState.selectedCategories.includes(
        categoryId
      )
        ? prevState.selectedCategories.filter((id) => id !== categoryId)
        : [...prevState.selectedCategories, categoryId];
      return { selectedCategories };
    }, this.getServices);
  };

  handleServiceData = (data) => {
    // console.log("header selected data :", data)
    this.setState({
      services: data,
      selectedCategories: [],
      categoryId: "",
      range: [0, 100],
      filteredData: [],
    });
  };
  // range
  filterData() {
    const [minRange, maxRange] = this.state.range;
    const filteredData = this.state.services.filter(
      (item) => item.charges >= minRange && item.charges <= maxRange
    );
    console.log("filteredData", filteredData);
    this.setState({ filteredData: filteredData });
  }

  handleRangeChange = (value) => {
    this.setState({ range: value });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  nextPage = () => {
    const { filteredData, services } = this.state;
    const data = filteredData.length === 0 ? services : filteredData;
    const totalPages = Math.ceil(data.length / 4);
    // console.log("totalPages : >", totalPages)
    if (this.state.currentPage < totalPages) {
      this.setState((prevState) => ({
        currentPage: prevState.currentPage + 1,
      }));
    }
  };

  prevPage = () => {
    if (this.state.currentPage > 1) {
      this.setState((prevState) => ({
        currentPage: prevState.currentPage - 1,
      }));
    }
  };

  renderStarRating = (item) => {
    // console.log("its item", item);
    const totalRating = item.reviews.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    const average = totalRating / item.reviews.length;
    //console.log(" service average------", average);

    const stars = [];
    const fullStars = Math.floor(average);
    const hasHalfStar = average - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<li className="star rated" key={i}></li>);
      } else if (hasHalfStar && i === fullStars) {
        stars.push(<li className="star half-star" key={i}></li>);
      } else {
        stars.push(<li className="star" key={i}></li>);
      }
    }
    return <ul className="rating">{stars}</ul>;
  };

  render() {
    const { loading } = store.getState().global;
    const {
      servicesCategory,
      services,
      categoryId,
      currentPage,
      itemsPerPage,
      filteredData,
    } = this.state;
    const data = filteredData.length === 0 ? services : filteredData;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentServiceData = data.slice(indexOfFirstItem, indexOfLastItem);

    console.log("currentServiceData", currentServiceData);
    //console.log('itam----',)
    return (
      <React.Fragment>
        {loading === true ? <SpinnerLoader /> : ""}
        <Header
          pageName="service-listing"
          sendServiceData={this.handleServiceData}
        />
        <PageTitle title="Service Listing" />
        <section className="inr_wrap">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="side_bar">
                  <div className="filters">
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
                  <div className="col"></div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="cards_wrapper w-100 d-md-flex flex-column">
                      <div className=" w-100 d-md-flex flex-row ">
                        {currentServiceData.length > 0
                          ? currentServiceData.map((item, index) => (
                              <div className=" serv_card" key={index}>
                                <div className="img_wrapper">
                                  {/* <div className="btns_wrapper">
                                    <div className="share_option shadow"></div>
                                  </div> */}
                                  <Link to={`/service-detail/${item._id}`}>
                                    <img
                                      src={item.featuredImage}
                                      className="img-fluid"
                                      alt="..."
                                    />
                                  </Link>
                                </div>
                                <div className="prod_info_head">
                                  <div className="prod_info">
                                    {/* {this.getAverageRating(item)} */}
                                    {/* <p> Average Rating:{AverageRating}</p>; */}
                                    <p className="rating_point ">
                                      {this.renderStarRating(item)}
                                    </p>
                                    <p className="product_name">
                                      <Link
                                        to={
                                          data.isService === false
                                            ? `/product-detail/${item._id}`
                                            : `/service-detail/${item._id}`
                                        }
                                      >
                                        {item.name}
                                      </Link>
                                    </p>
                                    <p className="review_count">
                                      {/* Average Rating: {averageRating.toFixed(1)} */}
                                    </p>
                                  </div>

                                  <div className="priceData">
                                    <p className="price ">{item.charges} $</p>
                                  </div>
                                </div>
                                <div className="d-grid gap-2 col-6 mx-auto mb-2 ">
                                  <Link
                                    className="btn btn_yellow"
                                    to={`/service-detail/${item._id}`}
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            ))
                          : "No Services Found"}
                      </div>
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
                                    onClick={() =>
                                      this.handlePageChange(index + 1)
                                    }
                                    className={
                                      this.state.currentPage === index + 1
                                        ? "active"
                                        : ""
                                    }
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
