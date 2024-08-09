import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { NotFound } from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { isNull } from 'lodash';
import { Autocomplete } from '@mui/material';
import { TextField } from '@material-ui/core';

import arrow_back from './../../assets/icons/arrow-back.svg'
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";

class ServiceOrders extends Component {
    constructor(props) {
        super(props)
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.searchArr = [];
        this.state = {
            data: [],
            // loading: true,
            //  activeTab: localStorage.getItem('activeTab') || 'nav-pending-orders',
        }

        this.state = {
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 20
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                filter: {
                    type: "ongoing",
                    date: '',
                    vendor: '',
                    customer: '',
                    status: '',
                    is_service: false
                },
            },
            search: '',
            searchFilter: [],

            options: '',
            optionsCustomer: '',
            optionsOrderStatus: '',
            pendingProducts: [],
            ongoingProducts: [],
            canceledProducts: [],
            completedProducts: [],
            pendingProductsPagination: {},
            ongoingProductsPagination: {},
            canceledProductsPagination: {},
            completedProductsPagination: {}
            // sortingOptions: [
            //     {label: 'New to Old', value: 'desc'},
            //     {label: "Old to New ", value: 'asc'},
            // ],
            // defaultSelectedOption: {label: 'New to Old', value: 'desc'}
        };
    }
    componentDidMount() {
        //  this.getOrders(false, null, 'pending', null, null);
        // this.getOrders(false, null, 'ongoing', null, null);
        // this.getOrders(false, null, 'cancel_refund', null, null);
        // this.getOrders(false, null, 'completed', null, null);
        this.getVendors();
        this.getcustomers();
        // this.getOrderStatus();
    }

    getProductData = async (productId) => {
        var product_id = '';


        if (typeof (productId) == 'object') {
            console.log(productId[0].productId);
            product_id = productId[0].productId;
        } else {
            product_id = productId;
        }

        return await axios.get('admin/productbyid/' + product_id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            //console.log(response.data.data);
            if (response.data.data) {
                return response.data.data;
            } else {
                return null;
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                console.log(error.response.data.message);
            }
        });
    }

    // getOrders = (pagination, param, type, searchStr, searchFilter) => {
    //     let reqBody = {};

    //     if (pagination === true) {
    //         console.log(this.state.reqBody.filter);
    //         reqBody = {
    //             count: {
    //                 page: param,
    //                 skip: (param - 1) * 2,
    //                 limit: 2
    //             },
    //             //filter: {
    //             //    type: "ongoing",
    //             //    is_service: false
    //             //},
    //             filter: this.state.reqBody.filter,
    //             search: searchStr,
    //             searchFilter: searchFilter
    //         };
    //     } else {
    //         reqBody = this.state.reqBody;
    //     }

    //     reqBody.filter.type = type;

    //     const { dispatch } = this.props;
    //     dispatch(setLoading({ loading: true }));
    //     axios.post('admin/orders/', reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${this.authInfo.token}`
    //         }
    //     }).then((response) => {

    //         if (response.data.status) {
    //             let types = {
    //                 pending: 'pendingProducts',
    //                 ongoing: 'ongoingProducts',
    //                 cancel_refund: 'canceledProducts',
    //                 completed: 'completedProducts'
    //             };
    //             let paginationNames = {
    //                 pending: 'pendingProductsPagination',
    //                 ongoing: 'ongoingProductsPagination',
    //                 cancel_refund: 'canceledProductsPagination',
    //                 completed: 'completedProductsPagination'
    //             };

    //             let obj = {};
    //             console.log(response.data.data.orders)
    //             console.log(types[type]);
    //             var responseData = response.data.data.orders;

    //             if (types[type] == "pendingProducts") {
    //                 obj[types[type]] = [];
    //                 obj[paginationNames[type]] = [];
    //                 let result = responseData.filter(o => o.orderStatus.orderStatusId.title.includes('Pending'));
    //                 console.log('Pending length=' + result.length);
    //                 if (result.length > 0) {
    //                     obj[types[type]] = response.data.data.orders;
    //                     obj[paginationNames[type]] = response.data.data.paginationData;
    //                 }
    //             }

    //             if (types[type] == "ongoingProducts") {
    //                 obj[types[type]] = [];
    //                 obj[paginationNames[type]] = [];
    //                 let result = responseData.filter(o => o.orderStatus.orderStatusId.title.includes('Processing'));
    //                 if (result.length > 0) {
    //                     console.log('Processing length=' + result.length);
    //                     obj[types[type]] = response.data.data.orders;
    //                     obj[paginationNames[type]] = response.data.data.paginationData;
    //                 }

    //             }
    //             if (types[type] == "canceledProducts") {
    //                 obj[types[type]] = [];
    //                 obj[paginationNames[type]] = [];
    //                 let result = responseData.filter(o => o.orderStatus.orderStatusId.title.includes('Cancel Request'));
    //                 if (result.length > 0) {
    //                     console.log('Cancel Request length=' + result.length);
    //                     obj[types[type]] = response.data.data.orders;
    //                     obj[paginationNames[type]] = response.data.data.paginationData;
    //                 }

    //             }
    //             if (types[type] == "completedProducts") {
    //                 obj[types[type]] = [];
    //                 obj[paginationNames[type]] = [];
    //                 let result = '';
    //                 console.log(this.state.reqBody.filter.status);
    //                 if (this.state.reqBody.filter.status) {
    //                     result = responseData.filter(o => o.orderStatus.orderStatusId.title.includes(this.state.reqBody.filter.status));
    //                 } else {
    //                     result = responseData.filter(o => o.orderStatus.orderStatusId.title.includes('Completed'));
    //                 }

    //                 if (result.length > 0) {
    //                     console.log('Completed length=' + result.length);
    //                     obj[types[type]] = response.data.data.orders;
    //                     obj[paginationNames[type]] = response.data.data.paginationData;
    //                 }

    //             }
    //             //console.log(obj)
    //             this.setState(obj);
    //         }
    //     }).catch(error => {
    //         if (error.response && error.response.data.status === false) {
    //             //toast.error(error.response.data.message);
    //             console.log(error.response.data.message)
    //             let types = {
    //                 pending: 'pendingProducts',
    //                 ongoing: 'ongoingProducts',
    //                 cancel_refund: 'canceledProducts',
    //                 completed: 'completedProducts'
    //             };
    //             let paginationNames = {
    //                 pending: 'pendingProductsPagination',
    //                 ongoing: 'ongoingProductsPagination',
    //                 cancel_refund: 'canceledProductsPagination',
    //                 completed: 'completedProductsPagination'
    //             };
    //             let obj = {};
    //             obj[types[type]] = error.response.data;
    //             obj[paginationNames[type]] = error.response.data;
    //             this.setState(obj);
    //         }
    //     }).finally(() => {
    //         setTimeout(() => {
    //             dispatch(setLoading({ loading: false }));
    //         }, 300);
    //     });
    // }
    handleChange = (event) => {
        this.setState({
            search: event.target.value
        })
    }

    setSearchFilter = (event, value, reason) => {
        //searchDate
        if (event.target.name) {
            if (event.target.name === 'searchDate' && document.getElementById('flexCheckDate').checked) {
                var val = event.target.value

                //this.setState({
                //    filter : { 'date': val }
                //})
                this.setState({
                    reqBody: {
                        filter: { ...this.state.reqBody.filter, ...{ 'date': val } }
                    }
                })

            }
            //this.searchArr.push({
            //    [event.target.name]: event.target.value
            //})
        }
        if (typeof value === 'object') {

            if (value.stype == "status" && document.getElementById('flexCheckStatus').checked) {

                //console.log(value);
                var val = value.label
                //vendor: '',
                //    customer: '',
                //    status:'',
                //this.setState({
                //    filter: { 'status': val }
                //})
                this.setState({
                    reqBody: {
                        filter: { ...this.state.reqBody.filter, ...{ 'status': val } }
                    }
                })
            }

            if (value.stype == "vendors" && document.getElementById('flexCheckVendor').checked) {

                var val = value.label

                //this.setState({
                //    filter : { 'vendor': val }
                //})
                this.setState({
                    reqBody: {
                        filter: { ...this.state.reqBody.filter, ...{ 'vendor': val } }
                    }
                })
            }

            if (value.stype == "customer" && document.getElementById('flexCheckCustomer').checked) {
                var val = value.label
                this.setState({
                    reqBody: {
                        filter: { ...this.state.reqBody.filter, ...{ 'customer': val } }
                    }

                })
            }

        }
        console.log(this.state.reqBody.filter);
        //this.setState({
        //    searchFilter : { ...this.state.searchFilter, ...this.searchArr }
        //})

    }

    resetSearchFilter = () => {
        if (!document.getElementById('flexCheckDate').checked) {
            this.setState({
                reqBody: {
                    filter: { ...this.state.reqBody.filter, ...{ 'date': '' } }
                }
            })
        }
    }

    resetCheckCustomer = () => {
        if (!document.getElementById('flexCheckCustomer').checked) {
            this.setState({
                reqBody: {
                    filter: { ...this.state.reqBody.filter, ...{ 'customer': '' } }
                }
            })
        }
    }

    resetCheckVendor = () => {
        if (!document.getElementById('flexCheckVendor').checked) {
            this.setState({
                reqBody: {
                    filter: { ...this.state.reqBody.filter, ...{ 'vendor': '' } }
                }
            })
        }
    }

    resetCheckStatus = () => {
        if (!document.getElementById('flexCheckStatus').checked) {
            this.setState({
                reqBody: {
                    filter: { ...this.state.reqBody.filter, ...{ 'status': '' } }
                }
            })
        }
    }

    submitSearch = () => {
        var searchStr = '';
        var searchFilterStr = '';
        this.getOrders(true, 1, 'pending', this.state.search, this.state.searchFilter);
        // this.getOrders(true, 1, 'ongoing', this.state.search, this.state.searchFilter);
        // this.getOrders(true, 1, 'cancel_refund', this.state.search, this.state.searchFilter);
        // this.getOrders(true, 1, 'completed', this.state.search, this.state.searchFilter);
    }

    getVendors = () => {
        let reqBody = {};
        reqBody = this.state.reqBody;
        axios.post('admin/sellers/', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {

            if (response.data.status) {
                let result = response.data.data.sellers;
                var sellerData = [];
                result.map(function (val, index) {

                    sellerData.push({
                        id: val.id,
                        label: val.name,
                        stype: 'vendors'
                    })

                })

                this.setState({
                    options: sellerData
                })
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                //toast.error(error.response.data.message);
                console.log(error.response.data.message)
            }
        });
    }

    getcustomers = () => {
        let reqBody = {};
        reqBody = this.state.reqBody;
        axios.post('admin/users/', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let result = response.data.data.users;
                var userData = [];
                result.map(function (val, index) {

                    userData.push({
                        id: val.id,
                        label: val.name,
                        stype: 'customer'
                    })

                })

                this.setState({
                    optionsCustomer: userData
                })
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                //toast.error(error.response.data.message);
                console.log(error.response.data.message)
            }
        });
    }

    // getOrderStatus = () => {
    //     let reqBody = {};
    //     reqBody = this.state.reqBody;
    //     axios.post('admin/orderstatus/', reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${this.authInfo.token}`
    //         }
    //     }).then((response) => {
    //         if (response.data.status) {
    //             //console.log(response.data.data);
    //             let result = response.data.data;
    //             var orderStatusData = [];
    //             result.map(function (val, index) {

    //                 orderStatusData.push({
    //                     id: val.id,
    //                     label: val.title,
    //                     stype: 'status'
    //                 })

    //             })

    //             this.setState({
    //                 optionsOrderStatus: orderStatusData
    //             })
    //         }
    //     }).catch(error => {
    //         console.log(error.response);
    //         if (error.response && error.response.data.status === false) {
    //             //toast.error(error.response.data.message);
    //             console.log(error.response.data.message)
    //         }
    //     });
    // }

    pagination = (type) => {
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
        }
        else if (type === 'completed') {
            itemLength = this.state.completedProductsPagination.totalPages;
            currentPage = this.state.completedProductsPagination.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            //   html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getOrders(true, pageNumber, type, null, this.state.searchFilter)}>{pageNumber}</Link></li>);
        }
        return html;
    }


    getOrders = () => {
        let url = '/admin/service-order';
        this.dispatch(setLoading({ loading: true }));
        // this.dispatch(SpinnerLoader({ loading: true }));
        axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log("all servicess with user", response);
            const userdata = response.data.data.filter(item => item.serviceId !== null);
            this.setState({ 
                userServiceData: userdata,
                loading: false,
                error: null
            });
        })
            .catch(error => {
                if (error.response && error.response.data.status === false) {
                    toast.error(error.response.data.message);
                }
            }).finally(() => {
                setTimeout(() => {
                    this.dispatch(setLoading({ loading: false }));
                    //  this.dispatch(SpinnerLoader({ loading: false }));
                }, 300);
            });
    }

    componentDidMount() {
        this.getOrders();
    };


    userService_column = [
        {
            name: "USERS",
            selector: (row, i) => (row.userId && row.userId.name) ? row.userId.name : 'N/A',
            sortable: true
        },
        {
            name: "SERVICES",
            selector: (row, i) => row.serviceId.name || 'N/A',
            sortable: true
        },
        {
            name: "PRICE",
            selector: (row, i) => row.price || 'N/A',
            sortable: true
        },
        {
            name: "CREATEDBY",
            selector: (row, i) => row.serviceId.createdBy?.name || row.serviceId.createdByAdmin?.name || 'N/A',
            sortable: true
        },
    ]


    render() {
        const { pendingProducts, ongoingProducts, canceledProducts, completedProducts, pendingProductsPagination, ongoingProductsPagination, canceledProductsPagination, completedProductsPagination } = this.state;

        const { loading } = store.getState().global
        const options = this.state.options;
        const optionsCustomers = this.state.optionsCustomer;
        const optionsOrderStats = this.state.optionsOrderStatus;


        const { userServiceData } = this.state;
        // console.log('userServiceData-------',userServiceData)
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <div className="seller_body">
                    <Header />
                    <div className="inr_top_page_title">
                        <h2>Manage Services Orders</h2>
                    </div>
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                        <div className="dash_title">Ongoing Orders</div>
                                        <div className="">
                                            <Link className="btn custom_btn btn_yellow mx-auto " to="/admin/dashboard">
                                                <img src={arrow_back} alt="linked-in" />&nbsp;
                                                Back
                                            </Link>
                                        </div>
                                        {/* <div className="mpc_btns search_box d-flex align-items-center">
                                            <div className="input-group me-2">
                                                <input type="text" className="form-control" placeholder="Search products" aria-label="Search products" aria-describedby="button-addon2" onChange={this.handleChange} value={this.state.search} />
                                                <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.submitSearch}>Search</button>
                                            </div>
                                            <button className="btn custom_btn btn_yellow filter_btn" type="button" id="dropdownMenuFilter" data-bs-toggle="dropdown" aria-expanded="true">
                                                Filter
                                            </button>
                                            <div className="dropdown-menu filter_drop  dropdown-menu-lg-end" aria-labelledby="dropdownMenuFilter">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <ul className="filter_ul">
                                                            <li><b>Basic filter</b></li>
                                                            <li>
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDate" onChange={this.resetSearchFilter} />
                                                                    <label className="form-check-label" htmlFor="flexCheckDate">Date</label>

                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckVendor" onChange={this.resetCheckVendor} />
                                                                    <label className="form-check-label" htmlFor="flexCheckVendor">Vendor</label>

                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckStatus" onChange={this.resetCheckStatus} />
                                                                    <label className="form-check-label" htmlFor="flexCheckStatus">Status</label>
                                                                </div>
                                                            </li>
                                                            <li>
                                                                <div className="form-check">
                                                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckCustomer" onChange={this.resetCheckCustomer} />
                                                                    <label className="form-check-label" htmlFor="flexCheckCustomer">Customer</label>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-7 offset-lg-1">
                                                        <ul className="filter_ul">
                                                            <li><b>Advance filter</b></li>
                                                            <li>
                                                                <input type="date" className="form-control" name="searchDate" id="searchDate" onChange={this.setSearchFilter} />
                                                            </li>
                                                            <li>
                                                                {/*<input type="search" className="form-control" name="" id="" placeholder="Vendor" />*/}
                                        {/* <Autocomplete
                                                                    disablePortal
                                                                    id="combo-box-demo"
                                                                    name="vendor"
                                                                    options={options}
                                                                    onChange={this.setSearchFilter}
                                                                    sx={{ width: 300 }}
                                                                    renderInput={(params) => <TextField {...params} label="Vendor" />}
                                                                />
                                                            </li>
                                                            <li> */}
                                        {/*<select className="form-select" aria-label="Default select">
                                                                    <option >Status</option>
                                                                    <option value="1">One</option>
                                                                    <option value="2">Two</option>
                                                                    <option value="3">Three</option>
                                                                </select>*/}

                                        {/* <Autocomplete
                                                                    disablePortal
                                                                    id="combo-box-demo"
                                                                    name="status"
                                                                    onChange={this.setSearchFilter}
                                                                    options={optionsOrderStats}
                                                                    sx={{ width: 300 }}
                                                                    renderInput={(params) => <TextField {...params} label="Status" />}
                                                                />

                                                            </li>
                                                            <li> */}
                                        {/*<input type="search" className="form-control" name="" id="" placeholder="Customer" />*/}
                                        {/* <Autocomplete
                                                                    disablePortal
                                                                    id="combo-box-demo"
                                                                    name="customer"
                                                                    onChange={this.setSearchFilter}
                                                                    options={optionsCustomers}
                                                                    sx={{ width: 300 }}
                                                                    renderInput={(params) => <TextField {...params} label="Customer" />}
                                                                />
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                        </div> */}
                                    </div>
                                </div>
                                <nav className="orders_tabs">

                                    {/* <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true">Pending services</button>
                                        <button className="nav-link" id="nav-ongoing-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-ongoing-orders" type="button" role="tab" aria-controls="nav-ongoing-orders" aria-selected="false">Ongoing Orders</button>
                                        <button className="nav-link" id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true">Cancelled and Refunded Orders</button>
                                        <button className="nav-link" id="nav-completed-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-completed-orders" type="button" role="tab" aria-controls="nav-completed-orders" aria-selected="true">Completed Orders</button>
                                    </div> */}
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                        {/* {pendingProducts.length > 0 ? */}
                                        <DataTableExtensions
                                            columns={this.userService_column}
                                            data={userServiceData}
                                        >
                                            <DataTable
                                                pagination
                                                noHeader
                                                highlightOnHover
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                selectableRows
                                                //onSelectedRowsChange={this.handleRowSelected}
                                                //   selectedRows={selectedRows}
                                                paginationRowsPerPageOptions={[5, 8, 12, 16]}
                                                // paginationPerPage={paginationPerPage}
                                                paginationPerPage={5}
                                            />
                                        </DataTableExtensions>
                                        {/* : <NotFound msg="Data not found." />
                                        }
                                        {pendingProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pendingProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, pendingProductsPagination.prevPage, 'pending', null, this.state.searchFilter)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('pending')}
                                                    <li><Link to="#" className={`link ${pendingProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, pendingProductsPagination.nextPage, 'pending', null, this.state.searchFilter)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        } */}
                                    </div>
                                    <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                                        {ongoingProducts.length > 0 ?
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Product ID</th>
                                                        <th>Product<br />Name</th>
                                                        <th>Product<br />Color</th>
                                                        <th>Product<br />Size</th>
                                                        <th>Vendor’s<br />Share</th>
                                                        <th>Vendor’s<br />Name</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                        {/* <th className="invisible">action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ongoingProducts.length && ongoingProducts.map((value, index) => {
                                                        var productData = value.productId;
                                                        var productIdOngoing = '';
                                                        var productNameOngoing = '';
                                                        console.log(value)

                                                        var initial = 0;
                                                        return (

                                                            <>
                                                                {(() => {
                                                                    const arr = [];
                                                                    for (var i = 0; i < productData.length; i++) {
                                                                        //console.log('i='+i);

                                                                        var url = "/admin/manage-order-details/" + value._id;

                                                                        if (productData) {

                                                                            this.getProductData(productData).then((response) => {
                                                                                localStorage.setItem('productId', '');
                                                                                localStorage.setItem('productName', '');
                                                                                localStorage.setItem('productId', response.id);
                                                                                localStorage.setItem('productName', response.name);
                                                                                //sessionStorage.setItem('productId', '');
                                                                                //sessionStorage.setItem('productName', '');
                                                                                //sessionStorage.setItem('productId', response.id);
                                                                                //sessionStorage.setItem('productName', response.name);
                                                                                //window.productIdOngoing = response.id;
                                                                                //window.productNameOngoing = response.name;
                                                                                //console.log(response);    
                                                                            });

                                                                            productIdOngoing = localStorage.getItem('productId');
                                                                            productNameOngoing = localStorage.getItem('productName');
                                                                            //productIdOngoing = sessionStorage.getItem('productId');
                                                                            //productNameOngoing = sessionStorage.getItem('productName');
                                                                        }
                                                                        console.log('productIdOngoing=' + productIdOngoing);
                                                                        console.log('productNameOngoing=' + productNameOngoing);
                                                                        if (typeof productData[i]._id != 'undefined') {

                                                                            //this.getProductData(productData[i]._id);
                                                                            this.getProductData(productData[i]._id).then((response) => {
                                                                                localStorage.setItem('productId', '');
                                                                                localStorage.setItem('productName', '');
                                                                                localStorage.setItem('productId', response.id);
                                                                                localStorage.setItem('productName', response.name);
                                                                                //sessionStorage.setItem('productId', '');
                                                                                //sessionStorage.setItem('productName', '');
                                                                                //sessionStorage.setItem('productId', response.id);
                                                                                //sessionStorage.setItem('productName', response.name);

                                                                                //console.log(response);    
                                                                            });

                                                                            productIdOngoing = localStorage.getItem('productId');
                                                                            productNameOngoing = localStorage.getItem('productName');
                                                                            //productIdOngoing = sessionStorage.getItem('productId');
                                                                            //productNameOngoing = sessionStorage.getItem('productName');

                                                                        }
                                                                        arr.push(
                                                                            <tr key={index}>
                                                                                <td>{value.orderCode}</td>
                                                                                <td>{productIdOngoing}</td>
                                                                                <td>{productNameOngoing}</td>
                                                                                <td>{value.product_sku.color}</td>
                                                                                <td>{value.product_sku.size}</td>
                                                                                <td>${value.paymentId.amountPaid}</td>
                                                                                <td>{value.sellerId.name}</td>
                                                                                <td>{value.orderStatus.orderStatusId.title}</td>
                                                                                <td>{value.paymentId.paymentMode}</td>
                                                                                <td><Link to={url} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                                            </tr>
                                                                        );

                                                                        break;

                                                                    }

                                                                    return arr;

                                                                })()}
                                                            </>

                                                        )


                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {ongoingProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${ongoingProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, ongoingProductsPagination.prevPage, 'ongoing', null, this.state.searchFilter)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('ongoing')}
                                                    <li><Link to="#" className={`link ${ongoingProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, ongoingProductsPagination.nextPage, 'ongoing', null, this.state.searchFilter)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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
                                                        <th>Product<br />Name</th>
                                                        <th>Product<br />Color</th>
                                                        <th>Product<br />Size</th>
                                                        <th>Vendor’s<br />Share</th>
                                                        <th>Vendor’s<br />Name</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                        {/* <th className="invisible">action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {canceledProducts.length && canceledProducts.map((value, index) => {
                                                        var productData = value.productId;
                                                        var productIdCancel = '';
                                                        var productNameCancel = '';
                                                        return (

                                                            <>
                                                                {(() => {
                                                                    const arr = [];
                                                                    for (var i = 0; i < productData.length; i++) {
                                                                        var url = "/admin/manage-order-details/" + value._id;

                                                                        if (productData) {
                                                                            console.log('products=' + productData);
                                                                            this.getProductData(productData).then((response) => {

                                                                                //localStorage.setItem('productId', response.id);
                                                                                //localStorage.setItem('productName', response.name);
                                                                                sessionStorage.setItem('productId', response.id);
                                                                                sessionStorage.setItem('productName', response.name);
                                                                                //console.log(response);    
                                                                            });
                                                                            //productIdCancel = localStorage.getItem('productId');
                                                                            //productNameCancel = localStorage.getItem('productName');
                                                                            productIdCancel = sessionStorage.getItem('productId');
                                                                            productNameCancel = sessionStorage.getItem('productName');


                                                                        }

                                                                        if (typeof productData[i]._id != 'undefined') {

                                                                            this.getProductData(productData[i]._id);
                                                                            this.getProductData(productData[i]._id).then((response) => {
                                                                                //localStorage.setItem('productId', response.id);
                                                                                //localStorage.setItem('productName', response.name);
                                                                                sessionStorage.setItem('productId', response.id);
                                                                                sessionStorage.setItem('productName', response.name);

                                                                                //console.log(response);    
                                                                            });
                                                                            //productIdCancel = localStorage.getItem('productId');
                                                                            //productNameCancel = localStorage.getItem('productName');
                                                                            productIdCancel = sessionStorage.getItem('productId');
                                                                            productNameCancel = sessionStorage.getItem('productName');

                                                                        }
                                                                        arr.push(
                                                                            <tr key={index}>
                                                                                <td>{value.orderCode}</td>
                                                                                <td>{productIdCancel}</td>
                                                                                <td>{productNameCancel}</td>
                                                                                <td>{value.product_sku.color}</td>
                                                                                <td>{value.product_sku.size}</td>
                                                                                <td>${value.paymentId.amountPaid}</td>
                                                                                <td>{value.sellerId.name}</td>
                                                                                <td>{value.orderStatus.orderStatusId.title}</td>
                                                                                <td>{value.paymentId.paymentMode}</td>
                                                                                <td><Link to={url} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                                            </tr>
                                                                        );
                                                                        break;

                                                                    }
                                                                    return arr;
                                                                })()}
                                                            </>

                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {canceledProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${canceledProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, canceledProductsPagination.prevPage, 'cancel_refund', null, this.state.searchFilter)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('cancel_refund')}
                                                    <li><Link to="#" className={`link ${canceledProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, canceledProductsPagination.nextPage, 'cancel_refund', null, this.state.searchFilter)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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
                                                        <th>Product<br />Name</th>
                                                        <th>Product<br />Color</th>
                                                        <th>Product<br />Size</th>
                                                        <th>Vendor’s<br />Share</th>
                                                        <th>Vendor’s<br />Name</th>
                                                        <th>Status</th>
                                                        <th colSpan="2">Mode of<br />Payment</th>
                                                        {/* <th className="invisible">action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {completedProducts.length && completedProducts.map((value, index) => {
                                                        var productData = value.productId;
                                                        var productIdComplete = '';
                                                        var productNameComplete = '';
                                                        return (

                                                            <>
                                                                {(() => {
                                                                    const arr = [];

                                                                    for (var i = 0; i < productData.length; i++) {

                                                                        var url = "/admin/manage-order-details/" + value._id;
                                                                        if (!Array.isArray(productData)) {
                                                                            this.getProductData(productData).then((response) => {

                                                                                //localStorage.setItem('productId', response.id);
                                                                                //localStorage.setItem('productName', response.name);
                                                                                sessionStorage.setItem('productId', response.id);
                                                                                sessionStorage.setItem('productName', response.name);

                                                                                //console.log(response);    
                                                                            });
                                                                            //productIdComplete = localStorage.getItem('productId');
                                                                            //productNameComplete = localStorage.getItem('productName');
                                                                            productIdComplete = sessionStorage.getItem('productId');
                                                                            productNameComplete = sessionStorage.getItem('productName');
                                                                        }

                                                                        if (typeof productData[i].productId != 'undefined') {
                                                                            this.getProductData(productData[i].productId);
                                                                            this.getProductData(productData[i].productId).then((response) => {
                                                                                //localStorage.setItem('productId', response.id);
                                                                                //localStorage.setItem('productName', response.name);
                                                                                sessionStorage.setItem('productId', response.id);
                                                                                sessionStorage.setItem('productName', response.name);

                                                                                //console.log(response);    
                                                                            });
                                                                            //productIdComplete = localStorage.getItem('productId');
                                                                            //productNameComplete = localStorage.getItem('productName');
                                                                            productIdComplete = sessionStorage.getItem('productId');
                                                                            productNameComplete = sessionStorage.getItem('productName');

                                                                        }
                                                                        arr.push(
                                                                            <tr key={index}>
                                                                                <td>{value.orderCode}</td>
                                                                                <td>{productIdComplete}</td>
                                                                                <td>{productNameComplete}</td>
                                                                                <td>{value.product_sku.color}</td>
                                                                                <td>{value.product_sku.size}</td>
                                                                                <td>${value.paymentId.amountPaid}</td>
                                                                                <td>{value.sellerId.name}</td>
                                                                                <td>{value.orderStatus.orderStatusId.title}</td>
                                                                                <td>{value.paymentId.paymentMode}</td>
                                                                                <td><Link to={url} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                                                            </tr>
                                                                        );


                                                                    }
                                                                    return arr;
                                                                })()}
                                                            </>

                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {completedProducts.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${completedProductsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, completedProductsPagination.prevPage, 'completed', null, this.state.searchFilter)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('completed')}
                                                    <li><Link to="#" className={`link ${completedProductsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getOrders(true, completedProductsPagination.nextPage, 'completed', null, this.state.searchFilter)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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
