import React, { Fragment, useState } from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom';
import invisibleIcon from './../../../assets/icons/invisible-icon.svg';
import visibleIcon from './../../../assets/icons/eye-icon.svg';
import PeModal from './PeModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import userRegistrationSchema from './../../../validation-schemas/userRegistrationSchema';
import GLogin from './../login/GLogin';
import FBLogin from './../login/FBLogin';

const Modal = (props) => {
    toast.configure();
    const [seePassword, setSeePassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            purchase_type: 'retail'
        },
        validationSchema: userRegistrationSchema,
        onSubmit: (values, { resetForm }) => {
            axios.post('user/signup', values).then(response => {
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, {autoClose:3000});
                    resetForm();
                    props.onClick();
                    props.onShow();
                } else {
                    toast.error(response.data.message, {autoClose:3000});
                }
            }).catch(error => {
                toast.dismiss();
                if (error.response) {
                    toast.error(error.response.data.message, {autoClose:3000});
                }
            });
        }
    });

    const handlePassword = () => {
        if (seePassword) {
            setSeePassword(false);
        } else {
            setSeePassword(true);
        }
    }

    return(
        <Fragment>
        <PeModal onClose={props.onClick} onShow={props.onregisterShow}>
        <div className="regiter_form">
            <h4 className="h4">Buyer register</h4>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name <small className="text-danger">*</small></label>
                    <input type="text" className="form-control" id="name" name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <small className="text-danger">{formik.errors.name}</small>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email ID <small className="text-danger">*</small></label>
                    <input type="email" className="form-control" id="email" name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <small className="text-danger">{formik.errors.email}</small>
                    ) : null}
                </div>
                <div className="pwd_wrapper mb-3">
                    <label htmlFor="password" className="form-label">Password <small className="text-danger">*</small></label>
                    {seePassword ?
                        <input type="text" className="form-control" id="password" name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        /> :
                        <input type="password" className="form-control" id="password" name="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                        />
                    }

                    {seePassword ?
                        <img src={visibleIcon} alt="eye-icon" onClick={handlePassword}/> :
                        <img src={invisibleIcon} alt="invisible-icon" onClick={handlePassword}/>
                    }

                    {formik.touched.password && formik.errors.password ? (
                        <small className="text-danger">{formik.errors.password}</small>
                    ) : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Want to purchase in?</label>
                    <div className="radio_wrapper">
                        <label className="radio-container">Retail
                            <input type="radio" name="purchase_type" checked={formik.values.purchase_type === "retail"}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value="retail"
                            />
                            <span className="radio-checkmark"></span>
                        </label>
                        <label className="radio-container">Wholesale
                            <input type="radio" name="purchase_type" checked={formik.values.purchase_type === "wholesale"}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value="wholesale"
                            />
                            <span className="radio-checkmark"></span>
                        </label>
                    </div>
                </div>
                <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!formik.isValid}>Register</button>
            </form>
            <div className="social_box d-block">
                <p><span>Or</span> Register with</p>
                <div>
                    <GLogin closeModal={props.onClick} role="user" />
                    <FBLogin closeModal={props.onClick} role="user" />
                </div>
                <p>Already a customer ? <Link to="#" className="view_more text-capitalize" onClick={props.onShow}>Login</Link></p>
            </div>
        </div>
        </PeModal>
       </Fragment>
    )
};

function RegisterModal(props) {
    return(
        <Fragment>
            {ReactDom.createPortal(<Modal onClick={props.onregisterHide} onShow={props.onloginShow}/>, document.getElementById('overlays'))}
        </Fragment>
    )
}
export default RegisterModal;