import React, { useEffect, useState } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import addCouponSchema from '../../validation-schemas/addCouponSchema';
import arrow_back from '../../assets/icons/arrow-back.svg';
import { Link, useLocation } from 'react-router-dom';
import SpinnerLoader from '../../components/common/SpinnerLoader';

const EditCoupon = () => {
    const location = useLocation();
    const { id } = location.state || {};
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));

    const [loading, setLoading] = useState(true);  
    const [couponData, setCouponData] = useState(null);  

    useEffect(() => {
        if (id) {
            getCoupons(id);
        }
    }, [id]);

    const getCoupons = async (id) => {
        try {
            const res = await axios.get(`admin/get-coupons/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (res.data.status === true) {
                setCouponData(res.data.data.data);  
                console.log("Fetched coupon data", res.data.data.data);
            }

        } catch (error) {
            toast.error('Failed to fetch coupons');
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);  
        }
    };

    const handleSubmit = async (values, { resetForm }) => {
        console.log("Values to update", values);
        try {
            const res = await axios.put(`admin/edit-coupons/${id}`, values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (res.data.status === true) {
                toast.success('Coupon updated successfully');
                console.log("Coupon updated", res);
            }

        } catch (error) {
            toast.error('Failed to update coupon');
            console.error("Error updating coupon:", error);
        }
    };

    if (loading) return <SpinnerLoader />; 

    return (
        <>
            <div className="seller_body">
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center mb-4">
                                    <div className="dash_title">Edit Coupon</div>
                                    <span className="d-flex justify-content-between align-items-center">
                                        <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/coupons">
                                            <img src={arrow_back} alt="back" />&nbsp;Back
                                        </Link>
                                    </span>
                                </div>

                                <Formik
                                    initialValues={{
                                        coupon_code: couponData?.code || '',  
                                        start_date: couponData?.start ? couponData.start.split('T')[0] : '',
                                        end_date: couponData?.end ? couponData.end.split('T')[0] : '',
                                        discount_percentage: couponData?.discount_per || '',
                                    }}
                                    enableReinitialize={true}  
                                    onSubmit={handleSubmit}
                                    validationSchema={addCouponSchema}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isValid
                                    }) => (
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <label htmlFor="coupon_code" className="form-label">Coupon Code <small className="text-danger">*</small></label>
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

                                                <div className="col-md-6">
                                                    <div className="mb-4">
                                                        <label htmlFor="discount_percentage" className="form-label">Discount Percentage <small className="text-danger">*</small></label>
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

                                                {/* Start Date and End Date in the second row */}
                                                <div className="col-md-6">
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

                                                <div className="col-md-6">
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

                                                <div className="col-md-12 text-center pt-4 mt-2">
                                                    <button type="submit" className="btn custom_btn btn_yellow w-auto" disabled={!isValid}>Submit</button>
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
        </>
    );
};

export default EditCoupon;
