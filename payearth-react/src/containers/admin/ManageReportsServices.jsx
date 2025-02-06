import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import {
    Chart as ChartJS, ArcElement, CategoryScale,
    LinearScale,
    BarElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import nicon from '../../assets/images/nicon.png';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';


class ManageReportsServices extends Component {
    constructor(props) {
        super(props)
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            weeksInYear: [], // All weeks in the current year
            currentWeekIndex: 0, // Index of the currently displayed week
            latestCustomers: [],
            bestSellingProducts: [],
            allServiceOrdersData: [],
            monthlyServiceCounts: [],
            serviceTopCategories: [],
            orderThisMonth: [],
        };
        toast.configure();

        this.all_Reports = [
            // {
            //     name: '',
            //     cell: (row) => (
            //         <img
            //             src={row.featuredImage}
            //             alt="Product Image"
            //             className="img-thumbnail"
            //             style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            //         />
            //     ),
            //     sortable: false,
            // },
            {
                name: 'ORDER NO',
                selector: (row, i) => row.orderCode,
                sortable: true,
            },
            {
                name: 'NAME',
                // selector: (row, i) => row.billingFirstName,
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
                // selector: (row, i) => row.createdAt,
                selector: (row, i) => {
                    // Format the createdAt date to show only the date (yyyy-mm-dd)
                    const createdAt = new Date(row.createdAt);
                    return createdAt.toLocaleDateString('en-US');  // Format as 'MM/DD/YYYY'
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
            // {
            //     name: '',
            //     selector: (row, i) => row.orderStatusDetails[0]?.title,
            //     cell: (row) => (
            //         <button
            //             className="btn btn-primary btn-sm"
            //         // onClick={() => handleView(row)}
            //         >
            //             Download
            //         </button>
            //     ),
            //     sortable: false
            // }
        ];
    }

    componentDidMount() {
        this.getReportData();
        this.getServiceTopSellingCategories();
        this.getServiceOrdersTotalPriceForMonth();
    }

    getReportData = async () => {
        try {
            this.setState({ loading: true });
            const url = "admin/getServiceReport";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            const data = response.data.data;
            this.setState({ allServiceOrdersData: data.allOrders, loading: false });
            this.setState({ monthlyServiceCounts: data.monthlyServiceCounts, loading: false });
        } catch (error) {
            console.error("There was an error fetching Best Selling Products data", error);
            this.setState({ loading: false });
        }
    };

    handleSubmit = (values, { resetForm }) => {
        const { dispatch } = this.props;
        dispatch(setLoading({ loading: true }));
        axios.post('admin/coupons', values, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            toast.dismiss();
            if (response.data.status) {
                toast.success(response.data.message, { autoClose: 3000 });
                resetForm();
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }



    service_column = [
        {
            name: "Image",
            selector: (row, i) => (
                <img
                    src={row.featuredImage}
                    alt="Not selected"
                    style={{ width: "150px", height: "100px" }}
                />
            ),
            sortable: true,
        },
        {
            name: "Service ID",
            selector: (row, i) => row.serviceCode,
            sortable: true,
        },
        {
            name: "Service Name",
            selector: (row, i) => row.name,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row, i) => row.category.categoryName,
            sortable: true,
        },
        {
            name: "Charges",
            selector: (row, i) => `$ ${row.charges}`,
            sortable: true,
        },
        // author
        {
            name: "Service Start Date & Time",
            selector: (row, i) => row.createdAt,
            sortable: true,
            width: "200px",

            cell: (row) => {
                const options = { year: "numeric", month: "long", day: "numeric" };
                const date = new Date(row.createdAt).toLocaleDateString(
                    "en-US",
                    options
                );
                return <div>{date}</div>;
            },
        },
        {
            name: "Status",
            selector: (row, i) =>
                row.isActive === true ? (
                    <p className="p-1 text-white bg-success  bg-opacity-6 border-info rounded">
                        Active
                    </p>
                ) : (
                    <p className="p-1 text-white bg-danger  bg-opacity-6 border-info rounded">
                        In-Active
                    </p>
                ),
            sortable: true,
        },
        {
            name: "Actions",
            // width: "350px",
            cell: (row) => (
                <>
                    <button
                        onClick={() => this.handleDetails(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Details
                    </button>
                    <button
                        onClick={() => this.handleEdit(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Edit
                    </button>
                    {row.isActive ? (<button
                        onClick={() => this.handleUpdateStatus(row._id, row.isActive)}
                        className="custom_btn btn_yellow_bordered  w-auto  btn btn-width action_btn_new"
                    >
                        Inactive
                    </button>
                    ) : (
                        <button
                            onClick={() => this.handleUpdateStatus(row._id, row.isActive)}
                            className="custom_btn btn_yellow_bordered w-auto  btn btn-width action_btn_new"
                        >
                            active
                        </button>
                    )}
                </>
            ),
        },
    ];


    getServiceTopSellingCategories = () => {
        axios.get("admin/getServiceTopSellingCategories", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        })
            .then((response) => {
                const data = response.data.data.data;
                const topCategories = data.map((item) => ({
                    value: item.count,
                    label: item.name,
                }));
                this.setState({ serviceTopCategories: topCategories, loading: false });
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

    getServiceOrdersTotalPriceForMonth = () => {
        axios.get("admin/getServiceOrdersTotalPriceForMonth", {
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
        const { monthlyServiceCounts, allServiceOrdersData, serviceTopCategories, orderThisMonth } = this.state;
        const colors = ['rgb(2, 178, 175)', 'rgb(46, 150, 255)', 'rgb(184, 0, 216)', 'rgb(96, 0, 155)'];
        console.log('allServiceOrdersData--',allServiceOrdersData)

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

        const dataBar = {
            labels,
            datasets: [
                {
                    label: 'Service',
                    data: monthlyServiceCounts,
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

        const data = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    labels: [
                        'Total Payment',
                        'Received Payment',
                        'Earning',
                    ],
                    data: [10, 20, 30],
                    backgroundColor: [
                        '#3c8dbc',
                        '#f56954',
                        '#f39c12',
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
                <div className="cumm_page_wrap pt-5 pb-1 admin-dashboard-wrapper reports_page_wrapper">
                    <div className="container">
                        <div className="report_tabing_nav">
                            <div className="report_tab_link">
                                <ul>
                                    <li><Link to="/admin/manage-reports">Product</Link></li>
                                    <li className="activeNav"><Link to="/admin/manage-reports-services">Service</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="report_tab_item service_report_tab_item">
                            <div className="rep_chart_wrapper">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="card bg-white rounded-3">
                                            <div className="card-header">
                                                Monthly Report
                                            </div>
                                            {/* <div className="rep_chart_item chart_left">
                                                <Doughnut data={data} />
                                            </div> */}

                                            <div className="tsc_box bg-white p-3">
                                                <div className="row">
                                                    <div className="col-lg-6 m-0 p-0">
                                                        <ul className="list-unstyled">
                                                            {serviceTopCategories.map((item, index) => (
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
                                                                        data: serviceTopCategories,
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
                                                Monthly Service Report
                                            </div>
                                            <div className="rep_chart_item chart_right">
                                                <Bar options={optionsBar} data={dataBar} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="card bg-white rounded-3">
                                            <div className="card-header">
                                                Order this week
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


                            <div className="card  bg-white rounded-3 pt-3 pb-5 report_listing_row">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                        <div className="dash_title">All Service Reports</div>
                                    </div>
                                </div>

                                <DataTableExtensions
                                    columns={this.all_Reports}
                                    data={allServiceOrdersData}
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

                            {/* <div className="card  bg-white rounded-3 pt-3 pb-5 report_listing_row">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                        <div className="dash_title">Latest Customers</div>
                                    </div>
                                </div>
                                <div className="orders_table reports-list-content pt-0 pb-0">
                                    <div className="tab-pane fade show active">
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>ORDER NO</th>
                                                    <th>Name</th>
                                                    <th>Order Ammount</th>
                                                    <th>City</th>
                                                    <th>State</th>
                                                    <th>Status</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>#587</td>
                                                    <td>Alexendra</td>
                                                    <td>$245.45</td>
                                                    <td>San Francisco</td>
                                                    <td>California</td>
                                                    <td>Completed</td>
                                                </tr>
                                                <tr>
                                                    <td>#587</td>
                                                    <td>Alexendra</td>
                                                    <td>$245.45</td>
                                                    <td>San Francisco</td>
                                                    <td>California</td>
                                                    <td>Completed</td>
                                                </tr>
                                                <tr>
                                                    <td>#587</td>
                                                    <td>Alexendra</td>
                                                    <td>$245.45</td>
                                                    <td>San Francisco</td>
                                                    <td>California</td>
                                                    <td>Completed</td>
                                                </tr>
                                                <tr>
                                                    <td>#587</td>
                                                    <td>Alexendra</td>
                                                    <td>$245.45</td>
                                                    <td>San Francisco</td>
                                                    <td>California</td>
                                                    <td>Completed</td>
                                                </tr>
                                                <tr>
                                                    <td>#587</td>
                                                    <td>Alexendra</td>
                                                    <td>$245.45</td>
                                                    <td>San Francisco</td>
                                                    <td>California</td>
                                                    <td>Completed</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> */}

                            {/* <div className="card  bg-white rounded-3 pt-3 pb-0 report_bestsetting_pro_row">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                        <div className="dash_title">Best selling Products</div>
                                    </div>
                                </div>

                                <div className="orders_table reports-list-content pt-0 pb-0">
                                    <div className="tab-pane fade show active">
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th width="100px">Product Image</th>
                                                    <th>Product Title</th>
                                                    <th width="100px">Quantity</th>
                                                    <th width="120px">&nbsp;</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="productThumb">
                                                            <img src={nicon} alt="" />
                                                        </div>
                                                    </td>
                                                    <td><a href="">Milk & Honey Book</a></td>
                                                    <td>25</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="productThumb">
                                                            <img src={nicon} alt="" />
                                                        </div>
                                                    </td>
                                                    <td><a href="">Milk & Honey Book</a></td>
                                                    <td>25</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="productThumb">
                                                            <img src={nicon} alt="" />
                                                        </div>
                                                    </td>
                                                    <td><a href="">Milk & Honey Book</a></td>
                                                    <td>25</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="productThumb">
                                                            <img src={nicon} alt="" />
                                                        </div>
                                                    </td>
                                                    <td><a href="">Milk & Honey Book</a></td>
                                                    <td>25</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="productThumb">
                                                            <img src={nicon} alt="" />
                                                        </div>
                                                    </td>
                                                    <td><a href="">Milk & Honey Book</a></td>
                                                    <td>25</td>
                                                    <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <Footer />
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(ManageReportsServices);