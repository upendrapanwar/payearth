import React, { Component } from 'react';
import Footer from './Footer';
import Header from '../user/common/Header';
import axios from 'axios';
import store from '../../store/index';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DOMPurify from 'dompurify';


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
                // const date = new Date(item.updatedAt).toLocaleString()
<<<<<<< HEAD

=======
              
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
                // const testDescription = content.slice(0, textlimit);
                // const blogDescription = DOMPurify.sanitize(testDescription);
                // const description = < div className='cart-headings' dangerouslySetInnerHTML={{ __html: blogDescription }}>

                // </div>

                // console.log("description", description)
                blogPostData.push({
                    id: item._id,
                    title: item.title,
<<<<<<< HEAD
                    shortdescription: item.shortdescription,
                    slug: item.slug,
                    seo: item.seo,
                    image: item.image,
                    updatedAt: date,
                    category: item.category
=======
                    shortdescription : item.shortdescription,
                 
                    seo: item.seo,
                    image: item.image,
                    updatedAt: date,
                    category : item.category
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
                });
            })
            this.setState({ 'blogs': blogPostData, loading: false, error: null })
        }).catch(error => {
            console.log(error)
        })
    }

<<<<<<< HEAD
    blogDetails = (slug) => {
        this.props.history.push(`/blog-detail/${slug}`);
=======
    blogDetails = (id) => {
        this.props.history.push(`/blog-detail/${id}`);
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
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

        console.log("blog", blogs)
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
                    <div className="container">
                        <div className="col-md-12">
                            <div className="cart my_cart">
                                <div className="cl_head">
                                    <div className='blog-search-wrapper'>
                                        <input
<<<<<<< HEAD
                                            type="text" class="form-control"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={this.handleSearch}
=======
                                        type="text" class="form-control"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={this.handleSearch}
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
                                        />
                                    </div>

                                    <div className="blog_listing_wrapper">
<<<<<<< HEAD
                                        {blogData.map(item =>
                                            <div className=" col-md-4 blog_item">
                                                <div className='blog-inner-panel'>
                                                    <div className='blog-image'>
                                                        <a href=""><img src={item.image} height={200} width={300} alt="" /></a>
                                                    </div>
                                                    <div className='blog-list-meta'>
                                                        <span class="post_cat_col"><a href="">{item.category}</a></span>
                                                        <span class="post_date_col">{item.updatedAt}</span>
=======
                                        { blogData.map(item =>
                                            <div className=" col-md-4 blog_item">
                                               <div className='blog-inner-panel'>
                                                    <div className='blog-image'>
                                                    <a href=""><img src={item.image} height={200} width={300} alt="" /></a>
                                                    </div>
                                                    <div className='blog-list-meta'>
                                                            <span class="post_cat_col"><a href="">{item.category}</a></span> 
                                                            <span class="post_date_col">{item.updatedAt}</span>
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
                                                    </div>
                                                    <div className='blog-info'>
                                                        <h3 className='blog-headings'><a href="">{item.title}</a></h3>
                                                        <div className="blogShortinfo">
<<<<<<< HEAD
                                                            <p>{item.shortdescription}</p>
                                                        </div>
                                                    </div>
                                                    <div className='cart-btn'>
                                                        <button onClick={() => this.blogDetails(item.slug)}>
=======
                                                        <p>{item.shortdescription}</p>
                                                        </div>
                                                    </div>
                                                    <div className='cart-btn'>
                                                        <button onClick={() => this.blogDetails(item.id)}>
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
<<<<<<< HEAD
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                            disabled={itemsPerPage !== blogData.length}
                                        >
                                            NEXT
                                        </button>
                                    </ul>
                                </div>

=======
                                           </div>
                                        )}
                                    </div>
                                </div>
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
                                        disabled={itemsPerPage !== blogData.length}
                                    >
                                        NEXT
                                    </button>
                                </ul>
                              </div>
                                
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
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