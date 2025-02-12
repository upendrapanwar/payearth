import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import invisibleIcon from '../../assets/icons/invisible-icon.svg';
import visibleIcon from '../../assets/icons/eye-icon.svg';
import axios from 'axios';
import adminSellerRegistrationSchema from '../../validation-schemas/adminSellerRegistrationSchema';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import Select from 'react-select';
import Header from '../../components/admin/common/Header';

class VandorRegister extends Component {
  constructor(props) {
    super(props);
    const  {dispatch}  = props;
    this.dispatch = dispatch;
    this.state = {
      authInfo: [],
      seePassword: false,
      seeConfirmPassword: false,
      reqBody: { country_code: '' },
      countryOptions: [],
      defaultCountryOptions: { label: 'Choose Country', value: '' },
      stateOptions: [],
      defaultStateOptions: { label: 'Choose State', value: '' },
      vendorId: null,
      vendoreData: {},
    };
    toast.configure();
  }

  componentDidMount() {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    this.setState({ authInfo: authInfo || [] });
    console.log('authInfo', authInfo);

    const searchParams = new URLSearchParams(this.props.location.search);
    const vendorId = searchParams.get('vendorId');
    this.setState({ vendorId });

    this.getCounryName();
    if (vendorId) {
      this.getVandoreData(vendorId, authInfo);
    }
  }

