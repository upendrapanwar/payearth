import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/seller/common/Header';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import axios from 'axios';
import { connect } from 'react-redux';
import NotFound from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import Select from 'react-select';

class ProductOrders extends Component {
    constructor(props) {
        super(props)
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                filter: {
                    type: "pending",
                    is_service: false
                }
            },
            reqBody2: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                filter: {
                    type: "ongoing",
                    is_service: false
                }
            },
            reqBody3: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                filter: {
                    type: "cancel_refund",
                    is_service: false
                }
            },
            reqBody4: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                filter: {
                    type: "complete",
                    is_service: false
                }
            },
            sortingOptions: [
                {label: 'New to Old', value: 'desc'},
                {label: "Old to New ", value: 'asc'},
            ],
            defaultSelectedOptionPending: {label: 'New to Old', value: 'desc'},
            defaultSelectedOptionOngoing: {label: 'New to Old', value: 'desc'},
            defaultSelectedOptionCanceled: {label: 'New to Old', value: 'desc'},
            defaultSelectedOptionCompleted: {label: 'New to Old', value: 'desc'},
            pendingProducts: [],
            ongoingProducts: [],
            canceledProducts: [],
            completedProducts: [],
            pendingProductsPagination: {},
            ongoingProductsPagination: {},
            canceledProductsPagination: {},
            completedProductsPagination: {},
            Item: ''
        };
    }

    componentDidMount() {
        this.getProductOrders(false, null, 'pending');
        this.handleItemType('pending');
    }

    getProductOrders = (pagination, param, type) => {
        const {dispatch} = this.props;
        let reqBody = {};

        if (pagination === true) {
            let sort_val = '';

            if (type === 'pending') {
                sort_val = this.state.defaultSelectedOptionPending.value;
            } else if(type==='ongoing') {
                sort_val = this.state.defaultSelectedOptionOngoing.value;
            } else if(type==='cancel_refund') {
                sort_val = this.state.defaultSelectedOptionCanceled.value;
            } else if(type==='complete') {
                sort_val = this.state.defaultSelectedOptionCompleted.value;
            }

            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 5,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val
                },
                filter: {
                    type: type,
                    is_service: false
                }
            };
        } else {
            if (type === 'pending') {
                reqBody = this.state.reqBody;
            } else if(type==='ongoing') {
                reqBody = this.state.reqBody2;
            } else if(type==='cancel_refund') {
                reqBody = this.state.reqBody3;
            } else if(type==='complete') {
                reqBody = this.state.reqBody4;
            }
        }

        if (type === 'pending') {
            this.setState({reqBody});
        } else if(type==='ongoing') {
            this.setState({reqBody2: reqBody});
        } else if(type==='cancel_refund') {
            this.setState({reqBody3: reqBody});
        } else if(type==='complete') {
            this.setState({reqBody4: reqBody});
        }

        dispatch(setLoading({loading: true}));
        axios.post(`seller/orders/${this.authInfo.id}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                let types = {
                    pending: 'pendingProducts',
                    ongoing: 'ongoingProducts',
                    cancel_refund: 'canceledProducts',
                    complete: 'completedProducts',
                };
                let paginationNames = {
                    pending: 'pendingProductsPagination',
                    ongoing: 'ongoingProductsPagination',
                    cancel_refund: 'canceledProductsPagination',
                    complete: 'completedProductsPagination',
                };
                let obj = {};

                obj[types[type]] = response.data.data.orders;
                obj[paginationNames[type]] = response.data.data.paginationData;
                this.setState(obj);
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                // toast.error(error.response.data.message);
                console.log(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    pagination = type => {
        let html = [];
        let itemLength = 0;
        let currentPage = 0;

        if (type === 'pending') {
            itemLength = this.state.pendingProductsPagination.totalPages;
            currentPage = this.state.pendingProductsPagination.currentPage;
        } else if (type === 'ongoing') {
            itemLength = this.state.ongoingProductsPagination.totalPages;
            currentPage = this.state.ongoingProductsPagination.currentPage;
        } else if (type === 'cancel_refund') {
            itemLength = this.state.canceledProductsPagination.totalPages;
            currentPage = this.state.canceledProductsPagination.currentPage;
        } else if (type === 'complete') {
            itemLength = this.state.completedProductsPagination.totalPages;
            currentPage = this.state.completedProductsPagination.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getProductOrders(true, pageNumber, type)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChangePending = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pendingProductsPagination.currentPage;
        reqBody.count.skip = (this.state.pendingProductsPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionPending: selectedOption, reqBody });
        this.getProductOrders(false, this.state.pendingProductsPagination.currentPage, 'pending');
    }

    handleChangeOngoing = selectedOption => {
        let reqBody2 = this.state.reqBody2;
        reqBody2.sorting.sort_val = selectedOption.value;
        reqBody2.count.page = this.state.ongoingProductsPagination.currentPage;
        reqBody2.count.skip = (this.state.ongoingProductsPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionOngoing: selectedOption, reqBody2 });
        this.getProductOrders(false, this.state.ongoingProductsPagination.currentPage, 'ongoing');
    }

    handleChangeCanceled = selectedOption => {
        let reqBody3 = this.state.reqBody3;
        reqBody3.sorting.sort_val = selectedOption.value;
        reqBody3.count.page = this.state.canceledProductsPagination.currentPage;
        reqBody3.count.skip = (this.state.canceledProductsPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionCanceled: selectedOption, reqBody3 });
        this.getProductOrders(false, this.state.canceledProductsPagination.currentPage, 'cancel_refund');
    }

    handleChangeCompleted = selectedOption => {
        let reqBody4 = this.state.reqBody4;
        reqBody4.sorting.sort_val = selectedOption.value;
        reqBody4.count.page = this.state.completedProductsPagination.currentPage;
        reqBody4.count.skip = (this.state.completedProductsPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionCompleted: selectedOption, reqBody4 });
        this.getProductOrders(false, this.state.completedProductsPagination.currentPage, 'complete');
    }

    handleItemType = param => {
        if (param === 'pending') {
            this.setState({ item: 'pending' });
        } else if (param === "ongoing") {
            this.setState({ item: 'ongoing' });
        } else if (param === 'cancel_refund') {
            this.setState({ item: 'cancel_refund' });
        } else if (param === 'complete') {
            this.setState({ item: 'complete' });
        }
    }

    render() {
        const {loading} = store.getState().global;
        const {
            sortingOptions,
            defaultSelectedOptionPending,
            defaultSelectedOptionOngoing,
            defaultSelectedOptionCanceled,
            defaultSelectedOptionCompleted,
            pendingProducts,
            ongoingProducts,
            canceledProducts,
            completedProducts,
            pendingProductsPagination,
            ongoingProductsPagination,
            canceledProductsPagination,
            completedProductsPagination,
            item
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
                                        <div className="dash_title">Product Orders</div>
                                        {item === 'pending' &&
                                            <Select
                                                className="sort_select text-normal ms-auto"
                                                options={sortingOptions}
                                                value={defaultSelectedOptionPending}
                                                onChange={this.handleChangePending}
                                            />
                                        }
                                        {item === 'ongoing' &&
                                            <Select
                                                className="sort_select text-normal ms-auto"
                                                options={sortingOptions}
                                                value={defaultSelectedOptionOngoing}
                                                onChange={this.handleChangeOngoing}
                                            />
                                        }
                                        {item === 'cancel_refund' &&
                                            <Select
                                                className="sort_select text-normal ms-auto"
                                                options={sortingOptions}
                                                value={ defaultSelectedOptionCanceled}
                                                onChange={this.handleChangeCanceled}
                                            />
                                        }
                                        {item === 'complete' &&
                                            <Select
                                                className="sort_select text-normal ms-auto"
                                                options={sortingOptions}
                                                value={defaultSelectedOptionCompleted}
                                                onChange={this.handleChangeCompleted}
                                            />
                                        }
                                    </div>
                                </div>
                                <nav className="orders_tabs">
                                    <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true"
                                            onClick={() => {
                                                this.getProductOrders(false, null, 'pending')
                                                this.handleItemType('pending')
                                            }}>Pending Orders</button>
                                        <button className="nav-link" id="nav-ongoing-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-ongoing-orders" type="button" role="tab" aria-controls="nav-ongoing-orders" aria-selected="false"
                                            onClick={() => {
                                                this.getProductOrders(false, null, 'ongoing')
                                                this.handleItemType('ongoing')
                                            }}>Ongoing Orders</button>
                                        <button className="nav-link" id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true"
                                            onClick={() => { this.getProductOrders(false, null, 'cancel_refund')
                                            this.handleItemType('cancel_refund')}}>Cancelled and Refunded Orders</button>
                                        <button className="nav-link" id="nav-completed-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-completed-orders" type="button" role="tab" aria-controls="nav-completed-orders" aria-selected="true"
                                            onClick={() => { this.getProductOrders(false, null, 'complete')
                                            this.handleItemType('complete') }}>Completed Orders</button>
                                    </div>
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                        {pendingProducts.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Product ID</th>
                                                        <th>Product<br/>Name</th>
                                                        <th>Product<br/>Color</th>
                                                        <th>Product<br/>Size</th>
                                                        <th>Vendor’s<br/>Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingProducts.length && pendingProducts.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
                                                                <td>{value.product_sku.color}</td>
                                                                <td>{value.product_sku.size}</td>
                                                                <td>{value.paymentId.amountPaid}</td>
                                                                <td>{value.orderStatus.orderStatusId.title}</td>
                                                                <td>{(value.paymentId.paymentMode).toUpperCase()}</td>
                                                                <td><Link to={`/seller/order-detail/${value.id}`} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {pendingProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pendingProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, pendingProductsPagination.prevPage, 'pending')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('pending')}
                                                    <li><Link to="#" className={`link ${pendingProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, pendingProductsPagination.nextPage, 'pending')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                                        {ongoingProducts.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Product ID</th>
                                                        <th>Product<br/>Name</th>
                                                        <th>Product<br/>Color</th>
                                                        <th>Product<br/>Size</th>
                                                        <th>Vendor’s<br/>Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ongoingProducts.length && ongoingProducts.map((value, index) => {
                                                        return (

                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
                                                                <td>{value.product_sku.color}</td>
                                                                <td>{value.product_sku.size}</td>
                                                                <td>{value.paymentId.amountPaid}</td>
                                                                <td>{value.orderStatus.orderStatusId.title}</td>
                                                                <td>{(value.paymentId.paymentMode).toUpperCase()}</td>
                                                                <td><Link to={`/seller/order-detail/${value.id}`} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {ongoingProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${ongoingProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, ongoingProductsPagination.prevPage, 'ongoing')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('ongoing')}
                                                    <li><Link to="#" className={`link ${ongoingProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, ongoingProductsPagination.nextPage, 'ongoing')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-pane fade" id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
                                        {canceledProducts.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Product ID</th>
                                                        <th>Product<br/>Name</th>
                                                        <th>Product<br/>Color</th>
                                                        <th>Product<br/>Size</th>
                                                        <th>Vendor’s<br/>Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {canceledProducts.length && canceledProducts.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
                                                                <td>{value.product_sku.color}</td>
                                                                <td>{value.product_sku.size}</td>
                                                                <td>{value.paymentId.amountPaid}</td>
                                                                <td>{value.orderStatus.orderStatusId.title}</td>
                                                                <td>{(value.paymentId.paymentMode).toUpperCase()}</td>
                                                                <td><Link to={`/seller/order-detail/${value.id}`} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {canceledProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${canceledProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, canceledProductsPagination.prevPage, 'cancel_refund')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('cancel_refund')}
                                                    <li><Link to="#" className={`link ${canceledProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, canceledProductsPagination.nextPage, 'cancel_refund')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-pane fade" id="nav-completed-orders" role="tabpanel" aria-labelledby="nav-completed-orders-tab">
                                        {completedProducts.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Product ID</th>
                                                        <th>Product<br/>Name</th>
                                                        <th>Product<br/>Color</th>
                                                        <th>Product<br/>Size</th>
                                                        <th>Vendor’s<br/>Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {completedProducts.length && completedProducts.map((value, index) => {
                                                        return (

                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
                                                                <td>{value.product_sku.color}</td>
                                                                <td>{value.product_sku.size}</td>
                                                                <td>{value.paymentId.amountPaid}</td>
                                                                <td>{value.orderStatus.orderStatusId.title}</td>
                                                                <td>{(value.paymentId.paymentMode).toUpperCase()}</td>
                                                                <td><Link to={`/seller/order-detail/${value.id}`} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {completedProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${completedProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, completedProductsPagination.prevPage, 'complete')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('complete')}
                                                    <li><Link to="#" className={`link ${completedProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getProductOrders(true, completedProductsPagination.nextPage, 'complete')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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

export default connect(setLoading)(ProductOrders);