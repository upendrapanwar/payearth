import React, { Component } from 'react'
import Header from '../../components/admin/common/Header'
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import { Link } from 'react-router-dom';
import nicon from '../../assets/images/nicon.png';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import {
    Chart as ChartJS, ArcElement, CategoryScale,
    LinearScale,
    BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';


class ManageReports extends Component {
    constructor(props) {
        super(props)
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            // weeksInYear: [], // All weeks in the current year
            // currentWeekIndex: 0, // Index of the currently displayed week
            latestCustomers: [],
            bestSellingProducts: [],
            allOrdersData: [],
            monthlyOrderCounts: [],
            topCategories: [],
            orderThisMonth: [],
        };
        toast.configure();

        this.latest_Customers = [
            {
                name: 'NAME',
                selector: (row, i) => row.userDetails.name,
                sortable: true
            },
            {
                name: 'CITY',
                selector: (row, i) => row.userDetails.address?.city,
                sortable: true
            },
            {
                name: 'STATE',
                selector: (row, i) => row.userDetails.address?.state,
                sortable: true
            },
            {
                name: 'ORDER NO',
                selector: (row, i) => row.orderCode,
                sortable: true
            },
            {
                name: 'ORDER AMMOUNT',
                selector: (row, i) => row.total,
                sortable: true
            },
            {
                name: 'STATUS',
                selector: (row, i) => row.orderStatusDetails[0]?.title,
                sortable: true
            },
        ];

        this.bestSelling_Products = [
            {
                name: '',
                cell: (row) => (
                    <img
                        src={row.featuredImage}
                        alt="Product Image"
                        className="img-thumbnail"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                ),
                sortable: false,
            },
            {
                name: 'PRODUCT NAME',
                selector: (row, i) => row.name,
                sortable: true,
            },
            {
                name: 'BRAND NAME',
                selector: (row, i) => row.brand,
                sortable: true,
            },
            {
                name: 'CATEGORY',
                selector: (row, i) => row.category,
                sortable: true,
            },
            {
                name: 'SUB_CATEGORY',
                selector: (row, i) => row.sub_category,
                sortable: true,
            },
            {
                name: 'PRICE',
                selector: (row, i) => row.price,
                sortable: true
            },
            {
                name: 'SELLING QUANTITY',
                selector: (row, i) => row.quantity?.selling_qty,
                sortable: true
            },
        ];


        this.all_Reports = [
            {
                name: 'ORDER NO',
                selector: (row, i) => row.orderCode,
                sortable: true,
            },
            {
                name: 'NAME',
                selector: (row, i) => {
                    return `${row.billingFirstName} ${row.billingLastName}`;
                },
                sortable: true,
            },
            {
                name: 'EMAIL',
                selector: (row, i) => row.billingEmail,
                sortable: true,
            },
            {
                name: 'DATE',
                selector: (row, i) => {
                    const createdAt = new Date(row.createdAt);
                    return createdAt.toLocaleDateString('en-US');
                },
                sortable: true,
            },
            {
                name: 'TYPE OF PAYMENT',
                selector: (row, i) => row.paymentDetails[0]?.paymentMode,
                sortable: true
            },
            {
                name: 'STATUS',
                selector: (row, i) => row.paymentDetails[0]?.paymentStatus,
                sortable: true
            },
        ];
    }

    componentDidMount() {
        // this.productMonthWeekReport();
        // const weeksInYear = this.getWeeksInYear();
        // if (weeksInYear !== null) {
        //     this.getWeeklyOrderStatusCount(weeksInYear);
        // }
        // this.setState({ weeksInYear });
        this.getLatestCustomers();
        this.getBestSellingProducts();
        this.getReportData();
        this.getProductTopSellingCategories();
        this.getOrdersTotalPriceForMonth();
    }

    // getWeeksInYear() {
    //     const now = new Date();
    //     const year = now.getFullYear(); // Current year

    //     // Helper function to get weeks in a specific month
    //     const getWeeksInMonth = (year, month) => {
    //         const startOfMonth = new Date(year, month, 1);
    //         const endOfMonth = new Date(year, month + 1, 0); // Last day of the month
    //         const weeks = [];

    //         let startOfWeek = new Date(startOfMonth);
    //         while (startOfWeek <= endOfMonth) {
    //             const endOfWeek = new Date(
    //                 Math.min(
    //                     new Date(startOfWeek).setDate(startOfWeek.getDate() + 6), // End of the week
    //                     endOfMonth // Ensure it doesn't exceed the month's last day
    //                 )
    //             );

    //             weeks.push({ startOfWeek: new Date(startOfWeek), endOfWeek });
    //             startOfWeek.setDate(startOfWeek.getDate() + 7); // Move to the next week
    //         }
    //         return weeks;
    //     };

    //     // Iterate over all months and get weeks
    //     const allWeeks = [];
    //     for (let month = 0; month < 12; month++) {
    //         const weeks = getWeeksInMonth(year, month);
    //         allWeeks.push(...weeks); // Flatten weeks into a single array
    //     }

    //     return allWeeks;
    // }

    // handleNextWeek = () => {
    //     this.setState((prevState) => {
    //         const nextIndex = prevState.currentWeekIndex + 1;
    //         if (nextIndex < prevState.weeksInYear.length) {
    //             return { currentWeekIndex: nextIndex };
    //         } else {
    //             alert("No more weeks left in the year!");
    //             return null;
    //         }
    //     });
    // };

    // handlePreviousWeek = () => {
    //     this.setState((prevState) => {
    //         const prevIndex = prevState.currentWeekIndex - 1;
    //         if (prevIndex >= 0) {
    //             return { currentWeekIndex: prevIndex };
    //         } else {
    //             alert("No previous weeks available!");
    //             return null;
    //         }
    //     });
    // };




    getWeeklyOrderStatusCount = async (weeksInYear) => {
        this.setState({ weeksInYear })
        const { currentWeekIndex } = this.state;

        // console.log("weeksInYear under getWeeklyOrderStatusCount", weeksInYear);
        // console.log("currentWeekIndex getWeeklyOrderStatusCount", currentWeekIndex);

        const currentWeek = weeksInYear[currentWeekIndex];

        console.log("currentWeek under getWeeklyOrderStatusCount", currentWeek);

        try {
            this.setState({ loading: true });
            // const reqParams = {
            //     // authorId: this.authInfo.id,
            //     // timeFrame: selectedTimeFrame,
            // };


            const url = `/admin/getWeeklyOrderStatusCount`; // timeFrame = week , month, year
            const response = await axios.get(url, {
                // params: reqParams,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            console.log(" getWeeklyOrderStatusCount data", data)
            // this.setState({ productSalesData: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    }

    // productMonthWeekReport = async () => {
    //     try {
    //         this.setState({ loading: true });
    //         // const reqParams = {
    //         //     // authorId: this.authInfo.id,
    //         //     // timeFrame: selectedTimeFrame,
    //         // };


    //         const url = `/admin/productMonthWeekReport?year=${2025}`; // timeFrame = week , month, year
    //         const response = await axios.get(url, {
    //             // params: reqParams,
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json;charset=UTF-8',
    //                 'Authorization': `Bearer ${this.authInfo.token}`
    //             }
    //         });
    //         const data = response.data.data;
    //         console.log(" productMonthWeekReport data", data)
    //         // this.setState({ productSalesData: data, loading: false });
    //     } catch (error) {
    //         console.error("There was an error fetching service list category data", error);
    //         this.setState({ loading: false });
    //     }
    // }

    // handleSubmit = (values, { resetForm }) => {
    //     const { dispatch } = this.props;
    //     dispatch(setLoading({ loading: true }));
    //     axios.post('admin/coupons', values, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${this.authInfo.token}`
    //         }
    //     }).then(response => {
    //         toast.dismiss();
    //         if (response.data.status) {
    //             toast.success(response.data.message, { autoClose: 3000 });
    //             resetForm();
    //         }
    //     }).catch(error => {
    //         toast.dismiss();
    //         if (error.response) {
    //             toast.error(error.response.data.message, { autoClose: 3000 });
    //         }
    //     }).finally(() => {
    //         setTimeout(() => {
    //             dispatch(setLoading({ loading: false }));
    //         }, 300);
    //     });
    // }


    getLatestCustomers = async () => {
        try {
            this.setState({ loading: true });
            const url = "admin/getLatestCustomers";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            this.setState({ latestCustomers: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching Latest Customers data", error);
            this.setState({ loading: false });
        }
    };


    getBestSellingProducts = async () => {
        try {
            this.setState({ loading: true });
            const url = "admin/getBestSellingProducts";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            this.setState({ bestSellingProducts: data, loading: false });
        } catch (error) {
            console.error("There was an error fetching Best Selling Products data", error);
            this.setState({ loading: false });
        }
    };


    getReportData = async () => {
        try {
            this.setState({ loading: true });
            const url = "admin/getReportData";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            // console.log('getReportData-----data',data)
            this.setState({ allOrdersData: data.allOrders, loading: false });
            this.setState({ monthlyOrderCounts: data.monthlyOrderCounts, loading: false });
        } catch (error) {
            console.error("There was an error fetching Best Selling Products data", error);
            this.setState({ loading: false });
        }
    };


    getProductTopSellingCategories = () => {
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



    getOrdersTotalPriceForMonth = () => {
        axios.get("admin/getOrdersTotalPriceForMonth", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                Authorization: `Bearer ${this.authInfo.token}`,
            },
        })
            .then((response) => {
                const data = response.data.data.data;
                this.setState({ orderThisMonth: data, loading: false });
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

    render() {

        const { latestCustomers, bestSellingProducts, allOrdersData, monthlyOrderCounts, topCategories, orderThisMonth } = this.state;
        const colors = ['rgb(2, 178, 175)', 'rgb(46, 150, 255)', 'rgb(184, 0, 216)', 'rgb(96, 0, 155)'];
        // if (weeksInYear.length === 0) {
        //     return <p>Loading weeks...</p>; // Show loading state if weeks are not yet calculated
        // }

        // const currentWeek = weeksInYear[currentWeekIndex];

        console.log("orderThisMonth", orderThisMonth);
        // console.log("monthlyOrderCounts", monthlyOrderCounts);


        ChartJS.register(CategoryScale,
            LinearScale,
            BarElement,
            Title, ArcElement, Tooltip, Legend);

        const optionsBar = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: false,
                    text: 'Chart.js Bar Chart',
                }
            },
        };

        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Use `monthlyOrderCounts` as the dataset for the bar chart
        const dataBar = {
            labels,
            datasets: [
                {
                    label: 'Orders',
                    data: monthlyOrderCounts,
                    backgroundColor: [
                        '#3c8dbc',
                        '#f56954',
                        '#f39c12',
                        '#CCCCCC',
                        '#8e44ad',
                        '#3498db',
                        '#e74c3c',
                        '#2ecc71',
                        '#f1c40f',
                        '#e67e22',
                        '#1abc9c',
                        '#9b59b6',
                    ],
                },
            ],
        };

        return (
            <React.Fragment>
                <Header />
                <div className="inr_top_page_title">
                    <h2>Report Dashboard</h2>
                </div>
                <div className="cumm_page_wrap pt-4 pb-1 admin-dashboard-wrapper reports_page_wrapper">
                    <div className="container">
                        <div className="d-flex align-items-center justify-content-between report_tabing_nav">
                            <div className="report_tab_link">
                                <ul className="d-flex mb-0">
                                    <li className="activeNav"><Link to="/admin/manage-reports">Product</Link></li>
                                    <li><Link to="/admin/manage-reports-services">Service</Link></li>
                                </ul>    
                            </div>
                            <button className="custom_btn btn_yellow w-auto btn" onClick={() => window.history.back()}>Back</button>
                        </div>
                        <div className="report_tab_item product_report_tab_item">
                            <div className="rep_chart_wrapper">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="card bg-white rounded-3">
                                            <div className="card-header">
                                                Top selling categories
                                            </div>

                                            <div className="tsc_box bg-white p-3">
                                                <div className="row">
                                                    <div className="col-lg-6 m-0 p-0">
                                                        <ul className="list-unstyled">
                                                            {topCategories.map((item, index) => (
                                                                <li key={index} className="d-flex align-items-center mb-3 mt-2">
                                                                    <i style={{ color: colors[index % colors.length] }} className="fa fa-circle"></i>  <span className="small ps-2">{item.label}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="tsc_img col-lg-6 m-0 p-0">
                                                        <Box sx={{ width: '100%' }}>
                                                            <PieChart
                                                                height={200}
                                                                slotProps={{
                                                                    legend: { hidden: true },
                                                                }}
                                                                series={[
                                                                    {
                                                                        data: topCategories,
                                                                        innerRadius: 80,
                                                                        cx: 120,
                                                                        cy: 100,
                                                                        // arcLabel: (params) => params.label ?? '',
                                                                        // valueFormatter,
                                                                    }
                                                                ]}
                                                            />
                                                        </Box>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="card bg-white rounded-3">
                                            <div className="card-header">
                                                Monthly Order Report
                                            </div>
                                            <div className="rep_chart_item chart_right">
                                                <Bar options={optionsBar} data={dataBar} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="card bg-white rounded-3">
                                            <div className="card-header">
                                                Order this month
                                            </div>
                                            <div className="rep_chart_item orderWeek">
                                                <div className="total_weeklly_order">
                                                    <h2>${orderThisMonth.totalPrice}</h2>
                                                    <h4>Avg ${orderThisMonth.averagePrice}/Order</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="card  bg-white rounded-3 pt-3 pb-5 report_listing_row">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                        <div className="dash_title">All Reports</div>
                                        <div className="search_customer_field">
                                            <form className="d-lg-flex">
                                                <span className="search_label">Search Report</span>
                                                <input className="form-control border-start height-auto" type="date" placeholder="Start Date" value="" />
                                                <input className="form-control border-start height-auto" type="date" placeholder="End Date" value="" />
                                                <button className="btn btn_dark" type="button">Search</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="orders_table reports-list-content pt-0 pb-0">
                                    <div className="tab-pane fade show active">
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Order No</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Date</th>
                                                    <th>Type of Payment</th>
                                                    <th>Status</th>
                                                    <th className="manage">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>#5872584</td>
                                                    <td>Alexendra</td>
                                                    <td>helloAlexa@gmail.com</td>
                                                    <td>12/08/2022</td>
                                                    <td>Credit card</td>
                                                    <td>Success</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Download</a></td>
                                                </tr>
                                                <tr>
                                                    <td>#5872584</td>
                                                    <td>Alexendra</td>
                                                    <td>helloAlexa@gmail.com</td>
                                                    <td>12/08/2022</td>
                                                    <td>Credit card</td>
                                                    <td>Success</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Download</a></td>
                                                </tr>
                                                <tr>
                                                    <td>#5872584</td>
                                                    <td>Alexendra</td>
                                                    <td>helloAlexa@gmail.com</td>
                                                    <td>12/08/2022</td>
                                                    <td>Credit card</td>
                                                    <td>Success</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Download</a></td>
                                                </tr>
                                                <tr>
                                                    <td>#5872584</td>
                                                    <td>Alexendra</td>
                                                    <td>helloAlexa@gmail.com</td>
                                                    <td>12/08/2022</td>
                                                    <td>Credit card</td>
                                                    <td>Success</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Download</a></td>
                                                </tr>
                                                <tr>
                                                    <td>#5872584</td>
                                                    <td>Alexendra</td>
                                                    <td>helloAlexa@gmail.com</td>
                                                    <td>12/08/2022</td>
                                                    <td>Credit card</td>
                                                    <td>Success</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Download</a></td>
                                                </tr>
                                                <tr>
                                                    <td>#5872584</td>
                                                    <td>Alexendra</td>
                                                    <td>helloAlexa@gmail.com</td>
                                                    <td>12/08/2022</td>
                                                    <td>Credit card</td>
                                                    <td>Success</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Download</a></td>
                                                </tr>
                                                <tr>
                                                    <td>#5872584</td>
                                                    <td>Alexendra</td>
                                                    <td>helloAlexa@gmail.com</td>
                                                    <td>12/08/2022</td>
                                                    <td>Credit card</td>
                                                    <td>Success</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Download</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="pagination">
                                            <ul>
                                                <li><a className="link disabled" href="#"><span className="fa fa-angle-left me-2"></span> Prev</a></li>
                                                <li><a className="link active" href="#">1</a></li>
                                                <li><a className="link disabled" href="#">Next <span className="fa fa-angle-right ms-2"></span></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            <div className="card  bg-white rounded-3 pt-3 pb-5 report_listing_row">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                        <div className="dash_title">All Order Reports</div>
                                    </div>
                                </div>

                                <DataTableExtensions
                                    columns={this.all_Reports}
                                    data={allOrdersData}
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


                            <div className="card  bg-white rounded-3 pt-3 pb-5 report_listing_row">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                        <div className="dash_title">Latest Customers</div>
                                    </div>
                                </div>

                                <DataTableExtensions
                                    columns={this.latest_Customers}
                                    data={latestCustomers}
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

                            <div className="card  bg-white rounded-3 pt-3 pb-0 report_bestsetting_pro_row">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                        <div className="dash_title">Best selling Products</div>
                                    </div>
                                </div>
                                <DataTableExtensions
                                    columns={this.bestSelling_Products}
                                    data={bestSellingProducts}
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

                <Footer />
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(ManageReports);