import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import { Chart as ChartJS, ArcElement,CategoryScale,
    LinearScale,
    BarElement,Title, Tooltip,Legend} from 'chart.js';
import { Bar,Doughnut} from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import axios from 'axios';

import nicon from '../../assets/images/nicon.png';

class ManageReportsServices extends Component {
    constructor(props) {
        super(props)
        this.authInfo = store.getState().auth.authInfo;
        toast.configure();
    }

    handleSubmit = (values, {resetForm}) => {
        const { dispatch } = this.props;
        dispatch(setLoading({loading: true}));
        axios.post('admin/coupons', values, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            toast.dismiss();
            if (response.data.status) {
                toast.success(response.data.message, {autoClose: 3000});
                resetForm();
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, {autoClose: 3000});
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    render() {
        ChartJS.register(CategoryScale,
            LinearScale,
            BarElement,
            Title,ArcElement, Tooltip, Legend);
            
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
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

        const dataBar = {
            labels,
            datasets: [
            {
                label: 'Dataset 1',
                data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
                backgroundColor: [
                    '#3c8dbc',
                    '#f56954',
                    '#f39c12',
                    '#CCCCCC',
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
                                        <div className="rep_chart_item chart_left">
                                            <Doughnut data={data} />
                                        </div>
                                    </div>

                                </div>
                                <div className="col-lg-4">
                                    <div className="card bg-white rounded-3">
                                        <div className="card-header">
                                            Weekly Report
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
                                                <h2>$578.87</h2>
                                                <h4>Avg $50.46/Order</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="card  bg-white rounded-3 pt-3 pb-5 report_listing_row">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                    <div className="dash_title">All Reports</div>
                                    <div className="search_customer_field">
                                        <form className="d-lg-flex">
                                            <span className="search_label">Search Report</span>
                                            <input className="form-control border-start height-auto" type="date" placeholder="Start Date" value=""/>
                                            <input className="form-control border-start height-auto" type="date" placeholder="End Date" value=""/>
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
                        </div>


                        <div className="card  bg-white rounded-3 pt-3 pb-5 report_listing_row">
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
                        </div>

                        <div className="card  bg-white rounded-3 pt-3 pb-0 report_bestsetting_pro_row">
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
                                                        <img src={nicon} alt=""/>
                                                    </div>
                                                </td>
                                                <td><a href="">Milk & Honey Book</a></td>
                                                <td>25</td>
                                                <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="productThumb">
                                                        <img src={nicon} alt=""/>
                                                    </div>
                                                </td>
                                                <td><a href="">Milk & Honey Book</a></td>
                                                <td>25</td>
                                                <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="productThumb">
                                                        <img src={nicon} alt=""/>
                                                    </div>
                                                </td>
                                                <td><a href="">Milk & Honey Book</a></td>
                                                <td>25</td>
                                                <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="productThumb">
                                                        <img src={nicon} alt=""/>
                                                    </div>
                                                </td>
                                                <td><a href="">Milk & Honey Book</a></td>
                                                <td>25</td>
                                                <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">View</a></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="productThumb">
                                                        <img src={nicon} alt=""/>
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
                        </div>
                    </div>

                </div>
            </div>
                    
                <Footer />
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(ManageReportsServices);