import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import axios from 'axios';
import { connect } from 'react-redux';
import store from '../../store/index';
import config from '../../config.json';
import { setLoading } from '../../store/reducers/global-reducer';
import { NotFound } from '../../components/common/NotFound';
import Select from 'react-select';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Chart } from "react-google-charts";
import { Helmet } from 'react-helmet';
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

class SellerDashboard extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        // this.authInfo = store.getState().auth.authInfo;
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.currentDate = new Date();
        this.currentDate = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDay()}`;
        this.state = {
            productYear: new Date().getFullYear(),
            productMonth: new Date().getMonth(),
            topCategories: [],
            productSalesData: [],
            serviceSalesData: [],
            listedServices: [],
            listedProducts: [],
            productOrders: [],
            serviceOrders: [],
            activeTab: "productOrders",
            topVisitedAdvertisements: [],
            topAdvertiseViewedList: [],
            // week: "",
            // month: "",
            // year: "",


            // monthChartData: [],
            // yearChartData: [],
            // weekChartData: [],
            // hAxisTitle: '',
            // chartTitle: 'MONTHLY',
            // charData: [],
            data: [],
            salesData: [],
            // chartReqBody: {
            //     filter_type: "Month",
            //     // date_value: this.currentDate
            //     date_value: "2021-09-25"
            // },
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            pagination: {},
            sortingOptions: [
                { label: 'New to Old', value: 'desc' },
                { label: "Old to New ", value: 'asc' },
            ],
            defaultSelectedOption: { label: 'New to Old', value: 'desc' },
            chartOptions: [
                { label: 'Yearly Graph', value: 'year' },
                { label: 'Monthly Graph', value: 'month' },
                { label: 'Weekly Graph', value: 'week' },
            ],
            defaultSelectedOptionChart: { label: 'Yearly', value: 'year' },
            // topSellingCategoriesData: [['category', 'Sale']]
        }


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
        ];

        this.topAdvertise_ViewedList = [
            {
                name: 'ADVERTISE NAME',
                selector: (row, i) => row.label,
                sortable: true
            },
            {
                name: 'ADVERTISE URL',
                selector: (row) => (
                    <a href={row.siteUrl} target="_blank" rel="noopener noreferrer">
                        {row.siteUrl}
                    </a>
                ),
                sortable: true
            },
            {
                name: 'COUNTS',
                selector: (row, i) => `${row.value}`,
                sortable: true
            },
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
            {
                name: 'ORDER STATUS',
                selector: (row, i) => row.orderStatus[0].title,
                sortable: true
            },
            {
                name: 'PAYMENT MODE',
                selector: (row, i) => row.paymentId.paymentMode,
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
                selector: (row, i) => row.orderStatus[0].title,
                sortable: true
            },
            {
                name: 'PAYMENT MODE',
                selector: (row, i) => row.paymentId.paymentMode,
                sortable: true
            },
        ];

    }

    componentDidMount() {
        this.getTopSellingCategories();
        this.getProductSalesGraph('year');
        this.getServiceSalesGraph('year');
        this.getListedproducts();
        this.getListedServices();
        this.getOrdersDetails();
        this.getCounters();
        this.topVisitedAdvertisements();
        this.getAdvertiseViewedList();

        // this.getProductSales();
        // this.getTopSellingCatData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.productYear !== this.state.productYear) {
            this.getProductSalesGraph('month');
            this.getServiceSalesGraph('month');
        }
        if (prevState.productMonth !== this.state.productMonth) {
            this.getProductSalesGraph('week');
            this.getServiceSalesGraph('week');
        }
    }

    getCounters = () => {
        this.dispatch(setLoading({ loading: true }));
        axios.get(`seller/dashboard-counters/${this.authInfo.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                this.setState({
                    data: response.data.data
                });
            }
        }).catch(error => {
            // if (error.response && error.response.data.status === false) {
            //     toast.error(error.response.data.message);
            // }
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    topVisitedAdvertisements = () => {
        this.dispatch(setLoading({ loading: true }));
        axios.get(`seller/get-topvisited-advertisements/${this.authInfo.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            // console.log('topVisitedAdvertisements--response', response)
            if (response.data.status) {
                this.setState({
                    topVisitedAdvertisements: response.data.data
                });
            }
        }).catch(error => {
            // if (error.response && error.response.data.status === false) {
            //     toast.error(error.response.data.message);
            // }
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    getAdvertiseViewedList = () => {
        this.dispatch(setLoading({ loading: true }));
        axios.get(`seller/get-advertise-viewedlist/${this.authInfo.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log('topadvertise-viewedlist-response', response)
            if (response.data.status) {
                this.setState({
                    topAdvertiseViewedList: response.data.data
                });
            }
        }).catch(error => {
            // if (error.response && error.response.data.status === false) {
            //     toast.error(error.response.data.message);
            // }
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    getListedproducts = async () => {
        try {
            // this.dispatch(setLoading({ loading: true }));
            const url = 'seller/getListedProductData';
            const response = await axios.get(url, {
                params: {
                    status: true,
                    sellerId: this.authInfo.id
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            // console.log('product---response--', response)
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
            const url = 'seller/getListedServicesData';
            const response = await axios.get(url, {
                params: {
                    status: true,
                    sellerId: this.authInfo.id
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            // console.log('service---response--', response)
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

    getOrdersDetails = async () => {
        try {
            this.setState({ loading: true });
            const url = "seller/getOrderDetails";
            const response = await axios.get(url, {
                params: {
                    status: true,
                    sellerId: this.authInfo.id
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data.data;
            this.setState({ "productOrders": data.productOrders, loading: false });
            this.setState({ "serviceOrders": data.serviceOrders, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    getProductSales = (pagination, param) => {
        let reqBody = {};

        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 5,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: this.state.defaultSelectedOption.value
                }
            };
        } else {
            reqBody = this.state.reqBody;
        }

        this.dispatch(setLoading({ loading: true }));
        axios.post(`seller/product-sales/${this.authInfo.id}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.setState({
                    salesData: response.data.data.sales,
                    pagination: response.data.data.paginationData
                });
            }
        }).catch(error => {
            // if (error.response && error.response.data.status === false) {
            //     toast.error(error.response.data.message);
            // }
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    pagination = () => {
        let html = [];
        for (let index = 0; index < this.state.pagination.totalPages; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${this.state.pagination.currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getProductSales(true, pageNumber)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChange = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pagination.currentPage;
        reqBody.count.skip = (this.state.pagination.currentPage - 1) * 5;
        this.setState({ defaultSelectedOption: selectedOption, reqBody });
        this.getProductSales(false, this.state.pagination.currentPage);
    }

    getTopSellingCategories = () => {
        const reqParams = {
            authorId: this.authInfo.id,
        };
        axios.get("seller/getTopSellingCategories", {
            params: reqParams,
            headers: {
                "Accept": "application/json",
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
    }

    getProductSalesGraph = async (selectedTimeFrame) => {
        //  console.log(" getProductSalesGraph selectedTimeFrame", selectedTimeFrame)
        try {
            this.setState({ loading: true });
            const reqParams = {
                authorId: this.authInfo.id,
                timeFrame: selectedTimeFrame,
            };

            let url = `/seller/productSalesGraph`;
            if (selectedTimeFrame === 'week') {
                url += `?year=${this.state.productYear}&month=${this.state.productMonth + 1}`;
            } else {
                url += `?year=${this.state.productYear}`;
            }

            const response = await axios.get(url, {
                params: reqParams,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            // console.log(" getProductSalesGraph data", response)
            this.setState({ productSalesData: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    getServiceSalesGraph = async (selectedTimeFrame) => {
        // console.log(" getProductSalesGraph selectedTimeFrame", selectedTimeFrame)
        try {
            this.setState({ loading: true });
            const reqParams = {
                authorId: this.authInfo.id,
                timeFrame: selectedTimeFrame,
            };

            let url = `/seller/serviceSalesGraph`;
            if (selectedTimeFrame === 'week') {
                url += `?year=${this.state.productYear}&month=${this.state.productMonth + 1}`;
            } else {
                url += `?year=${this.state.productYear}`;
            }

            const response = await axios.get(url, {
                params: reqParams,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            //  console.log(" getSellerSalesGraph data", response)
            this.setState({ serviceSalesData: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    handleChart = (selectedOption) => {
        //  console.log("selectedOption", selectedOption)
        this.setState({ defaultSelectedOptionChart: selectedOption, hAxisTitle: selectedOption.label });
        this.getProductSalesGraph(selectedOption.value);
        if (selectedOption.value === 'month') {
            this.setState({ charData: this.state.monthChartData, hAxisTitle: 'MONTHS', chartTitle: 'MONTHLY' });
            // this.setState({ productMonth: this.state., });
            this.getProductSalesGraph('month');
            this.getServiceSalesGraph('month');
        } else if (selectedOption.value === 'week') {
            this.setState({ charData: this.state.weekChartData, hAxisTitle: 'WEEKS', chartTitle: 'WEEKLY' });
            this.getProductSalesGraph('week');
            this.getServiceSalesGraph('week');
        } else if (selectedOption.value === 'year') {
            this.setState({ charData: this.state.yearChartData, hAxisTitle: 'YEARS', chartTitle: 'YEARLY' });
            this.getProductSalesGraph('year');
            this.getServiceSalesGraph('year');
        }
    }

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

    handlePreviousProductMonth = () => {
        this.setState(prevState => ({
            productMonth: prevState.productMonth - 1,
        }));
    };

    handleNextProductMonth = () => {
        this.setState(prevState => ({
            productMonth: prevState.productMonth + 1,
        }));
    };

    handleTabChange = (tab) => {
        this.setState({ activeTab: tab });
    };

    // generateXLabels = (timeFrame, productMonth, productSalesData ,serviceSalesData) => {
    //     const currentYear = new Date().getFullYear();
    //     const currentMonth = productMonth;
    //     const months = [
    //         "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    //     ];

    //     const generateWeeksForMonth = (month, productSalesData) => {
    //         const weeksInMonth = {
    //             1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5
    //         };

    //         const validWeeks = Array.from({ length: weeksInMonth[month] }, (_, i) => i + 1);

    //         const weeksInData = productSalesData
    //             .filter(item => item.month === month)
    //             .map(item => item.week);

    //         const uniqueWeeks = Array.from(new Set(weeksInData));

    //         const validUniqueWeeks = uniqueWeeks.filter(week => validWeeks.includes(week));

    //         return validWeeks.map(week => validUniqueWeeks.includes(week) ? `Week ${week}` : `Week ${week} (No Data)`);
    //     };

    //     if (timeFrame === "month") {
    //         return months;
    //     } else if (timeFrame === "week") {
    //         return generateWeeksForMonth(currentMonth, productSalesData);
    //     } else if (timeFrame === "year") {
    //         return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()).reverse();
    //     }

    //     return [];
    // };

    generateXLabels = (timeFrame, productMonth, productSalesData, serviceSalesData) => {
        const currentYear = new Date().getFullYear();
        const currentMonth = productMonth;
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const generateWeeksForMonth = (month, productSalesData, serviceSalesData) => {
            const weeksInMonth = {
                1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 5, 11: 5, 12: 5
            };

            const validWeeks = Array.from({ length: weeksInMonth[month] }, (_, i) => i + 1);

            const productWeeks = productSalesData
                .filter(item => item.month === month)
                .map(item => item.week);
            const serviceWeeks = serviceSalesData
                .filter(item => item.month === month)
                .map(item => item.week);


            const allWeeks = Array.from(new Set([...productWeeks, ...serviceWeeks]));

            return validWeeks.map(week =>
                allWeeks.includes(week) ? `Week ${week}` : `Week ${week}`
            );
        };

        if (timeFrame === "month") {
            return months;
        } else if (timeFrame === "week") {
            return generateWeeksForMonth(currentMonth, productSalesData, serviceSalesData);
        } else if (timeFrame === "year") {
            return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString()).reverse();
        }

        return [];
    };


    render() {
        const { loading } = store.getState().global;
        const {
            data,
            // salesData,
            // pagination,
            // defaultSelectedOption,
            // sortingOptions,
            chartOptions,
            defaultSelectedOptionChart,
            // charData,
            // monthChartData,
            // hAxisTitle,
            // chartTitle,
            // topSellingCategoriesData,
            productSalesData,
            serviceSalesData,
            productMonth,
            topCategories,
            listedServices,
            listedProducts,
            activeTab,
            serviceOrders,
            productOrders,
            topVisitedAdvertisements,
            topAdvertiseViewedList,
        } = this.state;

        const colors = ['rgb(2, 178, 175)', 'rgb(46, 150, 255)', 'rgb(184, 0, 216)', 'rgb(96, 0, 155)'];
        const palette = ['#4BC0C0', '#FF6384', '#0d76df'];
        //const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const xLabels = this.generateXLabels(defaultSelectedOptionChart.value, productMonth + 1, productSalesData, serviceSalesData);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth();
        const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[this.state.productMonth];

        const productData = xLabels.map((labelObj, index) => {
            let match;

            if (defaultSelectedOptionChart.value === "week") {
                match = productSalesData?.find((item) => item.week === (index + 1));
            } else if (defaultSelectedOptionChart.value === "month") {
                //  console.log('defaultSelectedOptionChart---month', defaultSelectedOptionChart.value);
                match = productSalesData?.find((item) => item.month === index + 1);
            } else if (defaultSelectedOptionChart.value === "year") {
                match = productSalesData?.find((item) => item.year === parseInt(labelObj, 10));
            }
            return match ? match.count : 0;
        });
        // console.log('productData', productData)

        const serviceData = xLabels.map((labelObj, index) => {
            let match;

            if (defaultSelectedOptionChart.value === "week") {
                match = serviceSalesData?.find((item) => item.week === (index + 1));
            } else if (defaultSelectedOptionChart.value === "month") {
                //   console.log('defaultSelectedOptionChart---month', defaultSelectedOptionChart.value);
                match = serviceSalesData?.find((item) => item.month === index + 1);
            } else if (defaultSelectedOptionChart.value === "year") {
                match = serviceSalesData?.find((item) => item.year === parseInt(labelObj, 10));
            }
            return match ? match.count : 0;
        });
        // console.log('serviceData', serviceData)
        // console.log('productData-----', productData);
        console.log("Top AdvertiseViewedList:", topAdvertiseViewedList);
        return (
            <React.Fragment >
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <Helmet>
                        <title>{"Seller Dashboard - Pay Earth"}</title>
                    </Helmet>
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/seller/product-stock-management">
                                        <div className="count_box">
                                            <div className="cb_count">{data.totalProducts}</div>
                                            <div className="cb_name">No. of products</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/seller/service-stock-management">
                                        <div className="count_box">
                                            <div className="cb_count">{data.totalServices}</div>
                                            <div className="cb_name">No. of services</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/seller/product-orders">
                                        <div className="count_box">
                                            <div className="cb_count">{data.totalProductOrders}</div>
                                            <div className="cb_name">No. of product orders</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <Link to="/seller/service-stock-management">
                                        <div className="count_box">
                                            <div className="cb_count">{data.totalServiceOrders}</div>
                                            <div className="cb_name">No. of services orders</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/* // google analytics data */}

                            <div className="rep_chart_wrapper">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="card bg-white rounded-3">
                                            <div className="card-header">
                                                Top Visited Advertisements
                                            </div>

                                            <div className="tsc_box bg-white p-3">
                                                <div className="row">
                                                    {/* <div className="col-lg-6 m-0 p-0">
                                                        <ul className="list-unstyled">
                                                            {topCategories.map((item, index) => (
                                                                <li key={index} className="d-flex align-items-center mb-3 mt-2">
                                                                    <i style={{ color: colors[index % colors.length] }} className="fa fa-circle"></i>  <span className="small ps-2">{item.label}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div> */}
                                                    <div className="tsc_img col-lg-6 m-0 p-0">
                                                        {topVisitedAdvertisements.length > 0 ?
                                                            <PieChart
                                                                colors={palette}
                                                                series={[
                                                                    { data: topVisitedAdvertisements }
                                                                ]}
                                                                width={400}
                                                                height={200}
                                                            /> :
                                                            <PieChart
                                                                series={[
                                                                    {
                                                                        data: [],
                                                                    }
                                                                ]}
                                                                width={400}
                                                                height={200}
                                                            />
                                                        }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-4">
                                        <div className="card bg-white rounded-3">
                                            <div className="card-header">
                                                Monthly Order Report
                                            </div>
                                            <div className="rep_chart_item chart_right">
                                                <Bar options={optionsBar} data={dataBar} />
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="col-lg-8">
                                        <div className="card bg-white rounded-3" style={{ overflowY: 'auto', maxHeight: '67vh', border: '1px solid #ddd', scrollbarWidth: 'thin', }}>
                                            <div className="card-header" style={{
                                                position: 'sticky',
                                                top: 0,
                                                backgroundColor: 'white',
                                                zIndex: 10, // Ensure it stays above the scrolling content
                                                borderBottom: '1px solid #ddd',
                                            }}>
                                                Total Advertise Viewed
                                            </div>
                                            <div className="rep_chart_item orderWeek">
                                                <DataTableExtensions
                                                    columns={this.topAdvertise_ViewedList}
                                                    data={topAdvertiseViewedList}
                                                    export={false}
                                                    filter={false}
                                                >
                                                    <DataTable
                                                        pagination={false}
                                                        noHeader
                                                        highlightOnHover
                                                        fixedHeader
                                                        fixedHeaderScrollHeight="400px"
                                                    // selectableRows           
                                                    />
                                                </DataTableExtensions>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-md-8">
                                    <div className="dash_graph bg-white">
                                        <div className="dash_graph_head">
                                            {
                                                defaultSelectedOptionChart.value === 'week' ? (
                                                    <>
                                                        <div className="dash_title">{monthName} Sales Graph</div>
                                                        <div className="d-flex">
                                                            <Button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                id="button-addon2"
                                                                onClick={this.handlePreviousProductMonth}
                                                                startIcon={<ArrowBackIosIcon />}
                                                                disabled={this.state.productMonth === 0}
                                                            ></Button>
                                                            <Button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                id="button-addon2"
                                                                onClick={this.handleNextProductMonth}
                                                                endIcon={<ArrowForwardIosIcon />}
                                                                disabled={this.state.productMonth === currentMonth}
                                                            ></Button>
                                                        </div>
                                                    </>
                                                ) : defaultSelectedOptionChart.value === 'month' ? (
                                                    <>
                                                        <div className="dash_title">{this.state.productYear} Sales Graph</div>
                                                        <div className="d-flex">
                                                            <Button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                id="button-addon2"
                                                                onClick={this.handlePreviousProductYear}
                                                                startIcon={<ArrowBackIosIcon />}
                                                            ></Button>
                                                            <Button
                                                                className="btn btn-outline-secondary"
                                                                type="button"
                                                                id="button-addon2"
                                                                onClick={this.handleNextProductYear}
                                                                endIcon={<ArrowForwardIosIcon />}
                                                                disabled={this.state.productYear === currentYear}
                                                            ></Button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    // For 'year', display only the order status
                                                    <div className="dash_title">Order Status</div>
                                                )
                                            }

                                            <div className="graph_select">
                                                <Select
                                                    className="sort_select text-normal"
                                                    options={chartOptions}
                                                    value={defaultSelectedOptionChart}
                                                    onChange={this.handleChart}
                                                />
                                            </div>
                                        </div>
                                        <div className="dash_graph_body p-3">
                                            {productData.length > 0 ?
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
                                                // tooltip={{
                                                //     custom: (point) => point === null || point === undefined ? null : `Value: ${point}`
                                                // }}
                                                /> :
                                                <NotFound msg="Data not found." />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="tsc_box bg-white p-3">
                                        <div className="dash_title">my top selling categories</div>
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
                                                    {/* <li className={activeTab === "subscriptionOrders" ? "activeNav" : ""}
                                                        onClick={() => this.handleTabChange("subscriptionOrders")}
                                                    >
                                                        <Link to="#">Subscription Orders</Link>
                                                    </li> */}
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

                                            {/* {activeTab === "subscriptionOrders" && (
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
                                            )} */}
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <div className="my_pro_cart bg-white">
                                            <div className='admin_dashboard p-2'>
                                                <div className="d-flex align-items-center justify-content-between mb-3 m-3">
                                                    <div className="dash_title">Newly Listed Products</div>
                                                    <Link to="/seller/product-stock-management" className="btn_yellow_bordered w-auto btn btn-width action_btn_new">View More</Link>
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
                                                    <Link to="/seller/service-stock-management" className="btn_yellow_bordered w-auto btn btn-width action_btn_new">View More</Link>
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
                            </div>

                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(SellerDashboard);