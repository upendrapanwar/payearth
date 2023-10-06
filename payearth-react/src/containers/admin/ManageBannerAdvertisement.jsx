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
import { Link } from 'react-router-dom';

class ManageBannerAdvertisement extends Component {
    componentDidMount(){
        document.body.style.overflow = "unset"// Set the style
      }
    render() {
    return (
      <React.Fragment>
        <Header />
        <div className="inr_top_page_title">
                <h2>Create New Banner</h2>
            </div>
            <section className="inr_wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="cart adv_banner_wrapper">
                                <div className="noti_wrap">
                                    <div className=""><span>
                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/manage-banner-list">Banner Manager</Link>
                                    </span></div>
                                </div>


                                <div className="cart_list adv_banner_panel">
                                    <div className="create_banner_form">
                                        <div className="row">
                                            <div className="col-md-8">
                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">Type of Banner</label>
                                                        <div className="field_item">
                                                            <select className="form-control" name="" id="">
                                                        <option>Graphic Banner</option>
                                                        <option>Text Banner</option>
                                                    </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">Status</label>
                                                        <div className="field_item">
                                                            <div class="form-check form-switch">
                                                                <input class="form-check-input" type="checkbox" value="" checked=""/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">Banner Name</label>
                                                        <div className="field_item">
                                                            <input className="form-control" type="text" name="" id=""/>
                                                        </div>
                                                    </div>
                                                </div>



                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">Open in New Window</label>
                                                        <div className="field_item">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" value="" checked=""/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">Start Date</label>
                                                        <div className="field_item">
                                                            <input type="date" name="" id="" className="form-control"/>
                                                        </div>
                                                    </div>
                                                </div>

                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">End Date</label>
                                                        <div className="field_item">
                                                            <input type="date" name="" id="" className="form-control"/>
                                                        </div>
                                                    </div>
                                                </div>

                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">Meta information</label>
                                                        <div className="field_item">
                                                            <textarea name="" id="" cols="30" rows="10" className="form-control"></textarea>
                                                        </div>
                                                    </div>
                                                </div>

                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <div className="field_item">
                                                            <button className="btn custom_btn btn_yellow mx-auto">Create Banner</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                
                                                <div className="crt_bnr_fieldRow">
                                                    <div className="crt_bnr_field">
                                                        <label for="">Upload Banner Image</label>
                                                        <div className="field_item">
                                                            <input className="form-control" type="file" name="" id=""/>
                                                        </div>

                                                        <div className="adv_preview_thumb">
                                                            <div className="thumbPic">
                                                                <img src={nicon} alt=""/>

                                                                <span classNameName="deletePrev">
                                                                    <button type="button" classNameName="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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

export default ManageBannerAdvertisement;