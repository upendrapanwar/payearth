import React, { useState, useEffect } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import arrow_back from '../../assets/icons/arrow-back.svg'
import { Helmet } from 'react-helmet';
import PageTitle from './../../components/user/common/PageTitle';

const SupportAdmin = () => {
    return (
        <React.Fragment>
            <Header />
            <PageTitle title="Manage Support" />
            <Helmet><title>{"Admin - Manage Support - Pay Earth"}</title></Helmet>
            <section className="admin-dashboard-wrapper">
                <div className="inr_wrap dash_inner_wrap support_manager_wrapper">
                    <div className="col-md-12">
                        <div className="seller_dash_wrap pt-2 pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="noti_wrap">
                                        <div className='d-flex justify-content-end'><span>
                                            {/* <Link className="btn custom_btn btn_yellow mx-auto mt-2" to="/admin/dashboard">
                                                <img src={arrow_back} alt="linked-in" />&nbsp;
                                                Back
                                            </Link> */}
                                            <button
                                                type="button"
                                                className="btn custum_back_btn btn_yellow mx-auto me-4"
                                                onClick={() => window.history.back()}
                                            >
                                                <img src={arrow_back} alt="back" />&nbsp;
                                                Back
                                            </button>
                                        </span></div>
                                    </div>
                                    <div className="dash_inner_wrap">

                                        <div className="col-md-12">

                                            <div className="support_head_panel">
                                                <h2>Quick Customer Support</h2>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry lorem Ipsum has been the industrys standard dummy text ever since.</p>

                                                <div className="support_button">
                                                    <a className="btn custom_btn btn_yellow mx-auto" href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" id="email">Check Email's</a>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/support-call" id="call" >Check request a call</Link>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/chat">Chat</Link>
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

export default SupportAdmin;
