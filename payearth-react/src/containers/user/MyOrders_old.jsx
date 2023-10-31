import React, { Component } from 'react';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from './../../components/common/Footer';
import store from './../../store/index';
import axios from 'axios';

import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from './../../store/reducers/global-reducer';
import { Link } from 'react-router-dom';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import NotFound from './../../components/common/NotFound';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions"; 
import "react-data-table-component-extensions/dist/index.css";

class MyOrders extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            data: [],

            orderDataSet:'',
            columns:[],
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
                const columnsData = [
                    {
                      name: 'ID',
                      selector: (row, i) => row.id,
                      cell: (row) => <span>{row.id}</span>,
                      sortable: true,
                    },
                    {
                      name: 'Invoice Number',
                      selector: (row, i) => row.invoice_number,
                      cell: (row) => <span>{row.invoice_number}</span>,
                      sortable: true,
                    },
                    {
                      name: 'Payment Mode',
                      selector: (row, i) => row.payment_mode,
                      cell: (row) => <span>{row.payment_mode}</span>,
                      sortable: true,
                    },
                    {
                      name: 'Amount',
                      selector: (row, i) => row.amount,
                      cell: (row) => <span>${row.amount}</span>,
                      sortable: true,
                    },
                    {
                      name: 'Order Status',
                      selector: (row, i) => row.order_status,
                      cell: (row) => <span>{row.order_status}</span>,
                      sortable: true,
                    },
                     {
                         name: 'Actions',
                         cell: (row) => (
                             <>
                                 <button
                                     onClick={() => this.handleOrderReciept(row._id)}
                                     className="custom_btn btn_yellow_bordered w-auto btn"
                                 >
                                     Download
                                 </button>
                             </>
                         ),
                     }
                  ];
                this.setState({
                    orderDataSet: this.getDatatableData(response.data.data.orders),
                    columns: columnsData,
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

    handleOrderReciept = (id) => {
        /*axios.post('user/orders/' + id, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            
            if (response.data.status) {
                
                
                    
                
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });*/
    }
    pagination = () => {
        let html = [];
        for (let index = 0; index < this.state.pagination.totalPages; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${this.state.pagination.currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getOrders(true, pageNumber)}>{pageNumber}</Link></li>);
        }
        return html;
    }
    getDatatableData = (orderDataObj) => {
        
        let orderDataArray = [];
        orderDataObj.forEach(function(value) {
            
            orderDataArray.push({
                id:value.orderCode,
                invoice_number: value.paymentId.invoiceNo,
                payment_mode:value.paymentId.paymentAccount,
                amount:value.paymentId.amountPaid,
                order_status:value.orderStatus.orderStatusId.title
            });
            
        })
        return orderDataArray;
        
    }

    render() {

        const tableData = {
            columns: this.state.columns,
            data: this.state.orderDataSet
        };
        
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
                                    
                                    <div className="cart_list cart_wrap pb-5">
                                    
                                        <DataTableExtensions {...tableData}>
                                            <DataTable
                                                title="Table"
                                                columns={this.state.columns}
                                                data={this.state.orderDataSet}
                                                noHeader
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                pagination
                                                highlightOnHover
                                            />
                                        </DataTableExtensions>
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