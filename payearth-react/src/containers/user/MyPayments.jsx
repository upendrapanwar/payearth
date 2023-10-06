import React, { Component } from 'react';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from './../../components/common/Footer';
import store from './../../store/index';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from './../../store/reducers/global-reducer';
import config from './../../config.json';
import { Link } from 'react-router-dom';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import NotFound from './../../components/common/NotFound';
import Select from 'react-select';

class MyPayments extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            data: [],
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 3
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            pagination: {},
            sortingOptions: [
                {label: 'New to Old', value: 'desc'},
                {label: "Old to New ", value: 'asc'},
            ],
            defaultSelectedOption: {label: 'New to Old', value: 'desc'}
        };
    }

    componentDidMount() {
        this.getPayments(false, null);
    }

    getPayments = (pagination, param) => {
        let reqBody = {};

        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 3,
                    limit: 3
                },
                sorting: {
                    sort_type: "date",
                    sort_val: this.state.defaultSelectedOption.value
                }
            };
        } else {
            reqBody = this.state.reqBody;
        }

        this.dispatch(setLoading({loading: true}));
        axios.post('user/payments/' + this.authInfo.id, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                this.setState({
                    data: response.data.data.payments,
                    pagination: response.data.data.paginationData
                });
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    pagination = () => {
        let html = [];
        for (let index = 0; index < this.state.pagination.totalPages; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${this.state.pagination.currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getPayments(true, pageNumber)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChange = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pagination.currentPage;
        reqBody.count.skip = (this.state.pagination.currentPage - 1) * 3;
        this.setState({defaultSelectedOption: selectedOption, reqBody});
        this.getPayments(false, this.state.pagination.currentPage);
    }

    handleDownloadFile = fileName => window.open(fileName, 'Download');

    render() {
        const { data, pagination, sortingOptions, defaultSelectedOption } = this.state;
        const { loading } = store.getState().global;

        return (
            <React.Fragment>
                { loading === true ? <SpinnerLoader /> : '' }
                <Header />
                <PageTitle title="My Payments" />
                <section className="inr_wrap orders_page">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart wishlist">
                                    <div className="cart_wrap">
                                        <div className="items_incart">
                                            <span className="text-uppercase">{pagination.totalPayments ? pagination.totalPayments : 0} ITEMS IN YOUR PAYMENTS</span>
                                            <Select
                                                className="sort_select text-normal"
                                                options={sortingOptions}
                                                value={defaultSelectedOption}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="cart_list cart_wrap pb-5">
                                        {data.length > 0 ?
                                            <table className="table table-responsive table-hover pe_table">
                                                <thead>
                                                    <tr>
                                                        <th>INVOICE NUMBER</th>
                                                        <th>PRODUCT/ SERVICE PURCHASED</th>
                                                        <th>MODE OF PAYMENT</th>
                                                        <th>AMOUNT PAID</th>
                                                        <th>DOWNLOAD INVOICE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.length && data.map((value, index) => {
                                                        return  <tr key={index}>
                                                                    <td>{value.invoiceNo}</td>
                                                                    <td>N/A</td>
                                                                    <td>{value.paymentMode.toUpperCase()}</td>
                                                                    <td>${value.amountPaid}</td>
                                                                    <td><button onClick={() => this.handleDownloadFile(config.apiURI + value.invoiceUrl)}  className="btn custom_btn btn_yellow_bordered" >Download</button></td>
                                                                </tr>
                                                    })}
                                                </tbody>
                                            </table>
                                        : <NotFound msg="Data not found." /> }

                                        {data.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getPayments(true, pagination.prevPage)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination()}
                                                    <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getPayments(true, pagination.nextPage)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
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

export default connect(setLoading) (MyPayments);