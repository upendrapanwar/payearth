import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import invisibleIcon from '../../assets/icons/invisible-icon.svg';
import visibleIcon from '../../assets/icons/eye-icon.svg'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { Formik } from 'formik';
import { toast } from 'react-toastify'
import changePwdSchema from '../../validation-schemas/changePwdSchema';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store';
import SpinnerLoader from '../../components/common/SpinnerLoader';

class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            seePassword: false,
            seeConfirmPassword: false,
        }
        toast.configure();
    }

    handleSubmit = (values,{ resetForm }) => {
        const { dispatch } = this.props;
        const currentUrl = window.location.search;
        var userId = null;
        var hash = null;

        if (currentUrl !== '' && currentUrl !== null) {
            if (/u=([^&]+)/.exec(currentUrl)[1] !== null) {
                userId = /u=([^&]+)/.exec(currentUrl)[1];
            }
            if (/hash=([^&]+)/.exec(currentUrl)[1] !== null) {
                hash = /hash=([^&]+)/.exec(currentUrl)[1];
            }
        }

        values['id'] = userId;
        values['code'] = hash;

        if (values['id'] === null) {
            this.props.history.push('/admin/forgot-password');
        }

        if (values['code'] === null) {
            this.props.history.push('/admin/forgot-password');
        }

        dispatch(setLoading({loading: true}));
        axios.put('admin/reset-password', values).then(response => {
            if (response.data.status) {
                toast.success(response.data.message, {autoClose: 3000});
                this.props.history.push('/admin/login');
                resetForm();
            } else {
                toast.error(response.data.message, { autoClose: 3000 });
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handlePassword = () => {
        if (this.state.seePassword) {
            this.setState({ seePassword: false });
        } else {
            this.setState({ seePassword: true });
        }
    }

    handleConfirmPassword = () => {
        if (this.state.seeConfirmPassword) {
            this.setState({ seeConfirmPassword: false });
        } else {
            this.setState({ seeConfirmPassword: true });
        }
    }

    render() {
        const { loading } = store.getState().global;

        return (
            <React.Fragment>
                { loading === true ? <SpinnerLoader /> : '' }
                <div className="seller_body">
                    <div className="sel_reg_bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <Link to="/" className="navbar-brand py-0" ><img src={logo} alt="logo" className="img-fluid" /></Link>
                                    <div className="sel_register">
                                        <div className="form_wrapper">
                                            <h4 className="form_title mb-4">Reset Password</h4>
                                            <Formik
                                                initialValues={{
                                                    password: '',
                                                    password_confirmation: ''
                                                }}
                                                onSubmit={(values, { resetForm }) => {
                                                    this.handleSubmit(values,{ resetForm });
                                                }}
                                                validationSchema={changePwdSchema}
                                            >
                                                {({ values,
                                                    errors,
                                                    touched,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    isValid, }) => (
                                                    <form onSubmit={handleSubmit} className="seller_change_pwd">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="pwd_wrapper sel_pwd mb-3">
                                                                    <label htmlFor="password" className="form-label">Password <small className="text-danger">*</small></label>
                                                                    {this.state.seePassword ?
                                                                        <input type="text" className="form-control" id="password"
                                                                            name="password"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.password}
                                                                        /> :
                                                                        <input type="password" className="form-control" id="password"
                                                                            name="password"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.password}
                                                                        />
                                                                    }
                                                                    {this.state.seePassword ?
                                                                        <img src={visibleIcon} alt="visible" onClick={this.handlePassword} /> :
                                                                        <img src={invisibleIcon} alt="invisible" onClick={this.handlePassword} />
                                                                    }
                                                                    {touched.password && errors.password ? (
                                                                        <small className="text-danger">{errors.password}</small>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="pwd_wrapper sel_pwd mb-3">
                                                                    <label htmlFor="password" className="form-label">Confirm Password <small className="text-danger">*</small></label>
                                                                    {this.state.seeConfirmPassword ?
                                                                        <input type="text" className="form-control" id="c_password"
                                                                            name="password_confirmation"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.password_confirmation}
                                                                        /> :
                                                                        <input type="password" className="form-control" id="c_password"
                                                                            name="password_confirmation"
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            value={values.password_confirmation}
                                                                        />
                                                                    }
                                                                    {this.state.seeConfirmPassword ?
                                                                        <img src={visibleIcon} alt="visible" onClick={this.handleConfirmPassword} /> :
                                                                        <img src={invisibleIcon} alt="invisible" onClick={this.handleConfirmPassword} />
                                                                    }
                                                                    {touched.password_confirmation && errors.password_confirmation ? (
                                                                        <small className="text-danger">{errors.password_confirmation}</small>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mt-4">
                                                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase w-100 p-3" disabled={!isValid}>Save & login</button>
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

export default connect(setLoading) (ResetPassword);
