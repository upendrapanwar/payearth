import React from 'react';
import { isLogin } from "../../helpers/login";
import Header from '../../components/seller/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import sellerContactSchema from '../../validation-schemas/sellerContactSchema'
import SpinnerLoader from '../../components/common/SpinnerLoader';
import arrow_back from '../../assets/icons/arrow-back.svg'



export const SupportSellerEmail = () => {

    const isLoged_In = isLogin();

    const [loading, setLoading] = React.useState(false);


    const handleSubmit = (values, { resetForm }) => {
        if (!isLoged_In) {
            toast.error("Please log in your account.", { autoClose: 3000 });
            return;
        }

        setLoading(true);
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        values['seller_id'] = authInfo.id;


        axios.post('/seller/support/send-email', values, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        })
            .then(response => {
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, { autoClose: 3000 });
                    resetForm();
                } else {
                    toast.error(response.data.message, { autoClose: 3000 });
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
                <PageTitle title="Support-Email" />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3">
                            <div className="dash_inner_wrap contact_form_page">
                                <div className="row">
                                    <div className="col-lg-12">

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


                                                <h4 className="form_title mb-4">Write us</h4>
                                                <Formik
                                                    initialValues={{
                                                        name: '',
                                                        email: '',
                                                        message: ''
                                                    }}
                                                    onSubmit={handleSubmit}
                                                    validationSchema={sellerContactSchema}
                                                >
                                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
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
                                                                        {touched.name && errors.name && (
                                                                            <small className="text-danger">{errors.name}</small>
                                                                        )}
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label htmlFor="email" className="form-label">Email <small className="text-danger">*</small></label>
                                                                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp"
                                                                            name="email"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.email}
                                                                        />
                                                                        {touched.email && errors.email && (
                                                                            <small className="text-danger">{errors.email}</small>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-6">
                                                                    <div className="mb-3">
                                                                        <label htmlFor="message" className="form-label">Message <small className="text-danger">*</small></label>
                                                                        <textarea className="form-control h-auto" rows="5"
                                                                            name="message"
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
