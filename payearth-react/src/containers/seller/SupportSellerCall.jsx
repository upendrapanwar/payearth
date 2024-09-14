import React from 'react';
import { isLogin } from "../../helpers/login";
import Header from './../../components/seller/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SupportCallSchema from '../../validation-schemas/supportCallSchemas';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import arrow_back from '../../assets/icons/arrow-back.svg'

export const SupportSellerCall = () => {


    const isLoged_In = isLogin();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (values, { resetForm }) => {
        if (!isLoged_In) {
            toast.error("Please log in to your account.", { autoClose: 3000 });
            return;
        }

        setLoading(true);
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        values['user_id'] = null;
        values['seller_id'] = authInfo.id;
        values['call_status'] = "pending";


        axios.post('/seller/support/request-call', values, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        })
            .then(response => {
                console.log("support response", response)
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, { autoClose: 3000 });
                    resetForm();
                } else {
                    toast.error(response.data.message, { autoClose: 3000 });
                    resetForm();
                }
            })
            .catch(error => {
                toast.dismiss();
                if (error.response) {
                    toast.error(error.response.data.message, { autoClose: 3000 });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <div className="seller_body">
                <Header />
                <PageTitle title="Support call" />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container">
                        <div className="bg-white rounded-3">
                            <div className="dash_inner_wrap contact_form_page">
                                <div className="row">
                                    <div className="col-lg-4 pt-5 pb-5 d-flex justify-content-center align-items-center">
                                        <div className="contact_info text-center">
                                            <ul className="cont">
                                                <li>
                                                    <h1 style={{ color: '#3795BD' }}>1800-006-0950</h1>
                                                    <h6 style={{ color: '#758694' }}>Make a call, get insured</h6>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="contact_form_wrap">
                                            <div className="noti_wrap">
                                                <div className='d-flex justify-content-end'><span>
                                                    <Link className="btn custom_btn btn_yellow mx-auto mt-2" to="/seller/support">
                                                        <img src={arrow_back} alt="linked-in" />&nbsp;
                                                        Back
                                                    </Link>
                                                </span></div>
                                            </div>
                                            <div className="form_wrapper">
                                                <h4 className="form_title mb-4" style={{ color: '#3795BD' }}>Request for Call Back</h4>
                                                <Formik
                                                    initialValues={{
                                                        name: '',
                                                        email: '',
                                                        phone: '',
                                                        message: ''
                                                    }}
                                                    onSubmit={handleSubmit}
                                                    validationSchema={SupportCallSchema}
                                                >
                                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="name" className="form-label">Name <small className="text-danger">*</small></label>
                                                                        <input type="text" className="form-control" id="name" name="name"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.name}
                                                                        />
                                                                        {touched.name && errors.name && (
                                                                            <small className="text-danger">{errors.name}</small>
                                                                        )}
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label htmlFor="email" className="form-label">Email <small className="text-danger">*</small></label>
                                                                        <input type="email" className="form-control" id="email" name="email"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.email}
                                                                        />
                                                                        {touched.email && errors.email && (
                                                                            <small className="text-danger">{errors.email}</small>
                                                                        )}
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label htmlFor="phone" className="form-label">Contact Number <small className="text-danger">*</small></label>
                                                                        <input type="text" className="form-control" id="phone" name="phone"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.phone}
                                                                        />
                                                                        {touched.Phone && errors.phone && (
                                                                            <small className="text-danger">{errors.phone}</small>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="message" className="form-label">Message <small className="text-danger">*</small></label>
                                                                        <textarea className="form-control h-auto" rows="5" id="message" name="message"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.message}
                                                                        />
                                                                        {touched.message && errors.message && (
                                                                            <small className="text-danger">{errors.message}</small>
                                                                        )}
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
