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
                    console.log("data", data)
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
    }

    return (
        <>
            {loading === true ? <SpinnerLoader /> : ''}
            {/* <Header readStatus={read} /> */}
            <Header />
            <PageTitle title="Notifications" />
            <Helmet><title>{"Notification - Pay Earth"}</title></Helmet>
            <section className="inr_wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {Array.isArray(notification) && notification.length > 0 ? (
                                notification.map((notifications, index) => {
                                    // console.log('Notification:', notifications); 
                                    return (
                                        <Link
                                            key={index}
                                            to={
                                                notifications.notification.type === 'comment' || notifications.notification.type === 'like'
                                                    ? `/admin-profile?postId=${notifications.notification.postId}`
                                                    : '#' //  for like and other types of notifications
                                            }
                                            onClick={() => updateReadStatus(notifications.notification._id)}
                                        >
                                            <div className={`card border border-2 border-info-subtle mb-2 mt-2 ${!notifications.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`} >
                                                <div className="card-header  text-primary">
                                                    {notifications.notification.type || "not available"}
                                                </div>
                                                <div className="card-body">
                                                    {/* <h5 className="card-title">{notifications.sender.id?.name || "Special title not define"}</h5> */}
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
                                <div className="alert alert-info" role="alert">
                                    Notification not available
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