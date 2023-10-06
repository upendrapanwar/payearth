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
import DataTable from 'react-data-table-component'; 

class MyOrders extends Component {
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
        this.getOrders(false, null);
    }

    getOrders = (pagination, param) => {
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
        axios.post('user/orders/' + this.authInfo.id, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                this.setState({
                    data: response.data.data.orders,
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
            html.push(<li key={index}><Link to="#" className={`link ${this.state.pagination.currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getOrders(true, pageNumber)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChange = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pagination.currentPage;
        reqBody.count.skip = (this.state.pagination.currentPage - 1) * 3;
        this.setState({defaultSelectedOption: selectedOption, reqBody});
        this.getOrders(false, this.state.pagination.currentPage);
    }

    getAllData = () => {
        const columns = [
            {
                name: 'Title',
                selector: row => row.title,
                sortable: true,
            },
            {
                name: 'Year',
                selector: row => row.year,
                sortable: true,
            },
        ];

        const data = [
            {
                id: 1,
                title: 'Beetlejuice',
                year: '1988',
            },
            {
                id: 2,
                title: 'Ghostbusters',
                year: '1984',
            },
        ]


        return (
            <DataTable
                columns={columns}
                data={data}
            />
        );
    }

    render() {
        const { data, pagination, sortingOptions, defaultSelectedOption } = this.state;
        const { loading } = store.getState().global;
        
        return (
            <React.Fragment>
                { loading === true ? <SpinnerLoader /> : '' }
                <Header />
                <PageTitle title="My Orders" />
                
                <section className="inr_wrap orders_page">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart wishlist">
                                    <div className="cart_wrap">
                                        <div className="items_incart">
                                            <span className="text-uppercase">{pagination.totalOrders ? pagination.totalOrders : 0} ITEMS IN YOUR ORDERS</span>
                                            {this.getAllData}
                                            <Select
                                                className="sort_select text-normal"
                                                options={sortingOptions}
                                                value={defaultSelectedOption}
                                                onChange={this.handleChange}
                                                isDisabled={data.length === 0 ? true : false}
                                            />
                                        </div>
                                    </div>
                                    <div className="cart_list cart_wrap pb-5">
                                        {data.length > 0 ?
                                            <table className="table table-responsive table-hover pe_table">
                                                <thead>
                                                    <tr>
                                                        <th>ORDER IMAGE</th>
                                                        <th>ORDER ID</th>
                                                        <th>PRODUCT/ SERVICE NAME</th>
                                                        <th>TYPE</th>
                                                        <th>QUANTITY</th>
                                                        <th>AMOUNT</th>
                                                        <th>STATUS</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.length && data.map((value, index) => {
                                                        return  <tr key={index}>
                                                                    <td>
                                                                        <div className="odr_item_img">
                                                                            <img src={config.apiURI + value.productId.featuredImage} alt={value.productId.name} />
                                                                        </div>
                                                                    </td>
                                                                    <td>{value.orderCode}</td>
                                                                    <td>{value.productId.name}</td>
                                                                    <td>{value.productId.isService ? 'Service' : 'Product'}</td>
                                                                    <td>{value.quantity}</td>
                                                                    <td>${value.productId.price}</td>
                                                                    <td>{/*value.orderStatus.orderStatusId.title*/}</td>
                                                                    {/* <td><Link to="#" className="btn custom_btn btn_yellow_bordered">View Details</Link></td> */}
                                                                    <td><Link to={`/order-detail/${value.id}`} className="btn custom_btn btn_yellow_bordered">View Details</Link></td>
                                                                </tr>
                                                    })}
                                                </tbody>
                                            </table>
                                        : <NotFound msg="Data not found." /> }

                                        {data.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, pagination.prevPage)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination()}
                                                    <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, pagination.nextPage)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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

export default connect(setLoading) (MyOrders);