import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import linkedinIcon from '../../assets/icons/linkedin.svg';
import twitterIcon from '../../assets/icons/twitter.svg';
import facebook from '../../assets/icons/facebook.svg';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import sellerContactSchema from '../../validation-schemas/sellerContactSchema'
import SpinnerLoader from '../../components/common/SpinnerLoader';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        toast.configure();
    }

    handleSubmit = (values, {resetForm}) => {
        values['seller_id'] = this.authInfo.id
        const {dispatch} = this.props;
        dispatch(setLoading({loading: true}));
        axios.post('seller/contact-us', values, {
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
            } else {
                toast.error(response.data.message, {autoClose: 3000});
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
        const {loading} = store.getState().global;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3">
                                <div className="dash_inner_wrap contact_form_page">
                                    <div className="row">
                                        <div className="col-lg-4 pt-5 pb-5">
                                            <div className="contact_info">
                                                <div className="dash_title">Quick Contact</div>
                                                <ul className="cont_info">
                                                    <li>
                                                        <small>Support</small>
                                                        <h6>Support@pay.earth.com</h6>
                                                    </li>
                                                    <li>
                                                        <small>Call Us</small>
                                                        <h6>9968-006-0950</h6>
                                                    </li>
                                                    <li>
                                                        <div className="social_links">
                                                            <Link to="#" target="_blank" className="d-inline-block me-2"><img src={linkedinIcon} alt="linked-in" /></Link>
                                                            <Link to="#" target="_blank" className="d-inline-block me-2"><img src={twitterIcon} alt="twitter" /></Link>
                                                            <Link to="#" target="_blank"><img src={facebook} alt="facebook" /></Link>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="contact_form_wrap">
                                                <div className="form_wrapper">
                                                    <h4 className="form_title mb-4">Write us</h4>
                                                    <Formik
                                                        initialValues={{
                                                            name: '',
                                                            email: '',
                                                            message: ''
                                                        }}
                                                        onSubmit={(values, { resetForm }) => {
                                                            this.handleSubmit(values, { resetForm });
                                                        }}
                                                        validationSchema={sellerContactSchema}
                                                    >
                                                        {({ values,
                                                            errors,
                                                            touched,
                                                            handleChange,
                                                            handleBlur,
                                                            handleSubmit,
                                                            isValid,
                                                        }) => (
                                                            <form onSubmit={handleSubmit}>
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <label htmlFor="name" className="form-label">Name <small className="text-danger">*</small></label>
                                                                            <input type="text" className="form-control" id="name" aria-describedby="nameHelp"
                                                                                name="name"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.name}
                                                                            />
                                                                            {touched.name && errors.name ? (
                                                                                <small className="text-danger">{errors.name}</small>
                                                                            ) : null}
                                                                        </div>
                                                                        <div className="mb-3">
                                                                            <label htmlFor="email" className="form-label">Email <small className="text-danger">*</small></label>
                                                                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp"
                                                                                name="email"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.email}
                                                                            />
                                                                            {touched.email && errors.email ? (
                                                                                <small className="text-danger">{errors.email}</small>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>

                                                                    <div className="col-md-6">
                                                                        <div className="mb-3">
                                                                            <label htmlFor="Message" className="form-label">Message <small className="text-danger">*</small></label>
                                                                            <textarea className="form-control h-auto" rows="5"
                                                                                name="message"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.message}
                                                                            >
                                                                            </textarea>
                                                                            {touched.message && errors.message ? (
                                                                                <small className="text-danger">{errors.message}</small>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-12 mt-4">
                                                                        <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!isValid}>Submit</button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        )}
                                                    </Formik>
                                                </div>
                                            </div>
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

export default connect(setLoading)(Contact);