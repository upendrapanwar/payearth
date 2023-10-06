import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from './../../components/seller/common/Header';
import store from '../../store/index';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { setLoading } from '../../store/reducers/global-reducer';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';

class ServiceStockManagement extends Component {
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
                filter: {
                    type: "none",
                    is_service: true
                }
            },
            data: [],
            pendingProducts: [],
            rejectedProducts: [],
            pagination: {},
            pendingProductsPagination: {},
            rejectedProductsPagination: {},
        }
        toast.configure();
    }

    componentDidMount() {
        this.getAddedProducts(false, null, 'none');
    }

    getAddedProducts = (pagination, param, type) => {
        let reqBody = {};

        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 5,
                    limit: 5
                },
                filter: {
                    type: "none",
                    is_service: true
                }
            };
        } else {
            reqBody = this.state.reqBody;
        }

        reqBody.filter.type = type;
        this.dispatch(setLoading({loading: true}));
        axios.post(`seller/stock/items/${this.authInfo.id}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                let types = {
                    none: 'data',
                    pending: 'pendingProducts',
                    reject: 'rejectedProducts'
                };
                let paginationNames = {
                    none: 'pagination',
                    pending: 'pendingProductsPagination',
                    reject: 'rejectedProductsPagination'
                };
                let obj = {};

                obj[types[type]] = response.data.data.items;
                obj[paginationNames[type]] = response.data.data.paginationData;
                this.setState(obj);
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                // toast.error(error.response.data.message);
                console.log(error);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    pagination = type => {
        let html = [];
        let itemLength = 0;
        let currentPage = 0;

        if (type === 'none') {
            itemLength = this.state.pagination.totalPages;
            currentPage = this.state.pagination.currentPage;
        } else if(type === 'pending') {
            itemLength = this.state.pendingProductsPagination.totalPages;
            currentPage = this.state.pendingProductsPagination.currentPage;
        } else if(type === 'reject') {
            itemLength = this.state.rejectedProductsPagination.totalPages;
            currentPage = this.state.rejectedProductsPagination.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getAddedProducts(true, pageNumber, type)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    halndleStatus = (event, serviceId) => {
        let reqBody = {
            is_active: event.target.checked,
            product_id: serviceId,
            seller_id: this.authInfo.id
        };

        this.dispatch(setLoading({loading: true}));
        axios.put('seller/stock/items/status-update', reqBody, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${this.authInfo.token}`
        }}).then(response => {
            if (response.data.status) {
                toast.dismiss();
                toast.success(response.data.message, {autoClose: 3000});
                let data = [...this.state.data];
                for (let index = 0; index < data.length; index++) {
                    if (data[index].id === serviceId) {
                        data[index].isActive = event.target.checked === true ? false : true;
                    }
                }
                this.setState({data});
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, {autoClose: 3000});
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    render() {
        const {loading} = store.getState().global;
        const {
            data,
            pendingProducts,
            rejectedProducts,
            pagination,
            pendingProductsPagination,
            rejectedProductsPagination
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
                                        <div className="dash_title">Service Stock Management</div>
                                        <Link to="/seller/add-service" className="custom_btn btn_yellow w-auto btn">Add Service</Link>
                                    </div>
                                </div>
                                <nav className="orders_tabs">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true" onClick={() => this.getAddedProducts(false, null, 'none')}>Added Services</button>
                                        <button className="nav-link" id="nav-ongoing-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-ongoing-orders" type="button" role="tab" aria-controls="nav-ongoing-orders" aria-selected="false"  onClick={() => this.getAddedProducts(false, null, 'ongoing')}>Pending for Approval </button>
                                        <button className="nav-link" id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true"  onClick={() => this.getAddedProducts(false, null, 'reject')}>Rejected Services</button>
                                    </div>
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                    {data.length > 0 ?
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Service ID</th>
                                                    <th>Service Name</th>
                                                    <th>Selling quantity</th>
                                                    <th>Category</th>
                                                    <th>Total Stock quantity</th>
                                                    <th colSpan="2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.length && data.map((value, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{value.productCode}</td>
                                                            <td>{value.name}</td>
                                                            <td>{value.quantity.selling_qty}</td>
                                                            <td>{value.category ? value.category.categoryName : ''}</td>
                                                            <td>{value.quantity.stock_qty}</td>
                                                            <td>
                                                                <div className="form-check form-switch">
                                                                    <input className="form-check-input" type="checkbox"   value={value.id} onChange={(event) => this.halndleStatus(event, value.id)} checked={value.isActive} />
                                                                </div>
                                                            </td>
                                                            <td><Link to={`/seller/service-detail/${value.id}`} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        : <NotFound msg="Data not found." />
                                    }

                                    {data.length > 0 &&
                                        <div className="pagination">
                                            <ul>
                                                <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getAddedProducts(true, pagination.prevPage, 'none')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                {this.pagination('none')}
                                                <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getAddedProducts(true, pagination.nextPage, 'none')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                            </ul>
                                        </div>
                                    }
                                </div>

                                <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                                    {pendingProducts.length > 0 ?
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Service ID</th>
                                                    <th>Service Name</th>
                                                    <th>Category</th>
                                                    <th>Total Stock quantity</th>
                                                    <th colSpan="2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingProducts.length&&pendingProducts.map((value, index) => {
                                                    return<tr key={index}>
                                                    <td>{value.productCode}</td>
                                                    <td>{value.name}</td>
                                                    <td>{value.category.categoryName}</td>
                                                    <td>{value.quantity.stock_qty}</td>
                                                    <td className="text-capitalize">{value.approveStatus}</td>
                                                    <td><Link to={`/seller/service-detail/${value.id}`} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                </tr>
                                                })}
                                            </tbody>
                                        </table>
                                        : <NotFound msg="Data not found." />
                                    }
                                    {pendingProducts.length > 0 &&
                                        <div className="pagination">
                                            <ul>
                                                <li><Link to="#" className={`link ${pendingProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getAddedProducts(true, pendingProductsPagination.prevPage, 'pending')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                {this.pagination('pending')}
                                                <li><Link to="#" className={`link ${pendingProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getAddedProducts(true, pendingProductsPagination.nextPage, 'pending')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                            </ul>
                                        </div>
                                    }
                                    </div>

                                    <div className="tab-pane fade" id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
                                    {rejectedProducts.length > 0 ?
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Service ID</th>
                                                    <th>Service Name</th>
                                                    <th>Category</th>
                                                    <th colSpan="2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rejectedProducts.map((value, index) => {
                                                    return <tr key={index}>
                                                                <td>{value.productCode}</td>
                                                                <td>{value.name}</td>
                                                                <td>{value.category.categoryName}</td>
                                                                <td className="text-capitalize">{value.approveStatus}</td>
                                                                <td><Link to={`/seller/service-detail/${value.id}`} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                            </tr>
                                                })}
                                            </tbody>
                                        </table>
                                        : <NotFound msg="Data not found." />
                                    }
                                    {rejectedProducts.length > 0 &&
                                        <div className="pagination">
                                            <ul>
                                                <li><Link to="#" className={`link ${rejectedProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getAddedProducts(true, rejectedProductsPagination.prevPage, 'reject')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                {this.pagination('reject')}
                                                <li><Link to="#" className={`link ${rejectedProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getAddedProducts(true, rejectedProductsPagination.nextPage, 'reject')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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

export default connect(setLoading)(ServiceStockManagement);