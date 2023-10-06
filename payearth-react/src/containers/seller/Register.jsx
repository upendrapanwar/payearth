import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import invisibleIcon from '../../assets/icons/invisible-icon.svg';
import visibleIcon from '../../assets/icons/eye-icon.svg';
import axios from 'axios';
import sellerRegistrationSchema from '../../validation-schemas/sellerRegistrationSchema';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import GLogin from '../../components/common/login/GLogin';
import FBLogin from '../../components/common/login/FBLogin';
import Select from 'react-select';

class Register extends Component {
    constructor(props) {
        super(props)
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.state = {
            seePassword: false,
            seeConfirmPassword: false,
            reqBody: {country_code:''},
            countryOptions: [],
            defaultCountryOptions: { label: 'Choose Country', value: '' },
            stateOptions: [],
            defaultStateOptions: { label: 'Choose State', value: '' }
        }
        toast.configure();
    }

    componentDidMount() {
        this.getCounryName();
    }

    getCounryName = () => {
        this.dispatch(setLoading({loading: true}));
        axios.get(`seller/countries`).then(response => {
            if (response.data.status) {
                let countryOptions = [];
                response.data.data.forEach(value => {
                    countryOptions.push({label: value.country, value: value.code})
                });
                this.setState({countryOptions});
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    getStates = param => {
        let reqBody = {...this.state.reqBody}
        reqBody['country_code'] = param;
        this.setState({reqBody});
        this.dispatch(setLoading({loading: true}));
        axios.post(`seller/states`, reqBody).then(response => {
            if (response.data.status) {
                let stateOptions = [];
                response.data.data.forEach(value => {
                    stateOptions.push({label: value, value:value})
                });
                this.setState({stateOptions});
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handleSubmit = (values, {resetForm}) => {
        this.dispatch(setLoading({loading: true}));
        axios.post('seller/signup', values).then(response => {
            toast.dismiss();
            if (response.data.status) {
                toast.success(response.data.message, {autoClose: 3000});
                resetForm();
                this.props.history.push('/seller/login');
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, {autoClose: 3000});
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handlePassword = () => {
        let flag = this.state.seePassword ? false : true;
        this.setState({seePassword: flag});
    }

    handleConfirmPassword = () => {
        let flag = this.state.seeConfirmPassword ? false : true;
        this.setState({seeConfirmPassword: flag});
    }

    handleConuntry = selectedOption => {
        let reqBody = {...this.state.reqBody};
        reqBody['country_code'] = selectedOption.value;
        this.setState({
            defaultCountryOptions: selectedOption,
            defaultStateOptions: {label: 'Choose State', value: ''},
            reqBody
        });
        this.getStates(reqBody.country_code);
    }

    render() {
        const {loading} = store.getState().global;
        const {
            countryOptions,
            defaultCountryOptions,
            stateOptions,
            defaultStateOptions
        } = this.state;

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
                                            <h4 className="form_title mb-4">Seller register</h4>
                                            <Formik
                                                initialValues={{
                                                    name: '',
                                                    email: '',
                                                    password: '',
                                                    password_confirmation: '',
                                                    seller_type: '',
                                                    want_to_sell: '',
                                                    address: '',
                                                    country: '',
                                                    state: ''
                                                }}
                                                onSubmit={(values, {resetForm}) => {
                                                    this.handleSubmit(values, {resetForm});
                                                }}
                                                validationSchema={sellerRegistrationSchema}
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
                                                        <div className="row">
                                                            <div className="col-md-6">
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
                                                                <div className="pwd_wrapper mb-3">
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
                                                                <div className="pwd_wrapper mb-3">
                                                                    <label htmlFor="c_password" className="form-label">Confirm Password <small className="text-danger">*</small></label>
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
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <label htmlFor="" className="form-label">Select Country <small className="text-danger">*</small></label>
                                                                            <Select
                                                                                name="country"
                                                                                id="country"
                                                                                className="text-normal text-start"
                                                                                options={countryOptions}
                                                                                value={defaultCountryOptions}
                                                                                onChange={selectedOption => {
                                                                                    values.country = selectedOption.value;
                                                                                    this.handleConuntry(selectedOption);
                                                                                }}
                                                                            />
                                                                            {touched.country && errors.country ? (
                                                                                <small className="text-danger">{errors.country}</small>
                                                                            ) : null}
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className="form-label">Select State <small className="text-danger">*</small></label>
                                                                            <Select
                                                                                name="state"
                                                                                id="state"
                                                                                className="text-normal text-start"
                                                                                options={stateOptions}
                                                                                value={defaultStateOptions}
                                                                                onChange={selectedOption => {
                                                                                    values.state = selectedOption.value;
                                                                                    this.setState({defaultStateOptions: selectedOption});
                                                                                }}
                                                                            />
                                                                            {touched.state && errors.state ? (
                                                                                <small className="text-danger">{errors.state}</small>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <label htmlFor="address" className="form-label">Complete Address <small className="text-danger">*</small></label>
                                                                    <input type="text" className="form-control" id="address" aria-describedby="emailHelp"
                                                                        name="address"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.address}
                                                                    />
                                                                    {touched.address && errors.address ? (
                                                                        <small className="text-danger">{errors.address}</small>
                                                                    ) : null}
                                                                </div>
                                                                <div className="mb-3">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <label htmlFor="" className="form-label">Type of Seller <small className="text-danger">*</small></label>
                                                                            <select className="form-select" aria-label="Default select example"
                                                                                name="seller_type"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.seller_type}
                                                                            >
                                                                                <option value="">Please select</option>
                                                                                <option value="wholesaler">wholeseller</option>
                                                                                <option value="retailer">retailer</option>
                                                                            </select>
                                                                            {touched.seller_type && errors.seller_type ? (
                                                                                <small className="text-danger">{errors.seller_type}</small>
                                                                            ) : null}
                                                                        </div>
                                                                        <div className="col">
                                                                            <label htmlFor="" className="form-label">Want to Sell <small className="text-danger">*</small></label>
                                                                            <select className="form-select" aria-label="Default select example"
                                                                                name="want_to_sell"
                                                                                onChange={handleChange}
                                                                                onBlur={handleBlur}
                                                                                value={values.want_to_sell}
                                                                            >
                                                                                <option value="">Please select</option>
                                                                                <option value="wholesaler">wholeseller</option>
                                                                                <option value="retailer">retailer</option>
                                                                            </select>
                                                                            {touched.want_to_sell && errors.want_to_sell ? (
                                                                                <small className="text-danger">{errors.want_to_sell}</small>
                                                                            ) : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 mt-4">
                                                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase w-100 p-3" disabled={!isValid}>Register</button>
                                                                <div className="tog_user_form mt-3"><p>Already a customer ? <Link to="/seller/login" className="view_more text-capitalize">Login</Link></p></div>
                                                            </div>
                                                            <div className="col-md-6 mt-4">
                                                                <div className="form_social_links">
                                                                    <div className="social_box">
                                                                        <p><span>Or</span> Fetch some information from</p>
                                                                        <div>
                                                                            <GLogin closeModal={this.props.onClick} role="seller" />
                                                                            <FBLogin closeModal={this.props.onClick} role="seller" />
                                                                        </div>
                                                                    </div>
                                                                </div>
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