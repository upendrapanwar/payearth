import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/seller/common/Header';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import Switch from 'react-input-switch';
import { Helmet } from 'react-helmet';
import { NotFound } from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import Select from 'react-select';

class ProductOrders extends Component {
    constructor(props) {
        super(props)
        this.authInfo = store.getState().auth.authInfo;
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.state = {
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                filter: {
                    type: "none",
                    is_service: false
                }
            },
            data: [],
            pendingProducts: [],
            rejectedProducts: [],
            currentTab: '',
            pagination: {},
            pendingProductsPagination: {},
            rejectedProductsPagination: {},
        }
        toast.configure();

        this.pendingOrders_column = [
            {
                name: 'PRODUCT IMAGE',
                selector: (row, i) => (
                    <img
                        src={row.featuredImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'PRODUCT ID',
                selector: (row, i) => row.productCode,
                sortable: true
            },
            {
                name: 'PRODUCT NAME',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'BRAND',
                selector: (row, i) => row.brand.brandName,
                sortable: true
            },
            {
                name: 'CATEGORY',
                selector: (row, i) => row.category.categoryName,
                sortable: true
            },
            {
                name: 'SELLER DETAILS',
                selector: row => (
                    <>
                        <p>{row.createdBy[0].name || 'N/A'}</p>
                        <p>{row.createdBy[0].email || 'N/A'}</p>
                    </>
                ),
                sortable: true,
            },
            {
                name: 'TOTAL STOCK QUANTITY',
                selector: (row, i) => row.quantity.stock_qty,
                sortable: true
            },
            {
                name: 'SELLING QUANTITY',
                selector: (row, i) => row.quantity.selling_qty,
                sortable: true
            },
            {
                name: 'STATUS',
                cell: (row, i) => {
                    return <>
                        <Switch
                            on={true}
                            off={false}
                            value={row.isActive}
                            onChange={() => this.handleStatus(row.id, row.isActive)}
                        />
                    </>
                },
                sortable: true
            },
            {
                // name: 'STATUS',
                cell: (row, i) => {
                    return (
                        <>
                            <Link to={`/admin/manage-product-details/${row.id}`}>
                                <button className="custom_btn btn_yellow_bordered w-auto btn">DETAIL</button>
                            </Link>
                        </>
                    );
                },
                sortable: true
            }
        ]

        this.cancleRefundsOrders_column = [
            {
                name: 'PRODUCT IMAGE',
                selector: (row, i) => (
                    <img
                        src={row.featuredImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'PRODUCT ID',
                selector: (row, i) => row.productCode,
                sortable: true
            },
            {
                name: 'PRODUCT NAME',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'BRAND',
                selector: (row, i) => row.brand.brandName,
                sortable: true
            },
            {
                name: 'CATEGORY',
                selector: (row, i) => row.category.categoryName,
                sortable: true
            },
            {
                name: 'SELLER DETAILS',
                selector: row => (
                    <>
                        <p>{row.createdBy[0].name || 'N/A'}</p>
                        <p>{row.createdBy[0].email || 'N/A'}</p>
                    </>
                ),
                sortable: true,
            },
            {
                name: 'TOTAL STOCK QUANTITY',
                selector: (row, i) => row.quantity.stock_qty,
                sortable: true
            },
            {
                name: 'SELLING QUANTITY',
                selector: (row, i) => row.quantity.selling_qty,
                sortable: true
            },
            {
                name: 'STATUS',
                cell: (row, i) => {
                    return <>
                        <Switch
                            on={true}
                            off={false}
                            value={row.isActive}
                            onChange={() => this.handleStatus(row.id, row.isActive)}
                        />
                    </>
                },
                sortable: true
            },
            {
                // name: 'STATUS',
                cell: (row, i) => {
                    return (
                        <>
                            <Link to={`/admin/manage-product-details/${row.id}`}>
                                <button className="custom_btn btn_yellow_bordered w-auto btn">DETAIL</button>
                            </Link>
                        </>
                    );
                },
                sortable: true
            }
        ]

        this.completedOrders_column = [
            {
                name: 'PRODUCT IMAGE',
                selector: (row, i) => (
                    <img
                        src={row.featuredImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'PRODUCT ID',
                selector: (row, i) => row.productCode,
                sortable: true
            },
            {
                name: 'PRODUCT NAME',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'BRAND',
                selector: (row, i) => row.brand.brandName,
                sortable: true
            },
            {
                name: 'CATEGORY',
                selector: (row, i) => row.category.categoryName,
                sortable: true
            },
            {
                name: 'SELLER DETAILS',
                selector: row => (
                    <>
                        <p>{row.createdBy[0].name || 'N/A'}</p>
                        <p>{row.createdBy[0].email || 'N/A'}</p>
                    </>
                ),
                sortable: true,
            },
            {
                name: 'TOTAL STOCK QUANTITY',
                selector: (row, i) => row.quantity.stock_qty,
                sortable: true
            },
            {
                name: 'SELLING QUANTITY',
                selector: (row, i) => row.quantity.selling_qty,
                sortable: true
            },
            {
                name: 'STATUS',
                cell: (row, i) => {
                    return <>
                        <Switch
                            on={true}
                            off={false}
                            value={row.isActive}
                            onChange={() => this.handleStatus(row.id, row.isActive)}
                        />
                    </>
                },
                sortable: true
            },
            {
                // name: 'STATUS',
                cell: (row, i) => {
                    return (
                        <>
                            <Link to={`/admin/manage-product-details/${row.id}`}>
                                <button className="custom_btn btn_yellow_bordered w-auto btn">DETAIL</button>
                            </Link>
                        </>
                    );
                },
                sortable: true
            }
        ]
    }

    componentDidMount() {
        this.getProductOrderData(true, "Order placed");
    }

    getProductOrderData = async (currentStatus, title) => {
        try {          
            // this.setState({ currentTab: currentTab })
            this.dispatch(setLoading({ loading: true }));
            const url = 'seller/getProductOrders';
            const response = await axios.get(url, {
                params: {
                    status: currentStatus,
                    title: title
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.status === true) {
                if (currentStatus === false) {
                    // this.setState({ rejectedProducts: response.data.data });
                } else {
                    // this.setState({ data: response.data.data });
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            this.dispatch(setLoading({ loading: false }));
        }
    }

    handleStatus = async (id, isActive) => {
        try {
            const status = !isActive;
            const updateStatusUrl = `/admin/productStatus/${id}`;
            await axios.put(updateStatusUrl, { isActive: status }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            if (this.state.currentTab === 'trashTab') {
                this.getProductStock(false);
            } else {
                this.getProductStock(true);
            }

        } catch (error) {
            console.error("There was an error changing the status", error);
        }
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
                    is_service: false
                }
            };
        } else {
            reqBody = this.state.reqBody;
        }

        reqBody.filter.type = type;
        this.dispatch(setLoading({ loading: true }));
        axios.post('seller/stock/items/' + this.authInfo.id, reqBody, {
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
                toast.error(error.response.data.message);
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
        } else if (type === 'pending') {
            itemLength = this.state.pendingProductsPagination.totalPages;
            currentPage = this.state.pendingProductsPagination.currentPage;
        } else if (type === 'reject') {
            itemLength = this.state.rejectedProductsPagination.totalPages;
            currentPage = this.state.rejectedProductsPagination.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getAddedProducts(true, pageNumber, type)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    halndleStatus = (event, productId) => {
        let reqBody = {
            is_active: event.target.checked,
            product_id: productId,
            seller_id: this.authInfo.id
        };

        this.dispatch(setLoading({ loading: true }));
        axios.put('seller/stock/items/status-update', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                toast.dismiss();
                toast.success(response.data.message, { autoClose: 3000 });
                let data = [...this.state.data];
                for (let index = 0; index < data.length; index++) {
                    if (data[index].id === productId) {
                        data[index].isActive = event.target.checked === true ? false : true;
                    }
                }
                this.setState({ data });
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    render() {
        const { loading } = store.getState().global;
        const {
            data,
            pendingProducts,
            rejectedProducts,
            pagination,
            pendingProductsPagination,
            rejectedProductsPagination
        } = this.state;

        console.log("data", data)

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="inr_top_page_title">
                        <h2>Product Orders</h2>
                    </div>
                    <Helmet>
                        <title>{"Product Orders - Pay Earth"}</title>
                    </Helmet>
                    <div className="seller_dash_wrap pt-2 pb-5">
                        <div className="container">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap pb-2">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                        <div className="dash_title">Product Orders</div>
                                        {/* <Link to="#" className="custom_btn btn_yellow w-auto btn">Add Product</Link> */}
                                    </div>
                                </div>
                                <nav className="orders_tabs">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true" onClick={() => this.getProductOrderData(true, 'Order placed')}>Pending Orders</button>
                                        <button className="nav-link" id="nav-cancelled&Refunds-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled&Refunds-orders" type="button" role="tab" aria-controls="nav-cancelled&Refunds-orders" aria-selected="true" onClick={() => this.getProductOrderData(false, 'Cancelled')}>Cancelled and Refunded Orders</button>
                                        <button className="nav-link" id="nav-completed-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-completed-orders" type="button" role="tab" aria-controls="nav-completed-orders" aria-selected="true" onClick={() => this.getProductOrderData(true, 'Delivered')}>Completed Orders</button>
                                    </div>
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">

                                    {/* Added product First */}
                                    <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                        <p>Pending</p>
                                        <DataTableExtensions
                                            columns={this.pendingOrders_column}
                                        // data={data}
                                        >
                                            <DataTable
                                                pagination
                                                noHeader
                                                highlightOnHover
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                paginationPerPage={5}
                                                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                            // selectableRows           
                                            />
                                        </DataTableExtensions>
                                    </div>

                                    {/* Second */}

                                    <div className="tab-pane fade" id="nav-cancelled&Refunds-orders" role="tabpanel" aria-labelledby="nav-cancelled&Refunds-orders-tab">
                                        <p>Canclled and refund</p>
                                        <DataTableExtensions
                                            columns={this.cancleRefundsOrders_column}
                                        // data={data}
                                        >
                                            <DataTable
                                                pagination
                                                noHeader
                                                highlightOnHover
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                paginationPerPage={5}
                                                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                            // selectableRows           
                                            />
                                        </DataTableExtensions>
                                    </div>

                                    {/* third */}

                                    <div className="tab-pane fade" id="nav-completed-orders" role="tabpanel" aria-labelledby="nav-completed-orders-tab">
                                        <p>Completed</p>
                                        <DataTableExtensions
                                            columns={this.completedOrders_column}
                                        // data={rejectedProducts}
                                        >
                                            <DataTable
                                                pagination
                                                noHeader
                                                highlightOnHover
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                paginationPerPage={5}
                                                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                            // selectableRows           
                                            />
                                        </DataTableExtensions>
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