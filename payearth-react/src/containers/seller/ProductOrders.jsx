import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/seller/common/Header';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { NotFound } from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";

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
            productOrderData: [],
            // currentTab: '',
            // pagination: {},
        }
        toast.configure();

        this.pendingOrders_column = [
            {
                name: 'PRODUCT IMAGE',
                selector: (row, i) => (
                    <img
                        src={row.product?.productId[0]?.featuredImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'PRODUCT NAME',
                selector: (row, i) => row.product?.productId[0]?.name,
                sortable: true
            },
            {
                name: 'BUYER DETAILS',
                selector: row => (
                    <>
                        <p>{row.userId?.name || 'N/A'}</p>
                        <p>{row.userId?.email || 'N/A'}</p>
                    </>
                ),
                sortable: true,
            },
            {
                name: 'QUANTITY',
                selector: (row, i) => row.product?.quantity || '',
                sortable: true
            },
            {
                name: 'PRODUCT PRICE',
                selector: (row, i) => row.product?.productId[0]?.price || '',
                sortable: true
            },
            {
                name: 'ORDER STATUS',
                selector: (row, i) => row.title,
                sortable: true
            },
            {
                name: 'ORDERED AT',
                selector: (row) => new Date(row.createdAt).toLocaleDateString(),
                sortable: true,
            }
            // {
            //     name: 'STATUS',
            //     cell: (row, i) => {
            //         return <>
            //             <Switch
            //                 on={true}
            //                 off={false}
            //                 value={row.isActive}
            //                 onChange={() => this.handleStatus(row.id, row.isActive)}
            //             />
            //         </>
            //     },
            //     sortable: true
            // },
            // {
            //     // name: 'STATUS',
            //     cell: (row, i) => {
            //         return (
            //             <>
            //                 <Link to={`/admin/manage-product-details/${row.id}`}>
            //                     <button className="custom_btn btn_yellow_bordered w-auto btn">DETAIL</button>
            //                 </Link>
            //             </>
            //         );
            //     },
            //     sortable: true
            // }
        ]

        this.cancleRefundsOrders_column = [
            {
                name: 'PRODUCT IMAGE',
                selector: (row, i) => (
                    <img
                        src={row.product?.productId[0]?.featuredImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'PRODUCT NAME',
                selector: (row, i) => row.product?.productId[0]?.name,
                sortable: true
            },
            {
                name: 'BUYER DETAILS',
                selector: row => (
                    <>
                        <p>{row.userId?.name || 'N/A'}</p>
                        <p>{row.userId?.email || 'N/A'}</p>
                    </>
                ),
                sortable: true,
            },
            {
                name: 'QUANTITY',
                selector: (row, i) => row.product?.quantity || '',
                sortable: true
            },
            {
                name: 'PRODUCT PRICE',
                selector: (row, i) => row.product?.productId[0]?.price || '',
                sortable: true
            },
            {
                name: 'ORDER STATUS',
                selector: (row, i) => row.title,
                sortable: true
            },
            {
                name: 'ORDERED AT',
                selector: (row) => new Date(row.createdAt).toLocaleDateString(),
                sortable: true,
            }
        ]

        this.completedOrders_column = [
            {
                name: 'PRODUCT IMAGE',
                selector: (row, i) => (
                    <img
                        src={row.product?.productId[0]?.featuredImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'PRODUCT NAME',
                selector: (row, i) => row.product?.productId[0]?.name,
                sortable: true
            },
            {
                name: 'BUYER DETAILS',
                selector: row => (
                    <>
                        <p>{row.userId?.name || 'N/A'}</p>
                        <p>{row.userId?.email || 'N/A'}</p>
                    </>
                ),
                sortable: true,
            },
            {
                name: 'QUANTITY',
                selector: (row, i) => row.product?.quantity || '',
                sortable: true
            },
            {
                name: 'PRODUCT PRICE',
                selector: (row, i) => row.product?.productId[0]?.price || '',
                sortable: true
            },
            {
                name: 'ORDER STATUS',
                selector: (row, i) => row.title,
                sortable: true
            },
            {
                name: 'ORDERED AT',
                selector: (row) => new Date(row.createdAt).toLocaleDateString(),
                sortable: true,
            }
        ]
    }

    componentDidMount() {
        this.getProductOrderData(true, "Order placed");
    }

    getProductOrderData = async (currentStatus, title) => {
        try {
            this.dispatch(setLoading({ loading: true }));
            const url = 'seller/getProductOrders';
            const response = await axios.get(url, {
                params: {
                    status: currentStatus,
                    title: title,
                    sellerId: this.authInfo.id
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            // console.log('response-------',response)
            if (response.data.status === true) {

                this.setState({ productOrderData: response.data.data });
            } else {
                // this.setState({ data: response.data.data });

            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            this.dispatch(setLoading({ loading: false }));
        }
    }

    // handleStatus = async (id, isActive) => {
    //     try {
    //         const status = !isActive;
    //         const updateStatusUrl = `/admin/productStatus/${id}`;
    //         await axios.put(updateStatusUrl, { isActive: status }, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json;charset=UTF-8',
    //                 'Authorization': `Bearer ${this.authInfo.token}`
    //             }
    //         });
    //         if (this.state.currentTab === 'trashTab') {
    //             this.getProductStock(false);
    //         } else {
    //             this.getProductStock(true);
    //         }

    //     } catch (error) {
    //         console.error("There was an error changing the status", error);
    //     }
    // }


    render() {
        const { loading } = store.getState().global;
        const { productOrderData } = this.state;

        console.log("productOrderData", productOrderData)

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
                                        <button className="nav-link" id="nav-cancelled&Refunds-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled&Refunds-orders" type="button" role="tab" aria-controls="nav-cancelled&Refunds-orders" aria-selected="true" onClick={() => this.getProductOrderData(true, 'Cancelled')}>Cancelled and Refunded Orders</button>
                                        <button className="nav-link" id="nav-completed-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-completed-orders" type="button" role="tab" aria-controls="nav-completed-orders" aria-selected="true" onClick={() => this.getProductOrderData(true, 'Delivered')}>Completed Orders</button>
                                    </div>
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">

                                    {/* Added product First */}
                                    <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                        <DataTableExtensions
                                            columns={this.pendingOrders_column}
                                            // data={data}
                                            data={productOrderData}
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
                                        <DataTableExtensions
                                            columns={this.cancleRefundsOrders_column}
                                            data={productOrderData}
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
                                        <DataTableExtensions
                                            columns={this.completedOrders_column}
                                            data={productOrderData}
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