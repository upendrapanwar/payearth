import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { Link } from 'react-router-dom'
import invisibleIcon from '../../assets/icons/invisible-icon.svg';
import visibleIcon from '../../assets/icons/eye-icon.svg'
import axios from 'axios';
import adminRegistrationSchema from '../../validation-schemas/adminRegistrationSchema';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store';
import SpinnerLoader from './../../components/common/SpinnerLoader';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            seePassword: false,
            seeConfirmPassword: false
        }
        toast.configure();
    }

    handleSubmit = (values, { resetForm }) => {
        const { dispatch } = this.props;
        dispatch(setLoading({ loading: true }));
        axios.post('admin/signup', values).then(response => {
            toast.dismiss();
            if (response.data.status) {
                toast.success(response.data.message, { autoClose: 3000 });
                resetForm();
                this.props.history.push('/admin/login');
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
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

    render() {
        const { loading } = store.getState().global;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <div className="sel_reg_bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <Link to="/" className="navbar-brand py-0" ><img src={logo} alt="logo" className="img-fluid" /></Link>
                                    <div className="sel_register">
                                        <div className="form_wrapper">
                                            <h4 className="form_title mb-4">Admin register</h4>
                                            <Formik
                                                initialValues={{
                                                    name: '',
                                                    phone: '',
                                                    email: '',
                                                    password: '',

                                                }}
                                                onSubmit={(values, { resetForm }) => {
                                                    this.handleSubmit(values, { resetForm });
                                                }}
                                                validationSchema={adminRegistrationSchema}
                                            >
                                                {({ values,
                                                    errors,
                                                    touched,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    isValid
                                                }) => (
                                                    <form onSubmit={handleSubmit} className="seller_register">
                                                        <div className="row ">
                                                            <div className="col-md-6  ">
                                                                <div className="mb-3">
                                                                    <label htmlFor="name" className="form-label">Business Name <small className="text-danger">*</small></label>
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
                                                                    <label htmlFor="phone" className="form-label">Phone Number <small className="text-danger">*</small></label>
                                                                    <input type="phone" className="form-control" id="phone" aria-describedby="nameHelp"
                                                                        name="phone"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.phone}
                                                                    />
                                                                    {touched.phone && errors.phone ? (
                                                                        <small className="text-danger">{errors.phone}</small>
                                                                    ) : null}
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label htmlFor="email" className="form-label">Business Email ID <small className="text-danger">*</small></label>
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
                                                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase w-100 p-3" disabled={!isValid}>Register</button>
                                                                <div className="tog_user_form mt-3"><p>Already a customer ? <Link to="/admin/login" className="view_more text-capitalize">Login</Link></p></div>
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

export default connect(setLoading)(Register);
