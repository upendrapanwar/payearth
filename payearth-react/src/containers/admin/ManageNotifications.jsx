import React, { Component, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Header from '../../components/admin/common/Header';
import PageTitle from "../../components/user/common/PageTitle";
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import addCouponSchema from '../../validation-schemas/addCouponSchema';
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
// import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import arrow_back from '../../assets/icons/arrow-back.svg'


const ManageNotifications = () => {
    const [notification, setNotification] = useState([]);
    const [read, setRead] = useState(false);
    const [highlighted, setHighlighted] = useState(null);
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    const loading = useSelector(state => state.global.loading);
    const dispatch = useDispatch();

    // const { loading } = store.getState().global;

    useEffect(() => {
        fetchNotification(authInfo.id);
    }, []
    );

    const fetchNotification = async (userId) => {
        try {
            dispatch(setLoading({ loading: true }));
            await axios
                // .get(`/user/get-notification/${userId}`)
                .get(`front/notifications/${userId}`)
                .then((response) => {
                    const data = response.data.data;
                    // console.log("data", data)
                    setNotification(data);
                })
                .catch((error) => {
                    console.log("Error", error);
                })
                .finally(() => {
                    dispatch(setLoading({ loading: false }));
                });
        } catch (error) {
            console.log("Error", error);
            dispatch(setLoading({ loading: false }));
        }
    };

    const updateReadStatus = (notificationId) => {
        axios.put('front/setNotificationSeen', { notificationId }).then(response => {
            const updatedReadStatus = response.data.data;
            //console.log('updatedReadStatus--', updatedReadStatus)
            setNotification(prevState =>
                prevState.map(notification =>
                    notification._id === notificationId
                        ? { ...notification, isSeen: true }
                        : notification
                )
            );
        });
        fetchNotification(authInfo.id)
    }

    const removeNotification = async (id) => {
        try {
            const url = `/admin/removeNotification/${id}`;
            await axios.delete(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });
            fetchNotification(authInfo.id)
        } catch (error) {
            console.error("Somthing went wrong..", error);
        }
    }

    // console.log("notification", notification)

    return (
        <>
            {loading === true ? <SpinnerLoader /> : ''}
            {/* <Header readStatus={read} /> */}
            <Header />
            <PageTitle title="Notifications" />
            <Helmet><title>{"Admin - Notifications - Pay Earth"}</title></Helmet>
            <section className="inr_wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mt-2 d-flex justify-content-between align-items-center">
                            <div></div>
                            <div>
                                <button
                                    type="button"
                                    className="btn custum_back_btn btn_yellow me-4"
                                    onClick={() => window.history.back()}
                                >
                                    <img src={arrow_back} alt="back" />&nbsp;
                                    Back
                                </button>
                            </div>
                        </div>
                        <div className="col-md-12 ">
                            {Array.isArray(notification) && notification.length > 0 ? (
                                notification.map((notifications, index) => {
                                    // console.log('Notification:', notifications);
                                    return (
                                        <Link
                                            key={index}
                                            // to={
                                            //     notifications.notification.type === 'comment' || notifications.notification.type === 'like'
                                            //         ? `/admin/account?postId=${notifications.notification.postId}`
                                            //         : '#'
                                            // }
                                            // onClick={() => updateReadStatus(notifications.notification._id)}
                                            to={
                                                {
                                                    comment: `/admin/account?postId=${notifications.notification.postId}`,
                                                    like: `/admin/account?postId=${notifications.notification.postId}`,
                                                    chat: `/admin/chat`,
                                                    report: '/admin/community',
                                                    follow: '#',
                                                }[notifications.notification.type] || '#'
                                            }
                                            // onClick={() => updateReadStatus(row.notification._id)}
                                            onClick={(e) => {

                                                if (notifications.notification.type === 'follow') {
                                                    e.preventDefault();
                                                    updateReadStatus(notifications.notification._id);
                                                } else {
                                                    updateReadStatus(notifications.notification._id);
                                                }
                                            }}
                                        >
                                            <div className={`card border border-2 border-info-subtle mb-2 mt-2 ${!notifications.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`} >
                                                <div className="card-header d-flex justify-content-between align-items-center text-primary">
                                                    <span>{notifications.notification.type || "not available"}</span>
                                                    {!notifications.notification.isSeen ? "" : <i className="bi bi-trash fs-3 text-danger"
                                                        // onClick={() => removeNotification(notifications.notification._id)}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            removeNotification(notifications.notification._id);
                                                        }}
                                                    ></i>}
                                                </div>
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h5 className="card-title mb-0">
                                                            {notifications.senderDetails.name || "Special title not defined"}
                                                        </h5>
                                                        <small className="text-muted">{new Date(notifications.notification.createdAt).toLocaleString() || "Just now"}</small>
                                                    </div>
                                                    <p className="card-text">
                                                        {notifications.notification.message || " No message."}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className=" text-center m-5 p-5 ">
                                    <span className="text-uppercase">No notifications available</span>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};


export default ManageNotifications;