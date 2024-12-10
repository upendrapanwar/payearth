import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/admin/common/Header';
import axios from 'axios';
import SpinnerLoader from "./../../components/common/SpinnerLoader";
import { LineChart } from '@mui/x-charts/LineChart';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import GoogleAnalyticsEvents from './GoogleAnalyticsEvents';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            loading: true,
            productCount: "0",
            serviceCount: "0",
            userCount: "0",
            sellerCount: "0",
            orderCount: "0",
            totalPaymentAmount: "0",
            hasRun: false,
            listedServices: "",
            listedProducts: "",
            serviceYear: new Date().getFullYear(),
            productYear: new Date().getFullYear(),
            topCategories: [],
            productSalesData: [],
            serviceSalesData: []
        };

        this.listed_Service = [
            {
                name: 'Services',
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
                name: 'Service Code',
                selector: (row, i) => row.serviceCode,
                sortable: true
            },
            {
                name: 'Service Name',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'Charges',
                selector: (row, i) => `$${row.charges}`,
                sortable: true
            },
            {
                name: 'Sales',
                selector: (row, i) => "null",
                sortable: true
            },
            {
                name: 'Review',
                selector: (row, i) => row.reviews.length,
                sortable: true
            },
            {
                name: 'Profite',
                selector: (row, i) => "null",
                sortable: true
            },
            {
                name: 'Revenue',
                selector: (row, i) => "Null",
                sortable: true
            },
        ];

        this.listed_Product = [
            {
                name: 'Products',
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
                name: 'Product Code',
                selector: (row, i) => row.productCode,
                sortable: true
            },
            {
                name: 'Product Name',
                selector: (row, i) => row.name,
                sortable: true
            },
            {
                name: 'Price',
                selector: (row, i) => `$${row.price}`,
                sortable: true
            },
            {
                name: 'Sales',
                selector: (row, i) => row.quantity.selling_qty,
                sortable: true
            },
            {
                name: 'Stock',
                selector: (row, i) => row.quantity.stock_qty,
                sortable: true
            },
            {
                name: 'Review',
                selector: (row, i) => "null",
                sortable: true
            },
            {
                name: 'Profite',
                selector: (row, i) => "null",
                sortable: true
            },
            {
                name: 'Revenue',
                selector: (row, i) => "Null",
                sortable: true
            },
        ];
    }

    componentDidMount() {
        this.getTopSellingCategories();
        this.getDashboardData();
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
        }
    }

    handleScroll = () => {
        const { hasRun } = this.state;
        if (!hasRun) {
            this.getListedServices();
            this.getListedproducts();
            this.setState({ hasRun: true });
            window.removeEventListener('scroll', this.handleScroll);
        }
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
            const url = `/admin/serviceSalesGraph?year=${this.state.serviceYear}`;
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
    }

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
                totalPaymentAmount: data.totalPaymentAmount,
                loading: false
            });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    }

    getListedServices = () => {
        let url = "/admin/services";
        axios.get(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${this.authInfo.token}`,
            },
        })
            .then((response) => {
                if (response.data.status === true) {
                    this.setState({ listedServices: response.data.data, loading: false })
                }
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



    render() {
        const { loading, productCount, serviceCount, userCount, sellerCount, orderCount, totalPaymentAmount, listedServices, listedProducts, topCategories, productSalesData, serviceSalesData } = this.state;
        const colors = ['rgb(2, 178, 175)', 'rgb(46, 150, 255)', 'rgb(184, 0, 216)', 'rgb(96, 0, 155)'];
        const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // const valueFormatter = (item) => `${item.value}%`;
        // const valueFormatter = (item) => `${(item.value * 100) / 10}%`;
        const productData = productSalesData.map(item => item.count);
        const serviceData = serviceSalesData.map(item => item.count);
        const currentYear = new Date().getFullYear();
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{productCount}</div>
                                        <div className="cb_name">No. of products</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{`$${totalPaymentAmount}`}</div>
                                        <div className="cb_name">Payments</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{orderCount}</div>
                                        <div className="cb_name">Total Orders</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">69</div>
                                        <div className="cb_name">Stock low by Units</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12 offset-lg-1">
                                    <div className="count_box">
                                        <div className="cb_count">{sellerCount}</div>
                                        <div className="cb_name">No. of Vendors</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{userCount}</div>
                                        <div className="cb_name">No. of Customers</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{serviceCount}</div>
                                        <div className="cb_name">Total no of services</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-8">
                                    <div className="dash_graph bg-white">
                                        <div className="dash_graph_head">
                                            <div className="dash_title">Product Sales Analysis Year {`${this.state.productYear}`}</div>
                                            <div>
                                                <Button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.handlePreviousProductYear} startIcon={<ArrowBackIosIcon />}></Button>
                                                <Button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.handleNextProductYear} endIcon={<ArrowForwardIosIcon />} disabled={this.state.productYear === currentYear}></Button>
                                            </div>
                                        </div>
                                        <div className="dash_graph_body p-3">
                                            {/* <img src={graph} className="img-fluid" alt="" /> */}
                                            <LineChart
                                                width={800}
                                                height={430}
                                                series={[
                                                    {
                                                        data: productData,
                                                        label: 'Products',
                                                        color: '#4169E1',
                                                        // color: "#27408B",
                                                        style: { strokeWidth: 3, strokeDasharray: '5 5' }
                                                    },
                                                    // { data: serviceData, label: 'Services' },
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
                                                            arcLabel: (params) => params.label ?? '',
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
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <div className="dash_graph bg-white">
                                        <div className="dash_graph_head">
                                            <div className="dash_title">Service Analysis Year {`${this.state.serviceYear}`}</div>
                                            <div>
                                                <Button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.handlePreviousServiceYear} startIcon={<ArrowBackIosIcon />} ></Button>
                                                <Button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={this.handleNextServiceYear} disabled={this.state.serviceYear === currentYear} endIcon={<ArrowForwardIosIcon />} ></Button>
                                            </div>
                                        </div>
                                        <div className="dash_graph_body p-3 text-center">
                                            <LineChart
                                                height={350}
                                                series={[
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


                                <div className="col-md-12">
                                    <div className="my_pro_cart bg-white">
                                        <div className="mpc_header">
                                            <div className="dash_title">Newly Listed Products</div>
                                            <div className="mpc_btns search_box">
                                                <div className="input-group">
                                                    {/* <input type="text" className="form-control" placeholder="Search products" aria-label="Search products" aria-describedby="button-addon2" /> */}
                                                    {/* <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='table_max p-4 bg-light'>
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

                                <div className="col-md-12 mt-5">
                                    <div className="my_pro_cart bg-white">
                                        <div className="mpc_header">
                                            <div className="dash_title">Newly Listed Services</div>
                                            <div className="mpc_btns search_box">
                                                <div className="input-group">
                                                    {/* <input type="text" className="form-control" placeholder="Search products" aria-label="Search products" aria-describedby="button-addon2" /> */}
                                                    {/* <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='table_max p-4 bg-light'>
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
                    <Footer />
                </div>

            </React.Fragment>
        )
    }
}

export default Dashboard;
