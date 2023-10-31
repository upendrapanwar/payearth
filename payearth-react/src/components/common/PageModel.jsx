import React, { Component } from 'react';

import Footer from './Footer';
import Header from '../user/common/Header';
import axios from 'axios';
import store from '../../store/index';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpinnerLoader from './SpinnerLoader';


class PageModel extends Component {
    constructor(props) {
        super(props);
        this.userInfo = store.getState().auth.userInfo;
        const { dispatch } = props;
        this.dispatch = dispatch;

        this.state = {
            pages: [],
            currentPage: 1,
            itemsPerPage: 1,
            searchQuery: '',
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.getPage();
    }

    getPage = () => {
        let status = "published"
        axios.get(`/front/publishPage/${status}`).then((response) => {
            let result = response.data.data;
            console.log("res page data", result)
            var blogPageData = [];
            result.map(function (item, index) {
                const numericalDate = new Date(item.updatedAt);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const date = numericalDate.toLocaleDateString('en-US', options);
                const blogDescription = DOMPurify.sanitize(item.description);
                const description = < div className='cart-headings' dangerouslySetInnerHTML={{ __html: blogDescription }}></div>

                blogPageData.push({
                    id: item._id,
                    title: item.pageTitle,
                    description: description,
                    seo: item.seo,
                    image: item.image,
                    updatedAt: date,
                });
            })
            this.setState({ 'pages': blogPageData, loading: false, error: null })
        }).catch(error => {
            console.log(error)
        })
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
        const { pages, currentPage, itemsPerPage, searchQuery, loading, error } = this.state;
        console.log('pages : unde render', pages)

        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        const filteredItems = pages.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Pagination logic
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const pageData = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

        return (
            <React.Fragment>

                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <section className="inr_wrap">
                    <div className='blog-search-wrapper'>
                        <input
                            type="text" className="form-control"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={this.handleSearch}
                        />
                    </div>
                    {pageData.map(item =>
                        <div className="container">
                            {/* <h4><i>  Title :  <b>{item.title}</b></i></h4> */}
                            <div className="col-md-12 cart-single-page-wrapper">
                                <div className="cart my_cart">
                                    <div className="cl_head ">

                                        <div className='cart-single-heading'>
                                            <h1>{item.title}</h1>
                                        </div>
                                        <div className='blog-list-meta'>
                                            {/* <span class="post_cat_col">{item.category}</span>  */}
                                            <span class="post_date_col">{item.updatedAt}</span>
                                        </div>

                                        <div className="blog-page-image" >
                                            <img src={item.image} height={680} width={1080} alt="" />
                                        </div>
                                        <div className='blog-single-desc'>
                                            {item.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
                <div className='cart-pagination'>
                    <ul className="pagination-wrapper"> 
                        <button
                            onClick={this.prevPage}
                            disabled={currentPage === 1}
                        >
                            PREV
                        </button>
                        {Array(Math.ceil(filteredItems.length / itemsPerPage))
                            .fill()
                            .map((_, index) => <div>
                                <button
                                    key={index}
                                    className={currentPage === index + 1 ? 'active' : ''}
                                    onClick={() => this.handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </div>
                            )}
                        <button
                            onClick={this.nextPage}
                            disabled={itemsPerPage !== pageData.length}
                        >
                            NEXT
                        </button>
                    </ul>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default PageModel;

