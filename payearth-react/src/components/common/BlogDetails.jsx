import React, { Component } from 'react';

import Footer from './Footer';
import Header from '../user/common/Header';
import axios from 'axios';
import store from '../../store/index';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Helmet } from 'react-helmet';
import { BannerTopIframe } from './BannerFrame';

class BlogDetail extends Component {
    constructor(props) {
        super(props);
        this.userInfo = store.getState().auth.userInfo;
        const { dispatch } = props;
        this.dispatch = dispatch;

        this.state = {
            blogDetails: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.getBlogDetails();
    }

    getBlogDetails = () => {
        const { slug } = this.props.match.params;
        console.log("slug", slug)
        // console.log("DetailsID", id)
        axios.get(`/front/blogDetail/${slug}`).then((response) => {
            console.log("Blog Detail : ", response.data.data)
            let result = response.data.data;

            var blogPostDetails = [];
            for (var i = 0; i < result.length; i++) {
                const numericalDate = new Date(result[0].updatedAt);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const date = numericalDate.toLocaleDateString('en-US', options);
                const content = result[0].description;
                const blogDescription = DOMPurify.sanitize(content);
                const description = <div className='blog-fullInfo' dangerouslySetInnerHTML={{ __html: blogDescription }}></div>
                blogPostDetails.push({
                    id: result[0]._id,
                    title: result[0].title,
                    category: result[0].category,
                    image: result[0].image,
                    description: description,
                    updatedAt: date,
                    seo: result[0].seo,
                    slug: result[0].slug,
                    seodescription: result[0].seodescription,
                    keywords: result[0].keywords
                })
                this.setState({ 'blogDetails': blogPostDetails, loading: false, error: null });
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    render() {
        const { blogDetails, loading, error } = this.state;

        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        console.log("blog Details under render", blogDetails)
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <div className="inr_top_page_title">
                    <h2>Blog Detail</h2>
                </div>
                <section className="inr_wrap mt-2">
                    {blogDetails.map(item => <>
                        <div className="container">
                            <BannerTopIframe keywords={item.keywords} />
                            <div className="row">
                                <div className="col-md-12 cart-single-page-wrapper">
                                    <div className="cart my_cart">
                                        <div className="cl_head ">
                                            <Helmet>
                                                <title>{`Blog-detail/${item.slug}`}</title>
                                                <meta name="description" content={item.seodescription} />
                                                <meta name="keywords" content={item.keywords} />
                                            </Helmet>
                                            <div className='cart-single-heading d-flex flex-row '>
                                                <h1>{item.title}</h1>

                                                <Link
                                                    to="#"
                                                    className="custom_btn btn_yellow w-auto btn mt-2  ms-auto"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.history.back();
                                                    }}
                                                >
                                                    Back
                                                </Link>

                                            </div>
                                            <div className='blog-list-meta'>
                                                <span className="post_cat_col">{item.category}</span>
                                                <span className="post_date_col">{item.updatedAt}</span>
                                            </div>
                                            {item.image === '' ? '' :
                                                <div className="blog-page-image" >
                                                    <img src={item.image} height={680} width={1080} alt="" loading="lazy" decoding="async" />
                                                </div>
                                            }
                                            <div className='blog-single-desc'>
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </>
                    )}
                </section>
                <Footer />
            </React.Fragment>

        );
    }
}

export default BlogDetail;