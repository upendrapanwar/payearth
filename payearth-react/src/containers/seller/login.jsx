import React, { Component } from 'react'
import logo from '../../assets/images/logo.png'
import { Link  } from 'react-router-dom'
import invisibleIcon from '../../assets/icons/invisible-icon.svg';
import visibleIcon from '../../assets/icons/eye-icon.svg';
import { setLoginStatus, setAuthInfo, setUserInfo } from '../../store/reducers/auth-reducer';
import axios from 'axios';
import sellerLoginSchema from '../../validation-schemas/userLoginSchema'
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import GLogin from '../../components/common/login/GLogin';
import FBLogin from '../../components/common/login/FBLogin';
import buyerLogin from '../../assets/images/buyer-login.jpg';

class Login extends Component {
    constructor(props) {
        super(props);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            seePassword: false,
        }
        toast.configure();
    }

    handleSubmit = values => {
        const { dispatch } = this.props;
        dispatch(setLoading({ loading: true }));
        axios.post('seller/login', values).then(response => {
            toast.dismiss();
            if (response.data.status) {
                toast.success(response.data.message, { autoClose: 3000 });

                let authInfo = {
                    expTime: response.data.data.expTime,
                    id: response.data.data['_id'],
                    token: response.data.data.token
                };
                let userInfo = {
                    name: response.data.data.name,
                    email: response.data.data.email,
                    seller_type: response.data.data.seller_type,
                    role: response.data.data.role,
                    community: response.data.data.community,
                    imgUrl: response.data.data.image_url
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                localStorage.setItem('authInfo', JSON.stringify(authInfo));
                localStorage.setItem('isLoggedIn', 1);
                dispatch(setLoginStatus({ isLoggedIn: true }));
                dispatch(setAuthInfo({ authInfo }));
                dispatch(setUserInfo({ userInfo }));
                this.props.history.push('/seller/dashboard');
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
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    handlePassword = () => {
        let flag = this.state.seePassword ? false : true;
        this.setState({ seePassword: flag });
    }
    handleClose = () => {
        this.props.history.push('/');
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
                                    <Link to="/" className="navbar-brand py-0"><img src={logo} alt="logo" className="img-fluid" /></Link>
                                    <div className="sel_register">
                                        <div className="form_wrapper">
                                            <button onClick={this.handleClose} type="button" className="btn-close mo_btn" style={{float:"right"}} aria-label="Close"></button>
                                            <h4 className="form_title mb-4">Seller Login</h4>
                                            <Formik
                                                initialValues={{
                                                    email: '',
                                                    password: ''
                                                }}
                                                onSubmit={(values) => {
                                                    this.handleSubmit(values);
                                                }}
                                                validationSchema={sellerLoginSchema}
                                            >
                                                {({ values,
                                                    errors,
                                                    touched,
                                                    handleChange,
                                                    handleBlur,
                                                    handleSubmit,
                                                    isValid,
                                                }) => (
                                                    <form onSubmit={handleSubmit} className="seller_login">
                                                        <div className="row">
                                                            <div className="col-md-6">
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
                                                                    <div className="mt-2 text-end"><Link to="/seller/forgot-password">Forgot Password?</Link></div>
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6 mt-4">
                                                                <div className="form_social_links">
                                                                    <div className="social_box flex-column">
                                                                        <p><span>Or</span> Login with</p>
                                                                        <div className="mt-3">
                                                                            <GLogin closeModal={this.props.onClick} role="seller" />
                                                                            <FBLogin closeModal={this.props.onClick} role="seller" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mt-4">
                                                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase w-100 p-3" disabled={!isValid}>Login</button>
                                                                <div className="tog_user_form mt-3"><p>Not a registered vendor ? <Link to="/seller/register" className="view_more text-capitalize">Signup</Link></p></div>
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

export default connect(setLoading)(Login);