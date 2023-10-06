import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Formik } from 'formik';
import { toast } from 'react-toastify'
import forgotPwdSchema from '../../validation-schemas/forgotPwdSchema';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store';
import SpinnerLoader from './../../components/common/SpinnerLoader';

class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        toast.configure();
    }

    handleSubmit = (values, {resetForm}) => {
        const {dispatch} = this.props;
        dispatch(setLoading({loading: true}));
        axios.post('seller/forgot-password', values).then(response => {
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
        const {loading} = store.getState().global;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <div className="sel_reg_bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <Link className="navbar-brand py-0" to="/seller/login"><img src={logo} alt="logo" className="img-fluid" /></Link>
                                    <div className="sel_register">
                                        <div className="form_wrapper">
                                            <h4 className="form_title mb-4">Forgot Password <small className="d-block">Please enter your registered email address</small></h4>
                                            <Formik
                                                initialValues={{email: ''}}
                                                onSubmit={(values, {resetForm}) => {
                                                    this.handleSubmit(values, {resetForm});
                                                }}
                                                validationSchema={forgotPwdSchema}
                                            >
                                                {({
                                                    values,
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
                                                                    <label htmlFor="email" className="form-label">Email ID <small className="text-danger">*</small></label>
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
                                                            <div className="col-md-6 mt-4">
                                                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase w-100 p-3" disabled={!isValid}>Get verification link</button>
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
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(ForgotPassword);