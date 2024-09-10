import React from 'react';
import Header from '../../components/user/common/Header';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';


const SupportUser = () => {

    const showFrmField = () => {

    }


    return (
        <React.Fragment>
            <Header />
            <div className="inr_top_page_title">
                <h2>Support</h2>
            </div>
            <section className="admin-dashboard-wrapper">
                <div className="inr_wrap dash_inner_wrap support_manager_wrapper">

                    <div className="col-md-12">
                        <div className="seller_dash_wrap pt-5 pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="dash_inner_wrap">
                                        <div className="col-md-12">

                                            <div className="support_head_panel">

                                                <h2>Quick Customer Support</h2>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry lorem Ipsum has been the industrys standard dummy text ever since.</p>

                                                <div className="support_button">
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/user-support-email" id="email" >Email on your Question</Link>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to='/user/support-call' id="call" >Request a call</Link>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/chat">Chat</Link>
                                                </div>
                                            </div>
                                            {/* {(this.state.showFrmField === "email") ? */}
                                            {(showFrmField === "email") ?

                                                <div className="support_email_form_wrapper">
                                                    <div className="support_form-head">
                                                        <h4>Support request form</h4>
                                                    </div>
                                                    <div className="crt_bnr_fieldRow half_field">
                                                        <div className="crt_bnr_field">
                                                            <label for="">Your Name</label>
                                                            <div className="field_item">
                                                                <input className="form-control" type="text" name="" id="" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="crt_bnr_fieldRow half_field">
                                                        <div className="crt_bnr_field">
                                                            <label for="">Email Address</label>
                                                            <div className="field_item">
                                                                <input className="form-control" type="text" name="" id="" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label for="">Ask a question</label>
                                                            <div className="field_item">
                                                                <textarea className="form-control" name="" id="" cols="30" rows="10"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : null
                                            }

                                            {/* {(this.state.showFrmField === "call") ? */}
                                            {(showFrmField === "call") ?

                                                <div className="support_email_form_wrapper">
                                                    <div className="support_form-head">
                                                        <h4>Call on this number<br /><br />+492345674898</h4>
                                                    </div>

                                                </div>
                                                : null
                                            }
                                            <div className="support_faqs_panel">
                                                <div className="faq-head">
                                                    <h3>Here's a few answers to our most common questions.</h3>
                                                </div>
                                                <div className="faq_listing_panel">
                                                    <div className="accourdian-item">
                                                        <button className="faq-accordion">Donec faucibus justo ac dui pulvinar, vel aliquet nibh commodo?</button>
                                                        <div className="panel">
                                                            <div className="inner_panel">
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                                    nisi ut aliquip ex ea commodo consequat.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accourdian-item">
                                                        <button className="faq-accordion">Suspendisse eget arcu a lectus porttitor luctus?</button>
                                                        <div className="panel">
                                                            <div className="inner_panel">
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                                    nisi ut aliquip ex ea commodo consequat.</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="accourdian-item">
                                                        <button className="faq-accordion">Nam sit amet diam non enim convallis mollis?</button>
                                                        <div className="panel">
                                                            <div className="inner_panel">
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                                    nisi ut aliquip ex ea commodo consequat.</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="accourdian-item">
                                                        <button className="faq-accordion">Donec faucibus justo ac dui pulvinar, vel aliquet nibh commodo?</button>
                                                        <div className="panel">
                                                            <div className="inner_panel">
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                                    nisi ut aliquip ex ea commodo consequat.</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="accourdian-item">
                                                        <button className="faq-accordion">Suspendisse eget arcu a lectus porttitor luctus?</button>
                                                        <div className="panel">
                                                            <div className="inner_panel">
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                                    nisi ut aliquip ex ea commodo consequat.</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="accourdian-item">
                                                        <button className="faq-accordion">Nam sit amet diam non enim convallis mollis?</button>
                                                        <div className="panel">
                                                            <div className="inner_panel">
                                                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                                                    nisi ut aliquip ex ea commodo consequat.</p>
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
    )
}

export default SupportUser