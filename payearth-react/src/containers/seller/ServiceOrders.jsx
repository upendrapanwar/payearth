import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/seller/common/Header';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import NotFound from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import Select from 'react-select';

class ServiceOrders extends Component {
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
                    is_service: true
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
                    is_service: true
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
                    is_service: true
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
                    is_service: true
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
            pendingServices: [],
            ongoingServices: [],
            canceledServices: [],
            completedServices: [],
            pendingServicesPagination: {},
            ongoingServicesPagination: {},
            canceledServicesPagination: {},
            completedServicesPagination: {},
            Item: ''
        };
    }

    componentDidMount() {
        this.getServiceOrders(false, null, 'pending');
        this.handleItemType('pending');
    }

    getServiceOrders = (pagination, param, type) => {
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
                    is_service: true
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
                    pending: 'pendingServices',
                    ongoing: 'ongoingServices',
                    cancel_refund: 'canceledServices',
                    complete: 'completedServices',
                };
                let paginationNames = {
                    pending: 'pendingServicesPagination',
                    ongoing: 'ongoingServicesPagination',
                    cancel_refund: 'canceledServicesPagination',
                    complete: 'completedServicesPagination',
                };
                let obj = {};

                obj[types[type]] = response.data.data.orders;
                obj[paginationNames[type]] = response.data.data.paginationData;
                this.setState(obj);
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
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
            itemLength = this.state.pendingServicesPagination.totalPages;
            currentPage = this.state.pendingServicesPagination.currentPage;
        } else if (type === 'ongoing') {
            itemLength = this.state.ongoingServicesPagination.totalPages;
            currentPage = this.state.ongoingServicesPagination.currentPage;
        } else if (type === 'cancel_refund') {
            itemLength = this.state.canceledServicesPagination.totalPages;
            currentPage = this.state.canceledServicesPagination.currentPage;
        } else if (type === 'complete') {
            itemLength = this.state.completedServicesPagination.totalPages;
            currentPage = this.state.completedServicesPagination.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getServiceOrders(true, pageNumber, type)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChangePending = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pendingServicesPagination.currentPage;
        reqBody.count.skip = (this.state.pendingServicesPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionPending: selectedOption, reqBody });
        this.getServiceOrders(false, this.state.pendingServicesPagination.currentPage, 'pending');
    }

    handleChangeOngoing = selectedOption => {
        let reqBody2 = this.state.reqBody2;
        reqBody2.sorting.sort_val = selectedOption.value;
        reqBody2.count.page = this.state.ongoingServicesPagination.currentPage;
        reqBody2.count.skip = (this.state.ongoingServicesPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionOngoing: selectedOption, reqBody2 });
        this.getServiceOrders(false, this.state.ongoingServicesPagination.currentPage, 'ongoing');
    }

    handleChangeCanceled = selectedOption => {
        let reqBody3 = this.state.reqBody3;
        reqBody3.sorting.sort_val = selectedOption.value;
        reqBody3.count.page = this.state.canceledServicesPagination.currentPage;
        reqBody3.count.skip = (this.state.canceledServicesPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionCanceled: selectedOption, reqBody3 });
        this.getServiceOrders(false, this.state.canceledServicesPagination.currentPage, 'cancel_refund');
    }

    handleChangeCompleted = selectedOption => {
        let reqBody4 = this.state.reqBody4;
        reqBody4.sorting.sort_val = selectedOption.value;
        reqBody4.count.page = this.state.completedServicesPagination.currentPage;
        reqBody4.count.skip = (this.state.completedServicesPagination.currentPage - 1) * 2;
        this.setState({ defaultSelectedOptionCompleted: selectedOption, reqBody4 });
        this.getServiceOrders(false, this.state.completedServicesPagination.currentPage, 'complete');
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
            pendingServices,
            ongoingServices,
            canceledServices,
            completedServices,
            pendingServicesPagination,
            ongoingServicesPagination,
            canceledServicesPagination,
            completedServicesPagination,
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
                                        <div className="dash_title">Service Orders</div>
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
                                        <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true" onClick={() => {
                                                this.getServiceOrders(false, null, 'pending')
                                                this.handleItemType('pending')
                                            }}>Pending Orders</button>
                                        <button className="nav-link" id="nav-ongoing-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-ongoing-orders" type="button" role="tab" aria-controls="nav-ongoing-orders" aria-selected="false"
                                        onClick={() => {
                                            this.getServiceOrders(false, null, 'ongoing')
                                            this.handleItemType('ongoing')
                                        }}>Ongoing Orders</button>
                                        <button className="nav-link" id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true"
                                         onClick={() => { this.getServiceOrders(false, null, 'cancel_refund')
                                         this.handleItemType('cancel_refund')}}>Cancelled and Refunded Orders</button>
                                        <button className="nav-link" id="nav-completed-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-completed-orders" type="button" role="tab" aria-controls="nav-completed-orders" aria-selected="true"
                                         onClick={() => { this.getServiceOrders(false, null, 'complete')
                                         this.handleItemType('complete') }}>Completed Orders</button>
                                    </div>
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                        {pendingServices.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Service ID</th>
                                                        <th>Service<br />Name</th>
                                                        <th>Vendor’s<br />Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                        {/* <th className="invisible">action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pendingServices.length && pendingServices.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
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
                                        {pendingServices.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pendingServicesPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, pendingServicesPagination.prevPage, 'pending')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('pending')}
                                                    <li><Link to="#" className={`link ${pendingServicesPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, pendingServicesPagination.nextPage, 'pending')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                                        {ongoingServices.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Service ID</th>
                                                        <th>Service<br />Name</th>
                                                        <th>Vendor’s<br />Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                        {/* <th className="invisible">action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ongoingServices.length && ongoingServices.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
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
                                        {ongoingServices.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${ongoingServicesPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, ongoingServicesPagination.prevPage, 'ongoing')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('ongoing')}
                                                    <li><Link to="#" className={`link ${ongoingServicesPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, ongoingServicesPagination.nextPage, 'ongoing')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-pane fade" id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
                                        {canceledServices.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Service ID</th>
                                                        <th>Service<br />Name</th>
                                                        <th>Vendor’s<br />Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                        {/* <th className="invisible">action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {canceledServices.length && canceledServices.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
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
                                        {canceledServices.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${canceledServicesPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, canceledServicesPagination.prevPage, 'cancel_refund')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('cancel_refund')}
                                                    <li><Link to="#" className={`link ${canceledServicesPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, canceledServicesPagination.nextPage, 'cancel_refund')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                    <div className="tab-pane fade" id="nav-completed-orders" role="tabpanel" aria-labelledby="nav-completed-orders-tab">
                                        {completedServices.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Service ID</th>
                                                        <th>Service<br />Name</th>
                                                        <th>Vendor’s<br />Share</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                        {/* <th className="invisible">action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {completedServices.length && completedServices.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{value.orderCode}</td>
                                                                <td>{value.productId.productCode}</td>
                                                                <td>{value.productId.name}</td>
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
                                        {completedServices.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${completedServicesPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, completedServicesPagination.prevPage, 'complete')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('complete')}
                                                    <li><Link to="#" className={`link ${completedServicesPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getServiceOrders(true, completedServicesPagination.nextPage, 'complete')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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

export default connect(setLoading)(ServiceOrders);