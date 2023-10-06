import React, { Component } from 'react';
import axios from 'axios';
import { setLoading } from '../../../store/reducers/global-reducer';
import yellowStar from './../../../assets/images/yellow-star.svg';
import { connect } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import config from '../../../config.json';
import parse from 'html-react-parser';

class DetailTabbing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: null,
            ratingsCount: {},
            reviews: [],
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
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            productId: nextProps.id,
            reviews: nextProps.reviews
        });

        if(!_isEqual(nextProps.id, this.state.productId)){
            const { dispatch, id } = nextProps;

            axios.get('front/product/rating-count/' + id).then((response) => {
                if (response.data.status) {
                    let ratingsCount = response.data.data[0];
                    this.setState({
                        ratingsCount: ratingsCount,
                        progresOne: {width: ((ratingsCount[1] / 5) * 100) + '%'},
                        progresTwo: {width: ((ratingsCount[2] / 5) * 100) + '%'},
                        progresThree: {width: ((ratingsCount[3] / 5) * 100) + '%'},
                        progresFour: {width: ((ratingsCount[4] / 5) * 100) + '%'},
                        progresFive: {width: ((ratingsCount[5] / 5) * 100) + '%'}
                    });
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoading({loading: false}));
                }, 300);
            });
        }
    }

    render() {
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
                                                        <p className="review_count" >{this.props.reviewsCount} Reviews</p>
                                                        <p className="rating_point d-inline-flex align-items-center"><img src={yellowStar} alt="yellow-star" /> {this.props.avgRating ? this.props.avgRating.toFixed(1) : ''}</p>
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

                                                        <button className="btn custom_btn btn_yellow_bordered w-auto d-inline-block">Write a review</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12 col-md-9">
                                                <div className="reviews_comments_box">
                                                    {this.state.reviews && this.state.reviews.length ? this.state.reviews.map((value, index) => {
                                                        return <div className="user_comment_box" key={index}>
                                                                    <p className="title">{value.review.title}</p>
                                                                    <p className="feedback">{value.review.description}</p>
                                                                    <p className="date mb-0">{value.userId.name} | {`${new Date(value.createdAt).getDate()}-${new Date(value.createdAt).getMonth() + 1}-${new Date(value.createdAt).getFullYear()}`}</p>
                                                                    <p className="reviewImages">
                                                                        {value.reviewImages.length > 0 ? value.reviewImages.map((img, i) => {
                                                                            return <img src={config.apiURI+img} className="img-fluid" alt="..."  key={i} />
                                                                        }) : '' }
                                                                    </p>
                                                                </div>
                                                    }) : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(setLoading)(DetailTabbing);