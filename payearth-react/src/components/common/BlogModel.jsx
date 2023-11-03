import React, { Component } from 'react';
import Footer from './Footer';
import Header from '../user/common/Header';
import axios from 'axios';
import store from '../../store/index';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import noImg from './../../assets/images/noimage.png'
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

class Blog extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.userInfo = store.getState().auth.userInfo;
        this.state = {
            blogs: [],
            currentPage: 1,
            itemsPerPage: 3,
            searchQuery: '',
            textlimit: 70,
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.getBlog();
    }

    getBlog = () => {
        const { textlimit } = this.state;
        let status = "published"
        axios.get(`/front/publishBlog/${status}`).then((response) => {
            let result = response.data.data;
            // console.log("res blog data", result)
            var blogPostData = [];
            result.map(function (item, index) {
                const numericalDate = new Date(item.updatedAt);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const date = numericalDate.toLocaleDateString('en-US', options);
                blogPostData.push({
                    id: item._id,
                    title: item.title,
                    shortdescription: item.shortdescription,
                    slug: item.slug,
                    image: item.image,
                    updatedAt: date,
                    category: item.category,
                    seo: item.seo,
                    seodescription: item.seodescription,
                    keywords: item.keywords
                });
            })
            this.setState({ 'blogs': blogPostData, loading: false, error: null })
        }).catch(error => {
            console.log(error)
        })
    }

    blogDetails = (slug) => {
        this.props.history.push(`/blog-detail/${slug}`);
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value, currentPage: 1 });
    }

    prevPage = () => {
        this.setState({
            currentPage: this.state.currentPage - 1,
        });
    }
    // Function to go to the next page
    nextPage = () => {
        this.setState({
            currentPage: this.state.currentPage + 1,
        });
    };

    render() {
        const { blogs, currentPage, itemsPerPage, searchQuery, loading, error } = this.state;
        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        // Filter 
        const filteredItems = blogs.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Pagination logic
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const blogData = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <div className="inr_top_page_title">
                    <h2>Blog</h2>
                </div>
                <section className="inr_wrap">
                    <Helmet><title>{"Blog - Pay Earth"}</title></Helmet>
                    <div className="container">
                        <div className="col-md-12">
                            <div className="cart my_cart">
                                <div className="cl_head">
                                    <div className='blog-search-wrapper'>
                                        <input type="text" class="form-control" placeholder="Search" value={searchQuery} onChange={this.handleSearch} />
                                    </div>
                                    <div className="blog_listing_wrapper">
                                        {blogData.map(item =>
                                            <div className=" col-md-4 blog_item">
                                                <div className='blog-inner-panel'>
                                                    {item.image == '' ? <div className='blog-image'>
                                                        <img src={noImg} height={200} width={300} alt="" />
                                                    </div> : <div className='blog-image'>
                                                        <Link to={`/blog-detail/${item.slug}`}>
                                                            <img src={item.image} height={200} width={300} alt="" />
                                                        </Link>
                                                    </div>}
                                                    <div className='blog-list-meta'>
                                                        <Link to={`/blog-detail/${item.slug}`}><span class="post_cat_col">{item.category}</span></Link>
                                                        <span class="post_date_col">{item.updatedAt}</span>
                                                    </div>
                                                    <div className='blog-info'>
                                                        <Link to={`/blog-detail/${item.slug}`}> <h3 className='blog-headings'>{item.title}</h3></Link>
                                                        <div className="blogShortinfo">
                                                            <p>{item.shortdescription}</p>
                                                        </div>
                                                    </div>
                                                    <div className='cart-btn'>
                                                        <button onClick={() => this.blogDetails(item.slug)}>
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='cart-pagination'>
                                    <ul className="pagination-wrapper">
                                        <button onClick={this.prevPage} disabled={currentPage === 1}>
                                            PREV
                                        </button>
                                        {Array(Math.ceil(filteredItems.length / itemsPerPage))
                                            .fill().map((_, index) => <div>
                                                <button key={index} className={currentPage === index + 1 ? 'active' : ''} onClick={() => this.handlePageChange(index + 1)} >
                                                    {index + 1}
                                                </button>
                                            </div>)}
                                        <button onClick={this.nextPage} disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}>
                                            NEXT
                                        </button>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}

export default Blog;