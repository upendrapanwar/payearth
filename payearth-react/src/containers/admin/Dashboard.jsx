import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/admin/common/Header';
import axios from 'axios';
import SpinnerLoader from "./../../components/common/SpinnerLoader";
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import GoogleAnalyticsEvents from './GoogleAnalyticsEvents';
import { Helmet } from 'react-helmet';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            loading: true,
            activeTab: "productOrders",
            productCount: "0",
            serviceCount: "0",
            userCount: "0",
            sellerCount: "0",
            orderCount: "0",
            stockQty: "0",
            totalPaymentAmount: "0",
            hasRun: false,
            listedServices: [],
            listedProducts: [],
            serviceYear: new Date().getFullYear(),
            productYear: new Date().getFullYear(),
            topCategories: [],
            productSalesData: [],
            serviceSalesData: [],
            listedVendors: [],
            listedBuyers: [],
            productOrders: [],
            serviceOrders: [],
            subscriptionOrders: [],
            countryWiseAnalytics: [],
            pathViewAnalytics: [],
            activeAndNewUsers: []
        };

        // console.log("productYear", this.state.productYear)

        this.listed_Service = [
            {
                name: 'SERVICES',
                selector: (row, i) => (
                    <img
                        src={row.featuredImage}
                        alt="Not Found"
                        style={{ width: "100px", height: "80px", borderRadius: "10px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'SERVICE CODE',
                selector: (row, i) => row.serviceCode,
                sortable: true
            },
            {
                name: 'SERVICE NAME',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'CHARGES',
                selector: (row, i) => `$${row.charges}`,
                sortable: true
            },
            // {
            //     name: 'Sales',
            //     selector: (row, i) => "null",
            //     sortable: true
            // },
            // {
            //     name: 'Review',
            //     selector: (row, i) => row.reviews.length,
            //     sortable: true
            // },
            // {
            //     name: 'Profite',
            //     selector: (row, i) => "null",
            //     sortable: true
            // },
            // {
            //     name: 'Revenue',
            //     selector: (row, i) => "Null",
            //     sortable: true
            // },
        ];

        this.listed_Product = [
            {
                name: 'PRODUCTS',
                selector: (row, i) => (
                    <img
                        src={row.featuredImage}
                        alt="Not Found"
                        style={{ width: "80px", height: "80px", borderRadius: "10px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'PRODUCT CODE',
                selector: (row, i) => row.productCode,
                sortable: true
            },
            {
                name: 'PRODUCT Name',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'PRICE',
                selector: (row, i) => `$${row.price}`,
                sortable: true
            },
            // {
            //     name: 'Sales',
            //     selector: (row, i) => row.quantity.selling_qty,
            //     sortable: true
            // },
            // {
            //     name: 'Stock',
            //     selector: (row, i) => row.quantity.stock_qty,
            //     sortable: true
            // },
            // {
            //     name: 'Review',
            //     selector: (row, i) => "null",
            //     sortable: true
            // },
            // {
            //     name: 'Profite',
            //     selector: (row, i) => "null",
            //     sortable: true
            // },
            // {
            //     name: 'Revenue',
            //     selector: (row, i) => "Null",
            //     sortable: true
            // },
        ];

        this.listed_Vendors = [
            {
                name: 'NAME',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'EMAIL',
                selector: (row, i) => row.email,
                sortable: true
            },
            // {
            //     name: 'Address',
            //     selector: (row, i) => "Null",
            //     sortable: true
            // },
            {
                name: 'PHONE',
                selector: (row, i) => row.phone,
                sortable: true
            },
            {
                name: 'SELLER TYPE',
                selector: (row, i) => row.seller_type,
                sortable: true
            },
            // {
            //     name: 'Want to sell',
            //     selector: (row, i) => row.want_to_sell,
            //     sortable: true
            // },
        ];

        this.listed_Buyers = [
            {
                name: 'NAME',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'EMAIL',
                selector: (row, i) => row.email,
                sortable: true
            },
            // {
            //     name: 'ADDRESS',
            //     selector: (row, i) => "Null",
            //     sortable: true
            // },
            {
                name: 'PHONE',
                selector: (row, i) => row.phone,
                sortable: true
            },
            // {
            //     name: 'Seller Type',
            //     selector: (row, i) => row.seller_type,
            //     sortable: true
            // },
            // {
            //     name: 'Want to sell',
            //     selector: (row, i) => row.want_to_sell,
            //     sortable: true
            // },
        ];

        this.listed_productOrders = [
            {
                name: 'ORDER CODE',
                selector: (row, i) => row.orderCode,
                sortable: true
            },
            {
                name: 'ORDER AMOUNT',
                selector: (row, i) => `$ ${row.total}`,
                sortable: true
            },
            {
                name: 'DISCOUNT',
                selector: (row, i) => `$ ${row.discount}`,
                sortable: true
            },
            // {
            //     name: 'ORDER STATUS',
            //     selector: (row, i) => row.orderStatus[0].title,
            //     sortable: true
            // },
            {
                name: 'PAYMENT ACCOUNT',
                selector: (row, i) => row.paymentId.paymentAccount,
                sortable: true
            },
        ];


        this.listed_serviceOrders = [
            {
                name: 'ORDER CODE',
                selector: (row, i) => row.orderCode,
                sortable: true
            },
            {
                name: 'ORDER AMOUNT',
                selector: (row, i) => `$ ${row.total}`,
                sortable: true
            },
            {
                name: 'ORDER STATUS',
                selector: (row, i) => row.orderStatus[0]?.title,
                sortable: true
            },
            {
                name: 'PAYMENT ACCOUNT',
                selector: (row, i) => row.paymentId.paymentAccount,
                sortable: true
            },
        ];

        this.listed_subscriptionOrders = [
            {
                name: 'ORDER CODE',
                selector: (row, i) => row.orderCode,
                sortable: true
            },
            {
                name: 'ORDER AMOUNT',
                selector: (row, i) => `$ ${row.total}`,
                sortable: true
            },
            {
                name: 'ORDER STATUS',
                selector: (row, i) => row.orderStatus[0].title,
                sortable: true
            },
            {
                name: 'PAYMENT ACCOUNT',
                selector: (row, i) => row.paymentId.paymentAccount,
                sortable: true
            },
        ];

        this.pageViewCount = [
            {
                name: 'PAGE PATH',
                selector: (row) => `https://www.pay.earth${row.pagePath}`,
                sortable: true
            },
            {
                name: 'PAGE TITLE',
                selector: (row, i) => row.pageTitle,
                sortable: true
            },
            {
                name: 'VIEW COUNTS',
                selector: (row, i) => row.viewCount,
                sortable: true
            },
        ];
    }

    componentDidMount() {
        this.getTopSellingCategories();
        this.getDashboardData();
        this.countryWiseAnalyticsData();
        this.activeAndNewUsersData();
        this.getOrdersDetails();
        this.getProductSalesGraph();
        this.getServiceSalesGraph();
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.serviceYear !== this.state.serviceYear) {
            this.getServiceSalesGraph();
        }
        if (prevState.productYear !== this.state.productYear) {
            this.getProductSalesGraph();
            this.getServiceSalesGraph();
        }
    }

    handleScroll = () => {
        const { hasRun } = this.state;
        if (!hasRun) {
            this.pathViewAnalyticsData();
            this.getListedServices();
            this.getListedproducts();
            this.getListedVendors();
            this.getListedBuyers();
            this.setState({ hasRun: true });
            window.removeEventListener('scroll', this.handleScroll);
        }
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    getTopSellingCategories = () => {
        axios.get("admin/getTopSellingCategories", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${this.authInfo.token}`,
            },
        })
            .then((response) => {
                const data = response.data.data.data;
                const topCategories = data.map((item) => ({
                    value: item.count,
                    label: item.name,
                }));
                this.setState({ topCategories: topCategories, loading: false });
            })
            .catch((error) => {
                if (error.response && error.response.data.status === false) {
                    console.log("error", error.response.data.message)
                }
            })
            .finally(() => {
                setTimeout(() => {
                    this.setState({ loading: false });
                }, 300);
            });
    };


    getProductSalesGraph = async () => {
        try {
            this.setState({ loading: true });
            const url = `/admin/productSalesGraph?year=${this.state.productYear}`;
            console.log('getProductSalesGraph---url', url)
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            this.setState({ productSalesData: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    getServiceSalesGraph = async () => {
        try {
            this.setState({ loading: true });
            const url = `/admin/serviceSalesGraph?year=${this.state.productYear}`;
            console.log('getServiceSalesGraph----url', url)
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });

            const data = response.data.data;
            this.setState({ serviceSalesData: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    getDashboardData = async () => {
        try {
            const url = "/admin/getDashboardData";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });

            const data = response.data.data
            this.setState({
                productCount: data.productCount,
                serviceCount: data.serviceCount,
                userCount: data.userCount,
                sellerCount: data.sellerCount,
                orderCount: data.orderCount,
                stockQty: data.stockQty,
                totalPaymentAmount: data.totalPaymentAmount,
                loading: false
            });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    getListedproducts = async () => {
        try {
            // this.dispatch(setLoading({ loading: true }));
            const url = 'admin/getProductData';
            const response = await axios.get(url, {
                params: {
                    status: true
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.status === true) {
                this.setState({ listedProducts: response.data.data, loading: false })
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setTimeout(() => {
                this.setState({ loading: false });
            }, 300);
        }
    };


    getListedServices = async () => {
        try {
            // this.dispatch(setLoading({ loading: true }));
            const url = 'admin/getListedServicesData';
            const response = await axios.get(url, {
                params: {
                    status: true
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.status === true) {
                this.setState({ listedServices: response.data.data, loading: false })
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setTimeout(() => {
                this.setState({ loading: false });
            }, 300);
        }
    };

    getListedVendors = async () => {
        try {
            this.setState({ loading: true });
            const url = "admin/getVendorsData";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            this.setState({ listedVendors: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    getListedBuyers = async () => {
        try {
            this.setState({ loading: true });
            const url = "admin/getBuyersData";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            this.setState({ listedBuyers: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    getOrdersDetails = async () => {
        try {
            this.setState({ loading: true });
            const url = "admin/getOrderDetails";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data.data;
            this.setState({ "productOrders": data.productOrders, loading: false });
            this.setState({ "serviceOrders": data.serviceOrders, loading: false });
            this.setState({ "subscriptionOrders": data.subscriptionCharges, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    handlePreviousServiceYear = () => {
        this.setState(prevState => ({
            serviceYear: prevState.serviceYear - 1,
        }));
    };

    handleNextServiceYear = () => {
        this.setState(prevState => ({
            serviceYear: prevState.serviceYear + 1,
        }));
    };

    handlePreviousProductYear = () => {
        this.setState(prevState => ({
            productYear: prevState.productYear - 1,
        }));
    };

    handleNextProductYear = () => {
        this.setState(prevState => ({
            productYear: prevState.productYear + 1,
        }));
    };

    getAnalyticsData = () => {
        const url = '/admin/googleAnalyticsData';
        const data = {
            propertyId: "433479675"
        };

        axios.post(url, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log(" getAnalyticsData response ", response);

        }).catch((error) => {
            console.log("error in save banner date", error);
        });
    }

    countryWiseAnalyticsData = () => {
        const url = '/admin/countryWiseAnalyticsData';
        const data = {
            propertyId: "433479675"
        };
        axios.post(url, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            const data = response.data.data;
            const countryData = data.map(item => ({
                label: item.country,
                value: item.userCount
            }));
            this.setState({ countryWiseAnalytics: countryData })
        }).catch((error) => {
            console.log("error in save banner date", error);
        });
    }

    pathViewAnalyticsData = () => {
        const url = '/admin/pathViewAnalyticsData';
        const data = {
            propertyId: "433479675"
        };
        axios.post(url, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log(" pathViewAnalytics response ", response.data.data);
            this.setState({ pathViewAnalytics: response.data.data })
        }).catch((error) => {
            console.log("error in save banner date", error);
        });
    }

    activeAndNewUsersData = () => {
        const url = '/admin/activeAndNewUsersData';
        const data = {
            propertyId: "433479675"
        };
        axios.post(url, data, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log(" activeAndNewUsers response _____", response.data.data);
            const data = response.data.data;
            const transformedData = [
                { label: "Active Users", value: data[0].activeUsers },
                { label: "New Users", value: data[0].newUsers }
            ];
            this.setState({ activeAndNewUsers: transformedData })
        }).catch((error) => {
            console.log("error in save banner date", error);
        });
    }

    render() {
        const { loading, activeTab, productCount, serviceCount, userCount, sellerCount, orderCount, stockQty, totalPaymentAmount, listedServices, listedProducts,
            listedVendors, listedBuyers, topCategories, productSalesData, serviceSalesData, productOrders, serviceOrders,
            subscriptionOrders, countryWiseAnalytics, activeAndNewUsers, pathViewAnalytics } = this.state;
        const colors = ['rgb(2, 178, 175)', 'rgb(46, 150, 255)', 'rgb(184, 0, 216)', 'rgb(96, 0, 155)'];
        const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // const valueFormatter = (item) => `${item.value}%`;
        // const valueFormatter = (item) => `${(item.value * 100) / 10}%`;
        const productData = productSalesData.map(item => item.count);
        const serviceData = serviceSalesData.map(item => item.count);
        const currentYear = new Date().getFullYear();
        console.log("serviceData", serviceData);
        // console.log("productOrders", productOrders);
        // console.log("serviceOrders", serviceOrders);
        console.log("pathViewAnalytics pathViewAnalytics", pathViewAnalytics);

        // TEST
        const desktopOS = [
            {
                label: 'Windows',
                value: 72.72,
            },
            {
                label: 'OS X',
                value: 16.38,
            },
            {
                label: 'Linux',
                value: 3.83,
            },
            {
                label: 'Chrome OS',
                value: 2.42,
            },
            {
                label: 'Other',
                value: 4.65,
            },
        ];

        const mobileOS = [
            {
                label: 'Android',
                value: 70.48,
            },
            {
                label: 'iOS',
                value: 28.8,
            },
            {
                label: 'Other',
                value: 0.71,
            },
        ];

        const platforms = [
            {
                label: 'Mobile',
                value: 59.12,
            },
            {
                label: 'Desktop',
                value: 40.88,
            },
        ];

        // console.log("activeAndNewUsers", activeAndNewUsers)

        const normalize = (v, v2) => Number.parseFloat(((v * v2) / 100).toFixed(2));

        const mobileAndDesktopOS = [
            ...mobileOS.map((v) => ({
                ...v,
                label: v.label === 'Other' ? 'Other (Mobile)' : v.label,
                value: normalize(v.value, platforms[0].value),
            })),
            ...desktopOS.map((v) => ({
                ...v,
                label: v.label === 'Other' ? 'Other (Desktop)' : v.label,
                value: normalize(v.value, platforms[1].value),
            })),
        ];

        const valueFormatter = (item) => `${item.value}`;

        const palette = ['#4BC0C0', '#FF6384'];
        const pieParams = {
            height: 280,
            // margin: { right: 5 },
            // slotProps: { legend: { hidden: true } },
        };
        // TEST

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <div className="seller_body">
                    <Header />
                    <Helmet><title>{"Admin - Dashboard - Pay Earth"}</title></Helmet>
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/admin/manage-products">
                                        <div className="count_box">
                                            <div className="cb_count">{productCount}</div>
                                            <div className="cb_name">No. of products</div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{`$${totalPaymentAmount}`}</div>
                                        <div className="cb_name">Payments</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/admin/product-reports">
                                        <div className="count_box">
                                            <div className="cb_count">{orderCount}</div>
                                            <div className="cb_name">{`(Product/Services)`}<small>Orders</small></div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/admin/manage-products">
                                        <div className="count_box">
                                            <div className="cb_count">{stockQty}</div>
                                            <div className="cb_name">Stock low by Units</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12 offset-lg-1">
                                    <Link to="/admin/manage-vendors">
                                        <div className="count_box">
                                            <div className="cb_count">{sellerCount}</div>
                                            <div className="cb_name">No. of Vendors</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/admin/manage-customers">
                                        <div className="count_box">
                                            <div className="cb_count">{userCount}</div>
                                            <div className="cb_name">No. of Customers</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/admin/manage-services">
                                        <div className="count_box">
                                            <div className="cb_count">{serviceCount}</div>
                                            <div className="cb_name">Total no of services</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* // google analytics data */}
                            <div className="col-lg-12 ">
                                <div className="card bg-white rounded-3">
                                    <div className="tsc_box bg-white p-3">
                                        <div className="row">
                                            <div className="d-flex ">
                                                <div className="tsc_img col-lg-6 m-0 p-0">
                                                    <div className="d-flex mb-2 justify-content-between">
                                                        <p className="text-start">Active and New users</p>
                                                    </div>
                                                    <PieChart
                                                        colors={palette}
                                                        series={[
                                                            {
                                                                arcLabel: (item) => `${item.label}\n${item.value}`,
                                                                data: activeAndNewUsers,
                                                            },
                                                        ]}
                                                        sx={{
                                                            [`& .${pieArcLabelClasses.root}`]: {
                                                                fontWeight: 'bold',
                                                            },
                                                        }}
                                                        {...pieParams}

                                                    />
                                                </div>
                                                <div className="tsc_img col-lg-6 m-0 p-0">
                                                    <div className="d-flex mb-2 justify-content-between">
                                                        <p className="text-start">Active users by Country over time</p>
                                                        <p className="text-end">Last 30 days</p>
                                                    </div>
                                                    <PieChart
                                                        series={[
                                                            {
                                                                data: countryWiseAnalytics.map((item, index) => ({
                                                                    ...item,
                                                                    color: [
                                                                        '#FF9F40',
                                                                        '#36A2EB',
                                                                        '#E91E63',
                                                                        '#4BC0C0',
                                                                        '#9966FF',
                                                                        '#FF6384',
                                                                        '#8BC34A',
                                                                        '#FFCE56',
                                                                        '#607D8B',
                                                                        '#D4E157'
                                                                    ][index % 10],
                                                                })),
                                                                highlightScope: { fade: 'global', highlight: 'item' },
                                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                                valueFormatter,
                                                            },
                                                        ]}
                                                        sx={{
                                                            [`& .${pieArcLabelClasses.root}`]: {
                                                                fontWeight: 'bold',
                                                            },
                                                        }}
                                                        height={280}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12 mt-4">
                                <div className="card bg-white rounded-3" style={{ overflowY: 'auto', maxHeight: '67vh', border: '1px solid #ddd', scrollbarWidth: 'thin', }}>
                                    <div className="card-header" style={{
                                        position: 'sticky',
                                        top: 0,
                                        backgroundColor: 'white',
                                        zIndex: 10, // Ensure it stays above the scrolling content
                                        borderBottom: '1px solid #ddd',
                                    }}>
                                        Page View Analytics
                                    </div>
                                    <div className="rep_chart_item orderWeek m-4">
                                        <DataTableExtensions
                                            columns={this.pageViewCount}
                                            data={pathViewAnalytics}
                                            filter={false}
                                        >
                                            <DataTable
                                                noHeader
                                                highlightOnHover
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                paginationPerPage={5}
                                                paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                noDataTableExtensions
                                            />
                                        </DataTableExtensions>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="col-lg-12 mt-4">
                                <div className="card bg-white rounded-3">
                                    <div className="tsc_box bg-white p-3">
                                        <div className="row">
                                            <div className="d-flex ">
                                                <div className="tsc_img col-lg-6 m-0 p-0">
                                                    <div className="d-flex mb-2 justify-content-between">
                                                        <p className="text-start">Active and New users</p>
                                                    </div>
                                                    <PieChart
                                                        colors={palette}
                                                        series={[
                                                            {
                                                                arcLabel: (item) => `${item.label}\n${item.value}`,
                                                                data: activeAndNewUsers,
                                                            },
                                                        ]}
                                                        sx={{
                                                            [`& .${pieArcLabelClasses.root}`]: {
                                                                fontWeight: 'bold',
                                                            },
                                                        }}
                                                        {...pieParams}

                                                    />
                                                </div>
                                                <div className="tsc_img col-lg-6 m-0 p-0">
                                                    <div className="d-flex mb-2 justify-content-between">
                                                        <p className="text-start">Active users by Country over time</p>
                                                        <p className="text-end">Last 30 days</p>
                                                    </div>
                                                    <PieChart
                                                        series={[
                                                            {
                                                                data: countryWiseAnalytics.map((item, index) => ({
                                                                    ...item,
                                                                    color: [
                                                                        '#FF9F40',
                                                                        '#36A2EB',
                                                                        '#E91E63',
                                                                        '#4BC0C0',
                                                                        '#9966FF',
                                                                        '#FF6384',
                                                                        '#8BC34A',
                                                                        '#FFCE56',
                                                                        '#607D8B',
                                                                        '#D4E157'
                                                                    ][index % 10],
                                                                })),
                                                                highlightScope: { fade: 'global', highlight: 'item' },
                                                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                                valueFormatter,
                                                            },
                                                        ]}
                                                        sx={{
                                                            [`& .${pieArcLabelClasses.root}`]: {
                                                                fontWeight: 'bold',
                                                            },
                                                        }}
                                                        height={280}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}



                            {/* // google analytics data */}



                            <div className="row mt-4">
                                <div className="col-md-8">
                                    <div className="dash_graph bg-white">
                                        <div className="dash_graph_head">
                                            <div className="dash_title">Total Sales Graph Year {`${this.state.productYear}`}</div>
                                            <div className='d-flex'>
                                                <Button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.handlePreviousProductYear} startIcon={<ArrowBackIosIcon />}></Button>
                                                <Button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.handleNextProductYear} endIcon={<ArrowForwardIosIcon />} disabled={this.state.productYear === currentYear}></Button>
                                            </div>
                                        </div>
                                        <div className="mob-dashboard dash_graph_body p-3">
                                            {/* <img src={graph} className="img-fluid" alt="" /> */}
                                            <LineChart
                                                width={800}
                                                height={430}
                                                series={[
                                                    {
                                                        data: productData,
                                                        label: 'Products',
                                                        color: '#4169E1',
                                                        style: { strokeWidth: 3, strokeDasharray: '5 5' }
                                                    },
                                                    {
                                                        data: serviceData,
                                                        label: 'Services',
                                                        color: "#C71585"
                                                    },
                                                ]}
                                                xAxis={[{ scaleType: 'point', data: xLabels }]}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="tsc_box bg-white p-3">
                                        <div className="dash_title">top selling categories</div>
                                        <div className="tsc_img mt-4 mb-4">
                                            <Box sx={{ width: '100%' }}>
                                                <PieChart
                                                    height={220}
                                                    slotProps={{
                                                        legend: { hidden: true },
                                                    }}
                                                    series={[
                                                        {
                                                            data: topCategories,
                                                            innerRadius: 60,
                                                            cx: 180,
                                                            cy: 110,
                                                            // arcLabel: (params) => params.label ?? '',
                                                            // valueFormatter,
                                                        }
                                                    ]}
                                                />
                                            </Box>
                                        </div>
                                        <ul className="tcs_indicators_list">
                                            {topCategories.map((item, index) => (
                                                <li key={index}>
                                                    <i style={{ color: colors[index % colors.length] }} className="fa fa-circle"></i> {item.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-3 pt-3 pb-5 mt-4">
                                <div className="col-md-12">
                                    <div className="dash_title m-4">Newly Listed Orders</div>
                                    <div className="report_tabing_nav m-2">
                                        <div className="report_tab_link">
                                            <ul>
                                                <li className={activeTab === "productOrders" ? "activeNav" : ""}
                                                    onClick={() => this.handleTabChange("productOrders")}
                                                >
                                                    <Link to="#">Product Orders</Link>
                                                </li>
                                                <li className={activeTab === "serviceOrders" ? "activeNav" : ""}
                                                    onClick={() => this.handleTabChange("serviceOrders")}
                                                >
                                                    <Link to="#">Service Orders</Link>
                                                </li>
                                                <li className={activeTab === "subscriptionOrders" ? "activeNav" : ""}
                                                    onClick={() => this.handleTabChange("subscriptionOrders")}
                                                >
                                                    <Link to="#">Subscription Orders</Link>
                                                </li>
                                            </ul>
                                        </div>

                                        {activeTab === "productOrders" && (
                                            <div className='admin_dashboard p-4'>
                                                <DataTableExtensions
                                                    columns={this.listed_productOrders}
                                                    data={productOrders}
                                                >
                                                    <DataTable
                                                        pagination
                                                        noHeader
                                                        highlightOnHover
                                                        defaultSortField="id"
                                                        defaultSortAsc={false}
                                                        paginationPerPage={5}
                                                        paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                    // selectableRows           
                                                    />
                                                </DataTableExtensions>
                                            </div>
                                        )}

                                        {activeTab === "serviceOrders" && (
                                            // listed_serviceOrders
                                            <div className='admin_dashboard p-4'>
                                                <DataTableExtensions
                                                    columns={this.listed_serviceOrders}
                                                    data={serviceOrders}
                                                >
                                                    <DataTable
                                                        pagination
                                                        noHeader
                                                        highlightOnHover
                                                        defaultSortField="id"
                                                        defaultSortAsc={false}
                                                        paginationPerPage={5}
                                                        paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                    />
                                                </DataTableExtensions>
                                            </div>
                                        )}

                                        {activeTab === "subscriptionOrders" && (
                                            <div className='admin_dashboard p-4'>
                                                <DataTableExtensions
                                                    columns={this.listed_subscriptionOrders}
                                                    data={subscriptionOrders}
                                                >
                                                    <DataTable
                                                        pagination
                                                        noHeader
                                                        highlightOnHover
                                                        defaultSortField="id"
                                                        defaultSortAsc={false}
                                                        paginationPerPage={5}
                                                        paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                    // selectableRows           
                                                    />
                                                </DataTableExtensions>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div className="my_pro_cart bg-white">
                                        <div className='admin_dashboard p-2'>
                                            <div className="d-flex align-items-center justify-content-between mb-3 m-3">
                                                <div className="dash_title">Newly Listed Products</div>
                                                <Link to="/admin/manage-products" className="btn_yellow_bordered w-auto btn btn-width action_btn_new">View More</Link>
                                            </div>
                                            <DataTableExtensions
                                                columns={this.listed_Product}
                                                data={listedProducts}
                                            >
                                                <DataTable
                                                    pagination
                                                    noHeader
                                                    highlightOnHover
                                                    defaultSortField="id"
                                                    defaultSortAsc={false}
                                                    paginationPerPage={5}
                                                    paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                // selectableRows           
                                                />
                                            </DataTableExtensions>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="my_pro_cart bg-white">
                                        <div className='admin_dashboard p-2'>
                                            <div className="d-flex align-items-center justify-content-between mb-3 m-3">
                                                <div className="dash_title">Newly Listed Services</div>
                                                <Link to="/admin/manage-services" className="btn_yellow_bordered w-auto btn btn-width action_btn_new">View More</Link>
                                            </div>
                                            <DataTableExtensions
                                                columns={this.listed_Service}
                                                data={listedServices}
                                            >
                                                <DataTable
                                                    pagination
                                                    noHeader
                                                    highlightOnHover
                                                    defaultSortField="id"
                                                    defaultSortAsc={false}
                                                    paginationPerPage={5}
                                                    paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                // selectableRows           
                                                />
                                            </DataTableExtensions>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div className="my_pro_cart bg-white">
                                        <div className='admin_dashboard p-2'>
                                            <div className="d-flex align-items-center justify-content-between mb-3 m-3">
                                                <div className="dash_title">Newly Listed Vendors</div>
                                                <Link to="/admin/manage-vendors" className="btn_yellow_bordered w-auto btn btn-width action_btn_new">View More</Link>
                                            </div>
                                            <DataTableExtensions
                                                columns={this.listed_Vendors}
                                                data={listedVendors}
                                            >
                                                <DataTable
                                                    pagination
                                                    noHeader
                                                    highlightOnHover
                                                    defaultSortField="id"
                                                    defaultSortAsc={false}
                                                    paginationPerPage={5}
                                                    paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                // selectableRows           
                                                />
                                            </DataTableExtensions>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="my_pro_cart bg-white">
                                        <div className='admin_dashboard p-2'>
                                            <div className="d-flex align-items-center justify-content-between mb-3 m-3">
                                                <div className="dash_title">Newly Listed Buyers</div>
                                                <Link to="/admin/manage-customers" className="btn_yellow_bordered w-auto btn btn-width action_btn_new">View More</Link>
                                            </div>
                                            <DataTableExtensions
                                                columns={this.listed_Buyers}
                                                data={listedBuyers}
                                            >
                                                <DataTable
                                                    pagination
                                                    noHeader
                                                    highlightOnHover
                                                    defaultSortField="id"
                                                    defaultSortAsc={false}
                                                    paginationPerPage={5}
                                                    paginationRowsPerPageOptions={[5, 10, 15, 30]}
                                                // selectableRows           
                                                />
                                            </DataTableExtensions>
                                        </div>
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

export default Dashboard;
