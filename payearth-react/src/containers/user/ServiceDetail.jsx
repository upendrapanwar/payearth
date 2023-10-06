
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GoToTop from '../../helpers/GoToTop';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from './../../components/common/Footer';
import ServiceView from './../../components/user/service-detail/ServiceView';
import axios from 'axios';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import Rating from '../../components/common/Rating';
import config from '../../config.json';
import twitterIcon from './../../assets/icons/twitter.svg';
import linkedinIcon from './../../assets/icons/linkedin.svg';
import fbIcon from './../../assets/icons/facebook.svg';
import whatsappIcon from './../../assets/icons/whatsapp.svg';
import SimilarProducts from '../../components/user/common/SimilarProducts';
import DetailTabbing from '../../components/user/common/DetailTabbing';
import parse from 'html-react-parser';

class ServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef()
        this.state = {
            serviceDetail: {},
            featuredImg: '',
            similarServices:[]
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        let serviceId = window.location.pathname.split('/')[2];

        axios.get('front/service/detail/' + serviceId).then((response) => {
            if (response.data.status) {
                this.setState({
                    serviceDetail: response.data.data,
                    featuredImg: response.data.data.featuredImage,
                });
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });

        axios.get('front/product/similar-products/' + serviceId).then((response) => {
            let servicesData = [];

            if (response.data.status) {
                let res = response.data.data;
                res.forEach(service => {
                    servicesData.push({
                        id: service.id,
                        image: config.apiURI + service.featuredImage,
                        name: service.name,
                        isService: service.isService,
                        price: service.price,
                        avgRating: service.avgRating,
                        videoCount:service.videoCount
                    });
                });
            }
            this.setState({similarServices: servicesData});
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.history.location.pathname !== prevProps.location.pathname) this.componentDidMount();
    }

    scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop)

    render() {
        return (
            <React.Fragment>
                <Header />
                <PageTitle title={this.state.serviceDetail.name} />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row g-0 bg-white rounded">
                            <div className="col-md-7">
                                <ServiceView featuredImg={this.state.featuredImg}/>
                            </div>
                            <div className="col-md-5">
                                <div className="prod_dtl_info">
                                    <div className="prod_dtl_body">
                                        <div className="pdi_ratings">
                                            <Rating avgRating={this.state.serviceDetail.avgRating} />
                                            <Link to="#" className="reviews_count" onClick={this.scrollToMyRef}>( {this.state.serviceDetail.reviewCount} Reviews )</Link>
                                        </div>
                                        <div className="pdi_price">
                                            {/* <b>{this.state.serviceDetail.price} USD</b> OR <b>0.5 BTC</b> */}
                                            <b>{this.state.serviceDetail.price} USD</b>
                                        </div>
                                        <div className="pdi_avblty">
                                            Availability: {this.state.serviceDetail.quantity && parseInt(this.state.serviceDetail.quantity.stock_qty) > 0 ? <span>In stock</span> : <span className="text-danger">Out of stock</span>} | Product Code : <span>{this.state.serviceDetail.productCode}</span>
                                        </div>
                                        <div className="pdi_desc">
                                            <p>{this.state.serviceDetail.description ? parse(this.state.serviceDetail.description) : ''}</p>
                                        </div>
                                        {this.state.serviceDetail.videos  && this.state.serviceDetail.videos.length > 0 ?
                                            <ul className="ep_list">
                                                <li><h5>Episodes : {this.state.serviceDetail.videoCount}</h5></li>
                                                {this.state.serviceDetail.videos.map((value, index) => {
                                                    if (index <= 3) {
                                                        return  <li key={index} className="ep_thumbs"><Link to="#"><img src={config.apiURI+value.video.thumb} alt={value.video.title} /></Link></li>
                                                    } else {
                                                        return false
                                                    }
                                                })}
                                                {this.state.serviceDetail.videos.length > 5 ?
                                                    <li className="ep_thumbs eps_more" >
                                                        <div className="more_eps"><span>{this.state.serviceDetail.videos.length-5}+</span></div>
                                                        <Link to="#"><img src={config.apiURI+this.state.serviceDetail.videos[4].video.thumb} alt="this.state.serviceDetail.videos[4].video.title" /></Link>
                                                    </li>
                                                : "" }
                                            </ul>
                                        : ""}

                                        {this.state.serviceDetail.quantity && this.state.serviceDetail.quantity.stock_qty > 0 ?
                                            <div className="prod_foot">
                                                <Link className="btn custom_btn btn_yellow_bordered" to="#">Add to cart</Link>
                                                <Link className="btn custom_btn btn_yellow" to="#">Buy Now</Link>
                                            </div>
                                        : ''}
                                    </div>

                                    <div className="pdi_share">
                                        <div className="pdi_seller">
                                            Seller : <b>{this.state.serviceDetail.createdBy ? this.state.serviceDetail.createdBy.name : ''}</b> <span className="rate_sts"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 6.18179L10.1863 5.79957L7.99681 0.299072L5.80734 5.79957L0 6.18179L4.45419 9.96385L2.99256 15.701L7.99681 12.5379L13.0011 15.701L11.5395 9.96385L16 6.18179Z" fill="#ffffff"/>
                                                </svg> 4.5</span>
                                        </div>
                                        <div className="pdi_share_links">Share :
                                            <Link to="#"><img src={twitterIcon} alt="twitter" className="img-fluid ms-2" /></Link>
                                            <Link to="#"><img src={linkedinIcon} alt="linkedin" className="img-fluid ms-2" /></Link>
                                            <Link to="#"><img src={fbIcon} alt="facebook" className="img-fluid ms-2" /></Link>
                                            <Link to="#"><img src={whatsappIcon} alt="whatsapp" className="img-fluid ms-2" /></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div ref={this.myRef}>
                    <DetailTabbing
                        id={this.state.serviceDetail.id}
                        specifications={this.state.serviceDetail.specifications}
                        description={this.state.serviceDetail.description}
                        reviews={this.state.serviceDetail.reviews}
                        avgRating={this.state.serviceDetail.avgRating}
                        reviewsCount={this.state.serviceDetail.reviewCount}
                    />
                </div>

                {this.state.similarServices && this.state.similarServices.length > 0  ?
                    <SimilarProducts
                        products={this.state.similarServices}
                        isService={true}
                    />
                : "" }
                <Footer />
                <GoToTop/>
            </React.Fragment>
        );
    }
}

export default connect(setLoading) (ServiceDetail);