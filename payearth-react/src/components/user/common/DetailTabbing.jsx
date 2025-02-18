import React, { Component } from 'react';
import axios from 'axios';
import { setLoading } from '../../../store/reducers/global-reducer';
import yellowStar from './../../../assets/images/yellow-star.svg';
import { connect } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import config from '../../../config.json';
import parse from 'html-react-parser';
import ProductModal from "./ProductModel";
import { FaTrash } from "react-icons/fa";
import Rating from "../../common/Rating";

class DetailTabbing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authInfo: '',
            productId: null,
            ratingsCount: {},
            reviewCount: '',
            reviews: [],
            averageRating: '',
            ratings: [],
            progresOne: {
                width: '0%'
            },
            progresTwo: {
                width: '0%'
            },
            progresThree: {
                width: '0%'
            },
            progresFour: {
                width: '0%'
            },
            progresFive: {
                width: '0%'
            },
            isModalOpen: false
        };
        this.fetchRatingCount = this.fetchRatingCount.bind(this);
        this.fetchRating = this.fetchRating.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        // console.log("nextProps--", nextProps);

        this.setState({
            productId: nextProps.id,
            // reviews: nextProps.reviews,
        });

        if (!_isEqual(nextProps.id, this.state.productId)) {
            this.fetchRatingCount(nextProps.id);
            this.fetchRating(nextProps.id);
        }
    }

    componentDidMount() {

        const authInfo = JSON.parse(localStorage.getItem("authInfo"));
        if (authInfo) {
            this.setState({ authInfo });
        }
         console.log('componentDidMount---authInfo', authInfo)

    }

    fetchRating(productId) {
        const { dispatch } = this.props;

        dispatch(setLoading({ loading: true })); // Optional: Set loading state

        axios
            .get(`front/product/reviews/${productId}`)
            .then((response) => {
                console.log("product/rating/ response", response);

                // if (response.data.status) {
                //     let ratings = response.data.data;
                //     this.setState({
                //         reviews: ratings,
                //     });
                // }

                if (response.data.status) {
                    const reviews = response.data.data.reviews; // Extract the reviews array
                    const reviewCount = response.data.data.reviewCount;

                    // Calculate the average rating
                    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
                    const averageRating = totalRatings / reviewCount;

                    console.log("Average Rating:", averageRating);

                    // Update the state
                    this.setState({
                        reviews: response.data.data,
                        averageRating: averageRating.toFixed(1),
                        reviewCount: reviewCount
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching rating count:", error);
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading({ loading: false })); // Optional: Remove loading state
                }, 300);
            });
    }


    fetchRatingCount(productId) {
        const { dispatch } = this.props;

        dispatch(setLoading({ loading: true })); // Optional: Set loading state

        axios
            .get(`front/product/rating-count/${productId}`)
            .then((response) => {
                console.log("product/rating-count/ response", response.data.data);

                // if (response.data.status) {
                //     let ratingsCount = response.data.data[0];
                //     this.setState({
                //         ratingsCount: ratingsCount,
                //         progresOne: { width: ((ratingsCount[1] / 5) * 100) + "%" },
                //         progresTwo: { width: ((ratingsCount[2] / 5) * 100) + "%" },
                //         progresThree: { width: ((ratingsCount[3] / 5) * 100) + "%" },
                //         progresFour: { width: ((ratingsCount[4] / 5) * 100) + "%" },
                //         progresFive: { width: ((ratingsCount[5] / 5) * 100) + "%" },
                //     });
                // }

                if (response.data.status) {
                    let ratingsCount = response.data.data; // Directly use the object

                    this.setState({
                        ratingsCount: ratingsCount,
                        progresOne: { width: ((ratingsCount[1] / 5) * 100) + "%" },
                        progresTwo: { width: ((ratingsCount[2] / 5) * 100) + "%" },
                        progresThree: { width: ((ratingsCount[3] / 5) * 100) + "%" },
                        progresFour: { width: ((ratingsCount[4] / 5) * 100) + "%" },
                        progresFive: { width: ((ratingsCount[5] / 5) * 100) + "%" },
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching rating count:", error);
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch(setLoading({ loading: false }));
                }, 300);
            });
    }

    // Call the modular function when props change

    // componentWillReceiveProps(nextProps) {
    //     console.log('nextProps--', nextProps)
    //     this.setState({
    //         productId: nextProps.id,
    //         reviews: nextProps.reviews
    //     });

    //     if (!_isEqual(nextProps.id, this.state.productId)) {
    //         const { dispatch, id } = nextProps;
    //         axios.get('front/product/rating-count/' + id).then((response) => {
    //             console.log('product/rating-count/  response', response)
    //             if (response.data.status) {
    //                 let ratingsCount = response.data.data[0];
    //                 this.setState({
    //                     ratingsCount: ratingsCount,
    //                     progresOne: { width: ((ratingsCount[1] / 5) * 100) + '%' },
    //                     progresTwo: { width: ((ratingsCount[2] / 5) * 100) + '%' },
    //                     progresThree: { width: ((ratingsCount[3] / 5) * 100) + '%' },
    //                     progresFour: { width: ((ratingsCount[4] / 5) * 100) + '%' },
    //                     progresFive: { width: ((ratingsCount[5] / 5) * 100) + '%' }
    //                 });
    //             }
    //         }).catch(error => {
    //             console.log(error)
    //         }).finally(() => {
    //             setTimeout(() => {
    //                 dispatch(setLoading({ loading: false }));
    //             }, 300);
    //         });
    //     }
    // }

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    formatDate = (date) => {
        return `${new Date(date).getDate()}-${new Date(date).getMonth() + 1
            }-${new Date(date).getFullYear()}`;
    };

    renderStarRating = (ratingValue) => {
        const stars = [];
        const fullStars = Math.floor(ratingValue);
        const hasHalfStar = ratingValue - fullStars >= 0.5;
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

    deleteReview = async (reviewId, authInfo) => {
        try {
            const  headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
            await axios.delete(`/user/delete-product-review/${reviewId}`, { headers });
            this.fetchRatingCount(this.state.productId)
            this.fetchRating(this.state.productId);
            // fetchApi();
            //toast.success("Review Deleted Successfully");
        } catch (error) {
            //toast.error("Review hasn't been deleted");
            console.log("Error deleting review:", error);
        }
    };

    render() {

        const { authInfo, isModalOpen, productId, reviews, averageRating, reviewCount } = this.state;
         console.log('authInfo---', authInfo)
        // console.log('productId---', productId)
        console.log('reviews--output-', reviews)
        return (
            <section className="prod_details_sec" ref={this.props.ref}>
                <div className="container">
                    <div className="row">
                        <div className="com-sm-12">
                            <div className="detail_tab">
                                <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
                                    {this.props.specifications ?
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="specifications-tab" data-bs-toggle="tab" data-bs-target="#specifications" type="button" role="tab" aria-controls="specifications" aria-selected="false">Specifications</button>
                                        </li>
                                        : ''}

                                    {this.props.description ?
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="description-tab" data-bs-toggle="tab" data-bs-target="#description" type="button" role="tab" aria-controls="description" aria-selected="false">Description</button>
                                        </li>
                                        : ''}

                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="riviews-tab" data-bs-toggle="tab" data-bs-target="#riviews" type="button" role="tab" aria-controls="riviews" aria-selected="true">Reviews</button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="myTabContent">
                                    {this.props.specifications ?
                                        <div className="tab-pane fade " id="specifications" role="tabpanel" aria-labelledby="specifications-tab">
                                            <p>{parse(this.props.specifications)}</p>
                                        </div>
                                        : ''}

                                    {this.props.description ?
                                        <div className="tab-pane fade" id="description" role="tabpanel" aria-labelledby="description-tab">
                                            <p className="mb-0">{parse(this.props.description)}</p>
                                        </div>
                                        : ''}

                                    <div className="tab-pane review fade show active" id="riviews" role="tabpanel" aria-labelledby="riviews-tab">
                                        <div className="row">
                                            <div className="r_col col-sm-12 col-md-3">
                                                <div className="box_wrapper">
                                                    <div className="reviews_box">
                                                        <p className="review_count" > Average Rating: {averageRating} ({reviewCount || 0} Reviews)</p>
                                                        <p className="rating_point d-inline-flex align-items-center">
                                                            {this.renderStarRating(averageRating)}
                                                            {/* <Rating avgRating={averageRating} /> */}
                                                        </p>
                                                        <ul className="review_status">
                                                            <li>
                                                                <span className="s_no">5</span>
                                                                <span className="progress_bar"><i className="progress" style={this.state.progresFive}></i></span>
                                                                <span className="count">{this.state.ratingsCount[5]}</span>
                                                            </li>
                                                            <li>
                                                                <span className="s_no">4</span>
                                                                <span className="progress_bar"><i className="progress" style={this.state.progresFour}></i></span>
                                                                <span className="count">{this.state.ratingsCount[4]}</span>
                                                            </li>
                                                            <li>
                                                                <span className="s_no">3</span>
                                                                <span className="progress_bar"><i className="progress" style={this.state.progresThree}></i></span>
                                                                <span className="count">{this.state.ratingsCount[3]}</span>
                                                            </li>
                                                            <li>
                                                                <span className="s_no">2</span>
                                                                <span className="progress_bar"><i className="progress" style={this.state.progresTwo}></i></span>
                                                                <span className="count">{this.state.ratingsCount[2]}</span>
                                                            </li>
                                                            <li>
                                                                <span className="s_no">1</span>
                                                                <span className="progress_bar"><i className="progress" style={this.state.progresOne}></i></span>
                                                                <span className="count">{this.state.ratingsCount[1]}</span>
                                                            </li>
                                                        </ul>

                                                        <button className={`btn custom_btn btn_yellow_bordered w-auto d-inline-block ${!authInfo || authInfo.id === undefined ? "disabled" : ""}`}
                                                            onClick={() => authInfo && authInfo.id !== undefined && this.openModal()}>
                                                            Write a review
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-9">
                                                {/* <div className="reviews_comments_box"> */}
                                                <div className="reviews_comments_box overflow-auto" style={{ maxHeight: "410px" }} >
                                                    {/* {reviews?.reviews && reviews.reviews?.length ? reviews.reviews.map((value, index) => { */}
                                                    {/* {reviews?.reviews && reviews.reviews?.length
                                                        ? reviews.reviews.map((value, index) => {
                                                            return <div className="user_comment_box" key={index}>
                                                                <p className="title">{value.review.title}</p>
                                                                <p className="feedback">{value.review.description}</p>
                                                                <p className="date mb-0">{value.userId.name} | {`${new Date(value.createdAt).getDate()}-${new Date(value.createdAt).getMonth() + 1}-${new Date(value.createdAt).getFullYear()}`}</p>
                                                                <p className="reviewImages">
                                                                    {value.reviewImages.length > 0 ? value.reviewImages.map((img, i) => {
                                                                        return <img src={config.apiURI + img} className="img-fluid" alt="..." key={i} />
                                                                    }) : ''}
                                                                </p>
                                                            </div>
                                                        }) : ''} */}

                                                    {
                                                        reviews?.reviews && Array.isArray(reviews.reviews) && reviews.reviews.length > 0 ? (
                                                            reviews.reviews.map((reviewData, index) => (
                                                                // <div key={reviewData._id}> {/* Use review._id as key */}
                                                                //     <p>{reviewData.review.comment || "No comment available"}</p> {/* Assuming review.comment holds the comment */}
                                                                //     <span>{reviewData.rating || "No rating"} stars</span>
                                                                // </div>
                                                                <div className="user_comment_box" key={index}>
                                                                    <div className="d-flex align-items-center">
                                                                        <p className="title mr-auto">
                                                                            {reviewData?.review.title}
                                                                        </p>
                                                                        {reviewData?.userId?.id === authInfo.id && (
                                                                            <button
                                                                                style={{ marginTop: "-14px", float: "right" }}
                                                                                className="btn btn-link text-danger"
                                                                                onClick={() => this.deleteReview(reviewData._id, authInfo)} // Updated here
                                                                            >
                                                                                <FaTrash />
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    <p className="feedback">
                                                                        {reviewData.review.description}
                                                                    </p>
                                                                    <p className="rating">
                                                                        {this.renderStarRating(reviewData.rating)}
                                                                    </p>
                                                                    <p className="date mb-0">
                                                                        {reviewData.userId?.name} |{" "}
                                                                        {this.formatDate(reviewData.createdAt)}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p>No reviews available.</p>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={this.closeModal}
                    productId={this.state.productId}
                    authInfo={authInfo}
                    fetchApi={() => this.fetchRatingCount(this.state.productId)}
                    fetchRating={() => this.fetchRating(this.state.productId)}
                />
            </section>

        );
    }
}

export default connect(setLoading)(DetailTabbing);