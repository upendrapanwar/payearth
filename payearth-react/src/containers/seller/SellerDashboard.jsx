import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import axios from 'axios';
import { connect } from 'react-redux';
import store from '../../store/index';
import config from '../../config.json';
import { setLoading } from '../../store/reducers/global-reducer';
import NotFound from '../../components/common/NotFound';
import Select from 'react-select';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Chart } from "react-google-charts";

class SellerDashboard extends Component {
    constructor(props) {
        super(props);
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.currentDate = new Date();
        this.currentDate = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDay()}`;
        this.state = {
            monthChartData: [],
            yearChartData: [],
            weekChartData: [],
            hAxisTitle: 'MONTHS',
            chartTitle: 'MONTHLY',
            charData: [],
            data: [],
            salesData: [],
            chartReqBody: {
                filter_type: "Month",
                // date_value: this.currentDate
                date_value: "2021-09-25"
            },
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
                {label: 'New to Old', value: 'desc'},
                {label: "Old to New ", value: 'asc'},
            ],
            defaultSelectedOption: {label: 'New to Old', value: 'desc'},
            chartOptions: [
                {label: 'Monthly Graph', value: 'monthly'},
                {label: 'Weekly Graph', value: 'weekly'},
                {label: 'Yearly Graph', value: 'yearly'}
            ],
            defaultSelectedOptionChart: {label: 'Monthly', value: 'monthly'},
            topSellingCategoriesData: [['category', 'Sale']]
        }
    }

    componentDidMount() {
        this.getCounters();
        this.getProductSales();
        this.getChartsData('month');
        // this.getChartsData('year');
        // this.getChartsData('week');
        this.getTopSellingCatData();
    }

    getCounters = () => {
        this.dispatch(setLoading({loading: true}));
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

        this.dispatch(setLoading({loading: true}));
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

    getChartsData = (type) => {
        let chartReqBody = {};

        if (type === 'month') {
            chartReqBody = {
                filter_type: "month",
                date_value: this.currentDate
            }
        } else if (type === 'week') {
            chartReqBody = {
                filter_type: "week",
                // date_value: this.currentDate
                date_value: "2021-09-25"
            }
        } else if (type === 'year') {
            chartReqBody = {
                filter_type: "year",
                date_value: this.currentDate
            }
        } else {
            chartReqBody = this.state.chartReqBody
        }

        this.dispatch(setLoading({loading: true}));
        axios.post(`seller/sales-line-chart/${this.authInfo.id}`, chartReqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status && type === 'month') {
                let monthChartData = response.data.data.result;
                monthChartData.unshift(['month', 'sale'])
                this.setState({
                    monthChartData: monthChartData
                });
            } else if (response.data.status && type === 'year') {
                let res = response.data.data.result
                let yearChartData = [];
                res.forEach((value) => {
                    yearChartData.push([value._id, value.count])
                })
                yearChartData.unshift(['year', 'sale']);
                this.setState({
                    yearChartData: yearChartData
                });
            } else if (response.data.status && type === 'week') {
                let res = response.data.data.result
                let weekChartData = [];
                res.forEach((value) => {
                    weekChartData.push([value._id, value.count])
                })
                weekChartData.unshift(['week', 'sale'])
                this.setState({weekChartData});
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

    getTopSellingCatData = () => {
        this.dispatch(setLoading({loading: true}));
        axios.get(`seller/selling-category-donut-chart/${this.authInfo.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                if (response.data.data.length > 0) {
                    let data = [...this.state.topSellingCategoriesData];
                    response.data.data.forEach(value => {
                        data.push([value.name, value.count]);
                    })
                    this.setState({topSellingCategoriesData: data});
                }
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handleChart = (selectedOption) => {
        this.setState({ defaultSelectedOptionChart: selectedOption });
        if (selectedOption.value === 'monthly') {
            this.setState({charData: this.state.monthChartData, hAxisTitle: 'MONTHS', chartTitle: 'MONTHLY'});
            this.getChartsData('month');
        } else if (selectedOption.value === 'weekly') {
            this.setState({charData: this.state.weekChartData, hAxisTitle: 'WEEKS', chartTitle: 'WEEKLY'});
            this.getChartsData('week');
        } else if (selectedOption.value === 'yearly') {
            this.setState({charData: this.state.yearChartData, hAxisTitle: 'YEARS', chartTitle: 'YEARLY'});
            this.getChartsData('year');
        }
    }

    render() {
        const {loading} = store.getState().global;
        const {
            data,
            salesData,
            pagination,
            defaultSelectedOption,
            sortingOptions,
            chartOptions,
            defaultSelectedOptionChart,
            charData,
            monthChartData,
            hAxisTitle,
            chartTitle,
            topSellingCategoriesData
        } = this.state;

        return (
            <React.Fragment >
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{data.totalProducts}</div>
                                        <div className="cb_name">No. of products</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{data.totalServices}</div>
                                        <div className="cb_name">No. of services</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">${data.totalPaymentAmount}</div>
                                        <div className="cb_name">Payments</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">{data.totalOrders}</div>
                                        <div className="cb_name">Total Orders</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-9">
                                    <div className="dash_graph bg-white">
                                        <div className="dash_graph_head">
                                            <div className="dash_title">{chartTitle} Sales Graph</div>
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
                                            {monthChartData.length > 0 ?
                                                <Chart
                                                    width={'100%'}
                                                    height={'400px'}
                                                    chartType="LineChart"
                                                    loader={<div>Loading Chart</div>}
                                                    data={charData.length > 0 ? charData : monthChartData}
                                                    options={{
                                                        hAxis: {
                                                            title: `${hAxisTitle}`,
                                                        },
                                                        vAxis: {
                                                            title: 'NUMBER OF SALES',
                                                        },
                                                        curveType: "function",
                                                    }}
                                                    rootProps={{'data-testid': '1'}}
                                                /> :
                                                <NotFound msg="Data not found." />
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="tsc_box bg-white p-3">
                                        <div className="dash_title">my top selling categories</div>
                                        <div className="tsc_img mt-4 mb-4">
                                            <Chart
                                                width={'100%'}
                                                height={'400px'}
                                                chartType="PieChart"
                                                loader={<div>Loading Chart</div>}
                                                data={topSellingCategoriesData}
                                                options={{
                                                    // title: 'My Daily Activities',
                                                    legend: {position: "bottom", alignment: "center"},
                                                    pieHole: 0.4,
                                                    slices: [
                                                        {color: "#43D2FF"},
                                                        {color: "#222327"},
                                                        {color: "#4358FF"}
                                                    ]
                                                }}
                                                rootProps={{ 'data-testid': '3' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <div className="my_pro_cart bg-white pb-4">
                                        <div className="mpc_header">
                                            <div className="dash_title">My Product Chart</div>
                                            <Select
                                                className="sort_select text-normal"
                                                options={sortingOptions}
                                                value={defaultSelectedOption}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        {salesData.length > 0 ?
                                            <table className="table table-responsive table-hover pe_table mpc_table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Product / Service</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Sales</th>
                                                        <th scope="col">Reviews</th>
                                                        <th scope="col">Profit</th>
                                                        <th scope="col">Revenue</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {salesData.length && salesData.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="odr_item_img"><img src={config.apiURI + value.productId.featuredImage} className="img-fluid" alt="" /></div>
                                                                    <span>{value.productId._id}</span>
                                                                </td>
                                                                <td>${value.productId.price}</td>
                                                                <td>{value.totalSalesCount}</td>
                                                                <td>{value.productId.reviewCount}</td>
                                                                <td>${value.profitAmount}</td>
                                                                <td>${value.revenueAmount}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table> :
                                            <NotFound msg="Data not found." />
                                        }
                                        {salesData.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getProductSales(true, pagination.prevPage)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination()}
                                                    <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getProductSales(true, pagination.nextPage)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
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

export default connect(setLoading)(SellerDashboard);