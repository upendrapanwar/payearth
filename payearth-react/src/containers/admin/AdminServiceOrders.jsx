import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import arrow_back from './../../assets/icons/arrow-back.svg'
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";

class AdminServiceOrders extends Component {
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
            servicOrderData: [],
        }
        toast.configure();

        this.pendingOrders_column = [
            // {
            //     name: 'SERVICE IMAGE',
            //     selector: (row, i) => (
            //         <img
            //             src={row.product?.productId[0]?.featuredImage}
            //             alt="Not selected"
            //             style={{ width: "80px", height: "80px" }}
            //         />
            //     ),
            //     sortable: true
            // },
            {
                name: 'SERVICE CODE',
                selector: (row, i) => row.service.serviceCode,
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
            // {
            //     name: 'QUANTITY',
            //     selector: (row, i) => row.product?.quantity || '',
            //     sortable: true
            // },
            // {
            //     name: 'PRODUCT PRICE',
            //     selector: (row, i) => row.product?.productId[0]?.price || '',
            //     sortable: true
            // },
            {
                name: 'SERVICE STATUS',
                selector: (row, i) => row.title,
                sortable: true
            },
            {
                name: 'SERVICE CREATED',
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
            // {
            //     name: 'PRODUCT IMAGE',
            //     selector: (row, i) => (
            //         <img
            //             src={row.product?.productId[0]?.featuredImage}
            //             alt="Not selected"
            //             style={{ width: "80px", height: "80px" }}
            //         />
            //     ),
            //     sortable: true
            // },
            {
                name: 'SERVICE CODE',
                selector: (row, i) => row.service.serviceCode,
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
            // {
            //     name: 'QUANTITY',
            //     selector: (row, i) => row.product?.quantity || '',
            //     sortable: true
            // },
            // {
            //     name: 'PRODUCT PRICE',
            //     selector: (row, i) => row.product?.productId[0]?.price || '',
            //     sortable: true
            // },
            {
                name: 'SERVICE STATUS',
                selector: (row, i) => row.title,
                sortable: true
            },
            {
                name: 'SERVICE CREATED',
                selector: (row) => new Date(row.createdAt).toLocaleDateString(),
                sortable: true,
            }
        ]

        this.completedOrders_column = [
            // {
            //     name: 'SERVICE IMAGE',
            //     selector: (row, i) => (
            //         <img
            //             src={row.product?.productId[0]?.featuredImage}
            //             alt="Not selected"
            //             style={{ width: "80px", height: "80px" }}
            //         />
            //     ),
            //     sortable: true
            // },
            {
                name: 'SERVICE CODE',
                selector: (row, i) => row.service.serviceCode,
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
            // {
            //     name: 'QUANTITY',
            //     selector: (row, i) => row.product?.quantity || '',
            //     sortable: true
            // },
            // {
            //     name: 'PRODUCT PRICE',
            //     selector: (row, i) => row.product?.productId[0]?.price || '',
            //     sortable: true
            // },
            {
                name: 'SERVICE STATUS',
                selector: (row, i) => row.title,
                sortable: true
            },
            {
                name: 'COMPLETED DATE',
                selector: (row) => new Date(row.updatedAt).toLocaleDateString(),
                sortable: true,
            }
        ]
    }

    componentDidMount() {
        this.getServiceOrdersData(true, "charges_paid");
    }

    getServiceOrdersData = async (currentStatus, title) => {
        try {
            this.dispatch(setLoading({ loading: true }));
            const url = 'admin/getServiceOrders';
            const response = await axios.get(url, {
                params: {
                    status: currentStatus,
                    title: title,
                    // sellerId: this.authInfo.id
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            // console.log('response-------',response)
            if (response.data.status === true) {
                this.setState({ servicOrderData: response.data.data });
            } else {
                // this.setState({ data: response.data.data });

            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            this.dispatch(setLoading({ loading: false }));
        }
    }

    render() {
        const { loading } = store.getState().global;
        const { servicOrderData } = this.state;
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="inr_top_page_title">
                        <h2>Service Orders</h2>
                    </div>
                    <Helmet>
                        <title>{"Admin - Service Orders - Pay Earth"}</title>
                    </Helmet>
                    <div className="seller_dash_wrap pt-2 pb-5">
                        <div className="container">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap pb-2">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                        <div className="dash_title">Service Orders</div>
                                        {/* <Link to="/admin/dashboard" className="custom_btn btn_yellow w-auto btn">Back</Link> */}
                                        <div className=''>
                                            <button
                                                type="button"
                                                className="btn custum_back_btn btn_yellow mx-auto"
                                                onClick={() => window.history.back()}
                                            >
                                                <img src={arrow_back} alt="back" />&nbsp;
                                                Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <nav className="orders_tabs">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true" onClick={() => this.getServiceOrdersData(true, 'charges_paid')}>Pending Services</button>
                                        <button className="nav-link" id="nav-cancelled&Refunds-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled&Refunds-orders" type="button" role="tab" aria-controls="nav-cancelled&Refunds-orders" aria-selected="true" onClick={() => this.getServiceOrdersData(true, 'Cancelled')}>Cancelled and Refunded Services</button>
                                        <button className="nav-link" id="nav-completed-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-completed-orders" type="button" role="tab" aria-controls="nav-completed-orders" aria-selected="true" onClick={() => this.getServiceOrdersData(true, 'service_completed')}>Completed Services</button>
                                    </div>
                                </nav>
                                <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">

                                    {/* Added product First */}
                                    <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                        <DataTableExtensions
                                            columns={this.pendingOrders_column}
                                            // data={data}
                                            data={servicOrderData}
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
                                            data={servicOrderData}
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
                                            data={servicOrderData}
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

export default connect(setLoading)(AdminServiceOrders);
