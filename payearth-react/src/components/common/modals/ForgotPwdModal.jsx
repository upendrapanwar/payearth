import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import { useHistory } from 'react-router-dom';
import PeModal from './PeModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import forgotPwdSchema from '../../../validation-schemas/forgotPwdSchema';

const Modal = (props) => {
    toast.configure();
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgotPwdSchema,
        onSubmit: (values, { resetForm }) => {
            axios.post('user/forgot-password', values).then(response => {
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, {autoClose:3000});
                    resetForm();
                    props.onClick();
                    history.push('/');
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

    return(
        <Fragment>
        <PeModal onClose={props.onClick} onShow={props.onForgotShow}>
        <div>
            <h4 className="h4">Forgot Password</h4>
            <p>Please enter your registered email address</p>
            <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email ID <small className="text-danger">*</small></label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <small className="text-danger">{formik.errors.email}</small>
                    ) : null}
                </div>
                <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!formik.isValid}>Get Verification Link</button>
            </form>
        </div>
        </PeModal>
       </Fragment>
    )
};

function RegisterModal(props) {
    return(
        <Fragment>
            {ReactDom.createPortal(<Modal onClick={props.onForgotHide} onShow={props.onForgotShow}/>, document.getElementById('overlays'))}
        </Fragment>
    )
}
export default RegisterModal;