import React, { Fragment, useState } from 'react';
import ReactDom from 'react-dom';
import { Link, useHistory } from 'react-router-dom';
import invisibleIcon from './../../../assets/icons/invisible-icon.svg';
import visibleIcon from './../../../assets/icons/eye-icon.svg';
import PeModal from './PeModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import userSchema from './../../../validation-schemas/userLoginSchema';
import { useDispatch } from 'react-redux';
import { setLoginStatus, setUserInfo, setAuthInfo } from '../../../store/reducers/auth-reducer';
import GLogin from './../login/GLogin';
import FBLogin from './../login/FBLogin';
import { setSelectedWishItems } from './../../../store/reducers/wishlist-reducer';

const Modal = (props) => {
    toast.configure();
    const [seePassword, setSeePassword] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: userSchema,
        onSubmit: (values, { resetForm }) => {
            axios.post('user/login', values).then(response => {
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, {autoClose:3000});

                    let authInfo = {
                        expTime: response.data.data.expTime,
                        id: response.data.data['_id'],
                        token: response.data.data.token,
                    };
                    let userInfo = {
                        name: response.data.data.name,
                        email: response.data.data.email,
                        purchase_type: response.data.data.purchase_type,
                        role: response.data.data.role,
                        community:response.data.data.community,
                        imgUrl:response.data.data.image_url
                    };
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    localStorage.setItem('authInfo', JSON.stringify(authInfo));
                    localStorage.setItem('isLoggedIn', 1);
                    dispatch(setLoginStatus({isLoggedIn: true}));
                    dispatch(setAuthInfo({authInfo}));
                    dispatch(setUserInfo({userInfo}));
                    resetForm();
                    props.onClick();
                    getWishList(response.data.data['_id'], response.data.data.token);
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

    const handlePassword = () => {
        if (seePassword) {
            setSeePassword(false);
        } else {
            setSeePassword(true);
        }
    }

    const getWishList = async(userId, token) => {
        let reqBody = {
            count: {start: 0, limit: 5}
        };
        let selectedWishItems = [];

        axios.post('user/wishlist/' + userId, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.data.status) {
                if (response.data.data.wishlist.length > 0) {
                    response.data.data.wishlist.forEach(item => {
                        selectedWishItems.push(item.productId.id);
                    });
                    localStorage.setItem('selectedWishItems', JSON.stringify(selectedWishItems));
                    dispatch(setSelectedWishItems({selectedWishItems}));
                }
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        });
    }

    return(
        <Fragment>
            <PeModal onClose={props.onClick} onShow={props.onregisterShow} showForgotModal={props.onForgotShow}>
                <div className="login_form">
                    <h4 className="h4">Buyer Login</h4>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email ID <small className="text-danger">*</small></label>
                            <input type="email" name="email" className="form-control" id="email"
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
                        <div className="mb-3 form-check text-end">
                            <Link to="#" onClick={props.onForgotShow}>Forgot Password?</Link>
                        </div>
                        <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!formik.isValid}>Login</button>
                    </form>
                    <div className="social_box d-block">
                        <p><span>Or</span> Login with</p>
                        <div>
                            <GLogin closeModal={props.onClick} role="user" />
                            <FBLogin closeModal={props.onClick} role="user" />
                        </div>
                        <p>Not a registered customer? <Link to="#" className="view_more text-capitalize" onClick={props.onShow}>Signup</Link></p>
                    </div>
                </div>
            </PeModal>
        </Fragment>
    )
};

function LoginModal(props) {
    return(
        <Fragment>
            {ReactDom.createPortal(<Modal onClick={props.onloginHide} onShow={props.onregisterShow} onForgotShow={props.onForgotShow}/>, document.getElementById('overlays'))}
        </Fragment>
    )
}

export default LoginModal;