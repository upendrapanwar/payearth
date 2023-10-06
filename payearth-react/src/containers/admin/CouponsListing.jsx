import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import Select from 'react-select';
import NotFound from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';

class CouponsListing extends Component {
    constructor(props) {
        super(props)
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            data: [],
            userData: [],
            expiredData: [],
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            reqBody2: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 2
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            pagination: {},
            paginationExpired: {},
            sortingOptions: [
                { label: 'New to Old', value: 'desc' },
                { label: "Old to New ", value: 'asc' },
            ],
            defaultSelectedOptionNew: { label: 'New to Old', value: 'desc' },
            defaultSelectedOptionExpired: { label: 'New to Old', value: 'desc' },
            cuponType: ''
        }
    }


    componentDidMount() {
        this.getCuponsListing(false, null, 'new');
        this.handleItemType('new');
    }

    getCuponsListing = (pagination, param, type) => {
        let reqBody = {};
        let url = '';
        console.log(param)
        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 2,
                    limit: 2
                },
                sorting: {
                    sort_type: "date",
                    sort_val: type === 'new' ? this.state.defaultSelectedOptionNew.value : this.state.defaultSelectedOptionExpired.value
                }
            };
            console.log(param)
        } else {
            if (type === 'new') {
                reqBody = this.state.reqBody;
            } else {
                reqBody = this.state.reqBody2;
            }
        }

        if (type === 'new') {
            url = 'admin/coupons/new';
            this.setState({ reqBody });
        } else if (type === 'expired') {
            url = 'admin/coupons/expired';
            this.setState({ reqBody2: reqBody });
        }

        this.dispatch(setLoading({ loading: true }));


        axios.post(url, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status && type === 'new') {
                this.setState({
                    data: response.data.data.coupons,
                    pagination: response.data.data.paginationData
                });
            }
            else if (response.data.status && type === 'expired') {
                this.setState({
                    expiredData: response.data.data.coupons,
                    paginationExpired: response.data.data.paginationData
                })
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });

    }

    pagination = (type) => {
        let html = [];
        let itemLength = 0;
        let currentPage = 0;
        if (type === 'new') {
            itemLength = this.state.pagination.totalPages;
            currentPage = this.state.pagination.currentPage;
        } else if (type === 'expired') {
            itemLength = this.state.paginationExpired.totalPages;
            currentPage = this.state.paginationExpired.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getCuponsListing(true, pageNumber, type)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChangeNew = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pagination.currentPage;
        reqBody.count.skip = (this.state.pagination.currentPage - 1) * 3;
        this.setState({ defaultSelectedOptionNew: selectedOption, reqBody });
        this.getCuponsListing(false, this.state.pagination.currentPage, 'new');
    }

    handleChangeExpired = selectedOption => {
        let reqBody2 = this.state.reqBody2;
        reqBody2.sorting.sort_val = selectedOption.value;
        reqBody2.count.page = this.state.paginationExpired.currentPage;
        reqBody2.count.skip = (this.state.paginationExpired.currentPage - 1) * 3;
        this.setState({ defaultSelectedOptionExpired: selectedOption, reqBody2 });
        this.getCuponsListing(false, this.state.paginationExpired.currentPage, 'expired');
    }

    handleItemType = param => {
        console.log(param)
        if (param === 'new') {
            this.setState({ cuponType: 'new' });
        } else {
            this.setState({ cuponType: 'expired' });
        }
    }


    render() {
        const { loading } = store.getState().global;
        const {
            data,
            expiredData,
            pagination,
            paginationExpired,
            sortingOptions,
            defaultSelectedOptionNew,
            defaultSelectedOptionExpired,
            cuponType
        } = this.state;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                        <div className="dash_title">Coupons</div>
                                        <Link to="/admin/add-coupon" className="custom_btn btn_yellow w-auto btn">Add Coupon</Link>
                                    </div>
                                </div>
                                <nav className="orders_tabs">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-new-tab" data-bs-toggle="tab" data-bs-target="#nav-new" type="button" role="tab" aria-controls="nav-new" aria-selected="true"
                                            onClick={() => {
                                                this.handleItemType('new')
                                                this.getCuponsListing(false, null, 'new')
                                            }}
                                        >New coupons</button>
                                        <button className="nav-link" id="nav-nav-expired-tab" data-bs-toggle="tab" data-bs-target="#nav-nav-expired" type="button" role="tab" aria-controls="nav-nav-expired" aria-selected="false"
                                            onClick={() => {
                                                this.handleItemType('expired')
                                                this.getCuponsListing(false, null, 'expired')
                                            }}
                                        >expired coupons</button>
                                        {cuponType === 'new' &&
                                            <Select
                                                className="sort_select text-normal ms-auto"
                                                options={sortingOptions}
                                                value={defaultSelectedOptionNew}
                                                onChange={this.handleChangeNew}
                                            />
                                        }
                                        {cuponType === 'expired' &&
                                            <Select
                                                className="sort_select text-normal ms-auto"
                                                options={sortingOptions}
                                                value={defaultSelectedOptionExpired}
                                                onChange={this.handleChangeExpired}
                                            />
                                        }
                                    </div>
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="nav-new" role="tabpanel" aria-labelledby="nav-new-tab">
                                        {data.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Coupon Code</th>
                                                        <th>Start Date</th>
                                                        <th>Expiry Date</th>
                                                        <th>Discount Percentage</th>
                                                        <th>Manage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.length && data.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.code}</td>
                                                                <td>{value.start}</td>
                                                                <td>{value.end}</td>
                                                                <td>{value.discount_per}</td>
                                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Edit</Link></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />}
                                        {data.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getCuponsListing(true, pagination.prevPage, 'new')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('new')}
                                                    <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getCuponsListing(true, pagination.nextPage, 'new')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-pane fade" id="nav-nav-expired" role="tabpanel" aria-labelledby="nav-nav-expired-tab">
                                        {expiredData.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Coupon Code</th>
                                                        <th>Start Date</th>
                                                        <th>Expiry Date</th>
                                                        <th>Discount Percentage</th>
                                                        <th>Manage</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {expiredData.length && this.state.expiredData.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.code}</td>
                                                                <td>{value.start}</td>
                                                                <td>{value.end}</td>
                                                                <td>{value.discount_per}</td>
                                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Edit</Link></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />}
                                        {expiredData.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${paginationExpired.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getCuponsListing(true, paginationExpired.prevPage, 'expired')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('expired')}
                                                    <li><Link to="#" className={`link ${paginationExpired.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getCuponsListing(true, paginationExpired.nextPage, 'expired')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(CouponsListing);