  getCounryName = () => {
    this.props.dispatch(setLoading({ loading: true }))
    axios.get(`seller/countries`)
      .then(response => {
        if (response.data.status) {
          let countryOptions = [];
          response.data.data.forEach(value => {
            countryOptions.push({ label: value.country, value: value.code });
          });
          this.setState({ countryOptions });
        }
      })
      .catch(error => {
        if (error.response && error.response.data.status === false) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.dispatch(setLoading({ loading: false }));
        }, 300);
      });
  };

  getStates = countryCode => {
    let reqBody = { ...this.state.reqBody, country_code: countryCode };
    this.setState({ reqBody });
    this.dispatch(setLoading({ loading: true }));
    axios.post(`seller/states`, reqBody)
      .then(response => {
        if (response.data.status) {
          let stateOptions = [];
          response.data.data.forEach(value => {
            stateOptions.push({ label: value, value: value });
          });
          this.setState({ stateOptions });
        }
      })
      .catch(error => {
        if (error.response && error.response.data.status === false) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.dispatch(setLoading({ loading: false }));
        }, 300);
      });
  };

  handleConuntry = selectedOption => {
    let reqBody = { ...this.state.reqBody, country_code: selectedOption.value };
    this.setState({
      defaultCountryOptions: selectedOption,
      defaultStateOptions: { label: 'Choose State', value: '' },
      reqBody
    });
    this.getStates(selectedOption.value);
  };

  getVandoreData = (vendorId, authInfo) => {
    console.log("vendorId", vendorId);
    this.dispatch(setLoading({ loading: true }));
    axios.get(`admin/get-VendorData-ById/${vendorId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${authInfo.token}`,
      }
    })
      .then(response => {
        console.log("getVendorData response", response);
        toast.dismiss();
        if (response.data.status) {
          const data = response.data.data;
          toast.success(response.data.message, { autoClose: 3000 });
          this.setState({ vendoreData: data }, () => {
            if (data.full_address && data.full_address.country) {
              this.getStates(data.full_address.country);
            }
          });
        }
      })
      .catch(error => {
        console.log("error", error);
        toast.dismiss();
        if (error.response) {
          console.log("error response", error.response.data.message);
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.dispatch(setLoading({ loading: false }));
        }, 300);
      });
  };

  handlePassword = () => {
    this.setState(prevState => ({ seePassword: !prevState.seePassword }));
  };

  handleConfirmPassword = () => {
    this.setState(prevState => ({ seeConfirmPassword: !prevState.seeConfirmPassword }));
  };

  handleClose = () => {
    this.props.history.push('/admin/manage-vendors');
  };

  handleSubmit = (values, { resetForm }, authInfo, vendorId) => {
    console.log("Registration vendorId", vendorId);
    if (vendorId === null) {
      console.log("Registration values", values);
      const { id, ...valuesData } = values; 
      this.dispatch(setLoading({ loading: true }));
      axios.post('seller/signup', valuesData)
        .then(response => {
          console.log("response", response);
          toast.dismiss();
          if (response.data.status) {
            toast.success(response.data.message, { autoClose: 3000 });
            resetForm();
            this.props.history.push('/admin/manage-vendors');
          }
        })
        .catch(error => {
          console.log("error", error);
          toast.dismiss();
          if (error.response) {
            console.log("error response", error.response.data.message);
            toast.error(error.response.data.message, { autoClose: 3000 });
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.dispatch(setLoading({ loading: false }));
          }, 300);
        });
    } else {
      // Update mode
      console.log('Update mode, authInfo:', authInfo);
      this.dispatch(setLoading({ loading: true }));
      axios.put('admin/vendore-update', values, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`,
        }
      })
        .then(response => {
          console.log("response", response);
          toast.dismiss();
          if (response.data.status) {
            toast.success(response.data.message, { autoClose: 3000 });
            resetForm();
            this.props.history.push('/admin/manage-vendors');
          }
        })
        .catch(error => {
          console.log("error", error);
          toast.dismiss();
          if (error.response) {
            console.log("error response", error.response.data.message);
            toast.error(error.response.data.message, { autoClose: 3000 });
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.dispatch(setLoading({ loading: false }));
          }, 300);
        });
    }
  };

  render() {
    const { loading } = store.getState().global;
    const { countryOptions, stateOptions, vendorId, vendoreData, authInfo } = this.state;
    console.log('authInfo----', authInfo);

    return (
      <React.Fragment>
        {loading === true && <SpinnerLoader />}
        <div className="seller_body">
        <Header />
          <div className="sel_reg_bg">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  {/* <Link to="/" className="navbar-brand py-0">
                    <img src={logo} alt="logo" className="img-fluid" />
                  </Link> */}
                  <div className="sel_register mt-5">
                    <div className="form_wrapper">
                      <button
                        onClick={this.handleClose}
                        type="button"
                        className="btn-close mo_btn"
                        style={{ float: "right" }}
                        aria-label="Close"
                      ></button>
                      <h4 className="form_title mb-4">Seller Register</h4>
                      <Formik
                        initialValues={{
                          id: vendoreData._id || '',
                          name: vendoreData.name || '',
                          email: vendoreData.email || '',
                          password: '',
                          password_confirmation: '',
                          seller_type: vendoreData.seller_type || '',
                          want_to_sell: vendoreData.want_to_sell || '',
                          address: vendoreData.full_address?.address || '',
                          country: vendoreData.full_address?.country || '',
                          state: vendoreData.full_address?.state || ''
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { resetForm }) => {
                          this.handleSubmit(values, { resetForm }, authInfo, vendorId);
                        }}
                        validationSchema={adminSellerRegistrationSchema}
                        context={{ isRegister: vendorId === null }}
                      >
                        {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isValid,
                          setFieldValue,
                        }) => (
                          <form onSubmit={handleSubmit} className="seller_register">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">
                                    Business Name <small className="text-danger">*</small>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="name"
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
                                  <label htmlFor="email" className="form-label">
                                    Business Email ID <small className="text-danger">*</small>
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                  />
                                  {touched.email && errors.email && (
                                    <small className="text-danger">{errors.email}</small>
                                  )}
                                </div>
                                <>
                                  <div className="pwd_wrapper mb-3">
                                    <label htmlFor="password" className="form-label">
                                      Password <small className="text-danger">*</small>
                                    </label>
                                    {this.state.seePassword ? (
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        disabled={vendorId !== null}
                                      />
                                    ) : (
                                      <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        disabled={vendorId !== null}
                                      />
                                    )}
                                    {vendorId !== null ? (
                                      <img src={invisibleIcon} alt="invisible" />
                                    ) : (
                                      this.state.seePassword ? (
                                        <img
                                          src={visibleIcon}
                                          alt="visible"
                                          onClick={this.handlePassword}
                                          style={{ cursor: "pointer" }}
                                        />
                                      ) : (
                                        <img
                                          src={invisibleIcon}
                                          alt="invisible"
                                          onClick={this.handlePassword}
                                          style={{ cursor: "pointer" }}
                                        />
                                      )
                                    )}
                                    {touched.password && errors.password && (
                                      <small className="text-danger">{errors.password}</small>
                                    )}
                                  </div>
                                  <div className="pwd_wrapper mb-3">
                                    <label htmlFor="c_password" className="form-label">
                                      Confirm Password <small className="text-danger">*</small>
                                    </label>
                                    {this.state.seeConfirmPassword ? (
                                      <input
                                        type="text"
                                        className="form-control"
                                        id="c_password"
                                        name="password_confirmation"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password_confirmation}
                                        disabled={vendorId !== null}
                                      />
                                    ) : (
                                      <input
                                        type="password"
                                        className="form-control"
                                        id="c_password"
                                        name="password_confirmation"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password_confirmation}
                                        disabled={vendorId !== null}
                                      />
                                    )}
                                    {vendorId !== null ? (
                                      <img src={invisibleIcon} alt="invisible" />
                                    ) : (
                                      this.state.seeConfirmPassword ? (
                                        <img
                                          src={visibleIcon}
                                          alt="visible"
                                          onClick={this.handleConfirmPassword}
                                          style={{ cursor: "pointer" }}
                                        />
                                      ) : (
                                        <img
                                          src={invisibleIcon}
                                          alt="invisible"
                                          onClick={this.handleConfirmPassword}
                                          style={{ cursor: "pointer" }}
                                        />
                                      )
                                    )}
                                    {touched.password_confirmation && errors.password_confirmation && (
                                      <small className="text-danger">{errors.password_confirmation}</small>
                                    )}
                                  </div>
                                </>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <div className="row">
                                    <div className="col">
                                      <label className="form-label">
                                        Select Country <small className="text-danger">*</small>
                                      </label>
                                      <Select
                                        name="country"
                                        id="country"
                                        className="text-normal text-start"
                                        options={countryOptions}
                                        value={
                                          countryOptions.find(option => option.value === values.country) || null
                                        }
                                        onChange={selectedOption => {
                                          setFieldValue("country", selectedOption.value);
                                          this.handleConuntry(selectedOption);
                                        }}
                                      />
                                      {touched.country && errors.country && (
                                        <small className="text-danger">{errors.country}</small>
                                      )}
                                    </div>
                                    <div className="col">
                                      <label className="form-label">
                                        Select State <small className="text-danger">*</small>
                                      </label>
                                      <Select
                                        name="state"
                                        id="state"
                                        className="text-normal text-start"
                                        options={stateOptions}
                                        placeholder="Choose State"
                                        value={
                                          stateOptions.find(option => option.value === values.state) || null
                                        }
                                        onChange={selectedOption => {
                                          console.log('State onChange:', selectedOption);
                                          setFieldValue("state", selectedOption.value);
                                          this.setState({ defaultStateOptions: selectedOption });
                                        }}
                                      />
                                      {touched.state && errors.state && (
                                        <small className="text-danger">{errors.state}</small>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="address" className="form-label">
                                    Complete Address <small className="text-danger">*</small>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                  />
                                  {touched.address && errors.address && (
                                    <small className="text-danger">{errors.address}</small>
                                  )}
                                </div>
                                <div className="mb-3">
                                  <div className="row">
                                    <div className="col">
                                      <label className="form-label">
                                        Type of Seller <small className="text-danger">*</small>
                                      </label>
                                      <select
                                        className="form-select"
                                        name="seller_type"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.seller_type}
                                      >
                                        <option value="">Please select</option>
                                        <option value="wholesaler">wholesaler</option>
                                        <option value="retailer">retailer</option>
                                      </select>
                                      {touched.seller_type && errors.seller_type && (
                                        <small className="text-danger">{errors.seller_type}</small>
                                      )}
                                    </div>
                                    <div className="col">
                                      <label className="form-label">
                                        Want to Sell <small className="text-danger">*</small>
                                      </label>
                                      <select
                                        className="form-select"
                                        name="want_to_sell"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.want_to_sell}
                                      >
                                        <option value="">Please select</option>
                                        <option value="wholesaler">wholesaler</option>
                                        <option value="retailer">retailer</option>
                                      </select>
                                      {touched.want_to_sell && errors.want_to_sell && (
                                        <small className="text-danger">{errors.want_to_sell}</small>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 mt-4">
                                {vendorId === null ? (
                                  <button
                                    type="submit"
                                    className="btn custom_btn btn_yellow text-uppercase w-100 p-3"
                                    disabled={!isValid}
                                  >
                                    Register
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    className="btn custom_btn btn_yellow text-uppercase w-100 p-3"
                                    disabled={!isValid}
                                  >
                                    Update
                                  </button>
                                )}
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
    );
  }
}

export default connect(setLoading)(VandorRegister);
