import React, { Component } from 'react';

import Footer from './Footer';
import Header from '../user/common/Header';
import axios from 'axios';
import store from '../../store/index';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import ScrollToTop from 'react-scroll-to-top';
import { setLoading } from '../../store/reducers/global-reducer';
import { Helmet } from 'react-helmet';

class PageDetail extends Component {
    constructor(props) {
        super(props);
        this.userInfo = store.getState().auth.userInfo;
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.state = {
            pageDetails: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.getPageDetails();
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params !== prevProps.match.params) {
            this.getPageDetails({ loading: true });
            window.scrollTo(0, 0);
        }
    }
    getPageDetails = () => {
        const { slug } = this.props.match.params;
        axios.get(`/front/pageDetail/${slug}`).then((response) => {
            // console.log("page Detail : ", response.data.data)
            let result = response.data.data;
            var pageDtls = [];
            for (var i = 0; i < result.length; i++) {
                const numericalDate = new Date(result[0].updatedAt);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const date = numericalDate.toLocaleDateString('en-US', options);
                const content = result[0].description;
                const pageDescription = DOMPurify.sanitize(content);
                const description = <div className='blog-fullInfo' dangerouslySetInnerHTML={{ __html: pageDescription }}></div>
                pageDtls.push({
                    id: result[0]._id,
                    title: result[0].pageTitle,
                    // category: result[0].category,
                    image: result[0].image,
                    description: description,
                    updatedAt: date,
                    seo: result[0].seo,
                    seodescription: result[0].seodescription,
                    keywords: result[0].keywords
                })
                this.setState({ 'pageDetails': pageDtls, loading: false, error: null });
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    render() {
        const { pageDetails, loading, error } = this.state;

        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        console.log("page Details under render", pageDetails)
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <section className="inr_wrap">
                    {pageDetails.map(item =>
                        <div className="container">
                            {/* <h4><i>  Title :  <b>{item.title}</b></i></h4> */}
                            <div className="col-md-12 cart-single-page-wrapper">
                                <div className="cart my_cart">
                                    <div className="cl_head ">
                                        <Helmet>
                                            <title>{item.seo}</title>
                                            <meta name="description" content={item.seodescription} />
                                            <meta name="keywords" content={item.keywords} />
                                        </Helmet>
                                        <div className='cart-single-heading'>
                                            <h1>{item.title}</h1>
                                        </div>
                                        <div className='blog-list-meta'>
                                            {/* <span class="post_cat_col">{item.category}</span>  */}
                                            {/* <span class="post_date_col">{item.updatedAt}</span> */}
                                        </div>
                                        {item.image == '' ? '' : <div className="blog-page-image" >
                                            <img src={item.image} height={680} width={1080} alt="" />
                                        </div>}
                                        {/* <div className="blog-page-image" >
                                            <img src={item.image} height={680} width={1080} alt="" />
                                        </div> */}
                                        <div className='blog-single-desc'>
                                            {item.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}

export default PageDetail;