import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import Header from "../../components/admin/common/Header";
import Footer from "../../components/common/Footer";
import ManageProductsCategory from './ManageProductsCategory';
import ManageServiceCategory from './ManageServiceCategory';
import AdminCategoryModel from './CategoryModule';
import SpinnerLoader from '../../components/common/SpinnerLoader';


class ManageCategories extends Component {
    constructor(props) {
        super(props);
        // Set initial state for the active category
        this.state = {
            activeCategory: 'product',
            loading: false,
        };
    }

    // Method to handle category change
    handleCategoryChange = (category) => {
        this.setState({ activeCategory: category });
    }

    render() {
        const { activeCategory, loading } = this.state;

        return (
            <React.Fragment>
                <Header />
                <div className="inr_top_page_title">
                    <h2>Manage All Categories</h2>
                </div>
                <div className="cumm_page_wrap pt-5 pb-1 admin-dashboard-wrapper reports_page_wrapper">
                    <div className="container">
                        <div className="report_tabing_nav">
                            <div className="report_tab_link">
                                <ul>
                                    <li className={activeCategory === 'product' ? 'activeNav' : ''}>
                                        <Link
                                            to="#"
                                            onClick={() => this.handleCategoryChange('product')}
                                        >
                                            Product category
                                        </Link>
                                    </li>
                                    <li className={activeCategory === 'service' ? 'activeNav' : ''}>
                                        <Link
                                            to="#"
                                            onClick={() => this.handleCategoryChange('service')}
                                        >
                                            Service category
                                        </Link>
                                    </li>
                                    <li className={activeCategory === 'blog' ? 'activeNav' : ''}>
                                        <Link
                                            to="#"
                                            onClick={() => this.handleCategoryChange('blog')}
                                        >
                                            Blog category
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            {loading && <SpinnerLoader />}
                            {activeCategory === 'product' && <ManageProductsCategory />}
                            {activeCategory === 'service' && <ManageServiceCategory />}
                            {activeCategory === 'blog' && <AdminCategoryModel />}

                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default connect(null, { setLoading })(ManageCategories);
