import React, { Component } from 'react'
import Header from '../../components/admin/common/Header'
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import addCouponSchema from '../../validation-schemas/addCouponSchema';

class AddCupon extends Component {
    constructor(props) {
        super(props)
        this.authInfo = store.getState().auth.authInfo;
        toast.configure();
    }

    handleSubmit = (values, {resetForm}) => {
        const { dispatch } = this.props;
        dispatch(setLoading({loading: true}));
        axios.post('admin/coupons', values, {
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
        return (
            <React.Fragment>
                <div className="seller_body">
                    <Header />

                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <Formik
                                        initialValues={{
                                            coupon_code: '',
                                            start_date: '',
                                            end_date: '',
                                            discount_percentage: ''
                                        }}
                                        onSubmit={(values, {resetForm}) => {
                                            this.handleSubmit(values, {resetForm});
                                        }}
                                        validationSchema={addCouponSchema}
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
                                                    <div className="col-md-12 pt-4 pb-4">
                                                        <div className="dash_title">Add New Coupon</div>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="cupon" className="form-label">Coupon Code <small className="text-danger">*</small></label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="coupon_code"
                                                                value={values.coupon_code}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.coupon_code && errors.coupon_code ? (
                                                                <small className="text-danger">{errors.coupon_code}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="start_date" className="form-label">Start Date <small className="text-danger">*</small></label>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                name="start_date"
                                                                value={values.start_date}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.start_date && errors.start_date ? (
                                                                <small className="text-danger">{errors.start_date}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="end_date" className="form-label">End Date <small className="text-danger">*</small></label>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                name="end_date"
                                                                value={values.end_date}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.end_date && errors.end_date ? (
                                                                <small className="text-danger">{errors.end_date}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="discount" className="form-label">Discount Percentage <small className="text-danger">*</small></label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                name="discount_percentage"
                                                                value={values.discount_percentage}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.discount_percentage && errors.discount_percentage ? (
                                                                <small className="text-danger">{errors.discount_percentage}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 pt-4 mt-2">
                                                        <button type="submit" className="btn  custom_btn btn_yellow w-auto " disabled={!isValid}>Submit</button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
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

export default connect(setLoading)(AddCupon);