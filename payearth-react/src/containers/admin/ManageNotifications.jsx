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

    const notification_column = [
        // {
        //     selector: (row, i) => <>
        //         <Link
        //             to={
        //                 row.notification.type === 'comment' || row.notification.type === 'like'
        //                     ? `/admin-profile?postId=${row.notification.postId}`
        //                     : '#' //  for like and other types of notifications
        //             }
        //             onClick={() => updateReadStatus(row.notification._id)}
        //         >
        //             <div className={`card border border-2 border-info-subtle mb-2 mt-2 ${!row.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`} >
        //                 <div className="card-header d-flex justify-content-between align-items-center text-primary">
        //                     <span>{row.notification.type || "not available"}</span>
        //                 </div>
        //                 <div className="card-body">
        //                     {/* <h5 className="card-title">{notifications.sender.id?.name || "Special title not define"}</h5> */}
        //                     <div className="d-flex justify-content-between">
        //                         <h5 className="card-title mb-0">
        //                             {row.senderDetails.name || "Special title not defined"}
        //                         </h5>
        //                         <small className="text-muted">{new Date(row.notification.createdAt).toLocaleString() || "Just now"}</small>
        //                     </div>
        //                     <p className="card-text">
        //                         {row.notification.message || " No message."}
        //                     </p>
        //                 </div>
        //             </div>
        //         </Link>
        //         {!row.notification.isSeen ? "" : <i className="bi bi-trash fs-3 text-danger"
        //             onClick={() => removeNotification(row.notification._id)}
        //         ></i>}
        //     </>,
        //     sortable: true,
        // },


        {
            selector: (row, i) => {
                if (!row || Object.keys(row).length === 0) {
                    return (
                        <div className="text-center text-muted my-3">
                            <p>No data available</p>
                        </div>
                    );
                }

                return (
                    <>
                        <Link
                            to={
                                row.notification.type === 'comment' || row.notification.type === 'like'
                                    ? `/admin-profile?postId=${row.notification.postId}`
                                    : '#' // for like and other types of notifications
                            }
                            onClick={() => updateReadStatus(row.notification._id)}
                        >
                            <div className={`card border border-2 border-info-subtle mb-2 mt-2 ${!row.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`}>
                                <div className="card-header d-flex justify-content-between align-items-center text-primary">
                                    <span>{row.notification.type || "Not available"}</span>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h5 className="card-title mb-0">
                                            {row.senderDetails?.name || "Special title not defined"}
                                        </h5>
                                        <small className="text-muted">
                                            {new Date(row.notification.createdAt).toLocaleString() || "Just now"}
                                        </small>
                                    </div>
                                    <p className="card-text">
                                        {row.notification.message || "No message."}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        {!row.notification.isSeen ? "" : (
                            <i
                                className="bi bi-trash fs-3 text-danger"
                                onClick={() => removeNotification(row.notification._id)}
                            ></i>
                        )}
                    </>
                );
            },
            sortable: true,
        }
    ]

    console.log("notification", notification)

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
                        <div className="col-md-12 mt-4">
                            {Array.isArray(notification) && notification.length > 0 ? (
                                notification.map((notifications, index) => {
                                    console.log('Notification:', notifications);
                                    return (
                                        <Link
                                            key={index}
                                            to={
                                                notifications.notification.type === 'comment' || notifications.notification.type === 'like'
                                                    ? `/admin-profile?postId=${notifications.notification.postId}`
                                                    : '#'
                                            }
                                            onClick={() => updateReadStatus(notifications.notification._id)}
                                        >
                                            <div className={`card border border-2 border-info-subtle mb-2 mt-2 ${!notifications.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`} >
                                                <div className="card-header d-flex justify-content-between align-items-center text-primary">
                                                    <span>{notifications.notification.type || "not available"}</span>
                                                    {!notifications.notification.isSeen ? "" : <i className="bi bi-trash fs-3 text-danger"
                                                        onClick={() => removeNotification(notifications.notification._id)}
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
                                <div className="alert alert-info" role="alert">
                                    {notification.message}
                                </div>
                            )}

                            {/* NOTIFICATION */}
                            {/* <div className="cart_list">
                                <div
                                    className="tab-pane fade show active"
                                    id="nav-draft-post"
                                    role="tabpanel"
                                    aria-labelledby="nav-draft-post-tab"
                                >                   
                                    
                                    <div className="notification_wapper col-md-12">
                                        <DataTableExtensions
                                            columns={notification_column}
                                            data={notification}
                                        >
                                            <DataTable
                                                pagination
                                                highlightOnHover
                                                noHeader
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                paginationPerPage={6}
                                                paginationRowsPerPageOptions={[6, 10, 15, 20]}
                                            />
                                        </DataTableExtensions>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};


export default ManageNotifications;