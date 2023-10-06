import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import Footer from '../../components/common/Footer';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import { Autocomplete, Checkbox } from '@mui/material';
import { TextField } from '@material-ui/core';

class AdminPayments extends Component {
    constructor(props){
        super(props);
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state={
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 10
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                filter: {
                    type: "pending",
                    date: '',
                     vendor: '',
                    customer: '',
                    status: '',
                    is_service: false,
                },
            },
            search_value: "",
            searchFilter: [],

            options: '',
            optionsCustomer: '',
            optionsOrderStatus: '',
            pendingPayments: [],
            canceledPayments: [],
            completedPayments: [],
            pendingPaymentsPagination: {},
            canceledPaymentsPagination: {},
            completedPaymentsPagination: {},
            pagination: {},
            data:[],
            productData:[],
            userData: [],
            paymentsd:[],
           
            filteredProductData: null,
            convertDateString: null,
            selectedFilterResult: null,
        }
    }

    pagination = (type) => {
        /*let html = [];
        for (let index = 0; index < this.state.pagination.totalPages; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}>
                <Link
                    to="#"
                    className={`link ${this.state.pagination.currentPage === pageNumber ? 'active' : ''}`}
                    onClick={() => this.getPayments(true, pageNumber)}
                >
                    {pageNumber}
                </Link>
            </li>);
        }
        return html;*/
        
        let html = [];
        let itemLength = 0;
        let currentPage = 0;

        if (type === 'pending') {
            itemLength = this.state.pendingPaymentsPagination.totalPages;
            currentPage = this.state.pendingPaymentsPagination.currentPage;
        } else if (type === 'cancel') {
            itemLength = this.state.canceledPaymentsPagination.totalPages;
            currentPage = this.state.canceledPaymentsPagination.currentPage;
        }
        else if (type === 'completed') {
            itemLength = this.state.completedPaymentsPagination.totalPages;
            currentPage = this.state.completedPaymentsPagination.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getPayments(true, pageNumber, type, null,this.state.searchFilter)}>{pageNumber}</Link></li>);
        }
        return html;
    }
    
    getPayments = async (pagination, param,type,searchStr, searchFilter) => {
        
        let reqBody = {};


        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 10,
                    //skip: (param - 1) * 2,
                    limit: 10
                },
                //filter: {
                //    type: "ongoing",
                //    is_service: false
                //},
                filter: this.state.reqBody.filter,
                // search: searchStr,
                searchFilter: searchFilter

            };
        } else {
            reqBody = this.state.reqBody;
        }
        let url = 'admin/payments';
        this.dispatch(setLoading({ loading: true }));
        axios.post(url, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(async (response) => {
            //console.log(response);
            if (response.data.status) {
                let types = {
                    pending: 'pendingPayments',
                    cancel: 'canceledPayments',
                    completed: 'completedPayments'
                };
                let paginationNames = {
                    pending: 'pendingPaymentsPagination',
                    cancel: 'canceledPaymentsPagination',
                    completed: 'completedPaymentsPagination'
                };
                let obj = {};
                if (typeof response.data.data.payments != 'undefined') {
                    //console.log('getpayments=',response.data.data.payments);
                    let returnData = response.data.data.payments;
                    //console.log(returnData);
                    
                    //let paymentsData = this.getPaymentRecords(response.data.data.payments).then((json) => {
                    //    console.log(json);
                    //  });

                    let paymentsData = '';
                    
                    paymentsData = await this.getPaymentRecords(response.data.data.payments)
                    
                    //this.setState({
                    //    data: paymentsData,
                        //pagination: response.data.data.paginationData,

                    //});
                    
                    console.log("Response payment data :", paymentsData)
                    
                    if(types[type] === "pendingPayments") {
                        obj[types[type]] = [];
                        obj[paginationNames[type]] = [];
                        let result = returnData.filter(o => o.paymentStatus.includes('pending'));
                        //console.log('Pending length='+result.length);
                        if(result.length > 0) {
                            obj[types[type]] = paymentsData;
                            obj[paginationNames[type]] = response.data.data.paginationData;
                        }
                    }
                    if(types[type] === "canceledPayments") {
                        obj[types[type]] = [];
                        obj[paginationNames[type]] = [];
                        let result = returnData.filter(o => o.paymentStatus.includes('cancel'));
                        if(result.length > 0) {
                            //console.log('Cancel Request length='+result.length);
                            obj[types[type]] = paymentsData;
                            obj[paginationNames[type]] = response.data.data.paginationData;
                        }
                        
                    }
                    if(types[type] === "completedPayments") {
                        obj[types[type]] = [];
                        obj[paginationNames[type]] = [];
                        let result = '';
                        //console.log(this.state.reqBody.filter.status);
                        if(this.state.reqBody.filter.status) {
                            //console.log('here1');
                            result = returnData.filter(o => o.paymentStatus.includes(this.state.reqBody.filter.status));
                        } else {
                            
                            result = returnData.filter(o => o.paymentStatus.includes("paid"));
                            //console.log(paymentsData);
                        }
                        
                        if(result.length > 0) {
                            //console.log('Completed length='+result.length);
                            obj[types[type]] = paymentsData;
                            obj[paginationNames[type]] = response.data.data.paginationData;
                        }
                        this.getProductData(paymentsData)
                        
                    }
                    
                    //console.log('obj=',obj);
                    this.setState(obj);
                    
                    //setTimeout(() => {
                    //    this.getProductData()
                    //}, 1000)
                    //setTimeout(() => {
                        //this.getProductData()
                        //    .then(val => {
                               // this.setState({ 'data': val })
                        //    });
                        //this.getProductData(paymentsData)
                            
                    //}, 1000)
                    
                } else {

                    this.setState({
                        //data: [],
                        //pagination: [],
                    });
                }
            } else {
                this.setState({
                    //data: [],
                    //pagination: [],

                });
            }
            // console.log("Response data:", response.data.status)
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
    componentDidMount() {
        var element = document.getElementsByTagName("BODY")[0]
        element.style.overflow = 'unset';       
        //setTimeout(() => {
            this.getPayments(false, null, 'pending', null,null);
            this.getPayments(false, null, 'cancel_refund', null,null);
            this.getPayments(false, null, 'completed', null,null);
        //},2000);
        //setTimeout(() => {
            
            //this.getProductData();
        //},2000)
        this.getVendors();
        this.getcustomers();
        this.getOrderStatus();
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevState.search_value !== this.state.search_value && this.state.search_value === '') {
            this.setState({
                filteredProductData: null
            })
        }
    }
    //wait = (time) => {
    //    return new Promise(resolve => {
    //        setTimeout(resolve, time);
    //    });
    //}
    orderDataByPayId = async (itemId) => {
        try {
            let response = await axios.get('/admin/orderdatabypayid/' + itemId, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            })

            if (response.status) {
                
                //if (typeof response.data.data != 'undefined') {
                    
                    //console.log(response.data.data);
                    //console.log('ik',ik);
                    return response.data.data;
                    
                    //payments = [...payments,response.data.data]
                    
                    //return [...payments,response.data.data];
                    //payments = [...payments,response.data.data]
                    //console.log(payments);
                    //const responseData = response.data.data;
                    //for(var i in responseData)
                    //payments.push([i, responseData[i]]);
                    //payments[ik] = response.data.data;
                    //this.state.productData = response.data.data;
                    //console.log(payments[ik]);
                    //ik++;
                    //console.log('length payment=',payments);
                //}
                //else {
                //}
            }
        } catch (error) {
            console.error(error);
            return 'undefined';
        }
        
    }
    getPaymentRecords = async (paymentsRecords) => {

        if (typeof this.state.data != 'undefined') {
            let paymentData = paymentsRecords;
            var paymentsd = '';
            var payments = [];

            var ik = 0;
            if (typeof paymentData != 'undefined') {
                //paymentData && paymentData.map((items) => {
                for (let items of paymentData)  {
                    //console.log(paymentData);   
                    paymentsd = await this.orderDataByPayId(items._id);
                    //console.log('paymentsd=',paymentsd)
                    if(paymentsd === "undefined") {
                        payments.push('N/A');
                    } else {
                        payments.push(paymentsd);
                    }
                    
                    //console.log(payments)
                    //return payments; 
                }
                    //})
                //setTimeout(() => {
                    //console.log(payments);
                //    if (typeof paymentsd != 'undefined') {
                //        return paymentsd;
                //    }
                //}, 2000)
                
            }
            //console.log(payments);
            
            if (typeof payments != 'undefined') {
                
                return payments;
            }
        } else {
            return null;
        }
    }

    getProductData = async (payData) => {
        
        //let paymentData = this.state.data;
        let paymentData = payData;
        //var newArray = paymentData.filter(function(elem, pos) {
        //    return paymentData.indexOf(elem) == pos;

        //var newArray = this.state.data;
        var newArray = payData;
        //console.log(this.state.paymentsd);
        //console.log(payData);
        
        if (newArray) {
            
            var productsData = new Array();
            
            newArray.map((value, index) => {
                
                if (typeof value != 'undefined' && (value != 'N/A')) {
                    //console.log('inside');
                    for (var k = 0; (k < value.productId.length && k <10); k++) {    
                        const productID = value.productId[k].productId;
                        const quantity = value.productId[k].quantity;
                        const paymentId = value.paymentId;
                        const userId = value.userId;
                        const date = value.updatedAt;
                        const dateString = new Date(date);
                        const convertedDate = dateString.toLocaleDateString();
                        //console.log("productID=",productID);
                        axios.get('/admin/productbyid/' + productID, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json;charset=UTF-8',
                                'Authorization': `Bearer ${this.authInfo.token}`
                            }
                        }).then(async(response) => {
                            
                            if (response.status) {
                                const productname = response.data.data.name;
                                const categoryId = response.data.data.category;
                                const status = response.data.data.isActive;
                                const brandId = response.data.data.brand
                                
                                let userResponse = await axios.get('admin/users/' + userId, {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json;charset=UTF-8',
                                        'Authorization': `Bearer ${this.authInfo.token}`
                                    }
                                })
                                if(userResponse) {
                                    let customer = userResponse.data.data.name
                                    if (response.status) {
                                        productsData.push({
                                            productid: productID,
                                            productname: productname,
                                            quantity: quantity,
                                            status: status,
                                            brand: brandId.brandName,
                                            categoryname: categoryId.categoryName,
                                            paymentid: paymentId,
                                            convertedDate: convertedDate,
                                            customer: customer
                                        });
                                        //console.log('productsData',productsData);
                                        this.setState({ 'productData': productsData })
                                        //return productsData;    
                                    }
                                    
                                }
                                /*then((response) => {
                                    //const customer = response.data.data.name
                                    if (response.status) {
                                        productsData.push({
                                            productid: productID,
                                            productname: productname,
                                            quantity: quantity,
                                            status: status,
                                            brand: brandId.brandName,
                                            categoryname: categoryId.categoryName,
                                            paymentid: paymentId,
                                            convertedDate: convertedDate,
                                            customer: customer
                                        });
                                        console.log(productsData)
                                        this.setState({ 'productData': productsData })
                                        /*
                                        axios.get('/admin/categorybyid/' + categoryId, {
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json;charset=UTF-8',
                                                'Authorization': `Bearer ${this.authInfo.token}`
                                            }
                                        }).then((response) => {
                                            const category = response.data.data.categoryName;
                                            if (response.status) {
                                                axios.get('/admin/brandbyid/' + brandId, {
                                                    headers: {
                                                        'Accept': 'application/json',
                                                        'Content-Type': 'application/json;charset=UTF-8',
                                                        'Authorization': `Bearer ${this.authInfo.token}`
                                                    }
                                                }).then((response) => {
                                                    const brandname = response.data.data.brandName;
                                                    if (response.status) {
                                                        productsData.push({
                                                            productid: productID,
                                                            productname: productname,
                                                            quantity: quantity,
                                                            status: status,
                                                            brand: brandname,
                                                            categoryname: category,
                                                            paymentid: paymentId,
                                                            convertedDate: convertedDate,
                                                            customer: customer
                                                        });
                                                        console.log(productsData)
                                                        this.setState({ 'productData': productsData })
                                                        //localStorage.setItem('productData', productsData);
                                                    }
                                                })
                                                // const limitData = productsData.slice(0, 10);
                                                //const limitData = productsData;
                                                //console.log("limit data", productsData)


                                                //this.setState({ 'productData': '' })
                                                //this.setState({ 'productData': limitData })
                                                //localStorage.setItem('productData', limitData);
                                            }

                                        }).catch(error => {
                                            if (error.response && error.response.data.status === false) {
                                                toast.error(error.response.data.message);
                                            }
                                        })*/
                                    //}

                                /*}).catch(error => {
                                    if (error.response && error.response.data.status === false) {
                                        toast.error(error.response.data.message);
                                    }
                                })*/
                            }

                        }).catch(error => {
                            if (error.response && error.response.data.status === false) {
                                toast.error(error.response.data.message);
                            }
                        })
                    }
                    //console.log('tett',productsData);
                } else {
                    
                    productsData.push({
                                    productid: 'N/A',
                                    productname: 'N/A',
                                    quantity: 'N/A',
                                    status: 'N/A',
                                    brand: 'N/A',
                                    categoryname: 'N/A',
                                    paymentid: 'N/A',
                                    convertedDate: 'N/A',
                                    customer: 'N/A'
                                });
                    //console.log('productsData',productsData);            
                    this.setState({ 'productData': productsData })            
                }
            })
            
            //return productsData;
        }
        //},2000)
    }

    pendingPaymentData = (pendingPayments) => {
        
        return (
            <>
            {(() => {
               let tr = [];
                tr.push(<tr align="center"><td  colSpan={7}>No Record Available</td></tr>)
                return tr;
        })()}
        </>
        )
        
    }

    showPaymentSucessData = (successPaydata) => {
        //console.log(this.state.productData);
        successPaydata = this.state.productData;
        return (
            
            <>
            {(() => {
                let tr = [];
                //var returnHtml = '';
                var productId = '';
                var productName = '';
                var productBrand = '';
                var categoryName = '';
                var quantity = ''; 
                if(typeof successPaydata != 'undefined') {
                    //console.log("successPaydata",successPaydata);
                    //console.log(successPaydata);
                    for(var i=0;i<successPaydata.length;i++){
                        var urlPaymentDetails = "/admin/manage-payment-details/"+ successPaydata[i].paymentid;
                        //console.log(successPaydata);
                        if(typeof successPaydata[i].productid === 'undefined') {
                            productId = 'N/A';
                        } else {
                            productId = successPaydata[i].productid;
                        }
                        if(typeof successPaydata[i].productname === 'undefined') {
                            productName = 'N/A';
                        } else {
                            productName = successPaydata[i].productname;
                        }
                        if(typeof successPaydata[i].brand === 'undefined') {
                            productBrand = 'N/A';
                        } else {
                            productBrand = successPaydata[i].brand;
                        }
                        if(typeof successPaydata[i].categoryname === 'undefined') {
                            categoryName = 'N/A';
                        } else {
                            categoryName = successPaydata[i].categoryname;
                        }
                        if(typeof successPaydata[i].quantity === 'undefined') {
                            quantity = 'N/A';
                        } else {
                            quantity = successPaydata[i].quantity;
                        }
                            
                        tr.push(
                            <tr>
                                <td>{productId}</td>
                                <td>{productName}</td>
                                <td>{productBrand}</td>
                                <td>{categoryName}</td>
                                <td>{quantity}</td>
                                <td>Success</td>
                               {/*<td><Link to={urlPaymentDetails} className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>*/}
                            </tr>
                        )
                    
                    }
                } else {
                    tr.push(<tr align="center"><td colSpan={7}>No Record Available</td></tr>)
                }
                return tr;
            })()}
        </>
        )
    }
    cancelPaymentData = () => {
        return (
            <>
            {(() => {
               let tr = [];
                tr.push(<tr align="center"><td  colSpan={7}>No Record Available</td></tr>)
                return tr;
        })()}
        </>
        )
    }
    searchingDataNotMatch = () => {
        return (
            <>
                {(() => {
                    let tr = [];
                    tr.push(<tr align="center"><td colSpan={12}>No Record Match</td></tr>)
                    return tr;
                })()}
            </>
        )
    }
    setSearchFilter = (event, value, reason,) => {

        //searchDate
        if (event.target.name) {
            if (event.target.name === 'searchDate' && document.getElementById('flexCheckDate').checked) {
                var val = event.target.value
                var dateString = new Date(val);
                const date = dateString.toLocaleDateString();

                //this.setState({
                //    filter : { 'date': val }
                //})
                this.setState({
                    reqBody: {
                        filter: { ...this.state.reqBody.filter, ...{ 'date': date } }
                    }
                })
            }
        }

        if (typeof value === 'object') {
            // status 
            if (value.stype == "status" && document.getElementById('flexCheckStatus').checked) {

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

            // // vendors 
            // if (value.stype == "vendor" && document.getElementById('flexCheckVendor').checked) {
            //     var val = value.label
            //     //this.setState({
            //     //    filter : { 'vendor': val }
            //     //})
            //     this.setState({
            //         reqBody: {
            //             filter: { ...this.state.reqBody.filter, ...{ 'vendor': val } }
            //         }
            //     })
            // }


            // customer
            if (value.stype == "customer" && document.getElementById('flexCheckCustomer').checked) {
                var val = value.label
                this.setState({
                    reqBody: {
                        filter: { ...this.state.reqBody.filter, ...{ 'customer': val } }
                    }
                })
            }
        }
        //console.log(this.state.reqBody.filter);

        this.allFilterFunction()
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

    resetCheckVendor = () => {
        if(!document.getElementById('flexCheckVendor').checked) {
            this.setState({
                reqBody: {
                    filter : { ...this.state.reqBody.filter, ...{ 'vendor': '' } }   
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
        this.getPayments(true, 1, 'pending', this.state.search,this.state.searchFilter);
        this.getPayments(true, 1, 'cancel_refund', this.state.search,this.state.searchFilter);
        this.getPayments(true, 1, 'completed', this.state.search,this.state.searchFilter);
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
                // console.log("sellerData / getVandor : ", sellerData)

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
                let result = response.data.data;
                // console.log("getCustomer", result)

                var userData = [];
                result.map(function (val, index) {

                    userData.push({
                        id: val.id,
                        label: val.name,
                        stype: 'customer'
                    })
                })
                // console.log("userData getCustomer", userData)

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
    
    getOrderStatus = () => {
        let reqBody = {};
        reqBody = this.state.reqBody;
        var url = "admin/orderstatus";
        axios.post(url, reqBody,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                //console.log(response.data.data);
                let result = response.data.data;
                var orderStatusData = [];
                result.map(function (val, index) {
                    
                    orderStatusData.push({
                        id: val.id, 
                        label: val.title,
                        stype: 'status'
                    })
                    
                })
                
                this.setState({
                    optionsOrderStatus: orderStatusData
                })
            }
        }).catch(error => {
            
            if (error.response && error.response.data.status === false) {
                //toast.error(error.response.data.message);
                console.log(error.response.data.message)
            }
        });
    }
    
    handleFilterChange = (event) => {
        this.setState({ search_value: event.target.value });
    }

    handleFilterClick = () => {
        const { productData, search_value } = this.state;

        // replace (productData) when all product data show.........
        const values = Object.values(productData)

        const filteredProduct = search_value ?
            values.filter((item) => {
                const search_value = this.state.search_value.toLowerCase();
                const productname = item.productname.toLowerCase();
                const categoryname = item.categoryname.toLowerCase();
                const brand = item.brand.toLowerCase();
                const customer = item.customer.toLowerCase();
                return productname.includes(search_value) || categoryname.includes(search_value) || brand.includes(search_value) || customer.includes(search_value);
            })
            :
            productData;


        var currentPageNo = 1;
        var itemPerPage = 10;
        const lastIndex = currentPageNo * itemPerPage;
        const firstIndex = lastIndex - itemPerPage;
        const filteredProductData = filteredProduct.slice(firstIndex, lastIndex);

        // console.log("result", filteredProductData)

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredProduct.length / itemPerPage); i++) {
            pageNumbers.push(i);
            //console.log("pageNumber", pageNumbers)
        }
        this.setState({
            filteredProductData,
            pageNumbers,
        });
    }

    allFilterFunction = () => {
        const { productData, selectedFilterResult } = this.state;
        const selectFilterOptions = this.state.reqBody.filter;
        // console.log("RENDER SELECT FILTER", selectFilterOptions)

        if (selectFilterOptions === undefined || selectFilterOptions === '') {
            return productData;
        } else {
            const filterByDate = productData.filter(item => item.convertedDate === this.state.reqBody.filter.date);
            const filterByCustomer = productData.filter(item => item.customer === this.state.reqBody.filter.customer);
            // const filterByStatus = productData.filter( item=> item.status === this.state.reqBody.filter.status);
            const result = filterByDate.concat(filterByCustomer)

            const uniqueData = result.reduce((acc, obj) => {
                const found = acc.some(item => item.paymentid === obj.paymentid);
                if (!found) {
                    acc.push(obj);
                }
                return acc;
            }, []);
            //console.log("result Concate", uniqueData)

            if (selectedFilterResult === null) {
                this.setState({
                    filteredProductData: uniqueData
                })
            } else {
                this.setState({ selectedFilterResult: result })
            }
        }

        // console.log("filterBY DATE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", filterByDate)
        // console.log("filterBY Customer>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", filterByCustomer)     
    }


    filteredProduct = () => {
        const { productData, convertDateString } = this.state;
        if (convertDateString === null) {
            return productData;
        }
        const selectedDateData = productData.filter(product => product.convertedDate === convertDateString);
        //console.log("selectDateDATA>>>>>>>>.: ", selectedDateData)
        return selectedDateData;
    }
    handleClick = (event) => {
        this.setState({
            currentPageNo: Number(event.target.id)
        });
    }
    handlePrevious = () => {
        const { currentPageNo } = this.state;
        if (currentPageNo > 1) {
            this.setState({
                currentPageNo: currentPageNo - 1
            });
        }
    }
    handleNext = (prevState) => {
        const { currentPageNo, filteredProduct } = this.state;
        const totalPages = Math.ceil(2);
        if (currentPageNo < totalPages) {
            this.setState({
                currentPageNo: currentPageNo + 1,
                filteredProductData: [...prevState.allSearchingPayment, ...filteredProduct]
            });
        }
    }
    render() {
        const { pendingPayments, canceledPayments, completedPayments, pendingPaymentsPagination, canceledPaymentsPagination, completedPaymentsPagination } = this.state;
        const { loading } = store.getState().global;
        const successPaydata = this.state.productData;
        //console.log(completedPaymentsPagination);
        const options = this.state.options;
        const optionsCustomers = this.state.optionsCustomer;
        const optionsOrderStats =  this.state.optionsOrderStatus;
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                    <div className="dash_title">Payments</div>
                                    <div className="mpc_btns search_box d-flex align-items-center">
                                        <div className="input-group me-2">
                                            <input type="text" className="form-control" placeholder="Search products" aria-label="Search products" aria-describedby="button-addon2" />
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
                                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDate" onChange={this.resetSearchFilter}/>
                                                                <label className="form-check-label" htmlFor="flexCheckDate">Date</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckVendor" onChange={this.resetCheckVendor}/>
                                                                <label className="form-check-label" htmlFor="flexCheckVendor">Vendor</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckStatus" onChange={this.resetCheckStatus}/>
                                                                <label className="form-check-label" htmlFor="flexCheckStatus">Status</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" value="" id="flexCheckCustomer" onChange={this.resetCheckCustomer}/>
                                                                <label className="form-check-label" htmlFor="flexCheckCustomer">Customer</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="col-md-7 offset-lg-1">
                                                    <ul className="filter_ul">
                                                        <li><b>Advance filter</b></li>
                                                        <li>
                                                            <input type="date" className="form-control" name="" id="" />
                                                        </li>
                                                        <li>
                                                             {/*<input type="search" className="form-control" name="" id="" placeholder="Vendor" />*/}
                                                             <Autocomplete
                                                                        disablePortal
                                                                        id="combo-box-demo"
                                                                        name="vendor"
                                                                        options={options}
                                                                        onChange={this.setSearchFilter}
                                                                        sx={{ width: 300 }}
                                                                        renderInput={(params) => <TextField {...params} label="Vendor" />}
                                                                    />
                                                        </li>
                                                        <li>
                                                            {/*<select className="form-select" aria-label="Default select">
                                                                    <option >Status</option>
                                                                    <option value="1">One</option>
                                                                    <option value="2">Two</option>
                                                                    <option value="3">Three</option>
                                                                </select>*/}

                                                                <Autocomplete
                                                                        disablePortal
                                                                        id="combo-box-demo"
                                                                        name="status"
                                                                        onChange={this.setSearchFilter}
                                                                        options={optionsOrderStats}
                                                                        sx={{ width: 300 }}
                                                                        renderInput={(params) => <TextField {...params} label="Status" />}
                                                                    />
                                                        </li>
                                                        <li>
                                                            {/*<input type="search" className="form-control" name="" id="" placeholder="Customer" />*/}
                                                            <Autocomplete
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

                                    </div>
                                </div>
                            </div>
                            <nav className="orders_tabs">
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true">Pending Payments</button>
                                    <button className="nav-link" id="nav-ongoing-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-ongoing-orders" type="button" role="tab" aria-controls="nav-ongoing-orders" aria-selected="false">Successful Payments</button>
                                    <button className="nav-link" id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true">Cancelled Payments</button>
                                </div>
                            </nav>
                            <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                    <table className="table table-responsive table-bordered">
                                        <thead>
                                            <tr>
                                                <th>S.No.</th>
                                                <th>Payment ID</th>
                                                <th>Order ID</th>
                                                <th>Product ID</th>
                                                <th>Product<br />Name</th>
                                                <th>Status</th>
                                                <th>Mode of <br />Payment</th>
                                                <th className="invisible">action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.pendingPaymentData()}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                                    {completedPayments.length > 0 ?
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Product ID</th>
                                                    <th>Product Name</th>
                                                    <th>Brand</th>
                                                    <th>Category</th>
                                                    <th>Total Stock quantity</th>
                                                    <th>Status</th>
                                                    <th className="invisible">action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.showPaymentSucessData(completedPayments)}
                                                {/*console.log(completedPayments)*/}
                                            </tbody>
                                        </table>
                                        : <NotFound msg="Data not found." />
                                    }
                                    {completedPayments.length > 0 &&
                                            <div className="pagination">
                                                <ul>                                                                                                                
                                                    <li><Link to="#" className={`link ${completedPaymentsPagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getPayments(true, completedPaymentsPagination.prevPage, 'completed', null,this.state.searchFilter)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination('completed')}
                                                    <li><Link to="#" className={`link ${completedPaymentsPagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getPayments(true, completedPaymentsPagination.nextPage, 'completed', null,this.state.searchFilter)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                </div>
                                <div className="tab-pane fade" id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
                                    <table className="table table-responsive table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Product ID</th>
                                                <th>Product Name</th>
                                                <th>Brand</th>
                                                <th>Category</th>
                                                <th>Total Stock quantity</th>
                                                <th>Status</th>
                                                <th className="invisible">action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/*<tr>
                                                <td>QE123311</td>
                                                <td>Roadster Jeans</td>
                                                <td>Roadster</td>
                                                <td>Cloths</td>
                                                <td>255</td>
                                                <td>Rejected</td>
                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>QE123311</td>
                                                <td>Roadster Jeans</td>
                                                <td>Roadster</td>
                                                <td>Cloths</td>
                                                <td>255</td>
                                                <td>Rejected</td>
                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>QE123311</td>
                                                <td>Roadster Jeans</td>
                                                <td>Roadster</td>
                                                <td>Cloths</td>
                                                <td>255</td>
                                                <td>Rejected</td>
                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>QE123311</td>
                                                <td>Roadster Jeans</td>
                                                <td>Roadster</td>
                                                <td>Cloths</td>
                                                <td>255</td>
                                                <td>Rejected</td>
                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>QE123311</td>
                                                <td>Roadster Jeans</td>
                                                <td>Roadster</td>
                                                <td>Cloths</td>
                                                <td>255</td>
                                                <td>Rejected</td>
                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>QE123311</td>
                                                <td>Roadster Jeans</td>
                                                <td>Roadster</td>
                                                <td>Cloths</td>
                                                <td>255</td>
                                                <td>Rejected</td>
                                                <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>*/}
                                            {this.cancelPaymentData()}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </React.Fragment >

        );
    }
}

export default connect(setLoading)(AdminPayments);
