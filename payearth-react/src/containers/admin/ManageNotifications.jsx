import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import addCouponSchema from '../../validation-schemas/addCouponSchema';
import { Link } from 'react-router-dom';

class ManageNotifications extends Component {
    componentDidMount(){
        document.body.style.overflow = "unset"// Set the style
    }
    render() {
        return (
            <React.Fragment>
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                    <div className="dash_title">Manage Notifications</div>
                                    
                                </div>
                            </div>
                            
                            <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                <table className="table table-responsive table-hover pe_table">
                                            <thead>
                                            <tr>
                                                <th scope="col">Posted By</th>
                                                <th scope="col">Date</th>
                                                <th scope="col" className="invisible">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="noti active">Steven posted a minute ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">View Details</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti active">Emma posted a 30 minute ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti">Steven posted one days ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti">Steven posted one days ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti">Steven posted one days ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                </div>
                                
                                
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default ManageNotifications;