import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import nicon from './../../assets/images/nicon.png'; 
import editicon from './../../assets/images/edit_icon.svg'; 
import delete_icon from './../../assets/images/delete_icon.svg'; 

import { Link } from 'react-router-dom';

class ManageBannerList extends Component {
    componentDidMount(){
        document.body.style.overflow = "unset"// Set the style
      }
    render() {
    return (
      <React.Fragment>
        <Header />
        <section className="admin-dashboard-wrapper">
                <div className="inr_wrap dash_inner_wrap admin_manage_banner">

                    <div className="col-md-12">
                        <div className="seller_dash_wrap pt-5 pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="dash_inner_wrap">
                                        <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                            <div className="dash_title">Manage Banners</div>
                                            <div className="search_customer_field">
                                                <div className="noti_wrap">
                                                    <div className=""><span>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/manage-banner-advertisement">Create Banner</Link>
                                                    </span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                        <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                            <table className="table table-responsive table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>&nbsp;</th>
                                                        <th>Name</th>
                                                        <th>Type</th>
                                                        <th>Status</th>
                                                        <th>Update Date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>18</td>
                                                        <td>
                                                            <div className="preview-thumb">
                                                                <img src={nicon} alt=""/>
                                                            </div>
                                                        </td>
                                                        <td>Banner 05</td>
                                                        <td>Main page Banner</td>
                                                        <td>Graphic Banner</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" value="" checked=""/>
                                                            </div>
                                                        </td>
                                                        <td>15-12-2022 to 20-12-2022</td>
                                                        <td>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={editicon} alt=""/></a>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={delete_icon} alt=""/></a>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>18</td>
                                                        <td>
                                                            <div className="preview-thumb">
                                                                <img src={nicon} alt=""/>
                                                            </div>
                                                        </td>
                                                        <td>Banner 05</td>
                                                        <td>Main page Banner</td>
                                                        <td>Graphic Banner</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" value="" checked=""/>
                                                            </div>
                                                        </td>
                                                        <td>15-12-2022 to 20-12-2022</td>
                                                        <td>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={editicon} alt=""/></a>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={delete_icon} alt=""/></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>18</td>
                                                        <td>
                                                            <div className="preview-thumb">
                                                                <img src={nicon} alt=""/>
                                                            </div>
                                                        </td>
                                                        <td>Banner 05</td>
                                                        <td>Main page Banner</td>
                                                        <td>Graphic Banner</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" value="" checked=""/>
                                                            </div>
                                                        </td>
                                                        <td>15-12-2022 to 20-12-2022</td>
                                                        <td>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={editicon} alt=""/></a>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={delete_icon} alt=""/></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>18</td>
                                                        <td>
                                                            <div className="preview-thumb">
                                                                <img src={nicon} alt=""/>
                                                            </div>
                                                        </td>
                                                        <td>Banner 05</td>
                                                        <td>Main page Banner</td>
                                                        <td>Graphic Banner</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" value="" checked=""/>
                                                            </div>
                                                        </td>
                                                        <td>15-12-2022 to 20-12-2022</td>
                                                        <td>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={editicon} alt=""/></a>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={delete_icon} alt=""/></a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>18</td>
                                                        <td>
                                                            <div className="preview-thumb">
                                                                <img src={nicon} alt=""/>
                                                            </div>
                                                        </td>
                                                        <td>Banner 05</td>
                                                        <td>Main page Banner</td>
                                                        <td>Graphic Banner</td>
                                                        <td>
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" value="" checked=""/>
                                                            </div>
                                                        </td>
                                                        <td>15-12-2022 to 20-12-2022</td>
                                                        <td>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={editicon} alt=""/></a>
                                                            <a className="custom_btn btn_yellow_bordered w-auto btn" href="#"><img src={delete_icon} alt=""/></a>
                                                        </td>
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
                                        <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                                            <div className="no_data_found">Data not found.</div>
                                        </div>
                                        <div className="tab-pane fade" id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
                                            <div className="no_data_found">Data not found.</div>
                                        </div>
                                    </div>
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

export default ManageBannerList;